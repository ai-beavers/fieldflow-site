// Types for the seo-engine public Article API response

export interface ITag {
  title: string;
  slug: string;
}

export interface ICategory {
  title: string;
  slug: string;
}

export interface IRelatedPost {
  id: string;
  headline: string;
  slug: string;
  url?: string;
}

export interface ISourceUsed {
  title: string;
  url: string;
  domain: string;
}

export interface IProvenance {
  sourceCount: number;
  sourceDomains: string[];
  numericClaimCount: number;
  comparisonTableCount: number;
}

export interface IArticle {
  id: string;
  slug: string;
  url?: string;
  headline: string;
  metaDescription: string;
  metaKeywords: string;
  tags: ITag[];
  category: ICategory;
  readingTime: number;
  /** Pre-rendered HTML body - use dangerouslySetInnerHTML */
  html: string;
  markdown: string;
  outline: string;
  /** JSON-LD BlogPosting string (already serialised) */
  jsonldBlogposting: string;
  /** JSON-LD FAQPage string (already serialised, may be empty) */
  jsonldFaqpage: string;
  /** JSON-LD type-specific schema string (HowTo/ItemList) */
  jsonldTypeSpecific?: string;
  jsonldVideoobject?: string;
  articleType?: string;
  answerTargets?: {
    primary_question?: string;
    follow_up_questions?: string[];
    definitional_query?: string;
    comparison_query?: string;
    action_query?: string;
  };
  aeoScore?: number;
  author?: string;
  expertiseLevel?: string;
  methodology?: string;
  reviewedBy?: string;
  sourcesUsed?: ISourceUsed[];
  provenance?: IProvenance;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  language?: string;
  hreflang?: Record<string, string>;
  relatedPosts: IRelatedPost[];
  deleted: boolean;
  isTool?: boolean;
  isVideo?: boolean;
  isNews?: boolean;
}

export interface IArticleListItem extends Omit<IArticle, "html" | "markdown" | "outline" | "jsonldBlogposting" | "jsonldFaqpage"> {}

export interface IArticlesResponse {
  articles: IArticleListItem[];
  total: number;
}

export interface ISitemapEntry {
  slug: string;
  url?: string;
  publishedAt: string;
  updatedAt: string;
  language?: string;
  alternates?: Record<string, string>;
}

export interface ITool {
  id: string;
  slug: string;
  headline: string;
  metaDescription: string;
  html: string;
  updatedAt: string;
  isTool: boolean;
}

export interface IToolListItem extends Omit<ITool, "html"> {}

export interface IToolsResponse {
  tools: IToolListItem[];
  total: number;
}
