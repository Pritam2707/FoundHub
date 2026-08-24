import React, { useState, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  Send, 
  Lock, 
  Award, 
  CheckCircle2, 
  User, 
  Mail, 
  ArrowRight,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOST_FOUND_CATEGORIES } from '../types';
import { findMatchesForPost } from '../services/matchingEngine';
import Icon from './Icon';

export default function LostFoundDetailModal({ 
  item, 
  allItems, 
  onClose, 
  onMarkReunited, 
  onAddComment,
  onSelectItem
}) {
  const [commentText, setCommentText] = useState('');
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimContact, setClaimContact] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const smartMatches = useMemo(() => {
    if (!item) return [];
    return findMatchesForPost(item, allItems, 45);
  }, [item, allItems]);

  if (!item) return null;

  const currentCategory = LOST_FOUND_CATEGORIES.find(c => c.id === item.category) || {
    label: item.category,
    icon: 'Package',
  };

  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `lfc-${Date.now()}`,
      author: 'Community Sighting Tip',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
    };

    onAddComment(item.id, newComment);
    setCommentText('');
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setIsClaiming(false);

    const claimNote = {
      id: `lfc-${Date.now()}`,
      author: 'Claim Request',
      text: `Ownership claim submitted by ${claimContact || 'claimant'}. Verification answer sent to poster.`,
      timestamp: new Date().toISOString(),
    };
    onAddComment(item.id, claimNote);
  };

  const triggerReunitedCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#6366F1', '#38BDF8', '#F59E0B']
    });
    onMarkReunited(item.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isReunited ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Reunited
              </span>
            ) : isLost ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                Lost Item
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                Found Item
              </span>
            )}

            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
              {currentCategory.label}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShare}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all flex items-center space-x-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {item.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Posted by {item.posterName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{item.locationName}</span>
              </span>
            </div>
          </div>

          {/* Media & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video md:aspect-square max-h-60">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {item.color && (
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Color: <strong>{item.color}</strong>
                    </span>
                  )}
                  {item.brand && (
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Brand: <strong>{item.brand}</strong>
                    </span>
                  )}
                  {item.reward && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Reward: {item.reward}
                    </span>
                  )}
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <h4 className="font-semibold text-stone-700 mb-1">Details & Markings</h4>
                  <p className="text-stone-600 leading-relaxed">{item.description}</p>
                </div>

                {item.posterContact && (
                  <div className="text-stone-500">
                    Contact: <strong className="text-stone-800">{item.posterContact}</strong>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!isReunited && (
                <div className="flex gap-2 pt-2">
                  {!isLost && (
                    <button
                      onClick={() => setIsClaiming(!isClaiming)}
                      className="flex-1 py-2 px-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all flex items-center justify-center space-x-1"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Claim Item</span>
                    </button>
                  )}
                  <button
                    onClick={triggerReunitedCelebration}
                    className="py-2 px-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center space-x-1 shadow-subtle"
                  >
                    <span>Mark Reunited</span>
                  </button>
                </div>
              )}

              {claimSubmitted && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-center font-medium">
                  Claim verification details sent to poster!
                </div>
              )}
            </div>
          </div>

          {/* Claim Box */}
          {isClaiming && !isReunited && (
            <form onSubmit={handleClaimSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <h4 className="font-bold text-stone-900">Verify Ownership</h4>
              {item.secretQuestion ? (
                <div>
                  <label className="block text-stone-600 mb-1">
                    Question: <em>"{item.secretQuestion}"</em>
                  </label>
                  <input
                    type="text"
                    required
                    value={claimAnswer}
                    onChange={(e) => setClaimAnswer(e.target.value)}
                    placeholder="Enter answer..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Describe serial number or proof of ownership..."
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg"
                />
              )}

              <input
                type="text"
                required
                value={claimContact}
                onChange={(e) => setClaimContact(e.target.value)}
                placeholder="Your email or phone number..."
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="px-3 py-1 bg-stone-200 text-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-stone-900 text-white rounded-lg font-semibold"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          )}

          {/* Smart Match Suggestion Drawer */}
          {smartMatches.length > 0 && !isReunited && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-indigo-950">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Smart Match Suggestions ({smartMatches.length})</span>
              </div>

              <div className="space-y-2">
                {smartMatches.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-stone-900">{m.matchedItem.title}</span>
                      <span className="block text-[11px] text-stone-500">
                        {m.reasons.join(' • ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                        {m.score}%
                      </span>
                      <button
                        onClick={() => onSelectItem(m.matchedItem)}
                        className="px-2.5 py-1 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips / Comments */}
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-stone-800">Sighting Tips ({item.comments?.length || 0})</h4>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map(c => (
                  <div key={c.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                    <span className="font-semibold text-stone-800">{c.author}: </span>
                    <span className="text-stone-600">{c.text}</span>
                  </div>
                ))
              ) : (
                <div className="text-stone-400 py-2">No sighting tips yet.</div>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a sighting tip..."
                className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-white rounded-xl font-semibold"
              >
                Send
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
