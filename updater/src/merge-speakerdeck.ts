import { JSDOM } from "jsdom";

export type SlideItem = {
    type: "slideshare" | "speakerdeck";
    id: string;
    image_ratio: number;
    image_width: number;
    image_height: number;
};
export const fetchSpeakerDeck = async (slideUrl: string): Promise<SlideItem | undefined> => {
    const dom = await JSDOM.fromURL(slideUrl);
    const element = dom.window.document.querySelector(".speakerdeck-embed") as HTMLDivElement;
    if (!element) {
        return;
    }
    const name = element.dataset.name;
    const id = element.dataset.id;
    const ratio = Number(element.dataset.ratio);
    if (!id || !ratio || !name) {
        return;
    }
    const width = 560;
    const height = Math.trunc(width / ratio);
    if (!Number.isInteger(width) || !Number.isInteger(height)) {
        return;
    }
    return {
        type: "speakerdeck",
        id,
        image_ratio: ratio,
        image_width: width,
        image_height: height
    };
};
