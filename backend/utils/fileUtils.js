import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.DATA_FILE || 'messages.json';

export async function readMessages() {
  try {
    const data = await fs.readFile(join(__dirname, '..', DATA_FILE), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

export async function writeMessages(messages) {
  try {
    await fs.writeFile(join(__dirname, '..', DATA_FILE), JSON.stringify(messages, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing messages:', error);
    throw error;
  }
}
