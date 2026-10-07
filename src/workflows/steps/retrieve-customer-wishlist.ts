import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export type CustomerWishlist = {
  id: string;
  customer_id: string;
  sales_channel_id: string;
  title: string;
  content: string | null;
  items: { id: string; product_variant_id: string }[];
};

type RetrieveCustomerWishlistStepInput = {
  wishlist_id: string;
  customer_id: string;
  sales_channel_id: string;
};

export const retrieveCustomerWishlistStep = createStep(
  "retrieve-customer-wishlist",
  async (input: RetrieveCustomerWishlistStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data } = await query.graph({
      entity: "wishlist",
      fields: [
        "id",
        "customer_id",
        "sales_channel_id",
        "title",
        "content",
        "items.id",
        "items.product_variant_id",
      ],
      filters: {
        id: input.wishlist_id,
        customer_id: input.customer_id,
      },
    });

    const wishlist = data[0] as CustomerWishlist | undefined;

    if (!wishlist) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Wishlist with id: ${input.wishlist_id} was not found`,
      );
    }

    if (wishlist.sales_channel_id !== input.sales_channel_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Wishlist does not belong to the current sales channel",
      );
    }

    return new StepResponse(wishlist);
  },
);
