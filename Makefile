deploy:
	GULP_ENV=production gulp config
	gulp
	s3_website push --site dist
	gulp clean
	gulp config
