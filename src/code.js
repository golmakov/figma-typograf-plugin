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

function getTextnodeStyle(obj, start = 0, end) {
    if (end === undefined) { 
        end = obj.characters.length;
    }
    let style = {};

    style.FontName = obj.getRangeFontName(start, end);
    style.FontSize = obj.getRangeFontSize(start, end);
    style.TextCase = obj.getRangeTextCase(start, end);
    style.TextDecoration = obj.getRangeTextDecoration(start, end);
    style.LetterSpacing = obj.getRangeLetterSpacing(start, end);
    style.LineHeight = obj.getRangeLineHeight(start, end);
    style.Fills = obj.getRangeFills(start, end);
    style.TextStyleId = obj.getRangeTextStyleId(start, end);
    style.FillStyleId = obj.getRangeFillStyleId(start, end);

    return style;    
}

function saveTextnodeStyle(obj) {
    let t0 = performance.now();
    let end = obj.characters.length;
    let test = end;
    let start = 0;
    style = [];
    while (start != end) {
        console.log(start,test,end)
        if (test == start) {
            test = end;
        }
        test = Math.floor((start + test)/2);
        if (haveMixedStyle(obj, start, test) === false) {
            style.push({
                start: start,
                end: test,
                style: getTextnodeStyle(obj, start, test)
            })
            if (haveMixedStyle(obj, test, end) === false) {
                style.push({
                    start: test,
                    end: end,
                    style: getTextnodeStyle(obj,  test, end)
                })
                start = end;
            } else {
                start = test;
            }
        }
    }
    let t1 = performance.now();
    console.log('Took', (t1 - t0).toFixed(4));
    return style;
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