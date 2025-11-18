import { supabase } from "@db/services/db_connection";

export interface Message {
  id?: number;
  creatorid: number;
  postid: number;
  description: string;
  status?: string;
  createdat?: string;
  updatedat?: string;
}

export const MessageService = {
  async create(messageData: Omit<Message, "id">) {
    const { data, error } = await supabase
      .from("message")
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase.from("message").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, messageData: Partial<Message>) {
    const { data, error } = await supabase
      .from("message")
      .update({ ...messageData, updatedat: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: number) {
    const { error } = await supabase.from("message").delete().eq("id", id);
    if (error) throw error;
    return { message: "Mensaje eliminado correctamente" };
  },
};
