import { useEffect, useRef } from "react";
import { usePusher } from "@/hooks/usePusher";

const CHANNEL_NAME = 'codes';
const EVENT_NAME = '.codes.updated';

/**
 * LicenseListener component
 * Subscribes to WebSocket events for license code updates
 * Automatically reloads the app when licenses are updated server-side
 */
export function LicenseListener() {
  const {
    subscribeToChannel,
    unsubscribeFromChannel,
    connectionStatus,
  } = usePusher();

  // Use a ref to track whether we've already subscribed to the channel
  const isSubscribed = useRef(false);

  // Handle license update event — just reload, validation runs automatically on mount
  const handleLicenseUpdate = () => {
    console.log("License codes updated, reloading...");
    window.location.reload();
  };

  useEffect(() => {
    // Only subscribe when connected to WebSocket
    if (connectionStatus !== "connected") {
      return;
    }

    // Subscribe to public channel if not already subscribed
    if (!isSubscribed.current) {
      subscribeToChannel(CHANNEL_NAME, {
        [EVENT_NAME]: handleLicenseUpdate,
      });
      isSubscribed.current = true;
      console.log(`Subscribed to ${CHANNEL_NAME} channel for license updates`);
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (isSubscribed.current) {
        unsubscribeFromChannel(CHANNEL_NAME);
        isSubscribed.current = false;
        console.log(`Unsubscribed from ${CHANNEL_NAME} channel`);
      }
    };
  }, [
    connectionStatus,
    subscribeToChannel,
    unsubscribeFromChannel,
  ]);

  // This component doesn't render any UI
  return null;
}

export default LicenseListener;
