import redis from 'redis';
import util from 'util';
import logger from './logger.js';

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  logger.error(`Redis error: ${err}`);
});

client.connect();

const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

export const cache = async (key, ttl, fetchFunction) => {
  try {
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const freshData = await fetchFunction();
      await client.setEx(key, ttl, JSON.stringify(freshData));
      return freshData;
    }
  } catch (error) {
    logger.error(`Cache error: ${error.message}`);
    return fetchFunction();
  }
};
