import fs from 'fs';
import path from 'path';
import os from 'os';

interface ConnectorConfig {
  backendUrl: string;
  token: string;
  sessionId: string;
}

const CONFIG_PATH = path.join(os.homedir(), '.kubevision-connector.json');

export function loadConfig(): ConnectorConfig | null {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data) as ConnectorConfig;
    } catch (e) {
      console.error('Error reading config file');
      return null;
    }
  }
  return null;
}

export function saveConfig(config: ConnectorConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function clearConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
}
