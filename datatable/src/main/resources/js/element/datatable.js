/**
 * Initialise la navigation
 */
$.fn.datatable = function (options) {
	
	return this.each(function() {
		
		let datatable = $(this);
		
		// La table n'est pas déja init
		if (!datatable.data('isInit')) {
		
			P_datatable.addCssClasses(datatable);
			
			if (!$.isEmptyObject(options.sortColumns)) {
				for (let i = 0; i < options.sortColumns.length; i++) {
					
					let dateSort = false;
					let sortColumn = options.sortColumns[i]; 
					
					// Si l'utilisateur spécifie que ce sont des dates, alors le sort est différent
					if (!$.isNumeric(sortColumn) && sortColumn.includes("date")) {
						dateSort = true;
						sortColumn = sortColumn.replace('date', '').trim();
					}
					
					P_datatable.addSort(datatable, sortColumn, dateSort);
				}
			}
			
			P_datatable.addContainer(datatable);
			
			if (options.searchColumn) {
				P_datatable.addSearch(datatable, options.searchColumn);
			}
			
			if (options.pagination) {
				P_datatable.addPagination(datatable);
			}
			
			datatable.data('isInit', true);
		}
		
	});
}