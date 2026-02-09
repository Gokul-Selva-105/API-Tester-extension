import * as vscode from 'vscode';
import { getNonce } from './utils';

import { StorageManager } from './storage/StorageManager';

export class JarvisPanel implements vscode.WebviewViewProvider {
    public static readonly viewType = 'jarvis-api-client.sidebar';
    public view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _storageManager: StorageManager
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'executeRequest': {
                    await this.executeRequest(data.value, webviewView.webview);
                    // Also save to history
                    await this._storageManager.addToHistory(data.value);
                    // Send updated history back
                    this.sendHistory(webviewView.webview);
                    break;
                }
                case 'getCollections': {
                    this.sendCollections(webviewView.webview);
                    break;
                }
                case 'saveCollections': {
                    await this._storageManager.saveCollections(data.value);
                    this.sendCollections(webviewView.webview);
                    break;
                }
                case 'getHistory': {
                    this.sendHistory(webviewView.webview);
                    break;
                }
                case 'saveHistory': {
                    await this._storageManager.saveHistory(data.value);
                    this.sendHistory(webviewView.webview);
                    break;
                }
                case 'onInfo': {
                    if (!data.value) { return; }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case 'onError': {
                    if (!data.value) { return; }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }

    private sendCollections(webview: vscode.Webview) {
        webview.postMessage({
            type: 'collections',
            value: this._storageManager.getCollections()
        });
    }

    private sendHistory(webview: vscode.Webview) {
        webview.postMessage({
            type: 'history',
            value: this._storageManager.getHistory()
        });
    }

    private async executeRequest(request: any, webview: vscode.Webview) {
        const axios = require('axios');
        const start = Date.now();

        try {
            const config: any = {
                method: request.method,
                url: request.url,
                headers: {},
                validateStatus: () => true // Allow any status code
            };

            // Process headers
            if (request.headers) {
                request.headers.forEach((h: any) => {
                    if (h.enabled && h.key) {
                        config.headers[h.key] = h.value;
                    }
                });
            }

            // Process params
            if (request.params) {
                const params = new URLSearchParams();
                request.params.forEach((p: any) => {
                    if (p.enabled && p.key) {
                        params.append(p.key, p.value);
                    }
                });
                config.params = params;
            }

            // Process body
            if (request.body && request.method !== 'GET') {
                if (request.body.type === 'json') {
                    try {
                        config.data = JSON.parse(request.body.content);
                        config.headers['Content-Type'] = 'application/json';
                    } catch (e) {
                        // If invalid JSON, send as text but warn?
                        config.data = request.body.content;
                    }
                } else if (request.body.type === 'form-data') {
                    // Handle form data if needed (might need 'form-data' package for Node)
                    // For now, simple object
                    const formData: any = {};
                    request.body.formData?.forEach((f: any) => {
                        if (f.enabled) formData[f.key] = f.value;
                    });
                    config.data = formData;
                } else {
                    config.data = request.body.content;
                }
            }

            const response = await axios(config);
            const time = Date.now() - start;

            webview.postMessage({
                type: 'response',
                value: {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    body: response.data,
                    time,
                    size: JSON.stringify(response.data).length // Approx size
                }
            });

        } catch (error: any) {
            webview.postMessage({
                type: 'response',
                value: {
                    status: 0,
                    statusText: 'Error',
                    headers: {},
                    body: error.message || 'Unknown Error',
                    time: Date.now() - start,
                    size: 0,
                    error: error.message
                }
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'assets', 'index.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'assets', 'index.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Jarvis API Client</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
