/**
 * Weather Forecast Pro - Main Application
 * Author: Your Name
 * Version: 2.0.0
 */

import { fetchWeatherData, fetchForecastData } from './api.js';
import { 
  displayCurrentWeather, 
  displayForecast, 
  displayCharts,
  showLoading, 
  hideLoading, 
  showError,
  updateBackground,
  initThemeToggle
} from './ui.js';
import { 
  saveRecentSearch, 
  getFavorites, 
  toggleFavorite,
  getRecentSearches,
  getCachedWeather,
  cacheWeatherData
} from './storage.js';
import { getCurrentLocation } from './geolocation.js';
import { debounce } from './utils.js';

// DOM Elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('city');
const gpsBtn = document.getElementById('gpsBtn');
const weatherSection = document.getElementById('weatherSection');
const favoriteBtn = document.getElementById('favoriteBtn');
const recentList = document.getElementById('recentList');
const favoritesList = document.getElementById('favoritesList');
const suggestionsContainer = document.getElementById('suggestions');

// Global state
let currentCity = '';
let currentWeatherData = null;

/**
 * Initialize the application
 */
function initApp() {
  console.log('🌤️ Weather Forecast Pro - Initializing...');
  
  // Initialize theme
  initThemeToggle();
  
  // Load recent searches and favorites
  loadQuickAccess();
  
  // Event Listeners
  weatherForm.addEventListener('submit', handleFormSubmit);
  gpsBtn.addEventListener('click', handleGpsClick);
  favoriteBtn.addEventListener('click', handleFavoriteToggle);
  
  // Search suggestions with debounce
  cityInput.addEventListener('input', debounce(handleSearchInput, 300));
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!suggestionsContainer.contains(e.target) && e.target !== cityInput) {
      suggestionsContainer.classList.remove('active');
    }
  });
  
  console.log('✅ App initialized successfully');
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const city = cityInput.value.trim();
  
  if (!city) {
    showError(CONFIG.ERROR_MESSAGES.INVALID_INPUT);
    return;
  }
  
  await fetchAndDisplayWeather(city);
}

/**
 * Handle GPS button click
 */
async function handleGpsClick() {
  showLoading();
  
  try {
    const position = await getCurrentLocation();
    const { latitude, longitude } = position.coords;
    
    // Fetch weather by coordinates
    const weatherData = await fetchWeatherData(null, latitude, longitude);
    currentCity = weatherData.name;
    cityInput.value = currentCity;
    
    displayWeatherData(weatherData);
    
    // Also fetch forecast
    const forecastData = await fetchForecastData(null, latitude, longitude);
    displayForecast(forecastData);
    displayCharts(forecastData);
    
  } catch (error) {
    console.error('Geolocation error:', error);
    
    let errorMessage = CONFIG.ERROR_MESSAGES.GEOLOCATION_DENIED;
    if (error.code === 2) {
      errorMessage = CONFIG.ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE;
    } else if (error.code === 3) {
      errorMessage = CONFIG.ERROR_MESSAGES.GEOLOCATION_TIMEOUT;
    }
    
    showError(errorMessage);
  } finally {
    hideLoading();
  }
}

/**
 * Fetch and display weather for a city
 */
async function fetchAndDisplayWeather(city) {
  showLoading();
  suggestionsContainer.classList.remove('active');
  
  try {
    // Check cache first
    const cachedData = getCachedWeather(city);
    
    if (cachedData) {
      console.log('📦 Using cached data for', city);
      displayWeatherData(cachedData.current);
      displayForecast(cachedData.forecast);
      displayCharts(cachedData.forecast);
      hideLoading();
      return;
    }
    
    // Fetch current weather
    const weatherData = await fetchWeatherData(city);
    currentCity = weatherData.name;
    
    // Display current weather
    displayWeatherData(weatherData);
    
    // Fetch and display forecast
    const forecastData = await fetchForecastData(city);
    displayForecast(forecastData);
    displayCharts(forecastData);
    
    // Cache the data
    cacheWeatherData(city, weatherData, forecastData);
    
    // Save to recent searches
    saveRecentSearch(city);
    loadQuickAccess();
    
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    let errorMessage = CONFIG.ERROR_MESSAGES.API_ERROR;
    
    if (error.message.includes('404')) {
      errorMessage = CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND;
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    showError(errorMessage);
  } finally {
    hideLoading();
  }
}

/**
 * Display weather data in UI
 */
function displayWeatherData(data) {
  currentWeatherData = data;
  displayCurrentWeather(data);
  updateBackground(data.weather[0].main, isNightTime(data.sys.sunset));
  updateFavoriteButton();
  weatherSection.classList.remove('hidden');
  weatherSection.classList.add('animate-fadeInUp');
}

/**
 * Handle search input for suggestions
 */
function handleSearchInput(event) {
  const query = event.target.value.trim();
  
  if (query.length < 2) {
    suggestionsContainer.classList.remove('active');
    return;
  }
  
  // Get recent searches and favorites as suggestions
  const recentSearches = getRecentSearches();
  const favorites = getFavorites();
  
  const allCities = [...new Set([...favorites, ...recentSearches])];
  const matches = allCities.filter(city => 
    city.toLowerCase().includes(query.toLowerCase())
  );
  
  if (matches.length > 0) {
    displaySuggestions(matches);
  } else {
    suggestionsContainer.classList.remove('active');
  }
}

/**
 * Display search suggestions
 */
function displaySuggestions(cities) {
  suggestionsContainer.innerHTML = cities
    .slice(0, 5)
    .map(city => `
      <div class="suggestion-item" data-city="${city}">
        <i class="fas fa-location-dot"></i> ${city}
      </div>
    `)
    .join('');
  
  suggestionsContainer.classList.add('active');
  
  // Add click handlers
  suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const city = item.dataset.city;
      cityInput.value = city;
      fetchAndDisplayWeather(city);
    });
  });
}

/**
 * Load recent searches and favorites
 */
function loadQuickAccess() {
  const recent = getRecentSearches();
  const favorites = getFavorites();
  
  // Display recent searches
  recentList.innerHTML = recent.length > 0
    ? recent.map(city => `
        <span class="chip" onclick="window.searchCity('${city}')">
          ${city}
        </span>
      `).join('')
    : '<span class="chip" style="opacity: 0.5; cursor: default;">No recent searches</span>';
  
  // Display favorites
  favoritesList.innerHTML = favorites.length > 0
    ? favorites.map(city => `
        <span class="chip" onclick="window.searchCity('${city}')">
          ${city} <i class="fas fa-star" style="color: #fbbf24;"></i>
        </span>
      `).join('')
    : '<span class="chip" style="opacity: 0.5; cursor: default;">No favorites yet</span>';
}

/**
 * Handle favorite button toggle
 */
function handleFavoriteToggle() {
  if (!currentCity) return;
  
  const isFavorite = toggleFavorite(currentCity);
  updateFavoriteButton();
  loadQuickAccess();
  
  // Add animation
  favoriteBtn.classList.add('animate-bounceIn');
  setTimeout(() => favoriteBtn.classList.remove('animate-bounceIn'), 600);
}

/**
 * Update favorite button state
 */
function updateFavoriteButton() {
  if (!currentCity) return;
  
  const favorites = getFavorites();
  const isFavorite = favorites.includes(currentCity);
  
  favoriteBtn.innerHTML = isFavorite
    ? '<i class="fas fa-star"></i>'
    : '<i class="far fa-star"></i>';
  
  favoriteBtn.classList.toggle('active', isFavorite);
}

/**
 * Check if it's night time
 */
function isNightTime(sunsetTime) {
  const now = Date.now() / 1000;
  return now > sunsetTime;
}

/**
 * Global function to search city (for inline onclick)
 */
window.searchCity = function(city) {
  cityInput.value = city;
  fetchAndDisplayWeather(city);
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

console.log('🚀 Weather Forecast Pro loaded successfully!');