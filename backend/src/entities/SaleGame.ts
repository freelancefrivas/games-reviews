    import {Entity, PrimaryKey, Property, OneToOne, ManyToOne} from '@mikro-orm/core';
    import type { Rel } from '@mikro-orm/core';
    import { Review } from "./Review.ts";
    import {Sale} from "./Sale.ts";

    @Entity({ tableName: 'sale_games' })
    export class SaleGame {
        @PrimaryKey()
        id!: number;

        @Property({ columnType: 'text', fieldName: 'game_name' })
        gameName!: string;

        @ManyToOne(() => Sale)
        sale!: Rel<Sale>;

        @OneToOne(() => Review, { owner: true })
        review!: Review;
    }