import { Badge } from "@/components/ui/Badge";
import { STATUS_BADGE_STYLES, STATUS_DOT_STYLES, STATUS_OPTIONS } from "@/lib/constants";
import type { ProjectStatus } from "@/types/database";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  return (
    <Badge className={STATUS_BADGE_STYLES[status]}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[status]}`} />
      {label}
    </Badge>
  );
}
