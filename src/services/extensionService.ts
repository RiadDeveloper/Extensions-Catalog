import { Extension, Community } from '../types';
import { TAG_REGEX, RATE_LIMIT_DELAY } from '../config/communities';

export class ExtensionService {
  private cache = new Map<string, Extension[]>();
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(url: string, retries: number = this.MAX_RETRIES): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          return response;
        }
        
        if (attempt === retries) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying, with exponential backoff
        await this.delay(this.RETRY_DELAY * Math.pow(2, attempt));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  async fetchCommunityExtensions(
    community: Community,
    searchTerm: string = '',
    offset: number = 0
  ): Promise<Extension[]> {
    const cacheKey = `${community.name}-${searchTerm}-${offset}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const isSearch = Boolean(searchTerm);
    const apiUrl = isSearch
      ? `${community.base}${community.searchPath}${encodeURIComponent(searchTerm)}${community.spSuffix}&offset=${offset}`
      : `${community.base}${community.catPath}?page=${Math.floor(offset/30) + 1}`;
    
    // Try multiple CORS proxy services as fallbacks
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
      `https://cors-anywhere.herokuapp.com/${apiUrl}`
    ];

    let lastError: Error | null = null;

    for (const proxyUrl of proxyUrls) {
      try {
        const response = await this.fetchWithRetry(proxyUrl);
        const data = await response.json();
        
        let extensions: Extension[] = [];

        if (isSearch) {
          const topicMap = new Map();
          (data.topics || []).forEach((topic: any) => topicMap.set(topic.id, topic));

          extensions = (data.posts || [])
            .map((post: any) => {
              const topic = topicMap.get(post.topic_id);
              return topic ? {
                id: topic.id,
                title: topic.title,
                community: community.name,
                topicUrl: `${community.base}/t/${topic.slug}/${topic.id}`,
                postsCount: topic.posts_count,
                replyCount: topic.reply_count,
                createdAt: topic.created_at,
                blurb: post.blurb,
                hasAcceptedAnswer: topic.has_accepted_answer
              } : null;
            })
            .filter((ext: Extension | null) => ext !== null);
        } else {
          extensions = (data.topic_list?.topics || []).map((topic: any) => ({
            id: topic.id,
            title: topic.title,
            community: community.name,
            topicUrl: `${community.base}/t/${topic.slug}/${topic.id}`,
            postsCount: topic.posts_count,
            replyCount: topic.reply_count,
            createdAt: topic.created_at,
            hasAcceptedAnswer: topic.has_accepted_answer
          }));
        }

        const filteredExtensions = extensions.filter(ext => TAG_REGEX.test(ext.title));
        this.cache.set(cacheKey, filteredExtensions);
        return filteredExtensions;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Failed to fetch from ${community.name} using proxy ${proxyUrl}:`, error);
        continue; // Try next proxy
      }
    }

    // If all proxies failed, log the error but return empty array to prevent app crash
    console.error(`All proxy attempts failed for ${community.name}:`, lastError);
    
    // Cache empty result to prevent repeated failed requests
    this.cache.set(cacheKey, []);
    return [];
  }

  async fetchMultipleCommunities(
    communities: Community[],
    searchTerm: string = '',
    offset: number = 0
  ): Promise<Extension[]> {
    const promises = communities.map((community, index) =>
      new Promise<Extension[]>(resolve => {
        setTimeout(() => {
          this.fetchCommunityExtensions(community, searchTerm, offset)
            .then(resolve)
            .catch((error) => {
              console.error(`Error fetching from ${community.name}:`, error);
              resolve([]); // Return empty array on error to prevent Promise.all from failing
            });
        }, index * RATE_LIMIT_DELAY);
      })
    );

    const results = await Promise.all(promises);
    const allExtensions = results.flat();
    
    // Log summary of results
    const successfulCommunities = results.filter(result => result.length > 0).length;
    console.log(`Successfully fetched from ${successfulCommunities}/${communities.length} communities`);
    
    return allExtensions;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Method to check if a community is accessible
  async testCommunityConnection(community: Community): Promise<boolean> {
    try {
      await this.fetchCommunityExtensions(community, '', 0);
      return true;
    } catch {
      return false;
    }
  }
}

export const extensionService = new ExtensionService();