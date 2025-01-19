import { google } from 'googleapis';

export async function getGoogleAuthClient() {
    try {
        const credentials = JSON.parse(
            process.env.GOOGLE_CREDENTIALS
        );

        const client = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        await client.authorize();
        return client;
    } catch (error) {
        throw new Error(
            `Failed to initialize Google Auth client: ${error.message}`
        );
    }
}