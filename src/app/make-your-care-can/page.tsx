import { Metadata } from "next";
import { fetchLiveProducts } from "@/lib/store/fetcher";

import MakeYourCareCanClient from "./MakeYourCareCanClient";

export const metadata: Metadata = {
  title: "Make Your Care Can | India's First Grow-Plant Sock Can | Mytipe",
  description:
    "Build your custom 3-pack Mytipe sock can. Pick three, pack smart, and watch the plantable seed paper grow!",
  openGraph: {
    title: "Make Your Care Can | India's First Grow-Plant Sock Can | Mytipe",
    description:
      "Build your custom 3-pack Mytipe sock can. Pick three, pack smart, and watch the plantable seed paper grow!",
    images: ["/hero-can.png"],
  },
};

export default async function MakeYourCareCanPage() {
  const products = await fetchLiveProducts();

  return <MakeYourCareCanClient products={products} />;
}
