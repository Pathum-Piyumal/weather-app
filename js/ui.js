/**
 * Display current weather information
 */
export function displayCurrentWeather(data) {
  // Update city name and date
  document.querySelector('#cityName span').textContent = data.name;
  document.getElementById('currentDate').textContent = formatDate(new Date());
  
  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.getElementById('weatherIcon').src = iconUrl;
  document.getElementById('weatherIcon').alt = data.weather[0].description;
  
  // Update temperature
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°`;
  
  // Update description
  const description = data.weather[0].description;
  document.getElementById('weatherDescription').textContent = 
    description.charAt(0).toUpperCase() + description.slice(1);
  
  // Update details
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  
  // Update sun times
  document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
  document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
}

/**
 * Display 5-day forecast
 */
export function displayForecast(data) {
  const forecastContainer = document.getElementById('forecastCards');
  
  // Get one forecast per day (at 12:00)
  const dailyForecasts = data.list.filter(item => 
    item.dt_txt.includes('12:00:00')
  ).slice(0, 5);
  
  forecastContainer.innerHTML = dailyForecasts.map(forecast => {
    const date = new Date(forecast.dt * 1000);
    const iconCode = forecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    return `
      <div class="forecast-card stagger-item">
        <div class="forecast-date">${formatForecastDate(date)}</div>
        <img src="${iconUrl}" alt="${forecast.weather[0].description}" class="forecast-icon">
        <div class="forecast-temp">${Math.round(forecast.main.temp)}°</div>
        <div class="forecast-desc">${forecast.weather[0].description}</div>
      </div>
    `;
  }).join('');
}

/**
 * Display weather charts
 */
export function displayCharts(data) {
  const temperatureData = prepareTemperatureData(data);
  const weatherOverviewData = prepareWeatherOverviewData(data);
  
  createTemperatureChart(temperatureData);
  createWeatherOverviewChart(weatherOverviewData);
}

/**
 * Show loading state
 */
export function showLoading() {
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('errorState').classList.add('hidden');
  document.getElementById('weatherSection').classList.add('hidden');
}

/**
 * Hide loading state
 */
export function hideLoading() {
  document.getElementById('loadingState').classList.add('hidden');
}

/**
 * Show error message
 */
export function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorState').classList.remove('hidden');
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('weatherSection').classList.add('hidden');
  
  // Add shake animation
  const errorState = document.getElementById('errorState');
  errorState.classList.add('animate-shake');
  setTimeout(() => errorState.classList.remove('animate-shake'), 500);
}

/**
 * Update background based on weather
 */
export function updateBackground(weatherMain, isNight) {
  const timeOfDay = isNight ? 'night' : 'day';
  const background = CONFIG.WEATHER_BACKGROUNDS[weatherMain]?.[timeOfDay] || CONFIG.DEFAULT_BACKGROUND;
  document.body.style.background = background;
}

/**
 * Initialize theme toggle
 */
export function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    themeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  });
}

/**
 * Initialize and update map
 */
let map = null;
let marker = null;

export function initMap() {
  if (map) return; // Already initialized

  map = L.map('map').setView([6.9271, 79.8612], 12); // Default to Colombo
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([6.9271, 79.8612]).addTo(map);
}

export function updateMap(lat, lon, cityName) {
  if (!map) initMap();

  map.setView([lat, lon], 12);
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon]).addTo(map);
  }
  marker.bindPopup(cityName).openPopup();
}

// Helper functions
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatForecastDate(date) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function prepareTemperatureData(data) {
  const labels = [];
  const temperatures = [];
  
  data.list.slice(0, 8).forEach(item => {
    const date = new Date(item.dt * 1000);
    labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    temperatures.push(Math.round(item.main.temp));
  });
  
  return { labels, temperatures };
}

function prepareWeatherOverviewData(data) {
  const avgTemp = data.list.slice(0, 8).reduce((sum, item) => sum + item.main.temp, 0) / 8;
  const avgHumidity = data.list.slice(0, 8).reduce((sum, item) => sum + item.main.humidity, 0) / 8;
  const avgWind = data.list.slice(0, 8).reduce((sum, item) => sum + item.wind.speed, 0) / 8;
  
  return {
    labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
    values: [Math.round(avgTemp), Math.round(avgHumidity), Math.round(avgWind)]
  };
}

function createTemperatureChart(data) {
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  
  if (window.tempChart) {
    window.tempChart.destroy();
  }
  
  window.tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: data.temperatures,
        borderColor: CONFIG.UI.CHART_COLORS.TEMPERATURE,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

function createWeatherOverviewChart(data) {
  const ctx = document.getElementById('weatherOverviewChart').getContext('2d');
  
  if (window.overviewChart) {
    window.overviewChart.destroy();
  }
  
  window.overviewChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Average Values',
        data: data.values,
        backgroundColor: [
          CONFIG.UI.CHART_COLORS.TEMPERATURE,
          CONFIG.UI.CHART_COLORS.HUMIDITY,
          CONFIG.UI.CHART_COLORS.WIND
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}