import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Typography, Icon } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
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
		// Handle Delete
		const handleDelete = e => {
			console.log(e);
		};
		// Handle Delete
		const handleBind = e => {
			console.log(e);
		};
		// Display Data
		return (
			<div>
				<div>
					<h1>{data.name}</h1>
					<Link to={`/brand/edit/${data._id}`}>{i18n.actionEdit}</Link>
					<a onClick={handleDelete}>{i18n.actionDelete}</a>
				</div>
				<div>
					<p>
						{i18n.brandWechatAccount}: {i18n.brandUnbound}
						<a onClick={handleBind}>{i18n.actionBind}</a>
					</p>
					<p>
						Facebook: {i18n.brandUnbound}
						<a onClick={handleBind}>{i18n.actionBind}</a>
					</p>
					<p>{i18n.labelCreatedBy}: {data.createdBy}</p>
					<p>{withTimeZone(i18n.labelCreatedAt)}: {getLocalDate(data.createdAt)}</p>
				</div>
			</div>
		);
	}
}

export default injectIntl(BrandDetail);
