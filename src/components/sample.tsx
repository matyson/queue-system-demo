import { useDraggable } from "@dnd-kit/core";
import { cn, getSampleColor } from "@/lib/utils";

export type Sample = {
  id: number;
  type: "A" | "B" | "C" | "D" | null;
};

export function SampleItem({
  sample,
  isDragging,
}: {
  sample: Sample;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: sample.id,
    disabled: sample.type === null,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="select-none"
    >
      <div
        className={cn(
          "relative flex h-12 w-12 cursor-grab items-center justify-center rounded-full font-bold text-white hover:ring hover:ring-primary hover:scale-110",
          getSampleColor(sample.type),
          isDragging &&
            "cursor-grabbing rounded-sm opacity-90",
          sample.type === null && "opacity-50 cursor-not-allowed",
        )}
      >
        {sample.type}
        <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-black">
          {sample.id}
        </span>
      </div>
    </div>
  );
}