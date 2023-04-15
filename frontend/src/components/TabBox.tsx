import React, { useCallback, useContext, useEffect } from 'react';
import ClassButton from './ClassButton';
import ImgButton from './ImgButton';
import { useActiveTab } from '../hooks/useActiveTab';
import { useAuth } from '../useAuth';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import GameSocketContext from "../game/GameContext";
import { useLoggedState } from '../hooks/useLoggedState';

// interface TabBoxProps {
// 	options:[{
// 		tab:string,
// 		elem:JSX.Element
// 	}],
// 	optionas:Array<{
// 		tab:string,
// 		elem:JSX.Element
// 	}>
// }

interface TabBoxObj {
	name: string;
	content: React.ReactNode;
}

interface TabBoxProps {
	imgbtn: boolean;
	options: TabBoxObj[];
	tabcolor: string;
	title: string;
	avatar: string;
}

function TabBox({ imgbtn, options, tabcolor, title, avatar}:TabBoxProps) {
	const[meh, setMeh] = React.useState<any>([]);
	const { user, loading } = useAuth();
	const { login } = useParams();
	// const [activeTab, setActiveTab] = useState(0);
	const activeTab = useActiveTab((state) => state.activeTab);
	const setActiveTab = useActiveTab((state) => state.setActiveTab);
	const loggedState = useLoggedState((state) => state.loggedState);
	const socket = useContext(GameSocketContext);
	const changeTab = (index : number) => {
		setActiveTab(index);
	}

  return (
	<div className='tab-box box-container retro-border-box light-box'>
		
		<div className={"tabs-header " + tabcolor + "-header"}>
			<div className='tabs-container'>
				{options.map(({name, content}, index) => {
					if (imgbtn) {
						return ( <ImgButton classes={activeTab === index? "tab active-tab" : "tab"} key={index} src={name} alt={""} onClick={() => changeTab(index)} /> )
					} else {
						 return ( <ClassButton key={index} name={name} classes={activeTab === index? "tab active-tab" : "tab"} onClick={() => changeTab(index)}/> )
					}
					// <button key={index} className={activeTab === index? "tab active-tab" : "tab"} onClick={() => changeTab(index)}>
					// 	{name}
					// </button>
			})}
			</div>
			<div className='tab-box-title'>
				<h1>{title}</h1>
			</div>
			<div className="tab-box-avatar-container">
				<img src={avatar} className={loggedState} alt='avatar' />
			</div>
		</div>
		
		<div className='tabs-content'>
			
			{options.map(({name, content}, index) => (
				<div key={index} className={activeTab === index? "tab-content active-tab-content" : "tab-content"}>
					{content}
				</div>
			))}
		</div>
	</div>
  );
}

export default TabBox