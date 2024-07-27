import supabase from "./supabase";

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  console.log(data, error);
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(data, error);
};

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log(data, error);
  const userId = data?.session?.user.id;
  return userId;
};

export const createCalendar = async (params: {
  name: string;
  birthday: Date;
  lifespan: number;
}) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from("calendar").insert([
    {
      user_id: userId,
      name: params.name,
      birthday: params.birthday,
      lifespan: params.lifespan,
    },
  ]);
  console.log(data, error);
};

export const updateCalendar = async (
  id: string,
  params: {
    name: string;
    birthday: Date;
    lifespan: number;
  }
) => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("calendar")
    .update({
      name: params.name,
      birthday: params.birthday,
      lifespan: params.lifespan,
    })
    .eq("user_id", userId)
    .eq("id", id);
  console.log(data, error);
};

export const getCalendars = async (): Promise<Calendar[]> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("calendar")
    .select()
    .eq("user_id", userId);
  console.log(data, error);
  if (error) {
    return [];
  }
  return data.map((d) => ({
    id: d.id,
    name: d.name,
    birthday: d.birthday,
    lifespan: d.lifespan,
  }));
};

export const getCalendar = async (id: string): Promise<Calendar | null> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("calendar")
    .select()
    .eq("user_id", userId)
    .eq("id", id);

  console.log(data, error);

  if (error) {
    return null;
  }

  if (data.length === 0) {
    return null;
  }

  return {
    id: data[0].id,
    name: data[0].name,
    birthday: data[0].birthday,
    lifespan: data[0].lifespan,
  };
};
