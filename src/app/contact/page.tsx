import type { Metadata } from "next";
import { Contact2 } from "@/components/contact2";

export const metadata: Metadata = {
  title: "Contact | I-Shop",
};

export default function ContactPage() {
  return (
    <Contact2
      className="py-16 md:py-24"
      title="Contact I-Shop"
      description="Questions about products, orders, or partnerships? Send us a message and the I-Shop team will reply as soon as possible."
      phone="+855 096 123 456"
      email="support@i-shop.com"
      web={{ label: "i-shop.com", url: "https://i-shop.com" }}
    />
  );
}
