import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from './useAuth';

interface Props {
    component: React.FC;
}

const ProtectedRoute = ({ component: Component }: Props) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
console.log(user, loading);
        if (!user && !loading) {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [location, user, loading]);

    return <><Component /></>;
};

export default ProtectedRoute;