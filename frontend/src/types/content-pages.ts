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
