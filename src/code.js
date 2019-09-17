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

function findStyleBorder(obj, start, left, right) {
    if (haveMixedStyle(obj, start, right)) {
        let mid = Math.floor((left + right)/2);
        if (haveMixedStyle(obj, start, mid) === false) {
            if (haveMixedStyle(obj, start, mid +1) || mid === right) {
                return mid;
            } else {
                return findStyleBorder(obj, start, mid+1, right);
            }
        } else {
            return findStyleBorder(obj, start, left, mid);
        }
    } else {
        return right;
    }
}

function saveTextnodeStyle(obj) {
    let end = obj.characters.length;
    let start = 0;
    let style = [];

    while (start < end) {
        let border = findStyleBorder(obj, start, start, end);
        style.push({
            start: start,
            end: border,
            style: getTextnodeStyle(obj, start, border)
        });
        start = border;
    }
    return style;
}

function applyTextnodeStyles(obj, styles) {
    styles.forEach(async function(st) {
        // Фигма требует, чтобы перед любыми операциями с текстом, происходила асинхронная загрузка шрифта — https://www.figma.com/plugin-docs/api/TextNode/
        await figma.loadFontAsync(st.style.FontName);
        obj.setRangeFontName(st.start, st.end, st.style.FontName);
        obj.setRangeFontSize(st.start, st.end, st.style.FontSize);
        obj.setRangeTextCase(st.start, st.end, st.style.TextCase);
        obj.setRangeTextDecoration(st.start, st.end, st.style.TextDecoration);
        obj.setRangeLetterSpacing(st.start, st.end, st.style.LetterSpacing);
        obj.setRangeLineHeight(st.start, st.end, st.style.LineHeight);
        obj.setRangeFills(st.start, st.end, st.style.Fills);
        obj.setRangeTextStyleId(st.start, st.end, st.style.TextStyleId);
        obj.setRangeFillStyleId(st.start, st.end, st.style.FillStyleId);
    })
}

async function loadFontsFromStyles(styles) {
    for (const st of styles) {
        await figma.loadFontAsync(st.style.FontName);
    }
}


async function typografText(obj) {
    if (obj.hasMissingFont != true) {
        let styles = saveTextnodeStyle(obj);
        await loadFontsFromStyles(styles).then(() => {
            obj.characters = tp.execute(obj.characters);
            applyTextnodeStyles(obj, styles);
        });
    } else {
        figma.closePlugin("Text with missing fonts can't be typografed");
    }
}

const selection = figma.currentPage.selection.filter(layer => layer.type === 'TEXT');
if (selection.length === 0) {
    figma.closePlugin("Select at least 1 text layer");
} else {
    const promises = selection.map(typografText);
    Promise.all(promises).then(resolve => {
        figma.closePlugin();
    });
}
