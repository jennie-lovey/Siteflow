import { Badge } from "@/components/ui/Badge";
import { PRIORITY_BADGE_STYLES, PRIORITY_OPTIONS } from "@/lib/constants";
import type { ProjectPriority } from "@/types/database";

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const label = PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority;
  return <Badge className={PRIORITY_BADGE_STYLES[priority]}>{label} Priority</Badge>;
}
