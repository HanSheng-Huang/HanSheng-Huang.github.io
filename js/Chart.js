'use strict';


// $(function() {
    var plot;
    function drawArrow(ctx, x, y, radius){
        ctx.beginPath();
        ctx.moveTo(x + radius, y + radius);
        ctx.lineTo(x, y);
        ctx.lineTo(x - radius, y + radius);
        ctx.stroke();
    }

    function drawSemiCircle(ctx, x, y, radius){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI, false);
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.stroke();
    }

    var data1 = [];
    for (var i = 0; i < 3; i += 0.005) {
        data1.push([i, 1.2 + Math.sin(i*10)]);
    }

    var data2 = [
        [0,0],
        [1,1],
        [2,2],
        [3,3]
    ];

    var data2_points = {
        show: true,
        radius: 5,
        fillColor: "dodgerblue",
        symbol: "diamond",
    };

    var data3 = [
        [.7,3,.2,.4],
        [1.5,2.2,.3,.4],
        [2.3,1,.5,.2]
    ];

    var data3_points = {
        show: true,
        radius: 5,
    };

    var data4 = [
        [1,2],
        [2,0.5],
        [100,2]
    ];

    var data4_points = {
        //do not show points
        show: false,
        radius: 5,
        fillColor: "white",
    };

    var data5 = [
        [1.3, 1],
        [1.75, 2.5],
        [2.5, 0.5]
    ];

    var data = [
        // area
        // {color: "cyan", lines: {show: true, fill: true}, data: data1, label: "Area"},
        // bars
        // {color: "orange", bars: {show: true, align: "center", barWidth: 0.25}, data: data5, label: "Bars"},
        //lines
        {color: "blue", lines: {show: true, lineWidth: 1}, points: data4_points, data: data4, label: ""},
        // points
        // {color: "indigo", points: data2_points, data: data2, label: "Points"},
        // lines + points
        // {color: "red",  lines: {show: true, lineWidth:2}, points: data3_points, data: data3, label: "Lines & Points"},
    ];

    var legendContainer = document.getElementById("rppg");
    var legendSettings = {
            position: "ne",
            show: true,
            noColumns: 2,
            container: null
        };




    // $('#myForm input').on('change', function() {
    //     var val = $('input[name="myRadio"]:checked', '#myForm').val();

    //     $(legendContainer).html('');
    //     switch (val) {
    //         case 'se':
    //             legendSettings.position = "se"
    //             legendSettings.container = null;
    //             break;
    //         case 'sw':
    //             legendSettings.position = "sw"
    //             legendSettings.container = null;
    //             break;
    //         case 'ne':
    //             legendSettings.position = "ne"
    //             legendSettings.container = null;
    //             break;
    //         case 'nw':
    //             legendSettings.position = "nw"
    //             legendSettings.container = null;
    //             break;
    //         case 'container':
    //             legendSettings.container = legendContainer;
    //             break;
    //     }
    //     setupGraph();
    // });

    // var ticks = [["abc", 0], ["def", 1], ["ghi", 2], ["jkl", 3]]; 
    var ticks = [[0, "abc"], [1, "def"]]; 

    setupGraph();
    // drawGraph();

    function setupGraph() {
       plot = $.plot($("#rppg"), data , {
            colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
            legend: legendSettings,
            series: {
                lines: {
                    show: true
                }
            },
            xaxis: {
                autoScale: "none",
                min: 0,
                max: 128,
                show:true,
            },
            yaxis: {
                autoScale: "none",
                min: 0,
                max: 500,
                color:"white",
                show:true,
                ticks: ticks
            },
            zoom: {
                interactive: true
            },
            pan: {
                interactive: true
            },
            
        });
    }

    function drawGraph() {
        plot.setData(data);
        plot.setupGrid();
        plot.draw();
        requestAnimationFrame(drawGraph);
    }

    function SetRPPGData(_data){

    data4 = [];

    for (var i = 0; i < _data.length; i++) {
        data4.push([i, _data[i]]);
    }



    data = [
        //lines
        {color: "blue", lines: {show: true, lineWidth: 1}, points: data4_points, data: data4, label: ""},
    ];

    // setupGraph();

    
    plot.setData(data);
    plot.setupGrid();
    plot.draw();
    // requestAnimationFrame(drawGraph);


}


    // Add the Flot version string to the footer

    // $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
// });


// var plot;
// function SetRPPGData(_data)
// {

//     var data4_points = {
//         //do not show points
//         show: false,
//         radius: 5,
//         fillColor: "white",
//     };

//     var data = [
//         //lines
//         {color: "blue", lines: {show: true, lineWidth: 4}, points: data4_points, data: _data, label: "rPPG"},
//     ];

//     setupGraph();

//     plot.setData(data);
//     plot.setupGrid();
//     plot.draw();
//     requestAnimationFrame(drawGraph);


// }

// function SetdrawGraph() {
//     plot.setData(data);
//     plot.setupGrid();
//     plot.draw();
//     requestAnimationFrame(drawGraph);
// }

// function setupGraph() {
//     plot = $.plot($("#rppg"), data , {
//          legend: legendSettings,
//          series: {
//              lines: {
//                  show: false
//              }
//          },
//          xaxis: {
//              autoScale: "none",
//              min: 0,
//              max: 3
//          },
//          yaxis: {
//              autoScale: "none",
//              min: 0,
//              max: 3.5
//          },
//          zoom: {
//              interactive: true
//          },
//          pan: {
//              interactive: true
//          }
//      });
//  }