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
        // Add to beginning, limit to 50
        history.unshift({ ...request, timestamp: Date.now() });
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public async saveHistory(history: any[]) {
        await this.context.globalState.update(StorageManager.KEY_HISTORY, history);
    }

    public getEnvironments(): any[] {
        return this.context.globalState.get<any[]>(StorageManager.KEY_ENVIRONMENTS, []);
    }

    public async saveEnvironments(envs: any[]) {
        await this.context.globalState.update(StorageManager.KEY_ENVIRONMENTS, envs);
    }
}
