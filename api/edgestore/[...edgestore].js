import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/pages';
import { edgeStoreRouter } from '../../src/services/edgestoreRouter.js';

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});
