
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import bookingBanner from "../../public/images/booking/booking-banner.jpg";
import styles from "./booking-banner.module.css";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/\/+$/, "");

function getBannerImageUrl(imagePath) {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^\/+/, "");

  const finalPath = cleanPath.includes("/")
    ? cleanPath
    : `uploads/banners/${cleanPath}`;

  return `${API_URL}/${finalPath}`;
}

export default function BookingBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/banners/`,
          {
            signal: controller.signal,
          }
        );

        const result = response.data;

        if (
          result?.status === "success" &&
          Array.isArray(result.data)
        ) {
          // Display first banner from the API
          setBanner(result.data[0] || null);
        } else {
          setBanner(null);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error("Error fetching booking banner:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
      }
    };

    fetchBanner();

    return () => controller.abort();
  }, []);

  const imageUrl = getBannerImageUrl(banner?.banner_image);

  return (
    <section
      className={styles.banner}
      aria-labelledby="booking-heading"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={banner?.name || "Booking banner"}
          fill
          unoptimized
          priority
          sizes="100vw"
          className={styles.image}
        />
      ) : (
        <Image
          src={bookingBanner}
          alt="Booking appointment banner"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      )}

      <div
        className={styles.overlay}
        aria-hidden="true"
      />

      <h1
        id="booking-heading"
        className={styles.title}
      >
        Book Appointment
      </h1>
    </section>
  );
}
