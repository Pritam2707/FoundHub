import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  Sparkles, 
  HelpCircle, 
  Lock, 
  Award, 
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { LOST_FOUND_CATEGORIES, CAMPUS_LANDMARKS } from '../types';
import Icon from './Icon';

const SAMPLE_LF_PHOTOS = [
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Keys / ID Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
];

export default function LostFoundModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialType = 'lost' 
}) {
  const [type, setType] = useState(initialType); // 'lost' or 'found'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bottles_mugs');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(CAMPUS_LANDMARKS[0].name);
  const [lat, setLat] = useState(CAMPUS_LANDMARKS[0].lat);
  const [lng, setLng] = useState(CAMPUS_LANDMARKS[0].lng);
  const [imageUrl, setImageUrl] = useState(SAMPLE_LF_PHOTOS[1].url);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
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
      description: description.trim() || 'No extra description provided.',
      status: 'open',
      locationName: locationName.trim(),
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },
      imageUrl: customPhotoInput.trim() || imageUrl,
      posterName: 'You (Campus Community)',
      posterContact: contactInfo.trim() || 'user@campus.edu',
      secretQuestion: type === 'found' ? secretQuestion.trim() : undefined,
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
      timestamp: new Date().toISOString(),
      comments: []
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl rounded-3xl border border-stone-200/80 shadow-soft-lg overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-pastel-lavender-light text-pastel-lavender-dark flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-brand-dark">
                {type === 'lost' ? 'Report a Lost Possession' : 'Post a Found Item'}
              </h2>
              <p className="text-xs text-stone-500">Cross-matched automatically with other community reports</p>
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
          
          {/* Lost vs Found Segmented Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Are you reporting a lost or found item?
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/60">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  type === 'lost'
                    ? 'bg-pastel-peach text-pastel-peach-dark shadow-soft-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🔍 I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  type === 'found'
                    ? 'bg-pastel-sky text-pastel-sky-dark shadow-soft-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📦 I Found Something
              </button>
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Item Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LOST_FOUND_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-2 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-pastel-lavender-light border-pastel-lavender-border text-pastel-lavender-dark font-semibold shadow-soft-sm'
                        : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon name={cat.icon} className={`w-4 h-4 ${isSelected ? 'text-pastel-lavender-dark' : 'text-stone-400'}`} />
                    <span className="text-xs truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Item Title / Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navy Blue HydroFlask 32oz with space stickers"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          {/* Attributes: Color & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Color / Finish
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue, Matte Black, Rose Gold"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Brand / Model (Optional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, HydroFlask, Sony, Nike"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {type === 'lost' ? 'Last Seen Location' : 'Where was it Found / Safekept?'}
            </label>

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
                  <option value="Other Area">Other / Specific Area</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Spot Details</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. 2nd floor desk #14, Quiet Study area"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Description & Distinctive Features */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Distinctive Features & Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe dents, scratches, stickers, contents inside, or specific markings..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          {/* Secret Question for Found Items (Verification Security) */}
          {type === 'found' && (
            <div className="p-3.5 rounded-2xl bg-pastel-lavender-light/70 border border-pastel-lavender-border space-y-1.5">
              <label className="block text-xs font-bold text-pastel-lavender-dark uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Secret Ownership Verification Question (Recommended)</span>
              </label>
              <p className="text-[11px] text-stone-600">
                Ask a specific question only the true owner can answer before claiming (e.g. "What is on the wallpaper?", "What keychain is attached?").
              </p>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. What specific sticker is placed on the backside?"
                className="w-full px-3 py-2 bg-white border border-pastel-lavender-border rounded-xl text-xs focus:outline-none"
              />
            </div>
          )}

          {/* Reward for Lost Items */}
          {type === 'lost' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Optional Reward
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. Free Coffee ☕ / $25 / Big Thanks"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Your Contact Email / Handle
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. yourname@campus.edu"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>
          )}

          {/* Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Item Photo Preview
            </label>
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
              {SAMPLE_LF_PHOTOS.map((sp, idx) => (
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

            <input
              type="url"
              value={customPhotoInput}
              onChange={(e) => setCustomPhotoInput(e.target.value)}
              placeholder="Or paste custom photo URL..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          {/* Submit */}
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
              <span>{type === 'lost' ? 'Post Lost Report' : 'Post Found Item'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
