import { InMemoryCache } from "@apollo/client";

function initCache() {
  const cache = new InMemoryCache();
  return cache;
}
export default initCache;
