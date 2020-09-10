var state = false;
var data = [];
var currentOrderDetailIndex = 0;
var workingTab = '';
var crawling = false;
var crawled = false;
var username = "test";
var password = "Gt6bfN0rYXNq";
var lock;
let page;
let myitem;
let itemsize;
let orderNumber;
function startDetailScrapping() {
    console.log('startDetailScrapping is called');
    console.log('lock = ', lock);
    if (!lock) {
        chrome.storage.local.get(['crawlerData'], function (result) {
            lock = true;
            console.log(result);

            page = result.crawlerData.currPage;
            myitem = result.crawlerData.myitem;


            //updateCrawlMeta(currPage, totalPages, jobType)
            /*
            if (result.crawlerData.crawling) {
                if (result.crawlerData.jobType === 1) {
                    page = 1;
                    myitem = 1;
                } else {
                    page = result.crawlerData.currPage;
                    myitem = 1;
                }
            }
            */
            chrome.storage.local.get(['data-' + page], function (result2) {

                console.log(result2['data-' + page]);
                let keyList = Object.keys(result2['data-' + page]);
                itemsize = keyList.length;



                console.log(keyList);
                console.log(itemsize);
                console.log(result2['data-' + page][keyList[myitem - 1]]);

                orderNumber = Object.keys(result2['data-' + page][keyList[myitem - 1]])[0];

                console.log(orderNumber);

                console.log(myitem);
                let dataCopy = result2['data-' + page][keyList[myitem - 1]][orderNumber];

                if (dataCopy.status === "new") {
                    //let tabURL = dataCopy.detailURL
                    console.log(dataCopy.detailURL);
                    chrome.tabs.create({ url: dataCopy.detailURL }, function callBack(tab) {
                        console.log(tab);
                        console.log(tab.id);
                        workingTab = tab.id;
                        //data[currentOrderDetailIndex][key].tabid = tab.id;
                        console.log(myitem);

                        //updateCrawlMeta(page, '', "2", myitem, itemsize, orderNumber, workingTab)
                        result.crawlerData.itemsize = itemsize;
                        result.crawlerData.workingTab = workingTab;
                        chrome.storage.local.set({ 'crawlerData': result.crawlerData });

                    });
                } else {
                    updateCrawlMeta(page, '', "2", myitem, itemsize, orderNumber, '')
                }

            });

            //updateCrawlMeta(page, '', 2, item, itemsize, orderNumber)

        });
    }
}

chrome.storage.local.get(['crawlerData'], function (result) {
    console.log(result);
    if (Object.keys(result).length === 0 && result.constructor === Object) {
        console.log('no result found initialize');
        chrome.storage.local.set({ 'crawlerData': { state: false, currentOrderDetailIndex: 0, workingTab: '', crawling: false, page: 1, myitem: 1 } }, function () {
            console.log("added default values to the storage")
        });
    } else {
        console.log('found result!');
        console.log(result);
        state = result.state
        currentOrderDetailIndex = result.currentOrderDetailIndex
        workingTab = workingTab
        crawling = crawling
    }
});

function updateCrawlMeta(currPage, totalPages, jobType, myitem, itemsize, orderNumber, workingTab) {
    //         updateCrawlMeta(page, '', 2, item, itemsize, orderNumber, tab.id)

    chrome.storage.local.get(['crawlerData'], function (result) {
        if (currPage) result.crawlerData.currPage = currPage
        if (totalPages) result.crawlerData.totalPages = totalPages;
        if (jobType) result.crawlerData.jobType = jobType;

        if (myitem) result.crawlerData.myitem = myitem;
        if (itemsize) result.crawlerData.itemsize = itemsize;
        if (orderNumber) result.crawlerData.orderNumber = orderNumber;
        if (workingTab) { result.crawlerData.workingTab = workingTab } else { result.crawlerData.workingTab = '' };

        console.log(result);

        chrome.storage.local.set({ 'crawlerData': result.crawlerData });
    });
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.command === 'testbc-pop') {
        console.log('testbc-pop');
        console.log(state);
        console.log(crawling);
        console.log(data);
        console.log(currentOrderDetailIndex);
        console.log(workingTab);
        console.log(lock);
        chrome.storage.local.get(['crawlerData'], function (result) {
            console.log(result);
        });
        return false;
    } else if (message.command === 'savebc-pop') {
        console.log('savebc-pop');
        postDatatoTheServer();
        return false;
    } else if (message.command === 'reset-pop') {
        console.log('reset-pop');
        crawling = false;
        data = '';
        lock = false;
        crawled = false;
        workingTab = '';
        currentOrderDetailIndex = 0;
        chrome.storage.local.set({ 'crawlerData': { state: false, currentOrderDetailIndex: 0, workingTab: '', crawling: false, page: 1, jobType: 1 } });
        sendResponse({ response: "success" });
    } else if (message.command === 'startScrapping-pop') {
        console.log('startScrapping-pop');
        crawled = false;
        chrome.storage.local.get(['crawlerData'], function (result) {
            console.log(result);
            if (Object.keys(result).length === 0 && result.constructor === Object) {
                chrome.storage.local.set({ 'crawlerData': { state: false, currentOrderDetailIndex: 0, workingTab: '', crawling: true, jobType: 1, page: 1 } });
            } else {
                if (!result.crawlerData.crawling) {
                    chrome.storage.local.set({ 'crawlerData': { state: false, currentOrderDetailIndex: 0, workingTab: '', crawling: true } }, function (result) {
                        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                            var activeTab = tabs[0];
                            chrome.tabs.sendMessage(activeTab.id, { command: 'startScrapping-back' }); //, function (response) {
                            /*
                            console.log(response);
                            if (response.response) {
                                state = true;
                                chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "success", message: "Scrapper is started" });
                            } else {
                                state = false;
                                crawling = false;
                                chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "failed", message: "Scrapper is not started. Make sure that you are logged in." });
                            }
                            return false;
                            */
                            //});
                        });
                        chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "success", message: "Scrapper is started" });
                    });
                } else {
                    chrome.runtime.sendMessage({ command: 'startScrappingResp-back', response: "failed", message: "Scrapper is already running" });
                }
            }
        });


        // console.log('startScrapping-pop');
        // console.log(crawling);

        /*
         */
        //   return false;
        // }

        return false;
    } else if (message.command === 'scrapOrderDetail-pop') {
        console.log('scrapOrderDetail-pop');
        if (data && data.length > currentOrderDetailIndex) {
            let key = Object.keys(data[currentOrderDetailIndex]);
            console.log(key);
            console.log(data[currentOrderDetailIndex][key]);
            console.log(data[currentOrderDetailIndex][key].status);
            if (data[currentOrderDetailIndex][key].status === "new") {
                let tabURL = data[currentOrderDetailIndex][key].detailURL
                console.log(tabURL);
                chrome.tabs.create({ url: tabURL }, function callBack(tab) {
                    console.log(tab);
                    chrome.tabs.remove(tab.id, function () { console.log('tab is closed') });
                });

                currentOrderDetailIndex = currentOrderDetailIndex + 1;
                if (data.length === currentOrderDetailIndex) {
                    currentOrderDetailIndex = 0;
                }
            }
        }
        /*} else if (message.command === 'completeScrapping-content') {
            startDetailScrapping();
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
                crawling = false;
                console.log(response);
            })*/
    } else if (message.command === 'crawledOrder-complete-content') {
        if (!crawled) {
            crawled = true;
            console.log('crawledOrder-complete-content');
            console.log(message);
            let pages = message.paging.split('/');
            console.log(pages);
            console.log(pages[0]);
            updateCrawlMeta(pages[0], pages[1], 1);
            chrome.storage.local.set({ ['data-' + pages[0]]: message.data }, function (result) {
                sendResponse({ response: true });
                if (pages[0] === pages[1]) {
                    chrome.storage.local.get(['crawlerData'], function (last) {
                        last.crawlerData.currPage = 1;
                        last.crawlerData.myitem = 1;
                        last.crawlerData.jobType = 2;
                        chrome.storage.local.set({ 'crawlerData': last.crawlerData }, function (last2) {
                            //startDetailScrapping();
                            setTimeout(startDetailScrapping, 3000);

                        });
                    });
                }
            });
            return true;
        } else {
            sendResponse({ response: true });
        }
    } else if (message.command === 'crawledOrderDetail-complete-content') {
        console.log('crawledOrderDetail-content');

        console.log(message);



        chrome.storage.local.get(['crawlerData'], function (result) {
            console.log(result);

            if (result.crawlerData.workingTab) {
                chrome.tabs.remove(result.crawlerData.workingTab, function () {
                    console.log(result.crawlerData.workingTab, 'tab is closed');
                });
            }
            chrome.storage.local.get(['data-' + page], function (result2) {

                let dataCopy = result2['data-' + page][myitem - 1][message.data.orderNo];
                dataCopy.internationalShippingCompany = message.data.internationalShippingCompany
                dataCopy.trackingNumberRemarksDetails = message.data.trackingNumberRemarksDetails
                dataCopy.address = message.data.address
                dataCopy.status = "complete";
                chrome.storage.local.set({ ['data-' + page]: result2['data-' + page] }, function (result3) {

                    if (myitem < itemsize) {
                        result.crawlerData.myitem = myitem + 1
                        chrome.storage.local.set({ ['crawlerData']: result.crawlerData }, function (result4) {
                            lock = false;
                            setTimeout(startDetailScrapping, 3000);
                        });
                    } else if (myitem === itemsize && page < result.crawlerData.totalPages) {

                        console.log("\n\n\n page items are crawled");
                        console.log(page)
                        console.log(page === 1);
                        console.log(page == 1);
                        postDatatoTheServer(result2['data-' + page]);    
                        chrome.storage.local.remove(['data-' + page]);

                        result.crawlerData.myitem = 1
                        result.crawlerData.currPage = page + 1
                        chrome.storage.local.set({ ['crawlerData']: result.crawlerData }, function (result4) {

                           // lock = false;
                           // setTimeout(startDetailScrapping, 3000);

                        chrome.runtime.sendMessage({ command: 'fetchNext-back', page: result.crawlerData.currPage });
                        /*
                        , function (response) {
                            console.log(response);
                            if (response.response === "success") {
                                document.getElementById('message').style.display = "none";
                                //document.getElementById('spacer').style.display="block";
                            }
                        })
                        */


                        });
                    } else {

                        console.log("\n\n\n page items are crawled");
                        console.log(page)
                        console.log(page === 1);
                        console.log(page == 1);

                        postDatatoTheServer(result2['data-' + page]);    
           //             chrome.storage.local.remove(['data-' + page]);
                        result.crawlerData.crawling = false
                        chrome.storage.local.set({ ['crawlerData']: result.crawlerData }, function (result4) {
                        });
                    }
                })
            });
        });
        return false;
    } else if (message.command === 'crawling-content') {
        console.log('called');
        chrome.storage.local.get(['crawlerData'], function (result) {
            page = result.crawlerData.currPage;
            myitem = result.crawlerData.myitem;
            itemsize = result.crawlerData.itemsize;
            sendResponse({ response: result.crawlerData.crawling });
        });
        return true;
    } else if (message.command === 'crawlingDetails-content') {
        console.log('crawlingDetails-content');
        console.log(message);

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];

            console.log(workingTab)

            //chrome.tabs.sendMessage(activeTab.id, { command: 'scrapOrderDetail-pop' });
        });


        sendResponse({ response: crawling });
        return true;



    } else if (message.command === 'setLoginState-content') {
        chrome.storage.local.get(['crawlerData'], function (result) {
            result.crawlerData.state = message.state;
            chrome.storage.local.set({ 'crawlerData': result.crawlerData });
        });
        return false;
    } else {
        sendResponse({ response: "failure", message: "Unknown action" });
    }
});

function postDatatoTheServer(pageData) {

    console.log('postNow');
    console.log(pageData);

    //http://test.3stock.net/all.php', //

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
            body: JSON.stringify({ username: username, password: password, data: pageData })
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(json => {
            console.log(json);
            /*
            crawling = false;
            data = '';
            lock = false;
            crawled = false;
            workingTab = '';
            currentOrderDetailIndex = 0;
            chrome.storage.local.set({ 'crawlerData': { state: false, currentOrderDetailIndex: 0, workingTab: '', crawling: false, page: 1, jobType: 1 } });
            */
            return json;
        })
}

chrome.runtime.onStartup.addListener(function () {
    //chrome.storage.local.clear();
    console.log('Chrome extension is started');
})
