/* global chrome */

var modal = document.getElementById("myModal");

window.addEventListener("load", function () {
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
        let glMarketGroupContainer = document.getElementsByClassName('gl-MarketGroupContainer');

        for (var i = glMarketGroupContainer.length - 1; i >= 0; i--) {
            let rclParticipantFixtureDetails = glMarketGroupContainer[i].getElementsByClassName('rcl-ParticipantFixtureDetails');
            if (rclParticipantFixtureDetails.length > 0) {
                let glParticipantGeneral = glMarketGroupContainer[i].getElementsByClassName('gl-Participant_General');
                for (var j = glParticipantGeneral.length - 1; j >= 0; j--) {
                    glParticipantGeneral[j].removeEventListener("click", myFunction);
                    glParticipantGeneral[j].addEventListener("click", myFunction);
                }
            }
        }
    });
    function whichChild(elem) {
        var i = 0;
        while ((elem = elem.previousSibling) != null) ++i;
        return i;
    }
    function myFunction(ev) {
        let use1 = ev.target;
        let use2 = ev.target.parentNode;
        let teams;
        let value;
        let index;
        if (ev.target.childNodes[0].nodeName === '#text') {
            index = whichChild(use2);
            teams = use2.parentNode.parentNode.parentNode.getElementsByClassName("sgl-MarketFixtureDetailsLabelExpand3")[0].childNodes;
            value = ev.target.innerText
        } else {
            index = whichChild(use1);
            teams = use1.parentNode.parentNode.parentNode.getElementsByClassName("sgl-MarketFixtureDetailsLabelExpand3")[0].childNodes;
            value = ev.target.childNodes[0].innerText
        }
        if (teams.length > 0) {
            let teamString = "";
            let teamsOgInterest = teams[index].getElementsByClassName("rcl-ParticipantFixtureDetails_TeamWrapper ")            
            for (var k = 0; k < teamsOgInterest.length; k++) {
                if (teamString === "") {
                    teamString = teamsOgInterest[k].innerText;
                } else {
                    teamString = teamString + ' Vs ' + teamsOgInterest[k].innerText;
                }
            }
            //let msg = teamString + "\n" + value;
            //alert(msg);
            let myModeldiv = document.getElementById('myModal');
            if(myModeldiv){
                document.getElementById('myModalteam').innerText=teamString;
                document.getElementById('myModalvalue').innerText=value;
                myModeldiv.style.display = "block";
            }else{
                myModeldiv = document.createElement('div');
                myModeldiv.setAttribute('id', "myModal");
                myModeldiv.setAttribute('class', "modal");   
                myModeldiv.innerHTML = '<div class="modal-content">'
                        +'<span id="myModalClose" class="close">&times;</span>'
                            +'<p id="myModalteam">'+teamString+'</p>'
                            +'<p id="myModalvalue">'+value+'</p>'
                        +'</div>'
                myModeldiv.style.display = "block";
                document.body.appendChild(myModeldiv);
            }
            document.getElementById('myModalClose').onclick = function(){
                myModeldiv.style.display = "none";
            }

        }
    }
});