
import { ContentType, MediaType } from "../../generated/prisma/enums";

export interface AdminMediaInput {
    title?: string;
    type?: MediaType;
    synopsis?: string;
    posterUrl?: string;
    genre?: string[];
    releaseYear?: number;
    director?: string;
    cast?: string[];
    category?: string[];
    streamingLink?: string;
    contentType?: ContentType; 
    buyPrice?: number;
    rentPrice?: number;
    rentDuration?: number;
}