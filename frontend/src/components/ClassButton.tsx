
interface ClassButtonProps {
	name: string;
	classes: string;
	onClick: () => void; 
} 

function ClassButton({name, classes, onClick} : ClassButtonProps) {
  return (
	<button className={classes} onClick={onClick}>
		{name}
	</button>
  );
}

export default ClassButton