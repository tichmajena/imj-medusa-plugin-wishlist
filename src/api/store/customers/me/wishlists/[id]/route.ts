import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { updateWishlistWorkflow } from "../../../../../../workflows/update-wishlist";
import { deleteWishlistWorkflow } from "../../../../../../workflows/delete-wishlist";
import { getSalesChannelId } from "../../../../../utils/sales-channel";
import type { PostStoreUpdateWishlistType } from "../../../../../validators";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "wishlist",
    fields: req.queryConfig.fields,
    filters: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
    },
  });

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Wishlist with id: ${req.params.id} was not found`,
    );
  }

  res.json({ wishlist: data[0] });
}

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreUpdateWishlistType>,
  res: MedusaResponse,
) {
  const { result } = await updateWishlistWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
      title: req.validatedBody.title,
      content: req.validatedBody.content,
    },
  });

  res.json({ wishlist: result.wishlist });
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { result } = await deleteWishlistWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
    },
  });

  res.json({ id: result.id, object: "wishlist", deleted: true });
}
