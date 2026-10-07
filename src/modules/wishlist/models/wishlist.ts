import { model } from "@medusajs/framework/utils";
import { WishlistItem } from "./wishlist-item";

export const Wishlist = model
  .define("wishlist", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    sales_channel_id: model.text(),
    title: model.text(),
    content: model.text().nullable(),
    items: model.hasMany(() => WishlistItem, {
      mappedBy: "wishlist",
    }),
  })
  .cascades({
    delete: ["items"],
  })
  .indexes([
    {
      on: ["customer_id", "sales_channel_id"],
    },
  ]);
