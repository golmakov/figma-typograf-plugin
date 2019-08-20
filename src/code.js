function getSelectedObjects() {
    const selection = figma.currentPage.selection.filter(layer => layer.type === 'TEXT');
    if (selection.length === 0) {
        figma.ui.postMessage({
            type: 'showMessage',
            data: 'Select at least 1 text layer.'
        })
    } else {
        return selection;
    }
}



figma.closePlugin();