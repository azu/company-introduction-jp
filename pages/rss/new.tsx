import { GetServerSidePropsContext } from "next";
import company from "../company.json";
import { Feed } from "feed";
import { getSlideImage } from "../index";

const escapeXML = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
        }
    });
};
const generateNewCompanyFeed = () => {
    const latest20 = company.slice().reverse().slice(0, 20);
    const feed = new Feed({
        title: "New - 日本の会社紹介スライドのまとめ",
        description: "日本の会社紹介スライドのまとめに新しく追加された会社のスライドです",
        id: "https://company-introduction-jp.vercel.app/rss/new",
        link: "https://company-introduction-jp.vercel.app/",
        image: "https://company-introduction-jp.vercel.app/ogp.jpeg",
        copyright: "https://company-introduction-jp.vercel.app/",
        updated: new Date(),
        generator: "https://company-introduction-jp.vercel.app/"
    });
    for (const company of latest20) {
        const list = company.slide_urls
            .map((url, i) => {
                return `<li><a href="${url}">${escapeXML(company.company_name)}</a></li>`;
            })
            .join("");
        const companyLink = `<a href="${company.company_url}">${escapeXML(company.company_name)}</a>の会社紹介スライド`;
        const slideImage = getSlideImage({
            id: company.id,
            type: company.type,
            currentPage: 0
        });
        const slideImageTag = slideImage.startsWith("https://")
            ? `<div><img src="${slideImage}" alt="スライド1ページ目" width="${company.image_width}" height="${company.image_height}" /></div>`
            : "";
        feed.addItem({
            id: company.id,
            title: escapeXML(company.company_name),
            link: company.slide_urls[0],
            description: `${escapeXML(company.company_name)}の会社紹介スライド`,
            content: `${slideImageTag}<ul>${list}</ul><br />${companyLink}`,
            date: new Date()
        });
    }
    return feed.rss2();
};

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
    const xml = generateNewCompanyFeed();
    res.statusCode = 200;
    // 24時間キャッシュする
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.setHeader("Content-Type", "text/xml");
    res.end(xml);
    return {
        props: {}
    };
};

const Page = () => null;
export default Page;
