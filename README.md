# Jarvis API Client

A powerful API testing tool for VS Code, inspired by Thunder Client and Postman, featuring a modern Next.js-style UI.

## Features

- 🚀 **Lightweight & Fast**: Built directly into VS Code.
- 🎨 **Modern UI**: Clean, dark-mode first design inspired by Vercel/Next.js.
- ⚡ **HTTP Client**: Support for GET, POST, PUT, DELETE, PATCH, OPTIONS.
- 🔐 **Authentication**: Basic Auth, Bearer Token, API Key.
- 📂 **Collections**: Organize requests into collections and folders.
- 🌍 **Environments**: Manage variables for different environments (Dev, Prod, etc.).
- 📜 **History**: Auto-saves your request history.
- 💻 **Offline Works**: No account required, data stored locally.

## Installation

### Option 1: Install VSIX (Recommended for Usage)
1. Download the `jarvis-api-client-1.0.0.vsix` file from the project root.
2. Open VS Code Extensions view (`Ctrl+Shift+X`).
3. Click the `...` (Views and More Actions) menu at the top right of the sidebar.
4. Select `Install from VSIX...`.
5. Browse and select the `jarvis-api-client-1.0.0.vsix` file.

### Option 2: Run from Source (Recommended for Development)
1. Open the project folder in VS Code.
2. Run `npm install` to install extension dependencies.
3. Run `cd webview && npm install` to install UI dependencies.
4. Press `F5` to start debugging. This opens a new VS Code window with the extension loaded.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run `Jarvis API Client: Open API Client`.
3. Use the sidebar to manage collections or start making requests.

## Development

1. Clone the repository.
2. Run `npm install` to install extension dependencies.
3. Run `cd webview && npm install` to install UI dependencies.
4. Press `F5` to start debugging.

## Tech Stack

- **Extension**: TypeScript, VS Code API
- **UI**: React, Vite, Tailwind CSS, Zustand
- **Networking**: Axios

## License

MIT
