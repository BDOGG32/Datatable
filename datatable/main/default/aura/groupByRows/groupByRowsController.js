({
    doInit: function(component, event, helper){
        
    },
    
    preventWindowDefault: function(component) {
        component.set("v.preventWindowDefaultClickEvent", true);
    },
    
    handleGroupByRowAction: function(component, event, helper) {
        var idValue = event.currentTarget.id;
        var checkedValue = event.currentTarget.checked;
        var selectedRowNumber = idValue.split("-");
        var parentRow = selectedRowNumber[1];
        var rowNum = selectedRowNumber[3];
        var rowId = selectedRowNumber[0]+'-'+selectedRowNumber[1];
        
        var rowData = [];
        var data = component.get("v.data");
        var selectedRowCount = component.get('v.selectedRowCount');
        data[parentRow][rowNum].isSelected = checkedValue;
        if(checkedValue) {
            selectedRowCount++;
        } else{
            selectedRowCount--;
        }
        component.set('v.selectedRowCount', selectedRowCount);
        
        var checkbox;
        var checkedItems = 0;
        for (let i in data[parentRow]) {
            if(data[parentRow][i].isSelected){
                checkedItems++;
            }
        }
        checkbox = document.getElementById(rowId);
        checkbox.indeterminate = false;
        if(checkedItems == data[parentRow].length){
            data[parentRow].isSelected = true;
            checkbox.checked = true;
        }else if(checkedItems == 0){
            data[parentRow].isSelected = false;
            checkbox.checked= false;
        }else{
            checkbox.indeterminate = true;
            data[parentRow].isSelected = false;
        }
        
        var counter = 0;
        for(var i in data) {
            if(data[i].isSelected) {
                counter++;
            }
        }
        document.getElementById('checkAll').indeterminate = false;
        if(counter == data.length) {
            document.getElementById('checkAll').checked = true;
        } else if(counter == 0) {
            document.getElementById('checkAll').checked = false;
            if(checkedItems > 0) {
                document.getElementById('checkAll').indeterminate = true;
            }
        } else {
            document.getElementById('checkAll').indeterminate = true;
        }
        component.set("v.groupBySelectedRows", []);
        console.log(data);
        component.set('v.data', data);
    },
    
    groupByInlineEdit : function(component,event,helper){
        var currentSource = event.currentTarget;
        var currentInlineSection = currentSource.getAttribute('data-value');
        var data = component.get("v.data");
        var selectedRows = component.get("v.groupBySelectedRows");
        for(var key = 0; key < data.length; key++) {
            for(var i = 0; i < data[key].length; i++) {
            	if(data[key][i].isSelected) {
                	selectedRows.push(data[key][i]);
                }
            }
        }
        component.set("v.groupBySelectedRows", selectedRows);
        
        var parentRowNumber =  helper.getParentNumber(component, currentInlineSection);
        var rowNumber =  helper.getRowNumber(component, currentInlineSection);
        var columnNumber = helper.getColumnNumber(component, currentInlineSection);
        
		component.set("v.currentSelectedValue", data[parentRowNumber][rowNumber].row[columnNumber].fieldValue);
        component.set("v.selectedValueToChange", data[parentRowNumber][rowNumber].row[columnNumber].fieldValue);
        component.set("v.isCurrentSelectedEdited", data[parentRowNumber][rowNumber].row[columnNumber].isEdited);
        component.set('v.currentSelectedInlineId', currentInlineSection);
        component.set("v.currentSelectedInlineHighlightId", currentInlineSection);
    },
    
    onGroupByValueChange: function(component, event, helper) {
        var currentInlineSection = component.get('v.currentSelectedInlineId');
            var parentRow = helper.getParentNumber(component, currentInlineSection);
            var rowNumber = helper.getRowNumber(component, currentInlineSection);
            var columnNumber = helper.getColumnNumber(component, currentInlineSection);
        
            var data = component.get("v.data");
        if(component.get("v.selectedRowCount") <= 1){
            var updatedRecords = component.get("v.updatedRecords");
            data[parentRow][rowNumber].row[columnNumber].isEdited = true;
            updatedRecords.push(data[parentRow][rowNumber]);
            component.set("v.updatedRecords", updatedRecords);
        } else {
            component.set("v.selectedValueToChange", event.getSource().get('v.value'));
        }
        component.set("v.data", data);
    },
    
    highlighSelectedRows: function(component, event, helper) {
        var currentSource = event.currentTarget;
        var selectedValue = event.currentTarget.checked;
        var currentInlineSection = currentSource.getAttribute('data-value');
        component.set("v.currentSelectedInlineHighlightId", currentInlineSection);
        
        var parentRowNumber =  helper.getParentNumber(component, currentInlineSection);
        var rowNumber =  helper.getRowNumber(component, currentInlineSection);
        var columnNumber = helper.getColumnNumber(component, currentInlineSection); 
        
        var data = component.get("v.data");
        var existingValue = data[parentRowNumber][rowNumber].row[columnNumber].isEdited;
        var selectedRows = component.get("v.groupBySelectedRows");
            for(var i=0; i<selectedRows.length;i++) {
                if(selectedValue) {
                    data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEditing = true;
                } else {
                    data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEditing = false;
                }
            }
        component.set("v.data", data);
    },
    
    applyChangesForGroupBy: function(component, event, helper) {
        var currentInlineSection = component.get('v.currentSelectedInlineId');
        
        var checkboxId = currentInlineSection.replace('column', 'chkbox');
        var checkboxValue = document.getElementById(checkboxId).checked;
        
        var parentRow = helper.getParentNumber(component, currentInlineSection);
        var rowNumber = helper.getRowNumber(component, currentInlineSection);
        var columnNumber = helper.getColumnNumber(component, currentInlineSection);
        
        var data = component.get("v.data");
        var selectedRows = component.get("v.groupBySelectedRows");
        var updatedRecords = component.get("v.updatedRecords");
        data[parentRow][rowNumber].row[columnNumber].isEdited = true;
        updatedRecords.push(data[rowNumber]);
        
        if(checkboxValue) {
                for(var i=0; i<selectedRows.length;i++) {
                    data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].fieldValue = component.get("v.selectedValueToChange");
                    data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEdited = true;
                    data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEditing = false;
                    updatedRecords.push(data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber]);
                }
        }
        data[parentRow][rowNumber].row[columnNumber].fieldValue = component.get("v.selectedValueToChange");
        data[parentRow][rowNumber].row[columnNumber].isEdited = true;
        data[parentRow][rowNumber].row[columnNumber].isEditing = false;
        updatedRecords.push(data[parentRow][rowNumber]);
        component.set("v.data", data);
        component.set("v.updatedRecords", updatedRecords);
        component.set("v.selectedValueToChange", '');
        component.set("v.currentSelectedInlineHighlightId", '');
        document.getElementById(checkboxId).checked = false;
    },
    
    cancel: function(component, event, helper) {
        var currentSource = event.currentTarget;
        var currentInlineSection = currentSource.getAttribute('data-value');
        
        var parentRowNumber =  helper.getParentNumber(component, currentInlineSection);
        var rowNumber =  helper.getRowNumber(component, currentInlineSection);
        var columnNumber = helper.getColumnNumber(component, currentInlineSection);
        
        var data = component.get("v.data");
        var selectedRows = component.get("v.groupBySelectedRows");
            for(var i=0; i<selectedRows.length;i++) {
                data[selectedRows[i].row[0].parentRowNumber][selectedRows[i].rowNumber].row[columnNumber].isEditing = false;
            }
        data[parentRowNumber][rowNumber].row[columnNumber].fieldValue = component.get("v.currentSelectedValue");
        data[parentRowNumber][rowNumber].row[columnNumber].isEdited = component.get("v.isCurrentSelectedEdited");
        component.set("v.data", data);
        component.set("v.currentSelectedValue", '');
        component.set("v.selectedValueToChange", '');
        component.set("v.isCurrentSelectedEdited", false);
        component.set("v.currentSelectedInlineHighlightId", '');
    }
})