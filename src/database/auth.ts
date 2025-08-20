import { supabase } from "../lib/supabase";

export const getId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.id) {
    throw new Error("uuid is undefined");
  }
  return user.id;
}