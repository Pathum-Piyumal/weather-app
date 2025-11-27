function showWeatherDetails(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const apiKey = '119710343db14e0a5c419c5ef49ffb49'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Show loading message before the API call
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = `<p>Loading weather data...</p>`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    })
    .then(data => {
      // Build the weather information
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const description = data.weather[0].description;
      const capitalized = description.charAt(0).toUpperCase() + description.slice(1);

      // Update the HTML with the weather information
      weatherInfo.innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <img src="${iconUrl}" alt="Weather icon">
        <p><strong>Temperature:</strong> ${data.main.temp} &#8451;</p>
        <p><strong>Feels Like:</strong> ${data.main.feels_like} &#8451;</p>
        <p><strong>Weather:</strong> ${capitalized}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      `;
      weatherInfo.classList.add('show'); // Add class to show the result
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
      // Display error message in case of failure
      weatherInfo.innerHTML = `<p>Failed to fetch weather. Please try again.</p>`;
    });
}

// Add event listener to the form
document.getElementById('weatherForm').addEventListener('submit', showWeatherDetails);
