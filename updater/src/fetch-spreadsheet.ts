export type Company = {
    rowIndex: number;
    company_name: string;
    company_url: string;
    slide_urls: string[];
};
type RawCompany = {
    rowIndex: number;
    会社名: string;
    会社URL: string;
    紹介URL: string;
};
const assert = (condition: boolean, message: string, debug: unknown) => {
    if (!condition) {
        console.error("Assertion failed", message, debug);
        throw new Error(message);
    }
};
const formatCompany = (rawCompany: RawCompany): Company => {
    assert(!!rawCompany.会社名, "会社名が空です", rawCompany);
    assert(!!rawCompany.会社URL, "会社URLが空です", rawCompany);
    assert(!!rawCompany.紹介URL, "紹介URLが空です", rawCompany);
    return {
        rowIndex: rawCompany.rowIndex,
        company_name: rawCompany.会社名,
        company_url: rawCompany.会社URL,
        slide_urls: rawCompany.紹介URL.split("\n").filter((url) => url.startsWith("http"))
    };
};
export const fetchSpreadsheet = async (): Promise<Company[]> => {
    const API_ENDPOINT = `https://sheets.googleapis.com/v4/spreadsheets/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc/values/会社一覧`;
    const GOOGLE_SPREADSHEET_API_KEY = process.env.GOOGLE_SPREADSHEET_API_KEY;
    const url = API_ENDPOINT + `?key=${GOOGLE_SPREADSHEET_API_KEY}`;
    console.info("[fetchSpreadsheet] fetch", url);
    const results = await fetch(url).catch(() => {
        // URL includes credential, so we should not log it.
        return Promise.reject(new Error("fetch error"));
    });
    if (!results.ok) {
        return Promise.reject(new Error(`fetch error result ok false: ${results.status}`));
    }
    const resultsJson = (await results.json()) as {
        values: {
            0: string;
            1: string;
            2: string;
        }[];
    };
    console.log("[fetchSpreadsheet] fetched", resultsJson);
    const resultValuesWithoutHeader = resultsJson.values.slice(1);
    const values = resultValuesWithoutHeader.filter((row) => {
        return Boolean(row[0]) && Boolean(row[1]) && Boolean(row[2]);
    });
    console.info("[fetchSpreadsheet] fetched total rows", {
        total: values.length,
        rawTotal: resultValuesWithoutHeader.length
    });
    return values.map((row, index) => {
        return formatCompany({
            rowIndex: index + 2,
            会社名: row[0],
            会社URL: row[1],
            紹介URL: row[2]
        });
    });
};
