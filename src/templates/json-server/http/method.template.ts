export const httpMethodTemplate = 
`{
<% _.forEach(entries, function(entry,index) {%>
"<%= entry.key() %>": <%= entry.value %><% if(index < entries.length-1){%>,<%}%>
<%})%>
}`; 