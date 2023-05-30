// keys for url genration
const keyWeather = "459f15061b9746b864fb39524db59e1a";
const keyGeo = "44f4248291bce199574111799e77d7e4";

// select inputs
const inputCityname = document.querySelector("#city");
//const inputStateCode = document.querySelector("#stateCode");
//const inputCountryCode = document.querySelector("#countryCode");
//const inputLimit = document.querySelector("#limit");

const btn = document.querySelector("#searchbtn");

//vars for checking if there are undefinied or not (for replacement)
let section;

//add event
btn.addEventListener("click", (e) => {
	e.preventDefault();
	let cityName = inputCityname.value;

	//cityName = "Dresden";
	//const stateCode = "," + inputStateCode.value;
	//let countryCode = "," + inputCountryCode.value;
	//let countryCode = "," + "Deutschland";
	const limit = "&limit=" + 10; //max is eig 5 laut doku

	//checks if there is a section
	if (!section) {
		section = document.createElement("section");
		// * classen der section hier adden mit section.classList.add("name") oder section.setAttribute("class", "name");/;
		section.setAttribute("id", "weatherSection");
		document.querySelector("main").appendChild(section);
	} else {
		section = document.querySelector("#weatherSection");
	}
	//leeren der section
	section.innerHTML = "";
	//console.log(section);
	const urlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${limit}&appid=${keyGeo}`;

	fetch(urlGeo)
		.then((res) => res.json())
		.then((data) => {
			data.forEach((result) => {
				const articleContainer = document.createElement("article");
				// * classen der article hier adden mit articleContainer.classList.add("name") oder articleContainer.setAttribute("class", "name");

				// * Classen für den Inhalt der Article hier adden (wie im HTML) mit class="namen"innerhalb des jeweiligen html-tag
				if (result["state"] === undefined) {
					result["state"] = "unbekannt";
				}

				const divContent = `<div>
                    <h3>${result["name"]}</h3>
                    <p>Country: ${result["country"]}
                    <p>lat: ${result["lat"]} <br/>lon: ${result["lon"]}</p>
                    <p>State: ${result["state"]}</p></div>
                `;

				//fügt dem article dem content hinzu
				articleContainer.insertAdjacentHTML("beforeEnd", divContent);

				//fügt der section die articels hinzu
				section.appendChild(articleContainer);

				// ? fügt jedem article einem eventlistener hinzu, müssen wir je styling ändern (evtl nur auf dn div des inhalts)
				articleContainer.addEventListener("click", (e) => {
					e.preventDefault();
					// aufruf vom fetch für weather api
					fetchWeather(result, articleContainer);
				});
			});
		})

		.catch((error) => {
			console.error(error);
		});
});

const fetchWeather = (city, divContainer) => {
	// auslesen der location
	const lat = city["lat"];
	const lon = city["lon"];
	const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric&lang=de`;

	fetch(urlWeather)
		.then((res) => res.json())
		.then((data) => {
			let divWeatherContainer = divContainer.querySelector(".weather");
			// * ^1 classen des divs der weathers hier adden mit divWeatherContainer.classList.add("name") oder divWeatherContainer.setAttribute("class", "name");
			console.log({ data });
			if (!divWeatherContainer) {
				divWeatherContainer = document.createElement("div");
				// * sowie hier anpassen falls bei ^1 es änderungen gab
				divWeatherContainer.classList.add("weather");
			}

			// * Classen für den Inhalt der divWeatherContainer hier adden (wie im HTML) mit class="namen" innerhalb des jeweiligen html-tags
			const weatherContent = `
				<figure>
				<img src="https://openweathermap.org/img/wn/${data["weather"][0]["icon"]}@2x.png" alt="${data["weather"][0]["main"]}">
				<figcaption>${data["main"]["temp"]}°C</figcaption>
				</figure>
                <p>${data["weather"][0]["main"]}</p>
                <p>${data["weather"][0]["description"]}</p>`;

			//überschreiben des inhalts des divWeatherContainers
			divWeatherContainer.innerHTML = weatherContent;

			//hinzufügen des inhalts
			divContainer.appendChild(divWeatherContainer);
		});
};
