import { useStore, KeyValue } from '../lib/store';
import { Trash2 } from 'lucide-react';

interface Props {
    type: 'params' | 'headers';
}

export function KeyValueEditor({ type }: Props) {
    const { activeRequest, updateActiveRequest } = useStore();
    const items = activeRequest[type];

    const updateItem = (index: number, updates: Partial<KeyValue>) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };

        // Auto-add new row if editing the last one
        if (index === items.length - 1 && (newItems[index].key || newItems[index].value)) {
            newItems.push({ id: crypto.randomUUID(), key: '', value: '', enabled: true });
        }

        updateActiveRequest({ [type]: newItems });
    };

    const removeItem = (index: number) => {
        if (items.length <= 1) {
            updateItem(0, { key: '', value: '' });
            return;
        }
        const newItems = items.filter((_, i) => i !== index);
        updateActiveRequest({ [type]: newItems });
    };

    return (
        <div className="w-full text-sm">
            <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2 px-2 text-xs font-semibold text-muted-foreground">
                <div className="text-center"></div>
                <div>Key</div>
                <div>Value</div>
                <div></div>
            </div>
            {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-1 group">
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(e) => updateItem(index, { enabled: e.target.checked })}
                            className="accent-primary"
                        />
                    </div>
                    <input
                        type="text"
                        value={item.key}
                        onChange={(e) => updateItem(index, { key: e.target.value })}
                        placeholder="Key"
                        className="bg-secondary/30 border border-input rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateItem(index, { value: e.target.value })}
                        placeholder="Value"
                        className="bg-secondary/30 border border-input rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                        onClick={() => removeItem(index)}
                        className="flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
