module.exports = {
	db_url: 'mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/chatbot-facebook?authSource=admin',
	ip_whitelist: ['<IP_ADDRESS>'],
	log_file_access: '/logs/chatbot_facebook_access.log',
	log_file_access_format: ':method :url :status :content-length :response-timems',
	log_file_app: '/logs/chatbot_facebook_app.log',
	log_file_error: '/logs/chatbot_facebook_error.log',
	log_file_size_max: 10485760,
	access_token: '<PAGE_ACCESS_TOKEN>',
	verify_token: '<YOUR_VERIFY_TOKEN>'
}
