import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Search, 
  Building2,
  Sparkles,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { 
  CAMPUS_LANDMARKS,
  IIEST_CAMPUS_PLACES,
  IIEST_CAMPUS_BOUNDS,
  IIEST_MAP_CENTER, 
  IIEST_MAP_ZOOM,
  isInsideCampus,
  clampToCampus
} from '../types';

// Custom Pin for Map Picker
const pickerPinIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 44px; height: 50px; cursor: grab;">
      <div style="width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #6366F1, #4F46E5); border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.9); color: white; font-weight: bold; font-size: 16px;">
        📍
      </div>
      <div style="width: 4px; height: 10px; background: #4F46E5; border-radius: 2px;"></div>
      <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [44, 50],
  iconAnchor: [22, 46],
});

// Minimal Building Dot on Picker Map
function createPickerBuildingDot(color = '#6366F1') {
  return L.divIcon({
    className: 'picker-building-dot',
    html: `
      <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color}; border: 1.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.6); cursor: pointer; transition: transform 0.15s ease;"></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// Major prominent landmarks to show labels for by default
const MAJOR_LANDMARK_IDS = new Set([
  'meditation-center-and-clock-tower-9759',
  'ramanujan-central-library-l5k9',
  'oval-ground-r92f',
  '1000-seater-hostel-mess-oysr',
  'gymnasium-b94f',
  'institute-canteen-o22d',
  'wolfenden-hall-girls-713q',
  '2nd-gate-iiest-773s',
  'academic-offices-753e',
  'department-of-computer-science-and-technology-b79e',
  'department-of-mechanical-engineering-l69a',
  'department-of-civil-engineering-22d7',
  '1st-gate-lake-z87r'
]);

// Event listener for user clicking anywhere on map with strict campus bounding
function LocationPickerEvents({ onPick }) {
  useMapEvents({
    click(e) {
      const [clampedLat, clampedLng] = clampToCampus(e.latlng.lat, e.latlng.lng);
      onPick(Number(clampedLat.toFixed(6)), Number(clampedLng.toFixed(6)));
    },
  });
  return null;
}

function FlyToCoords({ coords }) {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 18.5, { duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export default function MapLocationPickerModal({
  isOpen,
  onClose,
  onConfirmLocation,
  initialLat = 22.555500,
  initialLng = 88.306000,
  initialName = 'IIEST Shibpur Campus'
}) {
  // Ensure initial location is strictly clamped inside campus
  const [initialClampedLat, initialClampedLng] = clampToCampus(initialLat || 22.555500, initialLng || 88.306000);
  
  const [selectedLat, setSelectedLat] = useState(initialClampedLat);
  const [selectedLng, setSelectedLng] = useState(initialClampedLng);
  const [locationName, setLocationName] = useState(initialName || 'IIEST Shibpur Campus');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);

  const categoriesList = [
    { id: 'all', label: 'All' },
    { id: 'academic', label: 'Departments & Labs' },
    { id: 'hostel', label: 'Hostels' },
    { id: 'canteen', label: 'Canteens' },
    { id: 'sports', label: 'Sports' },
  ];

  // Filter 152 places hook MUST be called unconditionally before any early return
  const filteredPlaces = useMemo(() => {
    return IIEST_CAMPUS_PLACES.filter(p => {
      const matchCat = selectedCategory === 'all' || 
        (selectedCategory === 'canteen' && (p.category === 'canteen' || p.category === 'mess' || p.category === 'tea' || p.category === 'food')) ||
        (selectedCategory === 'sports' && (p.category === 'sports' || p.category === 'gym' || p.category === 'green')) ||
        p.category === selectedCategory;

      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.details && p.details.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  if (!isOpen) return null;

  // Handle clicking anywhere on map, snapping to nearest of 152 places if within 70 meters
  const handleMapClick = (rawLat, rawLng) => {
    const [lat, lng] = clampToCampus(rawLat, rawLng);
    setSelectedLat(lat);
    setSelectedLng(lng);

    let closest = null;
    let minDistance = Infinity;

    IIEST_CAMPUS_PLACES.forEach(b => {
      const d = Math.hypot(b.lat - lat, b.lng - lng);
      if (d < minDistance) {
        minDistance = d;
        closest = b;
      }
    });

    if (closest && minDistance < 0.00075) {
      setLocationName(closest.name);
      setSelectedPolygon(closest.polygon || null);
    } else {
      setLocationName(`IIEST Campus Spot (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      setSelectedPolygon(null);
    }
  };

  const handleSelectPlace = (place) => {
    const [lat, lng] = clampToCampus(place.lat, place.lng);
    setSelectedLat(lat);
    setSelectedLng(lng);
    setLocationName(place.name);
    setSelectedPolygon(place.polygon || null);
    setFlyTarget([lat, lng]);
  };

  const handleConfirm = () => {
    const [finalLat, finalLng] = clampToCampus(selectedLat, selectedLng);
    onConfirmLocation({
      name: locationName.trim() || 'IIEST Shibpur Campus',
      lat: Number(finalLat),
      lng: Number(finalLng),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-5xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">Pinpoint Location on IIEST Campus Map</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>152 Surveyed Buildings Overlayed</span>
              </span>
            </div>
            <p className="text-xs text-stone-400">Hover or click any building on the aerial satellite map to auto-identify and snap the pin</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Quick Building Search & Filter */}
          <div className="w-full md:w-80 p-4 border-r border-stone-100 dark:border-stone-800 flex flex-col space-y-3 overflow-y-auto max-h-56 md:max-h-none">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search building, lab, hostel..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Quick Chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-subtle'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Places List */}
            <div className="space-y-1.5 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                <span>Campus Places</span>
                <span>{filteredPlaces.length}</span>
              </div>

              {filteredPlaces.map((b) => {
                const isSelected = selectedLat === b.lat && selectedLng === b.lng;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectPlace(b)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-start space-x-2 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-subtle'
                        : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: b.color || '#6366F1' }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{b.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`}>
                        {b.categoryLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Satellite Map with Building Overlays & Floating Tooltips */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative min-h-[380px]">
              <MapContainer
                center={[selectedLat, selectedLng]}
                zoom={18}
                minZoom={15}
                maxZoom={19}
                maxBounds={IIEST_CAMPUS_BOUNDS}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                {/* Esri World Imagery Satellite Aerial */}
                <TileLayer
                  attribution='&copy; Esri & IIEST Shibpur'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
                <TileLayer
                  attribution='&copy; CartoDB'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                  maxZoom={19}
                />

                <FlyToCoords coords={flyTarget} />
                <LocationPickerEvents onPick={handleMapClick} />

                {/* OVERLAY: ALL 152 SURVEYED BUILDINGS & LABELS ON THE SATELLITE CANVAS */}
                {showOverlays && filteredPlaces.map((place) => {
                  const isMajor = MAJOR_LANDMARK_IDS.has(place.id);
                  const isSelected = selectedLat === place.lat && selectedLng === place.lng;

                  return (
                    <React.Fragment key={place.id}>
                      {/* Building Polygon Boundary */}
                      {place.polygon && (
                        <Polygon
                          positions={place.polygon}
                          pathOptions={{
                            color: isSelected ? '#6366F1' : (place.color || '#6366F1'),
                            fillColor: isSelected ? '#6366F1' : (place.color || '#6366F1'),
                            fillOpacity: isSelected ? 0.45 : 0.22,
                            weight: isSelected ? 2.5 : 1.5,
                          }}
                          eventHandlers={{
                            click: () => handleSelectPlace(place),
                          }}
                        >
                          <Tooltip direction="top" className="custom-clean-map-tooltip">
                            <span className="font-sans font-bold text-[11px] text-white">
                              {place.name} ({place.categoryLabel})
                            </span>
                          </Tooltip>
                        </Polygon>
                      )}

                      {/* Interactive Building Dot with Hover Identification */}
                      <Marker
                        position={[place.lat, place.lng]}
                        icon={createPickerBuildingDot(place.color)}
                        eventHandlers={{
                          click: () => handleSelectPlace(place),
                        }}
                      >
                        <Tooltip
                          permanent={isMajor}
                          direction="top"
                          offset={[0, -8]}
                          className="custom-clean-map-tooltip"
                        >
                          <span className="font-sans font-bold text-[11px] text-white">
                            {place.name}
                          </span>
                        </Tooltip>
                      </Marker>
                    </React.Fragment>
                  );
                })}

                {/* Selected Pinpoint Marker */}
                <Marker
                  position={[selectedLat, selectedLng]}
                  icon={pickerPinIcon}
                />

              </MapContainer>

              {/* Floating Instructions Banner */}
              <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-2 shadow-card-dark pointer-events-none z-[1000]">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Hover or click any building dot to snap & auto-fill its name</span>
              </div>

              {/* Overlay Toggle Button */}
              <div className="absolute top-3 right-3 z-[1000]">
                <button
                  type="button"
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-card-dark border transition-all flex items-center space-x-1.5 ${
                    showOverlays 
                      ? 'bg-stone-900/90 text-white border-stone-700' 
                      : 'bg-white/90 text-stone-800 border-stone-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showOverlays ? 'Hide Building Overlays' : 'Show Building Overlays'}</span>
                </button>
              </div>

            </div>

            {/* Bottom Confirmation Bar */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/90 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="w-full sm:w-auto flex-1">
                <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block mb-1">
                  Selected Spot / Building Name:
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl font-bold hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-glow-indigo flex items-center space-x-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Location</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
