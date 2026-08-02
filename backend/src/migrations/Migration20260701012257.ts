import { Migration } from '@mikro-orm/migrations';

export class Migration20260701012257 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tags" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "email" varchar(255) not null, "nickname" varchar(255) not null, "password" varchar(255) not null, "email_verified" boolean not null, "image" text null, "role" text check ("role" in ('Admin', 'Writer', 'Editor')) not null default 'Writer', constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "session" ("id" text not null, "user_id" text not null, "token" text not null, "expires_at" timestamptz not null, "ip_address" text null, "user_agent" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_token_unique" unique ("token");`);

    this.addSql(`create table "posts" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "body" text not null, "main_image" varchar(255) null, "slug_code" text not null, "excerpt" text not null, "type" text check ("type" in ('News', 'Review', 'Opinion')) not null, "published" boolean not null default false, "author_id" text not null);`);
    this.addSql(`create index "posts_slug_code_index" on "posts" ("slug_code");`);

    this.addSql(`create table "reviews" ("id" serial primary key, "post_id" int not null);`);
    this.addSql(`alter table "reviews" add constraint "reviews_post_id_unique" unique ("post_id");`);

    this.addSql(`create table "sales" ("id" serial primary key, "name" text not null, "shop" text check ("shop" in ('Epic Games Store', 'GOG.com', 'Itch.io', 'Humble Bundle', 'Steam')) not null, "sale_type" text check ("sale_type" in ('Single Game', 'Bundle')) not null, "original_price" numeric not null, "discount" numeric not null, "link" text not null, "expires_at" date null, "review_id" int null);`);
    this.addSql(`alter table "sales" add constraint "sales_review_id_unique" unique ("review_id");`);

    this.addSql(`create table "sale_games" ("id" serial primary key, "game_name" text not null, "sale_id" int not null, "review_id" int not null);`);
    this.addSql(`alter table "sale_games" add constraint "sale_games_review_id_unique" unique ("review_id");`);

    this.addSql(`create table "post_monthly_clicks" ("id" serial primary key, "year_month" varchar(255) not null, "clicks" int not null, "post_id" int null);`);
    this.addSql(`create index "post_monthly_clicks_year_month_index" on "post_monthly_clicks" ("year_month");`);
    this.addSql(`create index "post_monthly_clicks_post_id_index" on "post_monthly_clicks" ("post_id");`);

    this.addSql(`create table "account" ("id" text not null, "user_id" text not null, "account_id" text not null, "provider_id" text not null, "access_token" text null, "refresh_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "id_token" text null, "password" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "account_pkey" primary key ("id"));`);

    this.addSql(`create table "verification" ("id" text not null, "identifier" text not null, "value" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "posts" add constraint "posts_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "reviews" add constraint "reviews_post_id_foreign" foreign key ("post_id") references "posts" ("id") on update cascade;`);

    this.addSql(`alter table "sales" add constraint "sales_review_id_foreign" foreign key ("review_id") references "reviews" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "sale_games" add constraint "sale_games_sale_id_foreign" foreign key ("sale_id") references "sales" ("id") on update cascade;`);
    this.addSql(`alter table "sale_games" add constraint "sale_games_review_id_foreign" foreign key ("review_id") references "reviews" ("id") on update cascade;`);

    this.addSql(`alter table "post_monthly_clicks" add constraint "post_monthly_clicks_post_id_foreign" foreign key ("post_id") references "posts" ("id") on delete cascade;`);

    this.addSql(`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

}
