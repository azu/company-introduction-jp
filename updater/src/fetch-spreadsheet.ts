import fetch from "node-fetch";

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

const formatCompany = (rawCompany: RawCompany): Company => {
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
        console.info("Fetched result", result)
        results.push(...result.results.map((item) => formatCompany(item)));
        if (!result.hasNextPage) {
            break;
        }
    }
    console.info("[fetchSpreadsheet] fetched total rows", results.length);
    return results;
};
