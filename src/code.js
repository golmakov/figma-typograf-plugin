import * as Typograf from '../node_modules/typograf/dist/typograf.min.js';
const tp = new Typograf({locale: ['ru', 'en-US']});

// Фигма требует, чтобы перед любыми операциями с текстом, происходила асинхронная загрузка шрифта — https://www.figma.com/plugin-docs/api/TextNode/
async function typografText(obj) {
    if (obj.hasMissingFont != true && obj.fontName != figma.mixed) {
        await figma.loadFontAsync(obj.fontName);
        obj.characters = tp.execute(obj.characters);
    }
}

const selection = figma.currentPage.selection.filter(layer => layer.type === 'TEXT');
if (selection.length === 0) {
    figma.closePlugin('Select at least 1 text layer.');
} else {
    selection.forEach(typografText);
}

figma.closePlugin();