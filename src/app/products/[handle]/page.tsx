import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLiveProductByHandle, fetchLiveProducts } from "@/lib/store/fetcher";

import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await fetchLiveProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await fetchLiveProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found | Mytipe",
    };
  }

  return {
    title: `${product.title} | Mytipe Foot Care`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Mytipe`,
      description: product.description,
      images: [
        {
          url: product.featuredImage.url,
          alt: product.featuredImage.altText || product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await fetchLiveProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchLiveProducts();
  const relatedProducts = allProducts.filter((p) => p.handle !== product.handle);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
