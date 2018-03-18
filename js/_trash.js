/*

$(".forecastBox").each(function (idx) {
    $(this).click(function () {
        var data = localStorage.getItem("data");
        data = JSON.parse(data);
        var unit_sym = " °C";
        var unit_wind = " meter/s";
        if (localStorage.getItem("unit") === "imperial") {
            unit_sym = " °F";
            unit_wind = " miles/h";
        }

        $("#modal-day").html(data.days[idx].day);
        $("#modal-min").html((Math.round(data.days[idx].temp.min * 10) / 10) + unit_sym);
        $("#modal-max").html((Math.round(data.days[idx].temp.max * 10) / 10) + unit_sym);
        $("#modal-hum").html((Math.round(data.days[idx].temp.avghum * 10) / 10) + "%");
        $("#modal-press").html((Math.round(data.days[idx].temp.avgpress * 10) / 10) + " hPa");
        $("#modal-wind").html((Math.round(data.days[idx].temp.avgwindspeed * 100) / 100) + unit_wind);
        $("#modal-desc").html(data.days[idx].maindesc);
        //var maindesc = data.days[idx].maindesc;
        //$("#modal-img").attr("src", "icon_" + maindesc.toLowerCase() + ".png");

        $("#modal-values").empty();
        for (var i = 0; i < data.days[idx].values.length; i++) {
            var time = new Date(data.days[idx].values[i].time);
            time = time.toTimeString();
            time = time.substr(0, 5);
            var p = "<div class='modal-value col-1-5'><div class='modal-value-inner'>" + time + "<br />" + Math.round(data.days[idx].values[i].temp) + unit_sym + "</div></div>";
            $("#modal-values").append(p);
        }

        $("#myModal").fadeIn(400);
    });
});

$("#modal-close").click(() => {
    $("#myModal").fadeOut(400);
});

$("#myModal").click((e) => {
    if ($(this).attr('id') === e.target.id)
        $(this).fadeOut(400);
});


    $(document).keydown((e) => {
        if (e.which === 27 && $("#myModal").css("display") === "block") {
            $("#myModal").fadeOut(400);
        }
    });



*/