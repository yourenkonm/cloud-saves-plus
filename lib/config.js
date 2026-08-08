const DEFAULT_BRANCH = 'main';

const DEFAULT_CONFIG = {
    repo_url: '',
    branch: DEFAULT_BRANCH,
    username: '',
    github_token: '',
    display_name: '',
    is_authorized: false,
    last_save: null,
    current_save: null,
    has_temp_stash: false,
    autoSaveEnabled: false,
    autoSaveInterval: 30,
    autoSaveTargetTag: '',
    autoSaveMode: 'overwrite',
    autoSaveRetentionCount: 10,
};

function normalizeConfig(config) {
    return {
        ...DEFAULT_CONFIG,
        ...config,
        branch: config.branch || DEFAULT_BRANCH,
        autoSaveMode: config.autoSaveMode === 'rotate' ? 'rotate' : 'overwrite',
        autoSaveRetentionCount: Number.isInteger(config.autoSaveRetentionCount) && config.autoSaveRetentionCount > 0
            ? config.autoSaveRetentionCount
            : DEFAULT_CONFIG.autoSaveRetentionCount,
    };
}

async function readConfigFile(configPath, fileSystem) {
    try {
        return normalizeConfig(JSON.parse(await fileSystem.readFile(configPath, 'utf8')));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            error.message = `Unable to read configuration: ${error.message}`;
            throw error;
        }

        await fileSystem.writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
        return { ...DEFAULT_CONFIG };
    }
}

module.exports = { DEFAULT_BRANCH, DEFAULT_CONFIG, normalizeConfig, readConfigFile };
