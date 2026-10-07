import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { createWishlistItemWorkflow } from "../../../../../../../workflows/create-wishlist-item";
import { getSalesChannelId } from "../../../../../../utils/sales-channel";
import type { PostStoreCreateWishlistItemType } from "../../../../../../validators";

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreCreateWishlistItemType>,
  res: MedusaResponse,
) {
  const { result } = await createWishlistItemWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      variant_id: req.validatedBody.variant_id,
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
    },
  });

  res.status(201).json({ wishlist: result.wishlist });
}
