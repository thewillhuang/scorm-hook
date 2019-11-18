const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const MomentTimezoneDataPlugin = require("moment-timezone-data-webpack-plugin");
// const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const R = require("ramda");
// const WorkboxPlugin = require("workbox-webpack-plugin");

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const pkg = require("./package.json");
const path = require("path");

const currentYear = new Date().getFullYear();

const sizes = Array.apply(null, Array(6))
  .map(function(_, i) {
    return i * 700;
  })
  .slice(1);

module.exports = (env, argv) => {
  // console.log(JSON.stringify(env));
  // console.log(JSON.stringify(argv));
  const devMode = argv.mode !== "production";
  const scopedClassNames = devMode
    ? "[path]-[name]-[local]-[contenthash:3]"
    : "[contenthash:8]";

  const babel = {
    loader: "babel-loader",
    options: {
      cacheDirectory: "./babelCache",
      presets: [
        // "@babel/preset-flow",
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            useBuiltIns: "usage",
            corejs: 3,
            modules: false,
          },
        ],
        ["@babel/preset-react", { development: devMode }],
      ],
      plugins: [
        // "@loadable/babel-plugin",
        // "lodash",
        // "ramda",
        // "date-fns",
        // "recharts",
        // // "emotion",
        // ["@babel/proposal-pipeline-operator", { proposal: "smart" }],
        // [
        //   "import",
        //   {
        //     libraryName: "react-use",
        //     libraryDirectory: "lib",
        //     camel2DashComponentName: false,
        //   },
        // ],
        ["@babel/plugin-transform-runtime", { corejs: 3 }],
        // ["@babel/plugin-proposal-class-properties", { loose: true }],
        // "@babel/plugin-syntax-dynamic-import",
        // [
        //   "react-css-modules",
        //   {
        //     filetypes: {
        //       ".scss": { syntax: "postcss-scss" },
        //       ".sass": { syntax: "postcss-sass" },
        //     },
        //     handleMissingStyleName: "throw",
        //     webpackHotModuleReloading: devMode,
        //     autoResolveMultipleImports: true,
        //     generateScopedName: scopedClassNames,
        //   },
        // ],
      ],
    },
  };

  const htmlWebpackOptions = {
    template: "./src/template.html",
    inlineSource: "runtime",
    // favicon: path.join(__dirname, "./src/_shared/images/favicon.png"),
    chunksSortMode: "none",
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  };

  const config = {
    entry: {
      index: [
        // "core-js/stable",
        // "regenerator-runtime/runtime",
        "./src/index.js",
      ],
    },
    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "_",
      },
    },
    module: {
      rules: [
        // {
        //   test: /\.(graphql|gql)$/,
        //   exclude: /node_modules/,
        //   loader: "graphql-tag/loader",
        // },
        {
          test: /\.csv$/,
          loader: "csv-loader",
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
          },
        },
        {
          test: /\.(md)$/i,
          use: "raw-loader",
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
          loaders: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: "[contenthash:8].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(|pdf|txt|doc|xlsx)(\?v=\d+\.\d+\.\d+)?$/,
          loaders: [
            {
              loader: "file-loader",
              options: {
                limit: 8192,
                name: "[contenthash:8].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png)$/i,
          use: [
            {
              loader: "responsive-loader",
              options: {
                name: "[contenthash:8].[ext]",
                adapter: require("responsive-loader/sharp"),
                sizes: devMode ? [2000] : sizes,
                disable: devMode,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loaders: [babel],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            {
              loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
              options: devMode ? {} : { sourceMap: true },
            },
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true },
            },
            { loader: "postcss-loader", options: { sourceMap: true } },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
              options: devMode ? {} : { sourceMap: true },
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: {
                  localIdentName: scopedClassNames,
                },
              },
            },
            { loader: "postcss-loader", options: { sourceMap: true } },
          ],
        },
      ],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      // new HtmlWebpackPlugin(htmlWebpackOptions),
      // new HtmlWebpackPlugin(
      //   Object.assign({ filename: "pages/404.html" }, htmlWebpackOptions)
      // ),
      // new webpack.DefinePlugin({
      //   BASEURL: JSON.stringify(R.pathOr(BASEURL, ["BASEURL"], env)),
      //   AUTHBASEURL: JSON.stringify(
      //     R.pathOr(AUTHBASEURL, ["AUTHBASEURL"], env)
      //   ),
      //   ISPREVIEW: JSON.stringify(R.pathOr(ISPREVIEW, ["ISPREVIEW"], env)),
      //   CONTENTURL: JSON.stringify(R.pathOr(CONTENTURL, ["CONTENTURL"], env)),
      //   DEVMODE: JSON.stringify(devMode),
      // }),
      // new MomentTimezoneDataPlugin({
      //   startYear: currentYear - 2,
      //   endYear: currentYear + 2,
      // }),
      // new MomentLocalesPlugin(),
      // new HtmlWebpackInlineSourcePlugin(),
    ],
    resolve: {
      // alias: {
      //   "react-dom$": "react-dom/profiling",
      //   "scheduler/tracing": "scheduler/tracing-profiling",
      // },
      alias: {
        "react-hook-form": "react-hook-form/dist/react-hook-form.ie11.js",
      },
      extensions: [".js", ".jsx", ".json", ".scss"],
    },
  };

  if (devMode) {
    config.devServer = {
      // compress: true,
      // serveIndex: true,
      headers: {
        "Cache-Control": "no-cache",
      },
      useLocalIp: true,
      historyApiFallback: true,
      overlay: true,
    };
    config.output = {
      publicPath: "/",
      jsonpFunction: `webpackJsonp_${pkg.name}`,
    };
    config.plugins = config.plugins.concat([new webpack.NamedModulesPlugin()]);
  }

  if (!devMode) {
    config.output = {
      publicPath: "/",
      library: "@thewillhuang/scorm-hook",
      libraryTarget: "umd",
      // filename: "[contenthash:8].js",
      // chunkFilename: "[contenthash:8].js",
      // jsonpFunction: `webpackJsonp_${pkg.name}`,
    };
    config.optimization = {
      // runtimeChunk: "single",
      minimizer: [
        new TerserPlugin({
          // parallel: true,
          cache: "./terserCache",
          sourceMap: true,
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              inline: 2,
              comparisons: false,
              drop_console: R.pathOr(true, ["DROP_CONSOLE"], env),
              // drop_console: false,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
    };
    config.plugins = config.plugins.concat([
      new MiniCssExtractPlugin({
        filename: "[contenthash:8].css",
        chunkFilename: "[contenthash:8].css",
      }),
      // new ImageminWebpackPlugin({
      //   test: /\.(jpe?g|png|svg)$/i,
      //   bail: false, // Ignore errors on corrupted images
      //   cache: "./imageCache",
      //   imageminOptions: {
      //     plugins: [
      //       imageminSvgo({
      //         plugins: [
      //           { removeViewBox: true },
      //           { removeTitle: true },
      //           { removeComments: true },
      //           { removeMetadata: true },
      //           { removeDesc: true },
      //           { removeEmptyAttrs: true },
      //           { cleanupIDs: true },
      //           { addClassesToSVGElement: { className: "svg-inline" } },
      //           { removeAttrs: { attrs: "svg:id" } },
      //         ],
      //       }),
      //       imageminPngquant({ quality: [0.6, 0.8], speed: 4, strip: true }),
      //       imageminMozjpeg({ quality: 65, progressive: true }),
      //     ],
      //   },
      // }),
      new webpack.HashedModuleIdsPlugin(),
      // new WorkboxPlugin.GenerateSW({
      //   // these options encourage the ServiceWorkers to get in there fast
      //   // and not allow any straggling "old" SWs to hang around
      //   clientsClaim: true,
      //   importWorkboxFrom: "local",
      //   cacheId: "myapplied",
      //   cleanupOutdatedCaches: true,
      //   skipWaiting: true,
      //   dontCacheBustURLsMatching: /\.\w{8}\./,
      //   globIgnores: ["**/*.service-worker.js"],
      //   navigateFallback: "/index.html",
      //   runtimeCaching: [
      //     {
      //       urlPattern: /\//,
      //       handler: "StaleWhileRevalidate",
      //       options: {
      //         cacheableResponse: {
      //           statuses: [200],
      //         },
      //       },
      //     },
      //     {
      //       urlPattern: /api./,
      //       handler: "StaleWhileRevalidate",
      //       options: {
      //         cacheableResponse: {
      //           statuses: [200],
      //         },
      //       },
      //     },
      //     // {
      //     //   urlPattern: /api/,
      //     //   // handler: "staleWhileRevalidate",
      //     //   handler: "NetworkFirst",
      //     // },
      //     // {
      //     //   urlPattern: /dsp-be.herokuapp.com/,
      //     //   handler: "NetworkFirst",
      //     // },
      //     // {
      //     //   urlPattern: /webassets/,
      //     //   handler: "StaleWhileRevalidate",
      //     // },
      //     // {
      //     //   urlPattern: /.com/,
      //     //   handler: "StaleWhileRevalidate",
      //     // },
      //   ],
      // }),
    ]);
  }

  return config;
};
