export function leafletHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height:100%; margin:0; padding:0 }
  .leaflet-control-attribution { font-size:10px; background:rgba(255,255,255,.7) }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const rn = window.ReactNativeWebView;
  let map, busMarker, busTimer;
  function init(data){
    if (map) { map.remove(); map = null; }
    map = L.map('map').setView(data.mapCenter, data.mapZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    const startIcon = L.divIcon({ html: '<div style="width:16px;height:16px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>' });
    const endIcon = L.divIcon({ html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#E74C3C" stroke="white" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' });
    const busIcon = L.divIcon({ html: '<div style="padding:4px;background:#fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>' });
    L.marker(data.startCoords, { icon: startIcon }).addTo(map);
    L.marker(data.endCoords, { icon: endIcon }).addTo(map);
    L.polyline(data.path, { color: '#3498DB', dashArray: '8,8', weight: 3 }).addTo(map);
    if (busTimer) clearInterval(busTimer);
    let i = 0;
    busMarker = L.marker(data.path[0], { icon: busIcon }).addTo(map);
    busTimer = setInterval(() => { i = (i + 1) % data.path.length; busMarker.setLatLng(data.path[i]); }, 1500);
  }
  window.addEventListener('message', (e)=>{ try { const d = JSON.parse(e.data); init(d); } catch(err){} });
</script>
</body>
</html>`;
}
