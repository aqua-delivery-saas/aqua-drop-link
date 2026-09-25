const DEVELOPER_PREVIEW_EMAILS = new Set([
  "matheusantosg33@gmail.com",
  "ziontecsuporte@gmail.com",
]);

const LOVABLE_PROJECT_ID = "945ab10a-600c-42df-b035-9e72c86f9979";

function isLovablePreviewHost(hostname: string) {
  const host = hostname.toLowerCase();

  if (
    import.meta.env.DEV &&
    (host === "localhost" || host === "127.0.0.1" || host === "[::1]")
  ) {
    return true;
  }

  const previewHosts = [
    `id-preview--${LOVABLE_PROJECT_ID}.lovable.app`,
    `project--${LOVABLE_PROJECT_ID}.lovable.app`,
    `id-preview--${LOVABLE_PROJECT_ID}.lovableproject.com`,
    `project--${LOVABLE_PROJECT_ID}.lovableproject.com`,
  ];

  return previewHosts.includes(host);
}

export function hasDeveloperPreviewAccess(email?: string | null) {
  if (typeof window === "undefined" || !email) return false;

  return (
    isLovablePreviewHost(window.location.hostname) &&
    DEVELOPER_PREVIEW_EMAILS.has(email.trim().toLowerCase())
  );
}