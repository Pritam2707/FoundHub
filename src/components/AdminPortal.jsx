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
  Key, 
  MapPin, 
  Send,
  AlertTriangle,
  UserCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CIVIC_CATEGORIES, CIVIC_STATUSES } from '../types';

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
  const [selectedFilter, setSelectedFilter] = useState('active'); // 'all', 'active', 'in_progress', 'resolved'
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [staffNote, setStaffNote] = useState('');

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
    const note = staffNote.trim() || `Ticket updated to ${nextStatus} by Campus Facilities Team`;
    onUpdateCivicStatus(issueId, nextStatus, note);
    setStaffNote('');
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
        <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-stone-200 shadow-modal text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Facility Staff Portal</h2>
            <p className="text-xs text-stone-500 mt-1">Enter staff authorization passcode to access the operations dashboard</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (default: admin)..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 text-center"
            />

            {authError && (
              <p className="text-xs text-rose-600 font-medium">Incorrect passcode. Try "admin".</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCloseAdminPortal}
                className="flex-1 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200"
              >
                Back to Citizen App
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
              >
                Unlock Dashboard
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
      <div className="bg-stone-950 text-white p-6 sm:p-7 rounded-3xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-400 text-xs mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-emerald-400">Authenticated Staff Workspace</span>
            <span>•</span>
            <span>Facility Dispatcher Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Campus Infrastructure Operations
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
            Triage open community tickets, assign repair teams, and close resolved hazards.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onResetData}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center space-x-1.5 transition-all"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={onCloseAdminPortal}
            className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-semibold hover:bg-stone-100 transition-all flex items-center space-x-1.5 shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public App</span>
          </button>
        </div>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-subtle space-y-1">
          <div className="text-xs text-stone-500 font-medium">Resolution Rate</div>
          <div className="text-2xl font-bold text-stone-900">{resolutionRate}%</div>
          <div className="text-[11px] text-stone-400">{resolvedCivic.length} of {civicIssues.length} fixed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-subtle space-y-1">
          <div className="text-xs text-stone-500 font-medium">Active Open Tickets</div>
          <div className="text-2xl font-bold text-amber-600">{unresolvedCivic.length}</div>
          <div className="text-[11px] text-stone-400">{unresolvedCivic.filter(i => i.urgencyUpvotes >= 20).length} high priority</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-subtle space-y-1">
          <div className="text-xs text-stone-500 font-medium">In Active Repair</div>
          <div className="text-2xl font-bold text-blue-600">{inProgressCivic.length}</div>
          <div className="text-[11px] text-stone-400">Crews dispatched on site</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-subtle space-y-1">
          <div className="text-xs text-stone-500 font-medium">Target SLA Turnaround</div>
          <div className="text-2xl font-bold text-stone-900">&lt; 48h</div>
          <div className="text-[11px] text-emerald-600 font-medium">94% within SLA window</div>
        </div>
      </div>

      {/* Operations Work Queue */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-subtle overflow-hidden">
        
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-900">
            <Wrench className="w-4 h-4 text-stone-500" />
            <span>Facility Ticket Queue ({filteredIssues.length})</span>
          </div>

          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'active' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
              }`}
            >
              Active ({unresolvedCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('in_progress')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'in_progress' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
              }`}
            >
              In Progress ({inProgressCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('resolved')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'resolved' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
              }`}
            >
              Resolved ({resolvedCivic.length})
            </button>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'all' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500'
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
          <div className="divide-y divide-stone-100">
            {filteredIssues.map((issue) => {
              const isSelected = selectedIssueId === issue.id;

              return (
                <div key={issue.id} className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left Details */}
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono font-bold text-stone-400">#{issue.id.slice(-4)}</span>
                        <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {issue.category}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                          issue.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' :
                          issue.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                          issue.status === 'acknowledged' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-amber-700 font-semibold flex items-center space-x-0.5">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{issue.urgencyUpvotes} Votes</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900">{issue.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-stone-500">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{issue.location?.name}</span>
                        <span>•</span>
                        <span>Reported by {issue.reporterName}</span>
                      </div>
                    </div>

                    {/* Right Workflow Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {issue.status === 'reported' && (
                        <button
                          onClick={() => handleAdvanceStatus(issue.id, 'acknowledged')}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-all"
                        >
                          Acknowledge
                        </button>
                      )}

                      {(issue.status === 'reported' || issue.status === 'acknowledged') && (
                        <button
                          onClick={() => handleAdvanceStatus(issue.id, 'in_progress')}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition-all"
                        >
                          Dispatch Crew
                        </button>
                      )}

                      {issue.status !== 'resolved' && (
                        <button
                          onClick={() => handleAdvanceStatus(issue.id, 'resolved')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-all flex items-center space-x-1 shadow-subtle"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      {issue.status === 'resolved' && (
                        <span className="text-xs text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded-lg">
                          ✓ Closed & Verified
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
