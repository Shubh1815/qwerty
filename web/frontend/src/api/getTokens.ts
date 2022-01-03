const API_ENDPOINT: string = process.env.REACT_APP_API_ENDPOINT!;

export interface TokenErrorResponse {
    detail: string,
    code: string,
}

export const getTokens = (refresh_token: string | null) => (
    fetch(`${API_ENDPOINT}/token/refresh/`, {
        method: "POST",
        body: JSON.stringify({ 'refresh': refresh_token }),
        headers: {
            'Content-type': 'application/json',
        }
    }).then(async (res) => {
        const data = await res.json();
        if (res.ok) {
            return { status: res.status, response: data };
        }
        return Promise.reject({ status: res.status, response: data });
    })
);
