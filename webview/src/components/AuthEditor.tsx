import { useStore } from '../lib/store';

export function AuthEditor() {
    const { activeRequest, updateActiveRequest } = useStore();
    const auth = activeRequest.auth;

    const setAuthType = (type: any) => {
        updateActiveRequest({ auth: { ...auth, type } });
    };

    return (
        <div className="p-4 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium min-w-[100px]">Auth Type</label>
                <select
                    value={auth.type}
                    onChange={(e) => setAuthType(e.target.value)}
                    className="flex-1 bg-secondary border border-input rounded px-3 py-1.5 text-sm"
                >
                    <option value="none">No Auth</option>
                    <option value="basic">Basic Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="api-key">API Key</option>
                </select>
            </div>

            {auth.type === 'basic' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm min-w-[100px]">Username</label>
                        <input
                            type="text"
                            className="flex-1 bg-secondary/30 border border-input rounded px-3 py-1.5 text-sm"
                            placeholder="Username"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm min-w-[100px]">Password</label>
                        <input
                            type="password"
                            className="flex-1 bg-secondary/30 border border-input rounded px-3 py-1.5 text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>
            )}

            {auth.type === 'bearer' && (
                <div className="flex items-center gap-4">
                    <label className="text-sm min-w-[100px]">Token</label>
                    <input
                        type="text"
                        className="flex-1 bg-secondary/30 border border-input rounded px-3 py-1.5 text-sm"
                        placeholder="Bearer Token"
                    />
                </div>
            )}

            {auth.type === 'none' && (
                <div className="text-center text-muted-foreground text-sm py-8">
                    This request does not use any authentication.
                </div>
            )}
        </div>
    );
}
