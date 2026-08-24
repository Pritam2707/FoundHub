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
import { 
  getStoredCivicIssues, 
  saveCivicIssues, 
  getStoredLostFound, 
  saveLostFound,
  resetAllToDefault 
} from './services/storage';
import { Sparkles, Heart, ShieldCheck, Github } from 'lucide-react';

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

  // Load from local storage on mount
  useEffect(() => {
    const issues = getStoredCivicIssues();
    const lfItems = getStoredLostFound();
    setCivicIssues(issues);
    setLostFoundItems(lfItems);
  }, []);

  // Save civic issues on change
  const updateAndSaveCivicIssues = (newIssues) => {
    setCivicIssues(newIssues);
    saveCivicIssues(newIssues);
  };

  // Save lost & found on change
  const updateAndSaveLostFound = (newItems) => {
    setLostFoundItems(newItems);
    saveLostFound(newItems);
  };

  // Upvote Civic Issue
  const handleUpvoteCivicIssue = (issueId) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        const isUpvoted = issue.userUpvoted;
        return {
          ...issue,
          userUpvoted: !isUpvoted,
          urgencyUpvotes: isUpvoted ? Math.max(0, issue.urgencyUpvotes - 1) : issue.urgencyUpvotes + 1,
        };
      }
      return issue;
    });
    updateAndSaveCivicIssues(updated);

    // If modal is open, also sync modal view
    if (selectedCivicIssue?.id === issueId) {
      setSelectedCivicIssue(updated.find(i => i.id === issueId));
    }
  };

  // Rate Severity
  const handleRateSeverity = (issueId, severityLevel) => {
    const updated = civicIssues.map((issue) => {
      if (issue.id === issueId) {
        return { ...issue, severity: severityLevel };
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
        return { ...issue, verifiedCount: (issue.verifiedCount || 0) + 1 };
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
        return {
          ...issue,
          comments: [...(issue.comments || []), comment],
        };
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
        return {
          ...issue,
          status: newStatus,
          statusHistory: [...(issue.statusHistory || []), historyEntry],
        };
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
  };

  // Create new lost & found item
  const handleCreateLostFoundItem = (newItem) => {
    const updated = [newItem, ...lostFoundItems];
    updateAndSaveLostFound(updated);
  };

  // Mark Lost & Found item as Reunited
  const handleMarkLostFoundReunited = (itemId) => {
    const updated = lostFoundItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'reunited',
          reunitedDate: new Date().toISOString(),
        };
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
        return {
          ...item,
          comments: [...(item.comments || []), comment],
        };
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

      {/* Civic Issue Report Modal with Duplicate Warning */}
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

      {/* Soft Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200/60 bg-surface py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-brand-dark">CivicBloom & FoundHub</span>
            <span>•</span>
            <span>Verified Submit ➔ Verify ➔ Resolve Pipeline</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-pastel-lavender-dark" />
              <span>Smart Proximity & Cross-Matching</span>
            </span>
            <span>•</span>
            <span className="text-stone-500">Pastel Minimal UI</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
