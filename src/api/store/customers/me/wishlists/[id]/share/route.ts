import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { getSalesChannelId } from "../../../../../../utils/sales-channel";
import {
  SHARE_TOKEN_EXPIRES_IN,
  signWishlistShareToken,
} from "../../../../../../../utils/share-token";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "wishlist",
    fields: ["id"],
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

  res.json({
    token: signWishlistShareToken(req.scope, data[0].id),
    expires_in: SHARE_TOKEN_EXPIRES_IN,
  });
}
