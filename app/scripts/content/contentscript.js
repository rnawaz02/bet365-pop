/* global chrome */
var state = false;
var data = [];
var scrapped = false;
var checked = false;
var pag2;
var paging;
function startScrapFunc(data) {
    let orderList = document.createElement('a');
    orderList.setAttribute("id", "aliexpressdatagrabberorderlist");
    orderList.setAttribute("href", "//trade.aliexpress.com/orderList.htm");
    document.body.appendChild(orderList);
    console.log('loading orderlist from startScrapFunc');
    orderList.click();
}
window.addEventListener("load", function () {

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.command === 'testco-pop') {
            console.log(state);
            console.log(data);
            console.log(scrapped);
            console.log(paging);
            return false;
        } else if (message.command === 'startScrapping-back') {
            console.log('startScrapping-back');
            //console.log(message.data);
            //page = message.data.currPage;
            //if(message.page === 1){
            startScrapFunc();
            //}result.crawlerDataelse{

            //} 
            return false;
            /*} else if (message.command === 'fetchNext-back') {
                console.log('fetchNext-back');
                //startScrapFunc();
                loadNextPage();
                return false;
    
                */
        } else if (message.command === 'startScrapping-next-back') {

            console.log('startScrapping-next-back');
            //loadNextPage();
            setTimeout(loadNextPage, 6000);

            return false;
        } else {
            console.log('unkown operation');
            false;
        }
    });
    checkifLoggedIn();
    if (!state) {
        console.log('not logged in');
    } else {
        console.log('logged in');
        crawlPage();
    }
    /*
    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        return function (obj, callback) {
            if (!obj || obj.nodeType !== 1) return;
            if (MutationObserver) {
                var obs = new MutationObserver(function (mutations, observer) {
                    callback(mutations);
                })
                obs.observe(obj, { childList: true, subtree: true });
            } else if (window.addEventListener) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();
    observeDOM(document.body, function (m) {
        if (!state) {
            checkifLoggedIn();
        }
        if (state) {
            crawlPage();
        }
    });
    */
});


function checkifLoggedIn() {

    let accountName = document.getElementsByClassName('account-name');
    let flyoutLogined = document.getElementById('nav-user-account');
    if (flyoutLogined !== null) {
        flyoutLogined = flyoutLogined.getElementsByClassName('flyout-logined');
    }
    state = false;
    if (accountName && (accountName.length > 0)) {
        if (accountName[0].innerHTML !== "&nbsp;") {
            state = true;
        }
    } else if (flyoutLogined && (flyoutLogined.length > 0)) {
        let nameEle = flyoutLogined[0].getElementsByClassName('welcome-name');
        if (nameEle && (nameEle.length > 0)) {
            state = true;
        }
    }
    chrome.runtime.sendMessage({ command: 'setLoginState-content', state: state });
}
function crawlPage() {

    let pl = '';
    let simplePager = document.getElementById('simple-pager');
    if(simplePager){
        let uiPaginationNext = simplePager.getElementsByClassName('ui-pagination-next');
        if (uiPaginationNext.length > 0) {
            console.log(uiPaginationNext);
            if (! uiPaginationNext[0].classList.contains('ui-pagination-disabled')) {
                pl = uiPaginationNext[0];
                console.log('next found');
            }
        }
    }
    console.log('uiPaginationNext - ', pl);
    chrome.runtime.sendMessage({ command: 'crawling-content' }, function (response) {
        if (response.response) {
            console.log('crawling');
                 
            if (window.location.href.includes('orderList.htm')) {
                console.log('parse orders');
                console.log(response.data.pl)
                var doc = new DOMParser().parseFromString(response.data.pl, "text/xml");
                console.log(doc)
                p = parseInt(simplePager.getElementsByClassName('ui-label')[0].innerHTML.split("/")[0], 10);
                console.log(p);
                console.log(response.data.currPage);
             
               // document.body.appendChild(doc);
               // doc.click();

                //let simplePager = document.getElementById('simple-pager');
                if (p < response.data.currPage) {
                    //loadNextPage();
                    console.log('call next');
                    setTimeout(loadNextPage, 3000);
                
                } else if (p > response.data.currPage) {
                    //startScrapFunc();
                    console.log('call first');
                    setTimeout(startScrapFunc, 3000);
                
                } else {
                    console.log('scrapped ', scrapped);
                    if (!scrapped) {
                        aliOrderParser();
                        scrapped = true;
                //        console.log(data);
                //        console.log(paging);
                        chrome.runtime.sendMessage({ command: 'crawledOrder-complete-content', data: data, paging: paging, pl: pl }, function(reply){
                            console.log(reply);
                        });
                    } 
                }
            } else if (window.location.href.includes('order_detail.htm')) {
                console.log('parse order detail');
                if (!scrapped) {
                    if (aliOrderDetailParser()) {
                        scrapped = true;
                        chrome.runtime.sendMessage({ command: 'crawledOrderDetail-complete-content', data: data });
                    } else {
                        scrapped = false;
                    }
                }
            } else if (window.location.href.includes('aliexpress')) {
                //if (!checked) {
                 //   checked = true;
                   // chrome.runtime.sendMessage({ command: 'crawling-content' }, function (response) {
                       // if (response.response) {
                startScrapFunc();
                        //}
                    //});
             //   }
            }
        } else {
            console.log('not crawling');
        }
    });
}

function loadNextPage(nextpage = 1) {

    console.log('loadNextPage is called');
    data = [];
    scrapped = false;

    let simplePager = document.getElementById('simple-pager');
    let uiPaginationNext = simplePager.getElementsByClassName('ui-pagination-next');
    if (uiPaginationNext.length > 0) {
        console.log(uiPaginationNext);
        if (uiPaginationNext[0].classList.contains('ui-pagination-disabled')) {
            consosle.log('orders crawled');
        } else {
            uiPaginationNext[0].click();
        }
    }
    //}
}

function aliOrderParser() {

    let ordersOnThePage = document.getElementById('buyer-ordertable').getElementsByClassName('order-item-wraper');
    for (let i = 0; i < ordersOnThePage.length; i++) {
        //console.log(ordersOnThePage[i]);
        let orderInfo = ordersOnThePage[i].getElementsByClassName('order-info');
        let storeInfo = ordersOnThePage[i].getElementsByClassName('store-info');
        let orderAmount = ordersOnThePage[i].getElementsByClassName('order-amount');
        let orderBody = ordersOnThePage[i].getElementsByClassName('order-body');
        let orderamountandcount = orderBody[0].getElementsByClassName('product-amount')[0].getElementsByTagName('span');
        let properties = '';
        for (let element of orderBody[0].getElementsByClassName('product-property')[0].getElementsByTagName('span')) {
            if (element.tagName === 'SPAN') {
                let pvalues = element.getElementsByTagName('span');
                if (pvalues.length > 0) {
                    for (let evalue of pvalues) {
                        if (properties === '') {
                            properties = evalue.innerHTML.trim()
                        } else {
                            properties = properties + "|" + evalue.innerHTML.trim()
                        }
                    }
                }
            }
        }
        let detailURL = orderInfo[0].getElementsByClassName('first-row')[0].getElementsByTagName("a")[0].href;

        let orderAction = orderBody[0].getElementsByClassName('order-action')[0].getElementsByTagName('button');
        if(orderAction.length>1){
            orderAction = orderAction[1].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, "");
        }else{
            orderAction = '';
        }
/////
let itemNumber = ordersOnThePage[i].getElementsByClassName('product-title')[0].getElementsByTagName('a');
itemNumber = itemNumber[0].href;

///
        let orderItem = {
            itemNumber: itemNumber,
            orderNumber: orderInfo[0].getElementsByClassName('first-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            orderTime: orderInfo[0].getElementsByClassName('second-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            storeName: storeInfo[0].getElementsByClassName('first-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            orderAmount: orderAmount[0].getElementsByClassName('amount-num')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            itemAmount: orderamountandcount[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            quantity: orderamountandcount[1].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            properties: properties.replace(/(\r\n|\n|\r)/gm, ""),
            orderStatus: orderBody[0].getElementsByClassName('order-status')[0].getElementsByClassName('f-left')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, ""),
            orderAction: orderAction,
            internationalShippingCompany: '',
            trackingNumberRemarksDetails: '',
            address: '',
            status: "new",
            detailURL: detailURL
        }
        let simplePager = document.getElementById('simple-pager');
        paging = simplePager.getElementsByClassName('ui-label')[0].innerHTML;
        //console.log(orderItem);
        data.push({ [orderItem.orderNumber]: orderItem });
    }
}

function aliOrderDetailParser() {

    let orderNo = document.getElementsByClassName('order-no')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, "");
    let detaailData = [];
    let internationalShippingCompany = '';
    let trackingNumberRemarksDetails = ''
    let shippingBd = document.getElementsByClassName('shipping-bd');
    //if (shippingBd.length === 0) {
    //    return false;
    //}
    for (let i = 0; i < shippingBd.length; i++) {
        let logisticsName = shippingBd[i].getElementsByClassName('logistics-name')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, "");
        let logisticsNum = shippingBd[i].getElementsByClassName('logistics-num')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, "");
        if (internationalShippingCompany) {
            internationalShippingCompany = internationalShippingCompany + "|" + logisticsName;
        } else {
            internationalShippingCompany = logisticsName;
        }
        if (trackingNumberRemarksDetails) {
            trackingNumberRemarksDetails = trackingNumberRemarksDetails + "|" + logisticsNum;
        } else {
            trackingNumberRemarksDetails = logisticsNum;
        }
        scrapped = true
    }
    let userShipping = document.getElementById('user-shipping');
    let userShippingList = document.getElementById('user-shipping-list').getElementsByTagName('li');
    data = {
        orderNo: orderNo,
        internationalShippingCompany: internationalShippingCompany,
        trackingNumberRemarksDetails: trackingNumberRemarksDetails,
        address: userShippingList[1].getElementsByTagName('span')[0].innerHTML.trim().replace(/(\r\n|\n|\r)/gm, "")
    }
    //data = data;
    //console.log(data);
    return data;
}