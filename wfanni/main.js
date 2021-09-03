// const cities = ["Barcelona", "Porto", "Dublin", "Oslo", "Ljubljana"];

// const spanElements = [
//     {lastUpdated: document.getElementById("lu")},
//     {city: document.getElementById("city")},
//     {country: document.getElementById("country")},
//     {tz: document.getElementById("tz")},
//     {img: document.getElementById("img")},
//     {conditionText: document.getElementById("conditionText")},
//     {temp: document.getElementById("temp")},
//     {fl: document.getElementById("fl")},
//     {humidity: document.getElementById("humidity")}

// ];






// AUTOCOMPLETE FETCHING SEARCH.JSON

async function getLocationArray(str) {
    const URL = `http://api.weatherapi.com/v1/search.json?key=47a8668579cc4f83a9e82742212106&q=${str}`;
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON
}

// FETCH SELECTED CITY

async function fetching(selectedCity) {

    const URL = `http://api.weatherapi.com/v1/current.json?key=47a8668579cc4f83a9e82742212106&q=${selectedCity}`;
    const response = await fetch(URL);
    console.log(response)
    const data = await response.json();
    
    return data   
}

// SELECTED CITY WEATHER TABLE FILL WITH FETCHED DATA + RESULTDIV AND UL CLASSLIST CHANGE

async function getCityWeather(e) {

    const fetchingResult = await fetching(e.target.textContent);
    
    const fResultData = [
        {name: "lu", value: fetchingResult.current.last_updated},
        {name: "city", value: fetchingResult.location.name},
        {name: "country", value: fetchingResult.location.country},
        {name: "tz", value: fetchingResult.location.tz_id},
        {name: "img", value: fetchingResult.current.condition.icon},
        {name: "conditionText", value: fetchingResult.current.condition.text},
        {name: "temp", value: fetchingResult.current.temp_c},
        {name: "fl", value: fetchingResult.current.feelslike_c},
        {name: "humidity", value: fetchingResult.current.humidity}
    ]
    
    
    for (const e of fResultData) {
        const tag = document.getElementById(e.name);

        if (e.name == "temp" || e.name == "fl") {
            tag.textContent = `${e.value}°C`;       
        } else if (e.name == "humidity") {
            tag.textContent = `${e.value}%`;
        } else if (e.name !== "img") {
            tag.textContent = e.value;
        } else {
            tag.setAttribute("src", e.value)
        }

    }

    const resultDIV = document.getElementById("resultDIV");
    resultDIV.classList.add("selected");

    const ul = document.querySelector("ul");
    ul.classList.remove("showResults");
    
}

// FUNCTION ON TYPE IN INPUT

async function typeIn(e) {
    const ul = document.querySelector("ul");
    ul.innerHTML = "";
    // let locationArray = null;

    if (e.target.value.length >= 2) {
        const locationArray = await getLocationArray(e.target.value);

        for (const city of locationArray) {
            
            if (locationArray.indexOf(city) <= 4) {
                const cName = city.name.split(', ')[0];
                ul.insertAdjacentHTML("beforeend", `<li>${cName}</li>`);

                const liE = document.querySelectorAll("li");

                for(const litem of liE) {
                    litem.addEventListener("click", getCityWeather)
                }

                // const cityWeather = await 
                getCityWeather(cName);

            } else {
                break
            }
            
        }

        ul.classList.add("showResults")
    } else if (e.target.value.length < 3) {
        ul.classList.remove("showResults");
        return;
    }
}

// ONLOAD FUNCTION

function onLoad() {

    const root = document.getElementById("root");

    const headerDIV = document.createElement("header");
    root.appendChild(headerDIV);

    const logoIMG = document.createElement("img");
    logoIMG.setAttribute("src", "logo/logo4.png");
    headerDIV.appendChild(logoIMG);

    const searchDIV = document.createElement("div");
    searchDIV.setAttribute("id", "searchDIV")
    root.appendChild(searchDIV);

    const searchBarDIV = document.createElement("div");
    searchBarDIV.setAttribute("id", "searchBarDIV");
    searchDIV.appendChild(searchBarDIV);

    const inputField = `
        <label for="searchBar">Choose City:</label>
        <input type="search" id="searchBar">
    `;
    searchBarDIV.insertAdjacentHTML("beforeend", inputField);

    const input = document.getElementById("searchBar");

    const ul = document.createElement("ul");
    ul.setAttribute("id", "searchResult");
    searchDIV.appendChild(ul);

    // for (const city of cities) {
    //     const li = `
    //         <li>${city}</li>
    //     `;
    //     ul.insertAdjacentHTML("beforeend", li)
    // }

    // const liE = document.querySelectorAll("li");
    
    const resultDIV = document.createElement("div");
    resultDIV.setAttribute("id", "resultDIV");
    root.appendChild(resultDIV);


    input.addEventListener("input", typeIn)

    // for (const listItem of liE) {
    //     listItem.addEventListener("click", selectCity);
    // }

    const cityWeatherTable = `
    <div id="table">
        <div id="tableHeader">
            <span>Last Updated: </span><span id="lu"></span><br>
            <div id="current">
                <div><img id="img" /></div>
                <span id="conditionText"></span>
            </div>
        </div>
        <div id="tableContent">
            <div id="info">
                <span>City: </span><span id="city"></span><br>
                <span>Country: </span><span id="country"></span><br>
                <span>Time Zone: </span><span id="tz"></span>
            </div>        
            <div id="data">
                <span>Temperature: </span><span id="temp"></span><br>
                <span>Feels Like: </span><span id="fl"></span><br>
                <span>Humidity: </span><span id="humidity"></span>
            </div>
        </div>
    </div>      
    
    `;
    resultDIV.insertAdjacentHTML("beforeend", cityWeatherTable);

    const pointerDIV = document.createElement("div");
    pointerDIV.setAttribute("id", "pointerDIV");
    root.appendChild(pointerDIV);

}

window.addEventListener("load", onLoad)