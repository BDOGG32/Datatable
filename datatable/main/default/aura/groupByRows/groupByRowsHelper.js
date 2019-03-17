({
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
    },
    
})