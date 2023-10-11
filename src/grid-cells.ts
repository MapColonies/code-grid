import { GridCodeCells } from './types';
import { gridCodeCellsValidation } from './validations';

/**
 * Grid cells
 */
export class GridCells {
    public static grid: GridCodeCells | undefined;

    /**
     * Grid cells
     * 
     * @param gridCodeZones Grid code zones definitions
     * @example const grid = new GridCodeZones([{
     *              left: 770000,
     *              bottom: 3520000,
     *              right: 780000,
     *              top: 3530000,
     *              zone: 36,
     *              hemisphere: 'N',
     *              gridCodeZone: 'ABC'
     * }, {...}]);
     */
    constructor(gridCodeZones: GridCodeCells) {
        // TODO: add more validation tests, like distinct values and gridCodeZone values
        GridCells.grid = gridCodeCellsValidation.parse(gridCodeZones);
    }
}