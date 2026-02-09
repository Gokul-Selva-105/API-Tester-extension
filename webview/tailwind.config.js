/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--vscode-editor-background)',
                foreground: 'var(--vscode-editor-foreground)',
                border: 'var(--vscode-panel-border)',
                primary: {
                    DEFAULT: '#38bdf8', // Next.js inspired
                    foreground: '#0f172a'
                },
                secondary: {
                    DEFAULT: '#1e293b',
                    foreground: '#e5e7eb'
                },
                destructive: {
                    DEFAULT: '#ef4444',
                    foreground: '#ffffff'
                },
                muted: {
                    DEFAULT: '#334155',
                    foreground: '#94a3b8'
                },
                accent: {
                    DEFAULT: '#0f172a',
                    foreground: '#e5e7eb'
                }
            }
        },
    },
    plugins: [],
}
