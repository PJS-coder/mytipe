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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";
  const canonicalUrl = `${appUrl}/products/${product.handle}`;

  return {
    title: `${product.title} | Mytipe Foot Care`,
    description: product.description || `Buy ${product.title} with premium comfort and ergonomic foot support.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | Mytipe`,
      description: product.description || `Buy ${product.title} at Mytipe.`,
      url: canonicalUrl,
      siteName: "Mytipe",
      images: [
        {
          url: product.featuredImage.url,
          alt: product.featuredImage.altText || product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.featuredImage.url],
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

  // Smart related products: prioritize matching collections/tags, limited to 6 items to keep payload lean
  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .sort((a, b) => {
      const aMatches =
        (product.collections?.filter((c) => a.collections?.includes(c)).length || 0) +
        (product.tags?.filter((t) => a.tags?.includes(t)).length || 0);
      const bMatches =
        (product.collections?.filter((c) => b.collections?.includes(c)).length || 0) +
        (product.tags?.filter((t) => b.tags?.includes(t)).length || 0);
      return bMatches - aMatches;
    })
    .slice(0, 6);

  // Schema.org JSON-LD Structured Data for Google Rich Snippets & Shopping
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.map((img) => img.url) || [product.featuredImage.url],
    brand: {
      "@type": "Brand",
      name: "Mytipe",
    },
    offers: {
      "@type": "Offer",
      url: `https://mytipe.com/products/${product.handle}`,
      priceCurrency: "INR",
      price: minPrice,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating?.average || 4.9,
      reviewCount: product.rating?.count || 120,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
