import { supabase } from "../db_conection";

export interface Post {
  id?: number;
  creator_id: number;
  pet_id: number;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const PostService = {
  async create(postData: Omit<Post, 'id'>) {
    const { data, error } = await supabase
      .from("posts")
      .insert([postData]) 
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, postData: Partial<Post>) {
    const { data, error } = await supabase
      .from("posts")
      .update({ ...postData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: number) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    return { message: "Post eliminado correctamente" };
  },
};