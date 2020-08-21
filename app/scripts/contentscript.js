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



        let glParticipant = document.getElementsByClassName('gl-Participant');
        for (var i = 0; i < glParticipant.length; i++) {
            glParticipant[i].removeEventListener('click', mysecondfuncParticipant)
            glParticipant[i].addEventListener('click', mysecondfuncParticipant)
            if (i >= 2) {
                break;
            }
        }
        let srbParticipantLabelCentered = document.getElementsByClassName('srb-ParticipantLabelCentered');
        for (var i = 0; i < srbParticipantLabelCentered.length; i++) {
            srbParticipantLabelCentered[i].removeEventListener('click', mysecondfuncParticipantLabelCentered)
            srbParticipantLabelCentered[i].addEventListener('click', mysecondfuncParticipantLabelCentered)
            if (i >= 0) {
                break;
            }
        }
        /*
        let glMarket = document.getElementsByClassName('gl-Market');
        let glMarketGeneral = document.getElementsByClassName('gl-Market_General');
        let glMarketGeneralcolumnheader = document.getElementsByClassName('gl-Market_General-columnheader');
        */
        let glMarketGeneralpwidth375 = document.getElementsByClassName('gl-Market_General-pwidth37-5');
        for (var i = 0; i < glMarketGeneralpwidth375.length; i++) {
            let containers = glMarketGeneralpwidth375[i].childNodes;
            for (var j = 1; j < containers.length; j++) {
                containers[j].removeEventListener('click', mysecondfunccontainers)
                containers[j].addEventListener('click', mysecondfunccontainers)
                if (j >= 1) {
                    break;
                }
            }
            if (i >= 1) {
                break;
            }
        }
    });
    function mysecondfunccontainers(event) {
        console.log('mysecondfunccontainers');
        secondfunc();
    }
    function mysecondfuncParticipantLabelCentered(event) {
        console.log('mysecondfuncParticipantLabelCentered');
        secondfunc();
    }
    function mysecondfuncParticipant(event) {
        console.log('mysecondfuncParticipant');
        secondfunc();
    }
    function secondfunc() {
        let EventHeader_Label = document.getElementsByClassName('sph-EventHeader_Label');
        console.log(EventHeader_Label.length);
        console.log(EventHeader_Label[0].innerText);
        var html = `
        <div class="popwrapper"><div style="height:34px; background:black"><span id="mysecondModalClose" class="close">&times;</span></div>
            <div class="bss-NormalBetItem bss-NormalBetItem_HasStake ">
                <div class="bss-NormalBetItem_Wrapper ">
                    <div class="bss-NormalBetItem_Content ">
                        <div class="bss-NormalBetItem_ContentWrapper ">
                            <div class="bss-NormalBetItem_Details">
                                <div class="bss-NormalBetItem_TopSection">
                                    <div class="bss-NormalBetItem_TitleAndMarket">
                                        <div class="bss-NormalBetItem_Title " style="">PSG in 90 mins</div>
                                        <div class="bss-NormalBetItem_Market ">Method of Victory</div>
                                    </div>
                                    <div class="bss-NormalBetItem_OddsContainer "><span
                                            class="bsc-OddsDropdownLabel bs-OddsLabel bsc-OddsDropdownLabel-disabled "><span>3.25</span></span>
                                    </div>
                                </div>
                                <div class="bss-NormalBetItem_BottomSection">
                                    <div class="bss-NormalBetItem_FixtureDescription "> ${EventHeader_Label[0].innerText}</div>
                                    <!---->
                                </div>
                                <div class="bss-NormalBetItem_CheckboxContainer"></div>
                            </div>
                            <div class="bss-StakeBox bss-StakeBox_MouseMode bss-StakeBox_HasReturns ">
                                <div class="bss-StakeBox_StakeAndReturn ">
                                    <div class="bss-StakeBox_StakeInput ">
                            
                            
                                    </div>
                                </div>
                                <div class="bss-StakeBox_TotalStake ">
                                    <div class="bss-StakeBox_TotalStake-label ">Stake</div>
                                    <div class="bss-StakeBox_TotalStake-value ">$0.00</div>
                                </div>
                            </div>
                        </div>
                   </div>
                    </div>
                    <div class="bss-PlaceBetButton ">
                        <div class="bss-PlaceBetButton_Wrapper">
                            <div class="bss-PlaceBetButton_TopRow">
                                <div class="bss-PlaceBetButton_Text ">Place Bet</div>
                            </div>
                        </div>
                    </div>
                </div>
    `;
        let mySecondModal = document.getElementById('mySecondModal');
        if (mySecondModal) {
            //document.getElementById('myModalteam').innerText=teamString;
            //document.getElementById('myModalvalue').innerText=value;
            mySecondModal.style.display = "block";
        } else {
            mySecondModal = document.createElement('div');
            mySecondModal.setAttribute('id', "mySecondModal");
            mySecondModal.setAttribute('class', "modal");
            mySecondModal.innerHTML = html;
            mySecondModal.style.display = "block";
            document.body.appendChild(mySecondModal);
        }
        document.getElementById('mysecondModalClose').onclick = function(){
             mySecondModal.style.display = "none";
        }



    }
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
            if (myModeldiv) {
                document.getElementById('myModalteam').innerText = teamString;
                document.getElementById('myModalvalue').innerText = value;
                myModeldiv.style.display = "block";
            } else {
                myModeldiv = document.createElement('div');
                myModeldiv.setAttribute('id', "myModal");
                myModeldiv.setAttribute('class', "modal");
                myModeldiv.innerHTML = '<div class="modal-content">'
                    + '<span id="myModalClose" class="close">&times;</span>'
                    + '<p id="myModalteam">' + teamString + '</p>'
                    + '<p id="myModalvalue">' + value + '</p>'
                    + '</div>'
                myModeldiv.style.display = "block";
                document.body.appendChild(myModeldiv);
            }
            document.getElementById('myModalClose').onclick = function () {
                myModeldiv.style.display = "none";
            }

        }
    }
});