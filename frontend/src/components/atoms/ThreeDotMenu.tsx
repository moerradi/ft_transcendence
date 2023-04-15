import { useState } from 'react';

interface ThreeDotMenuProps {
  onMenuClick?: (menuItem: string) => void;
  menuItems: string[];
}

const ThreeDotMenu  = ({ onMenuClick, menuItems }: ThreeDotMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleButtonClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuItemClick = (menuItem: string) => {
    setMenuVisible(false);
    if (onMenuClick) {
      onMenuClick(menuItem);
    }
  };

  return (
    <div className="three-dot-menu">
      <button className="three-dot-menu-button" onClick={handleButtonClick}>
        <div className="three-dot-menu-dot" />
        <div className="three-dot-menu-dot" />
        <div className="three-dot-menu-dot" />
      </button>
      {menuVisible && (
        <ul className="three-dot-menu-items">
          {menuItems.map((item, index) => (
            <li key={index} onClick={() => handleMenuItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreeDotMenu;
