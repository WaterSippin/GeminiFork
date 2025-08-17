import fs from 'fs';
import path from 'path';

const homeDir = process.env.HOME || process.env.USERPROFILE;
const configDir = path.join(homeDir, '.jules-ai');
const configFile = path.join(configDir, 'config.json');

const defaultConfig = {
  provider: 'openai',
  model: '',
  apiKey: process.env.OPENAI_API_KEY || '',
  temperature: 0.7,
  maxTokens: 1024,
  streaming: true,
  terseMode: true,
};

function ensureConfigDirExists() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

export function getConfig() {
  ensureConfigDirExists();
  if (fs.existsSync(configFile)) {
    try {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      return { ...defaultConfig, ...config };
    } catch (error) {
      console.error('Error reading config file:', error);
      return defaultConfig;
    }
  }
  return defaultConfig;
}

export function setConfig(newConfig) {
  ensureConfigDirExists();
  const currentConfig = getConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  fs.writeFileSync(configFile, JSON.stringify(updatedConfig, null, 2));
  return updatedConfig;
}
