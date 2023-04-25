document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const carList = document.getElementById("carList");
  const footer = document.querySelector("footer");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchPriceLower = document.getElementById("searchPriceLower").value;
    const searchPriceUpper = document.getElementById("searchPriceUpper").value;

    // Construct the URL based on your server-side API
    const url = `/cars/price?minPrice=${searchPriceLower}&maxPrice=${searchPriceUpper}`;

    fetch(url)
      .then((response) => response.json())
      .then((cars) => {
        // Call the new displayCars() function instead of directly inserting the result string
        displayCars(cars);
      })
      .catch((error) => {
        console.error("Error fetching car data:", error);
      });
  });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      footer.classList.add("hidden");
    } else {
      footer.classList.remove("hidden");
    }
  });

  function displayCars(cars) {
    carList.innerHTML = ""; // Clear the carList element
  
    // Load favourites from localStorage
    const storedFavourites = localStorage.getItem("favouriteCars");
    const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];

    if (cars.length === 0) {
      carList.innerHTML = "<p>No cars found matching the search criteria.</p>";
      return;
    }
  
    cars.forEach((car) => {
      const carItem = document.createElement("div");
      carItem.className = "car-item";
  
      const star = document.createElement("span");
      star.className = "star";

      // Set the initial state of the star
      const isFavourite = favourites.some((favCar) => favCar.id === car.id);
      if (isFavourite) {
        star.innerHTML = "★";
        star.classList.add("favourite");
      } else {
        star.innerHTML = "☆";
        star.classList.remove("favourite");
      }

      star.addEventListener("click", () => {
        if (star.innerHTML === "★") {
          star.innerHTML = "☆";
          star.classList.remove("favourite");
          star.classList.add("star-unclick");
          star.classList.remove("star-click");
          setTimeout(() => {
            star.classList.remove("star-unclick");
          }, 300);
          // Remove the car from the favourites array
          favourites.splice(favourites.findIndex((favCar) => favCar.id === car.id), 1);
        } else {
          star.innerHTML = "★";
          star.classList.add("favourite");
          star.classList.add("star-click");
          star.classList.remove("star-unclick");
          setTimeout(() => {
            star.classList.remove("star-click");
          }, 300);
          // Add the car to the favourites array
          favourites.push(car);
        }

        // Save the updated favourites array to localStorage
        localStorage.setItem("favouriteCars", JSON.stringify(favourites));
      });
  
      carItem.appendChild(star);
  
      const carProperties = [
        { label: "Id", value: car.id },
        { label: "Make", value: car.carMake },
        { label: "Model", value: car.carModel },
        { label: "Year", value: car.carYear },
        { label: "Country", value: car.country },
        { label: "Price", value: car.price },
        { label: "Odometer", value: car.odometer },
      ];
      carProperties.forEach((property) => {
        const propertyElement = document.createElement("p");
        propertyElement.innerHTML = `<span class="car-label">${property.label}:</span> ${property.value}`;
        carItem.appendChild(propertyElement);
      });
  
      carList.appendChild(carItem);
    });
  }
  searchForm.addEventListener("reset", function () {
    // Clear the results-container
    carList.innerHTML = "";
  });
});
