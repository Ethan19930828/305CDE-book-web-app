DOCUMENT:
    server: contains api code.
        bookapi.js: 
        	use restify, mongojs, restify-memory-session
   		
    client: contains web app code.
    	index.html:
    		the spa for book web app.
    	static:
    		the static resources, images, scripts, css.

    test: contains test code.
    	api.js:
    		use the http to mock some client request to the server.

START:
	before:
		# brew install mongodb
		# brew install node
		# sudo mongod 
	server:
		# cd server
		# npm install mongojs, restify, restify-memory-session
		# node bookapi.js

	test:
		# cd test
		# npm install querystring