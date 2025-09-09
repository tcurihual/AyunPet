import { supabase } from "@supabase";

export interface AdoptionRequest {
  id?: number;
  postid: number;
  userid: number;
  message?: string;
  status?: string;
  createdat?: string;
  updatedat?: string;
}

export const AdoptionRequestService = {
  async create(requestData: Omit<AdoptionRequest, "id">) {
    const { data, error } = await supabase
      .from("adoption_request")
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase.from("adoption_request").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("adoption_request")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByUser(userid: number) {
    const { data, error } = await supabase
      .from("adoption_request")
      .select("*")
      .eq("userid", userid);
    if (error) throw error;
    return data;
  },

  async getByPost(postid: number) {
    const { data, error } = await supabase
      .from("adoption_request")
      .select("*")
      .eq("postid", postid);
    if (error) throw error;
    return data;
  },

  async update(id: number, requestData: Partial<AdoptionRequest>) {
    const { data, error } = await supabase
      .from("adoption_request")
      .update({ ...requestData, updatedat: new Date().toISOString() })
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async remove(id: number) {
    const { error } = await supabase
      .from("adoption_request")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { message: "Solicitud de adopción eliminada correctamente" };
  },
};
