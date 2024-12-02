import path from 'path';
import dotenv from 'dotenv';

const appEnvFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: path.resolve(__dirname, `../${appEnvFile}`) });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
