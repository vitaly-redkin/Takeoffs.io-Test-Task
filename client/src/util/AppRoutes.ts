/**
 * Module with application routs related stuff.
 */

/**
 * Enum with application routes.
 */
export enum AppRoutes {
  TakeoffNew = '/',
  TakeoffStatus = '/takeoff/:takeoffId/',
  TakeoffFloorPlans = '/takeoff/:takeoffId/floor_plans',
  TakeoffTiledAreas = '/takeoff/:takeoffId/tiledAreas',
}
  
/**
 * Composes path for one of the takeoff routes.
 * 
 * @param takeoffId ID of the takeoff to compose path for
 */
export function composeTakeOffPath(path: AppRoutes, takeoffId: string): string {
  return path.replace('/:takeoffId/', `/${takeoffId}/`);
}
