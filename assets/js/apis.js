// Récupère les données des 2 apis à partir de la latitude et longitude
async function loadData(latitude, longitude)
{
	const sunData = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`)
		.then(resultat => resultat.json())
			.then(json => json.results)

	const addressData = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${(latitude + 5.8)}&lon=${longitude}`)
	.then(resultat => resultat.json())
	
	updateInformations(sunData, addressData);

}

function updateInformations(sunData, addressData)
{
	if (addressData.error)
	{
		document.querySelector("h2.countryData")
			.innerText = "No data avalaible for this point"
		document.querySelector("h3.cityData")
			.innerText = "";
		document.querySelector("p.sunData")
			.innerText = "";
	}

	else 
	{
		document.querySelector("h2.countryData")
			.innerText = `Country : ${addressData.address.country}`;
		document.querySelector("h3.cityData")
			.innerText = getCityData(addressData.address);
		document.querySelector("p.sunData")
			.innerText = `Sunrise : ${convert12Hourto24Hour(sunData.sunrise)}
				Sunset : ${convert12Hourto24Hour(sunData.sunset)}`;
	}

}

function getCityData(address) 
{
	if (address.village)
		return `Village : ${address.village}`
	else if (address.town)
		return `Town : ${address.town}`
	else if (address.municipality)
		return `Municipality : ${address.municipality}`
	else if (address.state)
		return `State : ${address.state}`
}

// Permets de passer du format 12 heures au format 24 heures
function convert12Hourto24Hour(timeToConvert)
{
	if (timeToConvert.search("AM") != -1)
	{
		timeToConvert = timeToConvert.split(" AM")[0];
		timeList = timeToConvert.split(":");
		timeToConvert = ((parseInt(timeList[0]) == 12) ? 0 : parseInt(timeList[0])) + `:${timeList[1]}:${timeList[2]}`;
	}
	else if (timeToConvert.search("PM") != -1)
	{
		timeToConvert = timeToConvert.split(" PM")[0];
		timeList = timeToConvert.split(":");
		timeToConvert = 12 + ((parseInt(timeList[0]) == 12) ? 0 : parseInt(timeList[0])) + `:${timeList[1]}:${timeList[2]}`;
	}

	return timeToConvert;
}