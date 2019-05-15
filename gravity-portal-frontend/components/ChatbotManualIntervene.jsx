import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, List, Tag, Modal } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotManualIntervene extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: '',
			isClosed: false
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/chatbot/manual/${id}`).then(res => (
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
		const { errMsg, data, isClosed } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/chatbot/manual">{i18n.chatbotManual}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.chatbotManualDialogue}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Closed
		if (isClosed) {
			const closedText = (
				<p>{i18n.chatbotManualDialogueClosed}</p>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={closedText} />
			);
		}
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
		const handleClose = e => {
			const action = e.target.textContent;
		};
		// Page
		const listHeader = (
			<div>Header</div>
		);
		const listFooter = (
			<div>Footer</div>
		);
		const content = (
			<List
				className="tc-dialogue"
				bordered
				split={false}
				header={listHeader}
				footer={listFooter}
				dataSource={data}
				renderItem={item => {
					let color = '#2db7f5';
					let className = 'tc-left';
					if (item.direction != 1) {
						color = '#87d068';
						className = 'tc-right';
					}
					return (
						<List.Item>
							<Tag color={color} className={className}>{item.content}</Tag>
						</List.Item>
					);
				}}
			/>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(ChatbotManualIntervene);
