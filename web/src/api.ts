const API_ENDPOINT = 'https://us-central1-chums-tennis.cloudfunctions.net/';

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

export async function getMember(token: string) {
    return await get('getMember', token);
}

export async function getCourts(token: string) {
    return await get('getCourts', token);
}

export async function getPlayers(token: string) {
    return await get('getPlayers', token);
}

