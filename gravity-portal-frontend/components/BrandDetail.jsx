import React from 'react';
import { injectIntl } from 'react-intl';
import { Typography, Icon } from 'antd';
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
			<div>
				<h1>{data.name}</h1>
				<div>微信公众号：未绑定</div>
				<div>Facebook：未绑定</div>
				<div>{data.createdBy} 创建于 {data.createdAt}</div>
			</div>
		);
	}
}

export default injectIntl(BrandDetail);
