import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap } from 'react-leaflet';
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
  Tag
} from 'lucide-react';
import { 
  CAMPUS_LANDMARKS, 
  IIEST_CAMPUS_BUILDINGS, 
  IIEST_MAP_CENTER, 
  IIEST_MAP_ZOOM, 
  IIEST_WIKI_MAP_URL 
} from '../types';

// Custom Building Floating Label Tag Icon
function createBuildingLabelIcon(name, code, color) {
  return L.divIcon({
    className: 'custom-building-label',
    html: `
      <div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); border: 1.5px solid ${color}; color: #FFFFFF; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 4px; pointer-events: none;">
        <span style="background: ${color}; width: 6px; height: 6px; border-radius: 50%;"></span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [120, 24],
    iconAnchor: [60, 12],
  });
}

// Custom High-Contrast Satellite Markers
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
          <div style="position: absolute; inset: -4px; border-radius: 12px; background: rgba(249, 115, 22, 0.4); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
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
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
        <div style="width: 32px; height: 32px; border-radius: 10px; background: ${bg}; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px ${shadowColor}; font-size: 15px; cursor: pointer;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
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
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite', 'vector', 'iiest_wiki'
  const [showBuildings, setShowBuildings] = useState(true);
  const [showCivic, setShowCivic] = useState(true);
  const [showLost, setShowLost] = useState(true);
  const [showFound, setShowFound] = useState(true);
  const [flyCoords, setFlyCoords] = useState(null);

  return (
    <div className="space-y-4 pb-16">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              IIEST Shibpur Aerial Campus Map
            </h1>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Aerial Overlays Active</span>
            </span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-0.5">
            High-res satellite view with labeled IIEST Shibpur buildings & geotagged reports.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-medium border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mapMode === 'satellite' 
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-semibold' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-sky-500" />
              <span>Satellite Aerial</span>
            </button>

            <button
              onClick={() => setMapMode('vector')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mapMode === 'vector' 
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-semibold' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Vector Streets</span>
            </button>

            <button
              onClick={() => setMapMode('iiest_wiki')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mapMode === 'iiest_wiki' 
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-semibold' 
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

      {mapMode !== 'iiest_wiki' ? (
        <>
          {/* Controls: Building Overlays & Category Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Layer Filter Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              
              {/* Building Overlay Switcher */}
              <button
                onClick={() => setShowBuildings(!showBuildings)}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center space-x-1.5 ${
                  showBuildings
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-glow-indigo'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Building Labels ({IIEST_CAMPUS_BUILDINGS.length})</span>
              </button>

              <button
                onClick={() => setShowCivic(!showCivic)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
                  showCivic 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-glow-amber' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span>⚠️ Civic Issues ({civicIssues.length})</span>
              </button>

              <button
                onClick={() => setShowLost(!showLost)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
                  showLost 
                    ? 'bg-pink-600 text-white border-pink-700 shadow-subtle' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span>🔍 Lost ({lostFoundItems.filter(i => i.type === 'lost').length})</span>
              </button>

              <button
                onClick={() => setShowFound(!showFound)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
                  showFound 
                    ? 'bg-sky-600 text-white border-sky-700 shadow-subtle' 
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span>📦 Found ({lostFoundItems.filter(i => i.type === 'found').length})</span>
              </button>
            </div>

            {/* Landmark Quick Jump Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <span className="text-stone-400 font-semibold text-[11px] shrink-0">Fly to:</span>
              {IIEST_CAMPUS_BUILDINGS.slice(0, 6).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setFlyCoords(b.center)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all flex items-center space-x-1 shadow-subtle"
                >
                  <Navigation className="w-2.5 h-2.5 text-stone-400" />
                  <span>{b.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leaflet Satellite Map Container with Building Overlays */}
          <div className="w-full h-[580px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-card-dark relative">
            <MapContainer
              center={IIEST_MAP_CENTER}
              zoom={IIEST_MAP_ZOOM}
              maxZoom={19}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              {/* High-Resolution Satellite Aerial Layer vs Vector Street Layer */}
              {mapMode === 'satellite' ? (
                <>
                  {/* Esri World Imagery - High Resolution Aerial Satellite */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics, IIEST Shibpur'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  {/* Road & Label Overlay for Aerial */}
                  <TileLayer
                    attribution='&copy; CartoDB & OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                    maxZoom={19}
                  />
                </>
              ) : (
                /* Vector CartoDB Tiles */
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
                  url={isDark 
                    ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  }
                  maxZoom={19}
                />
              )}

              <MapFlyTo targetCoords={flyCoords} />

              {/* CUSTOM IIEST BUILDING POLYGONS & FLOATING LABELS */}
              {showBuildings && IIEST_CAMPUS_BUILDINGS.map((building) => {
                const labelIcon = createBuildingLabelIcon(building.shortName, building.code, building.color);

                return (
                  <React.Fragment key={building.id}>
                    {/* Building Area Boundary */}
                    <Polygon
                      positions={building.polygonExact}
                      pathOptions={{
                        color: building.strokeColor,
                        fillColor: building.color,
                        fillOpacity: 0.28,
                        weight: 2,
                        dashArray: '4, 4',
                      }}
                    >
                      <Popup>
                        <div className="p-2 text-stone-900 dark:text-white text-xs font-sans space-y-1">
                          <span className="font-bold text-[10px] uppercase text-indigo-600 dark:text-indigo-400">
                            {building.category}
                          </span>
                          <h4 className="font-bold text-sm leading-tight">{building.name}</h4>
                          <p className="text-stone-500 dark:text-stone-400 text-xs">{building.description}</p>
                        </div>
                      </Popup>
                    </Polygon>

                    {/* Floating Label Badge */}
                    <Marker
                      position={building.center}
                      icon={labelIcon}
                    />
                  </React.Fragment>
                );
              })}

              {/* Civic Issue Pins */}
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

              {/* Lost & Found Pins */}
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
        <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-card-dark bg-stone-950 relative">
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
