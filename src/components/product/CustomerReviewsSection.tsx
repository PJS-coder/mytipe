"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MessageSquarePlus, X, Sparkles } from "lucide-react";
import { ProductReview } from "@/types/store";

interface CustomerReviewsProps {
  productHandle: string;
  productTitle: string;
}

export default function CustomerReviewsSection({
  productHandle,
  productTitle,
}: CustomerReviewsProps) {
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  // Form state
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  // Load product-specific reviews from localStorage
  useEffect(() => {
    try {
      const storageKey = `mytipe_reviews_${productHandle}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReviewsList(JSON.parse(saved));
      } else {
        setReviewsList([]);
      }
    } catch (e) {
      console.error("Error reading reviews from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, [productHandle]);

  // Save product-specific reviews
  const saveReviews = (newList: ProductReview[]) => {
    setReviewsList(newList);
    try {
      const storageKey = `mytipe_reviews_${productHandle}`;
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch (e) {
      console.error("Error saving reviews to localStorage", e);
    }
  };

  const handleLike = (id: string, initialLikes = 0) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1,
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: formName.trim(),
      isVerified: true,
      rating: formRating,
      date: "Just now",
      title: formTitle.trim() || undefined,
      content: formContent.trim(),
      likes: 0,
    };

    saveReviews([newRev, ...reviewsList]);
    setModalOpen(false);
    setFormName("");
    setFormTitle("");
    setFormContent("");
    setFormRating(5);
  };

  const totalReviews = reviewsList.length;
  const avgRating =
    totalReviews > 0
      ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  return (
    <section id="reviews-section" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="max-w-5xl xl:max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
              Customer Reviews
            </h2>
          </div>

        {/* Clean Rating Summary Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-4xl sm:text-5xl font-black text-gray-950">
                {totalReviews > 0 ? avgRating.toFixed(1) : "5.0"}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                  {totalReviews > 0
                    ? `Based on ${totalReviews} ${totalReviews === 1 ? "customer review" : "customer reviews"} for this product`
                    : "Customer Reviews"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg active:scale-95 shrink-0 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {totalReviews > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {reviewsList.map((review) => {
              return (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f1c3f] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{review.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating ? "fill-current text-amber-400" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span>&bull;</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-bold text-gray-900 text-base">{review.title}</h4>
                  )}

                  <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Write / Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-950">Add Your Review</h3>
              <p className="text-xs text-gray-500 mt-1">
                Share your personal experience with <strong>{productTitle}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          formRating >= star ? "fill-current text-amber-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Great quality and very comfortable"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Review Details *
                </label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your honest thoughts about this product..."
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

