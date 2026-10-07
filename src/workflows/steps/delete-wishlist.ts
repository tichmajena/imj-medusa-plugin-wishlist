import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { WISHLIST_MODULE } from "../../modules/wishlist";
import WishlistModuleService from "../../modules/wishlist/service";

type DeleteWishlistStepInput = {
  id: string;
};

export const deleteWishlistStep = createStep(
  "delete-wishlist-step",
  async ({ id }: DeleteWishlistStepInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE);

    // cascades to the wishlist's items
    await wishlistModuleService.softDeleteWishlists(id);

    return new StepResponse(void 0, id);
  },
  async (id, { container }) => {
    if (!id) {
      return;
    }
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE);

    await wishlistModuleService.restoreWishlists([id]);
  },
);
