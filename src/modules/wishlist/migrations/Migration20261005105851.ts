import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261005105851 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "wishlist" add column if not exists "title" text not null, add column if not exists "content" text not null;`,
    );

    this.addSql(
      `alter table if exists "wishlist_item" add column if not exists "item_type" text not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "wishlist" drop column if exists "title", drop column if exists "content";`,
    );

    this.addSql(
      `alter table if exists "wishlist_item" drop column if exists "item_type";`,
    );
  }
}
