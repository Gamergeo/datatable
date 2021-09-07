class P_datatable {
	
	static getContainer(datatable) {
		return datatable.closest(".plugin_datatable_container");
	}
	
	static getLines(datatable, withHeader) {
		if (withHeader) {
			return datatable.find('.plugin_datatable_line');
		} else {
			return datatable.find('.plugin_datatable_line:not(.plugin_datatable_header)');
		}
	}
	
	// Retourne toutes les lignes non exlues par la recherche
	static getSearchedLines(datatable, withHeader) {
		if (withHeader) {
			return datatable.find('.plugin_datatable_line:not(.plugin_datatable_search_exclude)');
		} else {
			return datatable.find('.plugin_datatable_line:not(.plugin_datatable_search_exclude):not(.plugin_datatable_header)');
		}
	}
	
	static getCell(line, index) {
		return line.find('.plugin_datatable_cell').eq(index - 1);
	}
	
	static getCellValue(line, index) {
		
		let cell = P_datatable.getCell(line, index);
		let cellValue = cell.textOrVal().trim();
		
		if ($.isEmptyObject(cellValue)) {
			cellValue = cell.children().eq(0).textOrVal();
		}
		
		return cellValue;
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
	
	static addSort(datatable, columnIndex, dateSort) {
		
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
				P_datatable.sort(datatable, columnIndex, true, dateSort);
				sortOrder = 1;
			
			// tri ascendant -> descendant
			} else if (sortOrder == 1) { 
				P_datatable.sort(datatable, columnIndex, false, dateSort);
				sortOrder = 0;
			}
			
			sortableColumn.data("plugin_datatable_sort_order", sortOrder);	
		});
	}
	
	static sort(datatable, idCol, ascendant, dateSort) {
		let lineArray = P_datatable.getLines(datatable).toArray();
		var sortedArray = lineArray.sort(P_datatable.comparer(idCol, dateSort));
		
		if (!ascendant) {
			sortedArray = sortedArray.reverse();
		}
		
		for (var i = 0; i < sortedArray.length; i++){
			datatable.append(sortedArray[i]);
		}
		
		P_datatable.pagination(datatable);
	}
		
	/**
	 * Comparer for sorting table
	 */ 
	static comparer(index, dateSort) {
	    return function(a, b) {
		
	        let valA = P_datatable.getCellValue($(a), index);
	        let valB = P_datatable.getCellValue($(b), index);

			if (dateSort) {
				let dateA = $.parseDate(valA);
				let dateB = $.parseDate(valB);
				
				return dateA - dateB;
			}
		
	        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
	    }
	}
	
	static addSearch(datatable, searchIndex) {
		
		var onKeyUp = function() { 
			P_datatable.search(datatable, searchIndex, $(this).val());
		};
		
		let searchInput = $('<input type="text" placeholder="Recherche">');
		searchInput.addClass("plugin_datatable_search");
		searchInput.keyup(onKeyUp);
		
		let pretable = P_datatable.getContainer(datatable).find(".plugin_datatable_pretable");			
		
		pretable.append(searchInput);
	}
	
	/*
	 * Search through searchable to find input. If not, we hide the line
	 */
	static search(datatable, searchIndex, text) {
		
		P_datatable.getLines(datatable).each(function() {
			
			let line = $(this);
			let cellValue = P_datatable.getCellValue(line, searchIndex);
			
			if (!text || cellValue.toUpperCase().indexOf(text.toUpperCase()) != -1) {
				line.removeClass('plugin_datatable_search_exclude');
				line.show();
			} else {
				line.addClass('plugin_datatable_search_exclude');
				line.hide();
			}
			
			P_datatable.pagination(datatable);
		});
	}
	
	// Ajoute une ligne vide en debut de table, recevra la pagination et la rtecherche 
	static addContainer(datatable) {
		let container = $("<div></div>");			
		container.addClass("plugin_datatable_container");
//		container.width(datatable.percentageWidth() + '%');
//		
//		datatable.width('100%');
		
		let preTable = $("<div></div>");
		preTable.addClass("plugin_datatable_pretable");		
		
		let postTable = $("<div></div>");
		postTable.addClass("plugin_datatable_posttable");
		
		container.appendTo(datatable.parent());
		
		container.append(preTable);
		container.append(datatable);
		container.append(postTable);
	}
	
	static addPagination(datatable) {
		P_datatable.addPaginationPreTable(datatable);
		P_datatable.addPaginationPostTable(datatable);
		
		P_datatable.pagination(datatable);
	}
	
	// Ajoute le selecteur de nombre par page
	static addPaginationPreTable(datatable) {
		let paginationSelect = $("<select>");
		paginationSelect.addClass("plugin_datatable_pagination_select");
		
		let option10 = $("<option value='10'>10</option>");
		paginationSelect.append(option10);
		
		let option20 = $("<option value='20'>20</option>");
		paginationSelect.append(option20);
		
		let option50 = $("<option value='50'>50</option>");
		paginationSelect.append(option50);
		
		let option100 = $("<option value='100'>100</option>");
		paginationSelect.append(option100);
		
		// Lorsqu'il change, il faut remettre à jour la pagination
		paginationSelect.change(() => {
			
			// On reinit la page
			P_datatable.getContainer(datatable).find('.plugin_datatable_pagination_input').val(1);
			P_datatable.pagination(datatable);
		})
		
		let pretable = P_datatable.getContainer(datatable).find(".plugin_datatable_pretable");			
		pretable.prepend(paginationSelect);
		
		paginationSelect.val(20);
	}
	
	// Ajoute le selecteur de page
	static addPaginationPostTable(datatable) {
		let postTable = datatable.closest(".plugin_datatable_container").find(".plugin_datatable_posttable");

		let firstPage = $("<div>");
		firstPage.addClass("plugin_datatable_pagination_button_first");
		let prevPage = $("<div>");
		prevPage.addClass("plugin_datatable_pagination_button_previous");
		let pageInput =  $('<input type="text">');
		pageInput.addClass("plugin_datatable_pagination_input");
		pageInput.val(1);
		let nextPage = $("<div>")
		nextPage.addClass("plugin_datatable_pagination_button_next");
		let lastPage = $("<div>")
		lastPage.addClass("plugin_datatable_pagination_button_last");
				
		// Doit avoir un container pour ne pas bouger lors des hide
		let buttonContainer = $('<div>');
		buttonContainer.addClass("plugin_datatable_pagination_button_container");
		buttonContainer.append(firstPage);
		postTable.append(buttonContainer);
		
		buttonContainer = $('<div>');
		buttonContainer.addClass("plugin_datatable_pagination_button_container");
		buttonContainer.append(prevPage);
		postTable.append(buttonContainer);
		
		postTable.append(pageInput);
		
		buttonContainer = $('<div>');
		buttonContainer.addClass("plugin_datatable_pagination_button_container");
		buttonContainer.append(nextPage);
		postTable.append(buttonContainer);
		
		buttonContainer = $('<div>');
		buttonContainer.addClass("plugin_datatable_pagination_button_container");
		buttonContainer.append(lastPage);
		postTable.append(buttonContainer);
		
		pageInput.keyup(() =>  {
			P_datatable.pagination(datatable);
		});
	}
	
	// Refresh les event de navigation sur poages precedantes, etc...
	static refreshPagination(datatable) {
		let container = P_datatable.getContainer(datatable);
		let pageInput = container.find('.plugin_datatable_pagination_input');
		let lines = P_datatable.getSearchedLines(datatable);
		let perPage = container.find('.plugin_datatable_pagination_select').val();
		let maxPageNumber =  Math.ceil(lines.length / perPage);
		
		// Il n'y a pas trop de lignes'
		if (lines.length < perPage) {
			container.find(".plugin_datatable_posttable").hide();
			pageInput.val(1);
			
		} else {
			container.find(".plugin_datatable_posttable").show();
			
			let firstPage = container.find('.plugin_datatable_pagination_button_first');
			let previousPage = container.find('.plugin_datatable_pagination_button_previous');
			let nextPage = container.find('.plugin_datatable_pagination_button_next');
			let lastPage = container.find('.plugin_datatable_pagination_button_last');
			
			let pageNumber = pageInput.parseVal();			
			
			if (!pageNumber) {
				pageNumber = 1;
			}
			
			firstPage.toggle(pageNumber > 1);
			previousPage.toggle(pageNumber > 1);
			nextPage.toggle(pageNumber < maxPageNumber);
			lastPage.toggle(pageNumber < maxPageNumber);
			
			firstPage.unbindClick();
			firstPage.click(() => {
				pageInput.val(1);
				pageInput.keyup();
			})
			
			previousPage.unbindClick();
			previousPage.click(() => {
				pageInput.val(pageNumber - 1);
				pageInput.keyup();
			})
				
			nextPage.unbindClick();
			nextPage.click(() => {
				pageInput.val(pageNumber + 1);
				pageInput.keyup();
			})
			
			lastPage.unbindClick();
			lastPage.click(() => {
				pageInput.val(maxPageNumber);
				pageInput.keyup();
			})
		}
	}
	
	// Cache ou affiche les lignes suivant la page selectionné et le nombre max
	static pagination(datatable) {
		let lines = P_datatable.getSearchedLines(datatable);
		let perPage = P_datatable.getContainer(datatable).find('.plugin_datatable_pagination_select').val();
		let maxPageNumber =  Math.floor(lines.length / perPage) + 1;
		let pageNumber = P_datatable.getContainer(datatable).find('.plugin_datatable_pagination_input').parseVal();
		
		if (!pageNumber) {
			pageNumber = 1;
		}
		
		if (pageNumber > maxPageNumber) {
			pageNumber = maxPageNumber;
		} else if (pageNumber < 1) {
			pageNumber = 1;
		}
		
		P_datatable.refreshPagination(datatable);
		
		let startLine = (pageNumber - 1) * perPage;
		let endLine = pageNumber * perPage - 1;
		
		lines.each(function(i, line) {
							
			// Dans ce cas, on cache la ligne
			if (i < startLine || i > endLine) {
				$(line).hide();
			} else {
				$(line).show();
			}
		});
	}
}