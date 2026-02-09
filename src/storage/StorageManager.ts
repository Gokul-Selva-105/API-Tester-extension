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

    constructor(private readonly context: vscode.ExtensionContext) { }

    public getCollections(): Collection[] {
        return this.context.globalState.get<Collection[]>(StorageManager.KEY_COLLECTIONS, []);
    }

    public async saveCollections(collections: Collection[]) {
        await this.context.globalState.update(StorageManager.KEY_COLLECTIONS, collections);
    }

    public getHistory(): any[] {
        return this.context.globalState.get<any[]>(StorageManager.KEY_HISTORY, []);
    }

    public async addToHistory(request: any) {
        let history = this.getHistory();

        // Remove duplicates (same method and url) to keep history clean? 
        // Or just straightforward add? Let's just add but limit strictly.
        // Actually, preventing exact duplicates (method + url) at the top is good UX.
        if (history.length > 0) {
            const top = history[0];
            if (top.method === request.method && top.url === request.url) {
                // Determine if body changed? For now, just duplicate is fine if it's different timestamp
                // But user complained about "old history", maybe clutter.
            }
        }

        history.unshift({ ...request, timestamp: Date.now() });

        // Limit to 20 as per user feedback "more than 15 things showing"
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public async saveHistory(history: any[]) {
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public async clearHistory() {
        // Explicitly update to empty array
        await this.context.globalState.update(StorageManager.KEY_HISTORY, []);
    }

    public getEnvironments(): any[] {
        return this.context.globalState.get<any[]>(StorageManager.KEY_ENVIRONMENTS, []);
    }

    public async saveEnvironments(envs: any[]) {
        await this.context.globalState.update(StorageManager.KEY_ENVIRONMENTS, envs);
    }
}
