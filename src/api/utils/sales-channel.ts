import { MedusaError } from "@medusajs/framework/utils";
import type { AuthenticatedMedusaRequest } from "@medusajs/framework/http";

export function getSalesChannelId(req: AuthenticatedMedusaRequest): string {
  const salesChannelId = req.publishable_key_context?.sales_channel_ids?.[0];

  if (!salesChannelId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "At least one sales channel ID is required to be associated with the publishable API key in the request header.",
    );
  }

  return salesChannelId;
}
