var cant = 1;
var allDots = [[0,0]];
// var allDotsAnno = [{x:0,text:'x1 = 0'},{y:0,text:'y1 = 0'}];
var xyValues = $('#xyValues');

// var XY = [[4,102.56],[4.2,113.18],[4.5,130.11],[4.7,142.05],[5.1,167.53],[5.5,195.14],[5.9,224.87],[6.3,256.73],[6.8,299.5],[7.1,326.72]]

function createValues(val){
    xyValues.append(`
        <div class="form-group d-flex align-items-center flex-row px-3 py-2">
            <div class="input-group mx-2">
                <div class="input-group-prepend">
                    <span class="input-group-text appendsInputsXYMargin">$$x_{${val}}$$</span>
                </div>
                <input type="number" step="0.00001" id="x${val}" class="form-control inputsVectors" placeholder="0" onkeyup="xyVals(${val})">
            </div>
            <div class="input-group mx-2">
                <div class="input-group-prepend">
                    <span class="input-group-text appendsInputsXYMargin">$$y_{${val}}$$</span>
                </div>
                <input type="number" step="0.00001" id="y${val}" class="form-control inputsVectors" placeholder="0" onkeyup="xyVals(${val})">
            </div>
            <div class="mx-2">
                <p class="m-0 appendsInputsXYMargin" id="xyValsTxt${val}">$$(0,0)$$</p>
            </div>
        </div>
    `);
}

function createXY(){

    // cant = XY.length;

    // $('#cantData').val(cant);

    for (let i = 1; i <= cant; i++) {
        createValues(i);
        // xyValues.append(`
        //     <div class="form-group d-flex align-items-center flex-row px-3 py-2">
        //         <div class="input-group mx-2">
        //             <div class="input-group-prepend">
        //                 <span class="input-group-text appendsInputsXYMargin">$$x_{${i}}$$</span>
        //             </div>
        //             <input type="number" value="${XY[i - 1][0]}" step="0.00001" id="x${i}" class="form-control inputsVectors" placeholder="0" onkeyup="xyVals(${i})">
        //         </div>
        //         <div class="input-group mx-2">
        //             <div class="input-group-prepend">
        //                 <span class="input-group-text appendsInputsXYMargin">$$y_{${i}}$$</span>
        //             </div>
        //             <input type="number" value="${XY[i - 1][1]}" step="0.00001" id="y${i}" class="form-control inputsVectors" placeholder="0" onkeyup="xyVals(${i})">
        //         </div>
        //         <div class="mx-2">
        //             <p class="m-0 appendsInputsXYMargin" id="xyValsTxt${i}">$$(0,0)$$</p>
        //         </div>
        //     </div>
        // `);
        xyVals(i);
    }
}

$(window).on("load",() => {
    createXY();
});

$('#addValues').click(() => {
    cant++;
    $('#cantData').val(cant);
    createValues(cant);
    xyVals(cant);
    $('#polyCont').remove();
    $("#errorMessage").remove();
});

function xyVals(i){

    var xVal = 0;
    var yVal = 0;

    if($(`#x${i}`).val() === ""){
        xVal = 0;
    }else{
        xVal = parseFloat($(`#x${i}`).val());
    }

    if($(`#y${i}`).val() === ""){
        yVal = 0;
    }else{
        yVal = parseFloat($(`#y${i}`).val());
    }

    $(`#xyValsTxt${i}`).html(`$$(${xVal},${yVal})$$`);

    allDots[i-1] = [xVal,yVal];

    $('#polyCont').remove();
    $('#errorMessage').remove();

    // allDotsAnno.push({x:xVal, text:`x${i} = ${xVal}`});
    // allDotsAnno.push({y:yVal, text:`y${i} = ${yVal}`});

    createdotsGraphic(allDots);

    inputsVectorsValidation();

    MathJax.typeset();

}

$('#cantData').keyup(() => {

    if($('#cantData').val() === ""){
        cant = 1;
    }else if(parseInt($('#cantData').val()) <= 0){
        cant = 1;
        $('#cantData').val("1");
    }else if(parseInt($('#cantData').val()) > 100){
        cant = 100;
        $('#cantData').val("100");
    }else{
        cant = parseInt($('#cantData').val());
    }

    xyValues.html("");

    for (let i = 1; i <= cant; i++) {
        createValues(i);
    }

    allDots = [[0,0]];

    // allDotsAnno = [{x:0,text:'x1 = 0'},{y:0,text:'y1 = 0'}];

    createdotsGraphic(allDots);

    $('#polyCont').remove();
    $('#errorMessage').remove();

    MathJax.typeset();

    inputsVectorsValidation();

});

function createdotsGraphic(allDots){
    functionPlot({
        target: "#dotsGraphic",
        width: $("#dotsGraphic").width(),
        xAxis: {domain: [0, (parseFloat(allDots[allDots.length - 1][0]) + (parseFloat(allDots[allDots.length - 1][0]) * 0.5))]},
        yAxis: { domain: [0, (parseFloat(allDots[allDots.length - 1][1]) + (parseFloat(allDots[allDots.length - 1][1]) * 0.5))] },
        grid: true,
        data: [{
            points: allDots,
            fnType: 'points',
            graphType: 'scatter',
            color: "blue"
        }],
        // annotations: allDotsAnno
    });

}

createdotsGraphic(allDots);

$('#randomButton').click(() => {
    $(`#x1`).val(Math.round((Math.random() * (100 - 0) + 0) * 100000) / 100000);
    $(`#y1`).val(Math.round((Math.random() * (100 - 0) + 0) * 100000) / 100000);
    xyVals(1);
    var xs = $(`#x1`).val();
    var ys = $(`#y1`).val();
    for (let i = 2; i <= cant; i++) {
        $(`#x${i}`).val(Math.round((parseFloat(xs) * i) * 100000) / 100000);
        $(`#y${i}`).val(Math.round((parseFloat(ys) * i) * 100000) / 100000);
        xyVals(i);
    }
    $("#polyCont").remove();
    $("#errorMessage").remove();

    inputsVectorsValidation();
    // allDotsAnno = [{x:0,text:'x1 = 0'},{y:0,text:'y1 = 0'}];
});

function inputsVectorsValidation(){
    if($(`.inputsVectors`).val() != ""){
        $(`#eraseMatrix`).removeClass("d-none");
    }else{
        $(`#eraseMatrix`).addClass("d-none");
    }
}

inputsVectorsValidation();

$('#eraseMatrix').click(() => {
    for (let i = 1; i <= cant; i++) {
        $(`#x${i}`).val("");
        $(`#y${i}`).val("");
        xyVals(i);
    }
    $("#polyCont").remove();
    $("#errorMessage").remove();
    inputsMatrixValidation();
    // allDotsAnno = [{x:0,text:'x1 = 0'},{y:0,text:'y1 = 0'}];
});

$('#curvesForm').submit(e => {
    e.preventDefault();
    $("#Spinner").removeClass("d-none");
    getFromPython();
});

function getFromPython(){
    eel.getAllCurves(allDots)(function(data){

        if(data.length === 1){
            $("#Spinner").addClass("d-none");
            if($('#errorMessage').html() === undefined){
                $('body').append(`
                    <div id="errorMessage" class="w-100 my-3 d-flex justify-content-center align-items-center flex-column">
                        <p class="m-0 display-3 text-danger">Error!</p>
                        <p class="m-0">No es posible generar los Datos, <b>cambia o digita</b> más valores para generar el Ajuste de Curvas</p>
                    </div>
                `);
            }
            $("body, html").animate({scrollTop: $(document).height()}, 500, "swing");
            return false;
        }

        var polyInfoCont = "";
        var polyInfoFx = "";

        $('body').append(`
        <div class="w-100 "id="polyCont">
            <div class="w-100 d-flex flex-column justify-content-center align-items-center">
                <p class="m-0" id="XYTableTitle"></p>
                <p class="m-0" id="XYTable"></p>
            </div>

            <p class="m-0" id="polyTitle"></p>

            <div class="container mb-4">
                <div class="row">
                <div class="col-md-4">
                    <div class="w-100 position-relative">
                        <p class="m-0" id="grade1Title"></p>
                        <i id="grade1Modal" class="position-absolute fa fa-info-circle i-orange" data-toggle="modal" data-target="#infoPolyModal" style="right:0; top:0; cursor:pointer;"></i>
                    </div>
                    <p class="m-0" id="grade1Fx"></p>
                    <div id="grade1Graphic" class="w-100"></div>
                </div>
                <div class="col-md-4">
                    <div class="w-100 position-relative">
                        <p class="m-0" id="grade2Title"></p>
                        <i id="grade2Modal" class="position-absolute fa fa-info-circle i-orange" data-toggle="modal" data-target="#infoPolyModal" style="right:0; top:0; cursor:pointer;"></i>
                    </div>
                    <p class="m-0" id="grade2Fx"></p>
                    <div id="grade2Graphic" class="w-100"></div>
                </div>
                <div class="col-md-4">
                    <div class="w-100 position-relative">
                        <p class="m-0" id="expTitle"></p>
                        <i id="expModal" class="position-absolute fa fa-info-circle i-orange" data-toggle="modal" data-target="#infoPolyModal" style="right:0; top:0; cursor:pointer;"></i>
                    </div>
                    <p class="m-0" id="expFx"></p>
                    <div id="expGraphic" class="w-100"></div>
                </div>
                </div>
            </div>
            <div class="modal fade" id="infoPolyModal">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content" style="border-radius: 25px !important;">
                        <div class="modal-header">
                            <div class="w-100 d-flex justify-content-center align-items-center flex-row">
                                <i class="fa fa-info-circle mx-3" style="font-size: 1.5em; color: var(--orange)"></i>
                                <p class="m-0" id="polyInfoFn"></p>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="w-100 d-flex justify-content-center">
                                <div id="spinnerModal" class="m-3 d-none">
                                    <div class="spinner-border" style="color: var(--orange)" role="status"></div>
                                </div>
                            </div>
                            <div class="w-100" id="polyInfoText"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `);

        $('#grade1Modal').click(() => {
            polyInfoCont = `
                <p class="text-center">Este polinomio se obtuvo a partir de la ecuación de una <b>función lineal</b>, escrita de la forma:</p>
                <p>$$y=mx+b$$</p>
                <p class="text-center">Los valores de <b>m</b> y <b>b</b> se hallaron respectivamente con las siguientes ecuaciónes normales:</p>
                <p>$$m=\\dfrac{n \\sum x_{i}y{i} - \\sum y_{i} \\sum x_{i}}{n \\sum x_{i}^{2} - (\\sum x_{i})^{2}}$$</p>
                <p>$$b=\\dfrac{\\sum x_{i}^{2} \\sum y_{i} - \\sum x_{i} \\sum x_{i} y_{i}}{n \\sum x_{i}^{2} - (\\sum x_{i})^{2}}$$</p>
            `;
            polyInfoFx = $('#grade1Fx').html();
            $('#spinnerModal').removeClass("d-none");
        });

        $('#grade2Modal').click(() => {
            polyInfoCont = `
                <p class="text-center">Este polinomio se obtuvo a partir de la ecuación de una <b>función cuadrática</b>, escrita de la forma:</p>
                <p>$$y=cx^2+bx+a$$</p>
                <p class="text-center">Los valores de <b>a</b>, <b>b</b> y <b>c</b> se hallaron respectivamente con el siguiente sistema de ecuaciónes normales:</p>
                <p>$$\\left \\{
                    \\begin{array}{rl}
                    an + b \\sum x_{i} + c \\sum x_{i}^{2} & = \\sum y_{i} \\\\
                    a \\sum x_{i} + b \\sum x_{i}^{2} + c \\sum x_{i}^{3} & = \\sum y_{i} x_{i} \\\\
                    a \\sum x_{i}^{2} + b \\sum x_{i}^{3} + c \\sum x_{i}^{4} & = \\sum y_{i} x_{i}^{2}
                    \\end{array}
                \\right.$$</p>
            `;
            polyInfoFx = $('#grade2Fx').html();
            $('#spinnerModal').removeClass("d-none");
        });

        $('#expModal').click(() => {
            polyInfoCont = `
                <p class="text-center">Este polinomio se obtuvo a partir de la ecuación de una <b>función exponencial</b>, escrita de la forma:</p>
                <p>$$y=ae^{bx}$$</p>
                <p>Aplicando propiedades de logaritmos la ecuación quedaría de la forma:</p>
                <p>$$ln(y)=ln(a) + bx$$</p>
                <p class="text-center">Los valores de <b>ln(a)</b> y <b>b</b> se hallaron respectivamente con las siguientes ecuaciónes normales:</p>
                <p>$$ln(a)=\\dfrac{\\sum x_{i}^{2} \\sum ln(y_{i}) - \\sum x_{i} \\sum x_{i} ln(y_{i})}{n \\sum x_{i}^{2} - (\\sum x_{i})^{2}}$$</p>
                <p>$$b=\\dfrac{n \\sum x_{i} ln(y{i}) - \\sum ln(y_{i}) \\sum x_{i}}{n \\sum x_{i}^{2} - (\\sum x_{i})^{2}}$$</p>
                <p>Por último, obtenemos <b>a</b> de la siguiente forma:</p>
                <p>$$a=e^{ln(a)}$$</p>
            `;
            polyInfoFx = $('#expFx').html();
            $('#spinnerModal').removeClass("d-none");
        });

        $('#infoPolyModal').on('shown.bs.modal', function (e) {
            $("#polyInfoText").html(polyInfoCont);
            $("#polyInfoFn").html(polyInfoFx);
            MathJax.typeset();
            $('#spinnerModal').addClass("d-none");
        });

        $('#infoPolyModal').on('hidden.bs.modal', function (e) {
            $("#polyInfoText").html("");
            $("#polyInfoFn").html("");
            polyInfoCont = "";
            polyInfoFx = "";
        });

        // Imprimir Tabla
        
        $("#XYTableTitle").html(`$$\\textbf{Tabla de Datos}$$`);

        var XYTable = document.getElementById("XYTable");
        XYTable.innerHTML = `$$ \\begin{array}{ c | c | c | c | c | c | c | c | c | c }`;

        XYTable.innerHTML += `i & x_{i} & y_{i} & x_{i}^{2} & x_{i}y_{i} & x_{i}^{3} & x_{i}^{4} & x_{i}^{2}y_{i} & ln(y_{i}) & x_{i}ln(y_{i}) \\\\ \\hline`;

        for (let i = 0; i < cant; i++) {
            XYTable.innerHTML += `${i + 1} & `;
            for (let j = 0; j < 9; j++) {
                XYTable.innerHTML += `${Math.round(data[0][1][j][i] * 100000) / 100000} & `;
                if(j === 8){
                    XYTable.innerHTML += `\\\\`;
                }
            }
        }

        XYTable.innerHTML += `\\hline \\sum & `;

        for (let i = 0; i < 9; i++) {
            XYTable.innerHTML += `${Math.round(data[0][2][i] * 100000) / 100000} & `;
            if(i === 8){
                XYTable.innerHTML += `\\\\`;
            }
        }

        XYTable.innerHTML += `\\end{array}$$`;

        // Polinomios

        $("#polyTitle").html(`$$\\textbf{Polinomios}$$`);

        // Grado 1

        var y1 = "mx+b";

        y1 = y1.replace("m",String(Math.round(data[1][0] * 100000) / 100000)).replace("b",String(Math.round(data[1][1] * 100000) / 100000));

        if(data[1][1] > 0){
            $("#grade1Fx").html(`$$y=${Math.round(data[1][0] * 100000) / 100000}x+${Math.round(data[1][1] * 100000) / 100000}$$`);
        }else{
            $("#grade1Fx").html(`$$y=${Math.round(data[1][0] * 100000) / 100000}x${Math.round(data[1][1] * 100000) / 100000}$$`);
        }

        $("#grade1Title").html(`$$\\textbf{Grado 1 (Lineal)}$$`);
        polyGraphics("grade1Graphic",y1);

        // Grado 2

        $("#grade2Graphic").removeClass(`h-100 d-flex flex-column justify-content-center align-items-center`);
        $("#grade2Graphic").html(``);

        if(data[2].length > 1){
            var y2 = "cx^2+bx+a";

            y2 = y2.replace("a",String(Math.round(data[2][0] * 100000) / 100000)).replace("b",String(Math.round(data[2][1] * 100000) / 100000)).replace("c",String(Math.round(data[2][2] * 100000) / 100000));

            var by2 = "";
            if(data[2][1] > 0){
                by2 = `+${Math.round(data[2][1] * 100000) / 100000}`;
            }else{
                by2 = `${Math.round(data[2][1] * 100000) / 100000}`;
            }
            var ay2 = "";
            if(data[2][0] > 0){
                ay2 = `+${Math.round(data[2][0] * 100000) / 100000}`;
            }else{
                ay2 = `${Math.round(data[2][0] * 100000) / 100000}`;
            }

            $("#grade2Fx").html(`$$y=${Math.round(data[2][2] * 100000) / 100000}x^2${by2}x${ay2}$$`);

            $("#grade2Title").html(`$$\\textbf{Grado 2 (Cuadrática)}$$`);
            polyGraphics("grade2Graphic",y2);
        }else{
            $("#grade2Fx").html(``);
            $("#grade2Title").html(``);
            $("#grade2Graphic").addClass(`h-100 d-flex flex-column justify-content-center align-items-center`);
            $("#grade2Graphic").append(`<p class="text-danger text-center display-4">Error!</p>`);
            $("#grade2Graphic").append(`<p class="m-0 text-center">Matriz Singular Detectada, <b>cambia o digita</b> más valores para generar este Polinomio</p>`);
            $('#grade2Modal').remove();
        }

        // Exponencial

        var ye = "a*exp(bx)";

        ye = ye.replace("a",String(Math.round(data[3][0] * 100000) / 100000)).replace("b",String(Math.round(data[3][1] * 100000) / 100000));

        $("#expFx").html(`$$y=${Math.round(data[3][0] * 100000) / 100000}e^{${Math.round(data[3][1] * 100000) / 100000}x}$$`);

        $("#expTitle").html(`$$\\textbf{Exponencial}$$`);
        polyGraphics("expGraphic",ye);

        MathJax.typeset();

        $("#Spinner").addClass("d-none");
        $("body, html").animate({scrollTop: $("#polyCont").height()}, 500, "swing");
    
    });
}

function polyGraphics(graphicName, fn){
    functionPlot({
        target: `#${graphicName}`,
        width: $(`#${graphicName}`).width(),
        xAxis: {domain: [0, (parseFloat(allDots[allDots.length - 1][0]) + (parseFloat(allDots[allDots.length - 1][0]) * 0.5))]},
        yAxis: { domain: [0, (parseFloat(allDots[allDots.length - 1][1]) + (parseFloat(allDots[allDots.length - 1][1]) * 0.5))] },
        grid: true,
        data: [{
            fn,
            color: "orange"
        },{
            points: allDots,
            fnType: 'points',
            graphType: 'scatter',
            color: "blue"
        }],
        // annotations: allDotsAnno
    });
}