import { getMatrix } from "@/data/util/calendar";

export default function Matrix({ cal }: { cal: Calendar }) {
  const matrix = getMatrix(cal);

  return (
    <div className="flex flex-col items-center">
      <Row>
        <RowFirst num={0} />
        {[...Array(52)].map((_, i) => (
          <div
            key={i + 1}
            className="w-5 h-5 flex justify-center items-center text-xs"
          >
            {i + 1}
          </div>
        ))}
      </Row>

      <div className="flex flex-col gap-0.5">
        {matrix.years.map((year) => (
          <Row key={year.yearnum}>
            <RowFirst num={year.yearnum} />
            {year.weeks.map((week) => (
              <Week key={week.weeknum} week={week} />
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
}

function RowFirst({ num }: { num: number }) {
  return (
    <div className="w-8 h-5 flex justify-center items-center text-xs">
      {num === 0 ? "" : num}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row gap-0.5">{children}</div>;
}

function Week({ week }: { week: Week }) {
  function getColor(timeType: TimeType): string {
    switch (timeType) {
      case "PAST":
        return "bg-neutral-200";
      case "NOW":
        return "bg-primary";
      case "FUTURE":
        return "bg-neutral-100";
      case "OLD":
        return "bg-neutral-300";
      default:
        return "";
    }
  }

  return <div className={`w-5 h-5 rounded-sm ${getColor(week.timeType)}`} />;
}
