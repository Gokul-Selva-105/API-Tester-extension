import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function ResponsePanel() {
    const { response, loading } = useStore();
    const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!response?.body) return;
        navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="text-xs">Sending request...</span>
            </div>
        );
    }

    if (!response) {
        return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Response will appear here</div>;
    }

    const isSuccess = response.status >= 200 && response.status < 300;
    const isError = response.status >= 400;

    return (
        <div className="h-full flex flex-col overflow-hidden bg-background">
            <div className="border-b border-border bg-secondary/20 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <span className={cn(
                            "text-sm font-bold",
                            isSuccess && "text-green-500",
                            isError && "text-red-500",
                            !isSuccess && !isError && "text-yellow-500"
                        )}>
                            {response.status} {response.statusText}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Time:</span>
                        <span className="text-xs font-mono">{response.time}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Size:</span>
                        <span className="text-xs font-mono">{response.size} B</span>
                    </div>
                </div>

                <div className="flex items-center">
                    <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('body')}
                    className={cn("px-4 py-1 text-xs font-medium border-b-2 transition-colors", activeTab === 'body' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                    Body
                </button>
                <button
                    onClick={() => setActiveTab('headers')}
                    className={cn("px-4 py-1 text-xs font-medium border-b-2 transition-colors", activeTab === 'headers' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                    Headers
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {activeTab === 'body' && (
                    <pre className="whitespace-pre-wrap break-words text-xs">
                        {typeof response.body === 'object'
                            ? JSON.stringify(response.body, null, 2)
                            : response.body}
                    </pre>
                )}
                {activeTab === 'headers' && (
                    <div className="space-y-1">
                        {Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-[1fr_2fr] gap-4 text-xs">
                                <span className="font-semibold text-muted-foreground">{key}:</span>
                                <span className="break-all">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
