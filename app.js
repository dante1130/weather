const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = 3000;

const apiKey = process.env.WEATHER_API_KEY;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
	const city = req.body.cityName;
	
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	
	https.get(url, (response) => {
		response.on("data", (data) => {
			const weatherData = JSON.parse(data);

			const temp = weatherData.main.temp;
			const weatherDescription = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
	
			res.write(`<p>The weather is currently ${weatherDescription}</p>`);
			res.write(`<h1>The current temperature in ${city} is ${temp} degrees</h1>`);
			res.write(`<img src="${imageURL}">`);
			res.send();
		});
	}); 
});



app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});