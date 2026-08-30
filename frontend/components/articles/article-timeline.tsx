import {
  CircleAlert,
  CircleCheck,
  CirclePause,
  LogIn,
  LogOut,
} from "lucide-react";

interface ArticleTimelineProps {
  events: Array<{
    eventType: string;
    timestamp: Date | string;
  }>;
}

export function ArticleTimeline({ events }: ArticleTimelineProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-medium">Reading Timeline</h3>

      <div className="relative space-y-5">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;

          return (
            <div
              key={`${event.eventType}-${event.timestamp}-${index}`}
              className="relative flex gap-3"
            >
              {!isLast && (
                <div className="absolute left-[7px] top-5 h-full w-px bg-border" />
              )}

              <div className="relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-background">
                {getEventIcon(event.eventType)}
              </div>

              <div className="min-w-0 pb-1">
                <p className="text-sm font-medium">
                  {formatEventName(event.eventType)}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No events available.</p>
        )}
      </div>
    </div>
  );
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case "PAGE_ENTER":
      return <LogIn className="size-4 text-green-500" />;

    case "PAGE_ACTIVE":
      return <CircleCheck className="size-4 text-blue-500" />;

    case "PAGE_INACTIVE":
      return <CirclePause className="size-4 text-yellow-500" />;

    case "PAGE_LEAVE":
      return <LogOut className="size-4 text-red-500" />;

    default:
      return <CircleAlert className="size-4 text-muted-foreground" />;
  }
}

function formatEventName(eventType: string) {
  return eventType
    .replace("PAGE_", "")
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatTimestamp(timestamp: Date | string) {
  return new Date(timestamp).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
