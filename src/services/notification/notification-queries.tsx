import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  MarkReadResponse,
  NotificationResponse,
  ReadAllResponse,
} from "./notification-types";

//============================ Get Notifications =================================
// Fetch logic
const fetchNotifications = async (page = 1): Promise<NotificationResponse> => {
  const response = await axiosInstance.get<NotificationResponse>(
    `/notifications?page=${page}`,
  );
  return response.data;
};

// Query hook
export const useNotificationsQuery = (page = 1) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => fetchNotifications(page),
  });
};

//========================== Read Notification ===========================
// Fetch logic
const markAsRead = async (id: string): Promise<MarkReadResponse> => {
  const response = await axiosInstance.post<MarkReadResponse>(
    `/notifications/read/${id}`,
  );
  return response.data;
};

// Mutation hook
export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate notifications query to refresh the list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

//========================== Read All Notifications ===========================
// Fetch logic
const readAllNotifications = async (): Promise<ReadAllResponse> => {
  const response = await axiosInstance.post<ReadAllResponse>(
    "/notifications/read",
  );
  return response.data;
};

// Mutation hook
export const useReadAllNotificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      // Invalidate notifications query to refresh the list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
