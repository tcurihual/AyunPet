import { supabase } from "@db/services/db_connection";

export interface Post {
  id?: number;
  creatorid: number;
  petid: number;
  title: string;
  description?: string;
  status?: string;
  createdat?: string;
  updatedat?: string;
}

export const PostService = {
  async create(postData: Omit<Post, "id">) {
    const { data, error } = await supabase
      .from("post")
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },  

  async getAll() {
    const { data, error } = await supabase.from("post").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, postData: Partial<Post>) {
    const { data, error } = await supabase
      .from("post")
      .update({ ...postData, updatedat: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: number) {
    const { error } = await supabase.from("post").delete().eq("id", id);
    if (error) throw error;
    return { message: "Post eliminado correctamente" };
  },
};