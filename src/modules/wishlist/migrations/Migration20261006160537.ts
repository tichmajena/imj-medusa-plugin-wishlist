import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261006160537 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "wishlist_item" drop constraint if exists "wishlist_item_wishlist_id_foreign";`,
    );

    this.addSql(
      `drop index if exists "IDX_wishlist_customer_id_sales_channel_id_unique";`,
    );

    this.addSql(
      `alter table if exists "wishlist" alter column "content" type text using ("content"::text);`,
    );
    this.addSql(
      `alter table if exists "wishlist" alter column "content" drop not null;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wishlist_customer_id_sales_channel_id" ON "wishlist" ("customer_id", "sales_channel_id") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "wishlist_item" drop column if exists "item_type";`,
    );

    this.addSql(
      `alter table if exists "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "wishlist_item" drop constraint if exists "wishlist_item_wishlist_id_foreign";`,
    );

    this.addSql(
      `drop index if exists "IDX_wishlist_customer_id_sales_channel_id";`,
    );

    this.addSql(
      `alter table if exists "wishlist" alter column "content" type text using ("content"::text);`,
    );
    this.addSql(
      `alter table if exists "wishlist" alter column "content" set not null;`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wishlist_customer_id_sales_channel_id_unique" ON "wishlist" ("customer_id", "sales_channel_id") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "wishlist_item" add column if not exists "item_type" text not null;`,
    );
    this.addSql(
      `alter table if exists "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade;`,
    );
  }
}
