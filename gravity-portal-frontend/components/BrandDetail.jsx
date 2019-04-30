import React from 'react';
import { injectIntl } from 'react-intl';
import { Typography, Icon, Button } from 'antd';
const { Text } = Typography;

class BrandDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/brand/${id}`).then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			this.setState({
				data
			});
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({
				errMsg
			});
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg, data } = this.state;
		// Handle Error
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
		// Display Data
		return (
			<p>{data.name}</p>
		);
	}
}

export default injectIntl(BrandDetail);
