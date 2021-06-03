var firebaseConfig = {
    apiKey: "AIzaSyCCly9P9bEh9lm1p6qqR5XwCZLrYhUHPpM",
    authDomain: "project-1-44bc6.firebaseapp.com",
    databaseURL: "https://project-1-44bc6-default-rtdb.firebaseio.com",
    projectId: "project-1-44bc6",
    storageBucket: "project-1-44bc6.appspot.com",
    messagingSenderId: "470306756600",
    appId: "1:470306756600:web:c6f6dda0acfbb50583280d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var btnOn1 = document.getElementById('btnOnId_01');
var btnOff1 = document.getElementById('btnOffId_01');

var btnOn2 = document.getElementById('btnOnId_02');
var btnOff2 = document.getElementById('btnOffId_02');

btnOn1.onclick = function() {
    document.getElementById("LivingRoom_LedId_1").src = "./img/lighton.jpg "
    firebase.database().ref("/Living Room/").update({
        "Light": "ON"
    });
}

btnOff1.onclick = function() {
    document.getElementById("LivingRoom_LedId_1").src = "./img/lightoff.jpg "
    firebase.database().ref("/Living Room/").update({
        "Light": "OFF"
    });
}
btnOn2.onclick = function() {
    document.getElementById("LivingRoom_FanId_1").src = "./img/fanon.gif "
    firebase.database().ref("/Living Room/").update({
        "Fan": "ON"
    });
}

btnOff2.onclick = function() {
    document.getElementById("LivingRoom_FanId_1").src = "./img/fanoff.jpg "
    firebase.database().ref("/Living Room/").update({
        "Fan": "OFF"
    });
}


initial_sliderTron_01(0); //Start first time
var sliderTron_01 = document.getElementById("sliderTronId_01");

function initial_sliderTron_01(data) {
    $("#sliderTronId_01").roundSlider({
        sliderType: "min-range",
        width: 22,
        radius: 100,
        readOnly: false,
        value: data,
        circleShape: "half-top",
        lineCap: "round",
        editableTooltip: false,
        max: 100,
        svgMode: true,
        rangeColor: "green",

    });
};

initial_sliderTron_02(0); //Start first time
var sliderTron_02 = document.getElementById("sliderTronId_02");

function initial_sliderTron_02(data) {
    $("#sliderTronId_02").roundSlider({
        sliderType: "min-range",
        width: 22,
        radius: 100,
        readOnly: false,
        value: data,
        circleShape: "half-top",
        lineCap: "round",
        editableTooltip: false,
        max: 100,
        svgMode: true,
        rangeColor: "blue",

    });
};

var nhietdo = 0;
var doam = 0;
firebase.database().ref("/Living Room/Temperature").on("value", function(snapshot) {
    var bienkiemtra = snapshot.val();
    nhietdo = bienkiemtra;
    initial_sliderTron_01(snapshot.val());
});

firebase.database().ref("/Living Room/Humidity").on("value", function(snapshot) {
    var bienkiemtra = snapshot.val();
    initial_sliderTron_02(snapshot.val());
    doam = bienkiemtra;
});


firebase.database().ref("/Living Room/Light").on("value", function(snapshot) {
    var bienkiemtra = snapshot.val();
    if (bienkiemtra === "ON") {
        document.getElementById("LivingRoom_LedId_1").src = "./img/lighton.jpg "
    } else if (bienkiemtra === "OFF") {
        document.getElementById("LivingRoom_LedId_1").src = "./img/lightoff.jpg "
    }
});

firebase.database().ref("/Living Room/Fan").on("value", function(snapshot) {
    var bienkiemtra = snapshot.val();
    if (bienkiemtra === "ON") {
        document.getElementById("LivingRoom_FanId_1").src = "./img/fanon.gif "
    } else if (bienkiemtra === "OFF") {
        document.getElementById("LivingRoom_FanId_1").src = "./img/fanoff.jpg "
    }
});
window.onload = function() {

    var dataPoints1 = [];
    var dataPoints2 = [];

    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title: {
            text: "Temperature and Humidity"
        },
        axisX: {
            title: " Thời gian thực"
        },
        axisY: {
            prefix: "Giá trị "
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: [{
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "## 'C",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Temperatue",
                dataPoints: dataPoints1
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "## ## %",
                //xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: "Humidity",
                dataPoints: dataPoints2
            }
        ]
    });

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

    var updateInterval = 300;
    // initial value
    var yValue1 = 600;
    var yValue2 = 605;

    var d = new Date();

    var gio = d.getHours();;
    var phut = d.getMinutes();;
    var giay = d.getMilliseconds();;

    var time = new Date;
    time.setHours(gio);
    time.setMinutes(phut);
    time.setSeconds(giay);
    time.setMilliseconds(00);

    function updateChart(count) {
        count = count || 1;

        for (var i = 0; i < count; i++) {
            time.setTime(time.getTime() + updateInterval);


            // adding random value and rounding it to two digits. 
            yValue1 = nhietdo;
            yValue2 = doam;

            // pushing the new values
            dataPoints1.push({
                x: time.getTime(),
                y: yValue1
            });
            dataPoints2.push({
                x: time.getTime(),
                y: yValue2
            });
        }

        // updating legend text with  updated with y Value 
        chart.options.data[0].legendText = " Temperature('C):" + yValue1;
        chart.options.data[1].legendText = " Huminit(%):" + yValue2;
        chart.render();
    }
    // generates first set of dataPoints 
    updateChart(100);
    setInterval(function() { updateChart() }, updateInterval);

}