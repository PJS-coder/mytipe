import { Metadata } from "next";
import { fetchLiveProducts } from "@/lib/store/fetcher";

import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Products | Mytipe",
  description: "Search all therapeutic foot care products and alignment socks from MYTIPE.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await fetchLiveProducts();

  return <SearchClient products={products} />;
}
