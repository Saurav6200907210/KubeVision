#!/usr/bin/env node
import { Command } from 'commander';
import axios from 'axios';
import { ConnectorAgent } from './agent';
import { loadConfig, saveConfig, clearConfig } from './config';

const program = new Command();

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
      const response = await axios.post(`${options.url}/api/connector/connect`, { code });
      
      const { token, sessionId } = response.data;
      
      saveConfig({
        backendUrl: options.url,
        token,
        sessionId
      });
      
      console.log('Successfully paired! You can now run `kubevision-connector start`.');
    } catch (err: any) {
      console.error('Failed to pair:', err.response?.data?.error || err.message);
    }
  });

program
  .command('start')
  .description('Start the local connector agent')
  .action(() => {
    const config = loadConfig();
    if (!config) {
      console.error('Connector is not paired. Please run `kubevision-connector pair <code>` first.');
      process.exit(1);
    }

    // Convert http(s):// to ws(s):// for websocket
    const wsUrl = config.backendUrl.replace(/^http/, 'ws');
    
    console.log(`Starting agent for session ${config.sessionId}...`);
    const agent = new ConnectorAgent(wsUrl, config.token);
    agent.start();
  });

program
  .command('logout')
  .description('Clear paired credentials')
  .action(() => {
    clearConfig();
    console.log('Logged out. Credentials cleared.');
  });

program.parse();
