import React, { useEffect } from 'react'
import ImgButton from '../ImgButton'
import ban from '../../assets/img/thinban.png'
import mute from '../../assets/img/mute-user.png'
import kick from '../../assets/img/taekwondo-kick.png'
import timeout from '../../assets/img/clock.png'
import ClassButton from '../ClassButton'
import admin from '../../assets/img/adminuser.png'
import demote from '../../assets/img/down-arrow.png'
// import { createRandomChannelUserList } from '../../hooks/useCurrentChat'
import useChatParams from '../../hooks/useChatParams'
import { ChannelUserRole } from '../../modules/channeluser'



function ChannelMembers({onClose}: {onClose: () => void}) {


	const [showAdminOptions, setShowAdminOptions] = React.useState<boolean>(false);
	const [showOwnerOptions, setShowOwnerOptions] = React.useState<boolean>(false);
	const [promoteToAdmin, setPromoteToAdmin] = React.useState<boolean>(false);

	const activeChannelOptions = useChatParams().activeChannelOptions;
	const activeChannelOptionsMembers = useChatParams().activeChannelOptionsMembers;
	const setActiveChannelOptionsMembers = useChatParams().setActiveChannelOptionsMembers;


	// fetch members from channel with id activeChannelOptions.id
	// useEffect(() => { setActiveChannelOptionsMembers(createRandomChannelUserList()) }, [activeChannelOptions]);

	const handleBanMember = () => {
		console.log('Ban Member');
	}

	const handleKickMember = () => {
		console.log('Kick Member');
	}

	const handleTimeoutMember = () => {
		console.log('Timeout Member');
	}

	const handleMuteMember = () => {
		console.log('Mute Member');
	}

	const handlePromoteToAdmin = () => {
		console.log('Promote to Admin');
		setPromoteToAdmin(true);
	}

	const handleDemoteToMember = () => {
		console.log('Demote to Member');
		setPromoteToAdmin(false);
	}

	return (
		<div className='channel-members-popup copy-book-background retro-border-box trans-orange-box'>
			<div className='channel-members-container'>
				<h1 className='channel-members-title'>{activeChannelOptions?.name} Members</h1>
				<div className='channel-members-list scrollable'>
					
					{ activeChannelOptionsMembers.map((member, index) => {

						return (
							<div className='channel-member-box' key={index}>
								<div className='channel-member-info-container'>
									<img className="channel-member-avatar" src={member.avatar} alt="channel member avatar" />
									<span className='channel-member-name'>{member.name}</span>
								</div>
								<div className='channel-member-btns-container'>
									{ (activeChannelOptions?.owner_id === member.id) && (member.role === ChannelUserRole.REGULAR) && <ImgButton src={admin} alt="promote to admin" classes="channel-member-btn" onClick={handlePromoteToAdmin}/> }
									{ (activeChannelOptions?.owner_id === member.id) && (member.role === ChannelUserRole.ADMIN) && <ImgButton src={demote} alt="demote admin" classes="channel-member-btn" onClick={handleDemoteToMember}/> }
									{ (member.role === ChannelUserRole.ADMIN) && <ImgButton src={kick} alt="kick user" classes="channel-member-btn" onClick={handleKickMember}/> }
									{ (member.role === ChannelUserRole.ADMIN) && <ImgButton src={ban} alt="ban user" classes="channel-member-btn" onClick={handleBanMember}/> }
									{ (member.role === ChannelUserRole.ADMIN) && <ImgButton src={timeout} alt="give user a timeout" classes="channel-member-btn" onClick={handleTimeoutMember}/> }
									<ImgButton src={mute} alt="mute user" classes="channel-member-btn" onClick={handleMuteMember}/>
								</div>
							</div>
						)})
					
					}
				</div>	
				<ClassButton name="Close" classes="retro-button orange-header close-channel-members-btn" onClick={onClose}/>
			</div>
		</div>
	)
}

export default ChannelMembers