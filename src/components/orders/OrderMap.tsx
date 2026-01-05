import * as React from "react";

type Props = {
  restaurantAddress: string;
  deliveryAddress?: string | null;
  className?: string;
};

export function OrderMap({ restaurantAddress, deliveryAddress, className }: Props) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const destination = deliveryAddress?.trim() ? deliveryAddress.trim() : null;

  // If API key + destination exist, show route directions.
  const directionsUrl =
    key && destination
      ? `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(
          key
        )}&origin=${encodeURIComponent(restaurantAddress)}&destination=${encodeURIComponent(destination)}`
      : null;

  // Otherwise show a basic map (often works without API key).
  const basicUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    destination ?? restaurantAddress
  )}&output=embed`;

  const src = directionsUrl ?? basicUrl;

  return (
    <div className={className}>
      <div className="rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white">
        <iframe
          title="Order map"
          src={src}
          className="w-full h-[320px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {!destination && (
        <p className="mt-2 text-xs text-yum-text-secondary">
          Add a delivery address at checkout to show route directions.
        </p>
      )}
    </div>
  );
}