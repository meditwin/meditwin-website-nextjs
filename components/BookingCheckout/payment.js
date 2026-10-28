
import axios from "axios";
import { MEDICAL_API_URL } from "../ClinicSelection/clinics";

const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

// Calculate price and discount
export function paymentTotals(fee, discount = 0) {
  const price = Number(fee);
  const percentage = Number(discount);

  if (
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100
  ) {
    throw new Error("Invalid consultation fee or discount.");
  }

  const originalPaise = Math.round(price * 100);

  if (!Number.isSafeInteger(originalPaise)) {
    throw new Error("Invalid consultation amount.");
  }

  const discountPaise = Math.round(
    (originalPaise * percentage) / 100
  );

  return {
    originalPaise,
    discountPaise,
    finalPaise: originalPaise - discountPaise
  };
}

// Validate coupon using existing backend
export async function validateCoupon(
  code,
  userId,
  token
) {
  const couponCode = String(code || "")
    .trim()
    .toUpperCase();

  if (!couponCode) {
    throw new Error("Please enter a coupon code.");
  }

  const { data } = await axios.post(
    `${MEDICAL_API_URL}/coupon/validate`,
    {
      user_id: userId,
      coupon_code: couponCode
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 30000
    }
  );

  if (
    data?.status !== "success" ||
    !data.data?.coupon_code
  ) {
    throw new Error(
      data?.message || "Unable to validate coupon."
    );
  }

  const discount = Number(data.data.discount);
  paymentTotals(0, discount);

  return {
    code: data.data.coupon_code,
    discount
  };
}

// Create Razorpay order using existing FastAPI backend
export async function createRazorpayOrder(
  amount,
  token
) {
  if (!Number.isSafeInteger(amount) || amount < 100) {
    throw new Error(
      "Payment amount must be at least ₹1."
    );
  }

  if (!token) {
    throw new Error("Please login before making payment.");
  }

  if (
    !RAZORPAY_KEY_ID ||
    !RAZORPAY_KEY_ID.startsWith("rzp_live_")
  ) {
    throw new Error(
      "Razorpay Live Key ID is missing or invalid."
    );
  }

  try {
    const { data } = await axios.post(
      `${MEDICAL_API_URL}/get-razorpay-order-id/`,
      null,
      {
        params: {
          amount,
          currency: "INR"
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 30000
      }
    );

    if (data?.status === "error") {
      throw new Error(
        data.message || "Failed to create payment order."
      );
    }

    if (
      typeof data?.order_id !== "string" ||
      !data.order_id.startsWith("order_")
    ) {
      throw new Error(
        "Invalid Razorpay order ID returned by backend."
      );
    }

    if (
      Number(data.amount) !== amount ||
      data.currency !== "INR"
    ) {
      throw new Error(
        "Payment amount or currency mismatch."
      );
    }

    return {
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      key_id: RAZORPAY_KEY_ID
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Unable to create order (${error.response?.status || "network error"}).`
      );
    }

    throw error;
  }
}

// Load Razorpay Checkout script
let checkoutScriptPromise = null;

export function loadRazorpay() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay requires a browser.")
    );
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise(
      (resolve, reject) => {
        const script = document.createElement("script");

        script.src = RAZORPAY_SCRIPT;
        script.async = true;

        script.onload = () => {
          if (window.Razorpay) {
            resolve();
          } else {
            reject(
              new Error("Razorpay failed to initialize.")
            );
          }
        };

        script.onerror = () => {
          script.remove();
          reject(
            new Error("Failed to load Razorpay Checkout.")
          );
        };

        document.head.appendChild(script);
      }
    ).catch((error) => {
      checkoutScriptPromise = null;
      throw error;
    });
  }

  return checkoutScriptPromise;
}

// Open Razorpay Live Checkout
export function openRazorpay(order, user = {}) {
  return new Promise((resolve, reject) => {
    if (
      typeof window === "undefined" ||
      !window.Razorpay
    ) {
      reject(new Error("Razorpay SDK is not loaded."));
      return;
    }

    if (
      !order?.order_id?.startsWith("order_") ||
      !order?.key_id?.startsWith("rzp_live_") ||
      !Number.isSafeInteger(Number(order.amount)) ||
      Number(order.amount) < 100
    ) {
      reject(new Error("Invalid Razorpay order details."));
      return;
    }

    let finished = false;
    let paymentFailure = "";

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: "INR",
      order_id: order.order_id,

      name: "Meditwin",
      description: "Doctor Consultation Payment",

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || ""
      },

      theme: {
        color: "#073ba3"
      },

      handler: function (response) {
        if (finished) return;

        if (
          !response?.razorpay_payment_id ||
          response.razorpay_order_id !== order.order_id ||
          !response?.razorpay_signature
        ) {
          finished = true;
          reject(
            new Error("Incomplete Razorpay payment response.")
          );
          return;
        }

        finished = true;
        resolve(response);
      },

      modal: {
        ondismiss: function () {
          if (!finished) {
            finished = true;
            reject(
              new Error(
                paymentFailure || "Payment cancelled."
              )
            );
          }
        }
      }
    };

    try {
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(
          "Razorpay payment error:",
          response?.error
        );

        paymentFailure =
          response?.error?.description ||
          "Payment failed.";
      });

      razorpay.open();
    } catch (error) {
      if (!finished) {
        finished = true;
        reject(
          new Error(
            error?.message || "Unable to open Razorpay."
          )
        );
      }
    }
  });
}
