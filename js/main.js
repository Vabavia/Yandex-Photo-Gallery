var previewSize = 'M';
var galleria;
var YandexAPI = new Fotki();

/**
 * Инициализация
 */
$(function() {
	galleria = $('#galleria');

	// Получаем описание альбома
	YandexAPI.getAlbum("aldekein", 171611, function(albumData){
		if ( !albumData ) {
			alert("Не удалось получить описание альбома");
			return false;
		}

		// Промежуточные результаты
		$('#loading-info-more').html(albumData.imageCount + ' фотографий');


		// Загружаем список фотографий
		YandexAPI.getPhotos("aldekein", 171611, function(photosData){
			if ( !photosData ) {
				alert("Не удалось получить список фотографий");
				return false;
			}

			for ( var k in photosData.entries ) {
				// Проверяем есть ли картинка в заданном пользователем размере
				if ( !photosData.entries[k].img.hasOwnProperty(previewSize) ) {
					continue; // Если нет - пропускаем картинку вообще
				}

				// Проверяем есть ли картинка большего размера
				if ( photosData.entries[k].img.hasOwnProperty('XXXL') ) {
					var imgDataBig		= photosData.entries[k].img.XXXL;
					var imgDataOriginal	= photosData.entries[k].img.XXL;
				}
				else {
					var imgDataBig		= photosData.entries[k].img[previewSize];
					var imgDataOriginal	= photosData.entries[k].img[previewSize];
				}

				// Генерируем список фотографий
				galleria.prepend('	<a href="'+imgDataBig.href+'">' +
										'<img ' +
											'src="'+imgDataOriginal.href+'" ' +
											'width="'+imgDataOriginal.width+'" ' +
											'height="'+imgDataOriginal.height+'" ' +
											'alt="'+imgDataOriginal.title+'" ' +
										'>' +
									'</a>' +
								'');
			}

			// Отображаем фотографии
			Galleria.loadTheme('/galleria/folio/galleria.folio.min.js');
			galleria.galleria().show();
			$("#loading-info").hide();
		});
	})
});