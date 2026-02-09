import { create } from 'zustand';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface KeyValue {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export interface RequestBody {
    type: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw';
    content: string; // For JSON/Raw
    formData?: KeyValue[];
}

export interface Auth {
    type: 'none' | 'basic' | 'bearer' | 'api-key' | 'oauth2';
    username?: string;
    password?: string;
    token?: string;
    key?: string;
    value?: string;
    addTo?: 'header' | 'query';
}

export interface ApiRequest {
    id: string;
    name: string;
    method: RequestMethod;
    url: string;
    params: KeyValue[];
    headers: KeyValue[];
    body: RequestBody;
    auth: Auth;
}

export interface ApiResponse {
    status: number;
    statusText: string;
    time: number;
    size: number;
    headers: Record<string, string>;
    body: any;
    error?: string;
}

interface AppState {
    // Active Request
    activeRequest: ApiRequest;
    setActiveRequest: (req: Partial<ApiRequest>) => void;
    replaceActiveRequest: (req: Partial<ApiRequest>) => void;
    updateActiveRequest: (updates: Partial<ApiRequest>) => void;

    // Response
    response: ApiResponse | null;
    setResponse: (res: ApiResponse | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;

    // UI State
    activeTab: 'params' | 'headers' | 'body' | 'auth' | 'code';
    setActiveTab: (tab: 'params' | 'headers' | 'body' | 'auth' | 'code') => void;

    // Collections & History
    collections: any[];
    setCollections: (collections: any[]) => void;
    history: any[];
    setHistory: (history: any[]) => void;
}

export const useStore = create<AppState>((set) => ({
    activeRequest: {
        id: 'default',
        name: 'New Request',
        method: 'GET',
        url: '',
        params: [{ id: '1', key: '', value: '', enabled: true }],
        headers: [{ id: '1', key: '', value: '', enabled: true }],
        body: { type: 'json', content: '{}' },
        auth: { type: 'none' }
    },
    setActiveRequest: (req) => set((state) => ({
        activeRequest: { ...state.activeRequest, ...req }
    })),
    // Use this when loading a saved request to ensure no stale state remains
    replaceActiveRequest: (req) => set({ activeRequest: req as ApiRequest }),
    updateActiveRequest: (updates) => set((state) => ({
        activeRequest: { ...state.activeRequest, ...updates }
    })),

    response: null,
    setResponse: (res) => set({ response: res }),
    loading: false,
    setLoading: (loading) => set({ loading }),

    activeTab: 'params',
    setActiveTab: (tab) => set({ activeTab: tab }),

    collections: [],
    setCollections: (collections) => set({ collections }),
    history: [],
    setHistory: (history) => set({ history })
}));
