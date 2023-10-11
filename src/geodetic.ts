import * as proj4 from 'proj4';
import { GridCode } from './grid-code';
import { GeodeticCoord } from './types';
import { UTM } from './utm';
import { geodeticCoordValidation, utmLatitudesValidation } from './validations';

/**
 * Geodetic
 */
export class Geodetic {
    /**
     * Geodetic
     * 
     * @param geodeticCoord GeodeticCoord
     */
    constructor(private readonly geodeticCoord: GeodeticCoord) {
        this.geodeticCoord = geodeticCoordValidation.parse(geodeticCoord);
    }

    /**
     * Get a grid code coordinate
     * 
     * @returns Grid code coordinate
     */
    public toGridCodeCoord(): GridCode {
        const utmCoord = this.toUTMCoord();
        return utmCoord.toGridCode();
    }

    /**
     * Get a UTM coordinate
     * 
     * @returns UTM coordinate
     */
    public toUTMCoord(): UTM {
        utmLatitudesValidation.parse(this.geodeticCoord.latitude);
        const hemisphere = this.geodeticCoord.latitude >= 0 ? 'N' : 'S';
        const zone = Math.floor((this.geodeticCoord.longitude + 180) / 6) + 1;
        const utmEpsg = `EPSG:32${hemisphere === 'N' ? 6 : 7}${zone.toString().padStart(2, '0')}`
        const utmCoord = proj4('EPSG:4326', utmEpsg, { x: this.geodeticCoord.longitude, y: this.geodeticCoord.latitude });

        return new UTM(zone, hemisphere, utmCoord.x, utmCoord.y);
    }

    /**
     * Get latitude
     * 
     * @returns Latitude in units of degrees
     */
    public getLatitude(): number {
        return this.geodeticCoord.latitude;
    }

    /**
     * Get Longitude
     * 
     * @returns Longitude in units of degrees
     */
    public getLongitude(): number {
        return this.geodeticCoord.longitude;
    }
}