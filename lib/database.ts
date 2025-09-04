/**
 * Database Connection and Query Utilities
 * Cloudflare D1 数据库连接和查询工具
 */

// 数据库接口定义
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    served_by: string;
    duration: number;
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// 环境变量和配置
interface DatabaseConfig {
  database: D1Database | null;
  environment: 'development' | 'production' | 'preview';
  isDevelopment: boolean;
}

// 获取数据库配置
export function getDatabaseConfig(): DatabaseConfig {
  const environment = (process.env.ENVIRONMENT || 'development') as 'development' | 'production' | 'preview';
  
  return {
    database: null, // 将在运行时由Cloudflare Workers注入
    environment,
    isDevelopment: environment === 'development'
  };
}

// 数据库查询基础类
export class DatabaseQuery {
  private db: D1Database;

  constructor(database: D1Database) {
    this.db = database;
  }

  // 执行查询并返回单个结果
  async first<T = any>(query: string, params: any[] = []): Promise<T | null> {
    try {
      const stmt = this.db.prepare(query);
      const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
      return await boundStmt.first<T>();
    } catch (error) {
      console.error('Database query error (first):', error, { query, params });
      throw new DatabaseError('Query execution failed', error);
    }
  }

  // 执行查询并返回所有结果
  async all<T = any>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const stmt = this.db.prepare(query);
      const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
      const result = await boundStmt.all<T>();
      return result.results || [];
    } catch (error) {
      console.error('Database query error (all):', error, { query, params });
      throw new DatabaseError('Query execution failed', error);
    }
  }

  // 执行插入/更新/删除操作
  async run(query: string, params: any[] = []): Promise<D1Result> {
    try {
      const stmt = this.db.prepare(query);
      const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
      return await boundStmt.run();
    } catch (error) {
      console.error('Database query error (run):', error, { query, params });
      throw new DatabaseError('Query execution failed', error);
    }
  }

  // 批量执行操作
  async batch(operations: Array<{ query: string; params?: any[] }>): Promise<D1Result[]> {
    try {
      const statements = operations.map(op => {
        const stmt = this.db.prepare(op.query);
        return op.params && op.params.length > 0 ? stmt.bind(...op.params) : stmt;
      });
      
      return await this.db.batch(statements);
    } catch (error) {
      console.error('Database batch error:', error, { operations });
      throw new DatabaseError('Batch operation failed', error);
    }
  }

  // 执行原始SQL
  async exec(query: string): Promise<D1ExecResult> {
    try {
      return await this.db.exec(query);
    } catch (error) {
      console.error('Database exec error:', error, { query });
      throw new DatabaseError('SQL execution failed', error);
    }
  }
}

// 自定义数据库错误类
export class DatabaseError extends Error {
  public readonly originalError?: any;

  constructor(message: string, originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

// 分页查询结果接口
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// 分页查询构建器
export class PaginationBuilder {
  private baseQuery: string = '';
  private countQuery: string = '';
  private params: any[] = [];
  private page: number = 1;
  private limit: number = 10;

  constructor(private db: DatabaseQuery) {}

  setBaseQuery(query: string): this {
    this.baseQuery = query;
    return this;
  }

  setCountQuery(query: string): this {
    this.countQuery = query;
    return this;
  }

  setParams(params: any[]): this {
    this.params = params;
    return this;
  }

  setPage(page: number): this {
    this.page = Math.max(1, page);
    return this;
  }

  setLimit(limit: number): this {
    this.limit = Math.max(1, Math.min(100, limit)); // 限制最大100条
    return this;
  }

  async execute<T>(): Promise<PaginatedResult<T>> {
    // 获取总数
    const countResult = await this.db.first<{ count: number }>(
      this.countQuery, 
      this.params
    );
    const total = countResult?.count || 0;
    const total_pages = Math.ceil(total / this.limit);

    // 构建分页查询
    const offset = (this.page - 1) * this.limit;
    const paginatedQuery = `${this.baseQuery} LIMIT ? OFFSET ?`;
    const paginatedParams = [...this.params, this.limit, offset];

    // 获取数据
    const data = await this.db.all<T>(paginatedQuery, paginatedParams);

    return {
      data,
      pagination: {
        page: this.page,
        limit: this.limit,
        total,
        total_pages,
        has_next: this.page < total_pages,
        has_prev: this.page > 1
      }
    };
  }
}

// 查询构建器基础类
export class QueryBuilder {
  private selectFields: string[] = ['*'];
  private fromTable: string = '';
  private joinClauses: string[] = [];
  private whereConditions: string[] = [];
  private orderByFields: string[] = [];
  private groupByFields: string[] = [];
  private havingConditions: string[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private params: any[] = [];

  select(fields: string | string[]): this {
    this.selectFields = Array.isArray(fields) ? fields : [fields];
    return this;
  }

  from(table: string): this {
    this.fromTable = table;
    return this;
  }

  join(table: string, condition: string): this {
    this.joinClauses.push(`JOIN ${table} ON ${condition}`);
    return this;
  }

  leftJoin(table: string, condition: string): this {
    this.joinClauses.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }

  where(condition: string, ...params: any[]): this {
    this.whereConditions.push(condition);
    this.params.push(...params);
    return this;
  }

  whereIn(field: string, values: any[]): this {
    if (values.length > 0) {
      const placeholders = values.map(() => '?').join(', ');
      this.whereConditions.push(`${field} IN (${placeholders})`);
      this.params.push(...values);
    }
    return this;
  }

  whereLike(field: string, value: string): this {
    this.whereConditions.push(`${field} LIKE ?`);
    this.params.push(`%${value}%`);
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }

  groupBy(fields: string | string[]): this {
    const fieldsArray = Array.isArray(fields) ? fields : [fields];
    this.groupByFields.push(...fieldsArray);
    return this;
  }

  having(condition: string, ...params: any[]): this {
    this.havingConditions.push(condition);
    this.params.push(...params);
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  offset(count: number): this {
    this.offsetValue = count;
    return this;
  }

  build(): { query: string; params: any[] } {
    let query = `SELECT ${this.selectFields.join(', ')} FROM ${this.fromTable}`;

    if (this.joinClauses.length > 0) {
      query += ` ${this.joinClauses.join(' ')}`;
    }

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }

    if (this.groupByFields.length > 0) {
      query += ` GROUP BY ${this.groupByFields.join(', ')}`;
    }

    if (this.havingConditions.length > 0) {
      query += ` HAVING ${this.havingConditions.join(' AND ')}`;
    }

    if (this.orderByFields.length > 0) {
      query += ` ORDER BY ${this.orderByFields.join(', ')}`;
    }

    if (this.limitValue !== undefined) {
      query += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== undefined) {
      query += ` OFFSET ${this.offsetValue}`;
    }

    return { query, params: this.params };
  }

  async execute<T>(db: DatabaseQuery): Promise<T[]> {
    const { query, params } = this.build();
    return await db.all<T>(query, params);
  }

  async executeFirst<T>(db: DatabaseQuery): Promise<T | null> {
    const { query, params } = this.build();
    return await db.first<T>(query, params);
  }
}

// 导出工具函数
export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder();
}

export function createPaginationBuilder(db: DatabaseQuery): PaginationBuilder {
  return new PaginationBuilder(db);
}
