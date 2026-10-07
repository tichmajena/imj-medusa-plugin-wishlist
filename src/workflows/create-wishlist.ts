import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { validateCustomerCreateWishlistStep } from "./steps/validate-customer-create-wishlist";
import { createWishlistStep } from "./steps/create-wishlist";
import { WISHLIST_FIELDS } from "./constants";

type CreateWishlistWorkflowInput = {
  customer_id: string;
  sales_channel_id: string;
  title: string;
  content?: string | null;
};

export const createWishlistWorkflow = createWorkflow(
  "create-wishlist",
  (input: CreateWishlistWorkflowInput) => {
    validateCustomerCreateWishlistStep({
      customer_id: input.customer_id,
    });

    const created = createWishlistStep(input);

    const { data: wishlists } = useQueryGraphStep({
      entity: "wishlist",
      fields: WISHLIST_FIELDS,
      filters: {
        id: created.id,
      },
    }).config({ name: "refetch-wishlist" });

    return new WorkflowResponse({
      wishlist: wishlists[0],
    });
  },
);
