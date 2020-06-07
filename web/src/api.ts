const API_ENDPOINT = 'https://us-central1-chums-tennis.cloudfunctions.net/api';

export const getMember = async (token: string) => {
    const response = await fetch(`${API_ENDPOINT}/getMember?token=${token}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const text = await response.text();
        throw new Error(`Failed to get member\n${text}`);
    }
};

export const getCourts = async (token: string) => {
    const response = await fetch(`${API_ENDPOINT}/getCourts?token=${token}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const text = await response.text();
        throw new Error(`Failed to get courts\n${text}`);
    }
};

