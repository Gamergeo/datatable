/**
 * Save la ligne
 */
$.fn.saveLine = function (data) {
	
	return this.each(function() {
		let success = (object) => {
			// On met à jour l'identifiant, important dans le cas d'une création			
			$(this).formAttribute('id').val(object.id); 
			
			$(this).loadViewLine(data); // On rafraichit la line au retour
		}
		
		$(this).saveForm(success);
	});
}