const path = require('path');
import fs = require('fs-extra'); 
import _ = require('lodash');
import { getUniqueEntries, removeEntriesWithNoUrl, removeEntriesWithWebSocket, removeEntriesWithAsset, removeHostDetailsFromEntries, generalizeEntriesUrl, getInitialHarEntries } from './har-parser';

export const createJsonServerFolderStructure = (rootPath: string): void => {
    fs.removeSync(rootPath);
    fs.ensureDirSync(rootPath);
    fs.ensureDirSync(path.join(rootPath, 'api-data'));
};

export const processHarEntriesForJsonServer = (harData: any) => {
    const entries = getInitialHarEntries(harData);
    return _.flow(
        getUniqueEntries,
        removeEntriesWithNoUrl, 
        removeEntriesWithWebSocket,
        removeEntriesWithAsset,
        removeHostDetailsFromEntries,
        generalizeEntriesUrl,
        getUniqueEntries        
    )(entries);
}; 

export const getKeyValuePairsForRouteJson = (entries:any) => {
    return entries.map((f:any) => {
        return {
            key: `${f.url}`, 
            // For routes.json, we cannot use / in the values, replace it with - expect for first one
            value: () =>  f.routeJsonValueLeadingSlash 
        };
    });
};

export const entriesForDbJson = (entries: any) => {
    return entries.map((f:any) => {
        return { 
            key: () =>  f.routeJsonValueNoLeadingSlash,
            value: JSON.stringify(f.response.content,null,6)
        };
    });
};
 