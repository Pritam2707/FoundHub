import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Flame,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { 
  CIVIC_CATEGORIES, 
  CAMPUS_LANDMARKS, 
  IIEST_CAMPUS_PLACES,
  isInsideCampus,
  clampToCampus
} from '../types';
import { findNearbyCivicDuplicates } from '../services/matchingEngine';
import Icon from './Icon';
import EdgeStoreUploader from './EdgeStoreUploader';
import MapLocationPickerModal from './MapLocationPickerModal';

const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80' },
];

export default function CivicReportModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  existingIssues,
  onUpvoteAndClose
}) {
  const defaultPlace = CAMPUS_LANDMARKS[0] || { name: 'Meditation Center & Clock Tower', lat: 22.556244, lng: 88.305552 };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [severity, setSeverity] = useState(3);
  const [locationName, setLocationName] = useState(defaultPlace.name);
  const [lat, setLat] = useState(defaultPlace.lat);
  const [lng, setLng] = useState(defaultPlace.lng);
  const [imageUrl, setImageUrl] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsNote, setGpsNote] = useState('');
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      const duplicates = findNearbyCivicDuplicates(lat, lng, category, existingIssues, 40);
      setNearbyDuplicates(duplicates);
      setIgnoreDuplicate(false);
    }
  }, [lat, lng, category, existingIssues]);

  if (!isOpen) return null;

  const handleLandmarkSelect = (landmarkName) => {
    const found = IIEST_CAMPUS_PLACES.find(l => l.name === landmarkName);
    if (found) {
      const [cLat, cLng] = clampToCampus(found.lat, found.lng);
      setLocationName(found.name);
      setLat(cLat);
      setLng(cLng);
      setGpsNote('');
    }
  };

  const handleAutoGPS = () => {
    setIsGettingGps(true);
    setGpsNote('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          if (isInsideCampus(userLat, userLng)) {
            setLat(Number(userLat.toFixed(6)));
            setLng(Number(userLng.toFixed(6)));
            setLocationName('Current IIEST Campus Location');
            setGpsNote('📍 Live GPS locked inside campus');
          } else {
            // User is off-campus; clamp to nearest campus spot & launch map picker
            const [cLat, cLng] = clampToCampus(userLat, userLng);
            setLat(Number(cLat.toFixed(6)));
            setLng(Number(cLng.toFixed(6)));
            setLocationName('IIEST Shibpur Campus');
            setGpsNote('⚠️ Remote GPS detected; clamped inside IIEST campus perimeter');
            setIsMapPickerOpen(true);
          }
          setIsGettingGps(false);
        },
        (error) => {
          console.warn('GPS error or rejected, opening map picker:', error);
          setIsGettingGps(false);
          setIsMapPickerOpen(true);
        },
        { timeout: 6000 }
      );
    } else {
      setIsGettingGps(false);
      setIsMapPickerOpen(true);
    }
  };

  const handleConfirmedLocationFromPicker = (loc) => {
    const [cLat, cLng] = clampToCampus(loc.lat, loc.lng);
    setLocationName(loc.name);
    setLat(cLat);
    setLng(cLng);
    setGpsNote('📍 Precision spot selected on aerial map');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const [finalLat, finalLng] = clampToCampus(Number(lat), Number(lng));

    const newIssue = {
      id: `civic-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No additional details provided.',
      category,
      severity: Number(severity),
      status: 'reported',
      urgencyUpvotes: 1,
      userUpvoted: true,
      verifiedCount: 1,
      location: {
        name: locationName,
        lat: finalLat,
        lng: finalLng,
      },
      imageUrl: imageUrl.trim() || undefined,
      reporterName: 'IIEST Community',
      reporterRole: 'Resident',
      reportedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'reported',
          timestamp: new Date().toISOString(),
          note: 'Issue submitted via CivicBloom with campus-bound geotag',
        }
      ],
      comments: []
    };

    onSubmit(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-white dark:bg-stone-900 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/60 font-bold">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">Report Campus Infrastructure Issue</h2>
              <p className="text-xs text-stone-400">Geotag hazards, potholes, or lighting across IIEST Shibpur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            {/* Duplicate Prevention Alert */}
            {nearbyDuplicates.length > 0 && !ignoreDuplicate && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80">
                <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Similar Issue Already Reported Here!</span>
                </div>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1">
                  Someone reported an issue near this spot. Upvoting boosts its urgency without creating duplicates.
                </p>
                <div className="mt-3 space-y-2">
                  {nearbyDuplicates.map(dup => (
                    <div key={dup.id} className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <p className="font-semibold text-xs text-stone-900 dark:text-white truncate">{dup.title}</p>
                        <p className="text-[11px] text-stone-400">📍 {dup.location?.name} · {dup.urgencyUpvotes} Votes</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpvoteAndClose(dup.id)}
                        className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                      >
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>Upvote Instead</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIgnoreDuplicate(true)}
                  className="mt-3 text-xs text-amber-800 dark:text-amber-300 hover:underline font-medium block text-right"
                >
                  Continue submitting new issue anyway →
                </button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Issue Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Streetlamp not working near Clock Tower pathway"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
              />
            </div>

            {/* Category Pills */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CIVIC_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex items-center space-x-2 ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-subtle'
                          : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      <span className="text-xs truncate">{cat.label.split('&')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Picker Section (Strict Campus Bounded) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Campus Location (Strictly Bound)</span>
                </label>

                {/* Pinpoint on Interactive Map Button */}
                <button
                  type="button"
                  onClick={() => setIsMapPickerOpen(true)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pinpoint on Satellite Map ↗</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Landmark Dropdown (152 Surveyed Places) */}
                <select
                  value={locationName}
                  onChange={(e) => handleLandmarkSelect(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {IIEST_CAMPUS_PLACES.slice(0, 50).map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name} ({l.categoryLabel})
                    </option>
                  ))}
                </select>

                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  disabled={isGettingGps}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Navigation className={`w-3.5 h-3.5 text-amber-500 ${isGettingGps ? 'animate-spin' : ''}`} />
                  <span>{isGettingGps ? 'Fetching GPS...' : 'Use Auto-GPS Fallback'}</span>
                </button>
              </div>

              {gpsNote && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  {gpsNote}
                </p>
              )}

              <div className="text-[11px] text-stone-400 flex items-center justify-between font-mono pt-1">
                <span>Coordinates: {Number(lat).toFixed(6)}° N, {Number(lng).toFixed(6)}° E</span>
                <span className="text-emerald-500 font-bold font-sans">✓ Inside IIEST Bounds</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Details & Hazard Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add specifics like depth, exact pole number, or timing of hazard..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-normal"
              />
            </div>

            {/* Photo Uploader (EdgeStore Cloud + Pre-sets) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Attach Photo Proof
              </label>
              <EdgeStoreUploader
                onUploadSuccess={(url) => setImageUrl(url)}
                onUploadComplete={(url) => setImageUrl(url)}
                onChange={(url) => setImageUrl(url)}
                currentImageUrl={imageUrl}
                category={category}
                samplePresets={SAMPLE_PHOTOS}
              />
            </div>

            {/* Severity Slider */}
            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Urgency Level
                </label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  severity >= 4 ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                  severity >= 3 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  Level {severity}/5 · {severity >= 4 ? 'Critical Hazard' : severity >= 3 ? 'Moderate' : 'Low'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/90 backdrop-blur-sm flex items-center justify-end space-x-2 shrink-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-glow-amber flex items-center space-x-1.5 transition-all"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Submit Issue Report</span>
            </button>
          </div>

        </form>

        {/* Satellite Map Location Positioner Modal */}
        <MapLocationPickerModal
          isOpen={isMapPickerOpen}
          onClose={() => setIsMapPickerOpen(false)}
          onConfirmLocation={handleConfirmedLocationFromPicker}
          initialLat={lat}
          initialLng={lng}
          initialName={locationName}
        />

      </div>
    </div>
  );
}
