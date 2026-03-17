import { ContentType, MediaType } from "../../generated/prisma/enums";

export interface IMovie {
  id: string;
  title: string;
  type: MediaType;
  synopsis: string;
  posterUrl?: string | null;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  streamingLink?: string | null;
  contentType: ContentType;
  ratingAverage: number;
  buyPrice?: number | null;
  rentPrice?: number | null;
  rentDuration?: number | null;
  
}