export function validateConfig() {
    const requiredEnvVars = [
        'GOOGLE_CREDENTIALS',
        'SPREADSHEET_ID'
    ];

    const missing = requiredEnvVars.filter(
        envVar => !process.env[envVar]
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
}