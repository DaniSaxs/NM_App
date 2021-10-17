var method = 0;

var cant = 0;
var iteraciones = 0;
cant = parseInt($('#cantMA').val());

var A = [];
var x = [];
var b = [];

function methodChange(){
    var methodSelect = $('#method');
    method = parseInt(methodSelect.val());
    if(method === 1){
        $("#GaussCont").remove();
        $('#errorMsg').remove();
    }else if(method === 2){
        $("#JacobiCont").remove();
        $('#errorMsg').remove();
    }else{
        $("#JacobiCont").remove();
        $("#GaussCont").remove();
    }
}

methodChange();

$('#method').change(e => {
    e.preventDefault();
    methodChange();
});

function createAMatrix(){
    var AMatrix = document.querySelector('#AMatrix');
    AMatrix.innerHTML = "";

    var xVariables = document.querySelector('#variables');
    xVariables.innerHTML = "";

    var bVector = document.querySelector('#bVector');
    bVector.innerHTML = "";

    // var A = [[4,2,-2],[1,-3,-1],[3,-1,4]];
    // var b = [[0],[7],[5]];

    // var A = [[2,-1,1],[2,2,2],[-1,-1,2]];
    // var b = [[-1],[4],[-5]];

    if($('#cantMA').val() === ""){
        cant = 1;
        $('#cantMATxt').html("1");
    }else if(parseInt($('#cantMA').val()) <= 0){
        cant = 1;
        $('#cantMA').val("1");
        $('#cantMATxt').html("1");
    }else if(parseInt($('#cantMA').val()) > 50){
        cant = 50;
        $('#cantMA').val("50");
        $('#cantMATxt').html("50");
    }else{
        $('#cantMATxt').html($('#cantMA').val())
        cant = parseInt($('#cantMA').val());
    }

    for (let i = 1; i <= cant; i++) {
        AMatrix.innerHTML += `
            <div class="form-group d-flex flex-row px-3 py-2" id="row${i}"></div>
        `;

        for (let j = 1; j <= cant; j++) {
            document.querySelector(`#row${i}`).innerHTML += `
                <input type="number" id="a${i}${j}" style="min-width:10%" class="form-control mx-2 inputsMatrix" placeholder="0">
            `;
        }

        if(i === 1){
            xVariables.innerHTML += `
                <p id="var${i}" class="m-0 mt-2">$$x_{${i}}$$</p>
            `;
        }else if(i === cant){
            xVariables.innerHTML += `
                <p id="var${i}" class="m-0 mb-3">$$x_{${i}}$$</p>
            `;
        }else{
            xVariables.innerHTML += `
                <p id="var${i}" class="m-0">$$x_{${i}}$$</p>
            `;
        }

        bVector.innerHTML += `
            <div class="form-group d-flex flex-row px-3 py-2">
                <input type="number" id="b${i}" class="form-control py-2 px-3 inputsMatrix" placeholder="0">
            </div>
        `;

    }

}

$('#matrixForm').submit(e => {
    e.preventDefault();
    $("#Spinner").removeClass("d-none");
    getFromPython();
});

createAMatrix();

$('#cantMA').keyup(() => {
    createAMatrix();
    MathJax.typeset();
    $(`#eraseMatrix`).addClass("d-none");
    $("#matrixCont").remove();
    $("#GaussCont").remove();
    $("#JacobiCont").remove();
    $('#errorMsg').remove();
});

$('#randomButton').click(() => {
    for (let i = 1; i <= cant; i++) {
        for (let j = 1; j <= cant; j++) {
            $(`#a${i}${j}`).val(Math.round((Math.random() * (100 - 0) + 0)));
        }
        $(`#b${i}`).val(Math.round((Math.random() * (100 - 0) + 0)));
    }
    $("#matrixCont").remove();
    $("#GaussCont").remove();
    $("#JacobiCont").remove();
    $('#errorMsg').remove();
    inputsMatrixValidation();
});

$('#eraseMatrix').click(() => {
    for (let i = 1; i <= cant; i++) {
        for (let j = 1; j <= cant; j++) {
            $(`#a${i}${j}`).val("");
        }
        $(`#b${i}`).val("");
    }
    $("#matrixCont").remove();
    $("#GaussCont").remove();
    $("#JacobiCont").remove();
    $('#errorMsg').remove();
    inputsMatrixValidation();
});

$('#iter').keyup(() => {
    if($('#iter').val() === ""){
        iteraciones = 1;
    }else if(parseInt($('#iter').val()) <= 0){
        iteraciones = 1;
        $('#iter').val(1);
    }else{
        iteraciones = parseInt($('#iter').val());
    }
});

$(`.inputsMatrix`).keyup(() => {
    $("#matrixCont").remove();
    $("#GaussCont").remove();
    $("#JacobiCont").remove();
    $('#errorMsg').remove();
    inputsMatrixValidation();
});

function inputsMatrixValidation(){
    for (let i = 1; i <= cant; i++) {
        for (let j = 1; j <= cant; j++) {
            if($(`#a${i}${j}`).val() != "" || $(`#b${i}`).val() != ""){
                $(`#eraseMatrix`).removeClass("d-none");
            }else{
                $(`#eraseMatrix`).addClass("d-none");
            }
        }
    }
}

inputsMatrixValidation();

function getFromPython(){

    for (let i = 1; i <= cant; i++) {
        for (let j = 1; j <= cant; j++) {
            if($(`#a${i}${j}`).val() === "" || $(`#b${i}`).val() === ""){
                $("#Spinner").addClass("d-none");
                if($('#errorMsg').html() === undefined){
                    $("body").append(`
                        <div id="errorMsg" class="w-100 mt-3 d-flex justify-content-center">
                            <h3 class="text-danger display-4">Matriz Incompleta!</h3>
                        </div>
                    `);
                }
                $("body, html").animate({scrollTop: $(document).height()}, 500, "swing");
                return false;
            }else{
                $('#errorMsg').remove();
            }
        }
    }

    A = [];
    var a = [];

    x = [];
    b = [];

    for (let i = 1; i <= cant; i++) {
        a = [];
        for (let j = 1; j <= cant; j++) {
            a.push(parseFloat(document.querySelector(`#a${i}${j}`).value));
        }
        A.push(a);

        x.push([`x_{${i}}`]);

        b.push([parseFloat(document.querySelector(`#b${i}`).value)]);

    }

    method = parseInt($('#method').val());

    iteraciones = parseInt($('#iter').val());

    if(method === 0 || iteraciones <= 0){
        $("#Spinner").addClass("d-none");
        if($('#errorMsg').html() === undefined){
            $("body").append(`
                <div id="errorMsg" class="w-100 mt-3 d-flex justify-content-center">
                    <h3 class="text-danger display-4">Cantidad o método inválido!</h3>
                </div>
            `);
        }
        $("body, html").animate({scrollTop: $(document).height()}, 500, "swing");
        return false;
    }else{

        $('#errorMsg').remove();

        var allData = [method, iteraciones, A, b]

        eel.getAllEqs(allData)(function(data){

            if($("#matrixCont").html() === undefined){
                $("body").append(`
                    <div class="w-100" id="matrixCont">
                        <div class="container mt-3">
                            <div class="w-100 d-flex justify-content-center">
                                <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                                    <p class="m-0" id="AMatrixM"></p>
                                    <p class="m-0" id="XVectorM"></p>
                                    <p class="m-0" id="bVectorM"></p>
                                </div>
                            </div>
                            <div class="w-100 d-flex justify-content-center">
                                <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                                    <p class="m-0 mx-3" id="DMatrixM"></p>
                                    <p class="m-0 mx-3" id="LMatrixM"></p>
                                    <p class="m-0 mx-3" id="UMatrixM"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            }

            // Matriz A

            var AMatrixM = document.getElementById("AMatrixM");
            AMatrixM.innerHTML = `$$Ax = b \\Rightarrow \\begin{pmatrix}`;

            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[i].length; j++) {
                    AMatrixM.innerHTML += `${A[i][j]}`;
                    if(j === A[i].length - 1){
                        AMatrixM.innerHTML += ` \\\\ `;
                    }else{
                        AMatrixM.innerHTML += ` & `;
                    }
                }
            }

            AMatrixM.innerHTML += `\\end{pmatrix}$$`;

            // Vector x

            var XVectorM = document.getElementById("XVectorM");

            XVectorM.innerHTML = `$$\\begin{pmatrix}`;

            for (let i = 0; i < x.length; i++) {
                XVectorM.innerHTML += `${x[i]}`;
                if(i === x.length - 1){
                    XVectorM.innerHTML += ` `;
                }else{
                    XVectorM.innerHTML += ` \\\\ `;
                }
            }

            XVectorM.innerHTML += `\\end{pmatrix}$$`;

            // Vector b

            var bVectorM = document.getElementById("bVectorM");

            bVectorM.innerHTML = `$$=\\begin{pmatrix}`;

            for (let i = 0; i < b.length; i++) {
                bVectorM.innerHTML += `${b[i]}`;
                if(i === b.length - 1){
                    bVectorM.innerHTML += ` `;
                }else{
                    bVectorM.innerHTML += ` \\\\ `;
                }
            }

            bVectorM.innerHTML += `\\end{pmatrix}$$`;

            // Matriz D

            var DMatrixM = document.getElementById("DMatrixM");
            DMatrixM.innerHTML = `$$D = \\begin{pmatrix}`;

            for (let i = 0; i < data[1][0].length; i++) {
                for (let j = 0; j < data[1][0].length; j++) {
                    DMatrixM.innerHTML += `${data[1][0][i][j]}`;
                    if(j === data[1][0][i].length - 1){
                        DMatrixM.innerHTML += ` \\\\ `;
                    }else{
                        DMatrixM.innerHTML += ` & `;
                    }
                }
            }

            DMatrixM.innerHTML += `\\end{pmatrix}$$`;

            // Matriz L

            var LMatrixM = document.getElementById("LMatrixM");
            LMatrixM.innerHTML = `$$L = \\begin{pmatrix}`;

            for (let i = 0; i < data[1][1].length; i++) {
                for (let j = 0; j < data[1][1].length; j++) {
                    LMatrixM.innerHTML += `${data[1][1][i][j]}`;
                    if(j === data[1][1][i].length - 1){
                        LMatrixM.innerHTML += ` \\\\ `;
                    }else{
                        LMatrixM.innerHTML += ` & `;
                    }
                }
            }

            LMatrixM.innerHTML += `\\end{pmatrix}$$`;

            // Matriz U

            var UMatrixM = document.getElementById("UMatrixM");
            UMatrixM.innerHTML = `$$U = \\begin{pmatrix}`;

            for (let i = 0; i < data[1][2].length; i++) {
                for (let j = 0; j < data[1][2].length; j++) {
                    UMatrixM.innerHTML += `${data[1][2][i][j]}`;
                    if(j === data[1][2][i].length - 1){
                        UMatrixM.innerHTML += ` \\\\ `;
                    }else{
                        UMatrixM.innerHTML += ` & `;
                    }
                }
            }

            UMatrixM.innerHTML += `\\end{pmatrix}$$`;

            MathJax.typeset();

            var realV = 0;
            var realVM = [];

            for (let i = 0; i < data[0].length; i++) {

                if(String(data[0][i][0]).indexOf("e") > 0){
                    var split = String(data[0][i][0]).split('e')
                    var beforeE = parseFloat(Math.round(split[0] * 100000) / 100000);
                    realV = `${beforeE}e^{${split[1]}}`;
                }else{
                    realV = Math.round(data[0][i][0] * 10000) / 10000;
                }

                realVM.push(realV);
                
            }

            var xAndconAnaHTML = `
                <div class="row w-100 mt-3">
                    <div class="col-md-8 d-flex flex-column align-items-center">
                        <p class="m-0" id="X_iMatrixMTitle"></p>
                        <div class="w-100 px-5 d-flex justify-content-center">
                            <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                                <p class="m-0" id="X_iMatrixM"></p>
                            </div>
                        </div>
                        <p class="m-0" id="realValuesTitle"></p>
                        <p class="m-0" id="realValues"></p>
                        <p class="m-0 mb-3" id="realError"></p>
                    </div>
                    <div class="col-md-4">
                        <p class="m-0" id="ConvTitle"></p>
                        <p class="m-0" id="EDDTitle"></p>
                        <p class="m-0" id="EDD"></p>
                        <p class="m-0" id="EDDResult"></p>
                        <p class="m-0 mt-5" id="NITitle"></p>
                        <p class="m-0" id="NI"></p>
                        <p class="m-0" id="NIResult"></p>
                        <p class="m-0 mt-5" id="RETitle"></p>
                        <p class="m-0" id="RE"></p>
                        <p class="m-0" id="REResult"></p>
                    </div>
                </div>
            `;

            if(method === 1){
                Jacobi(data[2],realVM,xAndconAnaHTML);
            }else if(method === 2){
                Gauss_Seidel(data[2],realVM,xAndconAnaHTML);
            }

            $("#Spinner").addClass("d-none");
            $("body, html").animate({scrollTop: $("#AMatrix").height()}, 500, "swing");

        });
        
    }

}

function Gauss_Seidel(data,realV,xAndconAnaHTML){

    if($("#GaussCont").html() === undefined){
        $("body").append(`
            <div class="w-100" id="GaussCont">
            
                <div class="container mt-3">
                    <div class="w-100 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="D_LMatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 mt-2 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="D_L_1MatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 mt-2 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="T_GSMatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 mt-2 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="C_GSVectorM"></p>
                        </div>
                    </div>
                </div>

                ${xAndconAnaHTML}

            </div>
        `);
    }

    // D-L Matriz

    var D_LMatrixM = document.getElementById("D_LMatrixM");
    D_LMatrixM.innerHTML = `$$D-L = \\begin{pmatrix}`;

    for (let i = 0; i < data[0].length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            D_LMatrixM.innerHTML += `${Math.round(data[0][i][j] * 100000) / 100000}`;
            if(j === data[0][i].length - 1){
                D_LMatrixM.innerHTML += ` \\\\ `;
            }else{
                D_LMatrixM.innerHTML += ` & `;
            }
        }
    }

    D_LMatrixM.innerHTML += `\\end{pmatrix}$$`;

    // (D-L)^-1 Matriz

    var D_L_1MatrixM = document.getElementById("D_L_1MatrixM");
    D_L_1MatrixM.innerHTML = `$$(D-L)^{-1} = \\begin{pmatrix}`;

    for (let i = 0; i < data[1].length; i++) {
        for (let j = 0; j < data[1].length; j++) {
            D_L_1MatrixM.innerHTML += `${Math.round(data[1][i][j] * 100000) / 100000}`;
            if(j === data[1][i].length - 1){
                D_L_1MatrixM.innerHTML += ` \\\\ `;
            }else{
                D_L_1MatrixM.innerHTML += ` & `;
            }
        }
    }

    D_L_1MatrixM.innerHTML += `\\end{pmatrix}$$`;

    // T_GS Matriz

    var T_GSMatrixM = document.getElementById("T_GSMatrixM");
    T_GSMatrixM.innerHTML = `$$T_{GS} = \\begin{pmatrix}`;

    for (let i = 0; i < data[2].length; i++) {
        for (let j = 0; j < data[2].length; j++) {
            T_GSMatrixM.innerHTML += `${Math.round(data[2][i][j] * 100000) / 100000}`;
            if(j === data[2][i].length - 1){
                T_GSMatrixM.innerHTML += ` \\\\ `;
            }else{
                T_GSMatrixM.innerHTML += ` & `;
            }
        }
    }

    T_GSMatrixM.innerHTML += `\\end{pmatrix}$$`;

    // C_GS Vector

    var C_GSVectorM = document.getElementById("C_GSVectorM");

    C_GSVectorM.innerHTML = `$$C_{GS}=\\begin{pmatrix}`;

    for (let i = 0; i < data[3].length; i++) {
        C_GSVectorM.innerHTML += `${Math.round(data[3][i] * 100000) / 100000}`;
        if(i === data[3].length - 1){
            C_GSVectorM.innerHTML += ` `;
        }else{
            C_GSVectorM.innerHTML += ` \\\\ `;
        }
    }

    C_GSVectorM.innerHTML += `\\end{pmatrix}$$`;

    // Valores de X y Análisis de Convergencia

    xAndconvergenceAnalysis(realV,data);

    MathJax.typeset();
}

function Jacobi(data,realV,xAndconAnaHTML){

    if($("#JacobiCont").html() === undefined){
        $("body").append(`
            <div class="w-100" id="JacobiCont">
                    
                <div class="container w-100 mt-3">
                    <div class="w-100 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="D_1MatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="LPUMatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="T_JMatrixM"></p>
                        </div>
                    </div>
                    <div class="w-100 d-flex justify-content-center">
                        <div class="d-flex flex-row" style="overflow:auto; overflow-y:hidden;">
                            <p class="m-0" id="C_JVectorM"></p>
                        </div>
                    </div>
                </div>

                ${xAndconAnaHTML}

            </div>
        `);
    }

    // D^-1 Matriz

    var D_1MatrixM = document.getElementById("D_1MatrixM");
    D_1MatrixM.innerHTML = `$$D^{-1} = \\begin{pmatrix}`;

    for (let i = 0; i < data[0].length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            D_1MatrixM.innerHTML += `${Math.round(data[0][i][j] * 100000) / 100000}`;
            if(j === data[0][i].length - 1){
                D_1MatrixM.innerHTML += ` \\\\ `;
            }else{
                D_1MatrixM.innerHTML += ` & `;
            }
        }
    }

    D_1MatrixM.innerHTML += `\\end{pmatrix}$$`;

    // L+U Matriz

    var LPUMatrixM = document.getElementById("LPUMatrixM");
    LPUMatrixM.innerHTML = `$$L+U = \\begin{pmatrix}`;

    for (let i = 0; i < data[1].length; i++) {
        for (let j = 0; j < data[1].length; j++) {
            LPUMatrixM.innerHTML += `${Math.round(data[1][i][j] * 100000) / 100000}`;
            if(j === data[1][i].length - 1){
                LPUMatrixM.innerHTML += ` \\\\ `;
            }else{
                LPUMatrixM.innerHTML += ` & `;
            }
        }
    }

    LPUMatrixM.innerHTML += `\\end{pmatrix}$$`;

    // T_J Matriz

    var T_JMatrixM = document.getElementById("T_JMatrixM");
    T_JMatrixM.innerHTML = `$$T_{J} = \\begin{pmatrix}`;

    for (let i = 0; i < data[2].length; i++) {
        for (let j = 0; j < data[2].length; j++) {
            T_JMatrixM.innerHTML += `${Math.round(data[2][i][j] * 100000) / 100000}`;
            if(j === data[2][i].length - 1){
                T_JMatrixM.innerHTML += ` \\\\ `;
            }else{
                T_JMatrixM.innerHTML += ` & `;
            }
        }
    }

    T_JMatrixM.innerHTML += `\\end{pmatrix}$$`;

    // C_J Vector

    var C_JVectorM = document.getElementById("C_JVectorM");

    C_JVectorM.innerHTML = `$$C_{J}=\\begin{pmatrix}`;

    for (let i = 0; i < data[3].length; i++) {
        C_JVectorM.innerHTML += `${Math.round(data[3][i] * 100000) / 100000}`;
        if(i === data[3].length - 1){
            C_JVectorM.innerHTML += ` `;
        }else{
            C_JVectorM.innerHTML += ` \\\\ `;
        }
    }

    C_JVectorM.innerHTML += `\\end{pmatrix}$$`;

    // Valores de X y Análisis de Convergencia
    
    xAndconvergenceAnalysis(realV,data);

    MathJax.typeset();
}

function xAndconvergenceAnalysis(realV,data){

    // X_i Matriz

    $('#X_iMatrixMTitle').html(`$$ \\textbf{Tabla de Iteraciones} $$`);
    
    var X_iMatrixM = document.getElementById("X_iMatrixM");
    X_iMatrixM.innerHTML = `$$ \\begin{array}{ c `;

    for (let i = 0; i < cant; i++) {
        X_iMatrixM.innerHTML += `| c `;
    }

    X_iMatrixM.innerHTML += `| c }`;

    X_iMatrixM.innerHTML += `n &`;

    for (let i = 0; i < cant; i++) {
        X_iMatrixM.innerHTML += `${x[i]} &`;
    }

    X_iMatrixM.innerHTML += `E_n \\\\ \\hline`;

    for (let i = 0; i <= iteraciones; i++) {
        X_iMatrixM.innerHTML += `${i} & `;
        for (let j = 0; j < data[2].length; j++) {
            X_iMatrixM.innerHTML += `${data[4][i][j]}`;
            if(j === data[2].length - 1){
                if(i > 0){
                    X_iMatrixM.innerHTML += ` & `;
                    X_iMatrixM.innerHTML += `${data[5][i - 1]}`;
                    X_iMatrixM.innerHTML += ` \\\\ `;
                }else{
                    X_iMatrixM.innerHTML += ` \\\\ `;
                }
            }else{
                X_iMatrixM.innerHTML += ` & `;
            }
        }
    }

    X_iMatrixM.innerHTML += `\\end{array}$$`;

    // Valores Reales

    var realValuesTitle = document.getElementById("realValuesTitle");
    realValuesTitle.innerHTML = `$$\\textbf{Valores Reales}$$`;

    var realValues = document.getElementById("realValues");
    realValues.innerHTML = `$$\\begin{array}{ c }`;

    for (let i = 0; i < cant; i++) {
        realValues.innerHTML += `${x[i]} = ${realV[i]} \\\\`;
    }

    realValues.innerHTML += `\\end{array}$$`;

    // Error Real

    var realError = document.getElementById("realError");
    realError.innerHTML = `$$ \\textbf{Error Real: } ${data[6]}$$`;

    // EDD

    $('#ConvTitle').html(`$$ \\textbf{Análisis de Convergencia}$$`);
    $('#EDDTitle').html(`$$\\textbf{EDD}$$`);

    var EDD = document.getElementById("EDD");
    EDD.innerHTML = `$$\\begin{array}{c c c}`;

    var signEDD = "";
    var resultEDDN = 0;
    var resultEDD = "";
    for (let i = 0; i < cant; i++) {
        if(data[7][0][i] < data[7][1][i]){
            signEDD = "<";
        }else if(data[7][0][i] > data[7][1][i]){
            signEDD = ">";
        }else{
            signEDD = "=";
        }
        EDD.innerHTML += `${data[7][0][i]} & ${signEDD} & ${data[7][1][i]} \\\\`;
        if(data[7][0][i] > data[7][1][i]){
            resultEDDN ++;
        }else{
            resultEDDN --;
        }
    }

    if(resultEDDN === cant){
        resultEDD = "Es EDD, Converge"
    }else{
        resultEDD = "No es EDD, Convergencia Indeterminada"
    }

    EDD.innerHTML += `\\end{array}$$`;
    var EDDResult = document.getElementById("EDDResult");
    EDDResult.innerHTML = `$$\\textit{${resultEDD}}$$`;

    // Norma Infinito

    $('#NITitle').html(`$$\\textbf{Norma Infinito}$$`);

    var NI = document.getElementById("NI");
    NI.innerHTML = `$$\\begin{array}{ c }`;

    for (let i = 0; i < cant; i++) {
        NI.innerHTML += `${Math.round(data[8][0][i] * 100000) / 100000} \\\\`;
    }

    NI.innerHTML += `\\end{array}$$`;

    var signNI = "";

    if(data[8][1] < 1){
        signNI = "<";
    }else if(data[8][1] > 1){
        signNI = ">";
    }else{
        signNI = "=";
    }

    var NIRes = "";

    if(data[8][1] < 1){
        NIRes = "Converge";
    }else{
        NIRes = "Convergencia Indeterminada";
    }

    $('#NIResult').html(`$$\\textit{$${Math.round(data[8][1] * 100000) / 100000}$ ${signNI} 1, }\\textit{${NIRes}}$$`);

    // Radio Espectral

    $('#RETitle').html(`$$\\textbf{Radio Espectral}$$`);

    var RE = document.getElementById("RE");
    RE.innerHTML = `$$\\begin{array}{ c }`;

    var eigenV = [];
    var eigenV2 = [];

    for (let i = 0; i < data[9].length; i++) {
        var regex = /[+-]?\d+(\.\d+)?/g;
        var floats = data[9][i].match(regex).map(function(v) { return parseFloat(v); });
        if(data[9][i].indexOf("e") > 0){
            var split = String(data[9][i]).split("e");
            var afterE = split[1].match(regex).map(function(v) { return parseFloat(v); });
            var newNumber = `${Math.round(Math.abs(floats[0]) * 100000) / 100000}e${afterE[0]}`;
            var newNumber2 = `${Math.round(Math.abs(floats[0]) * 100000) / 100000}e^{${afterE[0]}}`;
            RE.innerHTML += `${newNumber2}\\\\`;
            eigenV.push(newNumber);
            eigenV2.push(newNumber2);
        }else{
            RE.innerHTML += `${Math.round(Math.abs(floats[0]) * 100000) / 100000} \\\\`;
            eigenV.push(Math.round(Math.abs(floats[0]) * 100000) / 100000);
            eigenV2.push(Math.round(Math.abs(floats[0]) * 100000) / 100000);
        }
    }

    RE.innerHTML += `\\end{array}$$`;

    var eigenMax = -999999999;
    var indexA = [];
    var index = 0;

    for (let i = 0; i < eigenV.length; i++) {
        if(parseFloat(eigenV[i]) > eigenMax){
            eigenMax = parseFloat(eigenV[i]);
        }
        indexA.push(parseFloat(eigenV[i]));
    }

    index = indexA.indexOf(eigenMax);

    var signRE = "";
    var RERes = "";

    if(eigenMax < 1){
        signRE = "<";
    }else if(eigenMax > 1){
        signRE = ">";
    }else{
        signRE = "=";
    }

    if(eigenMax < 1){
        RERes = "Converge";
    }else{
        RERes = "Convergencia Indeterminada";
    }

    $('#REResult').html(`$$\\textit{$${eigenV2[index]}$ ${signRE} 1, }\\textit{${RERes}}$$`);

}