import { Client } from '@elastic/elasticsearch';
import { logger } from '../utils/logger.js';

const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
const auth = process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
  ? {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    }
  : undefined;

export const esClient = new Client({
  node,
  auth,
});

export async function connectElasticsearch() {
  try {
    const health = await esClient.cluster.health();
    logger.info('Elasticsearch cluster health:', health);

    // Create product index if it doesn't exist
    await createProductIndex();
  } catch (error) {
    logger.error('Failed to connect to Elasticsearch:', error);
    throw error;
  }
}

async function createProductIndex() {
  const indexName = 'products';

  try {
    const exists = await esClient.indices.exists({ index: indexName });

    if (!exists) {
      await esClient.indices.create({
        index: indexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 1,
            analysis: {
              analyzer: {
                product_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'snowball'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'product_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              description: {
                type: 'text',
                analyzer: 'product_analyzer',
              },
              brandName: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              categoryName: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              specs: { type: 'object' },
              minPrice: { type: 'float' },
              maxPrice: { type: 'float' },
              avgRating: { type: 'float' },
              status: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });

      logger.info(`Created ${indexName} index`);
    }
  } catch (error) {
    logger.error(`Error creating ${indexName} index:`, error);
    throw error;
  }
}

export async function indexProduct(product: any) {
  try {
    await esClient.index({
      index: 'products',
      id: product.id,
      document: product,
    });

    logger.debug(`Indexed product ${product.id}`);
  } catch (error) {
    logger.error('Error indexing product:', error);
    throw error;
  }
}

export async function searchProducts(query: string, filters: any = {}) {
  try {
    const must: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^3', 'description^2', 'brandName', 'categoryName'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    const filter: any[] = [{ term: { status: 'active' } }];

    if (filters.category) {
      filter.push({ term: { 'categoryName.keyword': filters.category } });
    }

    if (filters.brand) {
      filter.push({ term: { 'brandName.keyword': filters.brand } });
    }

    if (filters.minPrice || filters.maxPrice) {
      const range: any = {};
      if (filters.minPrice) range.gte = filters.minPrice;
      if (filters.maxPrice) range.lte = filters.maxPrice;
      filter.push({ range: { minPrice: range } });
    }

    const result = await esClient.search({
      index: 'products',
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: filters.sort || [{ _score: 'desc' }, { createdAt: 'desc' }],
        from: filters.from || 0,
        size: filters.size || 20,
      },
    });

    return {
      total: (result.hits.total as any).value,
      products: result.hits.hits.map((hit) => ({
        ...hit._source,
        score: hit._score,
      })),
    };
  } catch (error) {
    logger.error('Error searching products:', error);
    throw error;
  }
}
