import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { retrieveCustomerWishlistStep } from "./steps/retrieve-customer-wishlist";
import { validateItemInWishlistStep } from "./steps/validate-item-in-wishlist";
import { deleteWishlistItemStep } from "./steps/delete-wishlist-item";
import { WISHLIST_FIELDS } from "./constants";

type DeleteWishlistItemWorkflowInput = {
  wishlist_id: string;
  wishlist_item_id: string;
  customer_id: string;
  sales_channel_id: string;
};

export const deleteWishlistItemWorkflow = createWorkflow(
  "delete-wishlist-item",
  (input: DeleteWishlistItemWorkflowInput) => {
    const wishlist = retrieveCustomerWishlistStep({
      wishlist_id: input.wishlist_id,
      customer_id: input.customer_id,
      sales_channel_id: input.sales_channel_id,
    });

    validateItemInWishlistStep({
      wishlist,
      wishlist_item_id: input.wishlist_item_id,
    });

    deleteWishlistItemStep({ wishlist_item_id: input.wishlist_item_id });

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
