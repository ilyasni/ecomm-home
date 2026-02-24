import { strapiSingleType } from "@/lib/strapi";

export interface NavigationMenuItem {
  id: number;
  label: string;
  href: string;
  isHighlighted: boolean;
  openInNewTab: boolean;
}

export interface NavigationCatalogCategory {
  id: number;
  label: string;
  href: string;
  hasSubmenu: boolean;
  subcategories: NavigationMenuItem[];
}

export interface NavigationData {
  topBarText: string | null;
  phone: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  topMenuItems: NavigationMenuItem[];
  catalogCategories: NavigationCatalogCategory[];
}

export interface FooterColumn {
  id: number;
  title: string;
  links: NavigationMenuItem[];
}

export interface FooterSocialLink {
  id: number;
  label: string;
  href: string;
  icon: string | null;
}

export interface FooterData {
  columns: FooterColumn[];
  bottomText: string | null;
  phone: string | null;
  email: string | null;
  socials: FooterSocialLink[];
  paymentIcons: unknown[];
}

export async function getNavigation() {
  return strapiSingleType<NavigationData>(
    "navigation",
    {
      "populate[topMenuItems]": "*",
      "populate[catalogCategories][populate]": "subcategories",
    },
    { revalidate: 300, tags: ["navigation"] }
  );
}

export async function getFooter() {
  return strapiSingleType<FooterData>(
    "footer",
    {
      "populate[columns][populate]": "links",
      "populate[socials]": "*",
    },
    { revalidate: 300, tags: ["footer"] }
  );
}
