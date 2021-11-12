import _ = require("lodash");

export const getInitialHarEntries = (har: any) => {
    const entries = har.log.entries
        .filter((f:any) => f._initiator && f._initiator.type === 'script')
        .map( (entry:any) => { 
            const apiInfo = {
                url: entry?.request?.url,
                method: entry?.request?.method,
                response: {
                    status: entry?.response?.status,
                    statusText: entry?.response?.statusText,
                    content: getApiContent(entry?.response?.content?.text)
                },
                request: { 
                    body: getApiContent(entry?.request?.postData?.text)
                } 
            };
            return apiInfo;
    });

    return entries;
};

export const getUniqueEntries = (entries: any) => {
    const uniqueEntries = _.uniqWith(entries, (a:any, b:any) => {
        return a.url === b.url && a.method === b.method;
    });
    return uniqueEntries;
};

export const removeEntriesWithNoUrl = (entries: any) => {
    return entries.filter((f:any) => f.url);
};

export const removeEntriesWithAsset = (entries: any) => {
    const asset = ['.js', '.css', '.html', '.svg', '.ico', '.png', '.jpg'];
    return entries.filter((f:any) => !asset.some(s => f.url.endsWith(s)));
};

export const removeEntriesWithWebSocket = (entries: any) => {
    return entries.filter((f:any) => !f.url.includes('ws'));
};

export const removeHostDetailsFromEntries = (entries: any) => {
    return entries.map((f:any) => {
        
        // Remove protocol, host, domain, port, web socket
        const url = f.url.replace(/^https?:\/\/[^/]+/, '');

        f.url=url; //f.url.replace(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/, '').replace(/^(?:wss?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/, '');    
        return f;
    });
};

export const generalizeEntriesUrl = (entries: any) => { 
    return entries.map((f:any) => {
        let d = decodeURIComponent(f.url);
        // Replace GUID in path params with *
        const positions = d.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi);
        if (positions) {
            positions.forEach(p => {
                f.url = f.url.replace(p, '*');
            });
        }

        // Replace Numbers in path params with *
        const numbers = d.match(/\d+/gi);
        if(numbers){
            numbers.forEach(n=>{
                f.url = f.url.replace(n,'*');
            });
        }

        // Create a new property called decodedUrl
        f.decodedUrl = d; 
        f.routeJsonValueLeadingSlash = f.decodedUrl.replace(/\//g, '-').replace(/^-/, '/'),
        f.routeJsonValueNoLeadingSlash = f.decodedUrl.replace(/\//g, '-').replace(/^-/, '');
        return f;
    });
};

export const getApiContent = (contentText: string) => {
    try{
        return JSON.parse(contentText);
    } catch(e) {
        return {};
    }
};