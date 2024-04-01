export type SlideItem = {
    type: "slideshare" | "speakerdeck";
    id: string;
    image_ratio: number;
    image_width: number;
    image_height: number;
};
/**
 * {"type":"rich","version":1.0,"provider_name":"Speaker Deck","provider_url":"https://speakerdeck.com/","title":"SmartHR会社紹介資料  / We are hiring","author_name":"Shoji Miyata","author_url":"https://speakerdeck.com/miyasho88","html":"\u003ciframe id=\"talk_frame_458154\" class=\"speakerdeck-iframe\" src=\"//speakerdeck.com/player/e20c6467299e4c1ca07ad14064a89d74\" width=\"710\" height=\"399\" style=\"aspect-ratio:710/399; border:0; padding:0; margin:0; background:transparent;\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"allowfullscreen\"\u003e\u003c/iframe\u003e\n","width":710,"height":399,"ratio":1.77777777777778}
 */
type Oembed = {
    type: "rich";
    version: number;
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    html: string;
    width: number;
    height: number;
    ratio: number;
};
export const fetchSpeakerDeck = async (slideUrl: string): Promise<SlideItem | undefined> => {
    console.log("[fetchSpeakerDeck] fetch", slideUrl);
    // fetch oembed API
    // https://help.speakerdeck.com/help/how-do-i-use-oembed-to-display-a-deck-on-my-site
    const oembed: Oembed = await fetch(`https://speakerdeck.com/oembed.json?url=${encodeURIComponent(slideUrl)}`).then(
        (res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`[fetchSpeakerDeck] fetch oEmbed ${slideUrl} failed: ${res.status} ${res.statusText}`);
        }
    );
    if (!oembed) {
        console.log("[fetchSpeakerDeck] oembed is not found", slideUrl);
        return;
    }
    // "//speakerdeck.com/player/<id>"
    const matchId = oembed.html.match(/.*\/\/speakerdeck\.com\/player\/([^"]+).*/);
    const id = matchId ? matchId[1] : undefined;
    const ratio = oembed.ratio;
    if (!id || !ratio) {
        console.log("[fetchSpeakerDeck] missing required parameters", { id, ratio });
        return;
    }
    const width = 560;
    const height = Math.trunc(width / ratio);
    if (!Number.isInteger(width) || !Number.isInteger(height)) {
        console.log("[fetchSpeakerDeck] width or height is invalid", { width, height });
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
