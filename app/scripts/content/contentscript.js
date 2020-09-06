/* global chrome */
var state = false;
var data = [];
var scrapped = false;
var next = '';
var currentOrderDetailIndex = 0;
window.addEventListener("load", function () {
    
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        console.log(message)
        console.log(sender)

        if (message.command === 'testco-pop') {
            console.log(state);
            console.log(data);
            console.log(scrapped); 
            return false;
        } else if (message.command === 'startScrapping-back') {
            checkifLoggedIn();
            if(state){
                let orderList = document.createElement('a');
                orderList.setAttribute("id", "aliexpressdatagrabberorderlist");
                orderList.setAttribute("href", "//trade.aliexpress.com/orderList.htm");
                document.body.appendChild(orderList);     
                orderList.click();     
                sendResponse({ response: true });    
            }else{
                sendResponse({ response: false });    
            }
        } else if (message.command === 'scrapOrderDetail-pop') {
            console.log('scrapOrderDetail-pop');
            if(data && data.length > currentOrderDetailIndex){
                if(data[currentOrderDetailIndex].status === "new"){
                    let tabURL = data[currentOrderDetailIndex].detailURL
             
                    chrome.tabs.create({ url: tabURL }, function callBack(tab){
                        console.log(tab);
                        //chrome.tabs.remove(tab.id, function() { console.log('tab is closed') });
                    });

                    currentOrderDetailIndex = currentOrderDetailIndex + 1;
                    if(data.length === currentOrderDetailIndex){
                        currentOrderDetailIndex = 0;
                    }
                }
            }
        }
    });
  
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
        console.log('body has changed');
        if(!state){
            checkifLoggedIn();

            if(state){
            //    console.log('ready to crawl');
                //startCrawlingOrders();
                if (window.location.href.includes('orderList.htm') || window.location.href.includes('order_detail.htm')) {
                    crawlPage();
                }
            }
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
    let orderList = document.createElement('a');
    orderList.setAttribute("id", "aliexpressdatagrabberorderlist");
    orderList.setAttribute("href", "//trade.aliexpress.com/orderList.htm");
    // document.body.appendChild(orderList);     
    // orderList.click();

    if (window.location.href.includes('orderList.htm')) {

        console.log('parse orders');
        aliOrderParser();
        console.log(data);
        chrome.runtime.sendMessage({ command: 'crawledOrder-content', data: data }, function (response) {
            console.log(response);
        })

    } else if (window.location.href.includes('order_detail.htm')) {
        console.log('parse order detail');
    }
    */
});


function checkifLoggedIn(){

    let accountName = document.getElementsByClassName('account-name');
    let flyoutLogined = document.getElementById('nav-user-account');
    if(flyoutLogined !== null){
        flyoutLogined = flyoutLogined.getElementsByClassName('flyout-logined');
    }
  
    // console.log(accountName);
    state = false;
    if (accountName && (accountName.length > 0)) {
        if (accountName[0].innerHTML !== "&nbsp;") {
            state = true;
        }
        //else if (navUserAccount){
        //   state = true;
        //}
    } else if (flyoutLogined && (flyoutLogined.length > 0)) {
        let nameEle = flyoutLogined[0].getElementsByClassName('welcome-name');
        if(nameEle && (nameEle.length > 0)){
            state = true;
     
        }
        console.log(nameEle.length);
        console.log(nameEle);
        //console.log(navUserAccount);
        //console.log(document.getElementsByClassName('flyout-welcome-wrap'));

    }
}
function crawlPage(){
    console.log('crawlPage');
    if (window.location.href.includes('orderList.htm')) {
        console.log('parse orders');
        chrome.runtime.sendMessage({ command: 'crawling-content' }, function (response) {
            console.log('crawling-content');
            console.log(response);
            if(response.response){
                console.log('crawling');
                //document.getElementById('message').style.display="none";
                //document.getElementById('spacer').style.display="block";
                if(!scrapped){
                    aliOrderParser();
                    scrapped = true
                }
                console.log(data);
                if(next){
                    chrome.runtime.sendMessage({ command: 'crawledOrder-content', data: data, done: false });
                    //fetch next page
                }else{
                    chrome.runtime.sendMessage({ command: 'crawledOrder-content', data: data, done : true });
                }
                /*, function (response) {
                    console.log(response);
                })*/
            }else{
                console.log('not crawling');
            }
        })
    } else if (window.location.href.includes('order_detail.htm')) {
        console.log('parse order detail');
    }
}
function startCrawlingOrders(){
    let orderList = document.createElement('a');
    orderList.setAttribute("id", "aliexpressdatagrabberorderlist");
    orderList.setAttribute("href", "//trade.aliexpress.com/orderList.htm");
    document.body.appendChild(orderList);     
    orderList.click();
}
function aliOrderParser() {

    let ordersOnThePage = document.getElementById('buyer-ordertable').getElementsByClassName('order-item-wraper');
    for (let i = 0; i < ordersOnThePage.length; i++) {
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
        let orderItem = {
            orderNumber: orderInfo[0].getElementsByClassName('first-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim(),
            orderTime: orderInfo[0].getElementsByClassName('second-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim(),
            storeName: storeInfo[0].getElementsByClassName('first-row')[0].getElementsByClassName('info-body')[0].innerHTML.trim(),
            orderAmount: orderAmount[0].getElementsByClassName('amount-num')[0].innerHTML.trim(),
            itemAmount: orderamountandcount[0].innerHTML.trim(),
            quantity: orderamountandcount[1].innerHTML.trim(),
            properties: properties,
            orderStatus: orderBody[0].getElementsByClassName('order-status')[0].getElementsByClassName('f-left')[0].innerHTML.trim(),
            orderAction: orderBody[0].getElementsByClassName('order-action')[0].getElementsByTagName('button')[1].innerHTML.trim()
        }
        let detailURL = orderInfo[0].getElementsByClassName('first-row')[0].getElementsByTagName("a")[0].href;
        data.push({ [orderItem.orderNumber]: orderItem, status: "new", detailURL: detailURL });
    }
}