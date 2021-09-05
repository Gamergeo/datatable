class P_datatable {
	
	static getLines(datatable, withHeader) {
		if (withHeader) {
			return datatable.find('.plugin_datatable_line');
		} else {
			return datatable.find('.plugin_datatable_line:not(.plugin_datatable_header)');
		}
	}
	
	static getCell(line, index) {
		return line.find('.plugin_datatable_cell').eq(index - 1);
	}
	
	static addCssClasses(datatable) {
		datatable.addClass("plugin_datatable_datatable");
		let firstLine = true;
		
		// Iteration sur les lignes
		datatable.closestChildren("div").each(function() {
			let line = $(this);
			P_datatable.addLineCssClasses(line, firstLine);

			if (firstLine) {
				firstLine = false;
			}
		});
	}
	
	// Ajoute les classes pour la ligne selectionné
	static addLineCssClasses(line, firstLine) {
		
		// Header
		if (firstLine) {
			line.addClass("plugin_datatable_header");
		}
		
		line.addClass("plugin_datatable_line");
		
		// Iteration sur les cellules
		line.closestChildren("div").each(function() {
			let cell = $(this);
			
			// Header
			if (firstLine) {
				cell.addClass("plugin_datatable_headercell");
			}
			
			cell.addClass("plugin_datatable_cell")
		});
	}
	
	static addSort(datatable, columnIndex) {
		
		let sortableColumn = datatable.find('.plugin_datatable_headercell').eq(columnIndex - 1);
		
		// Si la colonne comprends plusieurs elements, le dernier est utilisé
		if (sortableColumn.children().length) {
			sortableColumn = sortableColumn.children().last();
		}

		sortableColumn.addClass('plugin_datatable_sortable');
		sortableColumn.data("plugin_datatable_sort_order", 0);

		sortableColumn.click(function() {
			let sortOrder = sortableColumn.data("plugin_datatable_sort_order");
			
			// Aucun tri (ou descendant) -> tri ascendant
			if (sortOrder == 0) { 
				P_datatable.sort(datatable, columnIndex, true);
				sortOrder = 1;
			
			// tri ascendant -> descendant
			} else if (sortOrder == 1) { 
				P_datatable.sort(datatable, columnIndex, false);
				sortOrder = 0;
			}
			
			sortableColumn.data("plugin_datatable_sort_order", sortOrder);	
		});
	}
	
	static sort(datatable, idCol, ascendant) {
		let lineArray = P_datatable.getLines(datatable).toArray();
		var sortedArray = lineArray.sort(P_datatable.comparer(idCol));
		
		if (!ascendant) {
			sortedArray = sortedArray.reverse();
		}
		
		for (var i = 0; i < sortedArray.length; i++){
			datatable.append(sortedArray[i]);
		}
	}
		
	/**
	 * Comparer for sorting table
	 */ 
	static comparer(index) {
	    return function(a, b) {
			let cellA = P_datatable.getCell($(a), index);
	        let valA = cellA.textOrVal(); 
			let cellB = P_datatable.getCell($(b), index);
	        let valB = cellB.textOrVal(); 
	        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
	    }
	}
	
	static addSearch(datatable, searchIndex) {
		
		var onKeyUp = function() { 
			P_datatable.search(datatable, searchIndex, $(this).val());
		};
		
		var searchInput = $('<input type="text" placeholder="Recherche">');
		searchInput.addClass("plugin_datatable_search");
		searchInput.keyup(onKeyUp);
		
		var container = $("<div></div>");			
		container.addClass("plugin_datatable_container");
		
		container.append(searchInput);
		container.appendTo(datatable.parent());
		datatable.appendTo(container);
		
	}
	
	/*
	 * Search through searchable to find input. If not, we hide the line
	 */
	static search(datatable, searchIndex, text) {
		
		P_datatable.getLines(datatable).each(function() {
			
			let line = $(this);
			let cellValue = P_datatable.getCell(line, searchIndex).textOrVal();
			
			if (!text || cellValue.toUpperCase().indexOf(text.toUpperCase()) != -1) {
				line.show();
			} else {
				line.hide();
			}
			
		});
	}
}