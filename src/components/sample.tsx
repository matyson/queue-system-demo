import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { sampleColors } from "@/lib/constants";

export type Sample = {
  id: number;
  type: "A" | "B" | "C";
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
          "relative flex h-12 w-12 cursor-grab items-center justify-center rounded-full font-bold text-white",
          sampleColors[sample.type],
          isDragging &&
            "scale-110 cursor-grabbing rounded-sm border-2 opacity-90",
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
