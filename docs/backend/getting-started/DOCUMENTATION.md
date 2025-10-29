# EQS Platform Frontend Documentation

## Table of Contents

- [API Architecture](#api-architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Service Layer](#service-layer)
- [Custom Hooks](#custom-hooks)
- [Reusable Components](#reusable-components)
- [Utility Hooks](#utility-hooks)
- [Toast Notification System](#toast-notification-system)
- [Table Management Features](#table-management-features)
- [JSX Icon Library](#jsx-icon-library)
- [Data Operations](#data-operations)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Complete Example](#complete-example)

---

## API Architecture

Our application follows a structured API architecture that separates concerns and provides a consistent interface for data management. The API layer is organized into several key components:

```
src/api/
├── config/
│   ├── axios.js         # Axios instance configuration
│   └── endpoints.js     # API endpoint definitions
├── hooks/
│   ├── useApi.js        # Generic API hooks
│   └── useWorkflowApi.js # Feature-specific API hooks
└── services/
    ├── index.js         # Service exports
    └── workflow.js      # Service implementations
```

### Core Philosophy

1. **Separation of Concerns**: Services handle API calls, hooks manage React state, components consume data
2. **Consistency**: Standardized patterns for data fetching and mutations
3. **Error Handling**: Centralized error management with toast notifications
4. **Type Safety**: Structured approach to API interactions
5. **Caching**: Intelligent caching with TanStack Query
6. **Reusability**: Generic hooks that can be extended for specific use cases

---

## Getting Started

### 1. Environment Setup

Ensure your environment variables are configured in `.env`:

```env
VITE_BACKEND_URL=http://localhost:7001
VITE_WS_BACKEND_URL=localhost:7001
```

### 2. Basic Imports

```javascript
// For data fetching
import { useQuery } from '@tanstack/react-query';
import { useFetchData } from '../api/hooks/useApi.js';

// For mutations
import { useMutation } from '@tanstack/react-query';
import { useMutateData } from '../api/hooks/useApi.js';

// For feature-specific operations
import { useCreateUser } from '../api/hooks/useUserApi.js';
```

---

## Configuration

### Base Configuration (`src/api/config/endpoints.js`)

```javascript
// Base endpoints for our API
export const baseEndpoints = {
  backend: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001',
  ws: import.meta.env.VITE_WS_BACKEND_URL || 'localhost:7001',
};

export const API_ENDPOINTS = {
  users: {
    base: '/api/v1/users',
    profile: '/api/v1/users/profile',
    preferences: '/api/v1/users/preferences',
  },
  invoices: {
    base: '/api/v1/invoices',
    search: '/api/v1/invoices/search',
    export: '/api/v1/invoices/export',
  },
  notifications: {
    base: '/api/v1/notifications',
    markRead: '/api/v1/notifications/mark-read',
    markAllRead: '/api/v1/notifications/mark-all-read',
  },
  // Add more endpoint groups here
};
```

### Axios Configuration (`src/api/config/axios.js`)

```javascript
import axios from 'axios';
import { baseEndpoints } from './endpoints.js';

export const apiClient = axios.create({
  baseURL: baseEndpoints.backend,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.log('error', error);
    return Promise.reject(error);
  }
);
```

---

## Service Layer

Services are responsible for making the actual API calls. They use the configured axios instance and endpoints.

### Example Service Implementation

```javascript
import { apiClient } from '../config/axios.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

export const userService = {
  // Get all users with optional filtering
  getUsers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.users.base, { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async userId => {
    const response = await apiClient.get(`${API_ENDPOINTS.users.base}/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async userData => {
    const response = await apiClient.post(API_ENDPOINTS.users.base, userData);
    return response.data;
  },

  // Update user
  updateUser: async ({ userId, ...userData }) => {
    const response = await apiClient.put(`${API_ENDPOINTS.users.base}/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async userId => {
    const response = await apiClient.delete(`${API_ENDPOINTS.users.base}/${userId}`);
    return response.data;
  },
};
```

### Service Export (`src/api/services/index.js`)

```javascript
export { userService } from './users.js';
export { invoiceService } from './invoices.js';
export { notificationService } from './notifications.js';
// Export other services here
```

---

## Custom Hooks

### Generic API Hooks (`src/api/hooks/useApi.js`)

#### `useMutateData` - For Data Mutations(updating , deleting , any action that changes the data)

```javascript
export const useMutateData = ({
  mutationFn, // Function that performs the API call
  invalidateKeys = [], // Query keys to invalidate after success
  successMessage, // Success toast message
  errorMessage = 'Operation failed', // Error toast message
  onSuccess, // Custom success callback
  onError, // Custom error callback
  ...options // Additional TanStack Query options
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate queries for cache refresh
      if (invalidateKeys.length > 0) {
        invalidateKeys.forEach(queryKey => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          });
        });
      }

      // Show success toast
      if (successMessage) {
        showSuccessToast(successMessage);
      }

      // Execute custom success callback
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Show error toast
      showErrorToast(errorMessage);

      // Execute custom error callback
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options,
  });
};
```

#### `useFetchData` - For Data Fetching

```javascript
export const useFetchData = ({
  queryKey, // Unique key for caching
  queryFn, // Function that fetches the data
  showErrorToast = true, // Whether to show error toast
  errorMessage = 'Failed to fetch data', // Error message
  onSuccess, // Custom success callback
  onError, // Custom error callback
  ...options // Additional TanStack Query options
}) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes default
    retry: 2, // Retry failed requests 2 times
    onSuccess: data => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: error => {
      if (showErrorToast) {
        showErrorToast(errorMessage, error);
      }
      if (onError) {
        onError(error);
      }
    },
    ...options,
  });
};
```

### Feature-Specific Hooks

Feature-specific hooks extend the generic hooks for domain-specific operations:

```javascript
// Example: User management hooks
export const useCreateUser = (options = {}) => {
  return useMutateData({
    mutationFn: userService.createUser,
    successMessage: 'User created successfully',
    errorMessage: 'Failed to create user',
    invalidateKeys: [['users']],
    ...options,
  });
};

export const useUpdateUser = (options = {}) => {
  return useMutateData({
    mutationFn: userService.updateUser,
    successMessage: 'User updated successfully',
    errorMessage: 'Failed to update user',
    invalidateKeys: [['users'], ['user-profile']],
    ...options,
  });
};

export const useUsers = (filters = {}) => {
  return useFetchData({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## Reusable Components

The `src/components/_reusable` directory contains a collection of reusable UI components that provide consistent design patterns and functionality across the application.

### Component Overview

```
src/components/
├── AnimatedDetails.jsx      # Collapsible content with smooth animations
├── AppTable.jsx            # Advanced data table with pagination and sorting
├── Badge.jsx               # Status badges with multiple themes and variants
├── ConfirmActionDialog.jsx # Confirmation dialogs with severity levels
├── Inputs.jsx              # Custom radio and checkbox input components
├── Loader.jsx              # Loading spinner with customizable messages
├── Popover.jsx             # Positioned popover with click-outside handling
├── StatusDisplay.jsx       # Status messages with icons and actions
└── Tooltip.jsx             # Contextual tooltips with positioning
```

### Core Components

#### `AnimatedDetails` - Collapsible Content

A collapsible component with smooth height animations and accessibility support.

```javascript
import { AnimatedDetails } from '../components/AnimatedDetails.jsx';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatedDetails
      summary={<h3>Click to expand</h3>}
      open={isOpen}
      onToggle={setIsOpen}
      panelId="details-panel"
      toggleOnClick={true}
    >
      <div>Collapsible content here</div>
    </AnimatedDetails>
  );
};
```

**Props:**
- `summary` - Content displayed in the clickable header
- `children` - Content to be shown/hidden
- `open` - Boolean controlling visibility
- `onToggle` - Callback when toggled
- `panelId` - Unique ID for accessibility
- `toggleOnClick` - Whether clicking toggles the state

#### `AppTable` - Advanced Data Table

A comprehensive table component with built-in pagination, sorting, and expandable rows.

```javascript
import AppTable from '../components/AppTable.jsx';

const MyTable = () => {
  const columns = [
    { label: 'Name', className: 'col-span-2' },
    { label: 'Status', className: 'col-span-1' },
    { label: 'Actions', className: 'col-span-1' },
  ];

  const rows = [
    {
      cells: [
        { render: () => 'John Doe' },
        { render: () => 'Active' },
        { render: () => <button>Edit</button> },
      ],
      renderDetails: ({ isOpen }) => isOpen && <div>Additional details</div>,
    },
  ];

  return (
    <AppTable
      columns={columns}
      rows={rows}
      rowsPerPage={10}
      currentPage={1}
      totalCount={100}
      onPrev={() => {}}
      onNext={() => {}}
      updateRowsPerPage={(count) => {}}
    />
  );
};
```

**Features:**
- Responsive grid layout
- Expandable rows with `renderDetails`
- Built-in pagination controls
- Customizable column layouts
- Accessibility support

#### `Badge` - Status Indicators

Flexible badge component with multiple themes, sizes, and variants.

```javascript
import Badge from '../components/Badge.jsx';

const StatusBadges = () => {
  return (
    <div>
      <Badge theme="green" label="Paid" size="sm" />
      <Badge theme="red" label="Overdue" variant="outlined" />
      <Badge 
        theme="primary" 
        label="Processing" 
        icon={<Spinner />}
        iconPosition="left"
      />
    </div>
  );
};
```

**Props:**
- `theme` - Color theme: 'neutral', 'primary', 'green', 'yellow', 'red'
- `variant` - Style variant: 'filled', 'outlined'
- `size` - Size: 'sm', 'md', 'lg'
- `label` - Badge text
- `icon` - Optional icon component
- `iconPosition` - Icon position: 'left', 'right'

#### `ConfirmActionDialog` - Confirmation Dialogs

Modal dialogs for confirming actions with severity-based styling.

```javascript
import ConfirmActionDialog from '../components/ConfirmActionDialog.jsx';

const DeleteDialog = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <ConfirmActionDialog
      severity="alert"
      title="Delete Item"
      description="This action cannot be undone. Are you sure you want to delete this item?"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
```

**Props:**
- `severity` - Dialog type: 'info', 'alert', 'success'
- `title` - Dialog title
- `description` - Dialog description
- `confirmText` - Confirm button text
- `cancelText` - Cancel button text
- `onConfirm` - Confirm callback
- `onCancel` - Cancel callback

#### `Popover` - Positioned Overlays

Flexible popover component with smart positioning and click-outside handling.

```javascript
import { Popover } from '../components/Popover.jsx';

const MyPopover = () => {
  return (
    <Popover
      trigger={<button>Open Menu</button>}
      position="bottom-left"
      triggerClassName="btn-primary"
      showCloseBtn={true}
    >
      <div className="p-4">
        <p>Popover content</p>
      </div>
    </Popover>
  );
};
```

**Props:**
- `trigger` - Element that opens the popover
- `children` - Popover content
- `position` - Position: 'top', 'bottom', 'left', 'right', 'top-left', etc.
- `triggerClassName` - CSS classes for trigger
- `showCloseBtn` - Show close button

#### `Tooltip` - Contextual Help

Tooltips with smart positioning and theme support.

```javascript
import { Tooltip } from '../components/Tooltip.jsx';

const MyTooltip = () => {
  return (
    <Tooltip
      content="This is helpful information"
      position="top"
      theme="dark"
    >
      <button>Hover for help</button>
    </Tooltip>
  );
};
```

**Props:**
- `content` - Tooltip text
- `position` - Position: 'top', 'bottom', 'left', 'right'
- `theme` - Theme: 'dark', 'light'

### Input Components

#### Custom Radio and Checkbox Inputs

```javascript
import { 
  RadioInput, 
  RadioIndicator, 
  CheckboxInput, 
  CheckboxIndicator 
} from '../components/Inputs.jsx';

const CustomInputs = () => {
  return (
    <div>
      {/* Radio Button */}
      <label className="flex items-center">
        <RadioInput name="option" value="1" />
        <RadioIndicator />
        <span>Option 1</span>
      </label>

      {/* Checkbox */}
      <label className="flex items-center">
        <CheckboxInput name="agree" />
        <CheckboxIndicator />
        <span>I agree</span>
      </label>
    </div>
  );
};
```

### Loading and Status Components

#### `Loader` - Loading States

```javascript
import Loader from '../components/Loader.jsx';

const LoadingPage = () => {
  return (
    <Loader
      title="Processing Request"
      message="Please wait while we process your data..."
      color="blue-600"
      size={12}
    />
  );
};
```

#### `StatusDisplay` - Status Messages

```javascript
import StatusDisplay from '../components/StatusDisplay.jsx';

const SuccessMessage = () => {
  return (
    <StatusDisplay
      severity="success"
      title="Operation Successful"
      description="Your changes have been saved successfully."
      actionText="Continue"
      onAction={() => {}}
    />
  );
};
```

---

## Utility Hooks

The `src/hooks` directory contains utility hooks that provide common functionality for UI interactions, data manipulation, and performance optimization.

### Hook Overview

```
src/hooks/
├── useDebounce.js              # Debounce values for performance
├── useDropDown.js              # Dropdown state management
├── useOutsideClick.js          # Click-outside detection
├── useSearchInvoiceClients.js  # Invoice client search logic
└── useSearchList.js            # List filtering and sorting utilities
```

### Performance Hooks

#### `useDebounce` - Value Debouncing

Delays value updates to improve performance for search inputs and API calls.

```javascript
import useDebounce from '../hooks/useDebounce.js';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

**Parameters:**
- `value` - The value to debounce
- `delay` - Delay in milliseconds

**Returns:** Debounced value

### UI Interaction Hooks

#### `useDropDown` - Dropdown State Management

Manages dropdown open/close state with click-outside handling.

```javascript
import { useDropdown } from '../hooks/useDropDown.js';

const DropdownComponent = () => {
  const { isOpen, toggle, close, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} Menu
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg">
          <div onClick={close}>Option 1</div>
          <div onClick={close}>Option 2</div>
        </div>
      )}
    </div>
  );
};
```

**Returns:**
- `isOpen` - Boolean state
- `toggle` - Toggle function
- `close` - Close function
- `ref` - Ref for click-outside detection

#### `useOutsideClick` - Click-Outside Detection

Generic hook for detecting clicks outside a referenced element.

```javascript
import useOutsideClick from '../hooks/useOutsideClick.js';

const ModalComponent = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useOutsideClick(modalRef, () => {
    if (isOpen) onClose();
  });

  return (
    <div ref={modalRef} className="modal">
      Modal content
    </div>
  );
};
```

**Parameters:**
- `ref` - React ref to the element
- `handler` - Callback function for outside clicks

### Data Manipulation Hooks

#### `useSearchList` - List Filtering and Sorting

Comprehensive hook for filtering, sorting, and searching lists.

```javascript
import { useFilterList, useSortList, useSearch } from '../hooks/useSearchList.js';

const DataTable = ({ data }) => {
  const [filterValue, setFilterValue] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter by status
  const filteredData = useFilterList(data, filterValue, 'status');
  
  // Sort the filtered data
  const sortedData = useSortList(filteredData, sortKey, sortOrder);
  
  // Search within sorted data
  const finalData = useSearch(sortedData, searchTerm, ['name', 'email']);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {finalData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

**Available Functions:**

##### `useFilterList(list, filterValue, key)`
- Filters array by exact match on specified key
- Returns filtered array

##### `useSortList(list, key, order)`
- Sorts array by key (supports nested keys like "user.name")
- `order`: 'asc' or 'desc'
- Returns sorted array

##### `useSearch(list, term, keys)`
- Searches within specified keys or entire object
- Case-insensitive partial matching
- Returns filtered array

#### `useSearchInvoiceClients` - Invoice Client Search

Specialized hook for searching invoice clients with support for both case and customer data.

```javascript
import useSearchInvoiceClients, { 
  extractClientInfoFromCase, 
  extractClientInfoFromCustomer,
  getClientInfo 
} from '../hooks/useSearchInvoiceClients.js';

const InvoiceClientSearch = ({ clients, isCasesSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = useSearchInvoiceClients(
    clients, 
    searchTerm, 
    isCasesSearch
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clients..."
      />
      
      {filteredClients.map(client => {
        const info = isCasesSearch 
          ? extractClientInfoFromCase(client)
          : extractClientInfoFromCustomer(client);
          
        return (
          <div key={client.id}>
            <h3>{info.fullName}</h3>
            <p>{info.email}</p>
          </div>
        );
      })}
    </div>
  );
};
```

**Parameters:**
- `data` - Array of client/case objects
- `searchTerm` - Search query
- `isCasesSearch` - Boolean indicating data type

**Returns:** Filtered array of matching clients

**Utility Functions:**
- `extractClientInfoFromCase(record)` - Extracts client info from case data
- `extractClientInfoFromCustomer(customer)` - Extracts client info from customer data  
- `getClientInfo(invoice)` - Extracts client info from invoice object

---

## Toast Notification System

The `src/shared-features/ToastNotification.jsx` provides a comprehensive notification system with custom styling and interactive features.

### Overview

The toast system includes:
- **Custom Toast Component**: Styled notifications with icons and actions
- **Multiple Types**: Success, error, warning, and info notifications
- **Action Buttons**: Optional action buttons for user interactions
- **Consistent Styling**: Unified design across all notification types

### Usage

#### Basic Toast Notifications

```javascript
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast 
} from '../shared-features/ToastNotification.jsx';

// Success notification
showSuccessToast('Operation completed successfully');

// Error notification
showErrorToast('Failed to save changes');

// Warning notification
showWarningToast('Please review your input');

// Info notification
showInfoToast('New features are available');
```

#### Toast with Action Buttons

```javascript
// Toast with action button
showSuccessToast('File uploaded successfully', {
  title: 'Upload Complete',
  actionButtonLabel: 'View File',
  onActionButtonClick: () => {
    // Handle action
    navigateToFile();
  }
});

// Error toast with retry action
showErrorToast('Connection failed', {
  title: 'Network Error',
  actionButtonLabel: 'Retry',
  onActionButtonClick: () => {
    retryConnection();
  }
});
```

### Toast Types

- **Success**: Green theme with checkmark icon
- **Error**: Red theme with alert circle icon
- **Warning**: Orange theme with warning triangle icon
- **Info**: Blue theme with info circle icon

### Configuration

The toast system uses a common configuration:

```javascript
const toastConfig = {
  position: 'top-right',
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
  hideProgressBar: true,
};
```

---

## Table Management Features

The table management system provides comprehensive search, filtering, and pagination capabilities across all data tables.

### Table Search Component

Located in `src/components/invoiceTables/TableSearch.jsx`, this component provides unified search and filtering functionality.

```javascript
import TableSearch from '../components/invoiceTables/TableSearch.jsx';

const MyTable = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});

  const dropdownLists = [
    {
      title: 'Status',
      groupName: 'status',
      options: [
        { name: 'All', value: 'all' },
        { name: 'Active', value: 'active' },
        { name: 'Inactive', value: 'inactive' }
      ]
    },
    {
      title: 'Type',
      groupName: 'type',
      options: [
        { name: 'All', value: 'all' },
        { name: 'Invoice', value: 'invoice' },
        { name: 'Expense', value: 'expense' }
      ]
    }
  ];

  const handleOptionSelect = (groupName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: value
    }));
  };

  return (
    <TableSearch
      searchValue={searchValue}
      onSearch={setSearchValue}
      selectedOptions={selectedOptions}
      onOptionSelect={handleOptionSelect}
      dropdownLists={dropdownLists}
      searchPlaceholder="Search invoices..."
    />
  );
};
```

### Features

#### Search Functionality
- **Real-time Search**: Instant filtering as user types
- **Debounced Input**: Optimized performance with debounced search
- **Placeholder Support**: Customizable search placeholders

#### Filter Options
- **Multi-group Filters**: Support for multiple filter categories
- **Radio Button Selection**: Clear filter state indication
- **Dynamic Options**: Configurable filter options per table

#### Responsive Design
- **Mobile Optimized**: Collapsible filter labels on smaller screens
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Optimized for touch interactions

### Integration with Tables

The search component integrates seamlessly with the AppTable component:

```javascript
const InvoiceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  
  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [data, searchTerm, filters]);

  return (
    <div>
      <TableSearch
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        selectedOptions={filters}
        onOptionSelect={(group, value) => setFilters(prev => ({ ...prev, [group]: value }))}
        dropdownLists={filterOptions}
      />
      <AppTable
        columns={columns}
        rows={filteredData}
        // ... other props
      />
    </div>
  );
};
```

---

## JSX Icon Library

The `src/assets/JSXIcons/` directory contains a collection of custom SVG icons designed for the application.

### Storage Pattern

Icons are stored as individual JSX components in the `src/assets/JSXIcons/` directory:

```
src/assets/JSXIcons/
├── AlertCircle.jsx
├── AlertTriangle.jsx
├── CheckMark.jsx
├── Dot.jsx
├── DownChevronCircle.jsx
├── FilledDownChevron.jsx
├── Funnel.jsx
├── Info.jsx
├── LeftChevron.jsx
├── RightChevron.jsx
├── Search.jsx
├── SuccessCircle.jsx
├── VerticalEllipsis.jsx
└── X.jsx
```

### Usage

#### Basic Icon Import

```javascript
import AlertCircle from '../assets/JSXIcons/AlertCircle.jsx';
import Search from '../assets/JSXIcons/Search.jsx';

const MyComponent = () => {
  return (
    <div>
      <AlertCircle />
      <Search />
    </div>
  );
};
```

#### Icons with Styling

```javascript
import AlertCircle from '../assets/JSXIcons/AlertCircle.jsx';

const NotificationIcon = () => {
  return (
    <AlertCircle className="text-red-500 w-5 h-5" />
  );
};
```

### Features

- **SVG-based**: All icons are SVG components for scalability
- **Customizable**: Support for className props for styling
- **Consistent**: Uniform design across all icons
- **Accessible**: Support for accessibility attributes

---

## Data Operations

### Data Fetching

#### Basic Data Fetching

```javascript
import { useQuery } from '@tanstack/react-query';

const MyComponent = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['workflowCases'],
    queryFn: async () => {
      const response = await fetchCompanyCsvMappings();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

#### Advanced Data Fetching with Dependencies

```javascript
const CaseComponent = ({ caseId }) => {
  // Fetch case data
  const { data: caseData, isLoading: isLoadingCase } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => fetchCaseById(caseId),
    enabled: !!caseId, // Only run when caseId exists
  });

  // Fetch related invoices (depends on case data)
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices', caseId, currentPage, searchTerm],
    queryFn: () =>
      fetchInvoicesByCase({
        caseId,
        page: currentPage,
        search: searchTerm,
      }),
    enabled: !!caseId && !!caseData, // Wait for case data
    staleTime: 30 * 1000, // 30 seconds
  });

  return (
    <div>
      {isLoadingCase ? (
        <div>Loading case...</div>
      ) : (
        <div>
          <h1>{caseData.name}</h1>
          {isLoadingInvoices ? <div>Loading invoices...</div> : <InvoiceList invoices={invoices} />}
        </div>
      )}
    </div>
  );
};
```

---

### Data Mutations

#### Basic Mutation

```javascript
import { useUpdateUser } from '../api/hooks/useUserApi.js';

const UserProfileComponent = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = () => {
    updateUser.mutate({
      userId: user.id,
      ...formData,
    });
  };

  return (
    <div>
      <input
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Full name..."
      />
      <input
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email address..."
      />
      <button onClick={handleSubmit} disabled={updateUser.isPending}>
        {updateUser.isPending ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};
```

#### Advanced Mutation with Custom Logic

```javascript
const CreateInvoiceComponent = () => {
  const queryClient = useQueryClient();

  const createInvoice = useMutation({
    mutationFn: createQBInvoice,
    onSuccess: (data, variables) => {
      // Custom success logic
      setIsCreateModalOpen(false);
      showSuccessToast('Invoice created successfully');

      // Invalidate multiple queries
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ['debtRecords'] });

      // Optionally update specific cache data
      queryClient.setQueryData(['invoice', data.id], data);
    },
    onError: error => {
      console.error('Failed to create invoice:', error);
      showErrorToast('Failed to create invoice');
    },
  });

  const handleSubmit = formData => {
    createInvoice.mutate({
      ...formData,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(getFormData());
      }}
    >
      {/* Form fields */}
      <button type="submit" disabled={createInvoice.isPending}>
        {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
};
```

---

## Error Handling

### Global Error Handling

Our API architecture includes centralized error handling through:

1. **Axios Interceptors**: Catch and log API errors
2. **Toast Notifications**: User-friendly error messages
3. **Custom Error Callbacks**: Component-specific error handling

### Error Handling Patterns

```javascript
// Using custom error handling
const { data, isError, error } = useQuery({
  queryKey: ['sensitive-data'],
  queryFn: fetchSensitiveData,
  onError: error => {
    // Custom error handling
    if (error.status === 403) {
      redirectToLogin();
    } else if (error.status === 500) {
      reportError(error);
    }
  },
  retry: (failureCount, error) => {
    // Custom retry logic
    if (error.status === 404) return false;
    return failureCount < 3;
  },
});

// Handling mutation errors
const updateUser = useMutateData({
  mutationFn: updateUserProfile,
  onError: (error, variables) => {
    // Log error details
    console.error('Update failed:', error, variables);

    // Show specific error message
    if (error.response?.data?.field === 'email') {
      showErrorToast('Email address is already in use');
    }
  },
});
```

---

## Best Practices

### 1. Query Key Conventions

```javascript
// ✅ Good: Hierarchical and descriptive
['users', userId, 'profile'][('invoices', { caseId, page, filter })][
  ('workflows', 'transitions', transitionId)
][
  // ❌ Bad: Generic or flat
  'data'
]['userProfile']['list'];
```

### 2. Service Organization

```javascript
// ✅ Good: Organized by domain
export const userService = {
  getProfile: userId => apiClient.get(`/users/${userId}`),
  updateProfile: (userId, data) => apiClient.put(`/users/${userId}`, data),
  deleteUser: userId => apiClient.delete(`/users/${userId}`),
};

// ✅ Good: Consistent response handling
export const workflowService = {
  transitionWorkflow: async payload => {
    const response = await apiClient.post('/workflows/transition', payload);
    return response.data; // Always return response.data
  },
};
```

### 3. Hook Composition

```javascript
// ✅ Good: Specific, reusable hooks
export const useWorkflowTransitions = workflowId => {
  return useQuery({
    queryKey: ['workflows', workflowId, 'transitions'],
    queryFn: () => workflowService.getTransitions(workflowId),
    enabled: !!workflowId,
  });
};

// ✅ Good: Combined hooks for related operations
export const useWorkflowManager = workflowId => {
  const transitions = useWorkflowTransitions(workflowId);
  const approveTransition = useApproveWorkflowTransition();
  const rejectTransition = useRejectWorkflowTransition();

  return {
    transitions,
    approveTransition,
    rejectTransition,
    isLoading: transitions.isLoading,
  };
};
```

### 4. Cache Management

```javascript
// ✅ Good: Strategic invalidation
const updateWorkflow = useMutateData({
  mutationFn: workflowService.updateWorkflow,
  invalidateKeys: [
    ['workflows'], // Invalidate all workflow queries
    ['workflowCases'], // Invalidate related case queries
  ],
});

// ✅ Good: Optimistic updates
const toggleStatus = useMutation({
  mutationFn: toggleWorkflowStatus,
  onMutate: async variables => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['workflows', variables.id]);

    // Snapshot previous value
    const previousWorkflow = queryClient.getQueryData(['workflows', variables.id]);

    // Optimistically update
    queryClient.setQueryData(['workflows', variables.id], old => ({
      ...old,
      status: variables.newStatus,
    }));

    return { previousWorkflow };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['workflows', variables.id], context.previousWorkflow);
  },
});
```

---

## Complete Example

### Adding a New Endpoint

Let's walk through adding a new endpoint for managing user notifications:

#### 1. Add Endpoint Configuration

```javascript
// src/api/config/endpoints.js
export const API_ENDPOINTS = {
  // ... existing endpoints
  notifications: {
    base: '/api/v1/notifications',
    markRead: '/api/v1/notifications/mark-read',
    markAllRead: '/api/v1/notifications/mark-all-read',
  },
};
```

#### 2. Create Service

```javascript
// src/api/services/notifications.js
import { apiClient } from '../config/axios.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

export const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.notifications.base, { params });
    return response.data;
  },

  markAsRead: async notificationId => {
    const response = await apiClient.post(API_ENDPOINTS.notifications.markRead, {
      notificationId,
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post(API_ENDPOINTS.notifications.markAllRead);
    return response.data;
  },
};
```

#### 3. Export Service

```javascript
// src/api/services/index.js
export { workflowService } from './workflow.js';
export { notificationService } from './notifications.js';
```

#### 4. Create Custom Hooks

```javascript
// src/api/hooks/useNotificationApi.js
import { notificationService } from '../services/index.js';
import { useMutateData, useFetchData } from './useApi.js';

export const useNotifications = (options = {}) => {
  return useFetchData({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

export const useMarkNotificationRead = (options = {}) => {
  return useMutateData({
    mutationFn: notificationService.markAsRead,
    successMessage: 'Notification marked as read',
    invalidateKeys: [['notifications']],
    ...options,
  });
};

export const useMarkAllNotificationsRead = (options = {}) => {
  return useMutateData({
    mutationFn: notificationService.markAllAsRead,
    successMessage: 'All notifications marked as read',
    invalidateKeys: [['notifications']],
    ...options,
  });
};
```

#### 5. Use in Component

```javascript
// src/components/NotificationCenter.jsx
import { useNotifications, useMarkNotificationRead } from '../api/hooks/useNotificationApi.js';

const NotificationCenter = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead({
    onSuccess: () => {
      console.log('Notification marked as read');
    },
  });

  const handleMarkRead = notificationId => {
    markAsRead.mutate(notificationId);
  };

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div>
      <h2>Notifications</h2>
      {notifications?.map(notification => (
        <div key={notification.id} className={notification.read ? 'read' : 'unread'}>
          <p>{notification.message}</p>
          {!notification.read && (
            <button onClick={() => handleMarkRead(notification.id)} disabled={markAsRead.isPending}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

This documentation provides a comprehensive guide to our API architecture. For specific implementation details or advanced use cases, refer to the existing codebase examples or reach out to the development team.
