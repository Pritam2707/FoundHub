import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Flame, 
  Navigation, 
  ExternalLink,
  Layers,
  Compass,
  Satellite,
  Building2,
  AlertTriangle,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { 
  CAMPUS_LANDMARKS, 
  IIEST_CAMPUS_BUILDINGS, 
  IIEST_MAP_CENTER, 
  IIEST_MAP_ZOOM, 
  IIEST_WIKI_MAP_URL 
} from '../types';

// Custom Building Landmark Pin Icon
function createLandmarkPinIcon(name, code, emoji, color) {
  return L.divIcon({
    className: 'custom-landmark-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate3d(0,0,0);">
        <div style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(6px); border: 1.5px solid ${color}; color: #FFFFFF; padding: 2px 7px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 4px;">
          <span>${emoji || '📍'}</span>
          <span>${name}</span>
          <span style="background: ${color}; color: #0F172A; font-size: 9px; font-weight: 800; padding: 0.5px 3.5px; border-radius: 4px;">${code}</span>
        </div>
      </div>
    `,
    iconSize: [130, 24],
    iconAnchor: [65, 12],
    popupAnchor: [0, -14],
  });
}

// Custom Satellite Civic & Lost Pins
function createSatelliteCivicIcon(category, isResolved, urgency) {
  const isUrgent = urgency >= 30;
  const bg = isResolved 
    ? 'linear-gradient(135deg, #10B981, #059669)' 
    : isUrgent 
    ? 'linear-gradient(135deg, #F97316, #EA580C)' 
    : 'linear-gradient(135deg, #F59E0B, #D97706)';
  
  const shadowColor = isResolved ? 'rgba(16, 185, 129, 0.6)' : isUrgent ? 'rgba(249, 115, 22, 0.7)' : 'rgba(245, 158, 11, 0.6)';
  const emoji = category === 'pothole' ? '🕳️' : category === 'streetlight' ? '💡' : category === 'water_leak' ? '💧' : '⚠️';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
        ${isUrgent && !isResolved ? `
          <div style="position: absolute; inset: -4px; border-radius: 12px; background: rgba(249, 115, 22, 0.5); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        ` : ''}
        <div style="width: 32px; height: 32px; border-radius: 10px; background: ${bg}; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px ${shadowColor}; font-size: 15px; cursor: pointer; transform: translateZ(0); transition: transform 0.15s ease;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}

function createSatelliteLostFoundIcon(type, isReunited) {
  const isLost = type === 'lost';
  const bg = isReunited 
    ? 'linear-gradient(135deg, #10B981, #059669)' 
    : isLost 
    ? 'linear-gradient(135deg, #EC4899, #DB2777)' 
    : 'linear-gradient(135deg, #0EA5E9, #0284C7)';
  
  const shadowColor = isReunited ? 'rgba(16, 185, 129, 0.6)' : isLost ? 'rgba(236, 72, 153, 0.6)' : 'rgba(14, 165, 233, 0.6)';
  const emoji = isReunited ? '🎉' : isLost ? '🔍' : '📦';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="width: 30px; height: 30px; border-radius: 10px; background: ${bg}; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px ${shadowColor}; font-size: 14px; cursor: pointer;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function MapFlyTo({ targetCoords }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 18, { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
}

export default function InteractiveMap({ 
  civicIssues, 
  lostFoundItems, 
  onSelectCivicIssue, 
  onSelectLostFound,
  isDark 
}) {
  const [mapEngine, setMapEngine] = useState('pins'); // 'pins' (Satellite with custom pins) or 'iiest_wiki' (Embedded wiki)
  const [showCivic, setShowCivic] = useState(true);
  const [showLost, setShowLost] = useState(true);
  const [showFound, setShowFound] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [flyCoords, setFlyCoords] = useState(null);

  const activeCivicCount = civicIssues.length;
  const activeLostCount = lostFoundItems.filter(i => i.type === 'lost').length;
  const activeFoundCount = lostFoundItems.filter(i => i.type === 'found').length;

  return (
    <div className="space-y-4 pb-16">
      
      {/* Top Header & Engine Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              IIEST Shibpur Live Campus Map
            </h1>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{civicIssues.length + lostFoundItems.length} Live Pins Plotted</span>
            </span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-0.5">
            Geotagged infrastructure hazards, potholes, and lost possessions plotted directly over IIEST Shibpur.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-medium border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setMapEngine('pins')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                mapEngine === 'pins' 
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-sky-500" />
              <span>Interactive Satellite Pins</span>
            </button>

            <button
              onClick={() => setMapEngine('iiest_wiki')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                mapEngine === 'iiest_wiki' 
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>maps.iiest.wiki</span>
            </button>
          </div>

          <a
            href={IIEST_WIKI_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-subtle"
            title="Open maps.iiest.wiki in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {mapEngine === 'pins' ? (
        <>
          {/* Controls: Pin Category Toggles & Landmark Jump Shortcuts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Layer Filter Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <button
                onClick={() => setShowCivic(!showCivic)}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center space-x-1.5 ${
                  showCivic 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-glow-amber' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Civic Hazards ({activeCivicCount})</span>
              </button>

              <button
                onClick={() => setShowLost(!showLost)}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center space-x-1.5 ${
                  showLost 
                    ? 'bg-pink-600 text-white border-pink-700 shadow-subtle' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Lost Items ({activeLostCount})</span>
              </button>

              <button
                onClick={() => setShowFound(!showFound)}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center space-x-1.5 ${
                  showFound 
                    ? 'bg-sky-600 text-white border-sky-700 shadow-subtle' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span>📦 Found ({activeFoundCount})</span>
              </button>

              <button
                onClick={() => setShowLandmarks(!showLandmarks)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
                  showLandmarks
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-transparent shadow-subtle'
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Landmarks ({IIEST_CAMPUS_BUILDINGS.length})</span>
              </button>
            </div>

            {/* Landmark Quick Jump Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <span className="text-stone-400 font-bold text-[11px] shrink-0">Fly to:</span>
              {IIEST_CAMPUS_BUILDINGS.slice(0, 6).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setFlyCoords(b.center)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all flex items-center space-x-1 shadow-subtle font-medium"
                >
                  <span>{b.emoji}</span>
                  <span>{b.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leaflet Satellite Map Container with all pins plotted */}
          <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-card-dark relative">
            <MapContainer
              center={IIEST_MAP_CENTER}
              zoom={IIEST_MAP_ZOOM}
              maxZoom={19}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              {/* Esri World Imagery - High-Resolution Aerial Satellite */}
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, IIEST Shibpur'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              
              {/* CartoDB Road & Building Labels */}
              <TileLayer
                attribution='&copy; CartoDB & OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />

              <MapFlyTo targetCoords={flyCoords} />

              {/* Campus Landmark Building Pins */}
              {showLandmarks && IIEST_CAMPUS_BUILDINGS.map((building) => {
                const labelIcon = createLandmarkPinIcon(building.shortName, building.code, building.emoji, building.color);

                return (
                  <Marker
                    key={building.id}
                    position={building.center}
                    icon={labelIcon}
                  >
                    <Popup>
                      <div className="p-3 text-stone-900 dark:text-white text-xs font-sans space-y-1.5 max-w-xs bg-white dark:bg-stone-900 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                            {building.category}
                          </span>
                          <span className="font-mono text-stone-400 font-bold">{building.code}</span>
                        </div>
                        
                        <h4 className="font-bold text-sm leading-snug">{building.name}</h4>
                        <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">{building.description}</p>
                        
                        <div className="pt-1 text-[11px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
                          📍 {building.center[0].toFixed(4)}° N, {building.center[1].toFixed(4)}° E
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* User Civic Hazard Pins */}
              {showCivic && civicIssues.map((issue) => {
                if (!issue.location?.lat || !issue.location?.lng) return null;
                const icon = createSatelliteCivicIcon(issue.category, issue.status === 'resolved', issue.urgencyUpvotes);

                return (
                  <Marker
                    key={issue.id}
                    position={[issue.location.lat, issue.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-3.5 max-w-xs space-y-2 text-stone-900 font-sans text-xs bg-white dark:bg-stone-900 dark:text-white rounded-2xl">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            {issue.category.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-stone-500 dark:text-stone-400 capitalize">
                            {issue.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs leading-snug text-stone-900 dark:text-white">
                          {issue.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-0.5">
                            <Flame className="w-3 h-3 fill-current" />
                            <span>{issue.urgencyUpvotes} Votes</span>
                          </span>
                          <span className="truncate max-w-[140px]">📍 {issue.location?.name}</span>
                        </div>

                        <button
                          onClick={() => onSelectCivicIssue(issue)}
                          className="w-full mt-1.5 py-1.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-center hover:opacity-90 transition-all shadow-subtle"
                        >
                          View Issue Details ➔
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* User Lost & Found Pins */}
              {lostFoundItems.map((item) => {
                if (!item.location?.lat || !item.location?.lng) return null;
                if (item.type === 'lost' && !showLost) return null;
                if (item.type === 'found' && !showFound) return null;

                const icon = createSatelliteLostFoundIcon(item.type, item.status === 'reunited');

                return (
                  <Marker
                    key={item.id}
                    position={[item.location.lat, item.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-3.5 max-w-xs space-y-2 text-stone-900 font-sans text-xs bg-white dark:bg-stone-900 dark:text-white rounded-2xl">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            item.status === 'reunited' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            item.type === 'lost' ? 'bg-pink-50 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300' :
                            'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                          }`}>
                            {item.status === 'reunited' ? 'REUNITED 🎉' : item.type.toUpperCase()}
                          </span>
                          <span className="capitalize text-stone-500 dark:text-stone-400">{item.category}</span>
                        </div>

                        <h4 className="font-bold text-xs leading-snug text-stone-900 dark:text-white">
                          {item.title}
                        </h4>

                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          📍 {item.locationName}
                        </div>

                        <button
                          onClick={() => onSelectLostFound(item)}
                          className="w-full mt-1.5 py-1.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-center hover:opacity-90 transition-all shadow-subtle"
                        >
                          Inspect Item ➔
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            </MapContainer>
          </div>
        </>
      ) : (
        /* maps.iiest.wiki Live Web Frame */
        <div className="w-full h-[640px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-card-dark bg-stone-950 relative">
          <iframe
            src={IIEST_WIKI_MAP_URL}
            title="IIEST Shibpur Campus Map (maps.iiest.wiki)"
            className="w-full h-full border-0"
            allow="geolocation"
          />
        </div>
      )}

    </div>
  );
}
