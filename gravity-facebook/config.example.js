module.exports = {
	db_url: 'mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/gravity-facebook?authSource=admin',
	ip_whitelist: ['<IP_ADDRESS>'],
	log_file_access: '/logs/gravity_facebook_access.log',
	log_file_access_format: ':method :url :status :content-length :response-timems',
	log_file_app: '/logs/gravity_facebook_app.log',
	log_file_error: '/logs/gravity_facebook_error.log',
	log_file_size_max: 10485760,
	access_token: '<PAGE_ACCESS_TOKEN>',
	verify_token: '<YOUR_VERIFY_TOKEN>'
}
