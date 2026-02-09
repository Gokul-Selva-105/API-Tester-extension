import { useEffect } from 'react';
import { setupMessageListener } from './lib/vscode';
import { useStore } from './lib/store';
import { Sidebar } from './components/Sidebar';
import { RequestPanel } from './components/RequestPanel';
import { RequestTabs } from './components/RequestTabs';
import { ResponsePanel } from './components/ResponsePanel';
import { api } from './lib/api';

function App() {
    const { setResponse, setLoading, setCollections, setHistory } = useStore();

    useEffect(() => {
        // Initial fetch
        api.getCollections();
        api.getHistory();

        // Setup message listener
        setupMessageListener({
            onResponse: (response) => {
                setResponse(response);
                setLoading(false);
                // Refresh history after response
                api.getHistory();
            },
            onInfo: (msg) => console.log('Info:', msg),
            onError: (msg) => {
                console.error('Error:', msg);
                setLoading(false);
            },
            onNewRequest: () => {
                // Reset or create new
            }
        });

        // Listen for collections/history updates
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'collections') {
                setCollections(message.value);
            } else if (message.type === 'history') {
                setHistory(message.value);
            }
        };
        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);

    }, []);

    return (
        <div className="h-screen w-full bg-background text-foreground flex flex-col font-sans overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex">
                {/* Sidebar */}
                <div className="w-[200px] border-r border-border bg-secondary/10 flex-shrink-0 flex flex-col overflow-hidden">
                    <Sidebar />
                </div>

                {/* Request/Response Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top: URL Bar */}
                    <RequestPanel />

                    {/* Middle: Request Config */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <RequestTabs />
                    </div>

                    {/* Bottom: Response (Resizable ideally, but fixed for now) */}
                    <div className="h-[40%] border-t border-border overflow-hidden bg-background">
                        <ResponsePanel />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
