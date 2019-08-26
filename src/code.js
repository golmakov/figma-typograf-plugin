import * as Typograf from '../node_modules/typograf/dist/typograf.min.js';
const tp = new Typograf({locale: ['ru', 'en-US']});

function haveMixedStyle(obj, start = 0, end) {
    if (end === undefined) { 
        end = obj.characters.length;
    }
    return obj.getRangeFontName(start, end) === figma.mixed ||
           obj.getRangeFontSize(start, end) === figma.mixed || 
           obj.getRangeTextCase(start, end) === figma.mixed || 
           obj.getRangeTextDecoration(start, end) === figma.mixed || 
           obj.getRangeLetterSpacing(start, end) === figma.mixed || 
           obj.getRangeLineHeight(start, end) === figma.mixed || 
           obj.getRangeFills(start, end) === figma.mixed ||
           obj.getRangeTextStyleId(start, end) === figma.mixed ||
           obj.getRangeFillStyleId(start, end) === figma.mixed;
}

// Фигма требует, чтобы перед любыми операциями с текстом, происходила асинхронная загрузка шрифта — https://www.figma.com/plugin-docs/api/TextNode/
async function typografText(obj) {
    if (obj.hasMissingFont != true) {
        if (haveMixedStyle(obj) === false) {
            await figma.loadFontAsync(obj.fontName);
            obj.characters = tp.execute(obj.characters);
        } else {
            figma.closePlugin("Mixed text styles can't be typografed");
        }
    } else {
        figma.closePlugin("Text with missing fonts can't be typografed");
    }
}

const selection = figma.currentPage.selection.filter(layer => layer.type === 'TEXT');
if (selection.length === 0) {
    figma.closePlugin("Select at least 1 text layer");
} else {
    selection.forEach(typografText);
}

figma.closePlugin();