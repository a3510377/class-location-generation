const fs = require('fs');
const path = require('path');

/** @typedef {import("./build").routes} routes */
/** @typedef {import("./build").RoutesManifestData} RoutesManifestData */
/** @typedef {import("./build").MainRoutesManifestData} MainRoutesManifestData */

const root = path.join(__dirname, '..');

/** get next build routes manifest
 * @type {MainRoutesManifestData}
 */
const routes = JSON.parse(
  fs.readFileSync(path.join(root, '.next/routes-manifest.json'), 'utf8')
);

/** @type {routes} */
const routesMap = {};

/**
 * @param {RoutesManifestData[]} data
 * @return {void}
 */
const summon = (data) => {
  for (const route of data) {
    /** @type {routes} */
    let t;

    for (const [i, p] of Object.entries(route.page.split('/').slice(1))) {
      if (i == 0) {
        routesMap[p] ||= {};
        t = routesMap[p];
        continue;
      }
      t[p] ||= {};
      t = t[p];
    }
    routesMap[route.page];
  }
};

summon(routes.dynamicRoutes);
summon(routes.staticRoutes);

fs.writeFileSync(
  path.join(root, '../api/dist/routes.json'), // write to go server web directory
  JSON.stringify(routesMap, null, 2)
);
