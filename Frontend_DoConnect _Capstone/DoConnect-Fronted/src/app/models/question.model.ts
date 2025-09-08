export interface Question{
    questionId: number;
    questionText: string;
    userId: number;
    status?: string;
    images?: Image[];
   
}
export interface Image{
    imageId: number;
    imagePath: string;
}