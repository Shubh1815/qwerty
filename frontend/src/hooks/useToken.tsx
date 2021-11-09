import { useCookies } from 'react-cookie';
import { TokenResponse } from '../api/';

interface TokenHook {
    access: string | null,
    refresh: string | null,
    setTokens: ({ ...parmas }: TokenResponse) => void,
    removeTokens: () => void,
}

function useToken(): TokenHook {

    const [cookies, setCookie, removeCookie] = useCookies();

    const setTokens = ({ access, refresh }: TokenResponse) => {
        setCookie('access_token', access, { secure: true, path: "/", sameSite: "lax" });
        setCookie('refresh_token', refresh, { secure: true, path: "/", sameSite: "lax" });
    };

    const removeTokens = () => {
        removeCookie('access_token');
        removeCookie('refresh_token');
    }

    return {
        access: cookies.access_token,
        refresh: cookies.refresh_token,
        setTokens: setTokens,
        removeTokens: removeTokens,
    }
}

export default useToken;