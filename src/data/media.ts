export type MediaRole =
  | "hero"
  | "model"
  | "detail"
  | "editorial"
  | "collection"
  | "category"
  | "gender";

export type StageTone = "linen" | "sage" | "sand" | "slate" | "charcoal";

export type CampaignImage = {
  id: string;
  role: MediaRole;
  label: string;
  alt: string;
  tone: StageTone;
  crop?: string;
  cropMobile?: string;
  /** Set when campaign photography is ready. Layout does not depend on this. */
  src?: string;
  srcMobile?: string;
};

/**
 * Homepage campaign slots. Leave `src` empty until AI photography lands.
 * Replacing src must not change aspect, crop, or page composition.
 */
export const campaignMedia = {
  hero: {
    id: "hero",
    role: "hero",
    label: "Campaign 01",
    alt: "Olive field jacket close-up beside a man wearing the jacket",
    tone: "linen",
    src: "/Hero/hero-editorial.jpg",
    srcMobile: "/Hero/hero-editorial.jpg",
    crop: "center center",
    cropMobile: "78% 22%",
  },
  editorial: {
    id: "editorial",
    role: "editorial",
    label: "Campaign 02",
    alt: "Editorial campaign",
    tone: "sage",
    crop: "center",
  },
  landscape: {
    id: "landscape",
    role: "editorial",
    label: "Campaign 03",
    alt: "Seasonal campaign",
    tone: "charcoal",
    crop: "center",
  },
  women: {
    id: "cat-women",
    role: "category",
    label: "Women",
    alt: "Womens collection",
    tone: "sand",
    crop: "center 18%",
  },
  men: {
    id: "cat-men",
    role: "category",
    label: "Men",
    alt: "Mens collection",
    tone: "slate",
    crop: "center 16%",
  },
  newIn: {
    id: "cat-new",
    role: "category",
    label: "New In",
    alt: "New in",
    tone: "linen",
    crop: "center",
  },
} as const satisfies Record<string, CampaignImage>;
