import * as vscode from 'vscode';

export interface Collection {
    id: string;
    name: string;
    folders: Folder[];
    requests: any[]; // Request objects
}

export interface Folder {
    id: string;
    name: string;
    requests: any[];
}

export class StorageManager {
    private static readonly KEY_COLLECTIONS = 'jarvis-collections';
    private static readonly KEY_HISTORY = 'jarvis-history';
    private static readonly KEY_ENVIRONMENTS = 'jarvis-environments';

    private _collections: Collection[] = [];
    private _history: any[] = [];
    private _environments: any[] = [];

    constructor(private readonly context: vscode.ExtensionContext) {
        // Initialize cache
        this._collections = this.context.globalState.get<Collection[]>(StorageManager.KEY_COLLECTIONS, []);
        this._history = this.context.globalState.get<any[]>(StorageManager.KEY_HISTORY, []);
        this._environments = this.context.globalState.get<any[]>(StorageManager.KEY_ENVIRONMENTS, []);
    }

    public getCollections(): Collection[] {
        return this._collections;
    }

    public async saveCollections(collections: Collection[]) {
        this._collections = collections;
        await this.context.globalState.update(StorageManager.KEY_COLLECTIONS, collections);
    }

    public getHistory(): any[] {
        return this._history;
    }

    public async addToHistory(request: any) {
        // Use cache
        let history = [...this._history];

        // Remove duplicates
        if (history.length > 0) {
            const top = history[0];
            if (top.method === request.method && top.url === request.url) {
                history.shift();
            }
        }

        history.unshift({ ...request, timestamp: Date.now() });

        // Limit to 20
        if (history.length > 20) {
            history = history.slice(0, 20);
        }

        this._history = history;
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public async saveHistory(history: any[]) {
        this._history = history;
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public async clearHistory() {
        this._history = [];
        await this.context.globalState.update(StorageManager.KEY_HISTORY, []);
    }

    public getEnvironments(): any[] {
        return this._environments;
    }

    public async saveEnvironments(envs: any[]) {
        this._environments = envs;
        await this.context.globalState.update(StorageManager.KEY_ENVIRONMENTS, envs);
    }
}
