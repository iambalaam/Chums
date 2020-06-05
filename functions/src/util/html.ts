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
    * {
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
    }

    html,
    body {
        padding: 0;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    nav {
        height: 46px;
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
        display: flex;
        flex-wrap: wrap;
        align-content: space-around;
    }
    
    li {
        margin: 10px 30px;
        display: inline-block;
    }

    .calendar {
        /* Sizing */
        border: none;
        border-radius: 8px;
        position: relative;
        width: 140px;
        height: 180px;

        /* Styling */
        background-color: #eee;
        text-align: center;
    }

    .calendar.status::after {
        /* Sizing */
        top: -12px;
        right: 0;
        transform: translate(50%, 0);
        position: absolute;
        border: 4px solid currentColor;
        border-radius: 16px;
        width: 24px;
        height: 24px;
        line-height: 24px;

        /* Styling */
        z-index: 1;
        transition: 0.2s;
        color: currentColor;
        overflow: hidden;
        content: attr(data-status);
        background-color: #eee;
        box-shadow: 0 4px rgba(0, 0, 0, 0.2);
    }

    .calendar.status:hover::after {
        width: 200px;
    }

    .calendar .header {
        /* Sizing */
        position: absolute;
        top: 0;
        height: 25%;
        width: 100%;

        /* Misc */
        border: none;
        border-radius: 8px 8px 0 0;
        padding: 4px;
        box-shadow: 0 4px rgba(0, 0, 0, 0.2);

        /* Styling */
        font-size: 25px;
        color: white;
        background-color: indianred;
    }

    .calendar .body {
        /* Sizing */
        position: absolute;
        padding: 4px;
        bottom: 0;
        height: 75%;
        width: 100%;

        /* Misc */
        color: #333;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .calendar .body .month {
        font-size: 18px;
        line-height: 18px;
        text-transform: uppercase;
    }

    .calendar .body .date {
        font-size: 70px;
        font-weight: 800;
        line-height: 70px;
    }

    .calendar .body .time {
        font-size: 18px;
        line-height: 18px;
    }
</style>`;

const renderBookingRequests = (players: Player[], playerStatuses: DataUpdateStatus[]) => {
    let html = '<div id="bookings">';
    html += `<h1>Booking Requests</h1>\n`;
    html += '<ul>\n';
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const status = playerStatuses[i];
        html += `<li>${renderCalendarWithTime(player, status)}</li>`;
        html += '\n';
    }
    html += '</ul>';
    html += '</div>';
    return html;
};

const getColAndStatusMsg = (status: DataUpdateStatus): [string, string] => {
    switch (status) {
        case 'Stored':
            return ['#5ccd5c', '✔ Requested'];
        case 'Exists':
            return ['#5ccd5c', '✔ Already Requested'];
        case 'Failed':
            return ['#f5332c', '✘ Failed to request'];
    }
} 

const renderCalendarWithTime = (player: Player, playerStatus: DataUpdateStatus) => {
    const date = new Date(player.DateAndTimeOfGame._seconds * 1000);
    const [color, statusMsg] = getColAndStatusMsg(playerStatus);
    return `
    <div class="calendar status" style="color: ${color};" data-status="${statusMsg}">
        <div class="header">${date.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
        <div class="body">
            <div class="month">${date.toLocaleDateString('en-GB', { month: 'long' })}</div>
            <div class="date">${date.getDate()}</div>
            <div class="time">${date.toLocaleString('en-GB', { hour12: true, hour: 'numeric', minute: 'numeric' })}</div>
        </div>
    </div>`;
}

const renderCalendar = (player: Player) => {
    const date = new Date(player.DateAndTimeOfGame._seconds * 1000);
    return `
    <div class="calendar">
        <div class="header">${date.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
        <div class="body">
            <div class="month">${date.toLocaleDateString('en-GB', { month: 'long' })}</div>
            <div class="date">${date.getDate()}</div>
        </div>
    </div>`;
}

const renderCalendarPicker = (players: Player[]) => {
    const dates = players.map((player) => new Date(player.DateAndTimeOfGame._seconds * 1000))
    const date = dates[0];
    for (const d of dates) {
        if (
            d.getFullYear() !== date.getFullYear() ||
            d.getMonth() !== date.getMonth() ||
            d.getDate() !== date.getDate()
        ) {
            throw new Error('Cannot render matches in different dates together.');
        }
    }

    `
    <div class="calendar">
        <div class="header">${date.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
        <div class="body">
            <div class="month">${date.toLocaleDateString('en-GB', { month: 'long' })}</div>
            <div class="date">${date.getDate()}</div>
        </div>
    </div>`;
}

export const render = (member: Member, players: Player[], playerStatuses: DataUpdateStatus[]) => {
    const nav = `<nav>${encodeURIComponent(member.FirstName)} ${encodeURIComponent(member.LastName)}</nav>`;
    const table = renderBookingRequests(players, playerStatuses);
    return createDocument({
        head: [
            renderTitle(),
            renderStyleTag()
        ].join('\n'),
        body: [
            nav, '<main>', table, '</main>'
        ].join('\n')
    });
};