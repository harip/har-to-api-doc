export const dbJsonTemplate = 
`{
<% _.forEach(entries, function(entry,index) {%>
"<%= entry.key() %>": <%= entry.value %><% if(index < entries.length-1){%>,<%}%>
<%})%>
}`; 