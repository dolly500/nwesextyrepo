// Local Storage Setter function with timeout
export const setLocalStorage = (key, value, ttl = null) => {
    try {
        const item = {
            value: value,
            expiry: ttl ? Date.now() + ttl * 1000 : null
        };
        localStorage.setItem(key, JSON.stringify(item));
        return true;
    } catch (error) {
        console.error('Error setting localStorage:', error);
        return false;
    }
}

// Getter function with timeout check
export const getLocalStorage = (key, defaultValue = null) => {
    try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
            return defaultValue;
        }

        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return defaultValue;
        }

        return item.value;
    } catch (error) {
        console.error('Error getting localStorage:', error);
        return defaultValue;
    }
}