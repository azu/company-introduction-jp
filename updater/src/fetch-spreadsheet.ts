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
    const API_ENDPOINT = `https://api.sheetson.com/v2/sheets/会社一覧`;
    const SPREADSHEET_ID = "1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc";
    const API_KEY = process.env.SHEETON_API_KEY;
    const results: Company[] = [];
    let currentCursor = 0;
    while (true) {
        const url = API_ENDPOINT + `?skip=${currentCursor}&limit=100`;
        console.info("[fetchSpreadsheet] fetch", url);
        const result = (await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "X-Spreadsheet-Id": SPREADSHEET_ID
            }
        }).then((res) => res.json())) as { results: RawCompany[]; hasNextPage: boolean };
        currentCursor += 100 + 1;
        console.info("Fetched result", result);
        results.push(...result.results.filter((item) => item !== undefined).map((item) => formatCompany(item)));
        if (!result.hasNextPage) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
    }
    console.info("[fetchSpreadsheet] fetched total rows", results.length);
    return results;
};
