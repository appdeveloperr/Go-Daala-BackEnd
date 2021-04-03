$(function () {
	
	$('a.confirmDeletion').on('click', function () {
		if(!confirm('Confirm deletion')){
			console.log("This is confirmDeletion");
			return false;
		}
	});

	if($('textarea#disc').length){
		CKEDITOR.replace('disc', { 
			enterMode: CKEDITOR.ENTER_BR, 
			on: {'instanceReady': function (evt) { evt.editor.execCommand('manimize');     }},
			}); 
}
});
