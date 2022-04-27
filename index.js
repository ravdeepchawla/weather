async function get_weather() {
    let appid = 'e8ae1b0970701fd6b1dda15b8abd7a0b';
    let city = 'Berlin';
    let unit = 'metric';
    let count = 2;
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&appid=" + appid + "&units=" + unit + "&cnt=" + count;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function render_weather() {
    let weather = await get_weather();
    console.log(weather);
    
    let city = document.getElementById('city');
    city.innerHTML = weather.city.name;

    let temperature = document.getElementById('temperature');
    temperature.innerHTML = Math.round(weather.list[0].main.temp);

    let current_weather = document.getElementById('current_weather');
    current_weather.innerHTML = weather.list[0].weather[0].description;
    let icon_url = 	"https://openweathermap.org/img/wn/" + weather.list[0].weather[0].icon + "@2x.png"
    let icon = document.createElement('img');
    icon.src = icon_url;
    icon.alt = weather.list[0].weather[0].description + " icon";
    icon.classList.add("icon");
    current_weather.appendChild(icon);

    let current_feels_like = document.getElementById('current_feels_like');
    current_feels_like.innerHTML = Math.round(weather.list[0].main.feels_like);

    let future_temp = document.getElementById('future_temp');
    future_temp.innerHTML = Math.round(weather.list[1].main.temp);

    let future_time = document.getElementById('future_time');
    let ftime = new Date(weather.list[1].dt_txt);
    let options = {
        hour: 'numeric',
        hour12: true
      };
    future_time.innerHTML = ftime.toLocaleString('en-US', options);
    
    let future_weather = document.getElementById('future_weather');
    future_weather.innerHTML = weather.list[1].weather[0].description;

}

render_weather();