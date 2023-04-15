import React from 'react';

interface PopupProps {
	onClose: () => void;
	content: React.ReactNode;
}
  
function Popup(props: PopupProps) {
return (
	<div className="blurred-bg">
		<div className="popup">
		{/* <div className="popup-content"> */}
			{props.content}
			{/* <h3>Create new object</h3>
			<button onClick={props.onClose}>Close</button> */}
			{/* add options here */}
		{/* </div> */}
		</div>
	</div>
);
}

export default Popup