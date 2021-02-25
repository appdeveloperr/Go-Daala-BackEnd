$(function () {
	$('a.confirmDeletion').on('click', function () {
		if(!confirm('Confirm deletion')){
			console.log("This is confirmDeletion");
			return false;
		}
	});
	
});