module.exports = {
	db_url: 'mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/chatbot-portal?authSource=admin',
	ip_whitelist: ['<IP_ADDRESS>'],
	log_file_access: '/logs/chatbot_portal_access.log',
	log_file_access_format: ':method :url :status :content-length :response-timems',
	log_file_app: '/logs/chatbot_portal_app.log',
	log_file_error: '/logs/chatbot_portal_error.log',
	log_file_size_max: 10485760
}
