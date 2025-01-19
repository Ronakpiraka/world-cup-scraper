import puppeteer from 'puppeteer';
import { google } from 'googleapis';
import config from '../config/config.js';

export class WorldCupDataExtractor {
    constructor(authClient) {
        this.authClient = authClient;
        this.sheets = google.sheets({ version: 'v4', auth: authClient });
    }

    async run() {
        const browser = await puppeteer.launch({ headless: "new" });
        try {
            const page = await browser.newPage();
            
            // Navigate to Wikipedia page
            await page.goto('https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals');
            
            // Extract data from the first 10 rows
            const worldCupData = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('table.wikitable tr')).slice(1, 11);
                return rows.map(row => {
                    const columns = row.querySelectorAll('td');
                    return {
                        year: columns[0]?.textContent.trim(),
                        winner: columns[1]?.textContent.trim(),
                        score: columns[4]?.textContent.trim(),
                        runnersUp: columns[3]?.textContent.trim()
                    };
                });
            });

            // Format data for Google Sheets
            const values = worldCupData.map(row => [
                row.year,
                row.winner,
                row.score,
                row.runnersUp
            ]);

            // Append to Google Sheets
            await this.appendToSheet(values);

        } finally {
            await browser.close();
        }
    }

    async appendToSheet(values) {
        const request = {
            spreadsheetId: config.SPREADSHEET_ID,
            range: 'A1:D1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    ['Year', 'Winner', 'Score', 'Runners-up'],
                    ...values
                ]
            }
        };

        await this.sheets.spreadsheets.values.append(request);
    }
}