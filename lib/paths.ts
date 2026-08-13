const RAW_BLOG_PATH_PREFIX =
  process.env.SEOENGINE_BLOG_PATH_PREFIX ||
  process.env.NEXT_PUBLIC_BLOG_PATH_PREFIX ||
  "blog";

function normalizePrefix(value: string): string {
  const raw = value.trim();
  if (!raw) return "blog";
  if (raw === "/") return "";
  return raw
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
}

const BLOG_PATH_PREFIX = normalizePrefix(RAW_BLOG_PATH_PREFIX);

export function blogPath(path = ""): string {
  const suffix = path.trim().replace(/^\/+/, "");
  const base = BLOG_PATH_PREFIX ? `/${BLOG_PATH_PREFIX}` : "";
  if (!suffix) return base || "/";
  return `${base}/${suffix}`;
}

export function articlePath(slug: string): string {
  return blogPath(slug);
}

export function categoryPath(slug: string): string {
  return blogPath(`category/${slug}`);
}

export function tagPath(slug: string): string {
  return blogPath(`tag/${slug}`);
}

export function absoluteArticleUrl(baseUrl: string, slug: string): string {
  return `${baseUrl.replace(/\/$/, "")}${articlePath(slug)}`;
}

export function absoluteUrl(baseUrl: string, pathOrUrl: string): string {
  const value = pathOrUrl.trim();
  if (!value) return baseUrl.replace(/\/$/, "");
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl.replace(/\/$/, "")}${value.startsWith("/") ? value : `/${value}`}`;
}
