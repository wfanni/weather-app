// Global
let elements = {};
const baseURL = "http://api.weatherapi.com/v1";
const currentWeatherAPI = "current.json";
const autocompleteAPI = "search.json";
const APIKey = "key=9281cb154626404782685014212106";

// Functions
function fillElementsObject(key, elementIDArray) {
    elements[key] = [];

    for(const elementID of elementIDArray) {
        elements[key].push(document.getElementById(elementID))
    };
};


async function fetchCurrentWeather(city) {
    const url = `${baseURL}/${currentWeatherAPI}?${APIKey}&q=${city}`;
    // console.log(url)

    const response = await fetch(url);
    const responseJson = await response.json();

    return responseJson;
};


 async function liClickedHandle(event) {
    const fetchResult =  await fetchCurrentWeather(event.target.id);
    // console.log(fetchResult)

    elements.searchElementsIDArray[2].innerHTML = "";

    elements.resultElementsIDArray[0].innerHTML = fetchResult.current.last_updated;
    elements.resultElementsIDArray[1].setAttribute("src", fetchResult.current.condition.icon);
    elements.resultElementsIDArray[2].innerHTML = fetchResult.current.condition.text;
    elements.resultElementsIDArray[3].innerHTML = `Country: ${fetchResult.location.country}`;
    elements.resultElementsIDArray[4].innerHTML = `City: ${fetchResult.location.name}`;
    elements.resultElementsIDArray[5].innerHTML = `Degree: ${fetchResult.current.temp_c}°C`;
    elements.resultElementsIDArray[6].innerHTML = `Feels like: ${fetchResult.current.feelslike_c}°C`;
    elements.resultElementsIDArray[7].innerHTML = `Humidity: ${fetchResult.current.humidity}%`;
    elements.resultElementsIDArray[8].innerHTML = `UV level: ${fetchResult.current.uv}`;

    document.querySelector("input").value = fetchResult.location.name;

    document.getElementById("weatherContainer").classList.add("show");

    
};


async function getLocationArray(str) {
    const url = `${baseURL}/${autocompleteAPI}?${APIKey}&q=${str}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    // console.log(responseJSON)

    return responseJSON;
};


async function handleInput(event) {
    // const dropDownMenu = document.getElementById("dropDownMenu");
    let locatonArray = null;
    
    const ulElement = document.getElementById("searchResult");
    ulElement.innerHTML = "";

    if(event.target.value.length >= 4) {
        locatonArray = await getLocationArray(event.target.value);

        for(const city of locatonArray) {
            // let nameArray = city.name.split(", ")[0]
            
            if (locatonArray.indexOf(city) <= 4) {
                ulElement.insertAdjacentHTML("beforeend", `<li id="${city.url}">${city.name}</li>`);
                
                const liE = document.querySelectorAll("li");

                for(const litem of liE) {
                    litem.addEventListener("click", liClickedHandle)
                }

            } else {
                break
            }
            
        
        };
    } 
    // else {
    //     return;
    // };

    

    for(const li of ulElement.children) {
        li.addEventListener("click", liClickedHandle)
    };
};


function _load() {
    const rootE = document.getElementById("root");
    
    rootE.insertAdjacentHTML("beforeend",
     `
        <header>
            <a href="index.html"><img src="./logo/logo4.png"></a>
        </header>
        <div id="searchDIV">
            <div id="searchBarDIV">
                <label for="searchBar">Choose city:</label>
                <input type="text" id="searchBar" placeholder="city name">
                
            </div>
        </div>
        <ul id="searchResult"></ul>
        <div id="weatherContainer">
            <div id="lastU">
                Last updated:<span id="lastUpdated"></span>
                <div id="current"> 
                    <img id="icon">
                    <span id="text"></span>
                </div>
            </div>
            <div id="data">
                <div>
                    <span id="country"></span>
                    <span id="city"></span>
                </div>
                <div>
                    <span id="degree"></span>
                    <span id="feelslike"></span>
                </div>
                <div>
                    <span id="humidity"></span>
                    <span id="uv"></span>
                </div>
            </div>
        </div>
    `);

    const searchElementsIDArray = ["searchBar", "dropDownMenu", "searchResult", "container"];

    const resultElementsIDArray = [
        "lastUpdated", "icon", "text", "country", "city", "degree", "feelslike", "humidity", "uv"];
    
    
    fillElementsObject("searchElementsIDArray", searchElementsIDArray)
    fillElementsObject("resultElementsIDArray", resultElementsIDArray)

    // console.log(elements)

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