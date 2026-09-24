import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountView } from "@/components/pages/AccountView";
import { ContactView } from "@/components/pages/ContactView";
import { LegalView } from "@/components/pages/LegalView";
import { MadeToMoveView } from "@/components/pages/MadeToMoveView";
import { OurStoryView } from "@/components/pages/OurStoryView";
import { SignaturePiecesView } from "@/components/pages/SignaturePiecesView";
import { SizeGuideView } from "@/components/pages/SizeGuideView";

const pages = {
  "our-story": {
    title: "Our Story",
    description: "Reevear menswear — clothing made to be worn.",
    View: OurStoryView,
  },
  "made-to-move": {
    title: "Made to Move",
    description: "Performance pieces for training and everyday life.",
    View: MadeToMoveView,
  },
  "signature-pieces": {
    title: "Signature Pieces",
    description: "A selection of pieces that define Reevear.",
    View: SignaturePiecesView,
  },
  contact: {
    title: "Contact",
    description: "Contact Reevear.",
    View: ContactView,
  },
  account: {
    title: "Account",
    description: "Reevear account is not connected yet.",
    View: AccountView,
  },
  shipping: {
    title: "Shipping & Delivery",
    description: "Reevear shipping and delivery information.",
    View: () => <LegalView slug="shipping" />,
  },
  returns: {
    title: "Returns & Refunds",
    description: "Reevear returns, refunds, and UK consumer rights.",
    View: () => <LegalView slug="returns" />,
  },
  privacy: {
    title: "Privacy",
    description: "How the Reevear website handles personal information.",
    View: () => <LegalView slug="privacy" />,
  },
  cookies: {
    title: "Cookies",
    description: "Storage and access technologies used on the Reevear website.",
    View: () => <LegalView slug="cookies" />,
  },
  terms: {
    title: "Terms",
    description: "Terms for using the Reevear website.",
    View: () => <LegalView slug="terms" />,
  },
  "size-guide": {
    title: "Size Guide",
    description: "How to measure and choose a Reevear size.",
    View: SizeGuideView,
  },
} as const;

type PageSlug = keyof typeof pages;

type Props = {
  params: Promise<{ slug: string }>;
};

function isPageSlug(slug: string): slug is PageSlug {
  return slug in pages;
}

export async function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPageSlug(slug)) return { title: "Reevear" };
  const page = pages[slug];
  return {
    title: `${page.title} | Reevear`,
    description: page.description,
  };
}

export default async function FoundationPage({ params }: Props) {
  const { slug } = await params;
  if (!isPageSlug(slug)) notFound();
  const page = pages[slug];
  const View = page.View;

  return <View />;
}
