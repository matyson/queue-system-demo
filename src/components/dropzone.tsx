import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

type DropzoneProps = {
  children: React.ReactNode;
  id: string;
};

export function Dropzone(props: DropzoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-fit w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 font-medium",
        isOver && "border-primary bg-primary/10",
      )}
    >
      {props.children}
    </div>
  );
}
