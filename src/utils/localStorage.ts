// Local storage utilities
export const LOCAL_STORAGE_KEYS = {
  USERS: 'smd_users',
  SHIPS: 'smd_ships',
  COMPONENTS: 'smd_components',
  JOBS: 'smd_jobs',
  CURRENT_USER: 'smd_current_user',
  NOTIFICATIONS: 'smd_notifications'
};

/**
 * Get item from localStorage
 * @param key Storage key
 * @returns Parsed data or null
 */
export const getFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Save item to localStorage
 * @param key Storage key
 * @param data Data to save
 */
export const saveToStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Remove item from localStorage
 * @param key Storage key
 */
export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearAllStorage = () => {
  Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};
