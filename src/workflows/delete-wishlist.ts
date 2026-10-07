import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { retrieveCustomerWishlistStep } from "./steps/retrieve-customer-wishlist";
import { deleteWishlistStep } from "./steps/delete-wishlist";

type DeleteWishlistWorkflowInput = {
  wishlist_id: string;
  customer_id: string;
  sales_channel_id: string;
};

export const deleteWishlistWorkflow = createWorkflow(
  "delete-wishlist",
  (input: DeleteWishlistWorkflowInput) => {
    const wishlist = retrieveCustomerWishlistStep(input);

    deleteWishlistStep({ id: wishlist.id });

    return new WorkflowResponse({ id: wishlist.id });
  },
);
