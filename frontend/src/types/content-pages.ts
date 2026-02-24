import type { StrapiMedia } from "@/types/strapi";

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  action: string;
}

export interface Advantage {
  id: string;
  title: string;
}

export interface Feedback {
  id: string;
  name: string;
  city: string;
  text: string;
  avatar: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface InfoSection {
  title: string;
  paragraphs: string[];
}

export interface InfoPageData {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  sections: InfoSection[];
}

export interface LoyaltyStep {
  id: string;
  iconsCount: number;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface AboutAdvantageItem {
  id: number;
  title: string | null;
}

export interface AboutDifferenceItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: StrapiMedia | null;
}

export interface AboutCollectionPreview {
  id: number;
  title: string | null;
  image: StrapiMedia | null;
}

export interface AboutProductionStep {
  id: number;
  icon: StrapiMedia | null;
  title: string | null;
  description: string | null;
}

export interface AboutCreatingBlock {
  id: number;
  text: string | null;
  image: StrapiMedia | null;
  imagePosition: "left" | "right" | null;
}

export interface AboutPageData {
  heroTitle: string | null;
  heroDesktopImage: StrapiMedia | null;
  heroMobileImage: StrapiMedia | null;
  introText: string | null;
  introButtonLabel: string | null;
  advantages: AboutAdvantageItem[] | null;
  advantageImages: StrapiMedia[] | null;
  historyTitle: string | null;
  historyParagraphs: string[] | null;
  differenceTitle: string | null;
  differenceItems: AboutDifferenceItem[] | null;
  collectionsTitle: string | null;
  collectionsSubtitle: string | null;
  collectionPreviews: AboutCollectionPreview[] | null;
  productionTitle: string | null;
  productionSteps: AboutProductionStep[] | null;
  creatingTitle: string | null;
  creatingBlocks: AboutCreatingBlock[] | null;
}
