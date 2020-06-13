const API_ENDPOINT = 'https://us-central1-chums-tennis.cloudfunctions.net/';

export const getToken = (): string | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get('token');
    if (queryToken) {
        document.cookie = `token=${queryToken}`;
        return queryToken;
    } else {
        const cookies = document.cookie.split('; ');
        const cookieToken = cookies.find((cookie) => cookie.startsWith('token=')) || '';
        return cookieToken.slice(6);
    }
};

const get = async (operation: string, token: string) => {
    const response = await fetch(`${API_ENDPOINT}/api/${operation}?token=${token}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const text = await response.text();
        throw new Error(`Failed to request ${operation}\n${text}`);
    }
};

const post = async (operation: string, token: string, data: any) => {
    const response = await fetch(`${API_ENDPOINT}/api/${operation}?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to post to ${operation}\n${text}`);
    } else {
        return response;
    }
};

export async function getMember(token: string) {
    return await get('getMember', token);
}

export async function getCourts(token: string) {
    return await get('getCourts', token);
}

export async function getPlayers(token: string) {
    return await get('getPlayers', token);
}

export async function requestCourt(token: string, seconds: number) {
    return await post('requestCourt', token, { seconds });
};

export async function cancelRequestCourt(token: string, seconds: number) {
    return await post('cancelRequestCourt', token, { seconds });
};