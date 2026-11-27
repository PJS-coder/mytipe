import { MetadataRoute } from "next";
import { fetchLiveProducts, fetchLiveCollections } from "@/lib/store/fetcher";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections/all-socks`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/combos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/make-your-care-can`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mytipe-club`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchLiveProducts();
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Sitemap product fetch error:", err);
  }

  // Dynamic collections
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await fetchLiveCollections();
    collectionRoutes = collections
      .filter((c) => c.handle !== "all-socks" && c.handle !== "combos")
      .map((collection) => ({
        url: `${baseUrl}/collections/${collection.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (err) {
    console.error("Sitemap collection fetch error:", err);
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
