import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { KeyValueEditor } from './KeyValueEditor';
import { BodyEditor } from './BodyEditor';
import { AuthEditor } from './AuthEditor';
import { CodeSnippet } from './CodeSnippet';

export function RequestTabs() {
    const { activeTab, setActiveTab } = useStore();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex border-b border-border bg-background">
                {(['params', 'headers', 'body', 'auth', 'code'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "px-4 py-2 text-xs font-medium border-b-2 transition-colors capitalize",
                            activeTab === tab
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto bg-background p-2">
                {activeTab === 'params' && <KeyValueEditor type="params" />}
                {activeTab === 'headers' && <KeyValueEditor type="headers" />}
                {activeTab === 'body' && <BodyEditor />}
                {activeTab === 'auth' && <AuthEditor />}
                {activeTab === 'code' && <CodeSnippet />}
            </div>
        </div>
    );
}
