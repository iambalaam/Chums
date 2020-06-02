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

const renderTitle = () => `<title>Chums Booking Request</title>`;

const renderStyleTag = () => `
<style>
    html,
    body {
        padding: 0;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    nav {
        height: 30px;
        line-height: 30px;
        font-size: 30px;
        padding: 8px;
        color: white;
        background-color: mediumseagreen;
    }
    
    #bookings {
        max-width: 800px;
        margin: auto;
    }
    
    ul {
        list-style: none;
        padding: 0;
    }
    
    li {
        padding: 6px;
        background-color: #ddd;
    }
    
    li:nth-child(2) {
        background-color: #bbb;
    }
</style>`;

const renderBookingRequests = (players: Player[], playerStatuses: DataUpdateStatus[]) => {
    let html = '<div id="bookings">';
    html += `<h1>Booking Requests</h1>\n`;
    html += '<ul>\n';
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const status = playerStatuses[i];
        let statusText: string;
        if (status === 'Stored') {
            statusText = 'Requested';
        } else if (status === 'Exists') {
            statusText = 'Already requested';
        } else {
            statusText = 'Failed to request';
        }
        const date = new Date(player.DateAndTimeOfGame._seconds * 1000);
        const dateString = date.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
        html += `<li>${dateString}: ${statusText}</li>`;
        html += '\n';
    }
    html += '</ul>';
    html += '</div>';
    return html;
};

export const render = (member: Member, players: Player[], playerStatuses: DataUpdateStatus[]) => {
    const nav = `<nav>${encodeURIComponent(member.FirstName)} ${encodeURIComponent(member.LastName)}</nav>`;
    const table = renderBookingRequests(players, playerStatuses);
    return createDocument({
        head: [
            renderTitle(),
            renderStyleTag()
        ].join('\n'),
        body: [
            nav, table
        ].join('\n')
    });
};