'use strict';

$(function() {
	
	var video = document.querySelector('video#resp__video');
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	
	var canvas = document.createElement('canvas');
	var cnx = canvas.getContext('2d');
	
	var captureUserMedia = function() {
		
		if(!video.paused || !video.ended) {
			
			cnx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
			//console.log(canvas.toDataURL('image/png'));
			
			$.ajax({
				url : '/upload/dataurl/',
				dataType : 'json',
				//cache : false,
				//contentType : false,
				//processData : false,
				data : {
					dataurl : '' + canvas.toDataURL('image/jpeg', 0.33),
				},
				type : 'POST',
				success: function(resp) {
					
					if(resp.files && resp.files.length) {
						
						var item = resp.files[0];
						
						$('.resp__image').attr('src', item + '?v=' + (new Date().getTime()));
						
					}
					
					requestAnimationFrame(captureUserMedia);
					
					//form.trigger('reset');
					
				},
			});
			
			
			//requestAnimationFrame(loop);
			
		}
		
	}
	
	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			video : true,
			audio : true,
		}, function(stream) {
			
			if (video.mozSrcObject !== undefined) {
				
				video.mozSrcObject = stream;
				
			} else {
				
				video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				
			}
			
			//canvas.width = video.videoWidth;
			//canvas.height = video.videoHeight;
			
			video.addEventListener('loadeddata', function() {
				
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				
				console.log('Video dimensions: ' + video.videoWidth + ' x ' + video.videoHeight);
				
				captureUserMedia();
				
				//setInterval(captureUserMedia, 777);
				
			}, false);
			
			video.play();
			
			/*
			
			*/
			
			
			
		}, function errorCallback(error) {
			
			console.error(error);
			
		});
	}
	
	$(document.body).on('submit.azbn7', '.azbn7__form_upload', null, function(event){
		event.preventDefault();
		
		var form = $(this);
		var input_file = form.find('input[type="file"]').eq(0);
		
		var file_data = input_file.prop('files')[0];
		var form_data = new FormData();
		
		form_data.append(input_file.attr('name'), file_data);
		
		//alert(form_data);
		
		$.ajax({
			url : form.attr('action'),
			dataType : 'json',
			cache : false,
			contentType : false,
			processData : false,
			data : form_data,
			type : form.attr('method'),
			success: function(resp) {
				
				if(resp.files && resp.files.length) {
					
					var item = resp.files[0];
					
					$('.resp__image').attr('src', item);
					
				}
				
				form.trigger('reset');
				
			},
		});
		
		/*
		var _form = $(this).clone();
		
		_form
			.attr('class', '')
			.css({
				display : 'none',
			})
			.appendTo($(document.body))
		;
		
		_form.trigger('submit');
		*/
		
		//window.open($(this).attr('action'))
		
	});
	
});