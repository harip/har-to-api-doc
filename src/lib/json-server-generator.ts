import * as vscode from 'vscode'; 
const path = require('path');
import fs = require('fs-extra');
import * as _ from "lodash";
import { httpMethodTemplate } from '../templates/json-server/http/method.template';
import { exdendData, templateToFileMappper } from '../templates/json-server/template.mapper';
import { CONSTANTS } from '../utils/constants';
import { createJsonServerFolderStructure, entriesForDbJson, getKeyValuePairsForRouteJson, processHarEntriesForJsonServer } from '../utils/json-server-helper';

export const createJsonServerFiles = async (content: any) => {
    try {
        // Path
        const pt = vscode.workspace.workspaceFolders 
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : path.join(__dirname); 

        // Parse HAR file
        const entries = processHarEntriesForJsonServer(JSON.parse(content)); 

        const p = path.join(pt, CONSTANTS.JSON_SERVER_FOLDER_NAME);
        createJsonServerFolderStructure(p);

        // Deal with requests that are not GET
        const otherEntries = entries.filter(entry => entry.method !== 'GET');
        let groupedData = _.chain(otherEntries).groupBy('method').map((value, key) => {
            return {
                method: key,
                entries: value
            };
        }).value();
        groupedData.forEach(async (data: any) => {
            const fileName = exdendData[`${data.method}`];
            const templateData = entriesForDbJson(data.entries);
            await createFileWithData(p, fileName, { template: httpMethodTemplate, getTemplateData: templateData });
        });

        // Create files
        // Create db.json and routes.json for only get requests
        const getEntries = entries.filter(entry => entry.method === 'GET');
        templateToFileMappper.forEach(async (m: any) => {
            if (m.fileName === 'db.json') {
                m.getTemplateData = entriesForDbJson(getEntries);
            } else if (m.fileName === 'routes.json') {
                m.getTemplateData = getKeyValuePairsForRouteJson(entries);
            } else if (m.fileName === 'index.js') {

                m.getTemplateData = groupedData;
            }
            await createFileWithData(p, m.fileName, m);
        });
        return {
            status: 'success',
            message: 'Files created successfully',
            path: p
        };
    } catch (e) {
        console.log(e);
        return {
            status: 'failure',
            message: 'Error while creating files'
        };
    } 
};

const createFileWithData = async (rootPath: string, fileName: string, templateInfo: any) => {
    const filePath = path.join(rootPath, fileName);
    const createTemplate = _.template(templateInfo.template);

    // Extend data
    const templateData = templateInfo.extend
        ? _.extend(exdendData, { entries: templateInfo.getTemplateData })
        : { entries: templateInfo.getTemplateData };

    // Fill data into template
    const fillData = createTemplate(templateData);

    await fs.writeFile(filePath, fillData);
};