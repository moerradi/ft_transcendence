import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenuClose } from "../hooks/useMenuClose";
import Cookies from "js-cookie";
import authService from "../api/authService";
import { useActiveTab } from "../hooks/useActiveTab";

function deleteAllCookies() {
  const cookies = Cookies.get();
  for (const cookie in cookies) {
    Cookies.remove(cookie);
  }
}
function Menu() {
  // const menuClose = useMenuClose((state) => state.menuClose);
  // const menuName = useMenuClose((state) => state.menuName);
  const setMenuClose = useMenuClose((state) => state.setMenuClose); 
  const setMenuName = useMenuClose((state) => state.setMenuName);

  const setActiveTab = useActiveTab((state) => state.setActiveTab);
  const nav = useNavigate();  
  function toggleMenu() {
    setMenuClose(true);
    setMenuName("Menu");
  }

  function handleLogout() {
    setMenuClose(true);
    setMenuName("Menu");
    authService.logout();
    window.location.reload();
  }
  return (
    <div className="menu-container pattern-background green-pattern">
      <div className="retro-border-box light-box menu-box copy-book-background">
        <Link to="/" className="menu-links" onClick={() => toggleMenu()}>
          home
        </Link>
        <Link to="/search" className="menu-links" onClick={() => toggleMenu()}>
          search
        </Link>
        <Link to="/profil" className="menu-links" onClick={() => {
          setActiveTab(0);
          toggleMenu()}}>
          profil
        </Link>
        <Link to="/chat" className="menu-links" onClick={() => toggleMenu()}>
          chats
        </Link>
        <h2 className="menu-links logout-link" onClick={() =>  handleLogout()}>
          logout
        </h2>
      </div>
    </div>
  );
} 

export default Menu;
