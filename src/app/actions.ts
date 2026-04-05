"use server";

import { revalidateTag } from "next/cache";
import { clearAllCaches } from "@/lib/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Invalida cache do Next (tags) e o cache em memória das libs,
 * para o próximo `router.refresh()` buscar dados frescos.
 */
export async function refreshTrendingData(): Promise<void> {
  clearAllCaches();
  revalidateTag(CACHE_TAGS.githubTrending, "max");
  revalidateTag(CACHE_TAGS.npmTrending, "max");
}
