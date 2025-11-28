
/**
 * Save recent search
 */
export function saveRecentSearch(city) {
  let recent = getRecentSearches();
  recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
  recent.unshift(city);
  recent = recent.slice(0, CONFIG.CACHE.MAX_RECENT_SEARCHES);
  localStorage.setItem(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent));
}

/**
 * Get recent searches
 */
export function getRecentSearches() {
  const recent = localStorage.getItem(CONFIG.STORAGE_KEYS.RECENT_SEARCHES);
  return recent ? JSON.parse(recent) : [];
}

/**
 * Toggle favorite city
 */
export function toggleFavorite(city) {
  let favorites = getFavorites();
  const index = favorites.findIndex(c => c.toLowerCase() === city.toLowerCase());
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    if (favorites.length >= CONFIG.CACHE.MAX_FAVORITES) {
      alert(`Maximum ${CONFIG.CACHE.MAX_FAVORITES} favorites allowed`);
      return false;
    }
    favorites.push(city);
  }
  
  localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  return index === -1;
}

/**
 * Get favorite cities
 */
export function getFavorites() {
  const favorites = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Cache weather data
 */
export function cacheWeatherData(city, current, forecast) {
  const cacheKey = CONFIG.STORAGE_KEYS.CACHE_PREFIX + city.toLowerCase();
  const data = {
    current,
    forecast,
    timestamp: Date.now()
  };
  localStorage.setItem(cacheKey, JSON.stringify(data));
}

/**
 * Get cached weather data
 */
export function getCachedWeather(city) {
  const cacheKey = CONFIG.STORAGE_KEYS.CACHE_PREFIX + city.toLowerCase();
  const cached = localStorage.getItem(cacheKey);
  
  if (!cached) return null;
  
  const data = JSON.parse(cached);
  const age = Date.now() - data.timestamp;
  
  if (age > CONFIG.CACHE.EXPIRY_TIME) {
    localStorage.removeItem(cacheKey);
    return null;
  }
  
  return data;
}