import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Chat from './pages/chat';
import Profil from './pages/profil';
import Login from './pages/login';
import Home from './pages/home';
import Menu from './pages/menu';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';
import api from './api/api';
import { AxiosError } from 'axios';
import Bell from './pages/bell';
import Game from './game/Game';


import Error from './pages/error';
import twofa from './pages/twofa';
import Twofa from './pages/twofa';
import Search from './components/search';

function Router() {
const auth = useAuth();
const location = useLocation();

useEffect(() => {
    console.log(auth);
    const token = Cookies.get('access_token');
    console.log('access_token', token);
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.get('/auth/me').then((res) => {
            console.log("set user state");
            auth.setUserState(res.data);
        }
        ).catch((err: AxiosError) => {
            console.log("set user state null");
            auth.setUserState(null);
        });
    } else {
        auth.setUserState(null);
}
}, []);

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute component={Home} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<ProtectedRoute component={Menu} />} />
            <Route path="/game/:mode" element={<ProtectedRoute component={Game} />} />
            <Route path="/chat" element={<ProtectedRoute component={Chat} />} />
			<Route path="/profil/:login" element={<ProtectedRoute component={Profil} />} />
            <Route path="/profil" element={<ProtectedRoute component={Profil} />} />
            <Route path="/bell" element={<ProtectedRoute component={Bell}/>} />
            <Route path="/search" element={<ProtectedRoute component={Search}/>} />
            <Route path="/*" element={<Error/>} />
            <Route path="/2fa" element={<Twofa />} />
        </Routes>
    )
}

export default Router
