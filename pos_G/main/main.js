'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
function printReceipt(tags) {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let formattedTags = formatTags(tags);
    let countedBarcodes = countBarcodes(formattedTags);
    let cartItems = buildCartItems(countedBarcodes, allItems);
    let promotedItems = buildPromotedItems(cartItems, promotions);
    let totalPrices = calculateTotalPrices(promotedItems);
    let receipt = buildReceipt(promotedItems, totalPrices);
    let receiptString = printReceiptString(receipt);
    console.log(receiptString);
}


function isExist(barcode, array) {
    for (let countItem of array) {
        if (barcode === countItem.barcode) {
            return countItem;
        }
    }
    return null;
}


//#1

//use map(),includes()
function formatTags(tags) {
    return tags.map((tag) => {
        if (tag.includes('-')) {
            let temps = tag.split('-');
            return {barcode: temps[0], count: parseInt(temps[1])};
        } else {
            return {barcode: tag, count: 1};
        }
    });
}

//#2
function countBarcodes(formattedTags) {
    let result = [];
    for (let formattedTag of formattedTags) {
        let countItem = isExist(formattedTag.barcode, result);
        if (countItem === null) {
            result.push({barcode: formattedTag.barcode, count: formattedTag.count})
        } else {
            countItem.count += formattedTag.count;
        }
    }
    return result;
}


//#3
function buildCartItems(countedBarcodes, allItems) {
    let result = [];
    for (let countedBarcode of countedBarcodes) {
        let item = isExist(countedBarcode.barcode, allItems);
        let cartItem = {
            barcode: item.barcode,
            name: item.name,
            unit: item.unit,
            price: item.price,
            count: countedBarcode.count
        };
        result.push(cartItem);
    }
    return result;
}

//#4
function buildPromotedItems(cartItems, promotions) {
    let result = [];
    for (let cartItem of cartItems) {

        let saved = 0;
        let hasPromoted = false;
        var promotionType = null;
        promotions.forEach((currentPromotion) => {
            for (let barcode of currentPromotion.barcodes) {
                if (cartItem.barcode === barcode) {
                    hasPromoted = true;
                    promotionType = currentPromotion.type;
                }
            }
            if (currentPromotion.type === '单品批发价出售' && hasPromoted && cartItem.count > 10) {
                //var savedCount = Math.floor(cartItem.count / 3);
                //saved = cartItem.price * savedCount;
                saved = parseFloat((cartItem.price * cartItem.count * 0.05).toFixed(2));

            }

        });
        let payPrice = cartItem.count * cartItem.price - saved;
        result.push({
            barcode: cartItem.barcode,
            name: cartItem.name,
            unit: cartItem.unit,
            price: cartItem.price,
            count: cartItem.count,
            payPrice,
            saved,
            promotionType

        });

    }
    return result;
}


//#5
function calculateTotalPrices(promotedItems) {
    let result = {
        totalPayPrice: 0,
        totalSaved: 0
    };

    for (let promotedItem of promotedItems) {
        result.totalPayPrice += promotedItem.payPrice;
        result.totalSaved += promotedItem.saved;
    }
    return result;
}

//#6

//use map
function buildReceipt(promotedItems, totalPrices) {
    let promotionItems = [];
    let receiptItems = promotedItems.map((promotedItem) => {
        if (promotedItem.promotionType !== null) {
            promotionItems.push({
                type: promotedItem.promotionType,
                name: promotedItem.name,
                unit: promotedItem.unit,
                count: promotedItem.count
            });
        }
        return {
            name: promotedItem.name,
            unit: promotedItem.unit,
            price: promotedItem.price,
            count: promotedItem.count,
            payPrice: promotedItem.payPrice,
            saved: promotedItem.saved,
            promotionType: promotedItem.promotionType
        };
    });

    return {
        receiptItems,
        promotionItems,
        totalPayPrice: totalPrices.totalPayPrice,
        totalSaved: totalPrices.totalSaved
    };
}


//#7
function printReceiptString(receipt) {
    let receiptString = `***<没钱赚商店>收据***`;
    for (let receiptItem of receipt.receiptItems) {
        receiptString += `
名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
        if (receiptItem.saved > 0) {
            receiptString += `，优惠：${receiptItem.saved.toFixed(2)}(元)`;
        }
    }


    for (let promotionItem of receipt.promotionItems) {

        if (promotionItem.type.includes('单品批发价出售') && promotionItem.count > 10) {
            receiptString += `
----------------------
单品批发价出售：`;

            for (let promotionItem of receipt.promotionItems) {

                if (promotionItem.type.includes('单品批发价出售') && promotionItem.count > 10) {

                    receiptString += `
名称：${promotionItem.name}，数量：${promotionItem.count}${promotionItem.unit}`;
                }
            }
            continue;
        }

        if (promotionItem.type.includes('OTHER_PROMOTION')) {
            receiptString += `
----------------------
OTHER_PROMOTION：`;
            for (let promotionItem of receipt.promotionItems) {

                if (promotionItem.type.includes('OTHER_PROMOTION')) {

                    receiptString += `
名称：${promotionItem.name}，数量：${promotionItem.count}${promotionItem.unit}`;
                }
            }
            break;
        }
    }

    receiptString += `
----------------------
总计：${receipt.totalPayPrice.toFixed(2)}(元)
节省：${receipt.totalSaved.toFixed(2)}(元)
**********************`;

    return receiptString;
}