/**
 * Defines the part filter panel.
 * 
 * 
 */
Ext.define('PartKeepr.PartFilterPanel', {
	extend: 'Ext.form.Panel',
	alias: 'widget.PartFilterPanel',
	
	/**
	 * Define a padding of 10px
	 */
	bodyPadding: '10px',
	
	/**
	 * The items are aligned in a wrappable column layout
	 */
	layout: 'column',
	
	/**
	 * Automatically scroll the container if the items exceed the container size.
	 */
	autoScroll: true,
	
	/**
	 * Fixed body background color style
	 */
	bodyStyle: 'background:#DBDBDB;',
	
	/**
	 * Initializes the component
	 */
	initComponent: function () {
		
		// Create the filter fields
		this.createFilterFields();
		
		// Creates the left column of the filter panel
		this.leftColumn = {
				xtype: 'container',
            	anchor: '100%',
            	layout: 'anchor',
				minWidth: 340,
				style: 'margin-right: 10px',
            	columnWidth: 0.5,
            	items: [
            	        this.storageLocationFilter,
            	        this.categoryFilter,
            	        this.partsWithoutPrice,
            	        this.createDateFilter,
            	        this.partsWithoutStockRemovals
            	        ]
		};
		
		// Creates the right column of the filter panel
		this.rightColumn = {
				xtype: 'container',
            	anchor: '100%',
				minWidth: 340,
            	columnWidth: 0.5,
            	layout: 'anchor',
            	items: [
            	        this.stockFilter,
            	        this.distributorOrderNumberFilter
            	        ]
		};
		
		// Apply both columns to this panel
		this.items = [ this.leftColumn, this.rightColumn ];
		
		// Create the reset button
		this.resetButton = Ext.create("Ext.button.Button", {
			text: i18n("Reset"),
			handler: this.onReset,
			icon: 'resources/diagona-icons/icons/16/101.png',
			scope: this
		});
		
		// Create the apply button
		this.applyButton = Ext.create("Ext.button.Button", {
			text: i18n("Apply"),
			icon: 'resources/diagona-icons/icons/16/102.png',
			handler: this.onApply,
			scope: this
		});
		
		// Append both buttons to a toolbar
		this.dockedItems = [{
			xtype: 'toolbar',
			enableOverflow: true,
			dock: 'bottom',
			defaults: {minWidth: 100},
			items: [ this.applyButton, this.resetButton ]
		}];
		
		this.callParent();
	},
	/**
	 * Applies the parameters from the filter panel to the proxy, then
	 * reload the store to refresh the grid.
	 * 
	 * @param none
	 * @return nothing
	 */
	onApply: function () {
		if (!this.store) {
			PartKeepr.getApplication().raiseRuntimeError("PartFilterPanel.store is not set");
			return;
		}
		this.applyFilterParameters(this.store.getProxy().extraParams);
		this.store.currentPage = 1;
		this.store.load({ start: 0});
	},
	/**
	 * Resets the fields to their original values, then call onApply()
	 * to reload the store.
	 */
	onReset: function () {
		this.storageLocationFilter.setValue("");
		this.categoryFilter.setValue({ category: 'all'});
		this.stockFilter.setValue({ stock: 'any'});
		this.distributorOrderNumberFilter.setValue("");
		
		this.createDateFilterSelect.setValue("");
		this.createDateField.setValue("");
		this.partsWithoutStockRemovals.setValue(false);
		this.partsWithoutPrice.setValue(false);
		
		this.onApply();
	},
	/**
	 * Creates the filter fields required for this filter panel
	 */
	createFilterFields: function () {
		
		// Create the storage location filter field
		this.storageLocationFilter = Ext.create("PartKeepr.StorageLocationComboBox", {
			fieldLabel: i18n("Storage Location"),
			minWidth: 300,
			anchor: '100%',
			forceSelection: true
		});
		
		// Create the category scope field
		this.categoryFilter = Ext.create("Ext.form.RadioGroup", {
			fieldLabel: i18n("Category Scope"),
			columns: 1,
			items: [{
			        	boxLabel: i18n("All Subcategories"),
			        	name: 'category',
			        	inputValue: "all",
			        	checked: true
			        },
			        {
			        	boxLabel: i18n("Selected Category"),
			        	name: 'category',
			        	inputValue: "selected"
			        }]
		});
		
		// Create the stock level filter field
		this.stockFilter = Ext.create("Ext.form.RadioGroup", {
			fieldLabel: i18n("Stock Mode"),
			columns: 1,
			items: [{
			        	boxLabel: i18n("Any Stock Level"),
			        	name: 'stock',
			        	inputValue: "any",
			        	checked: true
			        },{
			        	boxLabel: i18n("Stock Level = 0"),
			        	name: 'stock',
			        	inputValue: "zero"
			        },{
			        	boxLabel: i18n("Stock Level > 0"),
			        	name: 'stock',
			        	inputValue: "nonzero"
			        },{
			        	boxLabel: i18n("Stock Level < Minimum Stock Level"),
			        	name: 'stock',
			        	inputValue: "below"
			        }]
		});
		
		this.partsWithoutPrice = Ext.create("Ext.form.field.Checkbox", {
			fieldLabel: i18n("Item Price"),
			boxLabel: i18n("Show Parts without Price only")
		});
		
		this.distributorOrderNumberFilter = Ext.create("Ext.form.field.Text", {
			fieldLabel: i18n("Order Number")
		});
		
		this.createDateField = Ext.create("Ext.form.field.Date", {
			flex: 1
		});
		
		var filter = Ext.create('Ext.data.Store', {
		    fields: ['type', 'name'],
		    data : [
		        {"type":"<", "name":"before"},
		        {"type":">", "name":"after"},
		        {"type":"=", "name":"on"},
		        {"type":"", "name": "- none -"}
		    ]
		});
		
		this.createDateFilterSelect = Ext.create('Ext.form.ComboBox', {
		    store: filter,
		    queryMode: 'local',
		    forceSelection: true,
		    editable: false,
		    width: 60,
		    value: '',
		    triggerAction: 'all',
		    displayField: 'name',
		    valueField: 'type'
		});
		
		this.createDateFilter = {
				xtype: 'fieldcontainer',
				anchor: '100%',
				fieldLabel: i18n("Create date"),
				layout: 'hbox',
				border: false,
				items: [ this.createDateFilterSelect, this.createDateField ]
		};
		
		this.partsWithoutStockRemovals = Ext.create("Ext.form.field.Checkbox", {
			fieldLabel: i18n("Stock Settings"),
			boxLabel: i18n("Show Parts without stock removals only")
		});
		
	},
	/**
	 * Applies the filter parameters to the passed extraParams object.
	 * @param extraParams An object containing the extraParams from a proxy.
	 */
	applyFilterParameters: function (extraParams) {
		extraParams.withoutPrice = this.partsWithoutPrice.getValue();
		extraParams.categoryScope = this.categoryFilter.getValue().category;
		extraParams.stockMode = this.stockFilter.getValue().stock;
		extraParams.distributorOrderNumber = this.distributorOrderNumberFilter.getValue();
		/**
		 * Get the raw (=text) value. I really wish that ExtJS would handle selected values (from a store)
		 * distinct than entered values.
		 */ 
		if (this.storageLocationFilter.getRawValue() !== "") {
			extraParams.storageLocation = this.storageLocationFilter.getRawValue();
		} else {
			delete extraParams.storageLocation;
		}
		
		extraParams.createDateRestriction = this.createDateFilterSelect.getValue();
		extraParams.createDate = Ext.util.Format.date(this.createDateField.getValue(), "Y-m-d H:i:s");
		extraParams.withoutStockRemovals =  this.partsWithoutStockRemovals.getValue();
		
	}
	
});