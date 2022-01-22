/**
 * Charge la vue d'une ligne de table.
 * Depends du namespace (présent dans le formulaire) et de l'id (si présent dans le formulaire)
 */
$.fn.loadViewLine = function (providedData) {
	
	return this.each(function() {
		let form = $(this).closestForm();
		
		let data = new Object();
		
		if (providedData) {
			data = providedData; 
		}
		
		data.id = form.formAttribute("id").val();
		
		$(this).loadLine(form.formUrl('viewLine'), data);
	});
}