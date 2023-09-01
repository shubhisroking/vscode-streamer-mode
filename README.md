# VSCode Streamer Mode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/shubhisroking.vscode-streamer-mode?color=blue&label=Version&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=shubhisroking.vscode-streamer-mode)
[![Install](https://img.shields.io/badge/Install-VSCode%20Streamer%20Mode-blue)](vscode:extension/shubhisroking.vscode-streamer-mode)

This extension adds a "Streamer Mode" feature to Visual Studio Code that helps prevent accidental sharing of sensitive information while streaming or recording your screen.

## Features

- Toggles streamer mode on and off with a single click
- Blocks opening of sensitive files while streamer mode is enabled
- Shows a warning message when attempting to open a sensitive file
- Allows opening of sensitive files with a confirmation prompt

## Usage

To enable streamer mode, click on the "Streamer Mode: Disabled" status bar item. This will toggle streamer mode on and off.

When streamer mode is enabled, attempting to open a sensitive file will show a warning message. You can choose to open the file anyway with a confirmation prompt.

## Configuration

This extension provides the following configuration options:

- `vscode-streamer-mode.enabled`: Whether streamer mode is enabled or not. Default is `false`.
- `vscode-streamer-mode.sensitiveFileExtensions`: An array of file extensions that are considered sensitive. Default is `["env", "local", "development", "staging", "production", "test", "pem", "key", "cer", "crt", "p12", "pfx"]`.

## License

This extension is licensed under the [MIT License](LICENSE).
