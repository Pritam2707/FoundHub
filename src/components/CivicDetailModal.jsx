import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Check, 
  Calendar,
  User,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CIVIC_CATEGORIES, CIVIC_STATUSES } from '../types';
import Icon from './Icon';

export default function CivicDetailModal({ 
  issue, 
  onClose, 
  onUpvote, 
  onRateSeverity, 
  onVerifyIssue,
  onAddComment,
  onUpdateStatus,
}) {
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!issue) return null;

  const currentCategory = CIVIC_CATEGORIES.find(c => c.id === issue.category) || {
    label: issue.category,
    icon: 'AlertCircle',
    emoji: '⚠️'
  };

  const currentStatusInfo = CIVIC_STATUSES.find(s => s.id === issue.status) || CIVIC_STATUSES[0];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'IIEST Community Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
      upvotes: 0,
    };

    onAddComment(issue.id, newComment);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const statusSteps = ['reported', 'acknowledged', 'in_progress', 'resolved'];
  const currentStepIndex = statusSteps.indexOf(issue.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center space-x-1 ${currentCategory.tagClass}`}>
              <span>{currentCategory.emoji}</span>
              <span>{currentCategory.label}</span>
            </span>

            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentStatusInfo.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentStatusInfo.dotColor}`} />
              <span>{currentStatusInfo.label}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShare}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center space-x-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-snug">
              {issue.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>{issue.reporterName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{new Date(issue.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-700 dark:text-stone-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{issue.location?.name}</span>
              </span>
            </div>
          </div>

          {/* Photo & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issue.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 aspect-video md:aspect-square max-h-60">
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col justify-between space-y-3">
              <div className="bg-stone-50 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700/80">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Issue Details</h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Urgency & Rating Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white block">Community Priority</span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">Upvotes help facility team prioritize</span>
                  </div>

                  <button
                    onClick={() => onUpvote(issue.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      issue.userUpvoted
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow-amber'
                        : 'bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'fill-current' : 'text-orange-500'}`} />
                    <span>{issue.urgencyUpvotes} Upvotes</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 dark:border-amber-800/40 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Severity:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => onRateSeverity(issue.id, lvl)}
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                            lvl <= (issue.severity || 3)
                              ? 'bg-orange-500 text-white shadow-subtle'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-500 hover:bg-stone-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onVerifyIssue(issue.id)}
                    className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:underline"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify ({issue.verifiedCount || 1})</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Stepper Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 dark:text-white">Resolution Pipeline</h4>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              {CIVIC_STATUSES.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.id} className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      isCurrent ? 'bg-indigo-600 text-white shadow-glow-indigo ring-2 ring-indigo-200 dark:ring-indigo-800' :
                      isPassed ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                    }`}>
                      {isPassed && !isCurrent ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] ${isCurrent ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments Feed */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-stone-800 dark:text-white">
              Community Comments ({issue.comments?.length || 0})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map(c => (
                  <div key={c.id} className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200/70 dark:border-stone-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                      <span className="font-bold text-stone-800 dark:text-stone-200">{c.author}</span>
                      <span className="text-[10px]">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-stone-400">No comments yet. Post the first update below!</div>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write an update comment (e.g. 'Repaired this afternoon')..."
                className="flex-1 px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-subtle"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
