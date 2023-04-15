
interface Props {
//   onToggle: (isToggled: boolean) => void;
isToggled: boolean;
	toggleCLick: () => void;
  untoggledImage: string;
  toggledImage: string;
}

const CustomToggleButton = ({ isToggled, toggleCLick, untoggledImage, toggledImage }: Props) => {
//   const [isToggled, setIsToggled] = useState(false);

//   const handleClick = () => {
//     setIsToggled(!isToggled);
//     onToggle(!isToggled);
//   };

  return (
    <div
	  className='toggle-slider'
      onClick={toggleCLick}
      style={{
		
        width: '40%',
        height: '20%',
        border: '4px solid var(--dark)',
        borderRadius: '25px',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <img
        src={isToggled ? toggledImage : untoggledImage}
        alt="Toggle Button"
        style={{
          position: 'absolute',
          top: '-45px',
          left: isToggled ? '65%' : '-30%',
          transition: 'left 0.2s ease-in-out',
          width: '100px',
          height: '100px',
        //   borderRadius: '50%',
        //   border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default CustomToggleButton;
