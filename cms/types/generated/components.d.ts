import type { Schema, Struct } from '@strapi/strapi';

export interface AboutCollectionPreview extends Struct.ComponentSchema {
  collectionName: 'components_about_collection_previews';
  info: {
    description: '\u041F\u0440\u0435\u0432\u044C\u044E \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u041E \u0431\u0440\u0435\u043D\u0434\u0435';
    displayName: 'Collection Preview';
    icon: 'images';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutCreatingBlock extends Struct.ComponentSchema {
  collectionName: 'components_about_creating_blocks';
  info: {
    description: '\u0411\u043B\u043E\u043A \u0421\u043E\u0437\u0434\u0430\u0451\u043C \u0434\u043B\u044F \u0432\u0430\u0441 (\u0442\u0435\u043A\u0441\u0442 + \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435)';
    displayName: 'Creating Block';
    icon: 'pencil-alt';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface AboutDifferenceItem extends Struct.ComponentSchema {
  collectionName: 'components_about_difference_items';
  info: {
    description: '\u0427\u0442\u043E \u043D\u0430\u0441 \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442 (\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430)';
    displayName: 'Difference Item';
    icon: 'star';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutProductionStep extends Struct.ComponentSchema {
  collectionName: 'components_about_production_steps';
  info: {
    description: '\u042D\u0442\u0430\u043F \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0430';
    displayName: 'Production Step';
    icon: 'cog';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ArticleSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_article_section_headings';
  info: {
    description: '\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0435\u043A\u0446\u0438\u0438 \u0441\u0442\u0430\u0442\u044C\u0438';
    displayName: 'Section Heading';
    icon: 'heading';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    content: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ArticleSectionImages extends Struct.ComponentSchema {
  collectionName: 'components_article_section_images';
  info: {
    description: '\u0413\u0430\u043B\u0435\u0440\u0435\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0432 \u0441\u0442\u0430\u0442\u044C\u0435';
    displayName: 'Section Images';
    icon: 'images';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true>;
  };
}

export interface ArticleSectionList extends Struct.ComponentSchema {
  collectionName: 'components_article_section_lists';
  info: {
    description: '\u0421\u043F\u0438\u0441\u043E\u043A \u0432 \u0441\u0442\u0430\u0442\u044C\u0435';
    displayName: 'Section List';
    icon: 'list-ul';
  };
  attributes: {
    items: Schema.Attribute.JSON;
  };
}

export interface ArticleSectionTable extends Struct.ComponentSchema {
  collectionName: 'components_article_section_tables';
  info: {
    description: '\u0422\u0430\u0431\u043B\u0438\u0446\u0430 \u0432 \u0441\u0442\u0430\u0442\u044C\u0435';
    displayName: 'Section Table';
    icon: 'table';
  };
  attributes: {
    headers: Schema.Attribute.JSON;
    rows: Schema.Attribute.JSON;
  };
}

export interface ArticleSectionText extends Struct.ComponentSchema {
  collectionName: 'components_article_section_texts';
  info: {
    description: '\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u0430\u044F \u0441\u0435\u043A\u0446\u0438\u044F \u0441\u0442\u0430\u0442\u044C\u0438';
    displayName: 'Section Text';
    icon: 'align-left';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ArticleTocItem extends Struct.ComponentSchema {
  collectionName: 'components_article_toc_items';
  info: {
    description: '\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u043E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u044C\u0438';
    displayName: 'TOC Item';
    icon: 'list';
  };
  attributes: {
    anchorId: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatalogCategoryBanner extends Struct.ComponentSchema {
  collectionName: 'components_catalog_category_banners';
  info: {
    description: '\u0411\u0430\u043D\u043D\u0435\u0440 \u0432 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430 \u0441 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u0430';
    displayName: 'Category Banner';
    icon: 'picture';
  };
  attributes: {
    endDate: Schema.Attribute.DateTime;
    image: Schema.Attribute.Media<'images'>;
    isFullWidth: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String;
    startDate: Schema.Attribute.DateTime;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CatalogFilter extends Struct.ComponentSchema {
  collectionName: 'components_catalog_filters';
  info: {
    description: '\u0424\u0438\u043B\u044C\u0442\u0440 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430 \u0441 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430\u043C\u0438';
    displayName: 'Filter';
    icon: 'filter';
  };
  attributes: {
    options: Schema.Attribute.Component<'catalog.filter-option', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatalogFilterOption extends Struct.ComponentSchema {
  collectionName: 'components_catalog_filter_options';
  info: {
    description: '\u0412\u0430\u0440\u0438\u0430\u043D\u0442 \u0444\u0438\u043B\u044C\u0442\u0440\u0430 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430';
    displayName: 'Filter Option';
    icon: 'filter';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatalogSubcategory extends Struct.ComponentSchema {
  collectionName: 'components_catalog_subcategories';
  info: {
    description: '\u041F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430';
    displayName: 'Subcategory';
    icon: 'folder';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactsBoutiqueAddress extends Struct.ComponentSchema {
  collectionName: 'components_contacts_boutique_addresses';
  info: {
    description: '\u0410\u0434\u0440\u0435\u0441 \u0431\u0443\u0442\u0438\u043A\u0430';
    displayName: 'Boutique Address';
    icon: 'map-marker-alt';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    email: Schema.Attribute.String;
    mapImage: Schema.Attribute.Media<'images'>;
    metro: Schema.Attribute.String;
    metroDetail: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    schedule: Schema.Attribute.String;
    scheduleTime: Schema.Attribute.String;
  };
}

export interface CooperationPartnerOfferItem extends Struct.ComponentSchema {
  collectionName: 'components_cooperation_partner_offer_items';
  info: {
    description: '\u041F\u0443\u043D\u043A\u0442 \u043F\u0430\u0440\u0442\u043D\u0451\u0440\u0441\u043A\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F';
    displayName: 'Partner Offer Item';
    icon: 'handshake';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerInfoDeliveryTab extends Struct.ComponentSchema {
  collectionName: 'components_customer_info_delivery_tabs';
  info: {
    description: '\u0422\u0430\u0431 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438';
    displayName: 'Delivery Tab';
    icon: 'truck';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    tabId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerInfoInfoCard extends Struct.ComponentSchema {
  collectionName: 'components_customer_info_info_cards';
  info: {
    description: '\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 (\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430, \u043E\u043F\u043B\u0430\u0442\u0430 \u0438 \u0442.\u0434.)';
    displayName: 'Info Card';
    icon: 'id-card';
  };
  attributes: {
    highlight: Schema.Attribute.String;
    link: Schema.Attribute.Component<'customer-info.info-link', false>;
    paragraphs: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerInfoInfoCategory extends Struct.ComponentSchema {
  collectionName: 'components_customer_info_info_categories';
  info: {
    description: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F';
    displayName: 'Info Category';
    icon: 'folder-open';
  };
  attributes: {
    cards: Schema.Attribute.Component<'customer-info.info-card', true>;
    categoryId: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    tabs: Schema.Attribute.Component<'customer-info.delivery-tab', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomerInfoInfoLink extends Struct.ComponentSchema {
  collectionName: 'components_customer_info_info_links';
  info: {
    description: '\u0421\u0441\u044B\u043B\u043A\u0430 \u0432 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435';
    displayName: 'Info Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_columns';
  info: {
    description: '\u041A\u043E\u043B\u043E\u043D\u043A\u0430 \u0441\u0441\u044B\u043B\u043E\u043A \u0432 \u0444\u0443\u0442\u0435\u0440\u0435';
    displayName: 'Footer Column';
    icon: 'layout';
  };
  attributes: {
    links: Schema.Attribute.Component<'navigation.menu-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeBudgetCollection extends Struct.ComponentSchema {
  collectionName: 'components_home_budget_collections';
  info: {
    description: '\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u0434\u043B\u044F \u0431\u044E\u0434\u0436\u0435\u0442\u0430 (\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430)';
    displayName: 'Budget Collection';
    icon: 'shopping-bag';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeProductTab extends Struct.ComponentSchema {
  collectionName: 'components_home_product_tabs';
  info: {
    description: '\u0422\u0430\u0431 \u0442\u043E\u0432\u0430\u0440\u043E\u0432 (\u0425\u0438\u0442\u044B, \u041D\u043E\u0432\u0438\u043D\u043A\u0438, \u0410\u043A\u0446\u0438\u0438)';
    displayName: 'Product Tab';
    icon: 'layer';
  };
  attributes: {
    filterType: Schema.Attribute.Enumeration<['hits', 'new', 'sale']>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
  };
}

export interface HomePromoItem extends Struct.ComponentSchema {
  collectionName: 'components_home_promo_items';
  info: {
    description: '\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u043F\u0440\u043E\u043C\u043E-\u0431\u0430\u043D\u043D\u0435\u0440\u0430 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u043E\u0439';
    displayName: 'Promo Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InfoSection extends Struct.ComponentSchema {
  collectionName: 'components_info_sections';
  info: {
    description: '\u0421\u0435\u043A\u0446\u0438\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B (\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A + \u0430\u0431\u0437\u0430\u0446\u044B)';
    displayName: 'Info Section';
    icon: 'align-left';
  };
  attributes: {
    paragraphs: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LoyaltyBalanceCheck extends Struct.ComponentSchema {
  collectionName: 'components_loyalty_balance_checks';
  info: {
    description: '\u0411\u043B\u043E\u043A \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0431\u0430\u043B\u0430\u043D\u0441\u0430';
    displayName: 'Balance Check';
    icon: 'wallet';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LoyaltyStep extends Struct.ComponentSchema {
  collectionName: 'components_loyalty_steps';
  info: {
    description: '\u0428\u0430\u0433 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u043B\u043E\u044F\u043B\u044C\u043D\u043E\u0441\u0442\u0438';
    displayName: 'Loyalty Step';
    icon: 'shoe-prints';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconsCount: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationCatalogCategory extends Struct.ComponentSchema {
  collectionName: 'components_navigation_catalog_categories';
  info: {
    description: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430 \u0432 \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438 \u0441 \u043F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C\u0438';
    displayName: 'Catalog Category';
    icon: 'apps';
  };
  attributes: {
    hasSubmenu: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    subcategories: Schema.Attribute.Component<'navigation.menu-item', true>;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    description: '\u041F\u0443\u043D\u043A\u0442 \u043C\u0435\u043D\u044E \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438';
    displayName: 'Menu Item';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ProductColor extends Struct.ComponentSchema {
  collectionName: 'components_product_colors';
  info: {
    description: '\u0426\u0432\u0435\u0442 \u0442\u043E\u0432\u0430\u0440\u0430';
    displayName: 'Color';
    icon: 'paint-brush';
  };
  attributes: {
    hex: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSetItem extends Struct.ComponentSchema {
  collectionName: 'components_product_set_items';
  info: {
    description: '\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442\u0430';
    displayName: 'Set Item';
    icon: 'layer-group';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    oldPrice: Schema.Attribute.String;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    sizes: Schema.Attribute.Component<'product.size-option', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSizeChartRow extends Struct.ComponentSchema {
  collectionName: 'components_product_size_chart_rows';
  info: {
    description: '\u0421\u0442\u0440\u043E\u043A\u0430 \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u0440\u0430\u0437\u043C\u0435\u0440\u043E\u0432';
    displayName: 'Size Chart Row';
    icon: 'grid';
  };
  attributes: {
    dimensions: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    size: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSizeOption extends Struct.ComponentSchema {
  collectionName: 'components_product_size_options';
  info: {
    description: '\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u043E\u0432\u0430\u0440\u0430';
    displayName: 'Size Option';
    icon: 'ruler';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    description: '\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0430 \u0442\u043E\u0432\u0430\u0440\u0430 (\u043A\u043B\u044E\u0447-\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435)';
    displayName: 'Specification';
    icon: 'bulletList';
  };
  attributes: {
    key: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SearchPopularQuery extends Struct.ComponentSchema {
  collectionName: 'components_search_popular_queries';
  info: {
    description: '\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0439 \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441';
    displayName: 'Popular Query';
    icon: 'search';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_shared_advantages';
  info: {
    description: '\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E (\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0431\u043B\u043E\u043A)';
    displayName: 'Advantage';
    icon: 'check';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: '\u0412\u043E\u043F\u0440\u043E\u0441-\u043E\u0442\u0432\u0435\u0442';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeedback extends Struct.ComponentSchema {
  collectionName: 'components_shared_feedbacks';
  info: {
    description: '\u041E\u0442\u0437\u044B\u0432 \u043A\u043B\u0438\u0435\u043D\u0442\u0430';
    displayName: 'Feedback';
    icon: 'message';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    city: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    source: Schema.Attribute.Enumeration<['yandex', '2gis', 'google']>;
    sourceUrl: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: '\u0421\u043B\u0430\u0439\u0434 \u0431\u0430\u043D\u043D\u0435\u0440\u0430 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u043E\u0439';
    displayName: 'Hero Slide';
    icon: 'picture';
  };
  attributes: {
    action: Schema.Attribute.String;
    desktopImage: Schema.Attribute.Media<'images'>;
    mobileImage: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: '\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0441\u043E\u0446\u0441\u0435\u0442\u044C';
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SpecialOffersBonusSection extends Struct.ComponentSchema {
  collectionName: 'components_special_offers_bonus_sections';
  info: {
    description: '\u0411\u043B\u043E\u043A \u0431\u043E\u043D\u0443\u0441\u043E\u0432';
    displayName: 'Bonus Section';
    icon: 'gift';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SpecialOffersOffer extends Struct.ComponentSchema {
  collectionName: 'components_special_offers_offers';
  info: {
    description: '\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435';
    displayName: 'Offer';
    icon: 'tag';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.collection-preview': AboutCollectionPreview;
      'about.creating-block': AboutCreatingBlock;
      'about.difference-item': AboutDifferenceItem;
      'about.production-step': AboutProductionStep;
      'article.section-heading': ArticleSectionHeading;
      'article.section-images': ArticleSectionImages;
      'article.section-list': ArticleSectionList;
      'article.section-table': ArticleSectionTable;
      'article.section-text': ArticleSectionText;
      'article.toc-item': ArticleTocItem;
      'catalog.category-banner': CatalogCategoryBanner;
      'catalog.filter': CatalogFilter;
      'catalog.filter-option': CatalogFilterOption;
      'catalog.subcategory': CatalogSubcategory;
      'contacts.boutique-address': ContactsBoutiqueAddress;
      'cooperation.partner-offer-item': CooperationPartnerOfferItem;
      'customer-info.delivery-tab': CustomerInfoDeliveryTab;
      'customer-info.info-card': CustomerInfoInfoCard;
      'customer-info.info-category': CustomerInfoInfoCategory;
      'customer-info.info-link': CustomerInfoInfoLink;
      'footer.column': FooterColumn;
      'home.budget-collection': HomeBudgetCollection;
      'home.product-tab': HomeProductTab;
      'home.promo-item': HomePromoItem;
      'info.section': InfoSection;
      'loyalty.balance-check': LoyaltyBalanceCheck;
      'loyalty.step': LoyaltyStep;
      'navigation.catalog-category': NavigationCatalogCategory;
      'navigation.menu-item': NavigationMenuItem;
      'product.color': ProductColor;
      'product.set-item': ProductSetItem;
      'product.size-chart-row': ProductSizeChartRow;
      'product.size-option': ProductSizeOption;
      'product.specification': ProductSpecification;
      'search.popular-query': SearchPopularQuery;
      'shared.advantage': SharedAdvantage;
      'shared.faq-item': SharedFaqItem;
      'shared.feedback': SharedFeedback;
      'shared.hero-slide': SharedHeroSlide;
      'shared.social-link': SharedSocialLink;
      'special-offers.bonus-section': SpecialOffersBonusSection;
      'special-offers.offer': SpecialOffersOffer;
    }
  }
}
