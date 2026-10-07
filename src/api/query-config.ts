export const wishlistQueryConfig = {
  defaults: [
    "id",
    "customer_id",
    "sales_channel_id",
    "title",
    "content",
    "created_at",
    "updated_at",
    "items.*",
    "items.product_variant.*",
  ],
};

export const listWishlistsQueryConfig = {
  ...wishlistQueryConfig,
  isList: true,
};

export const retrieveWishlistQueryConfig = {
  ...wishlistQueryConfig,
  isList: false,
};
