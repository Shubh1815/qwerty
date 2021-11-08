import { useContext } from "react";
import { useHistory } from "react-router";
import AuthContext from "../context/Auth";
import useToken from "./useToken";


const useAuth = () => {

    const { user, setUser } = useContext(AuthContext);
    const history = useHistory();
    const { setTokens, removeTokens } = useToken();

    const logOut = () => {
        removeTokens();
        setUser!(null);

        history.push('/');
    }

    const logIn = (access: string, refresh: string) => {
        setTokens({ access, refresh });

        history.push('/dashboard');
    }

    const isStudent = () => {
        return Boolean(user && user.role === "student");
    }

    const isManager = () => {
        return Boolean(user && (user.role === "manager" || user.role === "admin"));
    }

    return {
        user,
        logIn,
        logOut,
        isStudent,
        isManager,
    }
};

export default useAuth;
