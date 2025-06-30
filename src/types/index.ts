export interface Extension {
  id: number;
  title: string;
  community: string;
  topicUrl: string;
  postsCount: number;
  replyCount: number;
  createdAt: string;
  blurb?: string;
  hasAcceptedAnswer?: boolean;
}

export interface Community {
  name: string;
  base: string;
  catPath: string;
  searchPath: string;
  spSuffix: string;
  icon: string;
  color: string;
}