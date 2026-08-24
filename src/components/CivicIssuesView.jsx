import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  ArrowUpDown, 
  Plus, 
  Check,
  Filter
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
  const [sortBy, setSortBy] = useState('urgency');

  // Filtered and Sorted Issues
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location?.name?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'urgency') {
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

  const getStatusInfo = (statusId) => {
    return CIVIC_STATUSES.find(s => s.id === statusId) || CIVIC_STATUSES[0];
  };

  const getCategoryInfo = (catId) => {
    return CIVIC_CATEGORIES.find(c => c.id === catId) || { label: catId, icon: 'AlertCircle', tagColor: 'bg-stone-100 text-stone-700' };
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
    <div className="space-y-6 pb-16">
      
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Civic Issues & Hazards
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Community upvotes surface the most critical campus infrastructure problems directly to facility teams.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenReportModal('civic')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all flex items-center space-x-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report an Issue</span>
          </button>
        </div>
      </div>

      {/* Clean Minimal Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues, road potholes, landmarks..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Status & Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Pills */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs font-medium">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === 'all' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus('reported')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === 'reported' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Reported
              </button>
              <button
                onClick={() => setSelectedStatus('in_progress')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === 'in_progress' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedStatus('resolved')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === 'resolved' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1 bg-stone-50 border border-stone-200/80 px-2.5 py-1.5 rounded-xl text-xs text-stone-600 font-medium">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort issues by"
                className="bg-transparent focus:outline-none cursor-pointer pr-1 text-stone-800"
              >
                <option value="urgency">Highest Urgency</option>
                <option value="severity">Severity (1-5)</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Minimal Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all font-medium ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-subtle'
                : 'text-stone-600 hover:bg-stone-100'
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
                className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all flex items-center space-x-1 font-medium ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-subtle'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon name={cat.icon} className="w-3 h-3 text-stone-400" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Issue Card Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-subtle">
          <p className="text-sm font-semibold text-stone-800">No issues found matching your filters</p>
          <p className="text-xs text-stone-400 mt-1">Try clearing your search query or changing category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => {
            const status = getStatusInfo(issue.status);
            const category = getCategoryInfo(issue.category);

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-400/80 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                        <Icon name={category.icon} className="w-3 h-3 text-stone-500" />
                        <span>{category.label}</span>
                      </span>

                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${status.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                        <span>{status.label}</span>
                      </span>
                    </div>

                    {/* Upvote Urgency Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIssue(issue.id);
                      }}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                        issue.userUpvoted
                          ? 'bg-amber-500 text-white border-amber-500 shadow-subtle'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                      title="Upvote as Urgent"
                    >
                      <Flame className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'fill-current' : 'text-amber-600'}`} />
                      <span>{issue.urgencyUpvotes || 0}</span>
                    </button>
                  </div>

                  {/* Title & Thumbnail */}
                  <div className="flex gap-3.5">
                    {issue.imageUrl && (
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-stone-900 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  {/* Location Landmark */}
                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{issue.location?.name}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-400">Severity:</span>
                    <span className="font-semibold text-stone-700">{issue.severity || 3}/5</span>
                  </div>

                  <div className="flex items-center space-x-3 text-stone-400">
                    {issue.verifiedCount > 0 && (
                      <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3" />
                        <span>{issue.verifiedCount} verified</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{issue.comments?.length || 0}</span>
                    </span>

                    <span>{timeAgo(issue.reportedAt)}</span>
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
