import React, { useState, useContext, createContext } from 'react';

interface AuthContextProps {
    setUserState: any;
    user: any;
    loading: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

    const setUserState = (user: any) => {
        setUser(user);
setLoading(false);
    };

    return <AuthContext.Provider value={{ user, setUserState, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};
