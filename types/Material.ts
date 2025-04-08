export enum FileType {
  IMAGE = "img",
  VIDEO = "video",
  PDF = "pdf",
}

export enum MaterialType {
  MATERIAL = "material",
  PYQ = "pyq",
  SOLUTION = "solution",
}

export enum MaterialCategory {
  JEE = "jee",
  NCERT = "ncert",
  NEET = "neet",
  OLYMPIAD = "olympiad",
  CUET = "cuet",
  NTSE = "ntse",
}

export interface Material {
  id: number;
  name: string;
  file_type: FileType;
  file_url: string;
  chapter: number | null;
  class: number | null;
  type: MaterialType;
  category: MaterialCategory;
}
