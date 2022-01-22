/**
 * Charge le formulaire d'edition d'une ligne de table.
 * Depends du namespace (présent dans le formulaire) et de l'id (si présent dans le formulaire)
 */
$.fn.loadEditLine = function (providedData) {
	
	return this.each(function() {
		let line = $(this).closestLine();
		let form = $(this).closestForm();
		
		let data = new Object();
		
		if (providedData) {
			data = providedData; 
		}
		
		data.id = form.formAttribute("id").val();
		
		// On supprime l'association entrée pour les input
		let success = function() {
			line.enterKeyUp();
		}
		
		$(this).loadLine(form.formUrl('editLine'), data, success);
	});
}