// Browser Real Geolocation API Helper

export function watchRealLocation(onLocationUpdate, onError) {
  if (!("geolocation" in navigator)) {
    if (onError) onError("Geolocation API not supported by browser.");
    return null;
  }

  const formatCoords = (lat, lng) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
  };

  // Get initial position immediately
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onLocationUpdate({
        lat: pos.coords.latitude.toFixed(5),
        lng: pos.coords.longitude.toFixed(5),
        rawLat: pos.coords.latitude,
        rawLng: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
        formatted: formatCoords(pos.coords.latitude, pos.coords.longitude)
      });
    },
    (err) => {
      if (onError) onError(err.message);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );

  // Watch position for continuous real-time updates
  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      onLocationUpdate({
        lat: pos.coords.latitude.toFixed(5),
        lng: pos.coords.longitude.toFixed(5),
        rawLat: pos.coords.latitude,
        rawLng: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
        formatted: formatCoords(pos.coords.latitude, pos.coords.longitude)
      });
    },
    (err) => {
      if (onError) onError(err.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
