/**
 * delete one line table 
 */
$.fn.deleteLine = function () {
	
	return this.each(function() {
		let form = $(this).closestForm();
		let line = $(this).closestLine();
		
		if (confirm('Supprimer ?')) {
			
			let data = {
			'id' : form.formAttribute("id").val()
			}
			
			let success = () => {
				line.remove();
			}
			
			$.post({
				'url' : form.formUrl('delete'),
				'data': data,
				'success' : success
			});
		}		
	});
}