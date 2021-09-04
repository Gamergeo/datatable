class DataTableRow {
	
	constructor(element) {
		this.row = element.closest(".dataTableHeaderRow");
		this.isHeader = true;
		
		if (this.row.length == 0) {
			this.row = element.closest(".dataTableRow");
			this.isHeader = false;
		}
		
		this.formUtils = new FormUtils(this.row.children("form"))
	}
		
	get cells() {
		
		if (this.isHeader) {
			return this.row.find(".dataTableHeaderCell");
		} else {
			return this.row.find(".dataTableCell");
		}
	}
	
	cellValue(idCol) {
		return new DataTableCell(this.row.find('.dataTableCell').eq(idCol-1)).value;
	}
	
	remove() {
		this.row.remove();
	}
	
	delete() {
		
		var row = this.row;
		var onSuccess = function() {
			row.remove();
		};
		this.formUtils.delete(onSuccess);
	}
	
	edit() {
		
		var row = this.row;
		var onSuccess = function(data) {
			row.html(data);
		};
		
		this.formUtils.edit(onSuccess);
	}
	
	cancel() {
		
		var row = this.row;
		
		// On annule une insertion on supprime la ligne
		if (isEmpty(this.formUtils.id)) {
			row.remove();
		
		} else { // Sinon on annule l'edition
		
			var onSuccess = function(data) {
				row.html(data);
			};
		
			this.formUtils.view(onSuccess);
		}
	}
	
	save() {
		var row = this.row;
		
		var onSuccess = function(data) {
			row.html(data)
		};
		
		this.formUtils.save(onSuccess);
	}
}

class DataTable {

	constructor(element) {
		this.dataTable = element.closest(".dataTable");
		this.ascendant = false;
	}
	
	get rows() {
		return this.dataTable.find('.dataTableRow');
	}
	
	get lastRow() {
		return this.dataTable.find(".dataTableRow:last");
	}
		
	get rowsArray() {
		return this.rows.toArray();
	}
	
	get header() {
		return this.dataTable.find('.dataTableHeaderRow');
	}
	
	row(idRow) {
		return this.dataTable.find('.dataTableRow:nth-child('+idRow+')');
	}
	
	cellValue(idRow, idCol) {
		return new dataTableRow(this.row(idRow)).cellValue(idCol);
	}
		
//		this.dataTable.find(".dataTableHeaderCell.sortable").each(function () {
//			unbindClickEvent($(this));
//			
//			$(this).click(function() {
//				
//				new DataTable($(this)).sort($(this).index());
//			})
//		});
	}
	
	addSearch() {
		
		if (this.dataTable.find(".searchable")) {
			
			var onKeyUp = function() { 
				new DataTable($(this).siblings('.dataTable')).search($(this).val());
			};
			
			var searchInput = $('<input type="text" placeholder="Recherche">');
			searchInput.addClass("searchInput");
			searchInput.keyup(onKeyUp);
			
			var container = $("<div></div>");			
			container.addClass("searchTable");
			this.dataTable.addClass("dataTable");
			
			container.append(searchInput);
			container.appendTo(this.dataTable.parent());
			this.dataTable.appendTo(container);
			
			this.dataTable.css("width", "100%");
		}
	}
	
	/*
	 * Search through searchable to find input. If not, we hide the line
	 */
	search(text) {
		this.rows.each(function() {
			
			var row = $(this);
			
			row.find('.searchable').each(function() {
				var cell = $(this);
				var cellValue = new DataTableCell(cell).value;
				
				if (isEmpty(text) || cellValue.indexOf(text) != -1) {
					row.show();
				} else {
					row.hide();
				}
			});
			
		});
		
//		getParentRow(datatableRows.find('.dataTableCell.searchable:not(:icontains('+ text +'))')).hide();
//		getParentRow(datatableRows.find('.dataTableCell.searchable:icontains('+ text +')')).show();
		
	//	getParentRow(datatableRows.find('input.searchable').contains(filter)).hide();
	//	getParentRow(datatableRows.find('.dataTableCell.searchable:icontains('+ filter +')')).show();
	}
	
	addMethod() {
		this.addSearch();
		this.addSort();
	}
	
	addRow() {
		var lastRow = this.lastRow;
		
		var onSuccess = function(data) {
			var newRow = $("<div class='dataTableRow'>" + data + "</div>");
			newRow.insertAfter(lastRow);
		};
		
		new DataTableRow(lastRow).formUtils.add(onSuccess);
	}
	
	static refreshTable() {
	
		$(".dataTable").each(function() {
			new DataTable($(this)).addMethod();
		});
	}
}