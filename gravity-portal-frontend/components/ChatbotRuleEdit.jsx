import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Input, Checkbox, Button, Alert, Icon } from 'antd';
import PortalContent from './PortalContent.jsx';
const { TextArea } = Input;

class ChatbotRuleEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: '',
			buttonLoading: false
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/chatbot/rule/${id}`).then(res => (
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
		const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
		const { errMsg, data, buttonLoading } = this.state;
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
		const tailFormItemLayout = { wrapperCol: { offset: 4, span: 16 } };
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/chatbot/rule">{i18n.chatbotRule}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.labelEdit}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Error
		let alertMessage;
		if (errMsg) {
			if (errMsg.indexOf('{') == 0) {
				const msg = JSON.parse(errMsg);
				alertMessage = this.props.intl.formatMessage(
					{ id: msg.id },
					{ key: i18n[msg.key], value: msg.value }
				);
			} else {
				alertMessage = i18n[errMsg] || i18n.msgError;
			}
		}
		const formAlert = (
			alertMessage && <Alert className="tc-form-alert" message={alertMessage} type="error" />
		);
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
		const handleSubmit = e => {
			e.preventDefault();
			validateFieldsAndScroll((err, values) => {
				if (err) return;
				this.setState({ buttonLoading: true });
				const id = this.props.match.params.id;
				fetch(`/api/chatbot/rule/edit/${id}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}).then(res => (
					res.ok ? res.json() : Promise.reject(res)
				)).then(data => {
					this.props.history.push(`/chatbot/rule/${data._id}`);
				}).catch(err => {
					const errMsg = err.statusText || err;
					this.setState({
						errMsg,
						buttonLoading: false
					});
				});
			});
		};
		const handleInputChange = () => {
			this.setState({ errMsg: '' });
		};
		// Page
		const content = (
			<Form className="tc-form" {...formItemLayout} onSubmit={handleSubmit}>
				<Form.Item label={i18n.labelName}>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }],
						initialValue: data.name
					})(
						<Input placeholder={i18n.labelName} onChange={handleInputChange} />
					)}
				</Form.Item>
				<Form.Item label={i18n.chatbotRuleKeyword}>
					{getFieldDecorator('keywords', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }],
						initialValue: data.keywords.join('\n')
					})(
						<TextArea placeholder={i18n.chatbotRuleKeyword} onChange={handleInputChange} autosize={
							{ minRows: 4, maxRows: 20 }
						} />
					)}
				</Form.Item>
				<Form.Item label={i18n.chatbotRuleReplyContent}>
					{getFieldDecorator('replyContent', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }],
						initialValue: JSON.stringify(data.replyContent)
					})(
						<TextArea placeholder={i18n.chatbotRuleReplyContent} onChange={handleInputChange} autosize={
							{ minRows: 4, maxRows: 20 }
						} />
					)}
				</Form.Item>
				<Form.Item label={i18n.chatbotRuleReplyOption}>
					{getFieldDecorator('replyOptions', {
						initialValue: JSON.stringify(data.replyOptions)
					})(
						<TextArea placeholder={i18n.chatbotRuleReplyOption} onChange={handleInputChange} autosize={
							{ minRows: 4, maxRows: 20 }
						} />
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout} style={{margin:0}}>
					{getFieldDecorator('allowGuess', {
						valuePropName: 'checked',
						initialValue: data.allowGuess
					})(
						<Checkbox onChange={handleInputChange}>
							{i18n.chatbotRuleAllowGuess}
						</Checkbox>
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					{getFieldDecorator('enableWaiting', {
						valuePropName: 'checked',
						initialValue: data.enableWaiting
					})(
						<Checkbox onChange={handleInputChange}>
							{i18n.chatbotRuleEnableWaiting}
						</Checkbox>
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					{formAlert}
					<Button type="primary" htmlType="submit" loading={buttonLoading}>
						{i18n.actionSubmit}
					</Button>
				</Form.Item>
			</Form>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(Form.create()(ChatbotRuleEdit));
