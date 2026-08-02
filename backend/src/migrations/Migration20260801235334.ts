import { Migration } from '@mikro-orm/migrations';

export class Migration20260801235334 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_role_check";`);

    this.addSql(`update "user" set "role" = 'admin' where "role" = 'Admin';`);
    this.addSql(`update "user" set "role" = 'writer' where "role" = 'Writer';`);
    this.addSql(`update "user" set "role" = 'editor' where "role" = 'Editor';`);

    this.addSql(`alter table "user" add constraint "user_role_check" check ("role" in ('admin', 'writer', 'editor', 'reader'));`);
    this.addSql(`alter table "user" alter column "role" set default 'writer';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_role_check";`);

    this.addSql(`update "user" set "role" = 'Admin' where "role" = 'admin';`);
    this.addSql(`update "user" set "role" = 'Writer' where "role" = 'writer';`);
    this.addSql(`update "user" set "role" = 'Editor' where "role" = 'editor';`);

    this.addSql(`alter table "user" add constraint "user_role_check" check ("role" in ('Admin', 'Writer', 'Editor', 'Reader'));`);
    this.addSql(`alter table "user" alter column "role" set default 'Writer';`);
  }

}
