import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Flame,
  AlertTriangle
} from 'lucide-react';
import { CIVIC_CATEGORIES, CAMPUS_LANDMARKS } from '../types';
import { findNearbyCivicDuplicates } from '../services/matchingEngine';
import Icon from './Icon';
import EdgeStoreUploader from './EdgeStoreUploader';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [severity, setSeverity] = useState(3);
  const [locationName, setLocationName] = useState(CAMPUS_LANDMARKS[0].name);
  const [lat, setLat] = useState(CAMPUS_LANDMARKS[0].lat);
  const [lng, setLng] = useState(CAMPUS_LANDMARKS[0].lng);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);

  useEffect(() => {
    if (lat && lng) {
      const duplicates = findNearbyCivicDuplicates(lat, lng, category, existingIssues, 35);
      setNearbyDuplicates(duplicates);
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
          setLocationName('Current GPS Position');
          setIsGettingGps(false);
        },
        () => {
          const offsetLat = 22.5552 + (Math.random() - 0.5) * 0.002;
          const offsetLng = 88.3065 + (Math.random() - 0.5) * 0.002;
          setLat(Number(offsetLat.toFixed(5)));
          setLng(Number(offsetLng.toFixed(5)));
          setLocationName('Simulated IIEST GPS');
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
      imageUrl,
      reporterName: 'IIEST Community',
      reporterRole: 'Resident',
      reportedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'reported',
          timestamp: new Date().toISOString(),
          note: 'Issue submitted via CivicBloom',
        }
      ],
      comments: []
    };

    onSubmit(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden animate-fade-in max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">Report Infrastructure Issue</h2>
            <p className="text-xs text-stone-400">Potholes, lighting faults, leaks, or hazards at IIEST</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Category */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">Select Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CIVIC_CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-subtle'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Issue Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole near Clock Tower curve"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Location & GPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 dark:text-stone-300">IIEST Campus Location</label>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isGettingGps}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg"
              >
                <Navigation className={`w-3 h-3 ${isGettingGps ? 'animate-spin' : ''}`} />
                <span>{isGettingGps ? 'Detecting...' : 'Auto GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={locationName}
                onChange={(e) => handleLandmarkSelect(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none"
              >
                {CAMPUS_LANDMARKS.map(lm => (
                  <option key={lm.name} value={lm.name}>
                    {lm.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Specific spot notes..."
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* DUPLICATE WARNING BANNER */}
          {nearbyDuplicates.length > 0 && !ignoreDuplicate && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-stone-900 dark:text-white space-y-2">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    Similar report nearby ({nearbyDuplicates[0].distanceMeters}m away)
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                    "{nearbyDuplicates[0].issue.title}" is already open at this location.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => onUpvoteAndClose(nearbyDuplicates[0].issue.id)}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow-subtle"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Upvote Existing (+1 Priority)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIgnoreDuplicate(true)}
                  className="text-[11px] text-stone-500 dark:text-stone-400 hover:underline"
                >
                  Different issue (Continue)
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hazard and how long it's been present..."
              className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Severity */}
          <div>
            <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
              <span>Severity Level: {severity}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">Photo Attachment</label>
            <EdgeStoreUploader
              initialUrl={imageUrl}
              onUploadComplete={(url) => setImageUrl(url)}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-glow-indigo transition-all"
            >
              Submit Civic Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
