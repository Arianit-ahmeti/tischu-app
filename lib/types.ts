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
