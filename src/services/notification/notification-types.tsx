export interface NotificationMeta {
  transaction_id?: string;
  transaction_type?: string;
  order_id?: number;
  amount?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  image: string | null;
  color: string;
  type: string;
  status: string;
  meta: NotificationMeta;
  time: string;
  read_at: string | null;
  created_at: string;
  read: boolean;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
}

export interface NotificationData {
  notifications: Notification[];
  pagination: Pagination;
  unread_count: number;
}

export interface NotificationResponse {
  status: string;
  message: string;
  data: NotificationData;
}

export interface MarkReadData {
  notification_id: string;
  unread_count: number;
}

export interface MarkReadResponse {
  status: string;
  message: string;
  data: MarkReadData;
}

export interface ReadAllData {
  unread_count: number;
}

export interface ReadAllResponse {
  status: string;
  message: string;
  data: ReadAllData;
}
