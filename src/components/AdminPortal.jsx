import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Wrench, 
  Sparkles, 
  RotateCcw, 
  Lock, 
  MapPin, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CIVIC_STATUSES } from '../types';

export default function AdminPortal({ 
  civicIssues, 
  lostFoundItems, 
  onUpdateCivicStatus,
  onResetData,
  onCloseAdminPortal 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('active');

  const unresolvedCivic = civicIssues.filter(i => i.status !== 'resolved');
  const resolvedCivic = civicIssues.filter(i => i.status === 'resolved');
  const inProgressCivic = civicIssues.filter(i => i.status === 'in_progress');

  const resolutionRate = civicIssues.length > 0 
    ? Math.round((resolvedCivic.length / civicIssues.length) * 100) 
    : 0;

  const filteredIssues = civicIssues.filter(issue => {
    if (selectedFilter === 'active') return issue.status !== 'resolved';
    if (selectedFilter === 'in_progress') return issue.status === 'in_progress';
    if (selectedFilter === 'resolved') return issue.status === 'resolved';
    return true;
  });

  const handleAdvanceStatus = (issueId, nextStatus) => {
    if (nextStatus === 'resolved') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#6366F1', '#F59E0B']
      });
    }
    const note = `Status advanced to ${nextStatus} by IIEST Facilities Dispatch`;
    onUpdateCivicStatus(issueId, nextStatus, note);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === '1234' || passcode === '') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-stone-900 w-full max-w-md p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-modal text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-glow-indigo">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">IIEST Facilities Staff Portal</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Enter staff authorization passcode to access the operations dashboard</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (default: admin)..."
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
            />

            {authError && (
              <p className="text-xs text-rose-600 font-medium">Incorrect passcode. Try "admin".</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCloseAdminPortal}
                className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-200"
              >
                Back to Public App
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-subtle"
              >
                Unlock Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Staff Portal Header */}
      <div className="bg-stone-950 text-white p-6 sm:p-7 rounded-3xl shadow-card-dark border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-400 text-xs mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-emerald-400">IIEST Estate & Facilities Operations Workspace</span>
            <span>•</span>
            <span>Staff Dispatcher Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Campus Hazard Dispatch & Resolution Queue
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
            Triage IIEST road reports, assign repair teams to buildings, and verify closures.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onResetData}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={onCloseAdminPortal}
            className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition-all flex items-center space-x-1.5 shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public App</span>
          </button>
        </div>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card space-y-1">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Campus Resolution Rate</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{resolutionRate}%</div>
          <div className="text-[11px] text-stone-400">{resolvedCivic.length} of {civicIssues.length} fixed</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card space-y-1">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Active Open Hazards</div>
          <div className="text-2xl font-bold text-amber-500">{unresolvedCivic.length}</div>
          <div className="text-[11px] text-stone-400">{unresolvedCivic.filter(i => i.urgencyUpvotes >= 20).length} high priority</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card space-y-1">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Crew Dispatched On Site</div>
          <div className="text-2xl font-bold text-sky-500">{inProgressCivic.length}</div>
          <div className="text-[11px] text-stone-400">Road patchwork & electricals</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card space-y-1">
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Target Turnaround SLA</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white">&lt; 48h</div>
          <div className="text-[11px] text-emerald-600 font-semibold">96% within SLA window</div>
        </div>
      </div>

      {/* Ticket Work Queue */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-card overflow-hidden">
        
        {/* Filter Controls */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-900 dark:text-white">
            <Wrench className="w-4 h-4 text-indigo-500" />
            <span>Facility Ticket Queue ({filteredIssues.length})</span>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-medium border border-stone-200/60 dark:border-stone-700">
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'active' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' : 'text-stone-500'
              }`}
            >
              Active ({unresolvedCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('in_progress')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'in_progress' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' : 'text-stone-500'
              }`}
            >
              In Progress ({inProgressCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('resolved')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'resolved' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' : 'text-stone-500'
              }`}
            >
              Resolved ({resolvedCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'all' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' : 'text-stone-500'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Tickets List */}
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No tickets found in this queue.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 sm:p-5 hover:bg-stone-50/70 dark:hover:bg-stone-800/50 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Left Details */}
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-stone-400">#{issue.id.slice(-4)}</span>
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                        issue.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        issue.status === 'in_progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        issue.status === 'acknowledged' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-bold flex items-center space-x-0.5">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{issue.urgencyUpvotes} Votes</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">{issue.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{issue.location?.name}</span>
                      <span>•</span>
                      <span>Reporter: {issue.reporterName}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {issue.status === 'reported' && (
                      <button
                        onClick={() => handleAdvanceStatus(issue.id, 'acknowledged')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 dark:border-blue-800"
                      >
                        Acknowledge
                      </button>
                    )}

                    {(issue.status === 'reported' || issue.status === 'acknowledged') && (
                      <button
                        onClick={() => handleAdvanceStatus(issue.id, 'in_progress')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition-all border border-amber-200 dark:border-amber-800"
                      >
                        Dispatch Crew
                      </button>
                    )}

                    {issue.status !== 'resolved' && (
                      <button
                        onClick={() => handleAdvanceStatus(issue.id, 'resolved')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-subtle"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {issue.status === 'resolved' && (
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        ✓ Closed & Repaired
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
