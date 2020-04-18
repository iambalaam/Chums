export interface DocumentOpts {
    head: string,
    body: string,
    foot: string;
}
export const createDocument = ({ head = '', body = '', foot = '' } = { head: '', body: '', foot: '' }) => `
<html>
<head>
    ${head}
</head>
<body>
${body}
${foot}
</body>
</html>`;