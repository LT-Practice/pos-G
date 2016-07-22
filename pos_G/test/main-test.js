'use strict';

describe('pos', () => {

    it('#1.formatTags', () => {

        let tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2'
        ];

        let formattedTags = formatTags(tags);

        const expectFormattedTags = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];


        expect(formattedTags).toEqual(expectFormattedTags);

    });

    it('#2.countBarcodes', () => {

        let formattedTags = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];

        let countedBarcodes = countBarcodes(formattedTags);

        const expectFormattedTags = [

            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];

        expect(countedBarcodes).toEqual(expectFormattedTags);

    });

    it('#3.buildCartItems', () => {
        let countedBarcodes = [

            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];

        let allItems = loadAllItems();

        let cartItems = buildCartItems(countedBarcodes, allItems);

        const expectCartItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2
            }
        ];

        expect(cartItems).toEqual(expectCartItems);

    });

    it('#4.buildPromotedItems', () => {
        let cartItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 11
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2
            }
        ];

        let promotions = loadPromotions();

        var promotedItems = buildPromotedItems(cartItems, promotions);

        const expectPromotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 11,
                payPrice: 31.35,
                saved: 1.65,
                promotionType: '单品批发价出售'
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0,
                promotionType: 'OTHER_PROMOTION'
            }
        ];

        expect(promotedItems).toEqual(expectPromotedItems);
    });

    it('#5.calculateTotalPrices', () => {
        let promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3,
                payPrice: 9,
                saved: 0
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0
            }
        ];

        let totalPrices = calculateTotalPrices(promotedItems);

        const expectTotalPrices =
        {
            totalPayPrice: 39,
            totalSaved: 0
        };

        expect(totalPrices).toEqual(expectTotalPrices);

    });

    it('#6.buildReceipt', () => {

        let totalPrices = {
            totalPayPrice: 39,
            totalSaved: 0
        };

        let promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3,
                payPrice: 9,
                saved: 0,
                promotionType: '单品批发价出售'
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0,
                promotionType: 'OTHER_PROMOTION'
            }
        ];

        let receipt = buildReceipt(promotedItems, totalPrices);

        const expectReceipt = {
            receiptItems: [
                {
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    count: 3,
                    payPrice: 9,
                    saved:0,
                    promotionType: '单品批发价出售'
                },
                {
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    count: 2,
                    payPrice: 30,
                    saved:0,
                    promotionType: 'OTHER_PROMOTION'
                }
            ],
            promotionItems: [
                {
                    type: '单品批发价出售',
                    name: '雪碧',
                    unit: '瓶',
                    count: 3
                },
                {
                    type:'OTHER_PROMOTION',
                    name:'荔枝',
                    unit: '斤',
                    count:2

                }
            ],
            totalPayPrice: 39,
            totalSaved: 0
        };

        expect(receipt).toEqual(expectReceipt);

    });

    it('#7.has one typepromotion', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：12瓶，单价：3.00(元)，小计：34.20(元)，优惠：1.80(元)
----------------------
单品批发价出售：
名称：雪碧，数量：12瓶
----------------------
总计：34.20(元)
节省：1.80(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });

    it('#7.has two types promotion', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：12瓶，单价：3.00(元)，小计：34.20(元)，优惠：1.80(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：13.50(元)
----------------------
单品批发价出售：
名称：雪碧，数量：12瓶
----------------------
OTHER_PROMOTION：
名称：荔枝，数量：2斤
----------------------
总计：77.70(元)
节省：1.80(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });


    it('#7.no promotion', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'

        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：4瓶，单价：3.00(元)，小计：12.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：13.50(元)
----------------------
总计：25.50(元)
节省：0.00(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});
