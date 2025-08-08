export type HateoasLink = {
  href: string;
  method?: string;
  type?: string;
};

export type HateoasLinks = Record<string, HateoasLink>;
