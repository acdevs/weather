var lat;
var lon;
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var icons = {
  'Clouds' : 'cloudy',
  'Clear' : 'sunny',
  'Dust' : 'water',
  'Fog' : 'water',
  'Mist' : 'water',
  'Haze' : 'water',
  'Smoke' : 'water',
  'Snow' : 'ac_unit',
  'Rain' : 'rainy',
  'Drizzle' : 'rainy',
  'Thunderstorm' : 'thunderstorm'
}
const app = {
    init: () => {
      app.getLocation();
    },
    fetchWeather: (ev) => {
      //use the values from latitude and longitude to fetch the weather
      let key = '79de42b4834d68ba251b59998c5338bb';
      let lang = 'en';
      let units = 'metric';
      let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
      //fetch the weather
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          app.showWeather(data);
        })
        .catch(console.err);
        document.title = "Unservicable!";
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
      app.fetchWeather();
    },
    wtf: (err) => {
      //geolocation failed
      console.error(err);
    },
    showWeather: (resp) => {
      console.log(resp);
      let card = document.getElementById('container');
      get = resp;
      document.title = get.name;
      //get date
      let raw_date = new Date();
      date = week[raw_date.getDay()] + ", " + month[raw_date.getMonth()] + " " + raw_date.getDate();

      card.innerHTML = `
    <div class="card">
      <div class="title">
        <div class="material-symbols-rounded">${icons[get.weather[0].main]}</div>
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
        <div class="desc feels-like">feels like ${get.main.feels_like.toFixed(1)}°</div>
      </div>
      <div class="border"></div>
      <div class="card-footer">
        <div class="card-box">
          <div class="material-symbols-rounded">speed</div>
          <div class="card-text">${get.main.pressure}mb</div>
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
    </div>
      `;
    },
  };
  app.init();
