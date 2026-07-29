#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const agent_1 = require("./agent");
const config_1 = require("./config");
const program = new commander_1.Command();
program
    .name('kubevision-connector')
    .description('Local Kubernetes Connector for KubeVision')
    .version('1.0.0');
const DEFAULT_BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
program
    .command('pair')
    .description('Pair this device with your KubeVision dashboard')
    .argument('<code>', 'The 6-digit pairing code from the dashboard')
    .option('-u, --url <url>', 'Backend URL', DEFAULT_BACKEND_URL)
    .action(async (code, options) => {
    try {
        console.log(`Pairing with backend at ${options.url}...`);
        const response = await axios_1.default.post(`${options.url}/api/connector/connect`, { code });
        const { token, sessionId } = response.data;
        (0, config_1.saveConfig)({
            backendUrl: options.url,
            token,
            sessionId
        });
        console.log('Successfully paired! You can now run `kubevision-connector start`.');
    }
    catch (err) {
        console.error('Failed to pair:', err.response?.data?.error || err.message);
    }
});
program
    .command('start')
    .description('Start the local connector agent')
    .action(() => {
    const config = (0, config_1.loadConfig)();
    if (!config) {
        console.error('Connector is not paired. Please run `kubevision-connector pair <code>` first.');
        process.exit(1);
    }
    // Convert http(s):// to ws(s):// for websocket
    const wsUrl = config.backendUrl.replace(/^http/, 'ws');
    console.log(`Starting agent for session ${config.sessionId}...`);
    const agent = new agent_1.ConnectorAgent(wsUrl, config.token);
    agent.start();
});
program
    .command('logout')
    .description('Clear paired credentials')
    .action(() => {
    (0, config_1.clearConfig)();
    console.log('Logged out. Credentials cleared.');
});
program.parse();
