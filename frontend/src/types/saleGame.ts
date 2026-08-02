import type {Sale} from "@/types/sale.ts";
import type {Review} from "@/types/review.ts";

export interface SaleGame {
    id: number;
    gameName: string;
    sale: Sale;
    review: Review;
}