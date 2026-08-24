import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Search, 
  Compass, 
  Building2,
  Sparkles
} from 'lucide-react';
import { 
  IIEST_CAMPUS_BUILDINGS, 
  IIEST_MAP_CENTER, 
  IIEST_MAP_ZOOM 
} from '../types';

// Custom Pin for Map Picker
const pickerPinIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 44px; height: 50px;">
      <div style="width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #6366F1, #4F46E5); border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.8); color: white; font-weight: bold; font-size: 16px;">
        📍
      </div>
      <div style="width: 4px; height: 10px; background: #4F46E5; border-radius: 2px;"></div>
      <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [44, 50],
  iconAnchor: [22, 46],
});

// Event listener for user clicking anywhere on map
function LocationPickerEvents({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    },
  });
  return null;
}

function FlyToCoords({ coords }) {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 18, { duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export default function MapLocationPickerModal({
  isOpen,
  onClose,
  onConfirmLocation,
  initialLat = 22.5558,
  initialLng = 88.3075,
  initialName = 'Main Academic Building & Clock Tower'
}) {
  const [selectedLat, setSelectedLat] = useState(initialLat || 22.5558);
  const [selectedLng, setSelectedLng] = useState(initialLng || 88.3075);
  const [locationName, setLocationName] = useState(initialName || 'Main Academic Building');
  const [searchTerm, setSearchTerm] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);

  if (!isOpen) return null;

  // Find nearest building if clicked
  const handleMapClick = (lat, lng) => {
    setSelectedLat(lat);
    setSelectedLng(lng);

    // Calculate nearest building
    let closestBuilding = null;
    let minDistance = Infinity;

    IIEST_CAMPUS_BUILDINGS.forEach(b => {
      const d = Math.hypot(b.center[0] - lat, b.center[1] - lng);
      if (d < minDistance) {
        minDistance = d;
        closestBuilding = b;
      }
    });

    if (closestBuilding && minDistance < 0.001) {
      setLocationName(`Near ${closestBuilding.name}`);
    } else {
      setLocationName(`IIEST Campus (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  const handleSelectBuilding = (building) => {
    setSelectedLat(building.center[0]);
    setSelectedLng(building.center[1]);
    setLocationName(building.name);
    setFlyTarget(building.center);
  };

  const handleConfirm = () => {
    onConfirmLocation({
      name: locationName.trim() || 'IIEST Campus',
      lat: Number(selectedLat),
      lng: Number(selectedLng),
    });
    onClose();
  };

  const filteredBuildings = IIEST_CAMPUS_BUILDINGS.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-4xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">Pinpoint Location on IIEST Map</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                Satellite Aerial Mode
              </span>
            </div>
            <p className="text-xs text-stone-400">Click anywhere on campus or tap a building to place the pin</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two Columns (Buildings List + Map) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Quick Building Select */}
          <div className="w-full md:w-72 p-4 border-r border-stone-100 dark:border-stone-800 flex flex-col space-y-3 overflow-y-auto max-h-56 md:max-h-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search IIEST building..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                IIEST Campus Landmarks
              </span>

              {filteredBuildings.map((b) => {
                const isSelected = selectedLat === b.center[0] && selectedLng === b.center[1];
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBuilding(b)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-start space-x-2 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-subtle'
                        : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{b.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`}>
                        {b.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative min-h-[340px]">
              <MapContainer
                center={[selectedLat, selectedLng]}
                zoom={18}
                maxZoom={19}
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

                {/* Building Polygons */}
                {IIEST_CAMPUS_BUILDINGS.map(b => (
                  <Polygon
                    key={b.id}
                    positions={b.polygonExact}
                    pathOptions={{
                      color: b.strokeColor,
                      fillColor: b.color,
                      fillOpacity: 0.25,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => handleSelectBuilding(b),
                    }}
                  />
                ))}

                {/* Selected Marker */}
                <Marker
                  position={[selectedLat, selectedLng]}
                  icon={pickerPinIcon}
                />

              </MapContainer>

              {/* Floating Instruction */}
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-card-dark pointer-events-none z-[1000]">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Click anywhere on map to reposition pin</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/90 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="w-full sm:w-auto flex-1">
                <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block mb-1">
                  Selected Landmark / Spot Name:
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white font-semibold text-xs"
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
                  <span>Use This Location</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
