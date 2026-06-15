import {Entity, PrimaryKey, Property, ManyToOne, OneToOne, Enum, OneToMany,} from '@mikro-orm/core';
import {Review} from "./Review.ts";
import {RoleType} from "./User.ts";
import {SaleGame} from "./SaleGame.ts";
import {Collection} from "@mikro-orm/core";

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

@Entity({tableName: 'sales'})
export class Sale {
    @PrimaryKey()
    id!: number;

    @Property({columnType: 'text', fieldName: 'name'})
    name!: string;

    @Enum(() => Shop)
    shop!: Shop;

    @Enum(() => SaleType)
    saleType!: SaleType;

    @Property({columnType: 'numeric', fieldName: 'original_price'})
    originalPrice!: number;

    @Property({columnType: 'numeric'})
    discount!: number;

    @Property({columnType: 'text'})
    link!: string;

    @Property({columnType: 'date', fieldName: 'expires_at', nullable: true})
    expiresAt!: Date | null;

    @OneToOne(() => Review, {owner: true, nullable: true})
    review!: Review | null;

    @OneToMany(() => SaleGame, saleGame => saleGame.sale)
    saleGames = new Collection<SaleGame>(this);
}