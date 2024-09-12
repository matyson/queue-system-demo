import { useCallback, useState } from "react";
import { SampleItem, type Sample } from "./sample";
import { Button } from "./ui/button";
import { UploadIcon, ChevronsRightIcon } from "lucide-react";

type TrayProps = {
  samples: Sample[];
  activeId: number | null;
  addToQueue: (sampleId: number[]) => void;
};

export function Tray(props: TrayProps) {
  const [tray] = useState(props.samples);
  const { addToQueue } = props;
  const enqueueAll = useCallback(() => {
    addToQueue(tray.filter((sample) => sample.type !== null).map((sample) => sample.id));
  }, [tray, addToQueue]);

  return (
    <div className="h-fit space-y-4 rounded-lg bg-gray-50 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tray</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("Upload");
            }}
          >
            <UploadIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={enqueueAll}>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {tray.map((sample) => (
          <SampleItem
            key={sample.id}
            sample={sample}
            isDragging={props.activeId === sample.id}
          />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-600">
          Drag a sample to add it to the queue.
        </p>
      </div>
    </div>
  );
}
