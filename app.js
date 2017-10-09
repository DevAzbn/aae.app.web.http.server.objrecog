'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var azbn = new require(__dirname + '/../../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);



var argv = require('optimist').argv;

azbn.setMdl('config', require('./config/main'));

azbn.mdl('config').port.http = argv.httpport || azbn.mdl('config').port.http || 3000;
azbn.mdl('config').port.https = argv.httpsport || azbn.mdl('config').port.https || 3001;

azbn.setMdl('https', require('https'));

var express = require('express');
azbn.setMdl('express', express());

//azbn.setMdl('passport', require('passport'));

azbn.mdl('express').set('trust proxy', 1);

azbn.mdl('https')
	.createServer({
		key : azbn.mdl('fs').readFileSync(azbn.mdl('cfg').cert.key),
		cert : azbn.mdl('fs').readFileSync(azbn.mdl('cfg').cert.cert),
		passphrase : 'aae.app.dev.fi9esdf9234',
	}, azbn.mdl('express'))
	.listen(azbn.mdl('config').port.https)
;

// компрессия
azbn.mdl('express').use(require('compression')());

// логгер
//azbn.mdl('express').use((new require(azbn.mdl('cfg').path.app + '/logger/default')(azbn)));

// боди-парсер
var bodyParser = require('body-parser');
azbn.mdl('express').use(bodyParser.json({limit : 10 * 1024 * 1024}));
azbn.mdl('express').use(bodyParser.raw({limit : 10 * 1024 * 1024}));
azbn.mdl('express').use(bodyParser.text({limit : 10 * 1024 * 1024}));
azbn.mdl('express').use(bodyParser.urlencoded({
	extended : true,
	limit : 10 * 1024 * 1024
}));

// куки-парсер
azbn.mdl('express').use(require('cookie-parser')());

var express_session = require('express-session');
var NeDBStore = require('connect-nedb-session')(express_session);

azbn.mdl('express').use(express_session({
	//genid : function(req) {
	//	return genuuid();
	//},
	name : 'aae.app.session',
	secret : 'aae.app.dev.fi9esdf9234',//azbn.randstr(),
	resave : false,
	saveUninitialized : false,
	proxy: true,
	cookie : {
		path : '/',
		//httpOnly : true,
		//secure : true,
		maxAge : 1000 * 86400 * 30,
	},
	store : new NeDBStore({
		filename : app.path.data + '/sessions/sessions.nedb',
	}),
}));

//azbn.mdl('express').use(azbn.mdl('passport').initialize());
//azbn.mdl('express').use(azbn.mdl('passport').session());

// перепись метода
azbn.mdl('express').use(require('method-override')('_method'));

// сервер статики
azbn.mdl('express').use(express.static(azbn.mdl('config').path.static, {
	index : 'index.html',
	redirect : true,
	setHeaders : function(res, path, stat){
		res.set('x-timestamp' , Date.now());
	},
}));


require(azbn.mdl('config').path.route + '/main.js')(app, azbn);


// ошибки
azbn.mdl('express').use(function(req, res, next){
	res.status(404);
	app.log.debug('Not found URL: %s', req.url);
	res.send({ error: 'Not found' });
	return;
});

azbn.mdl('express').use(function(err, req, res, next){
	app.log.error('Internal error(%d): %s', res.statusCode, err.message);
	app.log.error(err.stack);
	res.status(err.status || 500).send({ error: err.message });
	return;
});

azbn.mdl('express').get('/error', function(req, res, next){
	//next(new Error('Error!'));
	app.log.error(new Error('Error!'));
});




azbn.setMdl('http', azbn.mdl('express').listen(azbn.mdl('config').port.http, function() {
	app.log.info('App listening on port ' + azbn.mdl('config').port.http);
}));

/*
process.on('exit', function() {
	azbn.unload('http');
	azbn.unload('https');
	app.log.warn('http- and https-servers is stoped');
});
*/