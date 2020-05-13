/**
 *
 * @type const about rect
 */
let rows = 0;
let cols = 0;
let dirs = 50;

let DX, DY;
let DXInterval = [];
let DYInterval = [];

let unRepeatedHeight = [];
let unRepeatedWidth = [];

let roofData = [];

let initTotalWidth = 1800;
let DXInit = 100; // initial width
let DYInit = 100; // initial height
let DXNew = 0; // moving width

let arrp = []; // arrpRect[k] = { i: i, j: j, cx: cx, cy: cy, r: r, used: 0 };  // k==i*cols + j;
let arrpLast = [];

let back_color = "#333333";
let totalWidth; // total width
let totalHeight; // total Height
let flagApplyWidth, flagApplyHeight;
let svgWidth, svgHeight;
let removePoints = []; // selected points
let removedPoints = [];
let recoverPoints = [];
let autoWidth = [], autoHeight = [];
let autoWidthValue, autoHeightValue;

let lastPartitialWidth = [], lastPartitialHeight = [];

const borderThick = 5;

let flagBackWidth = false;
let flagBackHeight = false;
let flagBackRemove = false;
let addRoof = 0;
let flagAddThick = false;
let flagAddThickBack = false;
let textHtmlRoof = "";
let svgInit = "";
let a = document.createElement('a');
let flagRoof = 0, flagSvgInit = 0;
let flagSubmit = 0;

function GenerateOpening() {
    flagSubmit = 0;
    cols = Number(document.getElementById("input_rows").value) + 1;
    rows = Number(document.getElementById("input_cols").value) + 1;

    if ((rows > 100) || (cols > 100))
    {
        alert("Please input the fields correctly!");
        return;
    }

    if (cols < 12)
    {
        DX = 100;
        DY = DX;
    }
    else
    {
        DX = initTotalWidth/cols;
        DY = DX;
    }

    totalWidth = Math.floor(DX * (cols - 1) * 10);
    totalHeight = Math.floor(DY * (rows - 1) * 10);
    autoWidthValue = Math.floor(totalWidth/(cols - 1));
    autoHeightValue = Math.floor(totalHeight/(rows - 1));

    for (let i = 1; i < cols; i ++)
        autoWidth[i] = autoWidthValue;

    for (let i = 1; i < rows; i ++)
        autoHeight[i] = autoHeightValue;

    showingWidthValues(autoWidth);
        
    arrp = [];
    DXNew = DXInit; // DXNew = 70 + DXInit;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cx = DXInit + j * DX;
            cy = DYInit + i * DY;
            arrp.push({ i: i, j: j, cx: cx, cy: cy});
        }
    }

    document.getElementById("totalWidth").value = totalWidth;
    document.getElementById("totalHeight").value = totalHeight;
    svgWidth = DX * cols;
    svgHeight = DY * rows;
    drawOpening();
}

function showingWidthValues(autoValues) {
    document.getElementById("widthPer").innerHTML = '';
    for (let i = 1; i < cols; i ++)
    {
        if ((i % 8 === 1) )
            document.getElementById("widthPer").innerHTML += '</div><div class="w3-bar" style="padding-left: 96px !important;">';
        if (i === 1)
            document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item">\n' +
            '                    <label for="1th"><a class="underLineTxt">1</a>st Partial Width: </label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item">\n' +
            '                    <input id="1th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
            '                    <input id="1thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
            '                    <label for="1thCheck">Automatic</label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
        else if((i !== 1) && (i % 8 === 1))
            if (i === 9)
                document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item" style="padding-left: 96px !important;">\n' +
                '                    <label for="' + i + 'th"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                '                    <input id="' + i + 'thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                '                    <label for="' + i + 'thCheck">Automatic</label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
            else
                document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item" style="padding-left: 96px !important;">\n' +
                    '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                    '                    <input id="' + i + 'thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                    '                    <label for="' + i + 'thCheck">Automatic</label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
        else
            if (i < 10)
                document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item">\n' +
                '                    <label for="' + i + 'th"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                '                    <input id="' + i + 'thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                '                    <label for="' + i + 'thCheck">Automatic</label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
            else
                document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item">\n' +
                    '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '"disabled="disabled"/>\n' +
                    '                    <input id="' + i + 'thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                    '                    <label for="' + i + 'thCheck">Automatic</label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
    }

    lastPartitialWidth = JSON.parse(JSON.stringify(autoValues));
}


function showingDeletedWidthValues(autoValues) {

    document.getElementById("printDelete").innerHTML = '';
        
    
    for(let j = 0; j < removePoints.length; j ++)
    {
        let i = j + 1;

        let m = Number(lastPartitialWidth[removePoints[j] % cols + 1]);
                
        if ((i % 8 === 1) )
            document.getElementById("printDelete").innerHTML += '</div><div class="w3-bar" style="padding-left: 96px !important;">';
        if (i === 1)
            document.getElementById("printDelete").innerHTML += '                <div class="w3-bar-item">\n' +
            '                    <label for="1th"><a class="underLineTxt">1</a>st Deleted Width: </label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item">\n' +
            '                    <input id="1th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + m + '" disabled="disabled"/>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
        else if((i !== 1) && (i % 8 === 1))
            if (i === 9)
                document.getElementById("printDelete").innerHTML += '                <div class="w3-bar-item" style="padding-left: 96px !important;">\n' +
                '                    <label for="' + i + 'th"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + m + '" disabled="disabled"/>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
            else
                document.getElementById("printDelete").innerHTML += '                <div class="w3-bar-item" style="padding-left: 96px !important;">\n' +
                    '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + m + '" disabled="disabled"/>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
        else
            if (i < 10)
                document.getElementById("printDelete").innerHTML += '                <div class="w3-bar-item">\n' +
                '                    <label for="' + i + 'th"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + m + '" disabled="disabled"/>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
            else
                document.getElementById("printDelete").innerHTML += '                <div class="w3-bar-item">\n' +
                    '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" value="' + m + '"disabled="disabled"/>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
    }
}

function showingHeightValues(autoValues) {
    document.getElementById("heightPer").innerHTML = '';
    for (let i = 1; i < rows; i ++)
    {
        if (i % 8 === 1)
            document.getElementById("heightPer").innerHTML += '</div><div class="w3-bar" style="padding-left: 100px !important;">';
        if (i === 1)
            document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item">\n' +
                '                    <label for="1thHeight"><a class="underLineTxt">1</a>st Partial Height: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="1thHeight" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                '                    <input id="1thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                '                    <label for="1thHeightCheck">Automatic</label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';

        else if((i !== 1) && (i % 8 === 1))
            if (i === 9)
                document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item" style="padding-left: 100px !important;">\n' +
                    '                    <label for="' + i + 'thHeight"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                    '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                    '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
            else
                document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item" style="padding-left: 100px !important;">\n' +
                    '                    <label for="' + i + 'thHeight"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item">\n' +
                    '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                    '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                    '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
                    '                </div>\n' +
                    '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';

        else
        if (i < 10)
            document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item">\n' +
                '                    <label for="' + i + 'thHeight"><a class="underLineTxt">' + '&nbsp;&nbsp;' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
        else
            document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item">\n' +
                '                    <label for="' + i + 'thHeight"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item">\n' +
                '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" value="' + autoValues[i] + '" disabled="disabled"/>\n' +
                '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
                '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
                '                </div>\n' +
                '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
    }

    lastPartitialHeight = JSON.parse(JSON.stringify(autoValues));
}

function apply() {

    unRepeatedWidth = [];
    unRepeatedHeight = [];
    roofData = [];

    if (document.getElementById('totalWidth').disabled === true)
    {
        flagApplyWidth = false;
        alert("Please check correctly!");
        return;
    }

    let totalWidthUpdate = document.getElementById('totalWidth').value/10;

    let remainCols = cols - 1;
    let remainWidth = totalWidthUpdate;

    /**
     * adding the set values
     */
    for (let i = 1; i < cols; i ++)
    {
        let str = (i).toString();
        str = str.concat("th");

        DXInterval[i] = document.getElementById(str).value/10;
        
        if (Number(document.getElementById(str).value) !== lastPartitialWidth[i])
        {
            remainCols -= 1;
            remainWidth -= document.getElementById(str).value/10;
        }
    }

    

    if (remainWidth < 0)
    {
        flagApplyWidth = false;
        alert("Please check correctly!");
        return;
    }

    /**
     * resetting the individual widths(DXInterval)
     * @type {number}
     */
    let sameWidth = remainWidth/remainCols;
    let mLast;
    DXInterval[0] = 0;
    for (let j = 1; j < cols; j ++)
    {
        if (DXInterval[j] === lastPartitialWidth[j]/10)
        {
            DXInterval[j] = sameWidth;
            mLast = j;
        }
    }
    /**
     * resetting coordinate points
     */
    arrp = [];
    for (let i = 0; i < rows; i ++)
    {
        cx = DXInit;
        cy = DYInit + DY * i;
        for (let j = 0; j < cols; j ++)
        {
            cx += DXInterval[j];
            arrp.push({i:i, j:j, cx:cx, cy:cy});
        }
    }

    svgWidth = totalWidthUpdate + 100;
    drawOpening();

    arrpLast = arrp;
    flagApplyWidth = true;
    textHtmlRoof = "";

    let auto = [];
    for(let j = 0; j < cols; j++)
        auto[j] = Math.floor(DXInterval[j] * 10);
        

    showingWidthValues(auto);
    showingHeightValues(autoHeight);
}

/**
 * Apply Height
 */

function applyHeight() {

    unRepeatedHeight = [];
    roofData = [];

    if (document.getElementById('totalHeight').disabled === true)
    {
        flagApplyHeight = false;
        alert("Please check correctly!");
        return;
    }

    removePoints = [];
    let totalHeightUpdate = document.getElementById('totalHeight').value/10;

    let remainRows = rows - 1;
    let remainHeight = totalHeightUpdate;

    /**
     * adding the set values
     */
    for (let i = 1; i < rows; i ++)
    {
        let str = (i).toString();
        str = str.concat("thHeight");

        DYInterval[i] = document.getElementById(str).value/10;

        if (Number(document.getElementById(str).value) !== lastPartitialHeight[i])
        {
            remainRows -= 1;
            remainHeight -= document.getElementById(str).value/10;
        }
    }

    

    if (remainHeight < 0)
    {
        flagApplyHeight = false;
        alert("Please check correctly!");
        return;
    }

    /**
     * resetting the individual widths(DXInterval)
     * @type {number}
     */
    let sameHeight = remainHeight/remainRows;
    DYInterval[0] = 0;
    for (let j = 1; j < rows; j ++)
    {
        if (DYInterval[j] === lastPartitialHeight[j]/10)
        {
            DYInterval[j] = sameHeight;
        }
    }

    /**
     * resetting coordinate points
     */
    arrp = [];
    cy = DYInit;

    for (let i = 0; i < rows; i ++)
    {
        cx = DXInit;
        cy += DYInterval[i];
        for (let j = 0; j < cols; j ++)
        {
            cx += DXInterval[j];
            arrp.push({i:i, j:j, cx:cx, cy:cy});
        }
    }

    svgHeight = totalHeightUpdate + 100;
    flagApplyHeight = true;
    removedPoints = [];
    textHtmlRoof = "";

    let auto = [];
    for(let j = 0; j < rows; j++)
        auto[j] = Math.floor(DYInterval[j] * 10);

    drawOpening();

    showingHeightValues(auto);
    // lastPartitialHeight = JSON.parse(JSON.stringify(auto));
    svgHeight = totalHeight/10 + 100;
}

/**
 * Drawing Opening
 */
function drawOpening() {
    let textHtml = "";
    for (let k = 0; k < arrp.length; k++) {
        let i = arrp[k].i;
        let j = arrp[k].j;
        let kk = (i - 1) * cols + j;
        if (i - 1 >= 0) textHtml += txtHtmlOfLine(k, kk).str;

        kk = (i - 1) * cols + (j - 1);
        if (dirs === 8 && i - 1 >= 0 && j - 1 >= 0)
            textHtml += txtHtmlOfLine(k, kk).str;

        kk = i * cols + (j - 1);
        if (j - 1 >= 0) textHtml += txtHtmlOfLine(k, kk).str;

        kk = (i + 1) * cols + (j - 1);
        if (dirs === 8 && i + 1 < rows && j - 1 >= 0)
            textHtml += txtHtmlOfLine(k, kk).str;
    }

    textHtml += linkPoint().str;

    let eleSVG = document.getElementById("svg");
    eleSVG.style.width = svgWidth + DXInit;
    eleSVG.style.height = svgHeight  + DYInit;
    eleSVG.innerHTML = textHtml;

    svgInit = eleSVG.innerHTML;
    if(flagApplyHeight === true)
    {
        eleSVG.addEventListener("click", onClickSVG);
    } 
}

function txtHtmlOfLine(k, kk) {
    let str = "";
    if (k >= 0 && k < arrp.length && kk >= 0 && kk < arrp.length)
        str = `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

    return { str };
}

function linkPoint() {
    let str = "";
    let k = 1;
    let fontSize = 14;
    let differenceHeight, differenceWidth;

    if (cols < 35)
    {
        fontSize = 20;
        differenceHeight = 23;
    }        
    else if (cols < 50)
    {
        fontSize = 12;
        differenceHeight = 18;
    }
    else if (cols < 70)
    {
        fontSize = 10;
        differenceHeight = 15;
    }
    else
    {
        fontSize = 8;
        differenceHeight = 10;
    }

    if (rows < 10)
        differenceWidth = differenceHeight;      
    else
        differenceWidth = differenceHeight * 3/2;


    for(let i = arrp.length - cols; i < arrp.length; i ++)
    {
        str += `<text x="${arrp[i].cx - fontSize/3}" y="${arrp[i].cy + differenceHeight}" fill="red" font-size="${fontSize}">${k}</text>`;
        k ++;
    }

    k = rows;
    for(let i = 0; i < rows; i ++)
    {
        str += `<text x="${arrp[i * cols].cx - differenceWidth}" y="${arrp[i * cols].cy + differenceWidth/4}" fill="red" font-size="${fontSize}">${k}</text>`;
        k --;
    }

    return { str };
}

function reset() {
    document.getElementById('totalWidth').value = totalWidth;
    document.getElementById('totalHeight').value = totalHeight;
    document.getElementById('totalCheck').checked = 'checked';
    document.getElementById('totalWidth').disabled = true;

    removePoints = [];
    arrp = [];
    textHtmlRoof = "";
    svgInit = "";
    flagRoof = 0;

    GenerateOpening();
}

function cancelSPA() {
    document.getElementById("input_rows").value = '';
    document.getElementById("input_cols").value = '';
}

function closeWindow() {
    removePoints = [];
    flagApplyHeight = false;
    drawOpening();
    $("div.widthChange").removeClass('hide');
    $("div.widthSetDelete").addClass('hide');
}

function resetHeight() {
    document.getElementById('totalWidth').value = totalWidth;
    document.getElementById('totalHeight').value = totalHeight;
    document.getElementById('totalHeightCheck').checked = 'checked';
    document.getElementById('totalHeight').disabled = true;

    showingHeightValues(autoHeight);

    arrp = arrpLast;
    removePoints = [];
    textHtmlRoof = "";
    svgInit = "";
    flagRoof = 0;
    drawOpening();
}

/**
 * back and forward
 */
function ForwardFirst() {
    if (flagBackWidth === true)
    {
        $("div.widthChange").removeClass('hide');
        $("div.inputRowCol").addClass('hide');
        flagBackWidth = false;
    }
}

function backWidth() {
    flagBackWidth = true;
    $("div.widthChange").addClass('hide');
    $("div.inputRowCol").removeClass('hide');
}

function ForwardWidth() {
    if (flagBackHeight === true)
    {
        $("div.heightChange").removeClass('hide');
        $("div.widthChange").addClass('hide');
        flagBackHeight = false;
    }
}

function backHeight() {
    flagBackHeight = true;
    $("div.heightChange").addClass('hide');
    $("div.widthChange").removeClass('hide');
}

function forwardHeight() {
    if (flagBackRemove === true)
    {
        $("div.widthSetDelete").removeClass('hide');
        $("div.heightChange").addClass('hide');
        flagBackRemove = false;
        flagApplyHeight = true;
    }
}

function backRemove() {
    flagBackRemove = true;
    flagApplyHeight = false;
    $("div.widthSetDelete").addClass('hide');
    $("div.heightChange").removeClass('hide');
}

function backThickHeight() {
    flagAddThick = false;
    flagAddThickBack = true;

    document.getElementById("printWidth").innerHTML = '';
    document.getElementById("printHeight").innerHTML = '';
    document.getElementById("printRoof").innerHTML = '';

    $("div.widthSetDelete").removeClass('hide');
    $("div.heightThick").addClass('hide');
    $("hr.hrBorderRoof").addClass('hide');
    $("div.svgCodeShowing").addClass('hide');
}

/**
 * Catching the mouse event
 */
function onClickSVG(evt) {
    if ((flagApplyHeight === false) || (flagAddThick === true))
        return;
    let t = evt;

    let cx = t.x - $("#svg").offset().left;
    let cy = t.y - $("#svg").offset().top + scrollY;

    if ((cx < DXInit) || (cx > DXInit + document.getElementById('totalWidth').value/10) || (cy < DYInit) || (cy > DYInit + document.getElementById('totalHeight').value/10))
        return;

    /**
     * getting the positions of the points
     */
    let i, j, k;
    cx -= DXInit;
    cy -= DYInit;

    for (j = 0; j < cols - 1; j ++)
    {
        if ((cx >= 0) && (cx < DXInterval[j + 1]))
            break;
        else
            cx -= DXInterval[j + 1];
    }

    for (i = 0; i < rows - 1; i ++)
    {
        if ((cy >= 0) && (cy < DYInterval[i + 1]))
            break;
        else
            cy -= DYInterval[i + 1];
    }

    k = cols * i + j;
    /**
     * display the selected domains
     */
    if (removedPoints.includes(k) === true)
    {
        if (recoverPoints.includes(k) === true)
        {
            recoverPoints.splice(recoverPoints.indexOf(k), 1);
            let textHtml = "";
            textHtml = `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="white"/>`;
            let eleSVG = document.getElementById("svg");
            eleSVG.innerHTML += textHtml;
        }
        else
        {
            recoverPoints.push(k);
            let textHtml = "";
            textHtml = `<rect id="point${k}" x="${arrp[k].cx + borderThick}" y="${arrp[k].cy + borderThick}" width="${DXInterval[j+1] - borderThick * 2}" height="${DYInterval[i+1] - borderThick * 2}" fill="#426271"/>`;
            let eleSVG = document.getElementById("svg");
            eleSVG.innerHTML += textHtml;
        }

    }
    else if (removePoints.includes(k) === true)
    {
        removePoints.splice(removePoints.indexOf(k), 1);
        let textHtml = "";
        textHtml = `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="white"/>`;
        let eleSVG = document.getElementById("svg");
        eleSVG.innerHTML += textHtml;
    }
    else
    {
        removePoints.push(k);
        let textHtml = "";
        textHtml = `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="gray"/>`;
        let eleSVG = document.getElementById("svg");
        eleSVG.innerHTML += textHtml;
    }
}

function setDelete() {
    let lengthArray = removePoints.length;
    let textHtmlSetDelete = "";
    let k, kStart, kLast;

    for(let m = 0; m < lengthArray; m ++)
    {
        k = removePoints[m];
        let i = Math.floor(k / cols);
        let j = k - i * cols;

        textHtmlSetDelete += `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="#ffffff"/>`;

        if ((k >= cols) && (removePoints.includes(k - cols) === true))
        {
            kStart = k;
            kLast = k + 1;
            let tWidth = borderThick/2 - 0.1;
            textHtmlSetDelete += `<line x1="${arrp[kStart].cx + tWidth}" y1="${arrp[kStart].cy}" x2="${arrp[kLast].cx - tWidth}" y2="${arrp[kLast].cy}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;

            if(removedPoints.includes(k) === false)
                removedPoints.push(k);
            if(removedPoints.includes(k - cols) === false)
                removedPoints.push(k - cols);
        }
        if (removePoints.includes(k + 1) === true)
        {
            kStart = k + 1;
            kLast = kStart + cols;
            let tWidth = borderThick/2 - 0.1;
            textHtmlSetDelete += `<line x1="${arrp[kStart].cx}" y1="${arrp[kStart].cy + tWidth}" x2="${arrp[kLast].cx}" y2="${arrp[kLast].cy - tWidth}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;

            if(removedPoints.includes(k) === false)
                removedPoints.push(k);
            if(removedPoints.includes(k + 1) === false)
                removedPoints.push(k + 1);
        }

        if ((k + cols <= lengthArray) && (removePoints.includes(k + cols) === true))
        {
            kStart = k + cols;
            kLast = kStart + 1;
            let tWidth = borderThick/2 - 0.1;
            textHtmlSetDelete += `<line x1="${arrp[kStart].cx + tWidth}" y1="${arrp[kStart].cy}" x2="${arrp[kLast].cx - tWidth}" y2="${arrp[kLast].cy}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;

            if(removedPoints.includes(k) === false)
                removedPoints.push(k);
            if(removedPoints.includes(k + cols) === false)
                removedPoints.push(k + cols);
        }

        if (removePoints.includes(k - 1) === true)
        {
            kStart = k;
            kLast = k + cols;
            let tWidth = borderThick/2 - 0.1;
            textHtmlSetDelete += `<line x1="${arrp[kStart].cx}" y1="${arrp[kStart].cy + tWidth}" x2="${arrp[kLast].cx}" y2="${arrp[kLast].cy - tWidth}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;

            if(removedPoints.includes(kStart) === false)
                removedPoints.push(kStart);
            if(removedPoints.includes(k - 1) === false)
                removedPoints.push(k - 1);
        }
    }

    /**
     * Removing repeating points
     * @type {HTMLElement}
     */
    for(let m = 0; m < lengthArray; m ++)
    {
        k = removePoints[m];
        let i = Math.floor(k / cols);
        let j = k - i * cols;

        if ((removePoints.includes(k - cols) === true) && (removePoints.includes(k - 1) === true) && (removePoints.includes(k - cols - 1) === true))
        {
            textHtmlSetDelete += `<rect id="point${k}" x="${arrp[k].cx - borderThick}" y="${arrp[k].cy - borderThick}" width="${borderThick*2}" height="${borderThick*2}" fill="#ffffff"/>`;
        }
    }

    removePoints = [];
    for(let m = 0; m < removedPoints.length; m ++)
        removePoints.push(removedPoints[m]);

    /**
     * Recovering opening
     * @type {HTMLElement}
     */
    for (let m = 0; m < recoverPoints.length; m ++)
    {
        k = recoverPoints[m];
        let kk = k + 1;
        textHtmlSetDelete += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

        kk = k + cols;
        textHtmlSetDelete += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

        k = k + cols;
        kk = k + 1;
        textHtmlSetDelete += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

        k = k - cols + 1;
        textHtmlSetDelete += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

        removePoints.splice(removePoints.indexOf(recoverPoints[m]), 1);
        removedPoints.splice(removedPoints.indexOf(recoverPoints[m]), 1);
    }

    if(flagRoof !== 0)
    {
        textHtmlSetDelete += textHtmlRoof;
    }

    recoverPoints = [];

    let eleSVG = document.getElementById("svg");

    eleSVG.innerHTML += textHtmlSetDelete;
    svgInit = eleSVG.innerHTML;

    redrawLineUpdating();

    let m = 0;
    
    for(let j = 1; j <= cols - 1; j ++)
    {        
        for(let i = 0; i < removePoints.length; i ++)
        {
            if (j === removePoints[i] % cols + 1)
            {
                m += Number(lastPartitialWidth[j]);
                break;
            }
        }
    }

    showingDeletedWidthValues(removePoints);
    
    document.getElementById('deletedTotalWidth').value = m;
}

/**
 * Adding Height and Thickness
 */

function addThick() {
    flagAddThick = true;
    $("div.widthSetDelete").addClass('hide');
    $("div.heightThick").removeClass('hide');
}

function Add() {
    if (Number(document.getElementById("addThickness").value) > Number(document.getElementById("addHeight").value))
    {
        alert("Please Input Correct Values !!!");
        return;
    }

    if (Number(document.getElementById("addHeight").value) > Number(document.getElementById('totalHeight').value))
    {
        alert("Please Input Correct Values !!!");
        return;
    }

    addRoof += 1;
    let addHeight = document.getElementById("addThickness").value/10;
    let addWidth = document.getElementById('totalWidth').value/10 + 20;

    let addPositionY = DYInit + document.getElementById('totalHeight').value/10 - document.getElementById("addHeight").value/10;
    let addPositionX = DXInit - 10;

    roofData.push({index: addRoof, thick: Math.floor(Number(document.getElementById("addThickness").value)), height: Math.floor(document.getElementById("addHeight").value)});

    textHtmlRoof += `<rect id="points${addRoof}" x="${addPositionX}" y="${addPositionY}" width="${addWidth}" height="${addHeight}" fill="#dddddd"/>`;
    let eleSVG = document.getElementById("svg");

    if (flagRoof === 0)
        svgInit = eleSVG.innerHTML;

    eleSVG.innerHTML += textHtmlRoof;

    redrawLineUpdating();

    flagRoof += 1;
    flagSvgInit += 1;
}

function AddCancel() {
    roofData = [];
    textHtmlRoof = "";
    document.getElementById("printRoof").innerHTML = '';
    $("div.svgCodeShowing").addClass('hide');

    if (flagRoof !== 0)
        document.getElementById("svg").innerHTML = svgInit;
    flagRoof = 0;
    flagSvgInit = 0;
    redrawLineUpdating();
}

function redrawLineUpdating() {
    let textHtml = '';

    for(let i = 0; i < cols - 1; i ++)
    {
        for(let j = 0; j < rows - 1; j ++)
        {
            k = j * cols + i;

            if((removedPoints.includes(k) === true) && (removedPoints.includes(k - cols) === true))
            {
                continue;
            }

            textHtml += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[k + 1].cx}" y2="${arrp[k + 1].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;
        }
    }

    for(let i = 0; i < cols - 1; i ++)
    {
        for(let j = 0; j < rows - 1; j ++)
        {
            k = j * cols + i;

            if((removedPoints.includes(k) === true) && (removedPoints.includes(k - 1) === true) && (k % cols !== 0))
            {
                continue;
            }

            textHtml += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[k + cols].cx}" y2="${arrp[k + cols].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;
        }
    }

    for(let j = 1; j < rows; j ++)
    {
        k = j * cols - 1;
        textHtml += `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[k + cols].cx}" y2="${arrp[k + cols].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;
    }

    let eleSVG = document.getElementById("svg");

    eleSVG.innerHTML += textHtml;
}

function svgSubmit() {
    $("div.svgCodeShowing").removeClass('hide');
    unRepeatedHeight = [];
    unRepeatedWidth = [];
    document.getElementById("printWidth").innerHTML = '';
    document.getElementById("printHeight").innerHTML = '';
    document.getElementById("printRoof").innerHTML = '';

    flagSubmit += 1;
    let eleSVG = document.getElementById("svg");
    let svgContainer = document.createElementNS("http://www.w3.org/1999/xlink", "svg");
    svgContainer.append(eleSVG);
    let svgData = svgContainer.outerHTML;
    a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData);
    a.download = 'finalSVG.svg';
    a.innerHTML = 'download ' + flagSubmit.toString();
    document.getElementById("submitImg").appendChild(a);

    document.getElementById("scrollSectionTop").innerHTML += '<div class="w3-center"><svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="100%" height="650px" class="w3-card" style="background-color: #ffffff;"></svg></div>';
    let eleSVGLast = document.getElementById("svg");
    let eleSVGLastTAG = document.getElementsByTagName('svg');
    eleSVGLast.style.width = svgWidth + DXInit;
    eleSVGLast.style.height = svgHeight  + DYInit;
    eleSVGLast.innerHTML += eleSVG.innerHTML;

    $("hr.hrBorderRoof").removeClass('hide');

    document.getElementById("svgCode").innerText = eleSVGLast.innerHTML;

    let flagAuto = 0;
    for (let i = 1; i <= rows; i ++)
    {
        let str = (i).toString();
        str = str.concat("thHeight");
        if (document.getElementById(str) !== null)
        {
            let m = lastPartitialHeight[i];
            if (m !== 0)
            {
                flagAuto = 1;
                unRepeatedHeight.push({index: i, height: m});
            }
        }
    }

    if(flagAuto === 0)
    {
        for (let i = 1; i < rows; i ++)
        {
                let m = Math.floor(document.getElementById("totalHeight").value/(rows-1));
                unRepeatedHeight.push({index: i, height: m});
        }
    }
    else
    {
        flagAuto = 0;
    }

    /**
     * calc the value of the width
     */
    for (let i = 1; i <= cols; i ++)
    {
        let str = (i).toString();
        str = str.concat("th");
        if (document.getElementById(str) !== null)
        {
            let m = Math.floor(document.getElementById(str).value);
            if (m !== 0)
            {
                flagAuto = 1;
                unRepeatedWidth.push({index: i, width: m});
            }
        }
    }

    if(flagAuto === 0)
    {
        for (let i = 1; i < cols; i ++)
        {
            let m = Math.floor(document.getElementById("totalWidth").value/(cols-1));
            unRepeatedWidth.push({index: i, width: m});
        }
    }
    else
    {
        flagAuto = 0;
    }

    for(let t = 0; t < unRepeatedHeight.length; t ++)
    {
        document.getElementById("printWidth").innerHTML += unRepeatedHeight[t].index + 'th Height:   ' + unRepeatedHeight[t].height + '<br/>';
    }

    for(let t = 0; t < unRepeatedWidth.length; t ++)
    {
        document.getElementById("printHeight").innerHTML += unRepeatedWidth[t].index + 'th Width:   ' + unRepeatedWidth[t].width + '<br/>';
    }

    for(let t = 0; t < roofData.length; t ++)
    {
        document.getElementById("printRoof").innerHTML += 'Roof:   Height:   ' + roofData[t].height + '   Thick:   ' + roofData[t].thick + '<br/>';
    }
}  