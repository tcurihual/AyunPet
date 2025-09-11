import { supabase } from "@supabase";

export interface Pet{
  id?: number;
  ownerld: number;
  species: number;
  name: string;
  gender?: string;
  age?: string;
  size?: string;
  sterillized?: string;
  adopted?: string;
  createdAt?: string;
  updateAt?: string;
}