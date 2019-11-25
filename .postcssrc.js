// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px-to-viewport": {
        "unitToConvert": 'px',
        "viewportWidth": 750,
        "viewportHeight": 1334,
        "unitPrecision": 3,
        "viewportUnit": "vw",
        "fontViewportUnit": 'vw',
        "selectorBlackList": [
            ".ignore",
            ".hairlines"
        ],
        "minPixelValue": 1,
        "mediaQuery": false,
        "landscapeUnit": 'vw',
        "landscapeWidth": 1134 
    },
  }
}
