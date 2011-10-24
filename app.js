Ext.Loader.setConfig({
    enabled: true
});

// Map the require prefix "Ext.ux" to the Sencha directory that has examples for UX
Ext.Loader.setPath('Ext.ux', '/extjs/examples/ux');

Ext.require([
    'Ext.selection.CellModel',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.CheckColumn'
]);

Ext.onReady(function(){

    Ext.define('Item', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'name', type: 'string'},
            {name: 'color'},
            {name: 'price', type: 'float'},
            {name: 'availability', type: 'date', dateFormat: 'm/d/Y'},
            {name: 'active', type: 'bool'}
        ]
    });

    var store = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        model: 'Item',
        proxy: {
            type: 'ajax',
            url: 'items.xml',
            reader: {
                type: 'xml',
                record: 'item'
            }
        },
        sorters: [{
            property: 'common',
            direction:'ASC'
        }]
    });

    function formatDate(value){
        return value ? Ext.Date.dateFormat(value, 'M d, Y') : '';
    }

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    // create the grid and specify what field you want
    // to use for the editor at each header.
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [{
            id: 'name',
            header: 'Name',
            dataIndex: 'name',
            flex: 1,
            field: {
                allowBlank: false
            }
        },{
            header: 'Color',
            dataIndex: 'color',
            width: 130,
            field: {
                xtype: 'combobox',
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [
                    ['Red','Red'],
                    ['Green','Green'],
                    ['Blue','Blue']
                ],
                lazyRender: true,
                listClass: 'x-combo-list-small'
	    }
        },{
            header: 'Price',
            dataIndex: 'price',
            width: 70,
            align: 'right',
            renderer: 'usMoney',
            field: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0,
                maxValue: 100000
            }
        },{
            header: 'Availability',
            dataIndex: 'availability',
            width: 95,
            renderer: formatDate,
            field: {
                xtype: 'datefield',
                format: 'm/d/y'
            }
	},{
	    xtype: 'checkcolumn',
            header: 'Active?',
            dataIndex: 'active',
            width: 55
        }],
        selModel: {
            selType: 'cellmodel'
        },
        renderTo: 'editor-grid',
        width: 600,
        height: 300,
        plugins: [cellEditing]
    });

    store.load();
});

