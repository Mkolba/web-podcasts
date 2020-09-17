import React from 'react';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './index.css';
import bridge from '@vkontakte/vk-bridge';


import Home from './panels/Home';
import Creation from './panels/Creation/Creation';
import Editor from './panels/Editor/Editor';
import Posting from './panels/Posting/Posting';
import Posted from './panels/Posted';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activePanel: 'home',
			history: ['home'],
			globState: {timecodes: [], fadeIn: false, fadeOut: false},
			user: {}
		}
	}

	componentDidMount() {
		window.onpopstate = this.goBack;

		bridge.subscribe(({ detail: { type, data }}) => {
	    if (type === 'VKWebAppUpdateConfig' && data.scheme) {
	      this.setScheme(data.scheme);
			}
  	})

		bridge.send("VKWebAppGetUserInfo").then(response => {
			this.setState({user: response});
		})

	}

	setScheme = (scheme) => {
		let isLight = ['bright_light', 'client_light'].includes(scheme);
		this.setState({ scheme: isLight ? 'bright_light' : 'space_gray' });
		document.getElementById('app__body').setAttribute('scheme', scheme);
		bridge.send('VKWebAppSetViewSettings', {
				 'status_bar_style': isLight ? 'dark' : 'light',
				 'action_bar_color': isLight ? '#ffffff' : '#191919',
				 'navigation_bar_color': isLight ? '#ffffff' : '#191919',
		}).catch(e => {});
	}

	commit = (data, place) => {
		if (place === 'target') {
			this.setState({ targetData: data })
		} else {
			this.setState({ monthlyData: data })
		}

	}

	go = (panel) => {
		window.history.pushState({panel: panel}, panel);
		this.setState({ history: [...this.state.history, panel], activePanel: panel })
	}

	goBack = () => {
		let history = this.state.history;

		if (history.length === 1) {
      bridge.send("VKWebAppClose", {"status": "success" });
		} else {
			if (history[history.length - 1] === 'home.modal') {
				this.setState({ activeModal: null });
			} else {
				this.setState({ activePanel: history[history.length - 2] });
			}
			history.pop();
		}

	}

	render() {
		const props = {go: this.go, goBack: this.goBack, data: this.state.globState, commit: this.commit}

		return (
			<View activePanel={this.state.activePanel} header={!(this.state.activePanel.indexOf('page') > -1)}>
				<Home id='home' {...props}/>
				<Creation id='creation' {...props} />
				<Editor id='editor' {...props}/>
				<Posting id='posting' {...props}/>
				<Posted id='posted' {...props}/>
			</View>
		);
	}
}

export default App;
