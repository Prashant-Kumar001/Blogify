// requestIdMiddleware.js
import { v4 as uuidv4 } from 'uuid';

export default (req, res, next) => {
  // Generate a unique requestId for each request and store it in res.locals
  res.locals.requestId = uuidv4(); // Set a UUID as the requestId
  next();
};
