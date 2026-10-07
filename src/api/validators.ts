import { z } from "@medusajs/framework/zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const PostStoreCreateWishlist = z.object({
  title: z.string().trim().min(1).max(255),
  content: z.string().max(10000).nullish(),
});

export type PostStoreCreateWishlistType = z.infer<
  typeof PostStoreCreateWishlist
>;

export const PostStoreUpdateWishlist = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    content: z.string().max(10000).nullish(),
  })
  .refine((body) => body.title !== undefined || body.content !== undefined, {
    message: "At least one of title or content is required",
  });

export type PostStoreUpdateWishlistType = z.infer<
  typeof PostStoreUpdateWishlist
>;

export const PostStoreCreateWishlistItem = z.object({
  variant_id: z.string().min(1),
});

export type PostStoreCreateWishlistItemType = z.infer<
  typeof PostStoreCreateWishlistItem
>;

export const GetStoreWishlistsParams = createFindParams({
  limit: 20,
  offset: 0,
});
