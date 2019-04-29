import React from 'react';
import { injectIntl } from 'react-intl';
import { Form, Input, Button, Alert } from 'antd';

class BrandAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			buttonLoading: false
		}
	}
	render() {
		const i18n = this.props.intl.messages;
		const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
		const { errMsg, buttonLoading } = this.state;
		let alertMessage;
		if (errMsg instanceof Object && errMsg.id && errMsg.key && errMsg.value) {
			alertMessage = this.props.intl.formatMessage(
				{ id: errMsg.id },
				{ key: i18n[errMsg.key], value: errMsg.value }
			);
		} else if (errMsg.length) {
			alertMessage = i18n[errMsg] || i18n.msgError;
		}
		console.log('errMsg:');
		console.log(errMsg);
		console.log('alertMessage:');
		console.log(alertMessage);
		// Form
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
		const tailFormItemLayout = { wrapperCol: { offset: 4, span: 16 } };
		const handleSubmit = e => {
			e.preventDefault();
			validateFieldsAndScroll((err, values) => {
				if (err) return;
				this.setState({
					buttonLoading: true
				});
				fetch('/api/brand/add', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}).then(res => (
					res.ok ? res.json() : Promise.reject(res)
				)).then(data => {
					this.props.history.push(`/brand/${data._id}`);
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
			this.setState({
				errMsg: ''
			});
		};
		const formAlert = (
			alertMessage && <Alert className="tc-form-alert" message={alertMessage} type="error" />
		);
		return (
			<Form {...formItemLayout} onSubmit={handleSubmit} style={{ marginTop: 40 }}>
				<Form.Item label={i18n.labelName}>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }]
					})(
						<Input placeholder={i18n.labelName} onChange={handleInputChange} />
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
	}
}

export default injectIntl(Form.create()(BrandAdd));
