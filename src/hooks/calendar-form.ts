import { createCalendar, updateCalendar } from "@/data/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const useCalendarForm = ({
  cal,
  submitCallback,
}: {
  cal?: Calendar;
  submitCallback: () => void;
}) => {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name must be at least 5 characters." })
      .max(128, { message: "Name must be less than 128 characters." }),
    birthday: z.date(),
    lifespan: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().min(1, "Number must be greater than 0")
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cal?.name ?? "",
      birthday: cal ? new Date(cal.birthday) : new Date(),
      lifespan: cal?.lifespan ?? 80,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    if (cal) {
      await updateCalendar(cal.id, values);
    } else {
      await createCalendar(values);
    }
    form.reset();
    submitCallback();
  }

  return {
    form,
    submit,
  };
};
