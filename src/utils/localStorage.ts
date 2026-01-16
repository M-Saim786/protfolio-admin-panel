export const STORAGE_KEYS = {
  AUTH_TOKEN: 'portfolio_admin_token',
  PROJECTS: 'portfolio_projects',
  SKILLS: 'portfolio_skills',
  MESSAGES: 'portfolio_messages',
  CERTIFICATES: 'portfolio_certificates',
  BLOGS: 'portfolio_blogs',
  CHATBOT_RESPONSES: 'portfolio_chatbot_responses',
  SITE_CONTENT: 'portfolio_site_content',
  ADMIN_SETTINGS: 'portfolio_admin_settings'
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage item ${key}:`, error);
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};