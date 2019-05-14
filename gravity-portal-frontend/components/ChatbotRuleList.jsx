import React from 'react';
import { injectIntl } from 'react-intl';
import { Breadcrumb, Typography, Icon, Table } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotRuleList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		fetch('/api/chatbot/rule').then(res => (
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
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.chatbotRule}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			const warnText = (
				<Text type="warning">{warnMessage}</Text>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={warnText} />
			);
		}
		// Loading
		if (!data) {
			const loading = (
				<Icon type="loading" />
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={loading} />
			);
		}
		// Table
		const columns = [{
			title: i18n.labelName,
			dataIndex: 'name'
		}, {
			title: i18n.chatbotRuleKeyword,
			dataIndex: 'keywords'
		}, {
			title: withTimeZone(i18n.labelCreatedAt),
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: text => {getLocalDate(text)}
		}, {
			title: withTimeZone(i18n.labelUpdatedAt),
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: text => {getLocalDate(text)}
		}];
		const content = (
			<Table dataSource={data} columns={columns} />
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(ChatbotRuleList);
