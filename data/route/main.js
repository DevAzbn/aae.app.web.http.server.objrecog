/*
обработчик запроса
*/

function _(app, azbn) {
	
	azbn.mdl('express').set('views', azbn.mdl('config').path.pug);
	azbn.mdl('express').set('view engine', 'pug');
	
	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();
	
	/*
	var strategies = {
		yandex : require('passport-yandex').Strategy,
		google : require('passport-google-oauth20').Strategy,
		github : require('passport-github2').Strategy,
		twitter : require('passport-twitter').Strategy,
		facebook : require('passport-facebook').Strategy,
		vkontakte : require('passport-vkontakte').Strategy,
		mailru : require('passport-mailru').Strategy,
		instagram : require('passport-instagram').Strategy,
	};
	
	azbn.mdl('passport').serializeUser(function(user, done) {
		done(null, user);
	});
	
	azbn.mdl('passport').deserializeUser(function(obj, done) {
		done(null, obj);
	});
	*/
	azbn.mdl('express').get('/api/v1/', (new require('./api/v1')(app, azbn)));
	azbn.mdl('express').post('/api/v1/', (new require('./api/v1')(app, azbn)));
	
	azbn.mdl('express').get('/', (new require('./index')(app, azbn)));
	azbn.mdl('express').get('/webcam/', (new require('./webcam')(app, azbn)));
	azbn.mdl('express').get('/fromfile/', (new require('./fromfile')(app, azbn)));
	
	azbn.mdl('express').post('/upload/default/', multipartMiddleware, (new require('./upload/default')(app, azbn)));
	azbn.mdl('express').post('/upload/dataurl/', (new require('./upload/dataurl')(app, azbn)));
	
	//azbn.mdl('express').get('/auth/logout/', (new require('./auth/logout')(app, azbn)));
	//azbn.mdl('express').get('/profile/', (new require('./profile/index')(app, azbn)));
	
	/*
	for(var strategy in strategies) {
		
		(function(s) {
			
			var provider_config = app.loadJSON('../config/providers/' + s);
			
			azbn.mdl('passport').use(new strategies[s](provider_config.auth || {}, function(accessToken, refreshToken, profile, done) {
				
				azbn.setMdl('ig', require('instagram-node').instagram());
				
				azbn.mdl('ig').use({
					access_token : accessToken,
				});
				
				azbn.mdl('ig').add_comment('bhJOwGx8yZ', 'dkjhf kshfk dshk ds kdsjhfk ds', function(err, result, remaining, limit) {});
				
				done(null, profile);
				
			}));
			
			azbn.mdl('express').get('/auth/by/' + s + '/', azbn.mdl('passport').authenticate(s, provider_config.auth_params));
			
			azbn.mdl('express').get('/authorize/by/' + s + '/', azbn.mdl('passport').authenticate(s, {
				failureRedirect : '/error',
				//successRedirect : '/authorized/by/' + s + '/',
			}), function(req, res) {
				req.session.save(function(err){
					res.redirect(307, '/authorized/by/' + s + '/');
				});
			});
			
			azbn.mdl('express').get('/authorized/by/' + s + '/', (new require('./authorized/by')(app, azbn)));
			
		})(strategy);
		
	}
	*/
	
	
	/*
	
	azbn.mdl('passport').serializeUser(function(user, done) {
		
		app.saveJSON('../data/json/passport/' + user._id, user);
		
		done(null, user._id);
		
	});
	
	azbn.mdl('passport').deserializeUser(function(id, done) {
		
		var user = app.loadJSON('../data/json/passport/' + id);
		
		done(err, user);
		
	});
	
	*/
	
	/*
	azbn.mdl('express').get('/auth/logout/', (new require('./auth/logout')(app, azbn)));
	azbn.mdl('express').get('/auth/by/:service/', (new require('./auth/by')(app, azbn)));
	azbn.mdl('express').get('/authorize/by/:service/', (new require('./authorize/by')(app, azbn)));
	azbn.mdl('express').get('/authorized/by/:service/', (new require('./authorized/by')(app, azbn)));
	*/
	
	
	
	
	//azbn.mdl('express').get('/page/start/', (new require('./page/start')(app, azbn)));
	//azbn.mdl('express').get('/page/codefromyandex/', (new require('./page/codefromyandex')(app, azbn)));
	//azbn.mdl('express').put('/', (new require('./route/event/item/put')(app, azbn)));
	//azbn.mdl('express').delete('/event/:year/:month/:day/', (new require('./route/event/item/delete')(app, azbn)));
	
}

module.exports = _;