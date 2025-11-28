/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format temperature
 */
export function formatTemp(temp) {
  return `${Math.round(temp)}°`;
}

/**
 * Get weather emoji
 */
export function getWeatherEmoji(weatherMain) {
  const emojis = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️'
  };
  return emojis[weatherMain] || '🌤️';
}

