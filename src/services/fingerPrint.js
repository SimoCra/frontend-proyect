
export const getFingerprint = async () => {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.platform
  ].join('|');

  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));

  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
