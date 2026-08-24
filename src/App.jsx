import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CivicIssuesView from './components/CivicIssuesView';
import CivicReportModal from './components/CivicReportModal';
import CivicDetailModal from './components/CivicDetailModal';
import LostFoundView from './components/LostFoundView';
import LostFoundModal from './components/LostFoundModal';
import LostFoundDetailModal from './components/LostFoundDetailModal';
import InteractiveMap from './components/InteractiveMap';
import AdminPortal from './components/AdminPortal';
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
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('public'); // 'public' or 'admin'
  const [activeTab, setActiveTab] = useState('civic'); // 'civic', 'lostfound', 'map'
  const [civicIssues, setCivicIssues] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);

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

  const updateAndSaveCivicIssues = (newIssues) => {
    setCivicIssues(newIssues);
    saveCivicIssues(newIssues);
  };

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
          note: note || `Status updated to ${newStatus}`,
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
    if (window.confirm('Reset all demo data to initial sample dataset?')) {
      const reset = resetAllToDefault();
      setCivicIssues(reset.civicIssues);
      setLostFoundItems(reset.lostFound);
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
      <div className="min-h-screen bg-canvas text-stone-900 flex flex-col font-sans selection:bg-stone-200">
        
        {/* PUBLIC VIEW */}
        {viewMode === 'public' && (
          <>
            {/* Minimal Navbar */}
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenReportModal={handleOpenReportModal}
              onOpenAdminPortal={() => setViewMode('admin')}
              civicCount={civicIssues.length}
              lostFoundCount={lostFoundItems.length}
            />

            {/* Main App Container */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
              
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

            </main>

            {/* Minimal Footer */}
            <footer className="mt-auto border-t border-stone-200/60 bg-white py-6 px-4 text-xs text-stone-500">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-stone-900">CivicBloom & FoundHub</span>
                  <span>•</span>
                  <span>Community Issue Pipeline</span>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewMode('admin')}
                    className="hover:text-stone-900 font-medium flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Facility Staff Portal</span>
                  </button>
                  <span>•</span>
                  <span>MIT License</span>
                </div>
              </div>
            </footer>
          </>
        )}

        {/* DEDICATED SEPARATE STAFF OPERATIONS PORTAL */}
        {viewMode === 'admin' && (
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
            <AdminPortal
              civicIssues={civicIssues}
              lostFoundItems={lostFoundItems}
              onUpdateCivicStatus={handleUpdateCivicStatus}
              onResetData={handleResetData}
              onCloseAdminPortal={() => setViewMode('public')}
            />
          </div>
        )}

        {/* MODALS */}

        {/* Civic Issue Report Modal */}
        <CivicReportModal
          isOpen={isCivicModalOpen}
          onClose={() => setIsCivicModalOpen(false)}
          onSubmit={handleCreateCivicIssue}
          existingIssues={civicIssues}
          onUpvoteAndClose={handleUpvoteAndCloseDuplicate}
        />

        {/* Civic Issue Detail Modal */}
        {selectedCivicIssue && (
          <CivicDetailModal
            issue={selectedCivicIssue}
            onClose={() => setSelectedCivicIssue(null)}
            onUpvote={handleUpvoteCivicIssue}
            onRateSeverity={handleRateSeverity}
            onVerifyIssue={handleVerifyIssue}
            onAddComment={handleAddCivicComment}
            onUpdateStatus={handleUpdateCivicStatus}
          />
        )}

        {/* Lost & Found Post Modal */}
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

        {/* PWA Install Prompt Banner */}
        <PWAInstallBanner />

      </div>
    </EdgeStoreProvider>
  );
}
