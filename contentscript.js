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
        /*
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
        */
        /*
        
                let glParticipant = document.getElementsByClassName('gl-Participant');
                for (var i = 0; i < glParticipant.length; i++) {
                    glParticipant[i].removeEventListener('click', mysecondfuncParticipant)
                    glParticipant[i].addEventListener('click', mysecondfuncParticipant)
                    //if (i >= 2) {
                    //    break;
                    //}
                }
                let srbParticipantLabelCentered = document.getElementsByClassName('srb-ParticipantLabelCentered');
                for (var i = 0; i < srbParticipantLabelCentered.length; i++) {
                    srbParticipantLabelCentered[i].removeEventListener('click', mysecondfuncParticipantLabelCentered)
                    srbParticipantLabelCentered[i].addEventListener('click', mysecondfuncParticipantLabelCentered)
                    //if (i >= 0) {
                    //    break;
                    //}
                }
                let glMarketGeneralpwidth375 = document.getElementsByClassName('gl-Market_General-pwidth37-5');
                for (var i = 0; i < glMarketGeneralpwidth375.length; i++) {
                    let containers = glMarketGeneralpwidth375[i].childNodes;
                    for (var j = 1; j < containers.length; j++) {
                        containers[j].removeEventListener('click', mysecondfunccontainers)
                        containers[j].addEventListener('click', mysecondfunccontainers)
                      //  if (j >= 1) {
                      //      break;
                      //  }
                    }
                    //if (i >= 1) {
                    //    break;
                    //}
                }
        */
        let glMarketGroup = document.getElementsByClassName('gl-MarketGroup');
        for (var i = 0; i < glMarketGroup.length; i++) {
            //if (glMarketGroup[i].getElementsByClassName('gl-MarketGroupButton_Text').length > 0) {
            //console.log( glMarketGroup[i].getElementsByClassName('gl-MarketGroupButton_Text')[0].innerText);
            //}

            let container = glMarketGroup[i].getElementsByClassName('gl-MarketGroupContainer');
            for (var j = 0; j < container.length; j++) {
                let nodes = container[j].childNodes;
                for (var k = 0; k < nodes.length; k++) {
                    if (nodes[k].getElementsByClassName('srb-ParticipantLabelCentered').length === 0) {
                        let grandChlds = nodes[k].childNodes;
                        for (var l = 0; l < grandChlds.length; l++) {
                            if (grandChlds[l].classList && !(grandChlds[l].classList.contains('gl-MarketColumnHeader'))) {

                                // !(grandChlds[l].classList.contains('srb-ParticipantLabelCentered'))    
                                grandChlds[l].removeEventListener('click', mynewfunc)
                                grandChlds[l].addEventListener('click', mynewfunc)
                            }

                        }
                    }
                }
            }
        }
    });
    function getPathTo(element) {
        if (element.tagName == 'HTML')
            return '/HTML[1]';
        if (element===document.body)
            return '/HTML[1]/BODY[1]';
    
        var ix= 0;
        var siblings= element.parentNode.childNodes;
        for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            if (sibling===element)
                return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
            if (sibling.nodeType===1 && sibling.tagName===element.tagName)
                ix++;
        }
    }
    function mynewfunc(event) {
        let EventHeader_Label = document.getElementsByClassName('sph-EventHeader_Label');
        let use1 = event.target;
        let use2 = event.target.parentNode;
        let eventRealTarget;
        let top;
        let left;
        let box1;
        let odd;
        let marketText;
        let index;
        if (event.target.childNodes[0].nodeName === '#text') {
            eventRealTarget = use2;
        } else {
            eventRealTarget = use1;
        }
        index = whichChild(eventRealTarget);
        console.log(eventRealTarget);

        if (eventRealTarget.childNodes.length === 2) {
            box1 = eventRealTarget.childNodes[0].innerText
            odd = eventRealTarget.childNodes[1].innerText
        } else if (eventRealTarget.childNodes.length === 1) {
            odd = eventRealTarget.childNodes[0].innerText
        }
        try {
            top = eventRealTarget.parentNode.getElementsByClassName('gl-MarketColumnHeader')[0].innerText
        }
        catch (err) {
        }
         try {
            left = eventRealTarget.parentNode.parentNode.getElementsByClassName('srb-ParticipantLabelCentered')[index-1].childNodes[0].innerText
        }
        catch (err) {
        }

        if(left === undefined){
            try {
                left = eventRealTarget.parentNode.parentNode.getElementsByClassName('srb-ParticipantLabel')[index-1].childNodes[0].innerText
            }
            catch (err) {
            }
        }


        try {
            marketText = eventRealTarget.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('gl-MarketGroupButton')[0].childNodes[0].innerText
        }
        catch (err) {
        }
        if(marketText === undefined){
            try {
                marketText = eventRealTarget.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('sc-EnhancedMarketGroupButton')[0].childNodes[0].innerText
            }
            catch (err) {
            }
        }


        console.log(odd);
        console.log(box1);
        console.log(top);
        console.log(left);


        if (marketText) {
            console.log(marketText);
            var html;         
          
           if(box1 !== undefined && top === undefined && left === undefined){
            html = `
            <div class="popwrapper"><div style="height:34px; background:black"><span id="mysecondModalClose" class="close">X</span></div>
                <div class="bss-NormalBetItem bss-NormalBetItem_HasStake ">
                    <div class="bss-NormalBetItem_Wrapper ">
                        <div class="bss-NormalBetItem_Content ">
                            <div class="bss-NormalBetItem_ContentWrapper ">
                                <div class="bss-NormalBetItem_Details">
                                    <div class="bss-NormalBetItem_TopSection">
                                        <div class="bss-NormalBetItem_TitleAndMarket">
                                            <div class="bss-NormalBetItem_Title " style="">${box1}</div>
                                            <div class="bss-NormalBetItem_Market ">${marketText}</div>
                                        </div>
                                        <div class="bss-NormalBetItem_OddsContainer "><span
                                                class="bsc-OddsDropdownLabel bs-OddsLabel bsc-OddsDropdownLabel-disabled "><span>${odd}</span></span>
                                        </div>
                                    </div>
                                    <div class="bss-NormalBetItem_BottomSection">
                                        <div class="bss-NormalBetItem_FixtureDescription "> ${EventHeader_Label[0].innerText}</div>
                                        <!---->
                                    </div>
                                </div>
                                <div class="bss-StakeBox bss-StakeBox_MouseMode ">
                                <div class="bss-StakeBox_StakeAndReturn ">
                                    <div class="bss-StakeBox_StakeInput bss-StakeBox_StakeInput-focused " style="padding:3px 3px 5px 3px">
                                        <input class="" type="text" size="12">
                                    </div>
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
    }else if((box1 === undefined && top !== undefined && left !== undefined) && (marketText === 'Goalscorers' || marketText === 'Multi Scorers' )){
       
        html = `
        <div class="popwrapper"><div style="height:34px; background:black"><span id="mysecondModalClose" class="close">X</span></div>
            <div class="bss-NormalBetItem bss-NormalBetItem_HasStake ">
                <div class="bss-NormalBetItem_Wrapper ">
                    <div class="bss-NormalBetItem_Content ">
                        <div class="bss-NormalBetItem_ContentWrapper ">
                            <div class="bss-NormalBetItem_Details">
                                <div class="bss-NormalBetItem_TopSection">
                                    <div class="bss-NormalBetItem_TitleAndMarket">
                                        <div class="bss-NormalBetItem_Title " style="">${left}</div>
                                        <div class="bss-NormalBetItem_Market ">${top}  ${marketText.substring(0, marketText.length - 1)}</div>
                                    </div>
                                    <div class="bss-NormalBetItem_OddsContainer "><span
                                            class="bsc-OddsDropdownLabel bs-OddsLabel bsc-OddsDropdownLabel-disabled "><span>${odd}</span></span>
                                    </div>
                                </div>
                                <div class="bss-NormalBetItem_BottomSection">
                                    <div class="bss-NormalBetItem_FixtureDescription ">${EventHeader_Label[0].innerText}</div>
                                    <!---->
                                </div>
                            </div>
                            <div class="bss-StakeBox bss-StakeBox_MouseMode ">
                            <div class="bss-StakeBox_StakeAndReturn ">
                                <div class="bss-StakeBox_StakeInput bss-StakeBox_StakeInput-focused " style="padding:3px 3px 5px 3px">
                                    <input class="" type="text" size="12">
                                </div>
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
    }else if(box1 === undefined && top !== undefined && left !== undefined){
                html = `
            <div class="popwrapper"><div style="height:34px; background:black"><span id="mysecondModalClose" class="close">X</span></div>
                <div class="bss-NormalBetItem bss-NormalBetItem_HasStake ">
                    <div class="bss-NormalBetItem_Wrapper ">
                        <div class="bss-NormalBetItem_Content ">
                            <div class="bss-NormalBetItem_ContentWrapper ">
                                <div class="bss-NormalBetItem_Details">
                                    <div class="bss-NormalBetItem_TopSection">
                                        <div class="bss-NormalBetItem_TitleAndMarket">
                                            <div class="bss-NormalBetItem_Title " style="">${top} in ${left}</div>
                                            <div class="bss-NormalBetItem_Market ">${marketText}</div>
                                        </div>
                                        <div class="bss-NormalBetItem_OddsContainer "><span
                                                class="bsc-OddsDropdownLabel bs-OddsLabel bsc-OddsDropdownLabel-disabled "><span>${odd}</span></span>
                                        </div>
                                    </div>
                                    <div class="bss-NormalBetItem_BottomSection">
                                        <div class="bss-NormalBetItem_FixtureDescription "> ${EventHeader_Label[0].innerText}</div>
                                        <!---->
                                    </div>
                                </div>
                                <div class="bss-StakeBox bss-StakeBox_MouseMode ">
                                <div class="bss-StakeBox_StakeAndReturn ">
                                    <div class="bss-StakeBox_StakeInput bss-StakeBox_StakeInput-focused " style="padding:3px 3px 5px 3px">
                                        <input class="" type="text" size="12">
                                    </div>
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

         }else if(box1 !== undefined && top !== undefined && left === undefined){
       
                html = `
                <div class="popwrapper"><div style="height:34px; background:black"><span id="mysecondModalClose" class="close">X</span></div>
                    <div class="bss-NormalBetItem bss-NormalBetItem_HasStake ">
                        <div class="bss-NormalBetItem_Wrapper ">
                            <div class="bss-NormalBetItem_Content ">
                                <div class="bss-NormalBetItem_ContentWrapper ">
                                    <div class="bss-NormalBetItem_Details">
                                        <div class="bss-NormalBetItem_TopSection">
                                            <div class="bss-NormalBetItem_TitleAndMarket">
                                                <div class="bss-NormalBetItem_Title " style="">${top} in ${box1}</div>
                                                <div class="bss-NormalBetItem_Market ">${marketText}</div>
                                            </div>
                                            <div class="bss-NormalBetItem_OddsContainer "><span
                                                    class="bsc-OddsDropdownLabel bs-OddsLabel bsc-OddsDropdownLabel-disabled "><span>${odd}</span></span>
                                            </div>
                                        </div>
                                        <div class="bss-NormalBetItem_BottomSection">
                                            <div class="bss-NormalBetItem_FixtureDescription "> ${EventHeader_Label[0].innerText}</div>
                                            <!---->
                                        </div>
                                    </div>
                                    <div class="bss-StakeBox bss-StakeBox_MouseMode ">
                                    <div class="bss-StakeBox_StakeAndReturn ">
                                        <div class="bss-StakeBox_StakeInput bss-StakeBox_StakeInput-focused " style="padding:3px 3px 5px 3px">
                                            <input class="" type="text" size="12">
                                        </div>
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

            }else if(marketText === 'Correct Score'){


            }else{
                console.log('not done');
            }
            let mySecondModal = document.getElementById('mySecondModal');
            if (mySecondModal) {
                mySecondModal.parentNode.removeChild(mySecondModal);
            }

         //   console.log(document.querySelector('body > div:nth-child(1) > div > div.wc-PageView > div.wc-PageView_Main > div > div.wcl-CommonElementStyle_PrematchCenter > div.cm-CouponModule > div > div:nth-child(4) > div.gl-MarketGroup_Wrapper > div > div > div:nth-child(3)').wrapper.stem);


            if(html){
                mySecondModal = document.createElement('div');
                mySecondModal.setAttribute('id', "mySecondModal");
                mySecondModal.setAttribute('class', "modal");
                mySecondModal.innerHTML = html;
                mySecondModal.style.display = "block";
                document.body.appendChild(mySecondModal);
                document.getElementById('mysecondModalClose').onclick = function () {
                    mySecondModal.style.display = "none";
                }
            }
        }
    }
    function mysecondfunccontainers(event) {
        console.log('mysecondfunccontainers');
        secondfunc(event, 'mysecondfunccontainers');
    }
    function mysecondfuncParticipantLabelCentered(event) {
        console.log('mysecondfuncParticipantLabelCentered');
        secondfunc(event, 'mysecondfuncParticipantLabelCentered');
    }
    function mysecondfuncParticipant(event) {
        console.log('mysecondfuncParticipant');
        secondfunc(event, 'mysecondfuncParticipant');
    }
    function secondfunc(event, source) {
        console.log(event.target);

        let EventHeader_Label = document.getElementsByClassName('sph-EventHeader_Label');

        console.log(event.target);

        let use1 = event.target;
        let use2 = event.target.parentNode;
        let eventRealTarget;
        //let teams;
        //let value;
        let box1;
        let box2;
        let index;
        if (event.target.childNodes[0].nodeName === '#text') {
            index = whichChild(use2);
            eventRealTarget = use2;
            //teams = use2.parentNode.parentNode.parentNode.getElementsByClassName("sgl-MarketFixtureDetailsLabelExpand3")[0].childNodes;
            //value = ev.target.innerText
        } else {
            index = whichChild(use1);
            eventRealTarget = use1;
            //teams = use1.parentNode.parentNode.parentNode.getElementsByClassName("sgl-MarketFixtureDetailsLabelExpand3")[0].childNodes;
            //value = ev.target.childNodes[0].innerText
        }
        console.log(eventRealTarget);
        box1 = eventRealTarget.childNodes[0].innerText
        box2 = eventRealTarget.childNodes[1].innerText

        console.log(box1);
        console.log(box2);

        //console.log(EventHeader_Label[0].innerText);
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