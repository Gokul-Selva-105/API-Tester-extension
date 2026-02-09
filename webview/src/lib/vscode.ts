import { ApiResponse } from "./store";

// Wrapper for VS Code Webview API
class VSCodeAPI {
    private vscode: any;

    constructor() {
        if (typeof window !== 'undefined' && (window as any).acquireVsCodeApi) {
            this.vscode = (window as any).acquireVsCodeApi();
        }
    }

    public postMessage(message: any) {
        if (this.vscode) {
            this.vscode.postMessage(message);
        } else {
            console.log("VS Code API not available:", message);
        }
    }

    public getState(): any {
        if (this.vscode) {
            return this.vscode.getState();
        }
        return null;
    }

    public setState(state: any) {
        if (this.vscode) {
            this.vscode.setState(state);
        }
    }
}

export const vscode = new VSCodeAPI();

// Global listener for messages from extension
export const setupMessageListener = (callbacks: {
    onResponse?: (response: ApiResponse) => void;
    onInfo?: (message: string) => void;
    onError?: (message: string) => void;
    onTriggerRequest?: () => void;
    onNewRequest?: () => void;
}) => {
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'response':
                if (callbacks.onResponse) callbacks.onResponse(message.value);
                break;
            case 'triggerRequest':
                if (callbacks.onTriggerRequest) callbacks.onTriggerRequest();
                break;
            case 'newRequest':
                if (callbacks.onNewRequest) callbacks.onNewRequest();
                break;
        }
    });
};
