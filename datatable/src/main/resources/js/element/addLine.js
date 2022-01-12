/**
 * Load html datatable line
 */
$.fn.addLine = function (url, data, oncomplete) {
	
	return this.each(function() {
		
		let newLine = $("<div>");
		let headerLine = $(this).closest(".plugin_datatable_datatable").find(".plugin_datatable_header");
		newLine.addClass('plugin_datatable_line');
		
		newLine.insertAfter(headerLine);
		newLine.loadLine(url,  data, oncomplete);
	});
	
}