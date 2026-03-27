import { useState, useEffect } from 'react';
import integrationService from '../utils/integrationService';
import { initialData } from '../data';

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedSubscriptions = localStorage.getItem('subscriptions');
      const savedHistory = localStorage.getItem('subscriptionHistory');
      
      if (savedSubscriptions) {
        const parsed = JSON.parse(savedSubscriptions);
        // Validate data structure
        if (Array.isArray(parsed)) {
          setSubscriptions(parsed);
        }
      } else {
        // Initialize with sample data if no saved data exists
        if (initialData.subscriptions && initialData.subscriptions.length > 0) {
          setSubscriptions(initialData.subscriptions);
          localStorage.setItem('subscriptions', JSON.stringify(initialData.subscriptions));
        }
        if (initialData.subscriptionHistory && initialData.subscriptionHistory.length > 0) {
          setHistory(initialData.subscriptionHistory);
          localStorage.setItem('subscriptionHistory', JSON.stringify(initialData.subscriptionHistory));
        }
      }
      
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } else if (!savedSubscriptions) {
        // Load initial history if no saved data
        if (initialData.subscriptionHistory && initialData.subscriptionHistory.length > 0) {
          setHistory(initialData.subscriptionHistory);
        }
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      // Initialize with empty state if data is corrupted
      setSubscriptions([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (!loading && subscriptions.length >= 0) {
      try {
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded');
          alert('Storage limit reached. Please export your data and clear old records.');
        } else {
          console.error('Error saving subscriptions:', error);
        }
      }
    }
  }, [subscriptions, loading]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!loading && history.length >= 0) {
      try {
        localStorage.setItem('subscriptionHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
  }, [history, loading]);

  return {
    subscriptions,
    setSubscriptions,
    history,
    setHistory,
    syncStatus,
    setSyncStatus,
    loading,
    
    // Create new subscription
    createSubscription: async (email, plan = 'Basic', additionalData = {}) => {
      // Validate email format
      if (!integrationService.validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      
      // Check for duplicate email
      const duplicate = subscriptions.find(
        sub => sub.email.toLowerCase() === email.toLowerCase()
      );
      if (duplicate) {
        throw new Error('Customer with this email already exists');
      }
      
      // Validate plan
      if (!integrationService.validatePlan(plan)) {
        throw new Error(`Invalid service plan. Must be one of: Basic, Pro, Enterprise`);
      }
      
      // Create new customer record
      const now = new Date().toISOString();
      const newSubscription = {
        id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        email,
        name: additionalData.name || '',
        company: additionalData.company || '',
        subscriptionStatus: 'Pending',
        servicePlan: plan,
        registrationDate: now,
        lastModified: now,
        source: 'manual'
      };
      
      // Create initial history record
      const historyRecord = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        customerId: newSubscription.id,
        changeType: 'created',
        oldValue: null,
        newValue: 'Pending',
        timestamp: now,
        source: 'user'
      };
      
      // Update state
      setSubscriptions([...subscriptions, newSubscription]);
      setHistory([...history, historyRecord]);
      
      return newSubscription;
    },
    
    // Update subscription status
    updateStatus: async (id, newStatus) => {
      // Validate status
      if (!integrationService.validateStatus(newStatus)) {
        throw new Error(`Invalid subscription status. Must be one of: Active, Expired, Trial, Cancelled, Pending`);
      }
      
      // Find subscription
      const subscription = subscriptions.find(sub => sub.id === id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      const oldStatus = subscription.subscriptionStatus;
      
      // Don't create history if status hasn't changed
      if (oldStatus === newStatus) {
        return;
      }
      
      const now = new Date().toISOString();
      
      // Update subscription
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === id
          ? { ...sub, subscriptionStatus: newStatus, lastModified: now }
          : sub
      );
      
      // Create history record
      const historyRecord = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        customerId: id,
        changeType: 'status_change',
        oldValue: oldStatus,
        newValue: newStatus,
        timestamp: now,
        source: 'user'
      };
      
      setSubscriptions(updatedSubscriptions);
      setHistory([...history, historyRecord]);
    },
    
    // Update service plan
    updatePlan: async (id, newPlan) => {
      // Validate plan
      if (!integrationService.validatePlan(newPlan)) {
        throw new Error(`Invalid service plan. Must be one of: Basic, Pro, Enterprise`);
      }
      
      // Find subscription
      const subscription = subscriptions.find(sub => sub.id === id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      const oldPlan = subscription.servicePlan;
      
      // Don't create history if plan hasn't changed
      if (oldPlan === newPlan) {
        return;
      }
      
      const now = new Date().toISOString();
      
      // Update subscription
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === id
          ? { ...sub, servicePlan: newPlan, lastModified: now }
          : sub
      );
      
      // Create history record
      const historyRecord = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        customerId: id,
        changeType: 'plan_change',
        oldValue: oldPlan,
        newValue: newPlan,
        timestamp: now,
        source: 'user'
      };
      
      setSubscriptions(updatedSubscriptions);
      setHistory([...history, historyRecord]);
    },
    
    // Filter subscriptions by status
    filterByStatus: (statusArray) => {
      if (!statusArray || statusArray.length === 0) {
        return subscriptions;
      }
      return subscriptions.filter(sub => statusArray.includes(sub.subscriptionStatus));
    },
    
    // Filter subscriptions by plan
    filterByPlan: (planArray) => {
      if (!planArray || planArray.length === 0) {
        return subscriptions;
      }
      return subscriptions.filter(sub => planArray.includes(sub.servicePlan));
    },
    
    // Filter by multiple criteria
    filterSubscriptions: (filters) => {
      let filtered = subscriptions;
      
      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(sub => filters.status.includes(sub.subscriptionStatus));
      }
      
      if (filters.plans && filters.plans.length > 0) {
        filtered = filtered.filter(sub => filters.plans.includes(sub.servicePlan));
      }
      
      return filtered;
    },
    
    // Get history for specific customer
    getHistory: (customerId) => {
      const customerHistory = history.filter(h => h.customerId === customerId);
      
      // Filter to last 24 months
      const twentyFourMonthsAgo = new Date();
      twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);
      
      const recentHistory = customerHistory.filter(h => 
        new Date(h.timestamp) >= twentyFourMonthsAgo
      );
      
      // Sort in reverse chronological order (newest first)
      return recentHistory.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    
    // Export data in CSV or JSON format
    exportData: (format = 'json') => {
      if (format === 'csv') {
        // CSV export
        const headers = ['ID', 'Email', 'Name', 'Company', 'Status', 'Plan', 'Registration Date', 'Last Modified', 'Source'];
        const rows = subscriptions.map(sub => [
          sub.id,
          sub.email,
          sub.name || '',
          sub.company || '',
          sub.subscriptionStatus,
          sub.servicePlan,
          sub.registrationDate,
          sub.lastModified,
          sub.source
        ]);
        
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
      } else {
        // JSON export
        return JSON.stringify(subscriptions, null, 2);
      }
    },
    
    // Get count by status
    getCountByStatus: () => {
      const counts = {};
      subscriptions.forEach(sub => {
        counts[sub.subscriptionStatus] = (counts[sub.subscriptionStatus] || 0) + 1;
      });
      return counts;
    },
    
    // Get count by plan
    getCountByPlan: () => {
      const counts = {};
      subscriptions.forEach(sub => {
        counts[sub.servicePlan] = (counts[sub.servicePlan] || 0) + 1;
      });
      return counts;
    }
  };
};

export default useSubscriptions;
