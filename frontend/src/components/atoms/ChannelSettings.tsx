import React, { useState } from 'react';
import ClassButton from '../ClassButton';
import useChatParams from '../../hooks/useChatParams';
import { ChannelType } from '../../modules/channel';
import api from '../../api/api';
import { toast } from 'react-hot-toast';


function ChannelSettings({onClose}: {onClose: () => void}) {
	
	const setActiveChannelNull = useChatParams(state => state.setActiveChannelNull);
	const setActiveChannelOptionsNull = useChatParams(state => state.setActiveChannelOptionsNull);
	const activeChannelOptions = useChatParams(state => state.activeChannelOptions);
	const activeChannelSettingsSave = useChatParams(state => state.activeChannelSettingsSave);
	const setActiveChannelOptionsName = useChatParams(state => state.setActiveChannelOptionsName);
	const setActiveChannelSettingsSave = useChatParams(state => state.setActiveChannelSettingsSave);
	const [tmpChannelName, setTmpChannelName] = React.useState<string>(activeChannelOptions?.name ?? "");
	const [tmpPassword, setTmpPassword] = useState("");
	const [tmpChannelType, setTmpChannelType] = useState(activeChannelOptions?.type ?? ChannelType.PUBLIC);

	const handleSaveChannelSettings = () => {
		console.log('Save Channel Settings');
		if (activeChannelOptions)
			setActiveChannelOptionsName(activeChannelOptions?.id, tmpChannelName);
		api.put('/channels/' + activeChannelOptions?.id, {
			name: tmpChannelName,
			password: tmpPassword,
			type: tmpChannelType
		}).then((res) => {
			console.log(res);
			toast.success('Channel Settings Saved');
		}).catch((err) => {
			console.log(err);
			toast.error('Error Saving Channel Settings');
		});
		setActiveChannelSettingsSave(!activeChannelSettingsSave);
		setActiveChannelOptionsNull();
		setActiveChannelNull();
		onClose();
	}


const handleChangeToPublic = () => {
    setTmpChannelType(ChannelType.PUBLIC);
  };
  const handleChangeToPrivate = () => {
    setTmpChannelType(ChannelType.PRIVATE);
  };
  const handleChangeToProtected = () => {
	setTmpChannelType(ChannelType.PROTECTED);
  };

const publicClasses = 'new-room-option-btn new-room-option-first-btn ' + (tmpChannelType === ChannelType.PUBLIC ? 'green-bg' : 'unclicked-new-room-option coral-bg');
const privateClasses = 'new-room-option-btn ' + (tmpChannelType === ChannelType.PRIVATE ? 'green-bg' : 'unclicked-new-room-option coral-bg');
const protectedClasses = 'new-room-option-btn ' + (tmpChannelType === ChannelType.PROTECTED ? 'green-bg' : 'unclicked-new-room-option coral-bg');

return (
    <div className="create-room-popup copy-book-background retro-border-box trans-orange-box">
      <h1 className="create-room-title">Channel Settings</h1>
      <input
        className="popup-input"
        type="text"
        placeholder="Room Name:"
        value={tmpChannelName}
        onChange={(e) => setTmpChannelName(e.target.value)}
      />
      <div className="create-chat-options">
        <ClassButton
          name="Public"
          classes={publicClasses}
          onClick={handleChangeToPublic}
        />
        <ClassButton
          name="Private"
          classes={privateClasses}
          onClick={handleChangeToPrivate}
        />
        <ClassButton
          name="Protected"
          classes={protectedClasses}
          onClick={handleChangeToProtected}
        />
      </div>
      {tmpChannelType === ChannelType.PROTECTED && (
        <input
          className="popup-input"
          type="password"
          placeholder="Password:"
          value={tmpPassword}
          onChange={(e) => setTmpPassword(e.target.value)}
        />
      )}
      <div className="create-button-container">
        <ClassButton
          name="Save"
          classes="retro-button orange-header confirm-new-chat-btn"
          onClick={handleSaveChannelSettings}
        />
        <ClassButton
          name="Cancel"
          classes="retro-button orange-header confirm-new-chat-btn"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default ChannelSettings