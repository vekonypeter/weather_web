
const URL_GEOLOC = "https://www.googleapis.com/geolocation/v1/geolocate";
const URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_KEY = "AIzaSyDUdyq7OydRwdXsd-MkVt7zryvy3eakgQU";
const URL_OWMAPI = "http://api.openweathermap.org/data/2.5/forecast"
const OWMAPI_APPID = "b627184c8fdb3ba6a3d9ffcdf66108b9"

function getLocation(success, error) {

    /* LOCATION WITH HTML5 GEOLOCATION API */

    navigator.geolocation.getCurrentPosition(
        (result) => {
            let lat = result.coords.latitude;
            let lng = result.coords.longitude;
            let acc = result.coords.accuracy;
            success(lat, lng, acc);
        },
        (err) => {
            /*
            let errResult = { code: err.code }
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errResult.message = "User denied the request for Geolocation";
                    break;
                case err.POSITION_UNAVAILABLE:
                    errResult.message = "Location information is unavailable";
                    break;
                case err.TIMEOUT:
                    errResult.message = "The request to get user location timed out";
                    break;
                case err.UNKNOWN_ERROR:
                    errResult.message = "An unknown error occurred";
                    break;
            }
            */
           
            /* LOCATION WITH GOOGLE MAPS GEOLOCATION API */

            let url = URL_GEOLOC + "?key=" + GOOGLE_KEY;
            $.post(url, function (data) {
                let lat = data.location.lat;
                let lng = data.location.lng;
                let acc = data.accuracy;
                success(lat, lng, acc);
            });
        });
}

function getAddressFromCords(lat, lng, callback) {
    let url = URL_GEOCODE + "?latlng=" + lat + "," + lng + "&key=" + GOOGLE_KEY;
    $.getJSON(url, (result) => {

        if (result.status === "ZERO_RESULTS") {
            callback(result.status);
            return;
        }

        let address = result.results[0].formatted_address;

        callback(address);
    });
}

function getCordsFromAddress(address, success, error) {
    let url = URL_GEOCODE + "?address=" + address + "&key=" + GOOGLE_KEY;
    $.getJSON(URL, (result) => {

        if (result.status === "ZERO_RESULTS") {
            error(data.status);
            return;
        }

        let address = result.results[0].formatted_address;
        let lat = result.results[0].geometry.location.lat;
        let lng = result.results[0].geometry.location.lng;

        success(lat, lng, address);
    });
}

function getWeatherData(lat, lng, acc, success) {
    let url = URL_OWMAPI + "?units=" + UNIT + "&lon=" + lng + "&lat=" + lat + "&APPID=" + OWMAPI_APPID;
    $.getJSON(url, (result) => {
        let data = {
            timestamp: new Date(),
            location: {
                original: {
                    lat: lat,
                    lng: lng,
                    acc: acc
                },
                weather: {
                    city: result.city.name,
                    lat: result.city.coord.lat,
                    lng: result.city.coord.lon
                }
            },
            days: []
        };

        /* Data coming from the API is stored in a 3 hours format  */
        /* The above code converts it to a daily format */

        let list = result.list;
        let current_date = "";
        for (let i = 0; i < list.length; i++) {

            let entry = list[i];
            let entry_date = new Date(entry.dt_txt).toDateString();

            // start a new day if needed
            if (entry_date !== current_date) {
                // store general data from the day
                data.days.push(
                    {
                        date: entry_date,
                        temp: {
                            min: entry.main.temp,
                            max: entry.main.temp
                        },
                        hum: 0,
                        pres: 0,
                        windsp: 0,
                        values: []
                    });
                current_date = entry_date;
            }

            // store the entry data
            let lastday = data.days[data.days.length - 1];
            lastday.values.push(
                {
                    time: entry.dt_txt,
                    temp: entry.main.temp,
                    hum: entry.main.humidity,
                    pres: entry.main.pressure,
                    maindesc: entry.weather[0].main,
                    detdesc: entry.weather[0].description,
                    windsp: entry.wind.speed,
                    winddeg: entry.wind.deg,
                    rain: entry.rain,
                    snow: entry.snow
                });

            // daily min and max check
            if (lastday.temp.max < entry.main.temp)
                lastday.temp.max = entry.main.temp;
            if (lastday.temp.min > entry.main.temp)
                lastday.temp.min = entry.main.temp;
        }

        // Calculate daily description, avg. humidity, pressure and windspeed
        for (let i = 0; i < data.days.length; i++) {
            let day = data.days[i];
            let h = new Array();
            let sum_hum = 0;
            let sum_pres = 0;
            let sum_windsp = 0;
            for (let j = 0; j < day.values.length; j++) {
                let entry = day.values[j];
                sum_hum += entry.hum;
                sum_pres += entry.pres;
                sum_windsp += entry.windsp;
                let k = 0;
                while (k < h.length && h[k].maindesc !== entry.maindesc)
                    k++;
                if (k < h.length) {
                    h[k].cnt++;
                } else {
                    h.push({ maindesc: entry.maindesc, cnt: 1 });
                }
            }
            let max = 0;
            for (let j = 1; j < h.length; j++) {
                if (h[j].cnt > h[max].cnt)
                    max = j;
            }
            day.maindesc = h[max].maindesc;
            day.hum = sum_hum / day.values.length;
            day.pres = sum_pres / day.values.length;
            day.windsp = sum_windsp / day.values.length;
        }

        success(data);
    });
}