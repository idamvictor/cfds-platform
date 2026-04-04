export function getApiBaseUrlFromWindowLocation() {
  const origin = window.location.origin;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return import.meta.env.VITE_API_URL || "https://demo.13i7.com/api/v1";
  }

  if (hostname.includes("cfds-platform.vercel.app")) {
    return "https://demo.13i7.com/api/v1";
  }

  // Example: demo-staging.on-forge.com -> https://demo.13i7.com/api/v1
  if (hostname.endsWith("-staging.on-forge.com")) {
    const subdomain = hostname.replace(/-staging\.on-forge\.com$/, "");
    return `${protocol}//${subdomain}.13i7.com/api/v1`;
  }

  if (hostname.includes("staging")) {
    return `${origin.replace("staging", "secure")}/api/v1`;
  }

  return `${origin}/api/v1`;
}
