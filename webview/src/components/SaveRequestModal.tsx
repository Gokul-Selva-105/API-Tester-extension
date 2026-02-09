import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { X, Check } from 'lucide-react';

interface SaveRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SaveRequestModal({ isOpen, onClose }: SaveRequestModalProps) {
    const { activeRequest, collections, setCollections, setActiveRequest } = useStore();
    const [requestName, setRequestName] = useState(activeRequest.name || 'New Request');
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRequestName(activeRequest.name || 'New Request');
            if (collections.length > 0) {
                setSelectedCollectionId(collections[0].id);
            } else {
                setIsCreatingCollection(true);
            }
        }
    }, [isOpen, activeRequest, collections]);

    const handleSave = () => {
        let targetCollectionId = selectedCollectionId;
        let finalCollections = [...collections];

        if (isCreatingCollection) {
            if (!newCollectionName.trim()) {
                api.showError('Please enter a collection name');
                return;
            }
            const newCollection = {
                id: crypto.randomUUID(),
                name: newCollectionName,
                folders: [],
                requests: []
            };
            finalCollections.push(newCollection);
            targetCollectionId = newCollection.id;
        }

        const targetCollectionIndex = finalCollections.findIndex(c => c.id === targetCollectionId);
        if (targetCollectionIndex === -1) {
            api.showError('Please select a valid collection');
            return;
        }

        // Update request name
        const updatedRequest = { ...activeRequest, name: requestName };
        setActiveRequest({ name: requestName });

        // Add to collection
        finalCollections[targetCollectionIndex].requests.push({
            ...updatedRequest,
            id: crypto.randomUUID()
        });

        setCollections(finalCollections);
        api.saveCollections(finalCollections);
        api.showInfo(`Request saved to ${finalCollections[targetCollectionIndex].name}`);

        onClose();
        setNewCollectionName('');
        setIsCreatingCollection(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-lg shadow-lg w-[400px] p-4 text-foreground">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                    <h2 className="font-semibold text-sm">Save Request</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Request Name</label>
                        <input
                            type="text"
                            value={requestName}
                            onChange={(e) => setRequestName(e.target.value)}
                            className="w-full bg-secondary border border-input rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Save to Collection</label>

                        {!isCreatingCollection ? (
                            <div className="flex gap-2">
                                <select
                                    value={selectedCollectionId}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') {
                                            setIsCreatingCollection(true);
                                        } else {
                                            setSelectedCollectionId(e.target.value);
                                        }
                                    }}
                                    className="flex-1 bg-secondary border border-input rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    {collections.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                    <option value="new">+ Create New Collection</option>
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="New Collection Name"
                                    className="flex-1 bg-secondary border border-input rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                {collections.length > 0 && (
                                    <button
                                        onClick={() => setIsCreatingCollection(false)}
                                        className="text-muted-foreground hover:text-foreground text-xs underline"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}

                        {collections.length === 0 && !isCreatingCollection && (
                            <div className="text-xs text-orange-500 mt-1">
                                No collections found. You must create one.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-medium hover:bg-secondary rounded text-muted-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded flex items-center gap-1"
                    >
                        <Check size={14} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
