

function ClearLayers(){
    var political = map.getLayer("political");
    var anthropogenic = map.getLayer("anthropogenic");
    var climate = map.getLayer("climate");
    var bigame = map.getLayer("bigame");
    var geologic = map.getLayer("geologic");
    var landcover = map.getLayer("landcover");
    var waterResources = map.getLayer("waterResources");
    
    var layerArray = new Array();
    
    layerArray[0] = political;
    layerArray[1] = anthropogenic;
    layerArray[2] = climate;
    layerArray[3] = bigame;
    layerArray[4] = geologic;
    layerArray[5] = landcover;
    layerArray[6] = waterResources;
    
    for (var i = 0; i < layerArray.length; i++) {
        
      //set layerInfos visibility to false
        var subLayers1 = layerArray[i].layerInfos;
        //set up visible array to pass to setVisibleLayers
        var visible = [];
        for (var s1 = 0; s1 < subLayers1.length; s1++) {
            subLayers1[s1].visible = false;
            //set array entry to -1 for all
            visible.push(-1);
        }
        
        //set _tocInfos visibility to false and colapse
        var subLayers = layerArray[i]._tocInfos;
        for (var s = 0; s < subLayers.length; s++) {
            subLayers[s].visible = false;
            subLayers[s].collapsed = true;
        }
        layerArray[i].setVisibleLayers(visible);
        layerArray[i].setVisibility(false);
    }
    
    map.graphics.clear();
    
}



function displayMedia(button){
    var top = button.offsetTop;
    var div;
    var btn;
    div = document.getElementById("divLinks");
    div.style.top = top + "px";
    if (div.className === 'start2') {
        div.className = 'final2';
    }
    else {
        div.className = 'start2';
    }
}

function displayMaps(button){
    var top = button.offsetTop;
    var div;
    var btn;
    div = document.getElementById("divLinks2");
    div.style.top = top + "px";
    if (div.className === 'start3') {
        div.className = 'final3';
    }
    else {
        div.className = 'start3';
    }
}

var resizeButton, resizemainDIV;

//function to display boxes when buttons are clicked (one at a time and set pointer and mode to query if My Observations box gets closed
function displayLegend(button){
    
    var user = TheUserInfo.getUserID();
    
    //remove all divs that are open before opening another
    var bottomDiv = document.getElementById("tocDiv");
    
    var div1 = document.getElementById("divTocMyObs");
    var btn1 = document.getElementById("btnMyLayers");
    if (button.id !== btn1.id) {
            div1.className = 'start';
            btn1.className = 'button';
    }
    var div2 = document.getElementById("divTocOthersObs");
    var btn2 = document.getElementById("btnOthersLayers");
    if (button.id !== btn2.id){
      div2.className = 'start';
    btn2.className = 'button';
    }
    var div3 = document.getElementById("divexploreProfData");
    var btn3 = document.getElementById("btnExploreData");
   if (button.id !== btn3.id){
      div3.className = 'start';
    btn3.className = 'button';
    }
    var div4 = document.getElementById("divToc");
    var btn4 = document.getElementById("btnLayers");
    if (button.id !== btn4.id){
      div4.className = 'start';
    btn4.className = 'button';
    }
    var div5 = document.getElementById("divTocMyObsGuest");
    
    if (button.id !== btn1.id) {
            div5.className = 'start';
            btn1.className = 'button';
    }
    
    var top = button.offsetTop;
    var wHeight = window.innerHeight;
    var maxHeight = wHeight - top - 100;
    
    var mainDiv;
    
    var btn;
    switch (button.id) {
        case "btnMyLayers":
            if (button.className === 'start') {
                currentMapTool = "query";
                map.setMapCursor("url(Icons/infoCursor.png),auto");
            }
            if (user === "-1") {
                mainDiv = document.getElementById("divTocMyObsGuest");
            } else {
                mainDiv = document.getElementById("divTocMyObs");
            }
            
            break;
        case "btnOthersLayers":
            mainDiv = document.getElementById("divTocOthersObs");
            currentMapTool = "query";
            map.setMapCursor("url(Icons/infoCursor.png),auto");
            break;
        case "btnExploreData":
            mainDiv = document.getElementById("divexploreProfData");
            currentMapTool = "query";
            map.setMapCursor("url(Icons/infoCursor.png),auto");
            break;
        case "btnLayers":
            currentMapTool = "query";
            map.setMapCursor("url(Icons/infoCursor.png),auto");
            mainDiv = document.getElementById("divToc");
            bottomDiv.style.maxHeight = maxHeight + "px";
    }
    mainDiv.style.top = top + "px";
    if (mainDiv.className === 'start') {
        button.className = 'button2';
        mainDiv.className = 'final';
    }
    else {
        mainDiv.className = 'start';
        button.className = 'button';
    }
    resizemainDIV=mainDiv;
    resizeButton = button;
    
}


//responsive function for slide out menus for @media
function resizeSlideOut() {
    var top = resizeButton.offsetTop;
    var wHeight = window.innerHeight;
    var maxHeight = wHeight - top - 100;
    resizemainDIV.style.top = top + "px";
}

function initEBirdTOC(){
    require(["esri/map", "esri/dijit/Legend", "agsjs/dijit/TOC", "dojo/fx"], function(Map, Legend, TOC){
        //Ebird Stuff
        var myEbird = map.getLayer("ebird");
        myEbird.setVisibility(true);
        tocMyEbird = new TOC({
            map: map,
            //  layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: myEbird,
                    title: "Ebird Observations",
                    collapsed: false,
                    slider: false
                }]
        }, 'tocEbirdDiv');
        tocMyEbird.startup();
  
    });
}

function initTOC() {
    require(["esri/map", "esri/dijit/Legend", "agsjs/dijit/TOC", "dojo/fx"], function (Map, Legend, TOC) {
        //Ebird Stuff
        var myEbird = map.getLayer("ebird");
        myEbird.setVisibility(true);
        //myEbird.setVisibleLayers([0]);
        tocMyEbird = new TOC({
            map: map,
            //  layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: myEbird,
                    title: "",
                }]
        }, 'tocEbirdDiv');
        tocMyEbird.startup();

        //set opacity on wyndd obs data
        initWynddSlider();
        var myObs = map.getLayer("wynddObsLayer");
        myObs.setOpacity(0.5);

        // overwrite the default visibility of service.
        var myData = map.getLayer("myData");
        var othersData = map.getLayer("othersData");
        var political = map.getLayer("political");
        var anthropogenic = map.getLayer("anthropogenic");
        var climate = map.getLayer("climate");
        var bigame = map.getLayer("bigame");
        var geologic = map.getLayer("geologic");
        var landcover = map.getLayer("landcover");
        var waterResources = map.getLayer("waterResources");

        myData.setVisibleLayers([0, 2]);
        othersData.setVisibleLayers([0, 2]);

        myData.setVisibleLayers([0, 2]);
        othersData.setVisibleLayers([0, 2]);
        political.setVisibility(true);
        anthropogenic.setVisibility(true);
        climate.setVisibility(true);
        bigame.setVisibility(true);
        geologic.setVisibility(true);
        landcover.setVisibility(true);
        waterResources.setVisibility(true);

        //set layer opacity
        political.setOpacity(0.5);
        anthropogenic.setOpacity(0.5);
        climate.setOpacity(0.5);
        bigame.setOpacity(0.5);
        geologic.setOpacity(0.5);
        landcover.setOpacity(0.5);
        waterResources.setOpacity(0.5);

        //set opacity slider bar opacity
        political.opacity = 0.50;
        anthropogenic.opacity = 0.50;
        climate.opacity = 0.50;
        bigame.opacity = 0.50;
        geologic.opacity = 0.50;
        landcover.opacity = 0.50;
        waterResources.opacity = 0.50;

        // TOC will honor the overwritten value.
        toc = new TOC({
            map: map,
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            // layerListUrl: "xml/obs_test_for_dialog.xml",
            layerInfos: [{
                    layer: political,
                    title: "Administrative Boundaries",
                    collapsed: true,
                    slider: true
                }, {
                    layer: anthropogenic,
                    title: "Human Disturbance",
                    collapsed: true,
                    slider: true
                }, {
                    layer: climate,
                    title: "Climate Data",
                    collapsed: true,
                    slider: true
                },
                {
                    layer: bigame,
                    title: "Big Game & Sage-grouse",
                    collapsed: true,
                    slider: true
                }, {
                    layer: geologic,
                    title: "Geology & Elevation",
                    collapsed: true,
                    slider: true
                },
                {
                    layer: landcover,
                    title: "Vegetation",
                    collapsed: true,
                    slider: true
                }, {
                    layer: waterResources,
                    title: "Water",
                    collapsed: true,
                    slider: true
                }]
        }, 'tocDiv');
        toc.startup();

        tocMyObs = new TOC({
            map: map,
            //  layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: myData,
                    title: "Show My Observations",
                    collapsed: false
                }]
        }, 'tocMyObsDiv');
        tocMyObs.startup();

        tocMyObsGuest = new TOC({
            map: map,
            //  layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: myData,
                    title: "Show My Observations",
                    collapsed: false
                }]
        }, 'tocMyObsDivGuest');
        tocMyObsGuest.startup();

        tocOthersObs = new TOC({
            map: map,
            // layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: othersData,
                    title: "Everyone's Observations",
                    collapsed: false
                }]
        }, 'tocOthersObsDiv');
        tocOthersObs.startup();
    });
}
//build toc for wyndd data onchange of species
function initWynddTOC(){
    require(["esri/map", "esri/dijit/Legend", "agsjs/dijit/TOC", "dojo/fx"], function(Map, Legend, TOC){
    
        // overwrite the default visibility of service.
        //wyndd data
        var myObs = map.getLayer("wynddObsLayer");
        var myDist = map.getLayer("wynddDisLayer");
        var myRange = map.getLayer("wynddRngLayer");
        
        //set layer opacity
        myObs.setOpacity(0.5);
        myDist.setOpacity(0.5);
        myRange.setOpacity(0.5);
       
        
         //set opacity slider bar opacity
        myObs.opacity=0.50;
        myDist.opacity=0.50;
        myRange.opacity=0.50;
      
        
        // TOC will honor the overwritten value.
        tocMyWyndd = new TOC({
            map: map,
            //  layerListUrl: "xml/obs_test_for_dialog.xml",
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            layerInfos: [{
                    layer: myObs,
                    title: "Observations",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myDist,
                    title: "Modeled Distribution",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myRange,
                    title: "Range Maps",
                    collapsed: false,
                    slider: true
                }]
        }, 'wynddLegend');
        tocMyWyndd.startup();

    });
}


function initWynddSlider() {
    require([
        "dojo/dom", // for inserting value in TextBox example
        "dojo/parser", // parser because of TextBox decoration
        "dijit/form/HorizontalSlider",
        "dijit/form/TextBox" // this we only include to make an example with TextBox
    ], function(dom, parser, HorizontalSlider, TextBox) {
        var myObs = map.getLayer("wynddObsLayer");
        var myDist = map.getLayer("wynddDisLayer");
        var myRange = map.getLayer("wynddRngLayer");
        //set layer opacity
        myObs.setOpacity(0.5);
        myDist.setOpacity(0.5);
        myRange.setOpacity(0.5);
        var slider = new HorizontalSlider({
            title: "Adjust transparency",
            name: "slider",
            value: .5,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            style: "width:200px;",
            onChange: function(value) {
                myObs.setOpacity(value);
                myDist.setOpacity(value);
                myRange.setOpacity(value);
                //dom.byId("sliderValue").value = value;
            }
        }, "obsSlider").startup();
    });
}


