/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ermöglicht den statischen HTML-Export für GitHub Pages
  images: {
    unoptimized: true, // Notwendig, da GitHub Pages keine dynamische Bildoptimierung unterstützt
  },
  webpack(config) {
    // Vorhandene Regel für SVG-Imports finden
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Bestehende Regel für SVG-Imports mit ?url beibehalten
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Alle anderen *.svg-Dateien in React-Komponenten umwandeln
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // Ausschluss von *.svg?url
        use: {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      }
    );

    // Den Standard-File-Loader anweisen, *.svg zu ignorieren
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;