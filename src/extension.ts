import * as vscode from 'vscode';
import { JarvisPanel } from './JarvisPanel';

import { StorageManager } from './storage/StorageManager';

export function activate(context: vscode.ExtensionContext) {
    const storageManager = new StorageManager(context);

    // Register the custom sidebar view
    const provider = new JarvisPanel(context.extensionUri, storageManager);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(JarvisPanel.viewType, provider)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('jarvis-api-client.openClient', () => {
            vscode.commands.executeCommand('workbench.view.extension.jarvis-api-client');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jarvis-api-client.sendRequest', () => {
            if (provider.view) {
                provider.view.webview.postMessage({ type: 'triggerRequest' });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jarvis-api-client.newRequest', () => {
            if (provider.view) {
                provider.view.webview.postMessage({ type: 'newRequest' });
            }
        })
    );
}

export function deactivate() { }
