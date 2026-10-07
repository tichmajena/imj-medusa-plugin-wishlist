import { createHmac, randomUUID } from "crypto";
import { sign, verify, type JwtPayload } from "jsonwebtoken";
import type { MedusaContainer } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

const ALGORITHM = "HS256";
const ISSUER = "medusa-plugin-wishlist";
const AUDIENCE = "wishlist:share";

export const SHARE_TOKEN_EXPIRES_IN = "7d";

// The signing key is derived from the project's JWT secret and bound to this
// purpose, so a share token can never validate as an auth/session token (or
// vice versa) even though they originate from the same secret.
function getSigningKey(container: MedusaContainer): Buffer {
  const { http } = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE,
  ).projectConfig;

  if (typeof http.jwtSecret !== "string" || !http.jwtSecret) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "A JWT secret must be configured to share wishlists.",
    );
  }

  return createHmac("sha256", http.jwtSecret).update(AUDIENCE).digest();
}

export function signWishlistShareToken(
  container: MedusaContainer,
  wishlistId: string,
): string {
  return sign({ wishlist_id: wishlistId }, getSigningKey(container), {
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE,
    subject: wishlistId,
    jwtid: randomUUID(),
    expiresIn: SHARE_TOKEN_EXPIRES_IN,
  });
}

// Verifies signature, algorithm, issuer, audience and expiry. Never use
// `decode` for this: it does not check the signature.
export function verifyWishlistShareToken(
  container: MedusaContainer,
  token: string,
): string {
  let payload: JwtPayload;

  try {
    payload = verify(token, getSigningKey(container), {
      algorithms: [ALGORITHM],
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as JwtPayload;
  } catch {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid or expired share token",
    );
  }

  if (typeof payload.wishlist_id !== "string" || !payload.wishlist_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid or expired share token",
    );
  }

  return payload.wishlist_id;
}
