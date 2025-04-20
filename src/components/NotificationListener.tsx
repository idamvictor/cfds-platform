import { useEffect, useRef, useCallback, useState } from "react";
import { usePusher } from "@/hooks/usePusher";
import useUserStore from "@/store/userStore";
import { AlertWithIcon } from "@/components/Alert";
import axiosInstance from "@/lib/axios";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State to track the current notification to display
  const [activeNotification, setActiveNotification] =
    useState<UserNotification | null>(null);

  // Track if a read request is in progress
  const [isReadingNotification, setIsReadingNotification] = useState(false);

  // Track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Use a ref to track whether we've already subscribed to channels
  const channelsSubscribed = useRef<{
    notifications: boolean;
    userUpdates: boolean;
  }>({
    notifications: false,
    userUpdates: false,
  });

  // Store pending notifications if one is being read
  const pendingNotificationsRef = useRef<UserNotification[]>([]);

  // Keep track of the last notification ID we've seen to avoid duplicates
  const lastNotificationIdRef = useRef<string | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");

    // Set mounted flag
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
      try {
        // Hide the notification immediately for better UX
        setActiveNotification(null);
        setIsReadingNotification(true);

        // Call the API to mark as read
        await axiosInstance.post(`/notifications/${notificationId}/read`);

        // Only update if component is still mounted
        if (isMounted.current) {
          setIsReadingNotification(false);

          // Check if we have any pending notifications to show
          if (pendingNotificationsRef.current.length > 0) {
            // We need the latest user data to get proper notification IDs
            await getCurrentUser();

            // Now get the latest notifications from the user object
            if (user?.notifications && user.notifications.length > 0) {
              const unreadNotifications = user.notifications.filter(
                (n) => !n.read
              );
              if (unreadNotifications.length > 0) {
                setActiveNotification(unreadNotifications[0]);
                lastNotificationIdRef.current = unreadNotifications[0].id;
                // Remove this from pending since we're showing it
                pendingNotificationsRef.current.shift();
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        // If there was an error, we're no longer in the reading state
        if (isMounted.current) {
          setIsReadingNotification(false);
        }
      }
    },
    [getCurrentUser, user?.notifications]
  );

  // Effect to set the active notification from user data when component mounts
  useEffect(() => {
    if (
      !isReadingNotification &&
      !activeNotification &&
      user?.notifications &&
      user.notifications.length > 0
    ) {
      // Find the first unread notification
      const firstUnread = user.notifications.find(
        (notification) => !notification.read
      );

      // Set it as active if it exists and is different from the last seen notification
      if (
        firstUnread &&
        (!lastNotificationIdRef.current ||
          firstUnread.id !== lastNotificationIdRef.current)
      ) {
        lastNotificationIdRef.current = firstUnread.id;
        setActiveNotification(firstUnread);
      }
    }
  }, [user?.notifications, activeNotification, isReadingNotification]);

  // Handle notification from Pusher - display it immediately
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

      // Create a notification object from the Pusher data
      // Note: We don't have an ID from Pusher, so we'll use a temporary marker
      const newNotification: Partial<UserNotification> = {
        title: data.data.title,
        message: data.data.message,
        image: null,
        color: data.data.color || null,
        type: data.data.type,
        time: new Date().toISOString(),
        read_at: null,
        created_at: new Date().toISOString(),
        read: false,
      };

      // Check if we're currently in the process of reading a notification
      if (isReadingNotification) {
        // If so, add this to pending notifications
        pendingNotificationsRef.current.push(
          newNotification as UserNotification
        );
      } else if (!activeNotification) {
        // If we don't have an active notification, refresh user data to get the actual notification
        // with a proper ID from the server
        getCurrentUser().then(() => {
          // The useEffect watching user.notifications will handle displaying it
        });
      } else {
        // If we already have an active notification, queue this one
        pendingNotificationsRef.current.push(
          newNotification as UserNotification
        );
      }
    },
    [getCurrentUser, isReadingNotification, activeNotification]
  );

  // Create a stable reference to the user update handler
  const handleUserUpdate = useCallback(() => {
    console.log("User data updated, refreshing...");
    getCurrentUser();
  }, [getCurrentUser]);

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
    };
  }, [
    connectionStatus,
    userId,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    handleNotification,
    handleUserUpdate,
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
