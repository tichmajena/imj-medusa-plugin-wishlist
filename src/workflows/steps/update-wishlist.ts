import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { WISHLIST_MODULE } from "../../modules/wishlist";
import WishlistModuleService from "../../modules/wishlist/service";

type UpdateWishlistStepInput = {
  id: string;
  title?: string;
  content?: string | null;
};

export const updateWishlistStep = createStep(
  "update-wishlist-step",
  async ({ id, title, content }: UpdateWishlistStepInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE);

    const previous = await wishlistModuleService.retrieveWishlist(id, {
      select: ["id", "title", "content"],
    });

    const updated = await wishlistModuleService.updateWishlists({
      id,
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
    });

    return new StepResponse(updated, {
      id,
      title: previous.title,
      content: previous.content,
    });
  },
  async (previous, { container }) => {
    if (!previous) {
      return;
    }
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE);

    await wishlistModuleService.updateWishlists(previous);
  },
);
