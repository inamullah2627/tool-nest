export type CategoryId =
  "developer" | "text" | "seo" | "image" | "pdf" | "calculators";
export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: CategoryId;
  iconKey: string;
  keywords: string[];
  group: string;
  availability: "catalog" | "coming-soon";
  implementationStatus: "planned" | "coming-soon";
  featured: boolean;
  seo: { title: string; description: string };
}
export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  iconKey: string;
  active: boolean;
}
