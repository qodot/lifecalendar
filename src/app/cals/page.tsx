"use client";

import CalList from "@/components/cals/cals-list";
import { getCalendars } from "@/data/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [cals, setCals] = useState<Calendar[]>([]);

  useEffect(() => {
    const fetchCalendars = async () => {
      const calendars = await getCalendars();
      setCals(calendars);
    };

    fetchCalendars();
  }, []);

  if (!cals) {
    return <div>Loading...</div>;
  } else {
    return (
      <main className="px-2 py-10">
        <CalList cals={cals} />
      </main>
    );
  }
}
