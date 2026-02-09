import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export function BodyEditor() {
    const { activeRequest, updateActiveRequest } = useStore();
    const body = activeRequest.body;

    const setBodyType = (type: any) => {
        updateActiveRequest({ body: { ...body, type } });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateActiveRequest({ body: { ...body, content: e.target.value } });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-2 p-1 bg-secondary/30 rounded w-fit">
                {(['json', 'form-data', 'x-www-form-urlencoded', 'raw'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setBodyType(t)}
                        className={cn(
                            "px-3 py-1 text-xs rounded transition-colors",
                            body.type === t
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex-1 relative border border-input rounded overflow-hidden">
                <textarea
                    value={body.content}
                    onChange={handleContentChange}
                    className="w-full h-full bg-background p-2 font-mono text-sm resize-none focus:outline-none"
                    placeholder={body.type === 'json' ? "{\n  \"key\": \"value\"\n}" : "Enter body content..."}
                />
            </div>
        </div>
    );
}
