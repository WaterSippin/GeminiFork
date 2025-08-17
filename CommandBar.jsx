import React, { useState, useEffect } from 'react';
import { getConfig, setConfig } from '../state/configStore.js';
import { PROVIDERS } from '../providers/registry.js';

export function CommandBar() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');
  const [config, setConfigState] = useState(getConfig());

  useEffect(() => {
    const currentConfig = getConfig();
    setConfigState(currentConfig);
    setStatus(`Provider: ${currentConfig.provider}, Model: ${currentConfig.model || 'not set'}`);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(inputValue);
      setInputValue('');
    }
  };

  const processCommand = (command) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const arg = parts[1];

    if (cmd === '/provider') {
      if (PROVIDERS[arg]) {
        setConfig({ provider: arg, model: '' }); // Clear model when changing provider
        const newConfig = getConfig();
        setConfigState(newConfig);
        setStatus(`Provider set to: ${arg}. Model cleared.`);
      } else {
        setStatus(`Error: Unknown provider '${arg}'. Available: ${Object.keys(PROVIDERS).join(', ')}`);
      }
    } else if (cmd === '/model') {
      if (arg) {
        setConfig({ model: arg });
        const newConfig = getConfig();
        setConfigState(newConfig);
        setStatus(`Model set to: ${arg}`);
      } else {
        const currentConfig = getConfig();
        setStatus(`Current - Provider: ${currentConfig.provider}, Model: ${currentConfig.model || 'not set'}`);
      }
    } else {
        setStatus(`Unknown command: ${cmd}`)
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a command, e.g., /provider openrouter"
        style={{ width: '100%' }}
      />
      <div>{status}</div>
      <div>
        Current Configuration: Provider: {config.provider}, Model: {config.model || 'not set'}
      </div>
    </div>
  );
}
