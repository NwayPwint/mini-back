"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/lms_db?schema=public";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.ENV === "development"
        ? ["query", "info", "warn", "error"]
        : undefined,
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map