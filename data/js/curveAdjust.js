var cant = 1;
var allDots = [[0,0]];
var allDotsAnno = [{x:0,text:'x1 = 0'},{y:0,text:'y1 = 0'}];
var xyValues = $('#xyValues');

$('#addValues').click(() => {
    cant++;
    $('#cantData').val(cant)
    xyValues.append(`
    <div class="form-group d-flex align-items-center flex-row px-3 py-2">
        <div class="input-group mx-2">
            <div class="input-group-prepend">
                <span class="input-group-text appendsInputsXYMargin">$$x_${cant}$$</span>
            </div>
            <input type="number" id="x${cant}" class="form-control" placeholder="0" onkeyup="xyVals(${cant})">
        </div>
        <div class="input-group mx-2">
            <div class="input-group-prepend">
                <span class="input-group-text appendsInputsXYMargin">$$y_${cant}$$</span>
            </div>
            <input type="number" id="y${cant}" class="form-control" placeholder="0" onkeyup="xyVals(${cant})">
        </div>
        <div class="mx-2">
            <p class="m-0 appendsInputsXYMargin" id="xyValsTxt${cant}">$$(0,0)$$</p>
        </div>
    </div>
    `);
    xyVals(cant);
    MathJax.typeset();
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

    // allDotsAnno[i - 1] = {x:xVal, text:`x${i} = ${xVal}`};
    // allDotsAnno[i] = {y:yVal, text:`y${i} = ${yVal}`};

    createdotsGraphic(allDots);

    MathJax.typeset();

}

$('#cantData').keyup(() => {

    if($('#cantData').val() === ""){
        cant = 1;
    }else if(parseInt($('#cantData').val()) <= 0){
        cant = 1;
        $('#cantData').val("1");
    }else{
        cant = parseInt($('#cantData').val());
    }

    xyValues.html("");

    for (let i = 1; i <= cant; i++) {
        xyValues.append(`
            <div class="form-group d-flex align-items-center flex-row px-3 py-2">
                <div class="input-group mx-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text appendsInputsXYMargin">$$x_${i}$$</span>
                    </div>
                    <input type="number" id="x${i}" class="form-control" placeholder="0" onkeyup="xyVals(${i})">
                </div>
                <div class="input-group mx-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text appendsInputsXYMargin">$$y_${i}$$</span>
                    </div>
                    <input type="number" id="y${i}" class="form-control" placeholder="0" onkeyup="xyVals(${i})">
                </div>
                <div class="mx-2">
                    <p class="m-0 appendsInputsXYMargin" id="xyValsTxt${i}">$$(0,0)$$</p>
                </div>
            </div>
        `);
    }

    allDots = [[0,0]];

    createdotsGraphic(allDots);

    MathJax.typeset();
});

function createdotsGraphic(allDots){
    functionPlot({
        target: "#dotsGraphic",
        width: $("#dotsGraphic").width(),
        grid: true,
        data: [{
            points: allDots,
            fnType: 'points',
            graphType: 'scatter',
            color: "red"
        }],
        // annotations: allDotsAnno
    });
}

createdotsGraphic(allDots);

$('#curvesForm').submit(e => {
    e.preventDefault();
    getFromPython();
});

function getFromPython(){
    eel.getAllCurves(allDots)(function(data){
        console.log(data);
    });
}