import { useState } from 'react';

const ToggleButton = ({ onToggle }: { onToggle: (isToggled: boolean) => void }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    onToggle(!isToggled);
  };

  return (
    <label className="toggle-button">
      <input type="checkbox" checked={isToggled} onChange={handleToggle} />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleButton;
