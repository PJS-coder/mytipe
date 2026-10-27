import { Collection } from "@/types/store";
import collectionsData from "@/server/data/collections.json";
import { getAllProducts } from "./products";

const collections: Collection[] = collectionsData as unknown as Collection[];

export function getAllCollections(): Collection[] {
  return collections.map((col) => {
    // Dynamically update count
    const count = getAllProducts({ collection: col.handle }).length;
    return {
      ...col,
      productsCount: count > 0 ? count : col.productsCount || 0,
    };
  });
}

export function getCollectionByHandle(handle: string): Collection | undefined {
  const normalized = handle.toLowerCase();
  const col = collections.find((c) => c.handle.toLowerCase() === normalized);
  if (!col) return undefined;

  const count = getAllProducts({ collection: col.handle }).length;
  return {
    ...col,
    productsCount: count > 0 ? count : col.productsCount || 0,
  };
}
