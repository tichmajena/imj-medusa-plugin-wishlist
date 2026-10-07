import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createWishlistWorkflow } from "../../../../../workflows/create-wishlist";
import { getSalesChannelId } from "../../../../utils/sales-channel";
import type { PostStoreCreateWishlistType } from "../../../../validators";

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreCreateWishlistType>,
  res: MedusaResponse,
) {
  const { result } = await createWishlistWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
      title: req.validatedBody.title,
      content: req.validatedBody.content,
    },
  });

  res.status(201).json({ wishlist: result.wishlist });
}

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data, metadata } = await query.graph({
    entity: "wishlist",
    fields: req.queryConfig.fields,
    filters: {
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
    },
    pagination: req.queryConfig.pagination,
  });

  res.json({
    wishlists: data,
    count: metadata?.count ?? data.length,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? data.length,
  });
}
