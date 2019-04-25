import React from 'react';
import { injectIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

class BrandAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: ''
		}
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg } = this.state;
		// Form
		const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
		const tailFormItemLayout = { wrapperCol: { offset: 4, span: 16 } };
		const handleSubmit = e => {
			e.preventDefault();
		};
		const handleInputChange = e => {
			console.log(e);
		};
		return (
			<Form {...formItemLayout} onSubmit={handleSubmit}>
				<Form.Item label={i18n.labelName}>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }]
					})(
						<Input placeholder={i18n.labelName} onChange={handleInputChange} />
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">{i18n.actionSubmit}</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default injectIntl(Form.create()(BrandAdd));
