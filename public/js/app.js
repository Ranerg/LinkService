/* 
		Simple Challange 

		@author : Alexandr Leutin (C) 2013 - 2014
		@lincese : MIT
*/

function app_getServiceStatus ( ) {
	$.ajax({
  		type: "POST",
  		url: 'app.php',
  		data: "act=get_status",
  		success: function(msg) { console.log( msg ); },
  		error: function(XMLHttpRequest, textStatus, errorThrown) {
     		bootbox.alert( "Произошла ошибка во время обращения к сервису. Пожалуйста, повторите попытку позже.", function() {
				$('#app_worker').html('<div class="alert alert-danger"><strong>О нет!</strong> Произошла неисправимая ошибка. Пожалуйста, повторите попытку позже.</div>');
			});
  		}
	});
}
function app_sendLink ( ) {
	var link = $('#app_link').val();
	if (link.length == 0 || link.length < 5 || !app_isCorrectLink ( link ) ) {
		bootbox.alert( "Введенная вами ссылка не корректна.", function() { });
	} else {
		$.ajax({
  			type: "POST",
  			url: 'app.php',
  			data: "act=save_link&link=" + link,
  			success: function(msg) { 
  				if ( !msg.response ) {
  					bootbox.alert( "Произошла ошибка во время обращения к сервису. Пожалуйста, повторите попытку позже.", function() {
						$('#app_worker').html('<div class="alert alert-danger"><strong>О нет!</strong> Произошла неисправимая ошибка. Пожалуйста, повторите попытку позже.</div>');
					});
  				} else {
  					bootbox.alert( '</br><div class="well" style="text-align: center;"><strong>Ваша ссылка : </strong>' + msg.response.link + '</div></br><center>Спасибо за использование нашего сервиса</center>', function() {} );
  				}
  			},
  			error: function(XMLHttpRequest, textStatus, errorThrown) {
	     		bootbox.alert( "Произошла ошибка во время обращения к сервису. Пожалуйста, повторите попытку позже.", function() {
					$('#app_worker').html('<div class="alert alert-danger"><strong>О нет!</strong> Произошла неисправимая ошибка. Пожалуйста, повторите попытку позже.</div>');
				});
  			}
		});
	}
}
function app_isCorrectLink ( link ) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test( link );
}