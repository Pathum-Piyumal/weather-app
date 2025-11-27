// Configuration file for Weather Forecast App
// IMPORTANT: Replace YOUR_API_KEY with your actual OpenWeatherMap API key
// Get your free API key at: https://openweathermap.org/api

const CONFIG = {
  // API Configuration
  API_KEY: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`, // Replace with your API key
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  // API Endpoints
  ENDPOINTS: {
    CURRENT_WEATHER: '/weather',
    FORECAST: '/forecast',
    AIR_POLLUTION: '/air_pollution',
    GEOCODING: 'https://api.openweathermap.org/geo/1.0/direct'
  },

  // Units
  UNITS: {
    TEMPERATURE: 'metric', // 'metric' for Celsius, 'imperial' for Fahrenheit
    WIND_SPEED: 'metric'
  },

  // Cache Configuration
  CACHE: {
    EXPIRY_TIME: 10 * 60 * 1000, // 10 minutes in milliseconds
    MAX_RECENT_SEARCHES: 5,
    MAX_FAVORITES: 5
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300, // milliseconds
    DEBOUNCE_DELAY: 500, // milliseconds for search input
    CHART_COLORS: {
      TEMPERATURE: 'rgba(255, 99, 132, 1)',
      HUMIDITY: 'rgba(54, 162, 235, 1)',
      WIND: 'rgba(75, 192, 192, 1)',
      PRESSURE: 'rgba(153, 102, 255, 1)'
    }
  },

  // Weather Condition Backgrounds
  WEATHER_BACKGROUNDS: {
    Clear: {
      day: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)'
    },
    Clouds: {
      day: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
      night: 'linear-gradient(135deg, #485563 0%, #29323c 100%)'
    },
    Rain: {
      day: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
      night: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)'
    },
    Drizzle: {
      day: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      night: 'linear-gradient(135deg, #2c5364 0%, #203a43 100%)'
    },
    Thunderstorm: {
      day: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)',
      night: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'
    },
    Snow: {
      day: 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%)'
    },
    Mist: {
      day: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Smoke: {
      day: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Haze: {
      day: 'linear-gradient(135deg, #f3904f 0%, #3b4371 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Dust: {
      day: 'linear-gradient(135deg, #BE93C5 0%, #7BC6CC 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Fog: {
      day: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Sand: {
      day: 'linear-gradient(135deg, #d9a7c7 0%, #fffcdc 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Ash: {
      day: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      night: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    Squall: {
      day: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)',
      night: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'
    },
    Tornado: {
      day: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
      night: 'linear-gradient(135deg, #000000 0%, #434343 100%)'
    }
  },

  // Default background (fallback)
  DEFAULT_BACKGROUND: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

  // LocalStorage Keys
  STORAGE_KEYS: {
    THEME: 'weather_app_theme',
    RECENT_SEARCHES: 'weather_app_recent',
    FAVORITES: 'weather_app_favorites',
    CACHE_PREFIX: 'weather_cache_'
  },

  // Error Messages
  ERROR_MESSAGES: {
    CITY_NOT_FOUND: 'City not found. Please check the spelling and try again.',
    NETWORK_ERROR: 'Unable to fetch weather data. Please check your internet connection.',
    API_ERROR: 'An error occurred while fetching weather data. Please try again later.',
    GEOLOCATION_DENIED: 'Location access denied. Please enable location services.',
    GEOLOCATION_UNAVAILABLE: 'Location information is unavailable.',
    GEOLOCATION_TIMEOUT: 'Location request timed out.',
    INVALID_INPUT: 'Please enter a valid city name.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.'
  }
};

// Freeze the config object to prevent modifications
Object.freeze(CONFIG);