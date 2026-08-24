import React, { useState } from 'react';
import { X, Lock, Award, HeartHandshake } from 'lucide-react';
import { LOST_FOUND_CATEGORIES, CAMPUS_LANDMARKS } from '../types';
import Icon from './Icon';
import EdgeStoreUploader from './EdgeStoreUploader';

const SAMPLE_LF_PHOTOS = [
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'ID Card / Keys', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' },
];

export default function LostFoundModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialType = 'lost' 
}) {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bottles_mugs');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(CAMPUS_LANDMARKS[0].name);
  const [lat, setLat] = useState(CAMPUS_LANDMARKS[0].lat);
  const [lng, setLng] = useState(CAMPUS_LANDMARKS[0].lng);
  const [imageUrl, setImageUrl] = useState(SAMPLE_LF_PHOTOS[1].url);
  const [secretQuestion, setSecretQuestion] = useState('');
  const [reward, setReward] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  if (!isOpen) return null;

  const handleLandmarkSelect = (landmarkName) => {
    const found = CAMPUS_LANDMARKS.find(l => l.name === landmarkName);
    if (found) {
      setLocationName(found.name);
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

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
        lat: Number(lat),
        lng: Number(lng),
      },
      imageUrl,
      posterName: 'IIEST Member',
      posterContact: contactInfo.trim() || 'student@iiest.ac.in',
      secretQuestion: type === 'found' ? secretQuestion.trim() : undefined,
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
      timestamp: new Date().toISOString(),
      comments: []
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden animate-fade-in max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              {type === 'lost' ? 'Post a Lost Possession' : 'Log a Found Item'}
            </h2>
            <p className="text-xs text-stone-400">Auto-matched with IIEST community listings</p>
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
          
          {/* Type Toggle */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200/60 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                type === 'lost' ? 'bg-pink-600 text-white shadow-subtle' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                type === 'found' ? 'bg-sky-600 text-white shadow-subtle' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              I Found Something
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LOST_FOUND_CATEGORIES.map(cat => {
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
                    <Icon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Item Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navy Blue HydroFlask with stickers"
              className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Color & Brand */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue"
                className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple / HydroFlask"
                className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {type === 'lost' ? 'Last Seen Location' : 'Found / Safekeeping Location'}
            </label>
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

          {/* Description */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Distinctive Markings</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe scratches, stickers, contents..."
              className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Secret question */}
          {type === 'found' && (
            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
              <label className="font-bold text-stone-800 dark:text-stone-200 block">Secret Ownership Question</label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. What specific sticker is on the back?"
                className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-white"
              />
            </div>
          )}

          {/* Contact / Reward */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Email</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="you@iiest.ac.in"
                className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
              />
            </div>
            {type === 'lost' && (
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Reward (Optional)</label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. Canteen Coffee / $15"
                  className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Photo */}
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">Photo</label>
            <EdgeStoreUploader
              initialUrl={imageUrl}
              onUploadComplete={(url) => setImageUrl(url)}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white rounded-xl font-bold transition-all shadow-subtle ${
                type === 'lost' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {type === 'lost' ? 'Post Lost Item' : 'Post Found Item'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
