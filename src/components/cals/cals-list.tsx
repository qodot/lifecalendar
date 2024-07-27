"use client";

import { Button } from "@/components/ui/button";

import CalsDialog from "./cals-dialog";
import { columns } from "./cals-table/columns";
import { DataTable } from "./cals-table/table";

export default function CalList({ cals }: { cals: Calendar[] }) {
  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <CalsListHeader />
      <DataTable columns={columns} data={cals} />
    </div>
  );
}

const CalsListHeader = () => {
  return (
    <>
      <div className="flex flex-row justify-end items-center">
        <div>
          <CalsDialog trigger={<Button>New Calendar</Button>} />
        </div>
      </div>
    </>
  );
};
