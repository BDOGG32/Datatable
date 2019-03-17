({
    groupBy: function(component, list, prop, indx) {
        var toString = Object.prototype.toString;
        var isFunction = function(o) { return toString.call(o) == '[object Function]'; };
        var groupByData = [];
        groupByData = function group(list, prop, indx) {
          return list.reduce(function(grouped, item) {
              console.log();
              var key = isFunction(prop) ? prop.apply(this, [item]) : item.row[indx][prop];
              grouped[key] = grouped[key] || [];
              grouped[key].push(item);
              return grouped;
          }, {});
        }
        return groupByData;
    },
    
    
    sortBy: function(component, sortField, direction) {

        var sortBy = sortField;
        var sortDirection = direction;

        var columns = component.get("v.columns");
        var columnIndex = [];
        var indx = 0;
        var sortDir = true;
        var records = component.get("v.data");
        if(sortDirection == 'ASC') {
            sortDirection = 'DESC';
            sortDir = false;
            document.getElementById(sortBy+'arrowdown').style.visibility='';
            document.getElementById(sortBy+'arrowup').style.visibility='hidden';

        }else {
        	sortDirection = 'ASC';
            sortDir = true;
            document.getElementById(sortBy+'arrowup').style.visibility='';
            document.getElementById(sortBy+'arrowdown').style.visibility='hidden';
        }
        for(var c in columns) {
        	columnIndex[columns[c].field] = indx++;
            if(sortBy!=columns[c].field) {
                document.getElementById(columns[c].field+'arrowup').style.visibility='hidden';
            	document.getElementById(columns[c].field+'arrowdown').style.visibility='hidden';
            }
        }
        component.set('v.sortDirection', sortDirection);
        component.set('v.currentFieldSorted', sortBy);
        records.sort(function(a,b){
            var pos = columnIndex[sortBy];
            var t1 = a.row[pos][sortBy] == b.row[pos][sortBy],
                t2 = (!a.row[pos][sortBy] && b.row[pos][sortBy]) || (a.row[pos][sortBy] < b.row[pos][sortBy]);
            return t1? 0: (sortDir?-1:1)*(t2?1:-1);
        });
        //component.set("v.sortField", field);
        component.set("v.data", records);

    },

    sortOnGroupBy: function(component, sortField, direction) {

        var sortBy = sortField;
        var sortDirection = direction;

        var columns = component.get("v.columns");
        var columnIndex = [];
        var indx = 0;
        var sortDir = true;
        var records = component.get("v.data");
        if(sortDirection == 'ASC') {
            sortDirection = 'DESC';
            sortDir = false;
            document.getElementById(sortBy+'arrowdown').style.visibility='';
            document.getElementById(sortBy+'arrowup').style.visibility='hidden';

        }else {
        	sortDirection = 'ASC';
            sortDir = true;
            document.getElementById(sortBy+'arrowup').style.visibility='';
            document.getElementById(sortBy+'arrowdown').style.visibility='hidden';
        }
        for(var c in columns) {
        	columnIndex[columns[c].field] = indx++;
            if(sortBy!=columns[c].field) {
                document.getElementById(columns[c].field+'arrowup').style.visibility='hidden';
            	document.getElementById(columns[c].field+'arrowdown').style.visibility='hidden';
            }
        }
        component.set('v.sortDirection', sortDirection);
        component.set('v.currentFieldSorted', sortBy);
        for(var record in records) {
            records[record].sort(function(a,b){
                var pos = columnIndex[sortBy];
                var t1 = a.row[pos][sortBy] == b.row[pos][sortBy],
                    t2 = (!a.row[pos][sortBy] && b.row[pos][sortBy]) || (a.row[pos][sortBy] < b.row[pos][sortBy]);
                return t1? 0: (sortDir?-1:1)*(t2?1:-1);
            });
        }
        //component.set("v.sortField", field);
        component.set("v.data", records);

    },

    renderPage: function(component) {
		var records = component.get("v.data"),
            pageNumber = component.get("v.pageNumber"),
            pageRecords = records.slice((pageNumber-1)*10, pageNumber*10);
        component.set("v.currentList", pageRecords);
	},

    hideInputBox : function(component, event) {
        var currentInlineSection = component.get('v.currentSelectedInlineId');
        if(currentInlineSection != null && currentInlineSection != 'none')
        document.getElementById(currentInlineSection).style.display='none';

    },
    
    getRowNumber: function(component, currentInlineSection) {
        var rowandcolumn = currentInlineSection.replace('column', '-cell-').split('-');
        return rowandcolumn[3];
    },
    
    getColumnNumber: function(component, currentInlineSection) {
		var rowandcolumn = currentInlineSection.replace('column', '-cell-').split('-');        
        return rowandcolumn[4];
    },
  	
    getParentNumber: function(component, currentInlineSection) {
        var rowandcolumn = currentInlineSection.replace('column', '-cell-').split('-');
        return rowandcolumn[1];
    }
})