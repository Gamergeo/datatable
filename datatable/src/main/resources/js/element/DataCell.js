class DataTableCell extends Element {
	
	constructor(element) {
		
		var cell = element.closest(".dataTableHeaderCell");
		this._isHeader = true;
		
		// Ce n'estpas un header'
		if (cell.length == 0) {
			
			this.element = element.closest(".dataTableCell");	
			this._isHeader = false;
		}
		
		var contentElement = new Element(this.children());
		
		if (contentElement.length != 1) {
			alert("Error lors de la création de la cellule pour " + element);
		}
		
		this._contentElement = contentElement;
	}
		
	get value() {
			
		var cellValue = this.find('input').val();
		
		if (isUndefined(cellValue)) {
			cellValue = this.text();
		}
	
		return cellValue;
	}
	
}

