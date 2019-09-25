var Script = function () {


    var doughnutData = [
        {
            value: 30,
            color:"green"
        },
        {
            value : 20,
            color : "yellow"
        },
		
        {
            value : 20,
            color : "red"
        },
        {
            value : 40,
            color : "black"
        },
		{
            value : 10,
            color : "white"
        },
        {
            value : 40,
            color : "blue"
        }
		

    ];
    var lineChartData = {
        labels : ["","","","","","",""],
        datasets : [
            {
                fillColor : " rgba(0, 0, 255, 0.1)",
                strokeColor : "rgba(0, 255, 0, 0.3)",
                pointColor : "#4099ff",
                pointStrokeColor : "#4099ff",
				
                data : [65,59,90,81,56,55,40]
            },
            {
                fillColor : "rgba(0, 255, 0, 0.1)",
                strokeColor : "white",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data : [28,48,40,19,96,27,100]
            }
        ]

    };
   
    new Chart(document.getElementById("doughnut").getContext("2d")).Doughnut(doughnutData);
    new Chart(document.getElementById("line").getContext("2d")).Line(lineChartData);
    new Chart(document.getElementById("radar").getContext("2d")).Radar(radarChartData);
    new Chart(document.getElementById("polarArea").getContext("2d")).PolarArea(chartData);
    new Chart(document.getElementById("bar").getContext("2d")).Bar(barChartData);
    new Chart(document.getElementById("pie").getContext("2d")).Pie(pieData);


}();