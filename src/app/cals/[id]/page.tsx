"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import CalsDetail from "@/components/cals/cals-detail";
import { getCalendar } from "@/data/api";

export default function Page() {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [cal, setCal] = useState<Calendar | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCalendars = async () => {
      const calendar = await getCalendar(id as string);
      setCal(calendar);
    };

    fetchCalendars();
  }, [id]);

  if (!cal) {
    return <div>Loading...</div>;
  } else {
    return (
      <main className="px-2 py-10">
        <CalsDetail cal={cal} />
      </main>
    );
  }
}
