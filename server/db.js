import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the JSON file that will store our data
const dbFile = join(__dirname, 'db.json');

// Create LowDB instance with JSON file adapter and default data
const adapter = new JSONFile(dbFile);
export const db = new Low(adapter, { todos: [] });

// Initialise the database with default structure if empty
await db.read();
db.data ??= { todos: [] };
await db.write();

export default db;
