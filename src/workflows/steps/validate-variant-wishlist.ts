import { createStep } from "@medusajs/framework/workflows-sdk";
import {
  MedusaError,
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";
import type { CustomerWishlist } from "./retrieve-customer-wishlist";

type ValidateVariantWishlistStepInput = {
  variant_id: string;
  sales_channel_id: string;
  wishlist: CustomerWishlist;
};

export const validateVariantWishlistStep = createStep(
  "validate-variant-wishlist",
  async (
    {
      variant_id,
      sales_channel_id,
      wishlist,
    }: ValidateVariantWishlistStepInput,
    { container },
  ) => {
    // validate whether variant is in wishlist
    const isInWishlist = wishlist.items?.some(
      (item) => item.product_variant_id === variant_id,
    );

    if (isInWishlist) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Variant is already in wishlist",
      );
    }

    // validate that the variant is available in the specified sales channel
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data } = await query.graph({
      entity: "variant",
      fields: ["product.sales_channels.*"],
      filters: {
        id: variant_id,
      },
    });

    if (!data.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with id: ${variant_id} was not found`,
      );
    }

    const variantInSalesChannel = data[0].product.sales_channels.some(
      (sc: { id: string }) => sc.id === sales_channel_id,
    );

    if (!variantInSalesChannel) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Variant is not available in the specified sales channel",
      );
    }
  },
);
