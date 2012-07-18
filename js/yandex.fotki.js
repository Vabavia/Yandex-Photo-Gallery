

function Fotki() {}



/**
 * Получаем данные альбома
 *
 * @this Fotki
 * @param {string} username Логин пользователя на сервере Яндекс
 * @param {int} albumId Идентификатор альбома
 * @param {function} callback Коллбэк функция, в которую будет передан ответ сервера
 */
Fotki.prototype.getAlbum = function(username, albumId, callback) {
	$.ajax({
		url: 'http://api-fotki.yandex.ru/api/users/'+username+'/album/'+albumId+'/?format=json&callback=?',
		dataType: 'jsonp',
		success: callback,
		error: function(){
			callback(false);
		}
	});
};

/**
 * Получаем фотографии из альбома
 *
 * @this Fotki
 * @param {string} username Логин пользователя на сервере Яндекс
 * @param {int} albumId Идентификатор альбома
 * @param {function} callback Коллбэк функция, в которую будет передан список фотографий
 */
Fotki.prototype.getPhotos = function(username, albumId, callback) {
	var result = {
		entries: []
	};

	/**
	 * Загрузка следующей страницы фотографий (если их несколько)
	 * @param {string} url
	 * @param {callback} callback Функция, в которую будет передан список фотографий
	 */
	var loadPage = function(url) {
		$.ajax({
			url: url,
			dataType: 'jsonp',
			error: function(){
				callback(false);
			},
			success: function( data ){
				// Добавляем резульаты к общему массиву
				for ( var k in data.entries ) {
					result.entries.push( data.entries[k] );
				}

				// Проверяем есть ли другие страницы
				if ( data.links.hasOwnProperty('next') ) {
					loadPage(data.links.next); // Если есть другие страницы - грузим их
				}
				else {
					callback( result ); // Если нет - возвращаем ответ в коллбек
				}
			}
		});
	};

	// Инициализируем загрузку первой страницы
	loadPage('http://api-fotki.yandex.ru/api/users/'+username+'/album/'+albumId+'/photos/?format=json&callback=?');
};
