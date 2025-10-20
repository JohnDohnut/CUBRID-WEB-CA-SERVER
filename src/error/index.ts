// Base error class
export * from './app-error';

// Domain-specific errors
export * from './host/host-error';
export * from './repository/repository-error';
export * from './storage/storage-error';
export * from './lock/lock-error';
export * from './user/user-error';

// Global error handling
export * from './global-filter';
