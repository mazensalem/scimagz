import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          defer
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        ></script>
        <link rel="icon" href="/logo.jpg" />
        <title>SMZ</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
