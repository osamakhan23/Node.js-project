// The express package contains Express, and its own required dependencies. It needs to be
// installed using npm.
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: null,
  })
);
app.set("view engine", "handlebars");

// Setup static routing. Any file located in the "public" folder
// will be able to be accessed by clients directly.
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Get the car data from car-data.js
// will import an array of 220 car objects
const carData = require("./car-data");

// When a GET request is made to "/" (i.e. the root path), render the
// "home" view. This can be found in /views/home.handlebars
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/view/stats", function (req, res) {
  res.render("stats");
});

app.get("/view/id", function (req, res) {
  res.render("id");
});

app.get("/view/make", function (req, res) {
  res.render("make");
});

app.get("/view/model", function (req, res) {
  res.render("model");
});

app.get("/view/year", function (req, res) {
  res.render("year");
});

app.get("/view/country", function (req, res) {
  res.render("country");
});

app.get("/view/price", function (req, res) {
  res.render("price");
});

app.get("/view/odometer", function (req, res) {
  res.render("odometer");
});

// An example route handler function that demonstrates how car data can be sent to the web browser
app.get("/cars", function (req, res) {
  const countryName = req.query.country;
  const cars = getCarsByCountry(countryName);
  res.json(cars);
});
// Get cars by ID
app.get("/cars/id", function (req, res) {
  const carId = parseInt(req.query.id);
  const car = getCarById(carId);
  res.json(car);
});

// Get cars by make
app.get("/cars/make", function (req, res) {
  const make = req.query.make;
  const cars = getCarsByMake(make);
  res.json(cars);
});

// Get cars by model
app.get("/cars/model", function (req, res) {
  const model = req.query.model;
  const cars = getCarsByModel(model);
  res.json(cars);
});

// Get cars by year
app.get("/cars/year", function (req, res) {
  const yearStart = parseInt(req.query.yearStart);
  const yearEnd = parseInt(req.query.yearEnd);
  const cars = getCarsByYearRange(yearStart, yearEnd);
  res.json(cars);
});

// Get cars by country
app.get("/cars/country", function (req, res) {
  const country = req.query.country;
  const cars = getCarsByCountry(country);
  res.json(cars);
});

// Get cars by price range
app.get("/cars/price", function (req, res) {
  const minPrice = parseInt(req.query.minPrice);
  const maxPrice = parseInt(req.query.maxPrice);
  const cars = getCarsByPriceRange(minPrice, maxPrice);
  res.json(cars);
});

// Get cars by odometer range
app.get("/cars/odometer", function (req, res) {
  const minOdometer = parseInt(req.query.minOdometer);
  const maxOdometer = parseInt(req.query.maxOdometer);
  const cars = getCarsByOdometerRange(minOdometer, maxOdometer);
  res.json(cars);
});

app.get("/cars/summary", function (req, res) {
  const carYear = parseInt(req.query.carYear);
  const carMake = req.query.carMake;
  const summary = calculateSummaryStatistics(carYear, carMake);
  res.json(summary);
});
// Serve car data as JSON
app.get("/car-data", function (req, res) {
  res.json(carData);
});

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

// An example function that gets all cars from a given country
function getCarsByCountry(countryName) {
  const carsFromCountry = carData.filter((car) => car.country.toLowerCase() === countryName.toLowerCase());
  return carsFromCountry;
}

function getCarsByMake(makeName) {
  const carsByMake = carData.filter((car) => car.carMake.toLowerCase() === makeName.toLowerCase());
  return carsByMake;
}
function getCarsByModel(modelName) {
  const carsByModel = carData.filter((car) => car.carModel.toLowerCase() === modelName.toLowerCase());
  return carsByModel;
}
function getCarsByYearRange(yearStart, yearEnd) {
  const carsByYear = carData.filter(
    (car) => car.carYear >= yearStart && car.carYear <= yearEnd
  );
  return carsByYear;
}
function getCarsByPriceRange(priceLower, priceUpper) {
  const carsByPrice = carData.filter(
    (car) => car.price >= priceLower && car.price <= priceUpper
  );
  return carsByPrice;
}
function getCarsByOdometerRange(odometerLower, odometerUpper) {
  const carsByOdometer = carData.filter(
    (car) => car.odometer >= odometerLower && car.odometer <= odometerUpper
  );
  return carsByOdometer;
}
function getCarById(carId) {
  const car = carData.filter((car) => car.id === carId);
  return car;
}
function calculateSummaryStatistics(year, make) {
  let filteredCars = carData;

  if (year) {
    filteredCars = filteredCars.filter((car) => car.carYear == year);
  }

  if (make) {
    filteredCars = filteredCars.filter(
      (car) => car.carMake.toLowerCase() === make.toLowerCase()
    );
  }

  let totalPrice = 0;
  let totalOdometer = 0;

  for (const car of filteredCars) {
    totalPrice += car.price;
    totalOdometer += car.odometer;
  }

  const averagePrice = totalPrice / filteredCars.length;
  const averageOdometer = totalOdometer / filteredCars.length;

  return {
    TotalCars: filteredCars.length,
    AveragePrice: averagePrice.toFixed(2),
    AverageOdometer: averageOdometer.toFixed(2),
  };
}
