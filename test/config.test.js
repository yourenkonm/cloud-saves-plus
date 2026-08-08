const assert = require('node:assert/strict');
const fs = require('node:fs').promises;
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { DEFAULT_CONFIG, readConfigFile } = require('../lib/config');

test('creates defaults only when the config file is missing', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cloud-saves-config-'));
    const configPath = path.join(directory, 'config.json');

    const config = await readConfigFile(configPath, fs);
    assert.deepEqual(config, DEFAULT_CONFIG);
    assert.deepEqual(JSON.parse(await fs.readFile(configPath, 'utf8')), DEFAULT_CONFIG);

    await fs.rm(directory, { recursive: true, force: true });
});

test('does not overwrite an invalid configuration file', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cloud-saves-config-'));
    const configPath = path.join(directory, 'config.json');
    const invalidContent = '{not valid json';
    await fs.writeFile(configPath, invalidContent);

    await assert.rejects(() => readConfigFile(configPath, fs), /Unable to read configuration/);
    assert.equal(await fs.readFile(configPath, 'utf8'), invalidContent);

    await fs.rm(directory, { recursive: true, force: true });
});
