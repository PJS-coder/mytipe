export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as unknown as { Razorpay: unknown }).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export async function openRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<boolean> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Unable to load secure Razorpay gateway. Please check your internet connection.");
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: unknown) {
      console.error("Razorpay Payment Failed:", response);
    });
    rzp.open();
    return true;
  } catch (err) {
    console.error("Error opening Razorpay modal:", err);
    return false;
  }
}
