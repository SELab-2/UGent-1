import Document, {Head, Html, Main, NextScript} from 'next/document';
import {PRIMARY_COLOR} from "../lib/utils";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* PWA primary color */}
                    <meta name="theme-color" content={PRIMARY_COLOR}/>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                    {/* Add other head elements here as needed */}
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
