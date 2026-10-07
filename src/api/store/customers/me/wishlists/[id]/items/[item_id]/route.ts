import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { deleteWishlistItemWorkflow } from "../../../../../../../../workflows/delete-wishlist-item";
import { getSalesChannelId } from "../../../../../../../utils/sales-channel";

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { result } = await deleteWishlistItemWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      wishlist_item_id: req.params.item_id,
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
    },
  });

  res.json({ wishlist: result.wishlist });
}
