export type ReplaceField<T, K extends keyof T, N> =
  Omit<T, K> & { [P in K]: N };

  export interface Notification {
  userId: string;
  title: string;
  message: string;
  type: "default" | "info" | "warning" | "success";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}