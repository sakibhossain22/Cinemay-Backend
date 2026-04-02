import { ContentType, MediaType } from "../../generated/prisma/enums";

export interface IMovie {
  id: string;
  tmdb_id: string;
  title: string;
  customId?: string;
  type: MediaType;
  synopsis: string;
  posterUrl?: string | null;
  genre: string[];
  releaseYear: number;
  director: string;
  category?: string[];
  cast: string[];
  streamingLink?: string | null;
  downloadLink?: string | null;
  episodeLinks?: string[]; 
  contentType: ContentType;
  ratingAverage: number;
  buyPrice?: number | null;
  rentPrice?: number | null;
  rentDuration?: number | null;

}
export interface IQuery {
  genre: string
  category: string
  releaseYear: string
  rating: string,
  type: MediaType
  searchTerm: string
  page: number
  limit: number
  sortBy : string
  isPremium: boolean
  
}