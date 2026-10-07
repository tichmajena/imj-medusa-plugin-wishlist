import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { retrieveCustomerWishlistStep } from "./steps/retrieve-customer-wishlist";
import { createWishlistItemStep } from "./steps/create-wishlist-item";
import { validateVariantWishlistStep } from "./steps/validate-variant-wishlist";
import { WISHLIST_FIELDS } from "./constants";

type CreateWishlistItemWorkflowInput = {
  wishlist_id: string;
  variant_id: string;
  customer_id: string;
  sales_channel_id: string;
};

export const createWishlistItemWorkflow = createWorkflow(
  "create-wishlist-item",
  (input: CreateWishlistItemWorkflowInput) => {
    const wishlist = retrieveCustomerWishlistStep({
      wishlist_id: input.wishlist_id,
      customer_id: input.customer_id,
      sales_channel_id: input.sales_channel_id,
    });

    validateVariantWishlistStep({
      variant_id: input.variant_id,
      sales_channel_id: input.sales_channel_id,
      wishlist,
    });

    createWishlistItemStep({
      product_variant_id: input.variant_id,
      wishlist_id: wishlist.id,
    });

    const { data: wishlists } = useQueryGraphStep({
      entity: "wishlist",
      fields: WISHLIST_FIELDS,
      filters: {
        id: wishlist.id,
      },
    }).config({ name: "refetch-wishlist" });

    return new WorkflowResponse({
      wishlist: wishlists[0],
    });
  },
);
