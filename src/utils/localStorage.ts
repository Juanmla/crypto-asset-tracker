export function saveToLocalStorage<T>(key: string, data: T) {
  const cache = {
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(key, JSON.stringify(cache));
}

export function loadFromLocalStorage<T>(
  key: string,
  maxAgeInMs: number
): T | null {
  const cache = localStorage.getItem(key);
  if (!cache) return null;

  const { timestamp, data } = JSON.parse(cache);
  const isExpired = Date.now() - timestamp > maxAgeInMs;

  return isExpired ? null : data;
}
