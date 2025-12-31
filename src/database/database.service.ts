import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService
  implements OnModuleInit, OnModuleDestroy
{
  private client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('DB connected');
  }

  async onModuleDestroy() {
    await this.client.end();
  }

  getClient(): Client {
    return this.client;
  }
}
