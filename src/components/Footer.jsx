import { Facebook, Instagram, Github, Twitter } from "lucide-react";
import Newsletter from "@/components/Newsletter";
import {
  VisaIcon,
  MastercardIcon,
  PayPalIcon,
  ApplePayIcon,
  GPayIcon,
} from "@/components/icons/PaymentIcons";

const columns = [
  {
    title: "Company",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "Help",
    links: [
      "Customer Support",
      "Delivery Details",
      "Terms & Conditions",
      "Privacy Policy",
    ],
  },
  {
    title: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    title: "Resources",
    links: [
      "Free eBooks",
      "Development Tutorial",
      "How to - Blog",
      "Youtube Playlist",
    ],
  },
];

const socials = [Facebook, Twitter, Instagram, Github];
const paymentIcons = [
  VisaIcon,
  MastercardIcon,
  PayPalIcon,
  ApplePayIcon,
  GPayIcon,
];

// Figma: width 1441 / height 499 -> full-width footer, height driven by
// content instead of a fixed px value.
export default function Footer() {
  return (
    <footer className="bg-surface-100 pt-28">
      <div className="mx-auto mt-14 w-full max-w-container px-[4%] pb-16">
        <div className="grid grid-cols-2 gap-8 border-b border-black/10 pb-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <span className="font-integral text-2xl font-bold">SHOP.CO</span>
            <p className="mt-4 max-w-[70%] font-satoshi text-sm text-black/60">
              We have clothes that suit your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 hover:bg-black hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-satoshi text-sm font-semibold uppercase tracking-wide text-black/80">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-satoshi text-sm text-black/60 hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
          <p className="font-satoshi text-xs text-black/50">
            Shop.co © 2000-2026, All Rights Reserved
          </p>
          <div className="flex gap-2">
            {paymentIcons.map((Icon, i) => (
              <Icon key={i} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
