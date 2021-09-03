// Global
let elements = {};
const baseURL = "https://api.weatherapi.com/v1";
const currentWeatherAPI = "current.json";
const autocompleteAPI = "search.json";
const weatherAPIKey = "key=9281cb154626404782685014212106";
const pixelAPIKey = '563492ad6f91700001000001beee9e9e91774588837d0228959b425c';

// Functions
function fillElementsObject(key, elementIDArray) {
    elements[key] = [];

    for(const elementID of elementIDArray) {
        elements[key].push(document.getElementById(elementID))
    };
};


async function fetchLocationPicture(city) {
    const url = `https://api.pexels.com/v1/search?query=${city}`;

    const responseJSON = await fetch(url, {
        headers: {
            Authorization: '563492ad6f91700001000001beee9e9e91774588837d0228959b425c'}
        })
        .then(response => response.json())
    
    const body = document.querySelector("body");

    if(responseJSON.photos.length > 0) {
        console.log(responseJSON.photos)
        body.style.backgroundImage = `url(${responseJSON.photos[0].src.original})`
    }
    else {
        body.style.backgroundImage = "url(./bg/1.jpg)";
    }

    // Ezzel nem működik: problémája van az allow-access-origin-nel, amit nem tudok feloldani
    // const response = await fetch(url, {
    //         headers: {Autorization: '563492ad6f91700001000001beee9e9e91774588837d0228959b425c'}
    // const responseJSON = response.json();
    // });
};


async function fetchCurrentWeather(city) {
    const url = `${baseURL}/${currentWeatherAPI}?${weatherAPIKey}&q=${city}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    return responseJson;
};


 async function liClickedHandle(event) {
    const fetchResult =  await fetchCurrentWeather(event.target.id);

    fetchLocationPicture(fetchResult.location.name)

    elements.searchElementsIDArray[2].innerHTML = "";

    elements.resultElementsIDArray[0].innerHTML = `Last updated: ${fetchResult.current.last_updated}`
    elements.resultElementsIDArray[1].setAttribute("src", fetchResult.current.condition.icon);
    elements.resultElementsIDArray[2].innerHTML = fetchResult.current.condition.text;
    elements.resultElementsIDArray[3].innerHTML = `Country: ${fetchResult.location.country}`;
    elements.resultElementsIDArray[4].innerHTML = `City: ${fetchResult.location.name}`;
    elements.resultElementsIDArray[5].innerHTML = `Degree: ${fetchResult.current.temp_c} °C`;
    elements.resultElementsIDArray[6].innerHTML = `Feels like: ${fetchResult.current.feelslike_c} °C`;
    elements.resultElementsIDArray[7].innerHTML = `Humidity: ${fetchResult.current.humidity}%`;
    elements.resultElementsIDArray[8].innerHTML = `UV level: ${fetchResult.current.uv}`;

    document.querySelector("input").value = fetchResult.location.name;

    document.getElementById("weatherContainer").classList.add("active");

};


async function getLocationArray(str) {
    const url = `${baseURL}/${autocompleteAPI}?${weatherAPIKey}&q=${str}`;
    const response = await fetch(url);
    const responseJSON = await response.json();

    return responseJSON;
};


async function handleInput(event) {
    let locatonArray = null;
    
    const ulElement = document.getElementById("searchResult");
    ulElement.innerHTML = "";

    if(event.target.value.length >= 4) {
        locatonArray = await getLocationArray(event.target.value);

        for(const city of locatonArray) {
            // let nameArray = city.name.split(", ")[0]
            
            if (locatonArray.indexOf(city) <= 4) {
                ulElement.insertAdjacentHTML("beforeend", `<li id="${city.url}">${city.name}</li>`);

            }
        }
    }    

    for(const li of ulElement.children) {
        li.addEventListener("click", liClickedHandle)
    }
};


function _load() {
    const rootE = document.getElementById("root");
    
    rootE.insertAdjacentHTML("beforeend",
     `
        <header>
            <img src="./logo/logo4.png">
        </header>
        <div id="searchDIV">
            <div id="searchBarDIV">
                <label for="searchBar">Choose city:</label>
                <input type="text" id="searchBar" placeholder="City Name">
                <ul id="searchResult"></ul>
            </div>
        </div>
        <div id="weatherContainer">
            <div>
                <span id="lastUpdated">Last updated:</span>
                <div> 
                    <img id="icon">
                    <span id="text"></span>
                </div>
            </div>
            <div>
                <span id="country">Country:</span>
                <span id="city">City:</span>
                <span id="degree">Degree:</span>
            </div>
            <div>
                <span id="feelslike">Feels like:</span>
                <span id="humidity">Humidity:</span>
                <span id="uv">UV level:</span>
            </div>
        </div>
    `);

    const searchElementsIDArray = ["searchBar", "dropDownMenu", "searchResult", "container"];

    const resultElementsIDArray = [
        "lastUpdated", "icon", "text", "country", "city", "degree", "feelslike", "humidity", "uv"];
    
    
    fillElementsObject("searchElementsIDArray", searchElementsIDArray)
    fillElementsObject("resultElementsIDArray", resultElementsIDArray)

    document.getElementById("searchBar").addEventListener("input", handleInput);





    // For the fix size drop down menu:

    // let cities = ["Sydney", "Budapest", "Amsterdam", "London", "New York"];
    // let ulElement = document.getElementById("searchResult");

    // for(let city of cities) {
    //     ulElement.insertAdjacentHTML("beforeend", `<li>${city}</li>`);
    // }

    // for(let li of document.querySelectorAll("li")) {
    //     li.addEventListener("click", liClickedHandle)
    // }
};


window.addEventListener("load", _load);