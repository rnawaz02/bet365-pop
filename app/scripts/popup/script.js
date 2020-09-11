/* global chrome */

window.addEventListener("load", function () {
    console.log('loaded');

    document.getElementById('startbutton').addEventListener('click', function (event) {
        chrome.runtime.sendMessage({
            command: 'start-pop', function(response) {
                console.log(response);
                if (response.response === "success") {
                    document.getElementById('message').innerText = response.message;
                    document.getElementById('message').style.color = "red";
                    document.getElementById('message').style.display = "block";
                }
            }
        });
    });
    document.getElementById('stopbutton').addEventListener('click', function (event) {
        chrome.runtime.sendMessage({ command: 'stop-pop' }, function (response) {
            console.log(response);
            if (response.response === "success") {
                document.getElementById('message').innerText = response.message;
                document.getElementById('message').style.color = "red";
                document.getElementById('message').style.display = "block";
            }
        })
    });
    document.getElementById('resetbutton').addEventListener('click', function (event) {
        chrome.runtime.sendMessage({ command: 'reset-pop' }, function (response) {
            console.log(response);
            if (response.response === "success") {
                document.getElementById('message').innerText = response.message;
                document.getElementById('message').style.color = "red";
                document.getElementById('message').style.display = "block";
            }
        })
    });


    document.getElementById('testbcbutton').addEventListener('click', function (event) {
        chrome.runtime.sendMessage({ command: 'testbc-pop' });
    });

    document.getElementById('detailcobutton').addEventListener('click', function (event) {
        console.log('clicked detailcobutton');
        chrome.runtime.sendMessage({ command: 'scrapOrderDetail-pop' });
    
        /*
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { command: 'scrapOrderDetail-pop' });
        });
        */
    });


    document.getElementById('testcobutton').addEventListener('click', function (event) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { command: 'testco-pop' });
        });
    });

    document.getElementById('savebcbutton').addEventListener('click', function (event) {
        console.log('savebcbutton');
        chrome.runtime.sendMessage({ command: 'savebc-pop' });
    });


    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        console.log(message)
        console.log(sender)
        if (message.command === 'completeScrapping-back') {
            console.log('completeScrapping-back');
            if (message.response === "success") {
                //document.getElementById('spacer').style.display="none";
                document.getElementById('message').innerText = message.message;
                document.getElementById('message').style.color = "green";
                document.getElementById('message').style.display = "block";
            } else {
                document.getElementById('message').innerText = message.message;
                document.getElementById('message').style.color = "red";
                document.getElementById('message').style.display = "block";
            }
        } else if (message.command === 'startScrappingResp-back') {
            console.log('startScrappingResp-back');
            if (message.response === "success") {
                //document.getElementById('spacer').style.display="none";
                document.getElementById('message').innerText = message.message;
                document.getElementById('message').style.color = "green";
                document.getElementById('message').style.display = "block";
            } else {
                document.getElementById('message').innerText = message.message;
                document.getElementById('message').style.color = "red";
                document.getElementById('message').style.display = "block";
            }
        }
    });
});