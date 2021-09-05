/**
 * Load html datatable line
 */
$.fn.closestLine = function () {
	
	let results = $([]);
	
	this.each(function() {
		results = results.add($(this).closest('.plugin_datatable_line'));
	});
	
	return results;
}