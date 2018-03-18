const INITDELAY = 1500;  // ms
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const URL_MAPSIFRAME = "https://www.google.com/maps/embed/v1/search?key=AIzaSyC4V8RJHhKLbRdBtEAgheuBT1oddBZPTrs&q=";

var UNIT = "metric";    // metric / imperial
var UNIT_SYM;

function setUnitSym() {
    if (UNIT === "metric")
        UNIT_SYM = { temp: "°C", wind: "m/s" };
    else
        UNIT_SYM = { temp: "°F", wind: "mls/h" };;
}

function round(number, decimals) {
    let m = Math.pow(10, decimals);
    return Math.round(number *  m) / m;
}

setUnitSym();