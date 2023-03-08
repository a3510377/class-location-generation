export type routes = { [key: string]: routes };

export interface MainRoutesManifestData {
  dynamicRoutes: RoutesManifestData;
  staticRoutes: RoutesManifestData;
}

export interface RoutesManifestData {
  page: string; // page url
  regex: string; // page url regex
}
