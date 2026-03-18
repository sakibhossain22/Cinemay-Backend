export interface ICreateComment {
    content: string;
    userId: string;
    reviewId: string;
    parentId?: string;
}