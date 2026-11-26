import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setUnauthorizedHandler } from "../api/client";
import { TOKEN_STORAGE_KEY } from "../config/constants";
import { UserData } from "./UserData";

export function UserDataProvider(props) {
    const [Token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
    const queryClient = useQueryClient();

    const login = useCallback((newToken) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        queryClient.clear();
    }, [queryClient]);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            logout();
            toast.error('Your session has expired, please log in again', { id: 'session-expired' });
        });
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    return <UserData.Provider value={{ Token, setToken, login, logout }}>
        {props.children}
    </UserData.Provider>
}
