/**
 * Load html datatable line
 */
$.fn.loadLine = function (url, data, oncomplete) {
	
	return this.each(function() {
		
		let line = $(this).closestLine();
		
		let isHeader = line.hasClass('plugin_datatable_header');
		
		// On met à jour la ligne quand elle est chargée
		let lineRefresh = () => {
			P_datatable.addLineCssClasses(line, isHeader);
		}
		
		line.load(url,  data, $.mergeFunction(oncomplete, lineRefresh));
	});
}