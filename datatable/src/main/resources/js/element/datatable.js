/**
 * Initialise la navigation
 */
$.fn.datatable = function (options) {
	
	return this.each(function() {
		
		let datatable = $(this);
		P_datatable.addCssClasses(datatable);
		
		if (!$.isEmptyObject(options.sortColumns)) {
			for (let i = 0; i < options.sortColumns.length; i++) {
				P_datatable.addSort(datatable, options.sortColumns[i]);
			}
		}
		
		P_datatable.addContainer(datatable);
		
		if (options.searchColumn) {
			P_datatable.addSearch(datatable, options.searchColumn);
		}
		
		if (options.pagination) {
			P_datatable.addPagination(datatable);
		}
		
	});
}