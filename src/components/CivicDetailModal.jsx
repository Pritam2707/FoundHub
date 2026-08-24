import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  Sparkles,
  Share2,
  Calendar,
  User,
  ArrowRight
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
  const [adminNote, setAdminNote] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!issue) return null;

  const currentCategory = CIVIC_CATEGORIES.find(c => c.id === issue.category) || {
    label: issue.category,
    icon: 'AlertCircle',
    color: 'peach',
  };

  const currentStatusInfo = CIVIC_STATUSES.find(s => s.id === issue.status) || CIVIC_STATUSES[0];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: isAdmin ? 'Campus Facility (Staff)' : 'Campus Member',
      avatar: isAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
      isOfficial: isAdmin,
      upvotes: 0,
    };

    onAddComment(issue.id, newComment);
    setCommentText('');
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'resolved') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A7F3D0', '#DDD6FE', '#FED7AA']
      });
    }
    onUpdateStatus(issue.id, newStatus, adminNote.trim() || `Status moved to ${newStatus}`);
    setAdminNote('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Pipeline stages calculation
  const statusSteps = ['reported', 'acknowledged', 'in_progress', 'resolved'];
  const currentStepIndex = statusSteps.indexOf(issue.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-3xl rounded-3xl border border-stone-200/80 shadow-soft-lg overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold bg-pastel-peach-light text-pastel-peach-dark border border-pastel-peach-border/60">
              <Icon name={currentCategory.icon} className="w-3.5 h-3.5" />
              <span>{currentCategory.label}</span>
            </span>

            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${currentStatusInfo.badgeClass}`}>
              {currentStatusInfo.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 flex items-center space-x-1 transition-all"
              title="Share issue link"
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

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Main Title & Media */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
              {issue.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>{issue.reporterName} ({issue.reporterRole})</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{new Date(issue.reportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-pastel-peach-dark" />
                <span>{issue.location?.name}</span>
              </span>
            </div>
          </div>

          {/* Photo & Description Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {issue.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-200/70 bg-stone-100 aspect-video md:aspect-square max-h-72">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col justify-between space-y-4">
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60">
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Report Description
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Urgency & Community Credibility Action Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pastel-peach-light/70 to-pastel-butter-light/70 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Community Urgency</span>
                    <span className="text-[11px] text-stone-500">Upvotes raise priority for facilities team</span>
                  </div>

                  <button
                    onClick={() => onUpvote(issue.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      issue.userUpvoted
                        ? 'bg-pastel-peach text-pastel-peach-dark border border-pastel-peach-border shadow-soft-sm'
                        : 'bg-white hover:bg-pastel-peach-light text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Flame className={`w-4 h-4 ${issue.userUpvoted ? 'fill-current text-pastel-peach-dark' : 'text-pastel-peach-dark'}`} />
                    <span>{issue.urgencyUpvotes} Upvotes</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/40 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-stone-500">Rate Severity:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => onRateSeverity(issue.id, lvl)}
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                            lvl <= (issue.severity || 3)
                              ? 'bg-pastel-peach text-pastel-peach-dark font-bold'
                              : 'bg-stone-200 text-stone-400 hover:bg-stone-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onVerifyIssue(issue.id)}
                    className="inline-flex items-center space-x-1 text-pastel-mint-dark hover:underline font-semibold text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify ({issue.verifiedCount || 1})</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* STATUS PIPELINE PROGRESS STEPPER */}
          <div className="p-5 rounded-2xl bg-surface border border-stone-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-brand-primary" />
                <span>Submit ➔ Verify ➔ Resolve Pipeline</span>
              </h3>
              <span className="text-xs font-medium text-stone-500">
                Current Stage: <strong className="text-brand-dark capitalize">{issue.status.replace('_', ' ')}</strong>
              </span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-4 gap-2 relative">
              {CIVIC_STATUSES.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.id} className="relative flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                        isCurrent
                          ? 'bg-brand-primary text-white shadow-soft-md ring-4 ring-brand-primaryLight'
                          : isPassed
                          ? 'bg-pastel-mint-dark text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold ${isCurrent ? 'text-brand-dark' : isPassed ? 'text-stone-700' : 'text-stone-400'}`}>
                      {st.label}
                    </span>
                    <span className="text-[9px] text-stone-400 hidden sm:block mt-0.5 line-clamp-1">
                      {st.description}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline Audit Logs */}
            {issue.statusHistory && issue.statusHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Stage History:</span>
                <div className="space-y-1">
                  {issue.statusHistory.map((hist, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-stone-600">
                      <span className="w-2 h-2 rounded-full bg-pastel-mint-dark shrink-0" />
                      <span className="font-semibold capitalize">{hist.status.replace('_', ' ')}:</span>
                      <span className="text-stone-500">{hist.note}</span>
                      <span className="text-[10px] text-stone-400 ml-auto">
                        {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facility Admin Actions Bar */}
            {isAdmin && (
              <div className="mt-3 p-3.5 rounded-xl bg-pastel-butter-light/80 border border-pastel-butter-border space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-pastel-butter-dark">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Facility Staff Controls — Update Stage</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange('acknowledged')}
                    className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-50 transition-all"
                  >
                    Set Acknowledged
                  </button>
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="px-3 py-1.5 bg-pastel-sky-light text-pastel-sky-dark border border-pastel-sky-border rounded-xl text-xs font-medium hover:bg-pastel-sky transition-all"
                  >
                    Dispatch Crew (In Progress)
                  </button>
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="px-3 py-1.5 bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border rounded-xl text-xs font-bold hover:bg-pastel-mint-border transition-all flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mark Resolved & Closed</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* COMMENTS & PHOTO UPDATES THREAD */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              <span>Community Updates & Discussion ({issue.comments?.length || 0})</span>
            </h3>

            {/* Comments List */}
            <div className="space-y-2.5">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      comment.isOfficial
                        ? 'bg-pastel-lavender-light/70 border-pastel-lavender-border'
                        : 'bg-stone-50 border-stone-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-6 h-6 rounded-full object-cover border border-stone-200"
                        />
                        <span className="font-bold text-stone-800">{comment.author}</span>
                        {comment.isOfficial && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-pastel-lavender text-pastel-lavender-dark">
                            FACILITY STAFF
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(comment.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed pl-8">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-400">
                  No community comments yet. Post the first update below!
                </div>
              )}
            </div>

            {/* Comment Box */}
            <form onSubmit={handleCommentSubmit} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post an update (e.g. 'Still leaking as of 2pm', 'Asphalt crew arrived')..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-primary text-white rounded-2xl text-xs font-bold hover:bg-brand-primaryHover transition-all flex items-center space-x-1"
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
