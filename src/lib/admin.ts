export const SUPER_ADMIN_EMAIL = "hello.vikaspaswan@gmail.com";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isSuperAdminEmail(email: string) {
  return normalizeEmail(email) === SUPER_ADMIN_EMAIL;
}

export function canSeeAdminPanel(email: string) {
  return isSuperAdminEmail(email);
}
