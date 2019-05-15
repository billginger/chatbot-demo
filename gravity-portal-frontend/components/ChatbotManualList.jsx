import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, Table, Modal, message } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotManualList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		fetch('/api/chatbot/manual').then(res => (
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
				<Breadcrumb.Item>{i18n.chatbotManual}</Breadcrumb.Item>
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
		// Handle
		// Table
		const columns = [{
			title: i18n.chatbotLabelContent,
			dataIndex: 'content',
			render: (text, record) => (
				<React.Fragment>
					{text}
					<div className="tc-table-actions">
						<a onClick={e => {console.log(e)}}>{i18n.chatbotManualIntervene}</a>
						<a onClick={e => {console.log(e)}}>{i18n.chatbotManualClose}</a>
					</div>
				</React.Fragment>
			)
		}, {
			title: i18n.chatbotLabelFrom,
			dataIndex: 'from'
		}, {
			title: i18n.chatbotLabelChannel,
			dataIndex: 'channel',
			render: text => (
				text == 1 ? 'WeChat' : 'Facebook'
			)
		}, {
			title: withTimeZone(i18n.labelCreatedAt),
			dataIndex: 'createdAt',
			render: text => getLocalDate(text)
		}];
		const content = (
			<Table className="tc-table" rowKey="_id" dataSource={data} columns={columns} />
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(ChatbotManualList);
