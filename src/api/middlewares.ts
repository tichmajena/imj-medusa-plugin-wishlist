import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import {
  GetStoreWishlistsParams,
  PostStoreCreateWishlist,
  PostStoreCreateWishlistItem,
  PostStoreUpdateWishlist,
} from "./validators";
import {
  listWishlistsQueryConfig,
  retrieveWishlistQueryConfig,
} from "./query-config";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/wishlists",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreCreateWishlist)],
    },
    {
      matcher: "/store/customers/me/wishlists",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetStoreWishlistsParams,
          listWishlistsQueryConfig,
        ),
      ],
    },
    {
      matcher: "/store/customers/me/wishlists/:id",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          createFindParams(),
          retrieveWishlistQueryConfig,
        ),
      ],
    },
    {
      matcher: "/store/customers/me/wishlists/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreUpdateWishlist)],
    },
    {
      matcher: "/store/customers/me/wishlists/:id/items",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreCreateWishlistItem)],
    },
  ],
});
