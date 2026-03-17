export interface IMovie {
  id: string;
  title: string;
  type: "MOVIE" | "SERIES";
  synopsis: string;
  posterUrl?: string | null;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  streamingLink?: string | null;
  contentType: "FREE" | "PREMIUM";
  ratingAverage: number;
  buyPrice?: number | null;
  rentPrice?: number | null;
  rentDuration?: number | null;
  
}