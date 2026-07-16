import { useQuery } from "@tanstack/react-query";

export type NotificationType =
  "ORDER" | "PROMOTION" | "SYSTEM" | "REVIEW" | "OTHER";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface NotificationsResponse {
  status: boolean;
  code: number;
  payload: {
    data: Notification[];
    metadata: NotificationsMetadata;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

async function fetchNotifications(
  accessToken: string,
): Promise<Notification[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/notifications?page=1&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const result: NotificationsResponse = await response.json();
  return result.payload.data;
}

export function useNotificationsQuery(accessToken?: string) {
  return useQuery({
    queryKey: ["notifications", accessToken],
    queryFn: () => fetchNotifications(accessToken as string),
    enabled: Boolean(accessToken),
    refetchInterval: 30_000,
  });
}
