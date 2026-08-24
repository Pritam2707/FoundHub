import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Flame, 
  Navigation, 
  ArrowRight,
  ExternalLink,
  Layers,
  Compass
} from 'lucide-react';
import { CAMPUS_LANDMARKS, IIEST_MAP_CENTER, IIEST_MAP_ZOOM, IIEST_WIKI_MAP_URL } from '../types';

// Custom Minimal Map Markers
function createMinimalCivicIcon(category, isResolved, urgency) {
  const isUrgent = urgency >= 30;
  const emoji = category === 'pothole' ? '🕳️' : category === 'streetlight' ? '💡' : category === 'water_leak' ? '💧' : '⚠️';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="width: 28px; height: 28px; border-radius: 8px; background: ${isResolved ? '#ECFDF5' : isUrgent ? '#FFFBEB' : '#FFFFFF'}; border: 1.5px solid ${isResolved ? '#10B981' : isUrgent ? '#F59E0B' : '#E4E4E7'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 14px; cursor: pointer;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function createMinimalLostFoundIcon(type, isReunited) {
  const emoji = isReunited ? '✅' : type === 'lost' ? '🔍' : '📦';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="width: 28px; height: 28px; border-radius: 8px; background: ${isReunited ? '#ECFDF5' : '#FFFFFF'}; border: 1.5px solid ${isReunited ? '#10B981' : '#E4E4E7'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 14px; cursor: pointer;">
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
  onSelectLostFound 
}) {
  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' or 'iiest_wiki'
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
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              IIEST Shibpur Campus Map
            </h1>
            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              maps.iiest.wiki
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Geotagged infrastructure hazards, potholes, and lost item locations across IIEST Shibpur.
          </p>
        </div>

        {/* View Switcher: Interactive Pins vs maps.iiest.wiki Embed */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mapMode === 'leaflet' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Issue Pins View</span>
            </button>

            <button
              onClick={() => setMapMode('iiest_wiki')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mapMode === 'iiest_wiki' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>maps.iiest.wiki</span>
            </button>
          </div>

          <a
            href={IIEST_WIKI_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-subtle"
            title="Open maps.iiest.wiki in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {mapMode === 'leaflet' ? (
        <>
          {/* Controls: Filter toggles & Landmark jumps */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Filter Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <button
                onClick={() => setShowCivic(!showCivic)}
                className={`px-2.5 py-1 rounded-lg font-medium border transition-all ${
                  showCivic ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                Civic Issues ({civicIssues.length})
              </button>
              <button
                onClick={() => setShowLost(!showLost)}
                className={`px-2.5 py-1 rounded-lg font-medium border transition-all ${
                  showLost ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                Lost ({lostFoundItems.filter(i => i.type === 'lost').length})
              </button>
              <button
                onClick={() => setShowFound(!showFound)}
                className={`px-2.5 py-1 rounded-lg font-medium border transition-all ${
                  showFound ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                Found ({lostFoundItems.filter(i => i.type === 'found').length})
              </button>
            </div>

            {/* Landmark Jump Shortcuts */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <span className="text-stone-400 font-semibold text-[11px] shrink-0">Jump to:</span>
              {CAMPUS_LANDMARKS.slice(0, 6).map((lm) => (
                <button
                  key={lm.name}
                  onClick={() => setFlyCoords([lm.lat, lm.lng])}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-all flex items-center space-x-1"
                >
                  <Navigation className="w-2.5 h-2.5 text-stone-400" />
                  <span>{lm.name.split('(')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leaflet Map with IIEST Coordinates */}
          <div className="w-full h-[540px] rounded-2xl overflow-hidden border border-stone-200 shadow-card relative">
            <MapContainer
              center={IIEST_MAP_CENTER}
              zoom={IIEST_MAP_ZOOM}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://maps.iiest.wiki">maps.iiest.wiki</a> & CartoDB'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              <MapFlyTo targetCoords={flyCoords} />

              {/* Civic Issues */}
              {showCivic && civicIssues.map((issue) => {
                if (!issue.location?.lat || !issue.location?.lng) return null;
                const icon = createMinimalCivicIcon(issue.category, issue.status === 'resolved', issue.urgencyUpvotes);

                return (
                  <Marker
                    key={issue.id}
                    position={[issue.location.lat, issue.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-3 max-w-xs space-y-1.5 text-stone-900 font-sans text-xs">
                        <div className="flex items-center justify-between text-[10px] text-stone-500">
                          <span className="font-semibold capitalize">{issue.category.replace('_', ' ')}</span>
                          <span className="capitalize">{issue.status}</span>
                        </div>

                        <h4 className="font-bold text-xs leading-snug">{issue.title}</h4>

                        <div className="text-[11px] text-stone-500">
                          📍 {issue.location?.name}
                        </div>

                        <button
                          onClick={() => onSelectCivicIssue(issue)}
                          className="w-full mt-1 py-1 bg-stone-900 text-white rounded-lg font-semibold text-center"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Lost & Found */}
              {lostFoundItems.map((item) => {
                if (!item.location?.lat || !item.location?.lng) return null;
                if (item.type === 'lost' && !showLost) return null;
                if (item.type === 'found' && !showFound) return null;

                const icon = createMinimalLostFoundIcon(item.type, item.status === 'reunited');

                return (
                  <Marker
                    key={item.id}
                    position={[item.location.lat, item.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-3 max-w-xs space-y-1.5 text-stone-900 font-sans text-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold uppercase text-stone-600">{item.type}</span>
                          <span className="capitalize text-stone-500">{item.category}</span>
                        </div>

                        <h4 className="font-bold text-xs leading-snug">{item.title}</h4>

                        <div className="text-[11px] text-stone-500">
                          📍 {item.locationName}
                        </div>

                        <button
                          onClick={() => onSelectLostFound(item)}
                          className="w-full mt-1 py-1 bg-stone-900 text-white rounded-lg font-semibold text-center"
                        >
                          View Item
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
        /* maps.iiest.wiki Live Embedded Frame */
        <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-stone-200 shadow-card bg-stone-950 relative">
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
