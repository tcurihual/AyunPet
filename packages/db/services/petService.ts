import { supabase } from "@supabase";

export interface Pet{
  id?: number;
  ownerld: number;
  species: number;
  name: string;
  gender?: string;
  age?: number;
  size?: number;
  sterillized?: boolean;
  adopted?: boolean;
  createdAt?: timestamp;
  updateAt?: timestamp;
}