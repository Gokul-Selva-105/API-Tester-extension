import { useEffect } from 'react';
import { useStore, RequestMethod } from '../lib/store';
import { api } from '../lib/api';
import { Play, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function RequestPanel() {
    const { activeRequest, setActiveRequest, setLoading, loading, collections, setCollections } = useStore();

    const handleSend = () => {
        setLoading(true);
        api.sendRequest(activeRequest);
    };

    const handleSave = () => {
        // For simplicity, verify there is at least one collection, if not create 'Default'
        let newCollections = [...collections];
        if (newCollections.length === 0) {
            newCollections.push({
                id: crypto.randomUUID(),
                name: 'Default Collection',
                folders: [],
                requests: []
            });
        }

        // Save to first collection for now
        // In real app, show modal to select collection
        const targetCollection = newCollections[0];
        targetCollection.requests.push({
            ...activeRequest,
            id: crypto.randomUUID(),
            name: activeRequest.name || 'New Request'
        });

        setCollections(newCollections);
        api.saveCollections(newCollections);
        api.showInfo('Request saved to ' + targetCollection.name);
    };

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveRequest({ method: e.target.value as RequestMethod });
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActiveRequest({ url: e.target.value });
    };

    // Listen for trigger from extension
    useEffect(() => {
        const messageListener = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'triggerRequest') {
                handleSend();
            }
        };
        window.addEventListener('message', messageListener);
        return () => window.removeEventListener('message', messageListener);
    }, [activeRequest]);

    return (
        <div className="p-3 border-b border-border flex items-center gap-2 bg-background">
            <div className="flex items-center gap-1 min-w-[100px]">
                <select
                    value={activeRequest.method}
                    onChange={handleMethodChange}
                    className={cn(
                        "bg-secondary text-secondary-foreground border border-input rounded px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase",
                        activeRequest.method === 'GET' && "text-green-500",
                        activeRequest.method === 'POST' && "text-blue-500",
                        activeRequest.method === 'DELETE' && "text-red-500",
                        activeRequest.method === 'PUT' && "text-orange-500",
                        activeRequest.method === 'PATCH' && "text-yellow-500"
                    )}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                    <option value="OPTIONS">OPTIONS</option>
                </select>
            </div>

            <div className="flex-1 relative">
                <input
                    type="text"
                    value={activeRequest.url}
                    onChange={handleUrlChange}
                    placeholder="https://api.example.com/v1/endpoint"
                    className="w-full bg-secondary/50 border border-input rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground font-mono"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                />
            </div>

            <button
                onClick={handleSend}
                disabled={loading || !activeRequest.url}
                className={cn(
                    "flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    loading && "opacity-70"
                )}
            >
                {loading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                ) : (
                    <Play size={16} fill="currentColor" />
                )}
                Send
            </button>

            <button
                onClick={handleSave}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Save Request"
            >
                <Save size={18} />
            </button>
        </div>
    );
}
