import { Button } from "@/components/ui/button";
import Matrix from "./cals-matrix/matrix";
import CalsDialog from "./cals-dialog";

export default function CalsDetail({ cal }: { cal: Calendar }) {
  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <CalsDeatilHeader cal={cal} />
      <Matrix cal={cal} />
    </div>
  );
}

const CalsDeatilHeader = ({ cal }: { cal: Calendar }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-xl font-semibold">{cal.name}</h1>

      <div>
        <CalsDialog trigger={<Button>Update Calendar</Button>} cal={cal} />
      </div>
    </div>
  );
};
