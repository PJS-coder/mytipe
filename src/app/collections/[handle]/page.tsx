import { Metadata } from "next";
import { notFound } from "next/navigation";
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

  return {
    title: `${collection.title} | Mytipe Foot Care`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | Mytipe`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
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
      : allProducts.filter(
          (p) =>
            p.collections?.includes(handle) ||
            p.tags.includes(handle) ||
            p.handle.includes(handle.replace("-pain", "")) ||
            p.title.toLowerCase().includes(handle.replace("-pain", ""))
        );

  return (
    <CollectionClient
      collection={collection}
      products={collectionProducts.length > 0 ? collectionProducts : allProducts}
    />
  );
}
