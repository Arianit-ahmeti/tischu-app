export interface Animal {
  id: string;
  created_at: string;
  name: string | null;
  origin: string | null;
  type: string | null;
  sex: string | null;
  size: string | null;
  character: string | null;
  status: string | null;
  age: number | null;
}

export interface FileObject {
  created_at: string;
  id: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
  name: string;
  updated_at: string;
}

export interface FileResponse {
  data: FileObject[];
  error: string | null;
}

export interface AnimalFilters {
  type?: string[];
  sex?: string[];
  size?: string[];
  character?: string[];
  status?: string[];
  age_min?: number;
  age_max?: number;
}

export interface Organization {
  id: string;
  created_at: string;
  name: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: number | null;
  city: string | null;
  country: string | null;
  status: string | null;
}

export enum SessionType {
  user = "user",
  organization = "organization",
}


export interface UserContact {
  user_id: string | null;
  full_name: string | null;
  birth_date: string | null;
  street: string | null;
  house_nr: number | null;
  postal_code: number | null;
  city: string | null;
  country: string | null;
  mail: string | null;
  phone: number | null;
}


export interface UserSituation {
  form_id: string;
  created_at: string;
  household_size: number | null;
  children: boolean | null;
  children_ages: number[] | null;
  current_animals: string[] | null;
  moving_plans: boolean | null;
  elevator: boolean | null;
  time_alone: number | null;
  financial_situation: boolean | null;
  living_rented: boolean | null;
  living_house: boolean | null;
  past_animals: string[] | null;
  garden_size: string | null;
  garden_fenced: boolean | null;
  landlord_approval: string | null;
  experience: string | null;
  living_level: number | null;
}

export interface AdoptionContact {
  user_id: string;
  animal_id: string;
  form_id: string;
}
