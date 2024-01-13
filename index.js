import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const api_id = "ecb57013f097ff3e635f2157b240b93c";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index.ejs", {
    city: "N/A",
    state: "N/A",
    country: "N/A",
    temp: "N/A",
    humidity: "N/A",
    like: "N/A",
  });
});

app.post("/search", async (req, res) => {
  try {
    const city = req.body.city;
    const result = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api_id}`
    );

    // Assuming the API response is an array, take the first result
    const location = result.data[0];

    const lat = location.lat;
    const lon = location.lon;
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_id}`
    );

    res.render("index.ejs", {
      city: location.name,
      state: location.state,
      country: location.country,
      temp: (weather.data.main.temp-273.15).toFixed(2),
      humidity: weather.data.main.humidity,
      like: weather.data.weather[0].main,
    });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
