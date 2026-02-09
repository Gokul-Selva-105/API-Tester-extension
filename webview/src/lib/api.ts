import { vscode } from "./vscode";
import { ApiRequest } from "./store";

export const api = {
    sendRequest: (request: ApiRequest) => {
        vscode.postMessage({
            type: 'executeRequest',
            value: request
        });
    },

    saveCollections: (collections: any[]) => {
        vscode.postMessage({
            type: 'saveCollections',
            value: collections
        });
    },

    getCollections: () => {
        vscode.postMessage({ type: 'getCollections' });
    },

    saveHistory: (history: any[]) => {
        vscode.postMessage({
            type: 'saveHistory',
            value: history
        });
    },

    getHistory: () => {
        vscode.postMessage({ type: 'getHistory' });
    },

    showInfo: (message: string) => {
        vscode.postMessage({
            type: 'onInfo',
            value: message
        });
    },

    showError: (message: string) => {
        vscode.postMessage({
            type: 'onError',
            value: message
        });
    }
};
