import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
/**
 * Create a preconfigured QueryClient tailored for the application's default query behavior.
 *
 * The client sets query staleTime to 30 seconds and enables dehydration for queries when
 * the default dehydrate predicate is true or when a query's state status is `'pending'`.
 *
 * @returns A QueryClient configured with the described default options
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}