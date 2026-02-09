import { ApiRequest, KeyValue } from './store';

export type CodeLang = 'curl' | 'js-fetch' | 'js-axios' | 'node-http';

export function generateCode(request: ApiRequest, lang: CodeLang): string {
    switch (lang) {
        case 'curl': return generateCurl(request);
        case 'js-fetch': return generateJsFetch(request);
        case 'js-axios': return generateJsAxios(request);
        case 'node-http': return generateNodeHttp(request);
        default: return '';
    }
}

function getHeaders(headers: KeyValue[]): Record<string, string> {
    const res: Record<string, string> = {};
    headers.forEach(h => {
        if (h.enabled && h.key) res[h.key] = h.value;
    });
    return res;
}

function getUrl(request: ApiRequest): string {
    let url = request.url;
    // Append query params
    const params = request.params.filter(p => p.enabled && p.key);
    if (params.length > 0) {
        const query = params.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
        url += (url.includes('?') ? '&' : '?') + query;
    }
    return url;
}

function generateCurl(req: ApiRequest): string {
    let cmd = `curl -X ${req.method} '${getUrl(req)}'`;

    // Headers
    req.headers.forEach(h => {
        if (h.enabled && h.key) {
            cmd += ` \\\n  -H '${h.key}: ${h.value}'`;
        }
    });

    // Body
    if (req.method !== 'GET' && req.body.content) {
        if (req.body.type === 'json') {
            cmd += ` \\\n  -H 'Content-Type: application/json'`;
            cmd += ` \\\n  -d '${req.body.content.replace(/'/g, "'\\''")}'`;
        } else {
            cmd += ` \\\n  -d '${req.body.content.replace(/'/g, "'\\''")}'`;
        }
    }

    return cmd;
}

function generateJsFetch(req: ApiRequest): string {
    const url = getUrl(req);
    const options: any = {
        method: req.method,
        headers: getHeaders(req.headers)
    };

    if (req.method !== 'GET' && req.body.content) {
        if (req.body.type === 'json') {
            options.headers['Content-Type'] = 'application/json';
        }
        options.body = req.body.content; // In real code, might need JSON.stringify if object, but content is string
    }

    return `fetch('${url}', ${JSON.stringify(options, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
}

function generateJsAxios(req: ApiRequest): string {
    const config: any = {
        method: req.method.toLowerCase(),
        url: getUrl(req),
        headers: getHeaders(req.headers)
    };

    if (req.method !== 'GET' && req.body.content) {
        try {
            config.data = JSON.parse(req.body.content);
        } catch {
            config.data = req.body.content;
        }
    }

    return `const axios = require('axios');

const config = ${JSON.stringify(config, null, 2)};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });`;
}

function generateNodeHttp(req: ApiRequest): string {
    // Simplified Node HTTP
    return `const https = require('follow-redirects').https;
const fs = require('fs');

const options = {
  'method': '${req.method}',
  'hostname': '${new URL(req.url).hostname || ''}',
  'path': '${new URL(req.url).pathname || ''}',
  'headers': ${JSON.stringify(getHeaders(req.headers), null, 2)}
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

${req.method !== 'GET' ? `req.write(${JSON.stringify(req.body.content)});` : ''}
req.end();`;
}
