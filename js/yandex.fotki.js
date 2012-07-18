var previewSize = 'M';
var albumId = 171611;
var username = "aldekein";
var galleria;

/**
 * Init
 */
$(function() {
	galleria = $('#galleria');
	$.get('http://api-fotki.yandex.ru/api/users/'+username+'/album/'+albumId+'/?format=json&callback=parseAlbum', function () { }, 'script')
});

var parseAlbum = function(albumData) {
	if (typeof albumData !== 'object') {
		$('#loading-info').html('Ошибка при загрузке информации об альбоме!');
		return false;
	}

	$('#loading-info-more').html(albumData.imageCount + ' фотографий');

	// console.log('http://api-fotki.yandex.ru/api/users/'+username+'/album/'+albumId+'/photos/rcreated/?format=json&callback=parsePhotos');
	$.get('http://api-fotki.yandex.ru/api/users/'+username+'/album/'+albumId+'/photos/?format=json&callback=parsePhotos', function () { }, 'script')
	// console.log(albumData);
};

var totalCount = 0;
var parsePhotos = function(photosData) {
	if (typeof photosData !== 'object') {
		$('#loading-info').html('Ошибка при загрузке информации о фотографиях!');
		return false;
	}

	var imgData, imgDataOriginal, imgDataBig;
	// console.log(photosData);
	// console.log(photosData.entries.length);

	for (var i in photosData.entries) {
	imgData = photosData.entries[i].img[previewSize];

	try {
		if (typeof photosData.entries[i].img.XXXL != 'undefined') {
			// some really small photos does not have these sizes at all
			imgDataBig = photosData.entries[i].img.XXXL;
			imgDataOriginal = photosData.entries[i].img.XXL;
		}
		else {
			imgDataBig = imgData;
			imgDataOriginal = imgData;
		}

		totalCount++;
		galleria.prepend('<a href="'+imgDataBig.href+'"><img ' +
							'src="'+imgData.href+'" ' +
							'width="'+imgData.width+'" ' +
							'height="'+imgData.height+'" ' +
							'alt="'+photosData.entries[i].title+'" ' +
					'></a>');
	}
	catch(e) { }
	}

	// multipaging
	if (photosData.links.next) {
		$.get(photosData.links.next+'?format=json&callback=parsePhotos', function () { }, 'script');
	}
	else {
		//                 console.log('totalCount', totalCount);
		document.title = document.title + ' — ' + photosData.title;
		$('#loading-info').hide();
		$('#back-to-albums').css('display', 'block');

		// Galleria.loadTheme('/galleria/themes/classic/galleria.classic.min.js');
		// Galleria.loadTheme('/galleria/themes/twelve/galleria.twelve.min.js');
		// read http://galleria.io/docs/getting_started/quick_start/ for customizing for your best experience

		Galleria.loadTheme('/galleria-themes/folio/galleria.folio.min.js');
		galleria.galleria().show();
	}
};
