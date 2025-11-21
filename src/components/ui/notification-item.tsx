import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Notification } from "@/types/types";
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClick?: (id: string) => void;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  default: Bell,
};

const notificationVariants = {
  info: "bg-blue-500/10 text-blue-500",
  success: "bg-green-500/10 text-green-500",
  warning: "bg-orange-500/10 text-orange-500",
  default: "bg-primary/10 text-primary",
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];
  const iconColorClass = notificationVariants[notification.type];

const formatTimestamp = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isNaN(date.getTime())) return "Invalid date"; // safe guard

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

  return (
    <div
      className={cn(
        "group relative flex gap-4 p-4 rounded-lg border transition-all cursor-pointer",
        "hover:bg-accent/50 hover:shadow-sm",
        notification.isRead
          ? "bg-background border-border"
          : "bg-accent/30 border-primary/20"
      )}
      onClick={() => {
        onClick?.(notification.userId);
        if (!notification.isRead) {
          onMarkAsRead?.(notification.userId);
        }
      }}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
          iconColorClass
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-semibold leading-tight",
              notification.isRead ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <Badge
              variant="default"
              className="text-xs px-2 py-0 h-5 bg-primary/20 text-primary hover:bg-primary/30"
            >
              New
            </Badge>
          )}
        </div>

        <p
          className={cn(
            "text-sm leading-snug line-clamp-2",
            notification.isRead ? "text-muted-foreground" : "text-foreground/80"
          )}
        >
          {notification.message}
        </p>

        <time className="text-xs text-muted-foreground">
          {formatTimestamp(notification.createdAt)}
        </time>
      </div>
    </div>
  );
}
