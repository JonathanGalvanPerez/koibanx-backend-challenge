jest.mock('../models/store');
const storeDataFormatter = require('../utils/storeDataFormatter');
const data = [
  {
    concepts: [9356, 59701, 41023, 59176, 14792, 3032],
    name: 'Swift, Kling and Boyer',
    cuit: '512964344-5',
    currentBalance: 710745,
    active: false,
    lastSale: new Date('2021-04-18T18:25:13Z'),
    createdAt: new Date('2021-07-23T02:51:27.754Z'),
    updatedAt: new Date('2021-07-23T02:51:27.754Z'),
    id: '60fa2eaf16679926805ea7ae',
  },
  {
    concepts: [91837, 81102, 79369, 85963, 22414, 28796],
    name: 'Heathcote-Crona',
    cuit: '441281034-8',
    currentBalance: 439585,
    active: false,
    lastSale: new Date('2018-04-09T06:17:25Z'),
    createdAt: new Date('2021-07-23T02:51:27.772Z'),
    updatedAt: new Date('2021-07-23T02:51:27.772Z'),
    id: '60fa2eaf16679926805ea7ce',
  },
];
const getCommerces = jest.fn().mockReturnValue(Promise.resolve(data));

describe('test storeDataFormatter', function () {
  it('should return formatted data', async function () {
    const getFormattedData = storeDataFormatter(getCommerces);
    const args = ['', 'id', 1, 10];
    const result = await getFormattedData(...args);
    expect(getCommerces).toBeCalledWith(...args);
    expect(result).toEqual({
      data: [
        {
          id: '60fa2eaf16679926805ea7ae',
          name: 'Swift, Kling and Boyer',
          cuit: '512964344-5',
          currentBalance: '$ 710.745',
          active: 'No',
          lastSale: '21-04-18',
          concept0: 9356,
          concept1: 59701,
          concept2: 41023,
          concept3: 59176,
          concept4: 14792,
          concept5: 3032,
        },
        {
          id: '60fa2eaf16679926805ea7ce',
          name: 'Heathcote-Crona',
          cuit: '441281034-8',
          currentBalance: '$ 439.585',
          active: 'No',
          lastSale: '18-04-09',
          concept0: 91837,
          concept1: 81102,
          concept2: 79369,
          concept3: 85963,
          concept4: 22414,
          concept5: 28796,
        },
      ],
      page: 1,
      pages: 10,
      limit: 10,
      total: 100,
    });
  });
});
