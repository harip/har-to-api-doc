/* eslint-disable @typescript-eslint/naming-convention */
import { dbJsonTemplate } from "./db.json.template";
import { indexTemplate } from "./index.js.template";
import { packageJsonTemplate } from "./package.json.template";
import { routesJsonTemplate } from "./routes.json.template";

export const templateToFileMappper = [
    { 
        fileName: 'index.js',
        template: indexTemplate,
        getTemplateData: {},
        extend : true
    },
    {
        fileName: 'db.json',
        template: dbJsonTemplate,
        getTemplateData: {} 
    },
    {
        fileName: 'package.json',
        template: packageJsonTemplate,
        getTemplateData: {} 
    },
    {
        fileName: 'routes.json',
        template: routesJsonTemplate,
        getTemplateData: {} 
    }
];

export const exdendData: any = {
    POST : './api-data/POST.json',
    PUT : './api-data/PUT.json',
    PATCH : './api-data/PATCH.json',
    DELETE : './api-data/DELETE.json',
};