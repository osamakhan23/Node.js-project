document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("queryForm");
  const carList = document.getElementById("carList");
  const footer = document.querySelector("footer");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const yearInput = document.getElementById("yearInput").value || "";
    const makeInput = document.getElementById("makeInput").value || "";

    // Construct the URL based on your server-side API
    const url = `/cars/summary?carYear=${yearInput}&carMake=${makeInput}`;

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

    if (cars.length === 0) {
      carList.innerHTML = "<p>No cars found matching the search criteria.</p>";
      return;
    }
    const carItem = document.createElement("div");
    carItem.className = "car-item";

    const carProperties = [
      { label: "TotalCars", value: cars.TotalCars },
      { label: "AveragePrice", value: cars.AveragePrice },
      { label: "AverageOdometer", value: cars.AverageOdometer },
    ];

    carProperties.forEach((property) => {
      const propertyElement = document.createElement("p");
      propertyElement.innerHTML = `<span class="car-label">${property.label}:</span> ${property.value}`;
      carItem.appendChild(propertyElement);
    });

    carList.appendChild(carItem);
  }

  searchForm.addEventListener("reset", function () {
    // Clear the results-container
    carList.innerHTML = "";
  });
});

