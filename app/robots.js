// /robots.txt (Next.js файл конвенциясы)
const SITE = "https://tilim-kz.vercel.app";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/app/admin", "/app/profile", "/onboarding"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
