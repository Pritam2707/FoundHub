import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Flame, 
  Sparkles, 
  Layers, 
  Filter, 
  Navigation, 
  AlertTriangle, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { CAMPUS_LANDMARKS, CIVIC_CATEGORIES, LOST_FOUND_CATEGORIES } from '../types';

// Custom Marker Creators for Leaflet
function createCustomCivicIcon(category, urgency, isResolved) {
  const isUrgent = urgency >= 30;
  const bg = isResolved ? '#A7F3D0' : isUrgent ? '#FED7AA' : '#FEF08A';
  const border = isResolved ? '#059669' : isUrgent ? '#EA580C' : '#CA8A04';
  const emoji = category === 'pothole' ? '🕳️' : category === 'streetlight' ? '💡' : category === 'water_leak' ? '💧' : '⚠️';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        ${isUrgent && !isResolved ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(234, 88, 12, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>` : ''}
        <div style="width: 32px; height: 32px; border-radius: 12px; background: ${bg}; border: 2px solid ${border}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 15px; cursor: pointer; transition: transform 0.2s;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function createCustomLostFoundIcon(type, isReunited) {
  const isLost = type === 'lost';
  const bg = isReunited ? '#A7F3D0' : isLost ? '#FED7AA' : '#BAE6FD';
  const border = isReunited ? '#059669' : isLost ? '#EA580C' : '#0284C7';
  const emoji = isReunited ? '🎉' : isLost ? '🔍' : '📦';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <div style="width: 32px; height: 32px; border-radius: 12px; background: ${bg}; border: 2px solid ${border}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 15px; cursor: pointer;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

// Controller component to smoothly fly to coordinates
function MapFlyTo({ targetCoords }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 17, { duration: 1.2 });
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
  const [showCivic, setShowCivic] = useState(true);
  const [showLost, setShowLost] = useState(true);
  const [showFound, setShowFound] = useState(true);
  const [flyCoords, setFlyCoords] = useState(null);

  const initialCenter = [28.5450, 77.1925];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Map Header & Controls */}
      <div className="bg-surface p-4 sm:p-5 rounded-3xl border border-stone-200/70 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-mint-light text-pastel-mint-dark flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">Live Geotagged Campus Map</h2>
              <p className="text-xs text-stone-500">Visualizing potholes, hazards, and lost & found spots in real time</p>
            </div>
          </div>
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setShowCivic(!showCivic)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
              showCivic 
                ? 'bg-pastel-peach-light text-pastel-peach-dark border-pastel-peach-border shadow-soft-sm' 
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            <span>⚠️ Civic Issues ({civicIssues.length})</span>
          </button>

          <button
            onClick={() => setShowLost(!showLost)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
              showLost 
                ? 'bg-pastel-peach-light text-pastel-peach-dark border-pastel-peach-border shadow-soft-sm' 
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            <span>🔍 Lost Items ({lostFoundItems.filter(i => i.type === 'lost').length})</span>
          </button>

          <button
            onClick={() => setShowFound(!showFound)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center space-x-1.5 ${
              showFound 
                ? 'bg-pastel-sky-light text-pastel-sky-dark border-pastel-sky-border shadow-soft-sm' 
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            <span>📦 Found Items ({lostFoundItems.filter(i => i.type === 'found').length})</span>
          </button>
        </div>
      </div>

      {/* Quick Jump Landmark Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-stone-400 font-semibold uppercase text-[10px] pl-1 shrink-0">Jump To:</span>
        {CAMPUS_LANDMARKS.map((lm) => (
          <button
            key={lm.name}
            onClick={() => setFlyCoords([lm.lat, lm.lng])}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-surface hover:bg-stone-50 text-stone-600 font-medium border border-stone-200/80 transition-all flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-stone-400" />
            <span>{lm.name}</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="w-full h-[580px] rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft-md relative">
        <MapContainer
          center={initialCenter}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* CartoDB Positron - Beautiful, clean pastel minimalist tile map */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapFlyTo targetCoords={flyCoords} />

          {/* Civic Issue Pins */}
          {showCivic && civicIssues.map((issue) => {
            if (!issue.location?.lat || !issue.location?.lng) return null;
            const icon = createCustomCivicIcon(issue.category, issue.urgencyUpvotes, issue.status === 'resolved');

            return (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-3.5 max-w-xs space-y-2 text-stone-900 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pastel-peach-light text-pastel-peach-dark uppercase">
                        {issue.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 capitalize">
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-snug">
                      {issue.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <span className="flex items-center space-x-1 text-pastel-peach-dark font-bold">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{issue.urgencyUpvotes} Upvotes</span>
                      </span>
                      <span>{issue.location?.name}</span>
                    </div>

                    <button
                      onClick={() => onSelectCivicIssue(issue)}
                      className="w-full mt-1.5 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primaryHover transition-all text-center"
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

            const icon = createCustomLostFoundIcon(item.type, item.status === 'reunited');

            return (
              <Marker
                key={item.id}
                position={[item.location.lat, item.location.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-3.5 max-w-xs space-y-2 text-stone-900 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'reunited'
                          ? 'bg-pastel-mint text-pastel-mint-dark'
                          : item.type === 'lost'
                          ? 'bg-pastel-peach text-pastel-peach-dark'
                          : 'bg-pastel-sky text-pastel-sky-dark'
                      }`}>
                        {item.status === 'reunited' ? 'REUNITED 🎉' : item.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-[11px] text-stone-500 truncate">
                      📍 {item.locationName}
                    </div>

                    <button
                      onClick={() => onSelectLostFound(item)}
                      className="w-full mt-1.5 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primaryHover transition-all text-center"
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

    </div>
  );
}
