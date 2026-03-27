# Design Document: CRM Subscription Management

## Overview

The CRM Subscription Management feature extends the existing Antimonday CRM React application to provide centralized customer subscription tracking and management capabilities. This feature integrates customer data from multiple sources, tracks subscription status and service plans, and provides a marketing dashboard for data-driven decision making.

### Key Design Decisions

**Client-Side Architecture**: Given the existing application's architecture (localStorage-based data persistence, no backend API), this design implements a client-side solution that simulates external system integration through mock data and scheduled updates. This approach maintains consistency with the existing codebase while providing the foundation for future backend integration.

**Component Reusability**: The design leverages existing UI patterns from the Contacts and Dashboard pages, ensuring visual consistency and reducing development effort.

**Data Model**: The subscription data model extends the existing contact structure, allowing seamless integration with the current contact management system.

### Technology Stack

- **Frontend Framework**: React 19.2.4 with React Router 7.13.1
- **State Management**: React useState/useEffect hooks with localStorage persistence
- **UI Components**: Lucide React icons, inline styled components
- **Data Persistence**: localStorage (consistent with existing Contacts implementation)
- **Build Tool**: Vite 8.0.1

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  App Router (React Router)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┼─────────────────────────────┐  │
│  │         Sidebar         │         Topbar              │  │
│  └─────────────────────────┴─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │                    Page Components                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │Dashboard │  │Contacts  │  │  Subscriptions     │  │  │
│  │  │          │  │          │  │  (NEW)             │  │  │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Data Management Layer                     │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  SubscriptionManager (hooks/useSubscriptions.js) │ │  │
│  │  │  - State management                              │ │  │
│  │  │  - CRUD operations                               │ │  │
│  │  │  - Status/plan updates                           │ │  │
│  │  │  - History tracking                              │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  IntegrationService (utils/integrationService.js)│ │  │
│  │  │  - Mock external system integration              │ │  │
│  │  │  - Data validation                               │ │  │
│  │  │  - Sync simulation                               │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              localStorage (Data Store)                 │  │
│  │  - subscriptions: Customer subscription records        │  │
│  │  - subscriptionHistory: Change history                 │  │
│  │  - syncStatus: Integration sync status                 │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Registration Flow**: User registration → Email validation → Create subscription record → Store in localStorage
2. **Integration Flow**: Mock external system → Validate data → Merge/create records → Update localStorage → Trigger sync
3. **Update Flow**: User action → Update subscription → Create history record → Persist to localStorage → Update UI
4. **Query Flow**: UI request → Read from localStorage → Filter/transform data → Render components

## Components and Interfaces

### 1. Subscriptions Page Component

**File**: `app/src/pages/Subscriptions.jsx`

**Purpose**: Main dashboard for viewing and managing customer subscriptions

**Key Features**:
- Display subscription statistics (total customers by status and plan)
- List all customer subscriptions with filtering capabilities
- View detailed subscription history for individual customers
- Auto-refresh data every 30 seconds
- Export functionality (CSV/JSON)

**Props**: None (uses hooks for data management)

**State**:
```javascript
{
  subscriptions: Array<CustomerRecord>,
  selectedCustomer: CustomerRecord | null,
  filters: { status: string[], plans: string[] },
  syncStatus: Object,
  lastUpdate: timestamp
}
```

### 2. SubscriptionManager Hook

**File**: `app/src/hooks/useSubscriptions.js`

**Purpose**: Custom React hook for subscription data management

**Interface**:
```javascript
const useSubscriptions = () => {
  return {
    // State
    subscriptions: Array<CustomerRecord>,
    history: Array<HistoryRecord>,
    syncStatus: SyncStatus,
    
    // Operations
    createSubscription: (email: string, plan: string) => Promise<CustomerRecord>,
    updateStatus: (id: string, status: string) => Promise<void>,
    updatePlan: (id: string, plan: string) => Promise<void>,
    getHistory: (id: string) => Array<HistoryRecord>,
    filterByStatus: (status: string) => Array<CustomerRecord>,
    filterByPlan: (plan: string) => Array<CustomerRecord>,
    exportData: (format: 'csv' | 'json') => string,
    
    // Integration
    syncWithExternalSystems: () => Promise<void>,
    getSyncStatus: () => SyncStatus
  };
};
```

### 3. IntegrationService Utility

**File**: `app/src/utils/integrationService.js`

**Purpose**: Simulate external system integration and data validation

**Interface**:
```javascript
class IntegrationService {
  // Validation
  validateEmail(email: string): boolean
  validateCustomerData(data: Object): { valid: boolean, errors: Array<string> }
  
  // Integration (mock)
  fetchExternalData(): Promise<Array<ExternalCustomerData>>
  notifyExternalSystems(customerId: string, changes: Object): Promise<void>
  
  // Sync management
  syncData(): Promise<{ success: boolean, updated: number, failed: number }>
  retrySyncFailures(): Promise<void>
}
```

### 4. UI Components

**SubscriptionCard**: Display individual subscription summary
**StatusBadge**: Visual indicator for subscription status
**PlanBadge**: Visual indicator for service plan
**HistoryTimeline**: Display subscription change history
**FilterPanel**: UI for filtering subscriptions
**ExportButton**: Trigger data export

## Data Models

### CustomerRecord

```javascript
{
  id: string,                    // Unique identifier (e.g., "sub_1234567890")
  email: string,                 // Customer email (unique, indexed)
  name: string,                  // Customer name (optional)
  company: string,               // Company name (optional)
  subscriptionStatus: string,    // "Active" | "Expired" | "Trial" | "Cancelled" | "Pending"
  servicePlan: string,           // "Basic" | "Pro" | "Enterprise"
  registrationDate: string,      // ISO 8601 timestamp
  lastModified: string,          // ISO 8601 timestamp
  source: string                 // Source system identifier (e.g., "system_a", "manual")
}
```

### HistoryRecord

```javascript
{
  id: string,                    // Unique identifier
  customerId: string,            // Reference to CustomerRecord.id
  changeType: string,            // "status_change" | "plan_change" | "created"
  oldValue: string | null,       // Previous value (null for creation)
  newValue: string,              // New value
  timestamp: string,             // ISO 8601 timestamp
  source: string                 // "user" | "system" | "integration"
}
```

### SyncStatus

```javascript
{
  systemId: string,              // External system identifier
  lastSync: string,              // ISO 8601 timestamp
  status: string,                // "success" | "failed" | "pending"
  recordsUpdated: number,        // Count of records updated in last sync
  failedRecords: Array<string>,  // IDs of records that failed to sync
  nextRetry: string | null       // ISO 8601 timestamp for next retry
}
```

### ExternalCustomerData

```javascript
{
  email: string,
  name: string,
  company: string,
  plan: string,
  status: string,
  registeredAt: string,
  sourceSystem: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Customer Data Validation

*For any* customer data object received from an external system, the validation function should return true only if all required fields (email, plan, status) are present and correctly formatted, and should return false with specific error details otherwise.

**Validates: Requirements 1.2, 1.3**

### Property 2: Email Deduplication

*For any* set of customer records with the same email address from different source systems, merging these records should result in exactly one Customer_Record with that email address, preserving the most recent data from all sources.

**Validates: Requirements 1.5, 4.5**

### Property 3: Status Enum Validation

*For any* subscription status value, the system should accept only the values "Active", "Expired", "Trial", "Cancelled", or "Pending", and reject any other value.

**Validates: Requirements 2.2**

### Property 4: Plan Enum Validation

*For any* service plan value, the system should accept only the values "Basic", "Pro", or "Enterprise", and reject any other value.

**Validates: Requirements 3.2**

### Property 5: Email Format Validation

*For any* string input, the email validation function should return true only for strings matching valid email format (containing @ symbol, valid domain structure), and should reject invalid formats with an appropriate error message.

**Validates: Requirements 4.2, 4.3**

### Property 6: New Registration Initial Status

*For any* valid email address used to create a new customer record, the resulting Customer_Record should have subscriptionStatus set to "Pending".

**Validates: Requirements 4.4**

### Property 7: Query and Filter Correctness

*For any* collection of customer records and any filter criteria (status, plan, or registration date), the filtered results should contain only records that match all specified criteria.

**Validates: Requirements 2.5, 5.2, 6.5**

### Property 8: Customer Count Aggregation

*For any* collection of customer records, when grouped by subscription status or service plan, the sum of counts across all groups should equal the total number of customer records.

**Validates: Requirements 3.4, 6.1, 6.2**

### Property 9: Status Change History Recording

*For any* customer record, when the subscription status changes from one value to another, a history record should be created containing the old status, new status, customer ID, and timestamp.

**Validates: Requirements 2.4, 7.1**

### Property 10: Plan Change History Recording

*For any* customer record, when the service plan changes from one value to another, a history record should be created containing the old plan, new plan, customer ID, and timestamp.

**Validates: Requirements 3.3, 7.2**

### Property 11: History Chronological Ordering

*For any* customer record with multiple history entries, retrieving the history should return records in chronological order (oldest to newest) or reverse chronological order (newest to oldest) as specified, with timestamps strictly increasing or decreasing respectively.

**Validates: Requirements 7.3, 7.4**

### Property 12: Referential Integrity

*For any* history record in the system, the customerId field should reference an existing Customer_Record ID in the data store.

**Validates: Requirements 5.4**

### Property 13: Export Format Round-Trip

*For any* collection of customer records, exporting to JSON format and then parsing should produce an equivalent collection, and exporting to CSV format should produce a valid CSV with all required fields present.

**Validates: Requirements 5.5**

### Property 14: Sync Retry Logic

*For any* synchronization operation that fails, the system should attempt to retry up to 3 times, and if all retries fail, should log the failure and add the record to a manual review queue.

**Validates: Requirements 8.2, 8.3**

### Property 15: Sync Timestamp Tracking

*For any* successful synchronization with an external system, the system should update the lastSync timestamp for that system ID in the sync status records.

**Validates: Requirements 8.4**

## Error Handling

### Validation Errors

**Email Validation Failures**:
- Invalid format: Return error with message "Invalid email format"
- Missing email: Return error with message "Email is required"
- Duplicate email: Return error with message "Customer with this email already exists"

**Status/Plan Validation Failures**:
- Invalid status: Return error with message "Invalid subscription status. Must be one of: Active, Expired, Trial, Cancelled, Pending"
- Invalid plan: Return error with message "Invalid service plan. Must be one of: Basic, Pro, Enterprise"

### Integration Errors

**External System Connection Failures**:
- Log error with system ID, timestamp, and error message
- Update sync status to "failed"
- Schedule retry with exponential backoff (1s, 2s, 4s)
- After 3 failures, add to manual review queue

**Data Merge Conflicts**:
- When merging records with conflicting data, prefer the most recent timestamp
- Log merge decisions for audit trail

### Storage Errors

**localStorage Quota Exceeded**:
- Display user-friendly error message
- Offer to export data before clearing old records
- Implement automatic cleanup of history older than 24 months

**Data Corruption**:
- Validate data structure on load
- If corruption detected, attempt recovery from backup
- If recovery fails, initialize with empty state and log error

### UI Error States

**Empty States**:
- No subscriptions: Display "No customer subscriptions found. New registrations will appear here."
- No history: Display "No subscription history available for this customer."
- No sync status: Display "Synchronization status unavailable."

**Loading States**:
- Show loading spinner during data fetch/sync operations
- Disable action buttons during operations to prevent duplicate submissions

**Network Simulation Errors**:
- Mock API failures for testing error handling
- Display retry options for failed operations

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of valid and invalid data
- Edge cases (empty strings, null values, boundary conditions)
- Error conditions and error messages
- Integration between components
- UI component rendering with specific data

**Property-Based Tests** focus on:
- Universal properties that hold across all inputs
- Validation logic with randomly generated data
- Data transformations and invariants
- Aggregation and filtering correctness

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness across the input space.

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript property-based testing library)

**Installation**:
```bash
npm install --save-dev fast-check
```

**Configuration**:
- Each property test must run a minimum of 100 iterations
- Each test must include a comment tag referencing the design property
- Tag format: `// Feature: crm-subscription-management, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
import fc from 'fast-check';

// Feature: crm-subscription-management, Property 1: Customer Data Validation
test('validates customer data correctly', () => {
  fc.assert(
    fc.property(
      fc.record({
        email: fc.emailAddress(),
        plan: fc.constantFrom('Basic', 'Pro', 'Enterprise'),
        status: fc.constantFrom('Active', 'Expired', 'Trial', 'Cancelled', 'Pending')
      }),
      (customerData) => {
        const result = validateCustomerData(customerData);
        expect(result.valid).toBe(true);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Coverage

**SubscriptionManager Hook**:
- Test createSubscription with valid email creates record with Pending status
- Test createSubscription with duplicate email returns error
- Test updateStatus changes status and creates history record
- Test updatePlan changes plan and creates history record
- Test filterByStatus returns only matching records
- Test filterByPlan returns only matching records
- Test exportData generates valid CSV format
- Test exportData generates valid JSON format

**IntegrationService**:
- Test validateEmail accepts valid email formats
- Test validateEmail rejects invalid email formats
- Test validateCustomerData accepts complete valid data
- Test validateCustomerData rejects missing required fields
- Test syncData merges duplicate email records
- Test syncData handles sync failures with retry logic
- Test retrySyncFailures implements exponential backoff

**Subscriptions Page**:
- Test renders subscription statistics correctly
- Test filters subscriptions by status
- Test filters subscriptions by plan
- Test displays customer details on selection
- Test auto-refresh updates data every 30 seconds
- Test export button triggers download

### Test Data Generators

For property-based tests, create generators for:
- Valid email addresses
- Invalid email addresses (missing @, invalid domain, etc.)
- Customer records with all valid fields
- Customer records with missing/invalid fields
- Subscription status values (valid and invalid)
- Service plan values (valid and invalid)
- History records with various timestamps
- Sync status objects

### Integration Testing

**End-to-End Scenarios**:
1. New customer registration → Email validation → Record creation → Verify in UI
2. Status update → History creation → Verify history display
3. Plan upgrade → History creation → Verify statistics update
4. Filter by status → Verify filtered results → Clear filter → Verify all results
5. Export data → Download file → Verify file contents
6. Mock sync failure → Verify retry attempts → Verify manual queue

### Performance Testing

While not part of unit/property tests, the following should be manually verified:
- Query performance with 100,000 records (< 2 seconds)
- Storage operations complete within 5 seconds
- UI remains responsive during data operations
- Auto-refresh doesn't cause UI flicker or performance degradation

