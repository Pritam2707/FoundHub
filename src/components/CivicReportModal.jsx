import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Navigation, 
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { CIVIC_CATEGORIES, CAMPUS_LANDMARKS } from '../types';
import { findNearbyCivicDuplicates } from '../services/matchingEngine';
import Icon from './Icon';
import EdgeStoreUploader from './EdgeStoreUploader';

// Sample pastel photos users can click to quickly attach
const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Broken Bench', url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80' },
];

export default function CivicReportModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  existingIssues,
  onUpvoteAndClose
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [severity, setSeverity] = useState(3);
  const [locationName, setLocationName] = useState(CAMPUS_LANDMARKS[0].name);
  const [lat, setLat] = useState(CAMPUS_LANDMARKS[0].lat);
  const [lng, setLng] = useState(CAMPUS_LANDMARKS[0].lng);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);

  // Check for nearby duplicates
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);

  useEffect(() => {
    if (lat && lng) {
      const duplicates = findNearbyCivicDuplicates(lat, lng, category, existingIssues, 35);
      setNearbyDuplicates(duplicates);
      // Reset ignore flag if coordinates change
      setIgnoreDuplicate(false);
    }
  }, [lat, lng, category, existingIssues]);

  if (!isOpen) return null;

  const handleLandmarkSelect = (landmarkName) => {
    const found = CAMPUS_LANDMARKS.find(l => l.name === landmarkName);
    if (found) {
      setLocationName(found.name);
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleAutoGPS = () => {
    setIsGettingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(Number(position.coords.latitude.toFixed(5)));
          setLng(Number(position.coords.longitude.toFixed(5)));
          setLocationName('Current GPS Coordinates');
          setIsGettingGps(false);
        },
        () => {
          // Fallback to random slight offset near campus center
          const offsetLat = 28.5450 + (Math.random() - 0.5) * 0.002;
          const offsetLng = 77.1925 + (Math.random() - 0.5) * 0.002;
          setLat(Number(offsetLat.toFixed(5)));
          setLng(Number(offsetLng.toFixed(5)));
          setLocationName('Simulated GPS Location');
          setIsGettingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsGettingGps(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

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
        lat: Number(lat),
        lng: Number(lng),
      },
      imageUrl: customPhotoInput.trim() || imageUrl,
      reporterName: 'You (Campus Citizen)',
      reporterRole: 'Student / Resident',
      reportedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'reported',
          timestamp: new Date().toISOString(),
          note: 'Issue submitted via CivicBloom mobile portal',
        }
      ],
      comments: []
    };

    onSubmit(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl rounded-3xl border border-stone-200/80 shadow-soft-lg overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-pastel-peach-light text-pastel-peach-dark flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-brand-dark">Report a Civic Issue / Hazard</h2>
              <p className="text-xs text-stone-500">Potholes, lighting, water leaks, or damaged infrastructure</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Issue Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CIVIC_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-pastel-peach-light border-pastel-peach-border text-pastel-peach-dark font-semibold shadow-soft-sm'
                        : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon name={cat.icon} className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-pastel-peach-dark' : 'text-stone-400'}`} />
                    <span className="text-xs line-clamp-1 leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Issue Title / Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole on pathway between Library & Quad"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          {/* Location & GPS Geotag */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Location & Geotag
              </label>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isGettingGps}
                className="inline-flex items-center space-x-1.5 text-xs text-brand-primary hover:text-brand-primaryHover font-semibold bg-brand-primaryLight px-2.5 py-1 rounded-xl transition-all"
              >
                <Navigation className={`w-3 h-3 ${isGettingGps ? 'animate-spin' : ''}`} />
                <span>{isGettingGps ? 'Detecting GPS...' : '📍 Auto GPS Geotag'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Campus Landmark</label>
                <select
                  value={locationName}
                  onChange={(e) => handleLandmarkSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  {CAMPUS_LANDMARKS.map(lm => (
                    <option key={lm.name} value={lm.name}>
                      {lm.name} ({lm.area})
                    </option>
                  ))}
                  <option value="Custom Location">Other / Custom Point</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Specific Details / Notes</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near tree #4, next to cycling stand"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-stone-400 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
            </div>
          </div>

          {/* DUPLICATE DETECTION PROMPT BANNER */}
          {nearbyDuplicates.length > 0 && !ignoreDuplicate && (
            <div className="p-4 rounded-2xl bg-pastel-butter-light/90 border-2 border-pastel-butter-border text-brand-dark animate-fade-in space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-pastel-butter flex items-center justify-center shrink-0 mt-0.5 text-pastel-butter-dark font-bold text-xs">
                  ⚠️
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-stone-900">
                    Possible Duplicate Detected Nearby ({nearbyDuplicates[0].distanceMeters}m away)!
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    An open report <strong>"{nearbyDuplicates[0].issue.title}"</strong> was already logged near this spot.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-pastel-butter-border flex items-center justify-between text-xs">
                <div className="truncate mr-2">
                  <span className="font-semibold text-stone-800">{nearbyDuplicates[0].issue.title}</span>
                  <span className="text-stone-500 block text-[11px]">
                    Current urgency: {nearbyDuplicates[0].issue.urgencyUpvotes} upvotes · Status: {nearbyDuplicates[0].issue.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onUpvoteAndClose(nearbyDuplicates[0].issue.id)}
                  className="shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-pastel-peach text-pastel-peach-dark font-bold text-xs hover:bg-pastel-peach-border transition-all shadow-soft-sm"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Upvote This Instead</span>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIgnoreDuplicate(true)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                >
                  No, my report is a different issue (Continue)
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Description & Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, any hazard to pedestrians/vehicles, or time since it appeared..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          {/* Initial Severity Rating */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Initial Severity Level: {severity}/5
              </label>
              <span className="text-xs font-medium text-stone-500">
                {severity === 5 ? '🚨 Extreme Hazard' : severity >= 4 ? '⚠️ High Impact' : severity >= 3 ? '⚡ Moderate' : '🌱 Minor'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full accent-brand-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 px-1 mt-1">
              <span>1 - Cosmetic</span>
              <span>3 - Inconvenience</span>
              <span>5 - Dangerous Hazard</span>
            </div>
          </div>

          {/* Photo Attachment via EdgeStore */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Attach Photo Proof (EdgeStore Cloud Bucket)
            </label>
            
            <EdgeStoreUploader
              initialUrl={imageUrl}
              onUploadComplete={(url) => {
                if (url) {
                  setImageUrl(url);
                  setCustomPhotoInput('');
                }
              }}
            />

            {/* Quick sample pickers */}
            <div className="mt-2.5">
              <span className="text-[11px] text-stone-400 block mb-1.5">Or choose sample test photo:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_PHOTOS.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setImageUrl(sp.url); setCustomPhotoInput(''); }}
                    className={`relative shrink-0 w-16 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      imageUrl === sp.url && !customPhotoInput
                        ? 'border-brand-primary shadow-soft-sm'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={sp.url} alt={sp.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-stone-900/60 text-white text-[9px] text-center truncate py-0.5">
                      {sp.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover shadow-soft-md transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Civic Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
