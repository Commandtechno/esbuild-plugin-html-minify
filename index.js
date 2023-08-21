const { readFile } = require("fs/promises");

const posthtml = require("posthtml");
/** @type {import('htmlnano').default} */
const htmlnano = require("htmlnano");

/**
 * @param {import('posthtml').Plugin[]} plugins
 * @param {import('htmlnano').HtmlnanoOptions} options
 * @return {import('esbuild').Plugin}
 */
module.exports = (plugins, options) => ({
  name: "esbuild-plugin-html-minify",
  setup(ctx) {
    const nano = htmlnano({
      minifyCss: false,
      minifyJs: false,
      minifySvg: false,
      collapseWhitespace: "all",
      ...options
    });

    const html = posthtml(plugins).use(nano);

    ctx.onLoad({ filter: /\.html$/ }, async args => {
      const result = await html.process(await readFile(args.path, "utf8"));

      return {
        contents: result.html,
        loader: "copy"
      };
    });
  }
});
