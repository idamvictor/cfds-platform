import { useEffect, useRef, useCallback, useState } from "react";
import { usePusher } from "@/hooks/usePusher";
import useUserStore from "@/store/userStore";
import { AlertWithIcon } from "@/components/Alert";
import axiosInstance from "@/lib/axios";
import useTradeStore from "@/store/tradeStore.ts";

// Notification structure from the user object
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  image: string | null;
  color: "danger" | "success" | "warning" | null;
  type: string;
  time: string;
  read_at: string | null;
  created_at: string | null;
  read: boolean;
}

// Pusher event data structure
interface NotificationData {
  user_id: string;
  data: {
    type: string;
    message: string;
    title: string;
    color?: "danger" | "success" | "warning" | null;
  };
}

// User update event data structure
interface UserUpdateData {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export function NotificationListener() {
  const {
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    connectionStatus,
  } = usePusher();
  const userId = useUserStore((state) => state.user?.id);
  const user = useUserStore((state) => state.user);
  const getCurrentUser = useUserStore((state) => state.getCurrentUser);
  const fetchOpenTrades = useTradeStore((state) => state.fetchOpenTrades);
  const fetchClosedTrades = useTradeStore((state) => state.fetchClosedTrades);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State to track the current notification to display
  const [activeNotification, setActiveNotification] =
      useState<UserNotification | null>(null);

  // Track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Use a ref to track whether we've already subscribed to channels
  const channelsSubscribed = useRef<{
    notifications: boolean;
    userUpdates: boolean;
    tradeUpdates: boolean;
  }>({
    notifications: false,
    userUpdates: false,
    tradeUpdates: false,
  });

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to mark a notification as read
  const markNotificationAsRead = useCallback(
      async (notificationId: string) => {
        // Hide the notification immediately for smooth UX
        setActiveNotification(null);

        // Call the API to mark as read in the background
        try {
          await axiosInstance.post(`/notifications/${notificationId}/read`);

          // Refresh user data to update the notification list
          if (isMounted.current) {
            getCurrentUser();
          }
        } catch (error) {
          console.error("Failed to mark notification as read:", error);
        }
      },
      [getCurrentUser]
  );

  // Effect to display the first unread notification from user data
  useEffect(() => {
    if (user?.notifications && user.notifications.length > 0) {
      // Find the first unread notification
      const firstUnread = user.notifications.find(
          (notification) => !notification.read
      );

      // Set it as active if it exists
      if (firstUnread) {
        setActiveNotification(firstUnread);
      }
    }
  }, [user?.notifications]);

  // Handle notification from Pusher - only play sound and refresh user data
  const handleNotification = useCallback(
      (data: NotificationData) => {
        console.log("Notification received", data);

        // Play notification sound
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => {
            console.error("Failed to play notification sound:", err);
          });
        }

        // Refresh user data to get the new notification
        getCurrentUser();
      },
      [getCurrentUser]
  );

  // Handle user updates
  const handleUserUpdate = useCallback(() => {
    console.log("User data updated, refreshing...");
    getCurrentUser();
  }, [getCurrentUser]);

  // Handle trade updates
  const handleTradeUpdate = useCallback(() => {
    console.log("Trade data updated, refreshing...");
    fetchOpenTrades();
    fetchClosedTrades();
  }, [fetchOpenTrades, fetchClosedTrades]);

  // Manage subscriptions based on connection status and user ID
  useEffect(() => {
    // Only proceed if we're connected and have a user ID
    if (connectionStatus !== "connected" || !userId) {
      return;
    }

    // Subscribe to notifications channel if not already subscribed
    if (!channelsSubscribed.current.notifications) {
      subscribeToPrivateChannel<NotificationData>(`notification.${userId}`, {
        ".notification.message": handleNotification,
      });
      channelsSubscribed.current.notifications = true;
    }

    // Subscribe to user updates channel if not already subscribed
    if (!channelsSubscribed.current.userUpdates) {
      subscribeToPrivateChannel<UserUpdateData>(`user.${userId}`, {
        ".user.updated": handleUserUpdate,
      });
      channelsSubscribed.current.userUpdates = true;
    }

    // Subscribe to trade updates channel if not already subscribed
    if (!channelsSubscribed.current.tradeUpdates) {
      subscribeToPrivateChannel<UserUpdateData>(`trade.${userId}`, {
        ".trade.updated": handleTradeUpdate,
      });
      channelsSubscribed.current.tradeUpdates = true;
    }

    // Cleanup function to unsubscribe when component unmounts or user changes
    return () => {
      if (channelsSubscribed.current.notifications) {
        unsubscribeFromChannel(`notification.${userId}`);
        channelsSubscribed.current.notifications = false;
      }

      if (channelsSubscribed.current.userUpdates) {
        unsubscribeFromChannel(`user.${userId}`);
        channelsSubscribed.current.userUpdates = false;
      }

      if (channelsSubscribed.current.tradeUpdates) {
        unsubscribeFromChannel(`trade.${userId}`);
        channelsSubscribed.current.tradeUpdates = false;
      }
    };
  }, [
    connectionStatus,
    userId,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    handleNotification,
    handleUserUpdate,
    handleTradeUpdate
  ]);

  // Get the alert variant based on notification color
  const getAlertVariant = (color: string | null) => {
    switch (color) {
      case "danger":
        return "destructive";
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };

  // If no active notification, don't render anything
  if (!activeNotification) {
    return null;
  }

  // Render the notification alert
  return (
      <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-300">
        <AlertWithIcon
            variant={getAlertVariant(activeNotification.color)}
            title={activeNotification.title || "Notification"}
            description={activeNotification.message}
            onClose={() => markNotificationAsRead(activeNotification.id)}
            className="shadow-lg"
        />
      </div>
  );
}

export default NotificationListener;
