export const contactInfo = {
  phone: "+7 926 000 35 92",
  email: "vahome@mail.ru",
  socials: [
    { label: "ВКонтакте", href: "#" },
    { label: "Telegram", href: "#" },
  ],
  image: "/assets/figma/contacts/boutique.jpg",
};

export type BoutiqueAddress = {
  id: string;
  city: string;
  address: string;
  metro: string;
  metroDetail: string;
  schedule: string;
  scheduleTime: string;
  phone: string;
  email: string;
  mapImage: string;
};

export const boutiques: BoutiqueAddress[] = [
  {
    id: "moscow",
    city: "Москва",
    address: "Бутик, Мичуринский проспект, д. 34",
    metro: "Раменки",
    metroDetail: "(1 мин, вход со стороны Винницкой улицы)",
    schedule: "График работы бутика",
    scheduleTime: "ПН-СБ с 11:00 до 21:00",
    phone: "+7 926 000 35 92",
    email: "vahome@mail.ru",
    mapImage: "/assets/figma/contacts/map.jpg",
  },
  {
    id: "krasnodar",
    city: "Краснодар",
    address: "Бутик, Мичуринский проспект, д. 34",
    metro: "Раменки",
    metroDetail: "(1 мин, вход со стороны Винницкой улицы)",
    schedule: "График работы бутика",
    scheduleTime: "ПН-СБ с 11:00 до 21:00",
    phone: "+7 926 000 35 92",
    email: "vahome@mail.ru",
    mapImage: "/assets/figma/contacts/map.jpg",
  },
  {
    id: "spb",
    city: "Санкт-Петербург",
    address: "Бутик, Мичуринский проспект, д. 34",
    metro: "Раменки",
    metroDetail: "(1 мин, вход со стороны Винницкой улицы)",
    schedule: "График работы бутика",
    scheduleTime: "ПН-СБ с 11:00 до 21:00",
    phone: "+7 926 000 35 92",
    email: "vahome@mail.ru",
    mapImage: "/assets/figma/contacts/map.jpg",
  },
];
