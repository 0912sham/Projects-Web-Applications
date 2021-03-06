var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars'); 
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');




var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();


app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

// express session
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));

// express validator
app.use(expressValidator({
	errorFormattter: function(param,msg,value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.lenght){
			formParam += '['+ namespace.shift() +']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value,

		};
	}

}));

// connect flash
app.use(flash());

// global vars
app.use(function(req,res,next){
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
next();
});

app.use('/',routes);
app.use('/users',users);

// set port

app.set('port',(process.env.PORT || 8800));
 
app.listen(app.get('port'),function(){
	console.log('Server started on port'+app.get('port'));
});










