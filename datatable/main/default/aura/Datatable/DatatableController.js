({
    doInit: function(component, event, helper) {
        var columns = component.get("v.columns");
        var data = component.get("v.data");
        var defaultSorting = component.get("v.defaultSorting");
        var rowAttributes = component.get("v.rowAttributes");
        var renderData = [];
        for(var i in data) {
            var record = [];
            for(var key in data[i]) {
                var item = {};
                item[key] = data[i][key];
                item['fieldValue'] = data[i][key];
                for(var c in columns) {
                    if(key == columns[c].field){
                        item['type'] = columns[c].type;
                        item['columnHeader'] = columns[c].columnHeader;
                        item['textWrappingOrClipping'] = columns[c].textWrappingOrClipping;
                        item['isEdited'] = false;
                        item['isEditing'] = false;
                    }
                }
                if(rowAttributes != null ) {
                    if( typeof rowAttributes[data[i][key]] !== 'undefined') {
                        item['rowAttributes'] = rowAttributes[data[i][key]];
                    }
                }
                
                record.push(item);
            }
            var temp ={};
            temp['isSelected'] = false;
            temp['row'] = record;
            renderData.push(temp);
        }
        
        component.set('v.data', renderData);
        component.set('v.renderingCompleted', true);
        
        var sortBy = '';
        var sortDirection = '';
        if(defaultSorting != null) {
            sortBy = defaultSorting.field;
            sortDirection = defaultSorting.direction;
            component.set('v.currentFieldSorted', sortBy);
        } else {
            sortBy = columns[0].field;
            sortDirection = 'ASC';
            component.set('v.currentFieldSorted', sortBy);
        }
        
        var columnIndex = [];
        var indx = 0;
        var sortDir = true;
        for(var c in columns) {
            columnIndex[columns[c].field] = indx++;
        }
        renderData.sort(function(a,b){
            var pos = columnIndex[sortBy];
            var t1 = a.row[pos][sortBy] == b.row[pos][sortBy],
                t2 = (!a.row[pos][sortBy] && b.row[pos][sortBy]) || (a.row[pos][sortBy] < b.row[pos][sortBy]);
            return t1? 0: (sortDir?-1:1)*(t2?1:-1);
        });
        
        var toString = Object.prototype.toString;
        var isFunction = function(o) { return toString.call(o) == '[object Function]'; };
        function group(list, prop, indx) {
            return list.reduce(function(grouped, item) {
                var key = isFunction(prop) ? prop.apply(this, [item]) : item.row[indx][prop];
                grouped[key] = grouped[key] || [];
                grouped[key].push(item);
                return grouped;
            }, {});
        }
        
        function groupNone(list, prop) {
            return list.reduce(function(grouped, item) {
                var key = prop;
                grouped[key] = grouped[key] || [];
                grouped[key].push(item);
                return grouped;
            }, {});
        }
        
        component.set("v.data", renderData);
        var groupByField = component.get('v.groupBy');
        var groupByData;
        var groupByList = [];
        if(groupByField != 'none') {
            var pos = columnIndex[groupByField];
            groupByData = group(renderData, groupByField, pos);
            console.log(groupByData);
            for(var key in groupByData) {
                groupByData[key]['groupByFieldValue'] = key;
                groupByData[key]['isSelected']=false;
                groupByList.push(groupByData[key]);
            }
            component.set('v.data', groupByList);
        } else {
            groupByData = groupNone(renderData, 'none');
            groupByData['none']['groupByFieldValue'] = 'none';
            groupByData['none']['isSelected']=false;
            groupByList.push(groupByData['none']);
            component.set('v.data', groupByList);
        }
        for(var key=0;key< groupByList.length;key++) {
            groupByList[key]['chkboxid'] = 'parent-'+key;
            for(var i=0; i<groupByList[key].length;i++) {
                groupByList[key][i]['rowNumber'] = i;
                groupByList[key][i]['chkboxid'] = 'parent-'+key+'-row-'+i;
                for(var j=0; j< groupByList[key][i].row.length; j++) {
                    groupByList[key][i].row[j]['parentRowNumber'] = key;
                    groupByList[key][i].row[j]['id'] = 'parent-'+key+'column'+i+'-'+j;
                    groupByList[key][i].row[j]['chkboxid'] = 'parent-'+key+'chkbox'+i+'-'+j;
                }
            }
        }
        window.addEventListener('click', $A.getCallback(function(evt){
            if(component.get("v.preventWindowDefaultClickEvent")){
                component.set("v.preventWindowDefaultClickEvent", false);
            } else {
                var currentInlineSection = component.get('v.currentSelectedInlineId');
                var div = document.getElementById(currentInlineSection);
                
                var target=evt.target.dataset.value;
                var idvalue = '#'+currentInlineSection;
                if((target == null || !(target).matches(idvalue)) && currentInlineSection != "none"){
                    if(component.get('v.currentSelectedInlineHighlightId') != '' && component.get("v.selectedRowCount") > 1) {
                        var parentRow = helper.getParentNumber(component, currentInlineSection);
                        var rowNumber = helper.getRowNumber(component, currentInlineSection);
                        var columnNumber = helper.getColumnNumber(component, currentInlineSection);
                        var data = component.get('v.data');
                        data[parentRow][rowNumber].row[columnNumber].fieldValue = component.get("v.currentSelectedValue");
                        var selectedRows = component.get("v.groupBySelectedRows");
                        for(var i=0; i<selectedRows.length;i++) {
                            data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEditing = false;
                        }
                        component.set('v.data', data);
                    }
                    component.set("v.currentSelectedInlineHighlightId", '');
                    component.set("v.selectedValueToChange", '');
                }
            }
        }));
        
    },
    
    sortByColumn: function(component, event, helper) {
        var currentSource = event.currentTarget;
        var sortBy = currentSource.dataset.fieldname;
        var sortDirection = component.get("v.sortDirection");
        var groupBy=component.get("v.groupBy");
        helper.sortOnGroupBy(component, sortBy, sortDirection);
        
    },
    
    cellActionClicked: function (cmp, event, helper) {
        var actionName = event.getParam("value");
        var columnName = event.getSource().get('v.alternativeText');
    },
    
    showSortingIcon: function(component, event, helper) {
        var currentSource = event.currentTarget;
        var columnName = currentSource.dataset.fieldname;
        var sortDirection = component.get("v.sortDirection");
        var sortedField = component.get("v.currentFieldSorted");
        if(columnName != sortedField) {
            if(sortDirection == 'ASC') {
                document.getElementById(columnName+'arrowdown').style.visibility='';
            } else {
                document.getElementById(columnName+'arrowup').style.visibility='';
            }
        }
    },
    
    hideSortingIcon: function(component, event, helper){
        var currentSource = event.currentTarget;
        var columnName = currentSource.dataset.fieldname;
        var sortedField = component.get("v.currentFieldSorted");
        if(columnName != sortedField) {
            document.getElementById(columnName+'arrowdown').style.visibility='hidden';
            document.getElementById(columnName+'arrowup').style.visibility='hidden';
        }
    },
    
    selectAll: function(component, event, helper) {
        var currentValue = event.currentTarget.checked;
        var data = component.get("v.data");
        var groupBy=component.get("v.groupBy");
        var counter = 0;
        for(var i in data) {
            data[i].isSelected = currentValue;
            for(var j=0;j< data[i].length;j++) {
                counter++;
                data[i][j].isSelected=currentValue;
            }
            var checkbox = document.getElementById(data[i].chkboxid);
            checkbox.indeterminate = false;
        }
        if(!currentValue) {
            counter = 0;
        }
        component.set('v.selectedRowCount', counter);
        component.set('v.groupBySelectedRows', []);
        component.set('v.data', data);
    },
    
    selectChildNodes: function(component, event, helper) {
        var idValue = event.currentTarget.id;
        var rowNumber = idValue.split("-")[1];
        var currentValue = event.currentTarget.checked;
        var data = component.get("v.data");
        data[rowNumber].isSelected = currentValue;
        for(var j=0;j< data[rowNumber].length;j++) {
            data[rowNumber][j].isSelected=currentValue;
        }
        var parentCounter = 0;
        var counter = 0;
        for(var key = 0; key < data.length; key++) {
            if(data[key].isSelected) {
                parentCounter++;
            }
            for(var i = 0; i < data[key].length; i++) {
                if(data[key][i].isSelected) {
                    counter++;
                }
            }
        }
        document.getElementById('checkAll').indeterminate = false;
        if(parentCounter == data.length) {
            document.getElementById('checkAll').checked = true;
        } else if(parentCounter == 0) {
            document.getElementById('checkAll').checked = false;
        } else {
            document.getElementById('checkAll').indeterminate = true;
        }
        component.set('v.selectedRowCount', counter);
        component.set('v.groupBySelectedRows', []);
        component.set('v.data', data);
    },
    
    columnActionClicked : function (component, event, helper) {
        var actionName = event.getParam("value");
        var columnName = event.getSource().get('v.alternativeText');
    },
    
    calculateWidth : function(component, event, helper) {
        var childObj = event.target;
        var parObj = childObj.parentNode;
        while(parObj.tagName != 'TH') {
            parObj = parObj.parentNode;
        }
        var mouseStart=event.clientX;
        component.set("v.mouseStart",mouseStart);
        component.set("v.oldWidth",parObj.offsetWidth);
    },
    setNewWidth : function(component, event, helper) {
        var childObj = event.target;
        var parObj = childObj.parentNode;
        while(parObj.tagName != 'TH') {
            parObj = parObj.parentNode;
        }
        var mouseStart = component.get("v.mouseStart");
        var oldWidth = component.get("v.oldWidth");
        var newWidth = event.clientX- parseFloat(mouseStart)+parseFloat(oldWidth);
        parObj.style.width = newWidth+'px';
    },    
})