import React, { useState } from 'react';
import { X, Lock, Award, HeartHandshake, Navigation, Compass, MapPin } from 'lucide-react';
import { 
  LOST_FOUND_CATEGORIES, 
  CAMPUS_LANDMARKS, 
  IIEST_CAMPUS_PLACES,
  isInsideCampus,
  clampToCampus
} from '../types';
import Icon from './Icon';
import EdgeStoreUploader from './EdgeStoreUploader';
import MapLocationPickerModal from './MapLocationPickerModal';

const SAMPLE_LF_PHOTOS = [
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'ID Card / Keys', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' },
];

export default function LostFoundModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialType = 'lost',
  currentUser
}) {
  const defaultPlace = CAMPUS_LANDMARKS[0] || { name: 'Meditation Center & Clock Tower', lat: 22.556244, lng: 88.305552 };

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bottles_mugs');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(defaultPlace.name);
  const [lat, setLat] = useState(defaultPlace.lat);
  const [lng, setLng] = useState(defaultPlace.lng);
  const [imageUrl, setImageUrl] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [reward, setReward] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsNote, setGpsNote] = useState('');

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

    const newItem = {
      id: `lf-${Date.now()}`,
      type,
      title: title.trim(),
      category,
      color: color.trim() || undefined,
      brand: brand.trim() || undefined,
      description: description.trim() || 'No details provided.',
      status: 'open',
      locationName: locationName.trim(),
      location: {
        lat: finalLat,
        lng: finalLng,
      },
      imageUrl: imageUrl.trim() || undefined,
      posterId: currentUser?.uid || 'guest',
      posterName: currentUser?.displayName || 'IIEST Member',
      posterAvatar: currentUser?.photoURL,
      posterContact: contactInfo.trim() || currentUser?.email || 'student@iiest.ac.in',
      secretQuestion: type === 'found' ? secretQuestion.trim() : undefined,
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
      timestamp: new Date().toISOString(),
      comments: []
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-white dark:bg-stone-900 z-10">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
              type === 'lost' ? 'bg-pink-50 dark:bg-pink-950/80 text-pink-600 border border-pink-200 dark:border-pink-800/60' : 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 border border-sky-200 dark:border-sky-800/60'
            }`}>
              {type === 'lost' ? '🔍' : '📦'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {type === 'lost' ? 'Report Lost Belonging' : 'Report Found Item'}
              </h2>
              <p className="text-xs text-stone-400">Post item details with campus-bound geotagging</p>
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
            {/* Type Toggle */}
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  type === 'lost'
                    ? 'bg-pink-600 text-white shadow-subtle'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <span>🔍 I Lost An Item</span>
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  type === 'found'
                    ? 'bg-sky-600 text-white shadow-subtle'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <span>📦 I Found An Item</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Item Name / Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Navy Blue HydroFlask with Cat Stickers"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Category Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {LOST_FOUND_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Dark Blue"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Brand / Make
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. HydroFlask, Apple"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Location Picker Section (Strict Campus Bounded) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
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
                  className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  <Navigation className={`w-3.5 h-3.5 text-indigo-500 ${isGettingGps ? 'animate-spin' : ''}`} />
                  <span>{isGettingGps ? 'Fetching GPS...' : 'Use Auto-GPS Fallback'}</span>
                </button>
              </div>

              {gpsNote && (
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
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
                Item Details
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe unique markings, scratches, or specifics..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-normal"
              />
            </div>

            {/* Photo Uploader */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Item Photo
              </label>
              <EdgeStoreUploader
                onUploadSuccess={(url) => setImageUrl(url)}
                onUploadComplete={(url) => setImageUrl(url)}
                onChange={(url) => setImageUrl(url)}
                currentImageUrl={imageUrl}
                category={category}
                samplePresets={SAMPLE_LF_PHOTOS}
              />
            </div>

            {/* Found Ownership Proof Secret Question */}
            {type === 'found' && (
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 space-y-1.5">
                <label className="block text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Verification Question (Protects from False Claimants)</span>
                </label>
                <input
                  type="text"
                  value={secretQuestion}
                  onChange={(e) => setSecretQuestion(e.target.value)}
                  placeholder="e.g. What is the lock screen wallpaper? Or what sticker is on back?"
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-sky-200 dark:border-sky-800 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            )}

            {/* Lost Reward */}
            {type === 'lost' && (
              <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200/80 dark:border-pink-800/60 space-y-1.5">
                <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-600" />
                  <span>Optional Finder Reward / Bounty</span>
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. Treat at Nescafe ☕ or ₹200 UPI"
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-pink-200 dark:border-pink-800 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            )}
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
              className={`px-5 py-2 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                type === 'lost' ? 'bg-pink-600 hover:bg-pink-700 shadow-subtle' : 'bg-sky-600 hover:bg-sky-700 shadow-subtle'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{type === 'lost' ? 'Post Lost Notice' : 'Post Found Item'}</span>
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
