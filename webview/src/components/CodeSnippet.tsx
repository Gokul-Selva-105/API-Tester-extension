import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useStore } from "../lib/store";
import { generateCode, CodeLang } from "../lib/codegen";

export function CodeSnippet() {
    const { activeRequest } = useStore();
    const [lang, setLang] = useState<CodeLang>('curl');
    const [copied, setCopied] = useState(false);

    const code = generateCode(activeRequest, lang);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="flex items-center justify-between p-2 border-b border-border">
                <div className="flex gap-2">
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as CodeLang)}
                        className="bg-secondary text-xs rounded px-2 py-1 border border-input focus:outline-none"
                    >
                        <option value="curl">cURL</option>
                        <option value="js-fetch">JavaScript (Fetch)</option>
                        <option value="js-axios">JavaScript (Axios)</option>
                        <option value="node-http">Node.js</option>
                    </select>
                </div>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono bg-secondary/10 whitespace-pre-wrap">
                {code}
            </pre>
        </div>
    );
}
