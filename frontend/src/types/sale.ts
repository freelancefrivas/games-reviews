import type {Review} from "@/types/review.ts";
import type {SaleGame} from "@/types/saleGame.ts";

export enum Shop {
    EPIC_GAMES_STORE = 'Epic Games Store',
    GOG = 'GOG.com',
    ITCH = 'Itch.io',
    HUMBLE_BUNDLE = 'Humble Bundle',
    STEAM = 'Steam',
}

export enum SaleType {
    SINGLE_GAME = 'Single Game',
    BUNDLE = 'Bundle',
}

export interface Sale {
    id: number;
    name: string;
    shop: Shop;
    saleType: SaleType;
    originalPrice: number;
    discount: number;
    link: string;
    expiresAt: string | null;
    review: Review | null;
    saleGames: SaleGame[];
}