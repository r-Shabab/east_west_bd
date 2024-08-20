import React, { useState, useEffect } from "react";
import Xarrow from "react-xarrows";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stage {
  id: string;
  name: string;
  status: string;
  passportStatus: "in" | "out";
  nextStages: string[];
}

const StageCard: React.FC<{ stage: Stage; onUpdate: (id: string) => void }> = ({
  stage,
  onUpdate,
}) => {
  return (
    <Card id={stage.id} className="w-64 p-4 m-4 bg-white shadow-md">
      <h3 className="font-bold mb-2">{stage.name}</h3>
      <p>Status: {stage.status}</p>
      <p>Passport: {stage.passportStatus}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-2 w-full" onClick={() => onUpdate(stage.id)}>
            Update Status
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stage: {stage.name}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const CandidateProfile: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    const fetchedStages: Stage[] = [
      {
        id: "stage1",
        name: "Application",
        status: "Completed",
        passportStatus: "in",
        nextStages: ["stage2"],
      },
      {
        id: "stage2",
        name: "Interview",
        status: "In Progress",
        passportStatus: "in",
        nextStages: ["stage3"],
      },
      {
        id: "stage3",
        name: "Medical Check",
        status: "Pending",
        passportStatus: "out",
        nextStages: ["stage4"],
      },
      {
        id: "stage4",
        name: "Document Verification",
        status: "Pending",
        passportStatus: "in",
        nextStages: ["stage5"],
      },
      {
        id: "stage5",
        name: "Visa Application",
        status: "Not Started",
        passportStatus: "out",
        nextStages: ["stage6"],
      },
      {
        id: "stage6",
        name: "Visa Approval",
        status: "Not Started",
        passportStatus: "in",
        nextStages: ["stage7"],
      },
      {
        id: "stage7",
        name: "Visa Issue",
        status: "Not Started",
        passportStatus: "in",
        nextStages: ["stage8"],
      },
      {
        id: "stage8",
        name: "Visa Cancellation",
        status: "Not Started",
        passportStatus: "in",
        nextStages: [],
      },
      {
        id: "stage8",
        name: "Visa Cancellation",
        status: "Not Started",
        passportStatus: "in",
        nextStages: [],
      },
      {
        id: "stage8",
        name: "Visa Cancellation",
        status: "Not Started",
        passportStatus: "in",
        nextStages: [],
      },
      {
        id: "stage8",
        name: "Visa Cancellation",
        status: "Not Started",
        passportStatus: "in",
        nextStages: [],
      },
    ];
    setStages(fetchedStages);
  }, []);

  const handleUpdateStage = (id: string) => {
    console.log("Updating stage:", id);
  };

  return (
    <section className="w-full">
      <div className="px-16 py-8 m-16 rounded-lg bg-slate-50">
        <div className="flex flex-col space-y-4 w-full items-center p-4">
          <h2 className="text-7xl">Stages</h2>
          <p className="text-xl text-gray-500 italic">
            Stage diagram for the candidate
          </p>
        </div>

        <div
          className="relative p-4 overflow-auto"
          style={{ minHeight: "60vh" }}
        >
          <div className="flex flex-wrap justify-center">
            {stages.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                onUpdate={handleUpdateStage}
              />
            ))}
          </div>
          {stages.map((stage) =>
            stage.nextStages.map((nextStageId) => (
              <Xarrow
                key={`${stage.id}-${nextStageId}`}
                start={stage.id}
                end={nextStageId}
                color="#888"
                strokeWidth={2}
                path="smooth"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateProfile;
