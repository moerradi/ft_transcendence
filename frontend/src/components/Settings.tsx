import React, { useEffect, useState } from 'react'
import enable2fasvg from './../assets/svg/enable2fa.svg'
import nickname from './../assets/svg/nickname.svg'
import editpic from './../assets/svg/editpic.svg'
import heart from './../assets/svg/heart.svg'
import greenflower from './../assets/svg/greenflower.svg'
import redflower from './../assets/svg/redflower.svg'
import ImgUpload from './ImgUpload'
import ImgButton from './ImgButton'
import CustomToggleButton from './CustomToggle'
import Popup from './Popup'
import Enable2fa from './Enable2fa'
import { useEnable2fa } from '../hooks/useEnable2fa'
import { useAuth } from '../useAuth'
import api from '../api/api'
import Cookies from 'js-cookie'

function Settings() {

	const { user, setUserState } = useAuth();
	const enable2fa = useEnable2fa((state) => state.enable2fa);
	const setEnable2fa = useEnable2fa((state) => state.setEnable2fa);

	useEffect(()=>{
		const twofa = Cookies.get('__2fa');
		setEnable2fa(twofa === "true");

	}, [])

//nickname logic:	
	const [newNickname, setNickname] = useState('');
	const handleNewNickname = () => {
		api.post('/profile/update/login', { login: newNickname })
		  .then(response => {
			console.log(response);

			setNickname('');
			setUserState({ ...user, login: newNickname });
		  })
		  .catch(error => {
			// Handle error
		  });
	  };
	const handleNicknameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(event.target.value);
	};

//2fa logic:

const handleToggle = (isToggled: boolean) => {
	setEnable2fa(isToggled);
	setShowOptions(true);
};

// const handleToggle = (isToggled: boolean) => {
	// 	console.log(`Toggle button is ${isToggled ? 'on' : 'off'}`);
	// };
	
	const handleToggleClick = async () => {
		if (enable2fa)
		await api.post('/auth/disable2fa')
		.then(response => {
			console.log("disabaled succefly");
		})
		.catch(error => {
			console.log(error);
		})
		setEnable2fa(!enable2fa);
		setShowOptions(true);
	}
	
	const [showOptions, setShowOptions] = useState(false);
	
	const handlePlusNewChat = () => {
		
	}
	
	const handleSubmitQR = () => {
		console.log('Submit QR!');
		setShowOptions(false);
		// api.post{('/auth/enable2fa')}
	};

	const handleClosePopup = () => {
		setShowOptions(false);
		setEnable2fa(!enable2fa);  
	}

	return (
		<div className='settings-container'>
			<div className='copy-book-background retro-border-box trans-pink-box setting-box'>
				<img className="svg-text-edit" src={editpic} alt="" />
				<ImgUpload classes="retro-button pink-header"/>
			</div>
			<div className='copy-book-background retro-border-box trans-pink-box setting-box'>

				<img className="svg-text svg-text-margin" src={nickname} alt="" />
				<div className='nickname-input'>
					<input type="text" placeholder='New Nickname' value={newNickname}  onChange={handleNicknameInputChange}/>
					<ImgButton classes="backgroundless-image-button" src={heart} alt="confirm" onClick={handleNewNickname} />
				</div>
			</div>
			<div className='copy-book-background retro-border-box trans-pink-box setting-box'>
				<img className="svg-text" src={enable2fasvg} alt="" />
				<div className='toggle-container'>
					<CustomToggleButton 
						isToggled={enable2fa}
						toggleCLick={handleToggleClick}
						untoggledImage={redflower}
						toggledImage={greenflower}
					/>
				</div>
				{ showOptions && enable2fa && <Popup onClose={handleClosePopup} content={<Enable2fa onClose={handleClosePopup} onSubmit={handleSubmitQR}/>} />}

			</div>
		</div>
	);
}

export default Settings