import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {Client} from 'pg';
@Injectable()
export class DatabaseService implements OnModuleInit,OnModuleDestroy{
    private client:Client;
    constructor(){
        this.client=new Client({
            host:process.env.DB_HOST,
            port:Number(process.env.DB_PORT),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })
    }
async onModuleInit() {
    await this.client.connect();
    console.log('Db connected');
}
async onModuleDestroy() {
    await this.client;
}
getClient():Client{
    return this.client;
}



}