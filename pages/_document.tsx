import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return initialProps;
    }

    render() {
        return (
            <Html>
                <Head lang={"ja"} />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
