/**
 * Simple cookie helpers for persisting user preferences (theme, font, layout, direction).
 * Uses document.cookie in the browser.
 */

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)"))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return
  document.cookie =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    "; path=/; max-age=" +
    String(maxAgeSeconds) +
    "; SameSite=Lax"
}

function removeCookie(name: string): void {
  if (typeof document === "undefined") return
  document.cookie = encodeURIComponent(name) + "=; path=/; max-age=0"
}

export { getCookie, removeCookie, setCookie }
