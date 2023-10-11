import { z } from "zod";
import { geodeticCoordValidation, gridCodeCellValidation, gridCodeCellsValidation, hemisphereValidation, subLevelsGridCodeZoneValidation, utmLatitudesValidation } from "./validations";

export type GridCodeCell = z.infer<typeof gridCodeCellValidation>;
export type GridCodeCells = z.infer<typeof gridCodeCellsValidation>;

export type Hemisphere = z.infer<typeof hemisphereValidation>;
export type UtmZone = z.infer<typeof utmLatitudesValidation>;

export type SubLevelGridCodeZones = z.infer<typeof subLevelsGridCodeZoneValidation>; // Tuple<string, 3>;

export type GeodeticCoord = z.infer<typeof geodeticCoordValidation>;