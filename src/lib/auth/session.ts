export const AUTH_COOKIES = {
  role: "i_shop_role",
  userId: "i_shop_uid",
  accessToken: "i_shop_at",
  refreshToken: "i_shop_rt",
} as const;

export type SessionRole = "admin" | "customer";

export function toSessionRole(value: unknown): SessionRole | null {
  if (value === "admin" || value === "customer") {
    return value;
  }
  return null;
}

