import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle,
  Search,
  Check,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { CIVIC_CATEGORIES, CIVIC_STATUSES } from '../types';
import Icon from './Icon';

export default function CivicIssuesView({ 
  issues, 
  onSelectIssue, 
  onUpvoteIssue, 
  onOpenReportModal 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency', 'severity', 'recent', 'upvotes'

  // Filtered and Sorted Issues
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Status
    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location?.name?.toLowerCase().includes(q)
      );
    }

    // Sort by criteria
    result.sort((a, b) => {
      if (sortBy === 'urgency') {
        // Urgency score calculated by upvotes + severity + verification
        const scoreA = (a.urgencyUpvotes || 0) * 2 + (a.severity || 1) * 3 + (a.verifiedCount || 0);
        const scoreB = (b.urgencyUpvotes || 0) * 2 + (b.severity || 1) * 3 + (b.verifiedCount || 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'severity') {
        return (b.severity || 1) - (a.severity || 1);
      }
      if (sortBy === 'upvotes') {
        return (b.urgencyUpvotes || 0) - (a.urgencyUpvotes || 0);
      }
      if (sortBy === 'recent') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      return 0;
    });

    return result;
  }, [issues, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Quick Overview Stats
  const stats = useMemo(() => {
    const total = issues.length;
    const reported = issues.filter(i => i.status === 'reported').length;
    const inProgress = issues.filter(i => i.status === 'in_progress' || i.status === 'acknowledged').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const topUrgent = issues.reduce((max, cur) => cur.urgencyUpvotes > max ? cur.urgencyUpvotes : max, 0);

    return { total, reported, inProgress, resolved, topUrgent };
  }, [issues]);

  const getStatusInfo = (statusId) => {
    return CIVIC_STATUSES.find(s => s.id === statusId) || CIVIC_STATUSES[0];
  };

  const getCategoryInfo = (catId) => {
    return CIVIC_CATEGORIES.find(c => c.id === catId) || { label: catId, color: 'sand', icon: 'AlertCircle' };
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Hero Banner with Soft Pastel Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pastel-peach-light/90 via-pastel-lavender-light/80 to-pastel-mint-light/90 p-6 sm:p-8 border border-stone-200/60 shadow-soft-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-stone-200/60 text-xs font-semibold text-brand-dark mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-pastel-peach-dark" />
            <span>Community-Driven Civic Prioritization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            Report Civic Issues & Potholes
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1.5 leading-relaxed">
            Report broken infrastructure, safety hazards, and road potholes. Community urgency upvotes surface the most critical problems directly to facility teams.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => onOpenReportModal('civic')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-brand-dark text-white text-sm font-semibold hover:bg-stone-800 transition-all shadow-soft-sm"
            >
              <span>+ Report an Issue</span>
            </button>
            <div className="flex items-center space-x-1.5 text-xs text-stone-500 bg-white/70 px-3 py-2 rounded-2xl border border-stone-200/50">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Smart GPS duplicate detection enabled</span>
            </div>
          </div>
        </div>

        {/* Floating Abstract Pastel Blobs */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-pastel-peach/30 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-8 w-44 h-44 rounded-full bg-pastel-mint/30 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-stone-200/70 shadow-soft-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-pastel-peach-light flex items-center justify-center text-pastel-peach-dark">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-brand-dark">{stats.total}</div>
            <div className="text-xs text-stone-500">Total Tracked</div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-stone-200/70 shadow-soft-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-pastel-butter-light flex items-center justify-center text-pastel-butter-dark">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-brand-dark">{stats.reported}</div>
            <div className="text-xs text-stone-500">Awaiting Review</div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-stone-200/70 shadow-soft-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-pastel-sky-light flex items-center justify-center text-pastel-sky-dark">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-brand-dark">{stats.inProgress}</div>
            <div className="text-xs text-stone-500">In Active Repair</div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-stone-200/70 shadow-soft-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-pastel-mint-light flex items-center justify-center text-pastel-mint-dark">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-brand-dark">{stats.resolved}</div>
            <div className="text-xs text-stone-500">Resolved & Fixed</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Pills, Status & Sorting */}
      <div className="bg-surface p-4 rounded-3xl border border-stone-200/70 shadow-soft-sm space-y-3.5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by issue title, landmark, or description..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200/70 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200/60 rounded-full px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status and Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center bg-stone-50 p-1 rounded-2xl border border-stone-200/70 text-xs">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedStatus === 'all' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setSelectedStatus('reported')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedStatus === 'reported' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Reported
              </button>
              <button
                onClick={() => setSelectedStatus('in_progress')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedStatus === 'in_progress' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedStatus('resolved')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedStatus === 'resolved' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5 bg-stone-50 px-3 py-2 rounded-2xl border border-stone-200/70 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort issues by"
                className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="urgency">🔥 Highest Urgency</option>
                <option value="severity">⭐ Severity (1-5)</option>
                <option value="upvotes">👍 Most Upvotes</option>
                <option value="recent">🕒 Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white border-brand-dark shadow-soft-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Categories
          </button>

          {CIVIC_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-pastel-peach-light text-pastel-peach-dark border-pastel-peach-border font-semibold shadow-soft-sm'
                    : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Issues Grid List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-stone-200/70 p-12 text-center shadow-soft-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-pastel-lavender-light flex items-center justify-center text-pastel-lavender-dark mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-dark">No civic issues match your filter</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
            Try clearing your search query or choosing another category tag to see active community reports.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedStatus('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredIssues.map((issue) => {
            const status = getStatusInfo(issue.status);
            const category = getCategoryInfo(issue.category);

            return (
              <div
                key={issue.id}
                className="group bg-surface rounded-3xl border border-stone-200/70 p-5 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between cursor-pointer relative hover:border-pastel-peach-border/70"
                onClick={() => onSelectIssue(issue)}
              >
                {/* Header info & category */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-pastel-peach-light text-pastel-peach-dark border border-pastel-peach-border/50">
                        <Icon name={category.icon} className="w-3 h-3" />
                        <span>{category.label}</span>
                      </span>

                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold border ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Upvote Button Direct Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIssue(issue.id);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all ${
                        issue.userUpvoted
                          ? 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-border shadow-soft-sm'
                          : 'bg-stone-50 hover:bg-pastel-peach-light text-stone-700 border-stone-200 hover:text-pastel-peach-dark'
                      }`}
                      title="Upvote as Urgent to prioritize"
                    >
                      <Flame className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'fill-current text-pastel-peach-dark' : 'text-pastel-peach-dark'}`} />
                      <span>{issue.urgencyUpvotes || 0}</span>
                    </button>
                  </div>

                  {/* Title & Image Layout */}
                  <div className="mt-3.5 flex gap-4">
                    {issue.imageUrl && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-brand-dark line-clamp-2 group-hover:text-brand-primary transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  {/* Location & Reporter Tag */}
                  <div className="mt-3 flex items-center space-x-2 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-pastel-peach-dark shrink-0" />
                    <span className="truncate font-medium text-stone-600">
                      {issue.location?.name || 'Campus Location'}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Severity, Verified Count, Comments */}
                <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
                  {/* Severity Indicator */}
                  <div className="flex items-center space-x-1.5" title={`Severity rating: ${issue.severity || 3}/5`}>
                    <span className="text-stone-400 font-medium">Severity:</span>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <span
                          key={lvl}
                          className={`w-2.5 h-2.5 rounded-full ${
                            lvl <= (issue.severity || 3)
                              ? (issue.severity >= 4 ? 'bg-pastel-peach-dark' : 'bg-pastel-butter-dark')
                              : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-stone-400">
                    {issue.verifiedCount > 0 && (
                      <span className="flex items-center space-x-1 text-pastel-mint-dark font-medium">
                        <Check className="w-3 h-3" />
                        <span>{issue.verifiedCount} verified</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span>{issue.comments?.length || 0}</span>
                    </span>

                    <span className="text-stone-400">{timeAgo(issue.reportedAt)}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
