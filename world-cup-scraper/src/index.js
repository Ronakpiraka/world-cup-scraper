import dotenv from 'dotenv';
import { WorldCupDataExtractor } from './extractor.js';
import { validateConfig } from './utils/validation.js';
import { getGoogleAuthClient } from './utils/auth.js';

dotenv.config();

async function main() {
    try {
        // Validate environment variables and configuration
        validateConfig();
        
        // Initialize Google Auth client
        const authClient = await getGoogleAuthClient();
        
        // Initialize and run the extractor
        const extractor = new WorldCupDataExtractor(authClient);
        await extractor.run();
        
        console.log('Data extraction and upload completed successfully!');
    } catch (error) {
        console.error('Error in main process:', error.message);
        process.exit(1);
    }
}

main();