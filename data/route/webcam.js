'use strict';

function _(app, azbn) {
	
	app.log.info(__filename);
	
	return function(req, res) {
		
		//if(req && req.session && req.session.authorized && req.session.authorized.by) {
		//	
		//	res.redirect(307, '/authorized/by/' + req.session.authorized.by + '/');
		//	
		//} else {
			
			res.render('webcam', {
				html : {
					head : {
						title : 'webcam',
					},
				},
			});
			
		//}
		
	};
}

//app.loadJSON('../config/yandex-app'),

module.exports = _;