import React from 'react';
import { injectIntl } from 'react-intl';
import { Typography, Icon } from 'antd';
const { Text } = Typography;

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		fetch('/api/system/home').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			this.setState({ data });
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg, data } = this.state;
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			return (
				<Text type="warning">{warnMessage}</Text>
			);
		}
		// Loading
		if (!data) {
			return (
				<Icon type="loading" />
			);
		}
		// Page
		return (
			<p>Weclome to Gravity Prototype!</p>
		);
	}
}

export default injectIntl(Home);
