export type IconName =
  | "logo"
  | "burger"
  | "chevronDown"
  | "search"
  | "user"
  | "favorite"
  | "bag"
  | "telegram"
  | "whatsapp"
  | "arrowRight"
  | "play"
  | "rating"
  | "diamond"
  | "diamondAlt"
  | "email"
  | "phone"
  | "instagram"
  | "vk"
  | "loading"
  | "arrowUp"
  | "arrowDown"
  | "close"
  | "minus"
  | "plus"
  | "checkCircle"
  | "location"
  | "chatBubbles"
  | "clock"
  | "catalogBedLinen"
  | "catalogHomeTextile"
  | "catalogBlankets"
  | "catalogPillows"
  | "catalogPlaids"
  | "catalogTowels"
  | "catalogBoudoir"
  | "chevronRight";

export type IconVariant = "default" | "scroll";

type IconMap = Record<IconName, { default: string; scroll?: string }>;

export const iconMap: IconMap = {
  logo: {
    default: "/assets/figma/footer/logo.svg",
    scroll: "/assets/figma/header/logo.svg",
  },
  burger: {
    default: "/assets/figma/header/burger.svg",
    scroll: "/assets/figma/header-scroll/burger.svg",
  },
  chevronDown: {
    default: "/assets/figma/header/chevron-down.svg",
    scroll: "/assets/figma/header-scroll/chevron-down.svg",
  },
  search: {
    default: "/assets/figma/header/search.svg",
    scroll: "/assets/figma/header-scroll/search.svg",
  },
  user: {
    default: "/assets/figma/header/user.svg",
    scroll: "/assets/figma/header-scroll/user.svg",
  },
  favorite: {
    default: "/assets/figma/header/favorite.svg",
    scroll: "/assets/figma/header-scroll/favorite.svg",
  },
  bag: {
    default: "/assets/figma/header/bag.svg",
    scroll: "/assets/figma/header-scroll/bag.svg",
  },
  telegram: {
    default: "/assets/figma/header/telegram.svg",
  },
  whatsapp: {
    default: "/assets/figma/header/whatsapp.svg",
  },
  arrowRight: {
    default: "/assets/figma/collections/arrow-right.svg",
  },
  play: {
    default: "/assets/figma/boutique/play.svg",
  },
  rating: {
    default: "/assets/figma/collections/rating.svg",
  },
  diamond: {
    default: "/assets/figma/collections/diamond.svg",
  },
  diamondAlt: {
    default: "/assets/figma/collections/diamond-2.svg",
  },
  email: {
    default: "/assets/figma/footer/email.svg",
  },
  phone: {
    default: "/assets/figma/footer/phone.svg",
  },
  instagram: {
    default: "/assets/figma/footer/instagram.svg",
  },
  vk: {
    default: "/assets/figma/footer/vk.svg",
  },
  loading: {
    default: "/assets/figma/icons/loading.svg",
  },
  arrowUp: {
    default: "/assets/figma/icons/arrow-up.svg",
  },
  arrowDown: {
    default: "/assets/figma/icons/arrow-down.svg",
  },
  close: {
    default: "/assets/figma/icons/close.svg",
  },
  minus: {
    default: "/assets/figma/icons/minus.svg",
  },
  plus: {
    default: "/assets/figma/icons/plus.svg",
  },
  checkCircle: {
    default: "/assets/figma/icons/check-circle.svg",
  },
  location: {
    default: "/assets/figma/icons/location.svg",
  },
  chatBubbles: {
    default: "/assets/figma/icons/chat-bubbles.svg",
  },
  clock: {
    default: "/assets/figma/icons/clock.svg",
  },
  catalogBedLinen: {
    default: "/assets/figma/icons/catalog/bed-linen.svg",
  },
  catalogHomeTextile: {
    default: "/assets/figma/icons/catalog/home-textile.svg",
  },
  catalogBlankets: {
    default: "/assets/figma/icons/catalog/blankets.svg",
  },
  catalogPillows: {
    default: "/assets/figma/icons/catalog/pillows.svg",
  },
  catalogPlaids: {
    default: "/assets/figma/icons/catalog/plaids.svg",
  },
  catalogTowels: {
    default: "/assets/figma/icons/catalog/towels.svg",
  },
  catalogBoudoir: {
    default: "/assets/figma/icons/catalog/boudoir.svg",
  },
  chevronRight: {
    default: "/assets/figma/icons/arrow-right.svg",
  },
};
