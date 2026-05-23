export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateFormData {
  name: string;
  slug?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  templateId: string | null;
  template?: Template | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  templateId?: string | null;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Author {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  content: string;
  contentEn: string | null;
  image: string | null;
  imageCaption: string | null;
  status: PostStatus;
  authorId: string;
  author?: Author;
  categoryId: string;
  category?: Category;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  titleEn?: string;
  slug?: string;
  content: string;
  contentEn?: string;
  image?: string | null;
  imageCaption?: string;
  status: PostStatus;
  categoryId: string;
}

// ============================================================================
// ENTITAS HALAMAN STATIS (PAGES)
// ============================================================================
export interface Page {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  content: string;
  contentEn: string | null;
  // Penampung data JSON dinamis (Custom Fields)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentExtras: any | null;
  image: string | null;
  imageCaption: string | null;
  status: PostStatus;
  templateId: string | null;
  template?: Template | null;
  author?: { name: string };
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PageFormData {
  title: string;
  titleEn?: string;
  slug?: string;
  content: string;
  contentEn?: string;
  // Penampung isian form JSON dinamis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentExtras?: any;
  image?: string | null;
  imageCaption?: string;
  status: PostStatus;
  templateId?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  images?: string[];
  button1Label: string | null;
  button1Url: string | null;
  button2Label: string | null;
  button2Url: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string | null;
  authorId: string;
  category?: { id: string; name: string };
  author?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}