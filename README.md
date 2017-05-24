# QUICK STARTER 
How to set up a mean stack single page application
(https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application)

## APP STRUCTURE

    - app
        ----- models/
        ---------- nerd.js <!-- the nerd model to handle CRUD -->
    ----- routes.js
    - config
        ----- db.js
    - node_modules <!-- created by npm install -->
    - public <!-- all frontend and angular stuff -->
    ----- css
    ----- js
    ---------- controllers <!-- angular controllers -->
    ---------- services <!-- angular services -->
    ---------- app.js <!-- angular application -->
    ---------- appRoutes.js <!-- angular routes -->
    ----- img
    ----- libs <!-- created by bower install -->
    ----- views
    ---------- home.html
    ---------- nerd.html
    ---------- geek.html
    ----- index.html
    - .bowerrc <!-- tells bower where to put files (public/libs) -->
    - bower.json <!-- tells bower which files we need -->
    - package.json <!-- tells npm which packages we need -->
    - server.js <!-- set up our node application -->


## NODE APPLICATION

package.json
```json
	{
		"name": "starter-node-angular",
		"main": "server.js",
		"dependencies": {
			"express" : "~4.5.1",
			"mongoose" : "~3.8.0",
			"body-parser" : "~1.4.2",
			"method-override" : "~2.0.2"        
		}
	}
```
run
   	$ npm install

setting up node application with server.js
```javascript
	// server.js

	// modules =================================================
	var express        = require('express');
	var app            = express();
	var bodyParser     = require('body-parser');
	var methodOverride = require('method-override');

	// configuration ===========================================

	// config files
	var db = require('./config/db');

	// set our port
	var port = process.env.PORT || 8080;

	// connect to our mongoDB database
	// (uncomment after you enter in your own credentials in config/db.js)
	// mongoose.connect(db.url);

	// get all data/stuff of the body (POST) parameters
	// parse application/json
	app.use(bodyParser.json());

	// parse application/vnd.api+json as json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
	app.use(methodOverride('X-HTTP-Method-Override'));

	// set the static files location /public/img will be /img for users
	app.use(express.static(__dirname + '/public'));

	// routes ==================================================
	require('./app/routes')(app); // configure our routes

	// start app ===============================================
	// startup our app at http://localhost:8080
	app.listen(port);

	// shoutout to the user
	console.log('Magic happens on port ' + port);

	// expose app
	exports = module.exports = app;
```

Config db (config/db.js) :
```code
	// config/db.js
	    module.exports = {
		url : 'mongodb://localhost/stencil-dev'
	    }
```

Example to create records in database with Mongoose model (CRUD) : (here creation of a "Nerd" model)
in app/models/nerd.js :
```javascript
	// app/models/nerd.js
	// grab the mongoose module
	var mongoose = require('mongoose');

	// define our nerd model
	// module.exports allows us to pass this to other files when it is called
	module.exports = mongoose.model('Nerd', {
	    name : {type : String, default: ''}
	});
```

Setting up routes (app/routes.js) :
```javascript
	// app/routes.js

	// grab the nerd model we just created
	var Nerd = require('./models/nerd');

	    module.exports = function(app) {

		// server routes ===========================================================
		// handle things like api calls
		// authentication routes

		// sample api route
		app.get('/api/nerds', function(req, res) {
		    // use mongoose to get all nerds in the database
		    Nerd.find(function(err, nerds) {

		        // if there is an error retrieving, send the error.
		                        // nothing after res.send(err) will execute
		        if (err)
		            res.send(err);

		        res.json(nerds); // return all nerds in JSON format
		    });
		});

		// route to handle creating goes here (app.post)
		// route to handle delete goes here (app.delete)

		// frontend routes =========================================================
		// route to handle all angular requests
		app.get('*', function(req, res) {
		    res.sendfile('./public/views/index.html'); // load our public/index.html file
		});

	    };
```

to set up database with mongoose : https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications

BACKEND DONE !

Index view (public/views/index.html):
```html
	 <!-- public/views/index.html -->
	<!doctype html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">

	    <title>Starter MEAN Single Page Application</title>

	</head>
	<body>

	    we did it!

	</body>
	</html>
```

Test server with :
	$ node server.js

and visit http://localhost:8080


## FRONTEND WITH ANGULAR

Bower : frontend tool to manage frontend resources (bootstrap, angular ...)
	install with :
	$ npm install -g bower

config bower : in .bowerrc
```json
	{
	    "directory": "public/libs"
	}
```

in bower.json
```json
	{
	    "name": "starter-node-angular",
	    "version": "1.0.0",
	    "dependencies": {
		"bootstrap": "latest",
		"font-awesome": "latest",
		"animate.css": "latest",
		"angular": "latest",
		"angular-route": "latest"   
	    }
	}
```

run bower with :
	$ bower install

### SETTING UP ANGULAR APP
controllers, services and routes (no page refreshement)

#### Angular Controller

in public/js/controllers/MainCtrl.js :
```javascript
	// public/js/controllers/MainCtrl.js
	angular.module('MainCtrl', []).controller('MainController', function($scope) {

	    $scope.tagline = 'To the moon and back!';

	});
```

in public/js/controllers/NerdCtrl.js :
```javascript
	// public/js/controllers/NerdCtrl.js
	angular.module('NerdCtrl', []).controller('NerdController', function($scope) {

	    $scope.tagline = 'Nothing beats a pocket protector!';

	});
```

#### Angular Services :
API calls to the Node backend from Angular frontend using $http or $resource

in public/js/services/NerdService.js :
```javascript
	// public/js/services/NerdService.js
	angular.module('NerdService', []).factory('Nerd', ['$http', function($http) {

	    return {
		// call to get all nerds
		get : function() {
		    return $http.get('/api/nerds');
		},

		        // these will work when more API routes are defined on the Node side of things
		// call to POST and create a new nerd
		create : function(nerdData) {
		    return $http.post('/api/nerds', nerdData);
		},

		// call to DELETE a nerd
		delete : function(id) {
		    return $http.delete('/api/nerds/' + id);
		}
	    }

	}]);
```

#### Angular Routes :
defined in public/js/appRoutes.js :
```javascript
	// public/js/appRoutes.js
	angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
		    templateUrl: 'views/home.html',
		    controller: 'MainController'
		})

		// nerds page that will use the NerdController
		.when('/nerds', {
		    templateUrl: 'views/nerd.html',
		    controller: 'NerdController'
		});

		$locationProvider.html5Mode(true);

	}]);
```

#### Update View Files
public/views/index.html :
```html
	<!-- public/index.html -->
	<!doctype html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <base href="/">

	    <title>Starter Node and Angular</title>

	    <!-- CSS -->
	    <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css">
	    <link rel="stylesheet" href="css/style.css"> <!-- custom styles -->

	    <!-- JS -->
	    <script src="libs/angular/angular.min.js"></script>
	    <script src="libs/angular-route/angular-route.min.js"></script>

	    <!-- ANGULAR CUSTOM -->
	    <script src="js/controllers/MainCtrl.js"></script>
	    <script src="js/controllers/NerdCtrl.js"></script>
	    <script src="js/services/NerdService.js"></script>
	    <script src="js/appRoutes.js"></script>
	    <script src="js/app.js"></script>
	</head>
	<body ng-app="sampleApp" ng-controller="NerdController">
	<div class="container">

	    <!-- HEADER -->
	    <nav class="navbar navbar-inverse">
		<div class="navbar-header">
		    <a class="navbar-brand" href="/">Stencil: Node and Angular</a>
		</div>

		<!-- LINK TO OUR PAGES. ANGULAR HANDLES THE ROUTING HERE -->
		<ul class="nav navbar-nav">
		    <li><a href="/nerds">Nerds</a></li>
		</ul>
	    </nav>

	    <!-- ANGULAR DYNAMIC CONTENT -->
	    <div ng-view></div>

	</div>
	</body>
	</html>
```

public/views/home.html :
```html
	<!-- public/views/home.html -->

	<div class="jumbotron text-center">
	    <h1>Home Page 4 Life</h1>

	    <p>{{ tagline }}</p>
	</div>
```

public/views/nerd.html :
```html
	<!-- public/views/nerd.html -->

	<div class="jumbotron text-center">
	    <h1>Nerds and Proud</h1>

	    <p>{{ tagline }}</p>
	</div>
```

### ANGULAR DEPENDENCIES
in public/js/app.js :
```javascript
	// public/js/app.js
	angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService']);
```

for api calls with angularjs go to:
https://www.sitepoint.com/api-calls-angularjs-http-service/
