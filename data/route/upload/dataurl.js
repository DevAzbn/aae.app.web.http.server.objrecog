'use strict';

var fs = require('fs');
var cv = require('opencv');

var _item_stroke_color = [255, 255, 255];
var _item_stroke_width = 2;

var threshold_b = [128, 128, 128];
var threshold_t = [255, 255, 255];

function _(app, azbn) {
	
	app.log.info(__filename);
	
	return function(req, res) {
		
		if(req.body && req.body.dataurl) {
			
			var _data_arr = req.body.dataurl.split(',');
			var _data = _data_arr[1];
			_data = _data.replace(new RegExp(' ', 'ig'), '+');
			_data = Buffer.from(_data, 'base64');
			
			//var item = req.files.uploading[0];
			// ++++++++++++++++ var target = '/upload/dataurl/video__from_usermedia.jpg';
			
			// ++++++++++++++++ app.saveFile('/static' + target, _data);
			
			//fs.createReadStream(item.path).pipe(fs.createWriteStream('./data/static' + target));
			
			cv.readImage(_data, function(err, img){
				
				if (err) {
					//throw err;
					res.send(err);
				}
				
				var width = img.width();
				var height = img.height();
				
				if (width < 1 || height < 1) {
					//throw new Error('Image has no size');
					res.send('Image has no size');
				}
				
				//'./data/opencv/xml/auto__number_russian.xml'
				//FACE_CASCADE EYE_CASCADE EYEGLASSES_CASCADE FULLBODY_CASCADE CAR_SIDE_CASCADE
				
				img.detectObject(cv.FACE_CASCADE, {
					radius : 1,
					neighbors : 8,
					grid_x : 8,
					grid_y : 8,
					threshold : 80,
				}, function(_err, items){
					
					if (_err) {
						throw _err;
					}
					
					var _img = null;
					
					for (var i = 0; i < items.length; i++){
						
						let item = items[i];
						
						//_img = img.crop(item.x, item.y, item.width, item.height);
						//img_c.canny(5, 300);
						//img_c.houghLinesP();
						/*
						let lowThresh = 0;
						let highThresh = 150;
						let iterations = 2;
						img_c.canny(lowThresh, highThresh);
						img_c.dilate(iterations);
						
						img_c.drawAllContours(img_c.findContours(), _item_stroke_color);
						*/
						
						//img_c.inRange(threshold_b, threshold_t);
						
						//img_c.save('./data/faces/' + i + '.jpg');
						
						//img.ellipse(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, item.height / 2, _item_stroke_color, _item_stroke_width);
						
						img.rectangle([item.x, item.y], [item.width, item.height], _item_stroke_color, _item_stroke_width);
						
					}
					
					/*
					img.save('./data/static' + target);///var/www/sites/azbn.ru/html/img/dev/opencv
					
					res.send({
						files : [
							target
						]
					});
					*/
					//img.inRange(threshold_b, threshold_t);
					//img.dilate(20);
					
					//if(_img != null) {
					//	res.send('data:image/jpeg;base64,' + _img.toBuffer().toString('base64'));
					//} else {
						res.send('data:image/jpeg;base64,' + img.toBuffer().toString('base64'));
					//}
					
				});
				
			});
			
			
			
		} else {
			
			res.send({});
			
		}
		
	};
}

module.exports = _;