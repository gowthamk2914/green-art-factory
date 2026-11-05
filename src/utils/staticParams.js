import { API_URL } from "./constants";

async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    // Fail the build loudly instead of publishing a site with missing pages
    const error = new Error(`Build failed: ${path} returned ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/* ---------------- Blogs: every page of /blog ---------------- */
export async function getBlogSlugs() {
  const slugs = [];
  let page = 1;
  let lastPage = 1;

  do {
    const json = await getJson(`/blog?page=${page}`);
    (json.data ?? []).forEach((blog) => blog.slug && slugs.push(blog.slug));
    lastPage = json.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return slugs;
}

/* ---------------- Products ----------------
   Found by following each product's "related" list, starting from one
   known product. If a product is never listed as "related" anywhere,
   add its slug to EXTRA_PRODUCT_SLUGS. */
const SEED_PRODUCT_SLUG = "moss-creations";
const EXTRA_PRODUCT_SLUGS = [];

let productsPromise = null;

export function getProducts() {
  if (!productsPromise) {
    productsPromise = (async () => {
      const seen = new Map();
      const queue = [SEED_PRODUCT_SLUG, ...EXTRA_PRODUCT_SLUGS];

      while (queue.length) {
        const slug = queue.shift();
        if (seen.has(slug)) continue;

        const json = await getJson(`/v1/products/${slug}`);
        const product = json.data;
        seen.set(slug, product);

        (product.related ?? []).forEach((item) => {
          if (item.slug && !seen.has(item.slug)) queue.push(item.slug);
        });
      }

      return [...seen.values()];
    })();
  }
  return productsPromise;
}

/* ---------------- Projects ----------------
   The project LIST lives at the same URL your Portfolio redux saga calls.
   I don't have that file, so this tries the two most likely paths.
   Once you know the right one, keep only that one in this array. */
const PROJECT_LIST_PATHS = ["/v1/portfolio", "/v1/projects"];

function extractProjects(json) {
  if (Array.isArray(json?.data?.projects)) return json.data.projects;
  if (Array.isArray(json?.projects)) return json.projects;
  if (Array.isArray(json?.data)) return json.data;
  return [];
}

export async function getProjectSlugs() {
  let lastError = null;

  for (const path of PROJECT_LIST_PATHS) {
    try {
      const slugs = [];
      let page = 1;
      let lastPage = 1;

      do {
        const json = await getJson(`${path}?page=${page}`);
        extractProjects(json).forEach((p) => p.slug && slugs.push(p.slug));
        lastPage = json.meta?.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      if (slugs.length > 0) return [...new Set(slugs)];
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Build failed: could not load the project list");
}