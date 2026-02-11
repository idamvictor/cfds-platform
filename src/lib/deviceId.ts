import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device_id';

let cachedDeviceId: string | null = null;

/**
 * Get or generate a unique device ID for this browser.
 * The device ID is stored in localStorage and persists across sessions.
 *
 * @returns The unique device ID (UUID v4)
 */
export function getDeviceId(): string {
  // Return cached value if available
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  // Try to retrieve from localStorage
  const stored = localStorage.getItem(DEVICE_ID_KEY);

  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  // Generate new device ID
  const newDeviceId = uuidv4();
  localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
  cachedDeviceId = newDeviceId;

  return newDeviceId;
}

/**
 * Clear the device ID from localStorage and cache.
 * A new ID will be generated on the next call to getDeviceId().
 */
export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY);
  cachedDeviceId = null;
}
