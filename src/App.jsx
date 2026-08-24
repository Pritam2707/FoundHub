import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CivicIssuesView from './components/CivicIssuesView';
import CivicReportModal from './components/CivicReportModal';
import CivicDetailModal from './components/CivicDetailModal';
import LostFoundView from './components/LostFoundView';
import LostFoundModal from './components/LostFoundModal';
import LostFoundDetailModal from './components/LostFoundDetailModal';
import InteractiveMap from './components/InteractiveMap';
import AdminPanel from './components/AdminPanel';
import PWAInstallBanner from './components/PWAInstallBanner';
import { EdgeStoreProvider } from './services/edgestore';
import { 
  subscribeToCivicIssues, 
  subscribeToLostFound, 
  syncCivicIssue, 
  syncLostFoundItem,
  isFirebaseConfigured
} from './services/firebase';
import { 
  getStoredCivicIssues, 
  saveCivicIssues, 
  getStoredLostFound, 
  saveLostFound,
  resetAllToDefault 
} from './services/storage';
import { Sparkles, Heart, ShieldCheck, Database, Cloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('civic'); // 'civic', 'lostfound', 'map', 'admin'
  const [civicIssues, setCivicIssues] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals state
  const [selectedCivicIssue, setSelectedCivicIssue] = useState(null);
  const [selectedLostFoundItem, setSelectedLostFoundItem] = useState(null);
  const [isCivicModalOpen, setIsCivicModalOpen] = useState(false);
  const [isLostFoundModalOpen, setIsLostFoundModalOpen] = useState(false);
  const [lostFoundModalType, setLostFoundModalType] = useState('lost');

  // Real-time Firestore & Local Persistence Subscriptions
  useEffect(() => {
    const unsubCivic = subscribeToCivicIssues((issues) => {
      setCivicIssues(issues);
    });

    const unsubLostFound = subscribeToLostFound((items) => {
      setLostFoundItems(items);
    });

    return () => {
      if (typeof unsubCivic === 'function') unsubCivic();
      if (typeof unsubLostFound === 'function') unsubLostFound();
    };
  }, []);

  // Save and Sync civic issues
  const updateAndSaveCivicIssues = (newIssues) => {
    setCivicIssues(newIssues);
    saveCivicIssues(newIssues);
  };

  // Save and Sync lost & found
  const updateAndSaveLostFound = (newItems) => {
    setLostFoundItems(newItems);
    saveLostFound(newItems);
  };

  // Upvote Civic Issue
  const handleUpvoteCivicIssue = (issueId) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const isUpvoted = issue.userUpvoted;
        const modified = {
          ...issue,
          userUpvoted: !isUpvoted,
          urgencyUpvotes: isUpvoted ? Math.max(0, issue.urgencyUpvotes - 1) : issue.urgencyUpvotes + 1,
        };
        syncCivicIssue(modified);
        return modified;
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Rate Severity
  const handleRateSeverity = (issueId, severityLevel) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const modified = { ...issue, severity: severityLevel };
        syncCivicIssue(modified);
        return modified;
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Verify Issue
  const handleVerifyIssue = (issueId) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const modified = { ...issue, verifiedCount: (issue.verifiedCount || 0) + 1 };
        syncCivicIssue(modified);
        return modified;
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Add Comment to Civic Issue
  const handleAddCivicComment = (issueId, comment) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const modified = {
          ...issue,
          comments: [...(issue.comments || []), comment],
        };
        syncCivicIssue(modified);
        return modified;
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Update Status in Pipeline
  const handleUpdateCivicStatus = (issueId, newStatus, note) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const historyEntry = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status transitioned to ${newStatus}`,
        };
        const modified = {
          ...issue,
          status: newStatus,
          statusHistory: [...(issue.statusHistory || []), historyEntry],
        };
        syncCivicIssue(modified);
        return modified;
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Handle Duplicate Upvote and Close
  const handleUpvoteAndCloseDuplicate = (existingIssueId) => {
    handleUpvoteCivicIssue(existingIssueId);
    setIsCivicModalOpen(false);
  };

  // Create new civic issue
  const handleCreateCivicIssue = (newIssue) => {
    const updated = [newIssue, ...civicIssues];
    updateAndSaveCivicIssues(updated);
    syncCivicIssue(newIssue);
  };

  // Create new lost & found item
  const handleCreateLostFoundItem = (newItem) => {
    const updated = [newItem, ...lostFoundItems];
    updateAndSaveLostFound(updated);
    syncLostFoundItem(newItem);
  };

  // Mark Lost & Found item as Reunited
  const handleMarkLostFoundReunited = (itemId) => {
    const updated = lostFoundItems.map((item) => {
      if (item.id === itemId) {
        const modified = {
          ...item,
          status: 'reunited',
          reunitedDate: new Date().toISOString(),
        };
        syncLostFoundItem(modified);
        return modified;
      }
      return item;
    });
    updateAndSaveLostFound(updated);

    if (selectedLostFoundItem?.id === itemId) {
      setSelectedLostFoundItem(updated.find(i => i.id === itemId));
    }
  };

  // Add Comment to Lost & Found item
  const handleAddLostFoundComment = (itemId, comment) => {
    const updated = lostFoundItems.map((item) => {
      if (item.id === itemId) {
        const modified = {
          ...item,
          comments: [...(item.comments || []), comment],
        };
        syncLostFoundItem(modified);
        return modified;
      }
      return item;
    });
    updateAndSaveLostFound(updated);

    if (selectedLostFoundItem?.id === itemId) {
      setSelectedLostFoundItem(updated.find(i => i.id === itemId));
    }
  };

  // Reset to default seed data
  const handleResetData = () => {
    if (window.confirm('Reset all demo data to default sample items?')) {
      const reset = resetAllToDefault();
      setCivicIssues(reset.civicIssues);
      setLostFoundItems(reset.lostFound);
      // Sync defaults to Firestore
      reset.civicIssues.forEach(syncCivicIssue);
      reset.lostFound.forEach(syncLostFoundItem);
    }
  };

  const handleOpenReportModal = (type) => {
    if (type === 'civic') {
      setIsCivicModalOpen(true);
    } else {
      setLostFoundModalType('lost');
      setIsLostFoundModalOpen(true);
    }
  };

  return (
    <EdgeStoreProvider>
      <div className="min-h-screen bg-canvas text-brand-dark flex flex-col font-sans selection:bg-pastel-lavender">
        
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenReportModal={handleOpenReportModal}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          civicCount={civicIssues.length}
          lostFoundCount={lostFoundItems.length}
        />

        {/* Real-time Cloud Status Bar */}
        <div className="bg-white/60 border-b border-stone-200/50 py-1 px-4 text-[11px] text-stone-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <Database className="w-3 h-3 text-pastel-peach-dark" />
                <span>Firestore: <strong>{isFirebaseConfigured ? 'Live Real-Time Sync' : 'Offline Cache Active'}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Cloud className="w-3 h-3 text-pastel-sky-dark" />
                <span>EdgeStore: <strong>Cloud Bucket Ready</strong></span>
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 text-pastel-mint-dark font-medium">
              <span className="w-2 h-2 rounded-full bg-pastel-mint-dark animate-pulse" />
              <span>Node.js Backend & PWA Ready</span>
            </div>
          </div>
        </div>

        {/* Main App Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          
          {/* Civic Issues View */}
          {activeTab === 'civic' && (
            <CivicIssuesView
              issues={civicIssues}
              onSelectIssue={(issue) => setSelectedCivicIssue(issue)}
              onUpvoteIssue={handleUpvoteCivicIssue}
              onOpenReportModal={() => setIsCivicModalOpen(true)}
            />
          )}

          {/* Lost & Found View */}
          {activeTab === 'lostfound' && (
            <LostFoundView
              items={lostFoundItems}
              onSelectItem={(item) => setSelectedLostFoundItem(item)}
              onOpenCreateModal={(type) => {
                setLostFoundModalType(type);
                setIsLostFoundModalOpen(true);
              }}
            />
          )}

          {/* Live Interactive Map */}
          {activeTab === 'map' && (
            <InteractiveMap
              civicIssues={civicIssues}
              lostFoundItems={lostFoundItems}
              onSelectCivicIssue={(issue) => setSelectedCivicIssue(issue)}
              onSelectLostFound={(item) => setSelectedLostFoundItem(item)}
            />
          )}

          {/* Facility Ops & Insights */}
          {activeTab === 'admin' && (
            <AdminPanel
              civicIssues={civicIssues}
              lostFoundItems={lostFoundItems}
              onUpdateCivicStatus={handleUpdateCivicStatus}
              onResetData={handleResetData}
            />
          )}

        </main>

        {/* MODALS */}

        {/* Civic Issue Report Modal with Duplicate Warning & EdgeStore Upload */}
        <CivicReportModal
          isOpen={isCivicModalOpen}
          onClose={() => setIsCivicModalOpen(false)}
          onSubmit={handleCreateCivicIssue}
          existingIssues={civicIssues}
          onUpvoteAndClose={handleUpvoteAndCloseDuplicate}
        />

        {/* Civic Issue Full Detail Modal */}
        {selectedCivicIssue && (
          <CivicDetailModal
            issue={selectedCivicIssue}
            onClose={() => setSelectedCivicIssue(null)}
            onUpvote={handleUpvoteCivicIssue}
            onRateSeverity={handleRateSeverity}
            onVerifyIssue={handleVerifyIssue}
            onAddComment={handleAddCivicComment}
            onUpdateStatus={handleUpdateCivicStatus}
            isAdmin={isAdmin}
          />
        )}

        {/* Lost & Found Post Modal with EdgeStore Upload */}
        <LostFoundModal
          isOpen={isLostFoundModalOpen}
          onClose={() => setIsLostFoundModalOpen(false)}
          onSubmit={handleCreateLostFoundItem}
          initialType={lostFoundModalType}
        />

        {/* Lost & Found Detail Modal */}
        {selectedLostFoundItem && (
          <LostFoundDetailModal
            item={selectedLostFoundItem}
            allItems={lostFoundItems}
            onClose={() => setSelectedLostFoundItem(null)}
            onMarkReunited={handleMarkLostFoundReunited}
            onAddComment={handleAddLostFoundComment}
            onSelectItem={(item) => setSelectedLostFoundItem(item)}
          />
        )}

        {/* PWA Mobile & Desktop Install Prompt Banner */}
        <PWAInstallBanner />

        {/* Soft Minimal Footer */}
        <footer className="mt-auto border-t border-stone-200/60 bg-surface py-6 px-4 text-center text-xs text-stone-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-brand-dark">CivicBloom & FoundHub</span>
              <span>•</span>
              <span>Submit ➔ Verify ➔ Resolve Pipeline</span>
            </div>

            <div className="flex items-center space-x-4 text-stone-400">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-pastel-lavender-dark" />
                <span>PWA • Firebase Firestore • EdgeStore</span>
              </span>
              <span>•</span>
              <span className="text-stone-500">MIT Licensed</span>
            </div>
          </div>
        </footer>

      </div>
    </EdgeStoreProvider>
  );
}
