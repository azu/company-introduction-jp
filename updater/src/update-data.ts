import pAll from "p-all";
import * as fs from "fs/promises";
import { Company, fetchSpreadsheet } from "./fetch-spreadsheet.js";
import { fetchSpeakerDeck, SlideItem } from "./merge-speackerdeck.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../../pages/company.json");
type Result = SlideItem & Company;
const json = await fetchSpreadsheet();
const actions = json.map((item) => {
    return async () => {
        const speakerDeck = await fetchSpeakerDeck(item.slide_urls[0]);
        return {
            ...item,
            ...speakerDeck
        };
    };
});
const results = (await pAll(actions, {
    concurrency: 4
})) as Result[];

await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 4), "utf8");
