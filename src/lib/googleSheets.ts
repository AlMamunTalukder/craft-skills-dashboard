import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"],
);

const sheets = google.sheets({ version: "v4", auth });

// ✅ Helper: Sanitize & limit tab name
const sanitizeTabName = (title: string) =>
  title.replace(/[:\\/?*\[\]]/g, "").substring(0, 100);

/**
 * Appends data to a Google Sheets tab. Automatically creates the tab and adds headers if it doesn't exist.
 * @param tabTitle - The desired name for the tab (will be sanitized)
 * @param headers - The headers for the columns (array of strings)
 * @param values - An array of values (must match header count)
 */
export const appendDataToGoogleSheet = async (
  tabTitle: string,
  headers: string[],
  values: (string | number | null | undefined)[],
): Promise<void> => {
  const sanitizedTitle = sanitizeTabName(tabTitle);

  try {
    // Get all current sheet/tab titles
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const existingTabs = meta.data.sheets?.map((s) => s.properties?.title);

    // If tab doesn't exist, create it and add headers
    if (!existingTabs?.includes(sanitizedTitle)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sanitizedTitle,
                },
              },
            },
          ],
        },
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sanitizedTitle}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      });
    }

    // Append row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sanitizedTitle}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });
  } catch (error) {
    console.error("Google Sheets Error:", error);
    throw new Error("Failed to sync with Google Sheets.");
  }
};
