const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const icons = {
  '02d' : 'mostly_sunny',
  '02n' : 'mostly_clear_night',
  '03d' : 'partly_cloudy',
  '03n' : 'partly_cloudy_night',
  '04d' : 'mostly_cloudy_day',
  '04n' : 'mostly_cloudy_night',

  '01d' : 'sunny',
  '01n' : 'clear_night',

  '50d' : 'haze_fog_dust_smoke',
  '50n' : 'haze_fog_dust_smoke',

  '10d' : 'scattered_showers_day',
  '10n' : 'scattered_showers_night',
  '13d' : 'snow_showers_snow',
  '13n' : 'snow_showers_snow',
  '09d' : 'heavy_rain',
  '09n' : 'heavy_rain',

  '11d' : 'isolated_scattered_tstorms_day',
  '11n' : 'isolated_scattered_tstorms_night'
}
let lat;
let lon;
const key = '79de42b4834d68ba251b59998c5338bb';
const lang = 'en';
const units = 'metric';

const fetch_city = (city) =>{
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${key}&units=${units}&lang=${lang}`;
  app.fetchWeather(url);
}
const debounce = (fn, delay) => {
  let timer;
  return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
          fn.apply(this, args);
      }, delay);
  }
}
const search_city = debounce(fetch_city, 500);

const card = document.getElementById('fetch');
const app = {

  init: () => {
    app.getLocation();
  },

  fetchWeather: (url) => {
    //fetch the weather
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw Error("Mewww ?!");
        return resp.json();
      })
      .then((data) => {
        app.showWeather(data);
      })
      .catch((err) => {
        document.title = "Unservicable!";
        card.innerHTML = `
        <div class="error">
          <img src="something-went-wrong.png" draggable="false">
          <div>${err.message}</div>
        </div>
        `;
      });
  },
  getLocation: (ev) => {
    let opts = {
      enableHighAccuracy: true,
      timeout: 1000 * 10, //10 seconds
      maximumAge: 1000 * 60 * 5, //5 minutes
    };
    navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
  },
  ftw: (position) => {
    //got position
    lat = position.coords.latitude.toFixed(2);
    lon = position.coords.longitude.toFixed(2);
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
    app.fetchWeather(url);
  },
  showWeather: (resp) => {
    get = resp;
    document.title = get.name;
    //get date
    let raw_date = new Date(get.dt * 1000);
    date = week[raw_date.getDay()] + ", " + month[raw_date.getMonth()] + " " + raw_date.getDate();
    
    //weather icon
    icon_url = `https://www.gstatic.com/images/icons/material/apps/weather/2x/${icons[get.weather[0].icon]}_light_color_96dp.png`;
    
    //fav-icon
    const favicon = document.querySelector("link[rel~='icon']");
    favicon.href = icon_url;

    //show the content
    card.innerHTML = `
    <div class="title">
      <div class="material-icon"><img src="${icon_url}" draggable="false"></img></div>
      <div class="temp">${get.main.temp.toFixed(0)}°</div>
    </div>
    <div class="subtitle">
      <div class="card-title">${get.name}</div>
      <div class="card-date">${date}</div>
    </div>
    <div class="description">
      <div class="desc feels-what">${get.weather[0].description}</div>
    </div>
    <div class="description">
      <div class="desc feels-like">feels like ${get.main.feels_like.toFixed(0)}°</div>
    </div>
    <div class="border"></div>
    <div class="card-footer">
      <div class="card-box">
        <div class="material-symbols-rounded">speed</div>
        <div class="card-text">${get.main.pressure}hPa</div>
      </div>
      <div class="card-box">
        <div class="material-symbols-rounded">humidity_mid</div>
        <div class="card-text">${get.main.humidity}%</div>
      </div>
      <div class="card-box">
        <div class="material-symbols-rounded">air</div>
        <div class="card-text">${get.wind.speed}m/s</div>
      </div>
    </div>
    `;
  },
};
app.init();
