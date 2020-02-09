import { Pool } from 'pg';
import { DB_CONFIG } from '../configs';

class Database {
  constructor(dbConfig) {
    this.pool = new Pool(dbConfig);
  }

  init(schemas = []) {
    if (schemas === []) return;
    if (schemas.length === 1) return this.pool.query(schemas[0]);
    return this.pool.query(schemas[0], () => this.init(schemas.slice(1)));
  };

  query(request = '') {
    return this.pool.query(request);
  }
}

export default new Database(DB_CONFIG);