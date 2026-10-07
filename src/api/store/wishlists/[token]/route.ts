import type {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { verifyWishlistShareToken } from "../../../../utils/share-token";

export async function GET(req: MedusaStoreRequest, res: MedusaResponse) {
  const salesChannelIds = req.publishable_key_context?.sales_channel_ids;

  if (!salesChannelIds?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "At least one sales channel ID is required to be associated with the publishable API key in the request header.",
    );
  }

  const wishlistId = verifyWishlistShareToken(req.scope, req.params.token);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // customer_id is intentionally not exposed on a publicly shared wishlist
  const { data } = await query.graph({
    entity: "wishlist",
    fields: [
      "id",
      "sales_channel_id",
      "title",
      "content",
      "created_at",
      "updated_at",
      "items.*",
      "items.product_variant.*",
    ],
    filters: {
      id: wishlistId,
    },
  });

  if (!data.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No wishlist found");
  }

  if (!salesChannelIds.includes(data[0].sales_channel_id)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Wishlist does not belong to the request's sales channel",
    );
  }

  res.json({ wishlist: data[0] });
}
