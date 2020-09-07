var state; // = false;
var data;// = [];
var crawling; // = false;
var username = "test";
var password = "Gt6bfN0rYXNq";


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.command === 'testbc-pop') {
        console.log('testbc-pop');
        console.log(state);
        console.log(crawling);
        console.log(data);
        return false;
    } else if (message.command === 'savebc-pop') {
        console.log('savebc-pop');
        postDatatoTheServer();
        return false;
    } else if (message.command === 'reset-pop') {
        console.log('reset-pop');
        crawling = false;
        data = '';
        sendResponse({ response: "success" });
        /*
        if (crawling) {
            console.log('resetting running');
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                crawling = false;
                chrome.tabs.sendMessage(activeTab.id, { command: 'reset-back' }, function (response) {
                    console.log(response);
                    state = false;
                    data = {};
                    sendResponse({ response: "success" });
                });
            });
        } 
        else {
            console.log('resetting not running');
            state = false;
            data = {};
            sendResponse({ response: "success" });
        }
        */
    } else if (message.command === 'startScrapping-pop') {
        console.log('startScrapping-pop');
        console.log(crawling);
        if (crawling) {
            console.log('already running');
            sendResponse({ response: "success", message: "Scrapper is already running" });
        } else {
            console.log('not running');
            crawling = true;
            data = '';
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { command: 'startScrapping-back' }, function (response) {
                    console.log(response);
                    if (response.response) {
                        state = true;
                        chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "success", message: "Scrapper is started" });
                    } else {
                        state = false;
                        crawling = false;
                        chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "success", message: "Scrapper is not started. Make sure that you are logged in." });
                    }
                    return false;
                });
            });
            return false;
        }
    } else if (message.command === 'completeScrapping-content') {
        crawling = false;
        //
        //
        //
        //
        //
        //post data to ther server here
        //
        //
        //
        //after post is successful update UI
        console.log(data);
        console.log('completeScrapping-content');
        chrome.runtime.sendMessage({ command: 'completeScrapping-back', response: "success" }, function (response) {
            data = [];
            console.log(response);
        })
    } else if (message.command === 'crawledOrder-content') {
        console.log('crawledOrder-content');
        console.log(message.data);
        if (crawling) {
            if (data) {
                console.log('concat array');
                data.concat(message.data);
            } else {
                data = message.data;
            }
        }
        crawling = false;
        if (message.done) {
            //fetch details
            //post results
            postDatatoTheServer();
        }
        return false;
    } else if (message.command === 'crawledOrderDetail-content') {
        console.log('crawledOrderDetail-content');

        //update data here

        return false;

    } else if (message.command === 'crawling-content') {
        console.log('crawling-content');
        sendResponse({ response: crawling });
        return true;
    } else {
        sendResponse({ response: "failure", message: "Unknown action" });
    }
});

function postDatatoTheServer() {

    console.log('posting results to the server');

    return fetch('http://localhost/ali/all.php',
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            timeout: 5000,
            body: JSON.stringify({username: username, password: password, data:data})
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(json => {
            console.log(json);
            return json;
        })
}

//

//const fetchURL = "https://35.184.70.98/graphql";
const fetchURL = "http://localhost:8088/graphql";

function prepareQuery(token, query, variables) {
    return {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        timeout: 5000,
        body: JSON.stringify({ query, variables: variables })
    }
}
const connectShopQuery = `query user($shop:String!){
    user (shop:$shop){
        settings
    }
}
`;

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function createShopifyProduct(datain, sendResponse, sender, keys, settings) {

    //(datain);
    //console.log(settings);

    let images = [];
    //TODO: undefined imagepath list
    if (undefined !== datain.data.imagePathList) {
        let imagesList = datain.data.imagePathList;
        imagesList.push(datain.data.imagePath);
        for (item in datain.data.sku.skuList) {
            if (undefined !== datain.data.sku.skuList[item].image) {
                datain.data.sku.skuList[item].image = datain.data.sku.skuList[
                    item
                ].image.replace(/.jpg_.*.jpg/, ".jpg");
                imagesList.push(datain.data.sku.skuList[item].image);
            }
        }
        imagesList = imagesList.filter(onlyUnique);
        for (image of imagesList) {
            images.push({
                altText: image
                    .split("/")
                    .pop()
                    .replace(/\.[^/.]+$/, "")
                    .replace(/-/g, " "),
                src: image,
                selected: true,
            });
        }
    }
    let varOptions = Object.keys(datain.data.sku.skuAttList);
    let variants = [];
    for (varias in datain.data.sku.skuPriceList) {
        let options = [];
        let image;
        let optionkeys = datain.data.sku.skuPriceList[varias].ids.split(",");
        //console.log(optionkeys);
        for (okeys of optionkeys) {
            if (varOptions.length > 0) {
                options[
                    varOptions.findIndex(
                        (element) => element === datain.data.sku.skuList[okeys].name
                    )
                ] = datain.data.sku.skuList[okeys].value;
                if (undefined !== datain.data.sku.skuList[okeys].image) {
                    image = datain.data.sku.skuList[okeys].image;
                }
            }
        }

        let cost = datain.data.sku.skuPriceList[varias].price;
        if (settings.add_delivery_to_base && datain.data.logis) {
            cost = cost + Number(datain.data.logis);
        }
        let compareAtPrice = cost * settings.price_multi
        let price = cost * settings.sale_multi

        //let salePrice = datain.data.sku.skuPriceList[varias].price;

        if (datain.data.settings) {
            compareAtPrice = cost * datain.data.settings.priceMultiplier
            price = cost * datain.data.settings.saleMultiplier
        }
        variants.push({
            selected: true,
            price: (Math.round((price + Number.EPSILON) * 100) / 100),
            compareAtPrice: (Math.round((compareAtPrice + Number.EPSILON) * 100) / 100),
            requiresShipping: true,
            weight: 0,
            weightUnit: "GRAMS",
            inventoryItem: {
                cost: (Math.round((cost + Number.EPSILON) * 100) / 100),
                tracked: true,
            },
            inventoryManagement: "SHOPIFY",
            inventoryQuantities: [
                {
                    locationId: settings.locationIds,
                    availableQuantity: datain.data.sku.skuPriceList[varias].stock,
                },
            ],
            sku: datain.data.sku.skuPriceList[varias].sku + "",
            imageSrc: image,
            options: options,
        });
    }

    let category = [];
    if (datain.data.settings) {
        category.push(datain.data.settings.category);
    } else {
        category = settings.productType;
    }
    let input = {
        varselection: true,
        listselection: false,
        title: datain.data.title,
        longDescriptionUrl: datain.data.longDescriptionUrl,
        shortDescription: datain.data.shortDescription,
        attributes: datain.data.attributes,
        descriptionHtml: "",
        selectedDesc: "",
        productType: category,
        tags: settings.productTags,
        collections: settings.collections,
        options: varOptions,
        images: images,
        metafields: [
            {
                namespace: "taknalogy",
                key: "sourceURL",
                value: datain.data.url,
                valueType: "STRING",
            },
            {
                namespace: "taknalogy",
                key: "sourceSKU",
                value: datain.data.id + "",
                valueType: "STRING",
            },
        ],
        variants: variants,
    };
    let shopifyData = {
        input: input,
        store: datain.data.store,
        shipper: datain.logis,
        extra: {
            tradeCount: datain.data.tradeCount,
            reviews: datain.data.reviews,
            url: datain.data.url,
        },
    };

    var query = `mutation importProduct($shop: String!, $productId: String!, $data: String!) {
        importProduct(shop: $shop, productId: $productId, data: $data)
    }`;

    return fetch(fetchURL, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + keys.token
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        timeout: 5000,
        body: JSON.stringify({
            query,
            variables: {
                shop: keys.shop,
                productId: (datain.data.id + ""),
                data: JSON.stringify({ shopifyData: shopifyData }),
            },
        }),
    })
}
function createProduct(datain, sendResponse, sender = null) {

    //console.log(datain);


    /*
         console.log(message);
                message.data.data = product;
                message.data.data.logis = (undefined !== message.data.logis.price) ? message.data.logis.price : 0;
*/


    /*TODO:
        chrome.storage.sync.get("taknalogyextensionkeys", function (stores) {
            if (stores.taknalogyextensionkeys !== undefined) {
                netItem = JSON.parse(stores.taknalogyextensionkeys);
                chrome.storage.sync.get(netItem.default, function (sett) {
                    if (sett[netItem.default] !== undefined) {
                        let settings = JSON.parse(sett[netItem.default]);
                        sendResponse({ currency: settings.import_currency, shipto: settings.import_ship_to_calculation, unit: 1, language: settings.import_language, shipper: settings.calculation_shipper });
                    }
                });
            }
        });
    */
    chrome.storage.sync.get("taknalogyextensionkeys", function (obj) {
        if (obj.hasOwnProperty('taknalogyextensionkeys')) {
            netItem = JSON.parse(obj.taknalogyextensionkeys);

            chrome.storage.sync.get(netItem.default, function (sett) {
                if (sett[netItem.default] !== undefined) {
                    let settings = JSON.parse(sett[netItem.default]);
                    createShopifyProduct(datain, sendResponse, sender, {
                        shop: shop = netItem.default,
                        token: netItem[shop]
                    }, settings).then(result => {
                        return result.json()
                    }).then(json => {
                        if (json.data && json.data.importProduct && (json.data.importProduct === 'created' || json.data.importProduct === 'merged')) {
                            if (sender !== null) {
                                chrome.tabs.sendMessage(sender.tab.id, { command: 'saveComplete', outcome: 'created', id: datain.data.id });
                            } else {
                                chrome.runtime.sendMessage({ command: 'saveComplete', outcome: 'created', id: datain.data.id });
                            }
                        } else {
                            if (sender !== null) {
                                chrome.tabs.sendMessage(sender.tab.id, { command: 'saveComplete', outcome: 'failed', id: datain.data.id });
                            } else {
                                chrome.runtime.sendMessage({ command: 'saveComplete', outcome: 'failed', id: datain.data.id });
                            }
                        }
                    }).catch(error => {
                        //console.log(error);
                        if (sender !== null) {
                            chrome.tabs.sendMessage(sender.tab.id, { command: 'saveComplete', outcome: 'failed', id: datain.data.id });
                        } else {
                            chrome.runtime.sendMessage({ command: 'saveComplete', outcome: 'failed', id: datain.data.id });
                        }
                    });

                }
            });
        }
    })
}

function fetchProducPromise(a, b) {
    return fetch(a,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            timeout: 5000,
            body: JSON.stringify(b)
        });
}


function extractLogisticsData(pid, country, count, currency, sender, page, shipper) {




    let logurl = "https://freight.aliexpress.com/ajaxFreightCalculateService.htm?productid=" + pid + "&country=" + country + "&count=" + count + "&currencyCode=" + currency;

    //console.log(logurl);
    fetch(logurl,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            timeout: 5000
        }).then(response => {
            return response.text();
        }).then(outcomeData => {
            outcomeData = outcomeData.replace('(', '');
            outcomeData = outcomeData.replace(')', '');
            let parsedResponse = JSON.parse(outcomeData);
            let logist = null;
            for (let i = 0; i < parsedResponse.freight.length; i++) {
                //console.log(parsedResponse.freight[i]);
                if (parsedResponse.freight[i].companyDisplayName === shipper) {
                    logist = {
                        'found': true,
                        'shipper': shipper,
                        "status": parsedResponse.freight[i].status,
                        "price": parsedResponse.freight[i].localPrice,
                        "time": parsedResponse.freight[i].time,
                        "saveMoney": parsedResponse.freight[i].localSaveMoney,
                        "processingTime": parsedResponse.freight[i].processingTime,
                        currency: parsedResponse.freight[i].localCurrency
                    }
                    break;
                }
            }
            if (null === logist) {
                logist = {
                    'found': false,
                    'shipper': shipper
                }
            }
            if (page !== null) {
                chrome.tabs.sendMessage(sender.tab.id, { command: "freightDataSingle", "producId": pid, "data": logist });
            } else {
                chrome.tabs.sendMessage(sender.tab.id, { command: "freightData", "producId": pid, "data": logist });
            }
            chrome.storage.local.get(pid, function (result) {
                if (result[pid] !== undefined) {
                    result[pid].logis = logist;
                    chrome.storage.local.remove(pid, function () {
                        chrome.storage.local.set(result);
                    });
                } else {
                    result.logis = logist;
                    chrome.storage.local.set({ [pid]: result });
                }
            });

        });
}
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
function extractProductData(scriptList, sender) {

    for (let i = 0; i < scriptList.length; i++) {
        let raw = scriptList[i].innerText.replace(/[\r\n]+/gm, "");
        if (raw.includes('window.runParams')) {
            raw = raw.substr(0, raw.indexOf('csrfToken'));
            raw = raw.substr(0, raw.lastIndexOf(','));
            raw = raw.substring(raw.indexOf(':') + 1);

            //download(raw, "txt.json", "text/plain");

            raw = JSON.parse(raw);

            let skuList = {};
            let skuAttList = {};
            let skuPriceList = {};
            if (undefined !== raw.skuModule.productSKUPropertyList) {
                for (let i = 0; i < raw.skuModule.productSKUPropertyList.length; i++) {
                    let skuVariable = '';
                    for (let j = 0; j < raw.skuModule.productSKUPropertyList[i].skuPropertyValues.length; j++) {
                        if (null != raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].propertyValueDisplayName) {
                            skuVariable = raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].propertyValueDisplayName + '|' + skuVariable;
                        }
                        skuAttList[raw.skuModule.productSKUPropertyList[i].skuPropertyName] = skuVariable;
                        skuList[raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].propertyValueId] = {
                            'image': (null !== raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].skuPropertyImagePath) ? raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].skuPropertyImagePath : '',
                            'name': raw.skuModule.productSKUPropertyList[i].skuPropertyName,
                            'value': raw.skuModule.productSKUPropertyList[i].skuPropertyValues[j].propertyValueDisplayName
                        };
                    }
                }
            }
            for (let i = 0; i < raw.skuModule.skuPriceList.length; i++) {

                let price = 0;
                let origPrice = 0;
                if (undefined !== raw.skuModule.skuPriceList[i].skuVal.skuActivityAmount) {
                    price = raw.skuModule.skuPriceList[i].skuVal.skuActivityAmount.value;
                    origPrice = raw.skuModule.skuPriceList[i].skuVal.skuAmount.value;
                } else {
                    price = raw.skuModule.skuPriceList[i].skuVal.skuAmount.value;
                    origPrice = price;
                }
                skuPriceList[i] = {
                    'price': price,
                    'origPrice': origPrice,
                    'ids': raw.skuModule.skuPriceList[i].skuPropIds,
                    sku: raw.skuModule.skuPriceList[i].skuId,
                    stock: raw.skuModule.skuPriceList[i].skuVal.availQuantity
                }
            }
            let product = {
                webEnv: {
                    shipto: raw.webEnv.country,
                    currency: raw.webEnv.currency,
                    "lang": raw.webEnv.lang,
                    "language": raw.webEnv.language,
                    "locale": raw.webEnv.locale
                },
                id: raw.pageModule.productId,
                url: raw.pageModule.itemDetailUrl,
                title: raw.titleModule.subject,
                tradeCount: raw.titleModule.tradeCount,
                reviews: raw.titleModule.feedbackRating,
                shortDescription: raw.pageModule.description,
                longDescriptionUrl: raw.descriptionModule.descriptionUrl,
                imagePath: raw.pageModule.imagePath,
                imagePathList: raw.imageModule.imagePathList,
                sku: {
                    skuList: skuList,
                    skuAttList: skuAttList,
                    skuPriceList: skuPriceList,
                },
                attributes: raw.specsModule.props,
                store: {
                    url: raw.storeModule.storeURL,
                    openTime: raw.storeModule.openTime,
                    storeName: raw.storeModule.storeName,
                    followingNumber: raw.storeModule.followingNumber,
                    openedYear: raw.storeModule.openedYear,
                    positiveRate: raw.storeModule.positiveRate,
                    positiveNum: raw.storeModule.positiveNum,
                    topRatedSeller: raw.storeModule.topRatedSeller,
                },
            };
            //console.log(product);
            if (undefined !== product) {
                return product;
            } else {
                let url = "https://login.aliexpress.com/";
                // sender.tab.id
                chrome.tabs.update(sender.tab.id, { url: url });
            }
        }
    }
}
function fetchProductData(message, sender, action, sendResponse) {
    let url = "https://www.aliexpress.com/item/" + message.pid + ".html";
    fetch(url,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                //'Content-Type': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
                //'Shop-Key': shopKey //'Basic ' + btoa('username:password'),
                //Authorization: 'Bearer '
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            timeout: 5000
        }).then(response => {
            return response.text();
        }).then(outcomeData => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(outcomeData, 'text/html');
            let scriptsList = doc.getElementsByTagName('script');
            product = extractProductData(scriptsList, sender);
            if (message.subCommand === 'peek' && undefined !== sender.tab) {
                chrome.tabs.sendMessage(sender.tab.id, { command: "productData", "producId": message.pid, "data": product });
            } else if (message.subCommand === 'peek') {
                chrome.runtime.sendMessage({ command: "productData", "producId": message.pid, "data": product });
            } else if (message.subCommand === 'import') {
                chrome.runtime.sendMessage({ command: "productData", "producId": message.pid, "data": product });
                message.data.data = product;
                message.data.data.logis = (undefined !== message.data.logis.price) ? message.data.logis.price : 0;
                createProduct(message.data, sendResponse, sender);
            }
        });
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {


    if (message.command === 'connectShop') {
        fetch(fetchURL,
            prepareQuery(message.data.key,
                connectShopQuery,
                { shop: message.data.shop })
        ).then(response => {
            return response.json();
        }).then(json => {
            if (json.data.user !== null) {
                sendResponse({
                    settings: JSON.parse(json.data.user.settings)
                });
            }
        }).catch(function (message) {
            sendResponse({ settings: null });
        });
        return true;
    } else if (message.command === 'getPageData') {
        chrome.storage.sync.get("taknalogyextensionkeys", function (stores) {
            if (stores.hasOwnProperty('taknalogyextensionkeys')) {
                netItem = JSON.parse(stores.taknalogyextensionkeys);
                // if (stores.taknalogyextensionkeys !== undefined) {
                //   netItem = JSON.parse(stores.taknalogyextensionkeys);
                chrome.storage.sync.get(netItem.default, function (sett) {
                    if (sett[netItem.default] !== undefined) {
                        let settings = JSON.parse(sett[netItem.default]);
                        sendResponse({ currency: settings.import_currency, shipto: settings.import_ship_to_calculation, unit: 1, language: settings.import_language, shipper: settings.calculation_shipper });
                    } else {
                        sendResponse({ currency: 'USD', shipto: 'US', unit: 1, language: 'en', shipper: 'ePacket' });
                    }
                });
            }
        });
        return true;
    } else if (message.command === 'fetchLogistics') {
        extractLogisticsData(message.pid, message.shipto, message.unit, message.currency, sender, message.page, message.shipper);
    } else if (message.command === 'fetchProduct') {
        if (message.subCommand === 'peek') {
            fetchProductData(message, sender);
        } else if (message.subCommand === 'import') {
            // console.log(message);
            if (null !== message.data) {
                if (!message.data.hasOwnProperty('data')) {
                    //message.data.data = {};
                    fetchProductData(message, sender, 'import', sendResponse);
                } else {
                    createProduct(message.data, sendResponse, sender);
                }
            } else {
                //message.data = {};
                //message.data.data = {};
                fetchProductData(message, sender, 'import', sendResponse);
            }
        }
    } else if (message.command === 'saveProduct') {
        createProduct(message, sendResponse);
    }
});

chrome.runtime.onStartup.addListener(function () {
    //chrome.storage.local.clear();
    console.log('Chrome extension is started');
})
