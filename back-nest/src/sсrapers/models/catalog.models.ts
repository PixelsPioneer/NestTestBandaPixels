export interface Subcategory {
  name: string;
  sections: { name: string; url: string }[];
}

export interface ScrapedCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}
