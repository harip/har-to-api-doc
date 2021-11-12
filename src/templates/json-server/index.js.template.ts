export const indexTemplate =  
`
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

<% if(entries.some(s=>s.method === 'POST')){%>const postResponses = require('<%= POST %>');<%}%>
<% if(entries.some(s=>s.method === 'PUT')){%>const putResponses = require('<%= PUT %>');<%}%> 
<% if(entries.some(s=>s.method === 'PATCH')){%>const patchResponses = require('<%= PATCH %>');<%}%>
<% if(entries.some(s=>s.method === 'DELETE')){%>const deleteResponses = require('<%= DELETE %>');<%}%> 

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Define custom routes (routes.json)
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
server.use(jsonServer.rewriter(routes));

// Add custom middleware before JSON Server router
server.use((req, res, next) => {  
    console.log(req.body);
    if (req.method === 'GET') {          
        next();
    } 
    else {
        const response = getResponse(req);
        // print req path and response
        console.log('req.path...',req.path);
        console.log('response...',response);
        res.json(response)
    } 
});

const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);
server.listen(8080, () => {
    console.log('JSON Server is running')
});

const getResponse = (req) => {
    // Remove the first character from request path
    const path = req.path.replace(/^\\//, '');
    switch (req.method) {
        case 'POST':
            return postResponses[path];
        case 'PUT':
            return putResponses[path];
        case 'PATCH':
            return patchResponses[path];
        case 'DELETE':
            return deleteResponses[path];
        default:
            return {};
    }
} 
`;