// IntegrationService - Handles customer data validation and external system integration

const VALID_STATUSES = ['Active', 'Expired', 'Trial', 'Cancelled', 'Pending'];
const VALID_PLANS = ['Basic', 'Pro', 'Enterprise'];

class IntegrationService {
  // Email validation with regex
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate subscription status enum
  validateStatus(status) {
    return VALID_STATUSES.includes(status);
  }

  // Validate service plan enum
  validatePlan(plan) {
    return VALID_PLANS.includes(plan);
  }

  // Validate complete customer data object
  validateCustomerData(data) {
    const errors = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.subscriptionStatus) {
      errors.push('Subscription status is required');
    } else if (!this.validateStatus(data.subscriptionStatus)) {
      errors.push(`Invalid subscription status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (!data.servicePlan) {
      errors.push('Service plan is required');
    } else if (!this.validatePlan(data.servicePlan)) {
      errors.push(`Invalid service plan. Must be one of: ${VALID_PLANS.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Generate error messages for validation failures
  getValidationErrorMessage(errors) {
    return errors.join('; ');
  }

  // Mock external system data fetching
  async fetchExternalData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock customer data from external systems
    return [
      {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        company: 'Tech Solutions',
        plan: 'Pro',
        status: 'Active',
        registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        sourceSystem: 'system_a'
      },
      {
        email: 'bob@startup.io',
        name: 'Bob Smith',
        company: 'Startup Inc',
        plan: 'Basic',
        status: 'Trial',
        registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sourceSystem: 'system_b'
      }
    ];
  }

  // Merge duplicate email records
  mergeCustomerRecords(existingRecords, newData) {
    const recordMap = new Map();
    
    // Add existing records to map
    existingRecords.forEach(record => {
      recordMap.set(record.email.toLowerCase(), record);
    });
    
    // Merge or add new data
    newData.forEach(data => {
      const email = data.email.toLowerCase();
      const existing = recordMap.get(email);
      
      if (existing) {
        // Merge: prefer most recent data
        const existingTime = new Date(existing.lastModified || existing.registrationDate).getTime();
        const newTime = new Date(data.registeredAt).getTime();
        
        if (newTime > existingTime) {
          recordMap.set(email, {
            ...existing,
            name: data.name || existing.name,
            company: data.company || existing.company,
            servicePlan: data.plan || existing.servicePlan,
            subscriptionStatus: data.status || existing.subscriptionStatus,
            lastModified: new Date().toISOString(),
            source: data.sourceSystem
          });
        }
      } else {
        // Add new record
        recordMap.set(email, {
          id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          email: data.email,
          name: data.name || '',
          company: data.company || '',
          subscriptionStatus: data.status || 'Pending',
          servicePlan: data.plan || 'Basic',
          registrationDate: data.registeredAt,
          lastModified: new Date().toISOString(),
          source: data.sourceSystem
        });
      }
    });
    
    return Array.from(recordMap.values());
  }

  // Stub for notifying external systems (future integration)
  async notifyExternalSystems(customerId, changes) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Notifying external systems about customer ${customerId}:`, changes);
    return { success: true };
  }

  // Sync data with retry logic and exponential backoff
  async syncData(existingRecords = []) {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    let attempt = 0;
    let lastError = null;
    
    while (attempt < maxRetries) {
      try {
        const externalData = await this.fetchExternalData();
        const mergedRecords = this.mergeCustomerRecords(existingRecords, externalData);
        
        return {
          success: true,
          updated: mergedRecords.length,
          failed: 0,
          records: mergedRecords,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    console.error('Sync failed after', maxRetries, 'attempts:', lastError);
    return {
      success: false,
      updated: 0,
      failed: existingRecords.length,
      error: lastError?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }

  // Retry sync failures from manual queue
  async retrySyncFailures(failedRecords) {
    const results = [];
    
    for (const record of failedRecords) {
      try {
        await this.notifyExternalSystems(record.id, record);
        results.push({ id: record.id, success: true });
      } catch (error) {
        results.push({ id: record.id, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Get sync status for tracking
  getSyncStatus(systemId, lastSyncResult) {
    return {
      systemId,
      lastSync: lastSyncResult?.timestamp || null,
      status: lastSyncResult?.success ? 'success' : 'failed',
      recordsUpdated: lastSyncResult?.updated || 0,
      failedRecords: lastSyncResult?.failed > 0 ? ['pending_review'] : [],
      nextRetry: lastSyncResult?.success ? null : new Date(Date.now() + 60000).toISOString()
    };
  }
}

export default new IntegrationService();
export { VALID_STATUSES, VALID_PLANS };
