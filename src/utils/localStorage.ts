export interface CacheDataInterface<T> {
  timestamp: number;
  data: T;
}

/**
 * Saves data to localStorage with a timestamp
 * @param key - Storage key
 * @param data - Data to be stored
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const cache: CacheDataInterface<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

/**
 * Loads data from localStorage if it exists and isn't expired
 * @param key - Storage key
 * @param maxAgeInMs - Maximum allowed age in milliseconds
 * @returns The cached data or null if expired/missing
 */
export function loadFromLocalStorage<T>(
  key: string,
  maxAgeInMs: number
): T | null {
  try {
    const cache = localStorage.getItem(key);
    if (!cache) return null;

    const parsed = JSON.parse(cache) as CacheDataInterface<T>;

    // Validate cache structure
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("timestamp" in parsed) ||
      !("data" in parsed)
    ) {
      console.warn("Invalid cache structure - removing corrupted data");
      localStorage.removeItem(key);
      return null;
    }

    // Check expiration
    const isExpired = Date.now() - parsed.timestamp > maxAgeInMs;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    localStorage.removeItem(key); // Remove corrupted data
    return null;
  }
}
