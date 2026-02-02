import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Post} from "./Post.ts";

@Entity({tableName: 'post_monthly_clicks'})
export class PostMonthlyClicks {
    @PrimaryKey()
    id!: number;

    @Property({fieldName: 'year_month', index: true})
    yearMonth!: string;

    @Property()
    clicks!: number;

    @ManyToOne(() => Post, { index: true })
    post!: Post;
}