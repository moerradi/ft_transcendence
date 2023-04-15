import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import ClassButton from './ClassButton';
import { useEnable2fa } from '../hooks/useEnable2fa';
import api from '../api/api';
import { toast } from 'react-hot-toast';


interface Enable2faProps {
	onClose: () => void;
	onSubmit: () => void;
}

function Enable2fa({onClose, onSubmit} : Enable2faProps) {

	const [qrCode, setQrCode] = React.useState<string>('');
	const [code, setCode] = React.useState<string>('');
	

	const enable2fa = useEnable2fa((state) => state.enable2fa);
	const setEnable2fa = useEnable2fa((state) => state.setEnable2fa);

	const handleEnable2fa = () => {
		console.log('enable 2fa', code);
		api.post('/auth/confirm2fa', { code })
		.then(response => {
			onSubmit();
		}).catch(error => {
			console.log(error);
			toast.error("This didn't work.")
			onClose();
		})
	}

	useEffect(() => {
		api.post('/auth/enable2fa')
			.then(response => {
				console.log(response);
				setQrCode(response.data.qrcode);
			})
	}, []);

  return (
	<div className='create-room-popup copy-book-background retro-border-box trans-pink-box'>
		<h1>Scan the QR Code</h1>
		<QRCode value={qrCode} />
		<input className="popup-input" type="text" placeholder='Insert Qrcode' value={code} onChange={(e) => setCode(e.target.value)}/>
		<div className='create-button-container'>
			<ClassButton name="Enable" classes="retro-button pink-header confirm-new-chat-btn" onClick={handleEnable2fa} />
			<ClassButton name="Cancel" classes="retro-button pink-header confirm-new-chat-btn" onClick={onClose}/>
		</div>
	</div>
  )
}

export default Enable2fa