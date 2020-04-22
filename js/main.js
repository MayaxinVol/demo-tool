/**
 *
 * @type const about rect
 */
let rows = 0;
let cols = 0;
let dirs = 50;

let unitMm = 3.7795275591;// 1mm = 3.7795275591px;
let DX, DY;
let DXInterval = [];
let DYInterval = [];

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

const borderThick = 5;

let flagBackWidth = false;
let flagBackHeight = false;
let flagBackRemove = false;

function GenerateOpening() {
    cols = Number(document.getElementById("input_rows").value) + 1;
    rows = Number(document.getElementById("input_cols").value) + 1;

    if ((rows > 100) || (cols > 100))
    {
        alert("Please input the fields correctly!");
        return;
    }

    document.getElementById("widthPer").innerHTML = '';
    for (let i = 2; i < cols; i ++)
    {
        document.getElementById("widthPer").innerHTML += '                <div class="w3-bar-item">\n' +
            '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item">\n' +
            '                    <input id="' + i + 'th" type="number" class="w3-input w3-border" min="1" max="99999" disabled="disabled"/>\n' +
            '                    <input id="' + i + 'thCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
            '                    <label for="' + i + 'thCheck">Automatic</label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
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

function apply() {
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
    for (let i = 1; i <= cols; i ++)
    {
        let str = (i).toString();
        str = str.concat("th");

        if (document.getElementById(str) !== null)
        {
            DXInterval[i] = document.getElementById(str).value/10;
            if (DXInterval[i] !== 0)
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
        if (DXInterval[j] === 0)
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

    document.getElementById("heightPer").innerHTML = '';
    for (let i = 2; i < rows; i ++)
    {
        document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item">\n' +
            '                    <label for="' + i + 'thHeight"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item">\n' +
            '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" disabled="disabled"/>\n' +
            '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
            '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
    }
}

/**
 * Apply Height
 */

function applyHeight() {

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
    for (let i = 1; i <= rows; i ++)
    {
        let str = (i).toString();
        str = str.concat("thHeight");

        if (document.getElementById(str) !== null)
        {
            DYInterval[i] = document.getElementById(str).value/10;
            if (DYInterval[i] !== 0)
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
        if (DYInterval[j] === 0)
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
    drawOpening();

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

    let eleSVG = document.getElementById("svg");
    eleSVG.style.width = svgWidth + DXInit;
    eleSVG.style.height = svgHeight  + DYInit;
    eleSVG.innerHTML = textHtml;

    if(flagApplyHeight === true)
        eleSVG.addEventListener("click", onClickSVG);
}

function txtHtmlOfLine(k, kk) {
    let str = "";
    if (k >= 0 && k < arrp.length && kk >= 0 && kk < arrp.length)
        str = `<line x1="${arrp[k].cx}" y1="${arrp[k].cy}" x2="${arrp[kk].cx}" y2="${arrp[kk].cy}" stroke = "${back_color}" stroke-width="${borderThick}" style="pointer-events: none;"/>`;

    return { str };
}

function reset() {
    document.getElementById('totalWidth').value = totalWidth;
    document.getElementById('totalHeight').value = totalHeight;
    document.getElementById('totalCheck').checked = 'checked';
    document.getElementById('totalWidth').disabled = true;

    document.getElementById('1th').value = '';
    document.getElementById('1th').disabled = true;
    document.getElementById('1thCheck').checked = 'checked';

    removePoints = [];
    arrp = [];
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

    document.getElementById('1thHeight').value = '';
    document.getElementById('1thHeight').disabled = true;
    document.getElementById('1thHeightCheck').checked = 'checked';

    document.getElementById("heightPer").innerHTML = '';
    for (let i = 2; i < rows; i ++)
    {
        document.getElementById("heightPer").innerHTML += '                <div class="w3-bar-item">\n' +
            '                    <label for="' + i + 'th"><a class="underLineTxt">' + i + '.</a>: </label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item">\n' +
            '                    <input id="' + i + 'thHeight" type="number" class="w3-input w3-border" min="1" max="99999" disabled="disabled"/>\n' +
            '                    <input id="' + i + 'thHeightCheck" type="checkbox" class="checkBox" checked="checked"/>\n' +
            '                    <label for="' + i + 'thHeightCheck">Automatic</label>\n' +
            '                </div>\n' +
            '                <div class="w3-bar-item" style="padding-left: 0;">mm</div>';
    }

    arrp = arrpLast;
    removePoints = [];
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

/**
 * Catching the mouse event
 */
function onClickSVG(evt) {
    if (flagApplyHeight === false)
        return;
    let t = evt;
    let cx = t.x - $("#svg").offset().left;
    let cy = t.y - $("#svg").offset().top;

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

    console.log('k = ', k);
    /**
     * display the selected domains
     */
    if (removePoints.includes(k) === true)
    {
        removePoints.splice(removePoints.indexOf(k), 1);
        let textHtml = "";
        textHtml = `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="#ffffff"/>`;
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
    let textHtml = "";
    let k, kStart, kLast;

    for(let m = 0; m < lengthArray; m ++)
    {
        k = removePoints[m];
        let i = Math.floor(k / cols);
        let j = k - i * cols;

        textHtml += `<rect id="point${k}" x="${arrp[k].cx + borderThick/2}" y="${arrp[k].cy + borderThick/2}" width="${DXInterval[j+1] - borderThick}" height="${DYInterval[i+1] - borderThick}" fill="#ffffff"/>`;
        // removePoints.splice(removePoints.indexOf(k), 1);
        // removePoints.splice(removePoints.indexOf(removePoints[m]), 1);

        if ((k >= cols) && (removePoints.includes(k - cols) === true))
        {
            kStart = k;
            kLast = k + 1;
            let tWidth = borderThick/2 - 0.1;
            textHtml += `<line x1="${arrp[kStart].cx + tWidth}" y1="${arrp[kStart].cy}" x2="${arrp[kLast].cx - tWidth}" y2="${arrp[kLast].cy}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;
        }
        if (removePoints.includes(k + 1) === true)
        {
            kStart = k + 1;
            kLast = kStart + cols;
            let tWidth = borderThick/2 - 0.1;
            textHtml += `<line x1="${arrp[kStart].cx}" y1="${arrp[kStart].cy + tWidth}" x2="${arrp[kLast].cx}" y2="${arrp[kLast].cy - tWidth}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;
        }

        if ((k + cols <= lengthArray) && (removePoints.includes(k + cols) === true))
        {
            kStart = k + cols;
            kLast = kStart + 1;
            let tWidth = borderThick/2 - 0.1;
            textHtml += `<line x1="${arrp[kStart].cx + tWidth}" y1="${arrp[kStart].cy}" x2="${arrp[kLast].cx - tWidth}" y2="${arrp[kLast].cy}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;

        }
        if (removePoints.includes(k - 1) === true)
        {
            kStart = k;
            kLast = k + cols;
            let tWidth = borderThick/2 - 0.1;
            textHtml += `<line x1="${arrp[kStart].cx}" y1="${arrp[kStart].cy + tWidth}" x2="${arrp[kLast].cx}" y2="${arrp[kLast].cy - tWidth}" stroke = "white" stroke-width="${borderThick + 2}" style="pointer-events: none;"/>`;
        }
    }

    /**
     * Removing repeating points
     * @type {HTMLElement}
     */

    console.log(removePoints, lengthArray, rows + 2, lengthArray - rows);
    for(let m = 0; m < lengthArray; m ++)
    {
        k = removePoints[m];
        let i = Math.floor(k / cols);
        let j = k - i * cols;

        if ((removePoints.includes(k - cols) === true) && (removePoints.includes(k - 1) === true) && (removePoints.includes(k - cols - 1) === true))
        {
            console.log('True', k);
            textHtml += `<rect id="point${k}" x="${arrp[k].cx - borderThick}" y="${arrp[k].cy - borderThick}" width="${borderThick*2}" height="${borderThick*2}" fill="#ffffff"/>`;
        }
    }

    let eleSVG = document.getElementById("svg");
    eleSVG.innerHTML += textHtml;
}