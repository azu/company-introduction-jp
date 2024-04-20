import pAll from "p-all";
import * as fs from "fs/promises";
import { Company, fetchSpreadsheet } from "./fetch-spreadsheet.js";
import { fetchSpeakerDeck, SlideItem } from "./merge-speakerdeck.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../../pages/company.json");
type Result = SlideItem & Company;
const json = await fetchSpreadsheet();
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
        return async () => {
            const slideUrl = item.slide_urls[0];
            if (slideUrl.startsWith("https://www.slideshare.net/")) {
                return {
                    type: "slideshare",
                    ...item
                };
            }
            if (slideUrl.startsWith("https://speakerdeck.com/")) {
                const speakerDeck = await fetchSpeakerDeck(slideUrl).catch((error) => {
                    console.error("[update-data] failed to load slide details", slideUrl);
                    return Promise.reject(error);
                });
                return {
                    ...item,
                    ...speakerDeck
                };
            }
            return {
                type: "other",
                ...item
            };
        };
    });
try {
    const results = (await pAll(actions, {
        concurrency: 4
    })) as Result[];

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 4), "utf8");
} catch (error) {
    console.error("[update-data] failed to fetch slide details", error);
    // if GITHUB_ACTION=true, then output GITHUB_SUMMARY.md
    if (process.env.GITHUB_ACTION) {
        await fs.writeFile(
            path.join(__dirname, "../../GITHUB_SUMMARY.md"),
            `## Error

${error}

`,
            "utf8"
        );
    }
    process.exit(1);
}
