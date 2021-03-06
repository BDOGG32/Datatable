## Lightning Datatable
###### Version: 0.1.0
###### Salesforce Lightning Component
\
Lightning datatable component added with some customisation. It has two features
1. Single table with inline editing, column action, cell action.
2. Nested table with group-by feature.

## Attributes
It has following attributes.

Attribute| Type|Required|Default|Description
-------- | ----|--------|-------|-----------|
showTable| boolean|Yes|	false|display the table
columns | list|||this will display the list of columns/fields
allowColumnSorting | boolean|||enable the sorting
allowRowSelection | boolean|||Control the row selection
showRowNumberColumn | boolean|||Show the row number
allowInlineEditing | boolean|||enable the inline editing
data | list|||Data to be display
sortDirection | String||ASC|maintain the sorting order
defaultSorting | map|||specify the default sorting params
defaultSorting | map|||specify the default sorting params
selectedRowData | map|||selected row data can be accessed by this Attribute
groupBySelectedRows | map|||selected row data when group-by can be accessed by this Attribute
groupBy | String|||Name of the group by field
keyField | String|||Name of the key field
rowAttributes | map|||formatting for specific row and column

## Usage
```Python
<c:Datatable showTable="true"
                  allowColumnSorting="true"
                  allowRowSelection="true"
                  showRowNumberColumn="true"
                  allowInlineEditing="true"
                  keyField= "Name"
                  groupBy="Name"
                  defaultSorting="{
                                    field:'Name',
                                    direction: 'ASC'
                                  }"
                  columns="[
                            {
                                columnHeader: 'Date',
                                field: 'Date',
                                textWrappingOrClipping: 'clipping',
                                type: 'dateTime',
                           		columnAttributes:{
                                        actions: [
                                            {
                                                label: 'Send SMS',
                                                action: 'Send_SMS',
                         						icon:'custom:custom3'
                                            }
                                        ]
                                    }

                           },
                            {
                                columnHeader: 'Name',
                                field: 'Name',
                           		textWrappingOrClipping: 'wrapping',
                                type: 'text',
                           		columnAttributes:{
                                        actions: [
                                            {
                                                label: 'action -1',
                                                action: 'action_1',
                         						icon:'custom:custom3'
                                            }
                                        ]
                                    }
                        	},
                           {
                                columnHeader: 'Email',
                                field: 'Email',
                                textWrappingOrClipping: 'clipping',
                                type: 'email'



                        	},
                           {
                                columnHeader: 'Amount',
                                field: 'Amount',
                                textWrappingOrClipping: 'clipping',
                                type: 'currency'



                        	},
                           {
                                columnHeader: 'Link',
                                field: 'Link',
                                textWrappingOrClipping: 'clipping',
                                type: 'hyperlink'
                           	},

                           {
                                columnHeader: 'Phone',
                                field: 'Phone',
                                textWrappingOrClipping: 'clipping',
                                type: 'phone'
                           	}

                           ]"
                  rowAttributes="{
                                    automatically:{
                                        fontColor: '#RED',
                                        horizontalAlignment: 'center',
                                        cellAttributes:{
                                                actions: [
                                                    {
                                                        label: 'Send SMS',
                                                        action: 'Send_SMS',
                                                        icon: 'arrow_down'
                                                    }
                                                ],
                                                fontColor: '#FF0000',
                                                fillColor: '#FFFFFF',
                                                horizontalAlignment: 'center'
                            			}
                                    }}"
                  data= "[
                         {Date: '2019-01-23',Name:'Dave',Email:'Dave@gmail.com',Amount:'9834',Link:'www.gmail.com',Phone:'12328287896'},
                         ]"/>

```
