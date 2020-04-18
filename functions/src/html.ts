export interface DocumentOpts {
    head: string,
    body: string,
    foot: string;
}
export const createDocument = ({ head, body, foot }: Partial<DocumentOpts>) => `
<html>
<head>
    ${head}
</head>
<body>
${body}
${foot}
</body>
</html>`;