module.exports = {
	db_url: 'mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/gravity-portal?authSource=admin',
	log_file_access: '/logs/gravity_portal_access.log',
	log_file_access_format: ':method :url :status :content-length :response-timems',
	log_file_app: '/logs/gravity_portal_app.log',
	log_file_error: '/logs/gravity_portal_error.log',
	log_file_size_max: 10485760
}
