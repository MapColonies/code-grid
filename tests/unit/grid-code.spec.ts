// // import { cat } from '../../src';

// // describe('plus', function () {
// //   it('should equal 2 for 1 plus 1', function () {
// //     const expectedResult = 2;
// //     expect(1 + 1).toEqual(expectedResult);
// //   });
// //   it('cat should say meow', function () {
// //     expect(cat).toHaveProperty('say', 'meow');
// //   });
// // });

// const SAMPLE_GRID = [
//   {
//     'fid': 1,
//     'left': 770000,
//     'bottom': 3520000,
//     'right': 780000,
//     'top': 3530000,
//     'zone': 36,
//     'code': 'אבג'
//   },
//   {
//     'fid': 2,
//     'left': 780000,
//     'bottom': 3520000,
//     'right': 790000,
//     'top': 3530000,
//     'zone': 36,
//     'code': 'דהו'
//   },
//   {
//     'fid': 3,
//     'left': 210000,
//     'bottom': 3520000,
//     'right': 220000,
//     'top': 3530000,
//     'zone': 37,
//     'code': 'זחט'
//   },
//   {
//     'fid': 4,
//     'left': 220000,
//     'bottom': 3520000,
//     'right': 230000,
//     'top': 3530000,
//     'zone': 37,
//     'code': 'יכל'
//   }
// ];

// import { GridCode } from '../../src'

// describe('grid code coordinates #gridCode', () => {
//   describe('initialize a grid code coordinate', () => {
//     it.todo('should initialize a grid code coordinate for a coordinate inside the grid code zone');
//     it.todo('should throw an error for a grid code coordinate outside the grid code zone');
//   });
//   describe('get grid code coordinate properties', () => {
//     it.todo('should get grid code zone all levels #getZoneLevels');
//     it.todo('should get grid code bounding box #getBBOX');
//     it.todo('should get well formatted grid code coordinate #');
//   });
//   describe('transform a grid code coordinate to UTM coordinate #toUTM', () => {
//     it.skip('should transform a grid code coordinate within the grid code zone, containing a non-ascii char', () => {
//       const expectedCoord = 1
//       const gridCode = new GridCode('אבג 001001');

//       const utmCoord = gridCode.toUTM();
//       expect(utmCoord).toBe(1);
//     });
//     it.todo('should transform a grid code coordinate within the grid code zone, containing a non-ascii char');
//     it.todo('should throw an error if the grid code coordinate is invalid');
//     it.todo('should throw an error if the grid code coordinate is outside it\'s grid code zone (for clipped zones)');
//     it.todo('should throw an error if the transformed coordinate is invalid');
//   });
// });