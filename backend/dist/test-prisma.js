"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
async function test() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    try {
        console.log('Testing new PrismaClient()...');
        const prisma = new client_1.PrismaClient();
        await prisma.$connect();
        console.log('Successfully connected with new PrismaClient()!');
        await prisma.$disconnect();
    }
    catch (error) {
        console.error('Connection failed with new PrismaClient():', error.message);
    }
}
test();
//# sourceMappingURL=test-prisma.js.map