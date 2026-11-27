import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCollectionByHandle, getAllCollections } from "@/server/db/collections";
import { fetchLiveProducts } from "@/lib/store/fetcher";

import CollectionClient from "./CollectionClient";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const collections = getAllCollections();
  return collections.map((col) => ({
    handle: col.handle,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Collection Not Found | Mytipe",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";
  const canonicalUrl = `${baseUrl}/collections/${handle}`;

  return {
    title: `${collection.title} | Mytipe Foot Care`,
    description: collection.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${collection.title} | Mytipe`,
      description: collection.description,
      url: canonicalUrl,
      siteName: "Mytipe",
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;

  if (handle === "rakhi-gift-for-brothers") {
    redirect("/collections/all-socks");
  }

  if (handle === "mytipe-foot-care-kits") {
    redirect("/collections/combos");
  }

  if (handle === "make-your-care-can") {
    redirect("/make-your-care-can");
  }

  const collection = getCollectionByHandle(handle) || {
    id: `gid://shopify/Collection/${handle}`,
    handle,
    title: handle.replace(/-/g, " ").toUpperCase(),
    description: "Explore our collection of premium socks and foot care products.",
  };

  const allProducts = await fetchLiveProducts();
  const collectionProducts =
    handle === "all-socks"
      ? allProducts
      : allProducts.filter((p) => {
          if (p.collections?.includes(handle) || p.tags.includes(handle)) return true;
          const title = p.title.toLowerCase();
          const pHandle = p.handle.toLowerCase();
          if (handle === "combos") {
            return parseFloat(p.priceRange.minVariantPrice.amount) === 699 || p.tags.includes("combos") || p.collections?.includes("combos");
          }
          if (handle === "mytipe-foot-care-kits") {
            return pHandle.includes("kit") || pHandle.includes("duo") || title.includes("kit") || title.includes("duo");
          }
          if (handle === "gym-socks") {
            return p.tags.includes("gym") || pHandle.includes("gym") || pHandle.includes("gripfit") || pHandle.includes("streetfit") || pHandle.includes("poweredge");
          }
          if (handle === "diabetic-socks") {
            return pHandle.includes("diabetic") || pHandle.includes("health") || title.includes("diabetic") || title.includes("health");
          }
          if (handle === "office-socks") {
            return pHandle.includes("legacy") || pHandle.includes("office") || pHandle.includes("metrodot") || pHandle.includes("urbandot");
          }
          if (handle === "designer-socks") {
            return pHandle.includes("popcorn") || pHandle.includes("mango-grove") || pHandle.includes("mountain-vibe") || pHandle.includes("playdot") || pHandle.includes("bravemode") || pHandle.includes("keep-going");
          }
          return p.handle.includes(handle.replace("-pain", "")) || title.includes(handle.replace("-pain", ""));
        });

  return (
    <CollectionClient
      collection={collection}
      products={collectionProducts.length > 0 ? collectionProducts : allProducts}
    />
  );
}
