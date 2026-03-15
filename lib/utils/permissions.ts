/**
 * Checks if a user has the required permissions.
 * @param userPermissions - Array of permissions the user possesses.
 * @param requiredPermissions - A single permission string or array of permissions required.
 * @returns True if the user has AT LEAST ONE of the required permissions.
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermissions: string | string[] | undefined
): boolean {
  if (!requiredPermissions || (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)) {
    return true
  }

  if (!userPermissions) {
    return false
  }

  const required = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  return required.some((permission) => userPermissions.includes(permission))
}
