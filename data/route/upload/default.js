'use strict';

var fs = require('fs');
var cv = require('opencv');

var _item_stroke_color = [0, 0, 255];
var _item_stroke_width = 2;

var threshold_b = [128, 128, 128];
var threshold_t = [255, 255, 255];

function _(app, azbn) {
	
	app.log.info(__filename);
	
	return function(req, res) {
		
		/*
		[
		{
		"fieldName": "uploading[]",
		"originalFilename": "2017-04-23 15-07-16.JPG",
		"path": "C:\\Users\\ALEXAN~1\\AppData\\Local\\Temp\\rQiTtUCSXVc3iKfZBNnuleuN.JPG",
		"headers": {
			"content-disposition": "form-data; name=\"uploading[]\"; filename=\"2017-04-23 15-07-16.JPG\"",
			"content-type": "image/jpeg"
		},
		"size": 926401,
		"name": "2017-04-23 15-07-16.JPG",
		"type": "image/jpeg"
		}
		]
		*/
		
		if(req.files && req.files.uploading && req.files.uploading.length) {
			
			var item = req.files.uploading[0];
			var target = '/upload/default/' + item.name;
			
			//fs.createReadStream(item.path).pipe(fs.createWriteStream('./data/static' + target));
			
			cv.readImage(item.path, function(err, img){
				
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
					
					for (var i = 0; i < items.length; i++){
						
						let item = items[i];
						
						//let img_c = img.crop(item.x, item.y, item.width, item.height);
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
					
					img.save('./data/static' + target);///var/www/sites/azbn.ru/html/img/dev/opencv
					
					res.send({
						files : [
							target
						]
					});
					
				});
				
			});
			
			
			
		} else {
			
			res.send({});
			
		}
		
	};
}

module.exports = _;