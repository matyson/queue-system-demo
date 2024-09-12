import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleColors } from "@/lib/constants";
import { Dropzone } from "./dropzone";
import { GripVerticalIcon, XCircleIcon } from "lucide-react";
import type { Sample } from "./sample";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface Job {
  id: number;
  sampleId: number;
  status: "enqueued" | "running" | "done" | "cancelled";
  progress: number;
}

function QueueItem({
  job,
  sample,
  isActive,
  onRemove,
  onCancel,
}: {
  job: Job;
  sample: Sample;
  isActive: boolean;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex select-none items-center justify-between rounded-md bg-gray-50 p-3 shadow-sm space-x-2",
        isActive && "border-2 border-primary bg-primary/10",
      )}
    >
      <div className="flex flex-grow items-center space-x-3">
        <div
          className={`h-8 w-8 rounded-full ${
            sampleColors[sample.type]
          } relative flex items-center justify-center font-bold text-white`}
        >
          {sample.type}
          <span className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-white text-xs text-black">
            {sample.id}
          </span>
        </div>
        <span className="font-medium">Sample {job.sampleId}</span>
        <Badge
          variant={
            job.status === "enqueued"
              ? "secondary"
              : job.status === "running"
                ? "default"
                : job.status === "done"
                  ? "outline"
                  : "destructive"
          }
        >
          {job.status}
        </Badge>
        {job.status === "running" && (
          <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="h-4 w-4" />
      </Button>
      {(job.status === "enqueued" || job.status === "running") && (
        <Button
          variant="destructive"
          size="sm"
          onClick={job.status === "enqueued" ? onRemove : onCancel}
        >
          <XCircleIcon className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
}

export function Queue(props: {
  updateQueue: (value: React.SetStateAction<Job[]>) => void;
  toggleProcessing: (isProcessing: boolean) => void;
  removeFromQueue: (jobId: number) => void;
  cancelJob: (jobId: number) => void;
  queue: Job[];
  isProcessing: boolean;
  samples: Sample[];
}) {
  const { queue, samples, updateQueue, cancelJob, removeFromQueue } = props;
  const [activeId, setActiveId] = useState<number | null>(null);
  const items = useMemo(() => queue.map((job) => job.id), [queue]);
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as number);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      const activeIndex = queue.findIndex(({ id }) => id === active.id);
      const overIndex = queue.findIndex(({ id }) => id === over.id);

      updateQueue(arrayMove(queue, activeIndex, overIndex));
    }
    setActiveId(null);
  };

  return (
    <Dropzone id="queue-dropzone">
      <ScrollArea className="h-[calc(100vh-240px)] flex-grow">
        {queue.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Queue is empty. Drag samples here to add them to the queue.
          </p>
        ) : (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items}>
              <ul className="space-y-2">
                {queue.map((job) => {
                  const sample = samples.find((s) => s.id === job.sampleId)!;
                  return (
                    <QueueItem
                      key={job.id}
                      job={job}
                      sample={sample}
                      onRemove={() => removeFromQueue(job.id)}
                      onCancel={() => cancelJob(job.id)}
                      isActive={activeId === job.id}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </ScrollArea>
    </Dropzone>
  );
}
