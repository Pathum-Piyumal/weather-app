/**
 * API Module - Handles all API calls to OpenWeatherMap
 */

/**
 * Fetch current weather data
 * @param {string} city - City name
 * @param {number} lat - Latitude (optional)
 * @param {number} lon - Longitude (optional)
 * @returns {Promise<Object>} Weather data
 */
export async function fetchWeatherData(city = null, lat = null, lon = null) {
  let url;
  
  if (lat && lon) {
    url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CURRENT_WEATHER}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS.TEMPERATURE}`;
  } else if (city) {
    url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CURRENT_WEATHER}?q=${city}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS.TEMPERATURE}`;
  } else {
    throw new Error('Either city or coordinates must be provided');
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found (404)');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded (429)');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Weather data fetched:', data.name);
    return data;
    
  } catch (error) {
    console.error('❌ Error fetching weather:', error);
    throw error;
  }
}

/**
 * Fetch 5-day forecast data
 * @param {string} city - City name
 * @param {number} lat - Latitude (optional)
 * @param {number} lon - Longitude (optional)
 * @returns {Promise<Object>} Forecast data
 */
export async function fetchForecastData(city = null, lat = null, lon = null) {
  let url;
  
  if (lat && lon) {
    url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.FORECAST}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS.TEMPERATURE}`;
  } else if (city) {
    url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.FORECAST}?q=${city}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS.TEMPERATURE}`;
  } else {
    throw new Error('Either city or coordinates must be provided');
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Forecast data fetched');
    return data;
    
  } catch (error) {
    console.error('❌ Error fetching forecast:', error);
    throw error;
  }
}

/**
 * Fetch air quality data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Air quality data
 */
export async function fetchAirQuality(lat, lon) {
  const url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.AIR_POLLUTION}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Air quality data fetched');
    return data;
    
  } catch (error) {
    console.error('❌ Error fetching air quality:', error);
    return null; // Return null if fails, don't break the app
  }
}

/**
 * Search cities for autocomplete
 * @param {string} query - Search query
 * @returns {Promise<Array>} List of cities
 */
export async function searchCities(query) {
  const url = `${CONFIG.ENDPOINTS.GEOCODING}?q=${query}&limit=5&appid=${CONFIG.API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('❌ Error searching cities:', error);
    return [];
  }
}