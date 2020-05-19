import { Member, Player, DataUpdateStatus } from "./storage";

export const createDocument = ({ head = '', body = '', foot = '' } = { head: '', body: '', foot: '' }) => `
<!DOCTYPE html>
<html>
<head>
    ${head}
</head>
<body>
${body}
${foot}
</body>
</html>`;

const renderBookingRequests = (players: Player[], playerStatuses: DataUpdateStatus[]) => {
    let html = '<ul>';
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const status = playerStatuses[i];
        let statusText: string;
        if (status === 'Stored') { statusText = 'Booked'; }
        else if (status === 'Exists') {
            statusText = 'Already booked';
        } else {
            statusText = 'Could not book';
        }
        const date = new Date(player.DateAndTimeOfGame._seconds * 1000);
        html += `<li>${date.toString()}: ${statusText}</li>`;
        html += '\n';
    }
    html += '</ul>';
    return html;
};

export const render = (member: Member, players: Player[], playerStatuses: DataUpdateStatus[]) => {
    const nav = `<nav>${encodeURIComponent(member.FirstName)} ${encodeURIComponent(member.LastName)}</nav>`;
    const table = renderBookingRequests(players, playerStatuses);
    return createDocument({ body: nav + table });
};