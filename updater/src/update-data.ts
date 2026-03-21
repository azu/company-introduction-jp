import pAll from "p-all";
import * as fs from "fs/promises";
import { Company, fetchCSV } from "./fetch-csv.js";
import { fetchSpeakerDeck, SlideItem } from "./merge-speakerdeck.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../../pages/company.json");
type Result = SlideItem & Company;

type CrawlError = {
    company: Company;
    error: Error;
};

const crawlErrors: CrawlError[] = [];
const errorLogs: string[] = [];
const log = (message: string) => {
    console.log(message);
    errorLogs.push(message);
};
try {
    const json = await fetchCSV();
    const actions = json
        .filter((item) => {
            if (!item.company_url.startsWith("http")) {
                return false;
            }
            if (!item.slide_urls[0].startsWith("https")) {
                return false;
            }
            return true;
        })
        .map((item) => {
            return async (): Promise<Result | null> => {
                const slideUrl = item.slide_urls[0];
                if (slideUrl.startsWith("https://www.slideshare.net/")) {
                    return {
                        type: "slideshare",
                        ...item
                    } as Result;
                }
                if (slideUrl.startsWith("https://speakerdeck.com/")) {
                    try {
                        const speakerDeck = await fetchSpeakerDeck(slideUrl);
                        return {
                            ...item,
                            ...speakerDeck
                        } as Result;
                    } catch (error) {
                        const err = error instanceof Error ? error : new Error(String(error));
                        log(`[update-data] failed to load slide details: ${slideUrl} - ${err.message}`);
                        crawlErrors.push({ company: item, error: err });
                        return null;
                    }
                }
                return {
                    type: "other",
                    ...item
                } as unknown as Result;
            };
        });
    const rawResults = await pAll(actions, {
        concurrency: 4
    });
    const results = rawResults.filter((result): result is Result => result !== null);

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 4), "utf8");
    console.log(`[update-data] successfully saved ${results.length} companies`);

    // すべての処理が完了した後、エラーがあった場合はまとめて報告
    if (crawlErrors.length > 0) {
        console.error(`\n[update-data] ${crawlErrors.length} companies failed to crawl:\n`);

        const errorSummary = crawlErrors
            .map(
                (e) =>
                    `- Row ${e.company.rowIndex}: ${e.company.company_name} (${e.company.slide_urls[0]}) - ${e.error.message}`
            )
            .join("\n");
        console.error(errorSummary);

        // GITHUB_SUMMARY.md を出力
        if (process.env.GITHUB_ACTION) {
            console.debug("[update-data] GITHUB_ACTION=true, output GITHUB_SUMMARY.md");
            const markdownTable = [
                "| Row | 会社名 | 会社URL | スライドURL | エラー |",
                "|-----|--------|---------|-------------|--------|",
                ...crawlErrors.map(
                    (e) =>
                        `| ${e.company.rowIndex} | ${e.company.company_name} | ${e.company.company_url} | ${e.company.slide_urls[0]} | ${e.error.message} |`
                )
            ].join("\n");

            await fs.writeFile(
                path.join(__dirname, "../../GITHUB_SUMMARY.md"),
                `## クロールエラー一覧

${crawlErrors.length} 件の会社でエラーが発生しました。

${markdownTable}

## 修正方法

以下の手順で修正してください:

1. 各会社の「会社URL」にブラウザでアクセスする
2. ページ内からSpeakerDeckのスライドURLを探す
3. 新しいスライドURLが見つかった場合: \`data/companies.csv\` の該当行の「紹介URL」を更新する
4. スライドURLが見つからない場合: \`data/companies.csv\` から該当行を削除する

## 詳細ログ

${errorLogs.join("\n\n")}
`,
                "utf8"
            );
        }
        process.exit(1);
    }
} catch (error) {
    console.error("[update-data] failed to fetch slide details", error);
    // if GITHUB_ACTION=true, then output GITHUB_SUMMARY.md
    if (process.env.GITHUB_ACTION) {
        console.debug("[update-data] GITHUB_ACTION=true, output GITHUB_SUMMARY.md");
        await fs.writeFile(
            path.join(__dirname, "../../GITHUB_SUMMARY.md"),
            `## Error

${error}

## Logs

${errorLogs.join("\n\n")}

`,
            "utf8"
        );
    }
    process.exit(1);
}
