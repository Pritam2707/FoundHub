import React, { useState, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  MessageSquare, 
  Send, 
  Lock, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Mail, 
  ArrowRight,
  HelpCircle,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOST_FOUND_CATEGORIES, LOST_FOUND_STATUSES } from '../types';
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
  const [claimSenderContact, setClaimSenderContact] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute smart matches for this post
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

    // Also auto-post a comment about the claim
    const claimNote = {
      id: `lfc-${Date.now()}`,
      author: 'System Claim Request',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: `Ownership claim submitted by ${claimSenderContact || 'claimant'}. Verification answer sent to poster.`,
      timestamp: new Date().toISOString(),
      isOfficial: true,
    };
    onAddComment(item.id, claimNote);
  };

  const triggerReunitedCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A7F3D0', '#DDD6FE', '#BAE6FD', '#FED7AA']
    });
    onMarkReunited(item.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-3xl rounded-3xl border border-stone-200/80 shadow-soft-lg overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center space-x-2.5">
            {isReunited ? (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
                Reunited 🎉
              </span>
            ) : isLost ? (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-pastel-peach text-pastel-peach-dark border border-pastel-peach-border">
                LOST ITEM
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-pastel-sky text-pastel-sky-dark border border-pastel-sky-border">
                FOUND ITEM
              </span>
            )}

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold bg-pastel-lavender-light text-pastel-lavender-dark border border-pastel-lavender-border/60">
              <Icon name={currentCategory.icon} className="w-3.5 h-3.5" />
              <span>{currentCategory.label}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 flex items-center space-x-1 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Main Title & Meta */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
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
                <MapPin className="w-3.5 h-3.5 text-pastel-lavender-dark" />
                <span>{item.locationName}</span>
              </span>
            </div>
          </div>

          {/* Media & Details Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {item.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200/70 bg-stone-100 aspect-video md:aspect-square max-h-72">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Attributes pill grid */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {item.color && (
                    <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 font-medium border border-stone-200">
                      Color: <strong>{item.color}</strong>
                    </span>
                  )}
                  {item.brand && (
                    <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 font-medium border border-stone-200">
                      Brand: <strong>{item.brand}</strong>
                    </span>
                  )}
                  {item.reward && (
                    <span className="px-2.5 py-1 rounded-xl bg-pastel-butter-light text-pastel-butter-dark font-bold border border-pastel-butter-border flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Reward: {item.reward}</span>
                    </span>
                  )}
                </div>

                <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60">
                  <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Details & Distinctive Markings
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.posterContact && (
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center space-x-2 text-xs text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>Contact: <strong>{item.posterContact}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Claim, Reunite */}
              <div className="space-y-2 pt-2">
                {!isReunited && (
                  <div className="flex flex-wrap gap-2">
                    {/* Claim Button for Found item */}
                    {!isLost && (
                      <button
                        onClick={() => setIsClaiming(!isClaiming)}
                        className="flex-1 py-2.5 px-4 bg-brand-primary text-white text-xs font-bold rounded-2xl hover:bg-brand-primaryHover shadow-soft-sm transition-all flex items-center justify-center space-x-1.5"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Claim This Item (I am the Owner)</span>
                      </button>
                    )}

                    {/* Mark Reunited Button */}
                    <button
                      onClick={triggerReunitedCelebration}
                      className="py-2.5 px-4 bg-pastel-mint text-pastel-mint-dark text-xs font-bold rounded-2xl border border-pastel-mint-border hover:bg-pastel-mint-border transition-all flex items-center justify-center space-x-1.5 shadow-soft-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Mark as Reunited 🎉</span>
                    </button>
                  </div>
                )}

                {claimSubmitted && (
                  <div className="p-3 rounded-xl bg-pastel-mint-light border border-pastel-mint-border text-xs text-pastel-mint-dark font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your claim request and verification details were sent to the finder!</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CLAIM VERIFICATION FORM MODAL/DRAWER */}
          {isClaiming && !isReunited && (
            <form onSubmit={handleClaimSubmit} className="p-4.5 rounded-2xl bg-pastel-lavender-light/90 border-2 border-pastel-lavender-border space-y-3 animate-slide-up">
              <div className="flex items-center space-x-2 text-xs font-bold text-pastel-lavender-dark">
                <Lock className="w-4 h-4" />
                <span>Verify Ownership to Claim</span>
              </div>

              {item.secretQuestion ? (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Finder's Verification Question: <em>"{item.secretQuestion}"</em>
                  </label>
                  <input
                    type="text"
                    required
                    value={claimAnswer}
                    onChange={(e) => setClaimAnswer(e.target.value)}
                    placeholder="Enter the correct answer or describe your unique identifier..."
                    className="w-full px-3 py-2 bg-white border border-pastel-lavender-border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Describe unique marks or proof of ownership
                  </label>
                  <input
                    type="text"
                    required
                    value={claimAnswer}
                    onChange={(e) => setClaimAnswer(e.target.value)}
                    placeholder="e.g. Serial number, scratch on bottom, lockscreen photo..."
                    className="w-full px-3 py-2 bg-white border border-pastel-lavender-border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Contact Email / Phone
                </label>
                <input
                  type="text"
                  required
                  value={claimSenderContact}
                  onChange={(e) => setClaimSenderContact(e.target.value)}
                  placeholder="e.g. myemail@campus.edu or (555) 234-5678"
                  className="w-full px-3 py-2 bg-white border border-pastel-lavender-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primaryHover shadow-soft-sm"
                >
                  Submit Claim Verification
                </button>
              </div>
            </form>
          )}

          {/* SMART MATCHES DRAWER */}
          {smartMatches.length > 0 && !isReunited && (
            <div className="p-4 rounded-2xl bg-surface border border-stone-200/80 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>Smart Matching Suggestions ({smartMatches.length})</span>
                </h3>
                <span className="text-[11px] text-stone-400">Multi-Factor NLP & Distance Engine</span>
              </div>

              <div className="space-y-2.5">
                {smartMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 hover:bg-pastel-lavender-light/40 border border-stone-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          match.matchedItem.type === 'found' ? 'bg-pastel-mint-light text-pastel-mint-dark' : 'bg-pastel-peach-light text-pastel-peach-dark'
                        }`}>
                          {match.matchedItem.type.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900">{match.matchedItem.title}</h4>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {match.reasons.map((r, i) => (
                          <span key={i} className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-pastel-lavender-light text-pastel-lavender-dark border border-pastel-lavender-border">
                        {match.score}% Match
                      </span>
                      <button
                        onClick={() => onSelectItem(match.matchedItem)}
                        className="px-3 py-1 bg-white border border-stone-200 hover:border-brand-primary text-brand-primary text-xs font-semibold rounded-xl flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIGHTING TIPS & COMMENTS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              <span>Sightings & Community Tips ({item.comments?.length || 0})</span>
            </h3>

            {/* Comments List */}
            <div className="space-y-2">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-stone-800">{comment.author}</span>
                        {comment.isOfficial && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-pastel-lavender text-pastel-lavender-dark">
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-400">
                  No tips posted yet. Saw this item anywhere? Leave a sighting tip below!
                </div>
              )}
            </div>

            {/* Post Sighting Tip */}
            <form onSubmit={handleCommentSubmit} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post a tip (e.g. 'Saw a similar bottle near library counter 2 hours ago')..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-primary text-white rounded-2xl text-xs font-bold hover:bg-brand-primaryHover transition-all flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Tip</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
