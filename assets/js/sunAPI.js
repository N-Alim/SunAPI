// // ancien code de compatibilité, aujourd’hui inutile
// if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+...
//     httpRequest = new XMLHttpRequest();
// }
// else if (window.ActiveXObject) { // IE 6 et antérieurs
//     httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
// }

let data;

function loadData(latitude, longitude)
{
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function()
	{
		if (this.status == 200)
		{
			data = JSON.parse(this.responseText).results;
			updateDataCard(data);
		}
		else
		{
			console.log("Message " + this.status + " : " + this.statusText);
		}
	}
	xhttp.open("GET",
		`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`
	);
	xhttp.send();
}

function updateDataCard(data)
{
	const card = document.querySelector(".dataCard");
	card.innerText = "";

	for (const property in data) 
	{
		const textZone = document.createElement("p");
		textZone.innerText = `${property}: ${data[property]}`;
		card.appendChild(textZone);
	}
}

// loadDoc(36.7201600, -4.4203400)

//4 chiffres après la virgule suffisent pour les coordonées

/*
loadDoc("url-1", myFunction1);

loadDoc("url-2", myFunction2);

function loadDoc(url, cFunction) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {cFunction(this);}
  xhttp.open("GET", url);
  xhttp.send();
}

function myFunction1(xhttp) {
  // action goes here
}
function myFunction2(xhttp) {
  // action goes here
}
*/

/*
astronomical_twilight_begin: "3:52:31 AM"
astronomical_twilight_end: "5:55:32 PM"
civil_twilight_begin: "4:43:38 AM"
civil_twilight_end: "5:04:25 PM"
day_length: "11:38:45"
nautical_twilight_begin: "4:18:01 AM"
nautical_twilight_end: "5:30:02 PM"
solar_noon: "10:54:01 AM"
sunrise: "5:04:39 AM"
sunset: "4:43:24 PM"
*/

/*
lat (float): Latitude in decimal degrees. Required.
lng (float): Longitude in decimal degrees. Required.
date (string): Date in YYYY-MM-DD format. Also accepts other date formats and even relative date formats. If not present, date defaults to current date. Optional.
callback (string): Callback function name for JSONP response. Optional.
formatted (integer): 0 or 1 (1 is default). Time values in response will be expressed following ISO 8601 and day_length will be expressed in seconds. Optional.
*/