import { useState } from 'react';
import { useStore } from '../lib/store';
import { Folder, History, Plus, Check, X, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export function Sidebar() {
    const { history, collections, replaceActiveRequest, setHistory, setCollections } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    const loadRequest = (req: any) => {
        // Use replaceActiveRequest to ensure we don't merge with previous state
        replaceActiveRequest(JSON.parse(JSON.stringify(req)));
    };

    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) {
            setIsCreating(false);
            return;
        }

        const newCollections = [...collections, {
            id: crypto.randomUUID(),
            name: newCollectionName,
            folders: [],
            requests: []
        }];

        api.saveCollections(newCollections);
        // Optimistic update
        setCollections(newCollections);

        setNewCollectionName('');
        setIsCreating(false);
    };

    const handleDeleteCollection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Temporarily removed confirm to debug
        const newCollections = collections.filter(c => c.id !== id);
        api.saveCollections(newCollections);
        setCollections(newCollections);
        api.showInfo('Collection deleted');
    };

    const handleDeleteRequestFromCollection = (colId: string, reqId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newCollections = collections.map(c => {
            if (c.id === colId) {
                return {
                    ...c,
                    requests: c.requests.filter((r: any) => r.id !== reqId)
                };
            }
            return c;
        });
        api.saveCollections(newCollections);
        setCollections(newCollections);
        api.showInfo('Request deleted from collection');
    };

    const handleDeleteHistory = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newHistory = [...history];
        newHistory.splice(index, 1);
        api.saveHistory(newHistory);
        setHistory(newHistory);
        // api.showInfo('History item deleted');
    };

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Remove confirm for debug
        api.clearHistory();
        setHistory([]);
        api.showInfo('History cleared');
    };

    return (
        <div className="h-full flex flex-col text-sm">
            <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold">Collections</span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                        title="New Collection"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-2 space-y-4">
                {/* Creating New Collection UI */}
                {isCreating && (
                    <div className="px-2 py-1 mb-2">
                        <div className="flex items-center gap-1 bg-secondary/50 rounded p-1 border border-primary">
                            <input
                                autoFocus
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="Collection Name"
                                className="flex-1 bg-transparent border-none focus:outline-none text-xs px-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateCollection();
                                    if (e.key === 'Escape') setIsCreating(false);
                                }}
                            />
                            <button onClick={handleCreateCollection} className="text-green-500 hover:text-green-400 p-0.5"><Check size={14} /></button>
                            <button onClick={() => setIsCreating(false)} className="text-red-500 hover:text-red-400 p-0.5"><X size={14} /></button>
                        </div>
                    </div>
                )}

                {/* Collections Section */}
                <div>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        My Collections
                    </div>
                    {collections.length === 0 && !isCreating && (
                        <div className="px-4 text-xs text-muted-foreground italic">No collections</div>
                    )}
                    {collections.map((col) => (
                        <div key={col.id} className="mb-2">
                            <div className="px-2 py-1.5 flex items-center gap-2 hover:bg-secondary/50 rounded cursor-pointer group">
                                <Folder size={16} className="text-blue-400" />
                                <span className="flex-1 truncate font-medium">{col.name}</span>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteCollection(col.id, e)}
                                        className="p-1 hover:text-red-500 text-muted-foreground"
                                        title="Delete Collection"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            {/* Render requests inside collection */}
                            <div className="pl-4 space-y-1 mt-1 border-l-2 border-border ml-2">
                                {col.requests?.length === 0 && (
                                    <div className="text-[10px] text-muted-foreground px-2">Empty</div>
                                )}
                                {col.requests?.map((req: any) => (
                                    <div
                                        key={req.id}
                                        onClick={() => loadRequest(req)}
                                        className="px-2 py-1.5 flex items-center gap-2 hover:bg-secondary/50 rounded cursor-pointer group justify-between"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className={`w-8 font-bold text-[10px] text-right ${getMethodColor(req.method)}`}>{req.method}</span>
                                            <span className="truncate text-xs text-foreground/80">{req.name || req.url}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteRequestFromCollection(col.id, req.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 text-muted-foreground transition-opacity"
                                            title="Delete Request"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Section */}
                <div>
                    <div className="px-2 py-1.5 flex items-center justify-between gap-2 font-semibold text-muted-foreground mb-1 mt-4 border-t border-border pt-4 group">
                        <div className="flex items-center gap-2">
                            <History size={16} />
                            <span>History</span>
                        </div>
                        {history.length > 0 && (
                            <button
                                type="button"
                                onClick={clearHistory}
                                className="text-[10px] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="space-y-1">
                        {history.length === 0 && (
                            <div className="px-4 text-xs text-muted-foreground italic">No history yet</div>
                        )}
                        {history.map((req, i) => (
                            <div
                                key={i}
                                onClick={() => loadRequest(req)}
                                className="px-2 py-1.5 flex items-center gap-2 hover:bg-secondary/50 rounded cursor-pointer group text-xs justify-between"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className={`w-8 font-bold text-[10px] text-right ${getMethodColor(req.method)}`}>{req.method}</span>
                                    <span className="truncate text-foreground/80">{req.url || 'No URL'}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleDeleteHistory(i, e)}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 text-muted-foreground transition-opacity"
                                    title="Remove from History"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getMethodColor(method: string) {
    switch (method) {
        case 'GET': return 'text-green-500';
        case 'POST': return 'text-blue-500';
        case 'DELETE': return 'text-red-500';
        case 'PUT': return 'text-orange-500';
        case 'PATCH': return 'text-yellow-500';
        default: return 'text-gray-500';
    }
}
