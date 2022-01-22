/**
 * cancel one line table 
 */
$.fn.cancelLine = function (providedData) {
	
	return this.each(function() {
		let form = $(this).closestForm();
		
		// Cas d'une création, on supprime la line
		if ($.isEmptyObject(form.formAttribute('id').val())) {
			$(this).closestLine().remove();
		 } else { // On annule l'edition'
			$(this).loadViewLine(providedData);
		}
	});
}