const STORAGE_KEY = 'saver_ur_saved_urls';

export const getSavedUrls = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return [];
  }
};

export const saveUrl = (urlData) => {
  try {
    const existing = getSavedUrls();
    const newData = [
      {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        ...urlData
      },
      ...existing
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const deleteSavedUrl = (id) => {
  try {
    const existing = getSavedUrls();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting from localStorage', error);
  }
};

export const clearAllSavedUrls = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};
