import { Product, Collection } from "@/types/store";
import {
  getAllProducts,
  getProductByHandle,
  getProductById,
  getRelatedProducts,
} from "@/server/db/products";
import {
  getAllCollections,
  getCollectionByHandle,
} from "@/server/db/collections";

// Server-side direct data access (native database repository with 0ms latency)
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    return getAllProducts();
  } catch (error) {
    console.error("Error fetching store products:", error);
    return [];
  }
}

export async function fetchLiveProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    return getProductByHandle(handle);
  } catch (error) {
    console.error(`Error fetching store product for handle ${handle}:`, error);
    return undefined;
  }
}

export async function fetchLiveCollections(): Promise<Collection[]> {
  try {
    return getAllCollections();
  } catch (error) {
    console.error("Error fetching store collections:", error);
    return [];
  }
}

export async function fetchLiveCollectionByHandle(handle: string): Promise<Collection | undefined> {
  try {
    return getCollectionByHandle(handle);
  } catch (error) {
    console.error(`Error fetching store collection for handle ${handle}:`, error);
    return undefined;
  }
}

export {
  getAllProducts,
  getProductByHandle,
  getProductById,
  getRelatedProducts,
  getAllCollections,
  getCollectionByHandle,
};
