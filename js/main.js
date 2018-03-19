
$(document).ready(function () {

    // COMPATIBILITY
    if (typeof (localStorage) === "undefined") {
        alert("Your browser does not support web storage :(");
        return;
    }

    if (!navigator.geolocation) {
        alert("Your browser does not support geolocation :(");
        return;
    }

    // UI EVENTS
    $(".forecastBox-inner").hover(
        (e) => {
            // Mouse-In
            $(e.currentTarget).children(".forecast-details").addClass("forecast-details-open", 350);
        },
        (e) => {
            // Mouse-Out
            $(e.currentTarget).children(".forecast-details").removeClass("forecast-details-open", 350);
        });

    // SET TEMPERATURE UNIT and THE CHOOSING RADIOBUTTONS
    // (by default its metric, as defined in the UNIT variable)
    let unit_saved = localStorage.getItem("UNIT");
    if (unit_saved !== null) {
        UNIT = unit_saved;
        setUnitSym();
        $(`[value='${UNIT}']`).attr('checked', 'checked');
    }

    // POPOVERS
    $("[data-toggle=popover]").popover();

    // CALL FUNCTIONS
    getLocation(
        (lat, lng, acc) => {
            // alert(lat + ',' + lng);
            getWeatherData(lat, lng, acc, (data) => {
                // alert(data.days.length);
                getAddressFromCords(data.location.original.lat, data.location.original.lng,
                    (address) => {
                        //alert(address);
                        data.location.original.address = address;
                        fillPage(data, () => {
                            setTimeout(() => {
                                $(".loader-screen").fadeOut(400);
                                $(".init-hidden").fadeIn(2000);
                            }, INITDELAY);
                        });
                    });
            });
        },
        (errResult) => {
            alert(errResult.message);
        });
});

function fillPage(data, callback) {

    $("#temperature").html(data.days[0].values[0].temp);
    $("#unit").html(UNIT_SYM.temp);
    $("#description").html(data.days[0].values[0].maindesc);
    $("#timestamp").html(data.timestamp.toLocaleString());

    $("#location-add").html(data.location.original.address);
    $("#location-o-lat").html(`${round(data.location.original.lat, 7)}°`);
    $("#location-o-lng").html(`${round(data.location.original.lng, 7)}°`);
    $("#location-w-lat").html(`${round(data.location.weather.lat, 7)}°`);
    $("#location-w-lng").html(`${round(data.location.weather.lng, 7)}°`);
    $("#location-acc").html(`${data.location.original.acc} m`);
    $("#location-map").attr("src", URL_MAPSIFRAME + data.location.original.lat + "," + data.location.original.lng);

    $(".forecast-icon>i").each(
        (idx, elem) => {
            if (idx < data.days.length) {
                $(elem).addClass(`weathericons-${data.days[idx].maindesc.toLowerCase()}`);
            }
        });
    $(".forecast-temp").each(
        (idx, elem) => {
            if (idx < data.days.length) {
                $(elem).html(`${Math.round(data.days[idx].temp.max)} / ${Math.round(data.days[idx].temp.min)}`);
            }
        });
    $(".forecast-desc").each(
        (idx, elem) => {
            if (idx < data.days.length) {
                $(elem).html(data.days[idx].maindesc);
            }
        });
    $(".forecast-details").each(
        (idx, elem) => {
            if (idx < data.days.length) {
                let day = data.days[idx];
                let d = new Date(day.date);
                $(elem).find(".det-day").html(WEEKDAYS[d.getDay()]);
                $(elem).find(".det-date").html(`${MONTHS[d.getMonth()]}. ${d.getDate()}.`)
                $(elem).find(".det-hum").html(`${round(day.hum, 1)}%`);
                $(elem).find(".det-pres").html(`${day.pres ? round(day.pres, 0) : '-'} Pa`);
                $(elem).find(".det-windsp").html(`${round(day.windsp, 2)} ${UNIT_SYM.wind}`);
            }
        });

    if (callback)
        callback();
}

//
// BUTTON EVENTS
//

function ChangeUnitClick(newUnit) {
    var currUnit = localStorage.getItem('unit');
    if (currUnit !== newUnit) {
        localStorage.setItem('unit', newUnit);
        getWeather(localStorage.getItem("lat"), localStorage.getItem("lng"), "reload");
    }
}

function SearchCity() {
    var typedCity = $("#cityInput").val();
    if (typedCity === null || typedCity === "") {
        alert("Please type a valid city name!");
        return;
    }

    getCordsFromAddress(typedCity, getWeather);
}

function LocateMe() {
    localStorage.clear();
    location.reload();
}