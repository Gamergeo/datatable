Data table plugin

options {
	searchColumn : index of searched column if any
	sortColumns : index of sortable column, if any


}

Classes :

plugin_datatable_datatable
plugin_datatable_line, plugin_datatable_header
plugin_datatable_cell ,plugin_datatable_headercell

must be in format :

<div> // table
	<div> // header
		// Non div stuff
			<div></div> // header cell
			<div></div> // header cell
	</div>	
	<div> // line
		// Non div stuff
			<div></div> // cell
			<div></div> // cell
	</div>
	<div> // line
		// Non div stuff
			<div></div> // cell
			<div></div> // cell
	</div>	
</div>

Every cell must be at same level. Only div are counted as cell

