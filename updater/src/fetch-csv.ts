import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

export type Company = {
    rowIndex: number;
    company_name: string;
    company_url: string;
    slide_urls: string[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "../../data/companies.csv");

/**
 * RFC 4180準拠の簡易CSVパーサー
 * ダブルクォート内の改行・カンマ・エスケープに対応
 */
const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];
        if (inQuotes) {
            if (char === '"' && next === '"') {
                field += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ",") {
                row.push(field);
                field = "";
            } else if (char === "\n") {
                row.push(field);
                field = "";
                if (row.length > 0) {
                    rows.push(row);
                }
                row = [];
            } else if (char === "\r") {
                // skip
            } else {
                field += char;
            }
        }
    }
    if (field || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows;
};

const assert = (condition: boolean, message: string, debug: unknown) => {
    if (!condition) {
        console.error("Assertion failed", message, debug);
        throw new Error(message);
    }
};

export const fetchCSV = async (): Promise<Company[]> => {
    const text = await fs.readFile(CSV_PATH, "utf8");
    const rows = parseCSV(text);
    const [_header, ...dataRows] = rows;
    console.info("[fetchCSV] fetched total rows", { total: dataRows.length });
    return dataRows
        .map((row, index) => {
            const companyName = row[0];
            const companyUrl = row[1];
            const slideUrlsRaw = row[2] ?? "";
            assert(!!companyName, "会社名が空です", row);
            assert(!!companyUrl, "会社URLが空です", row);
            assert(!!slideUrlsRaw, "紹介URLが空です", row);
            return {
                rowIndex: index + 2,
                company_name: companyName,
                company_url: companyUrl,
                slide_urls: slideUrlsRaw.split("\n").filter((url) => url.startsWith("http"))
            };
        })
        .filter((item) => item.slide_urls.length > 0);
};
