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
  isAdmin 
}) {
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!issue) return null;

  const currentCategory = CIVIC_CATEGORIES.find(c => c.id === issue.category) || {
    label: issue.category,
    icon: 'AlertCircle',
  };

  const currentStatusInfo = CIVIC_STATUSES.find(s => s.id === issue.status) || CIVIC_STATUSES[0];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Community Member',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md flex items-center space-x-1">
              <Icon name={currentCategory.icon} className="w-3.5 h-3.5 text-stone-500" />
              <span>{currentCategory.label}</span>
            </span>

            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border ${currentStatusInfo.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentStatusInfo.dotColor}`} />
              <span>{currentStatusInfo.label}</span>
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {issue.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>{issue.reporterName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{new Date(issue.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{issue.location?.name}</span>
              </span>
            </div>
          </div>

          {/* Photo & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issue.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video md:aspect-square max-h-60">
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col justify-between space-y-3">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <h4 className="text-xs font-semibold text-stone-700 mb-1">Issue Details</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Urgency Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">Community Priority</span>
                    <span className="text-[11px] text-stone-400">Upvotes help facility team prioritize</span>
                  </div>

                  <button
                    onClick={() => onUpvote(issue.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      issue.userUpvoted
                        ? 'bg-amber-500 text-white shadow-subtle'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'fill-current' : 'text-amber-500'}`} />
                    <span>{issue.urgencyUpvotes} Upvotes</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-500">Severity:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => onRateSeverity(issue.id, lvl)}
                          className={`w-5 h-5 rounded text-[11px] font-semibold flex items-center justify-center transition-all ${
                            lvl <= (issue.severity || 3)
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onVerifyIssue(issue.id)}
                    className="inline-flex items-center space-x-1 text-emerald-700 font-medium text-xs hover:underline"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify ({issue.verifiedCount || 1})</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Clean Stepper */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-3">
            <h4 className="text-xs font-semibold text-stone-800">Resolution Progress</h4>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              {CIVIC_STATUSES.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.id} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mb-1 ${
                      isCurrent ? 'bg-stone-900 text-white shadow-subtle ring-2 ring-stone-200' :
                      isPassed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'
                    }`}>
                      {isPassed && !isCurrent ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] ${isCurrent ? 'font-bold text-stone-900' : 'text-stone-500'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-stone-800">
              Community Comments ({issue.comments?.length || 0})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map(c => (
                  <div key={c.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-500">
                      <span className="font-semibold text-stone-800">{c.author}</span>
                      <span className="text-[10px]">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-stone-700">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-stone-400">No comments yet.</div>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write an update comment..."
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all flex items-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
