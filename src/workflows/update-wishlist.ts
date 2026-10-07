import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { retrieveCustomerWishlistStep } from "./steps/retrieve-customer-wishlist";
import { updateWishlistStep } from "./steps/update-wishlist";
import { WISHLIST_FIELDS } from "./constants";

type UpdateWishlistWorkflowInput = {
  wishlist_id: string;
  customer_id: string;
  sales_channel_id: string;
  title?: string;
  content?: string | null;
};

export const updateWishlistWorkflow = createWorkflow(
  "update-wishlist",
  (input: UpdateWishlistWorkflowInput) => {
    const wishlist = retrieveCustomerWishlistStep({
      wishlist_id: input.wishlist_id,
      customer_id: input.customer_id,
      sales_channel_id: input.sales_channel_id,
    });

    updateWishlistStep({
      id: wishlist.id,
      title: input.title,
      content: input.content,
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
