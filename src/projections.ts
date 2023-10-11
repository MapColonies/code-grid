import * as proj4 from 'proj4';

export const defineProjectionsTransformations = (): void => {
    defineUTMProjections();
}

const defineUTMProjections = (minZone = 1, maxZone = 60) => {
    // familiarize proj4 with utm zonal projections
    for (let zone: number = minZone; zone <= maxZone; zone++) {
        proj4.defs([
            [
                "EPSG:4326",
                "+proj=longlat +datum=WGS84 +no_defs "
            ],
            [
                `EPSG:326${zone.toString().padStart(2, '0')}`,
                `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs `
            ]
        ]);

        proj4.defs([
            [
                "EPSG:4326",
                "+proj=longlat +datum=WGS84 +no_defs "
            ],
            [
                `EPSG:327${zone.toString().padStart(2, '0')}`,
                `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m +no_defs `
            ]
        ]);
    }
}