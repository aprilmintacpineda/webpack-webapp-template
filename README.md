# webpack-webapp-template

A template that I use when creating a web app project.

# Getting started

- Clone repo.
- Rename `example.env.back` to `.env.back`.
- Rename `example.env.front` to `.env.front`.
- `npm i`
- `npm run start` - to start frontend development.
- `npm run compile` - to start backend development.
- `npm run serve` - to serve on your localhost.

Then you can access your project at http://localhost:8080.

# Frontend

## Dot Env

The dot env configuration file for the frontend is called `.env.front`.

### Environment variables

Environment variables defined in `.env` file would be available as the `env` global object. You should prefix them with `APP_ENV_`, e.g., `APP_ENV_TEST_VAR="some value"`, which would be available via `env.testVar`. All env variables will be converted to `camelCase`, additionally, the prefix `APP_ENV_` will not be included in the key name.

`publicPath`, which came from `PUBLIC_PATH` is available by default.

All env variables are being parse to their native data type. Example:

```
APP_ENV_BOOL="true"
APP_ENV_TEST_OBJ='{"test1":"value1","test2":"value2","test3":true,"test4":["hello",123,123.56]}'
APP_ENV_ARR='["hello",123,123.56]'
```

- `APP_ENV_BOOL` will be available as `env.bool` which would be a `Boolean`.
- `APP_ENV_OBJ` will be available as `env.testObj` which would be an `Object`.
- `APP_ENV_ARR` will be available as `env.arr` which would be an `Array`.

### WEBSITE_NAME

Is being used for the title in your `index.html`.

## Build

The builds  will be placed at `build/static` directory.

### Inlined with index.html

By default, the `main.css` is inline with `index.html`.

### Scripts

The vendors script, babel's runtime script, and the main script are split and are loaded via async. This improves loading performance on browsers.

### PWA

The template is PWA enabled by default. Service worker is powered by [workbox](https://github.com/GoogleChrome/workbox).

Dummy icons are available in `front/public/icons` (16x16, 24x24, 32x32, 64x64, 128x128, 256x256, 512x512).

Manifest file is also available at `front/public/manifest.json` which the `index.html` already links to.

### Code splitting

You can use [webpack's dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) _BUT_ it does not work out of the box, you need a bridge like [inferno-async-component](https://github.com/aprilmintacpineda/inferno-async-component) to handle the component.

### Styling

Only `scss` is used for styling because as of the this writing, [`prettier` does not support `sass`](https://github.com/prettier/prettier/issues/4948).

### Public files

Use the `public` folder on the root directory to store your public files. You can create folders there like `fonts/`, `css/`, `images/` if you have to.

Webpack is configured to save _all css files_ you used in your js files in the `css/` folder of your build, so to avoid having two folders with only css files in them, you can also create `css/` folder in the `public` directory. Those files would be copied in the `css/` directory of the build together with the other css files you may be using, like in [font-awesome](https://www.npmjs.com/package/font-awesome). For the fonts, save them in the `front/public/fonts/` directory. For `images` save them in the `front/public/images` directory. For js save them in the `front/public/js` directory. For svg files, save them in the `front/public/svgs` directory.

# Backend

## Dot Env

The dot env configuration file for the backend is called `.env.back`. The dot env is only loaded via [dotenv](https://github.com/motdotla/dotenv#readme) and is not being parsed.

The main file starts at `back/server.js`.

## Build

The builds are all minified and transpiled by babel and will be placed on the root of the `build` directory.

# Code formatting

For code formatting the template is using [eslint](https://github.com/eslint/eslint) and [prettier](https://github.com/prettier/prettier).

#### NPM scripts

- To run eslint `npm run eslint`.
- To run prettier `npm run prettier`.
- To run both in the proper order `npm run lint`.
