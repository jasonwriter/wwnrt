function initFilteringSelects() {
    require([
        "esri/config",
        "esri/urlUtils",
        "dijit/form/FilteringSelect",
        "dijit/form/CheckBox",
        "dijit/form/RadioButton",
        "dijit/form/Button",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "dojo/store/Memory", "dojo/domReady!"],
            function (esriConfig, urlUtils, FilteringSelect, CheckBox, RadioButton, Button, Query, QueryTask, Memory) {
                //FILL TOWNSHIP RANGE
                var trList = [];
                //soil query
                var myDate = new Date();
                var myMS = myDate.getMilliseconds();
                //query t-r
                var qtTR = new QueryTask(urlPolitical + "/11");
                var qTR = new Query();
                qTR.outFields = ["TWNSHPLAB", "OBJECTID"];
                qTR.returnGeometry = false;
                qTR.where = myMS + " = " + myMS;
                qtTR.execute(qTR, function (resultsTR) {
                    for (var i = 0; i < resultsTR.features.length; i++) {
                        trList.push({tr: resultsTR.features[i].attributes.TWNSHPLAB,
                            oid: resultsTR.features[i].attributes.OBJECTID
                        });
                    }

                    //console.log(ebirdList);
                    var myTRFilteringSelect = new FilteringSelect({
                        id: "myTRSelect",
                        pageSize: 10,
                        style: "width: 100%",
                        store: new Memory({idProperty: "oid", data: trList}),
                        fetchProperties: {sort: [{attribute: "tr"}]},
                        labelAttr: "tr",
                        autoComplete: false,
                        searchAttr: "tr",
                        onChange: function (id) {
                            if(id == ""){
                                
                            }else{
                                zoomTo(id, urlPolitical + "/11");
                            dijit.byId("myCountySelect").reset();
                            dijit.byId("myCitySelect").reset();
                            }
                            
                            //this.reset();
                            //alert(id);

                        }
                    }, document.getElementById("selectTR"));
                });
                
                
                //FILL COUNTY
                var countyList = [];
                //query county
                var qtCounty = new QueryTask(urlPolitical + "/10");
                var qCounty = new Query();
                qCounty.outFields = ["COUNTY", "OBJECTID"];
                qCounty.returnGeometry = false;
                qCounty.where = myMS + " = " + myMS;
                qtCounty.execute(qCounty, function (resultsCounty) {
                    for (var i = 0; i < resultsCounty.features.length; i++) {
                        countyList.push({county: resultsCounty.features[i].attributes.COUNTY,
                            oid: resultsCounty.features[i].attributes.OBJECTID
                        });
                    }

                    //console.log(ebirdList);
                    var myCountyFilteringSelect = new FilteringSelect({
                        id: "myCountySelect",
                        //queryExpr: '*${0}*',
                        style: "width: 100%",
                        pageSize: 10,
                        store: new Memory({idProperty: "oid", data: countyList}),
                        fetchProperties: {sort: [{attribute: "county"}]},
                        labelAttr: "county",
                        autoComplete: false,
                        searchAttr: "county",
                        onChange: function (id) {
                            if(id == ""){
                                
                            }else{
                                zoomTo(id, urlPolitical + "/10");
                            dijit.byId("myTRSelect").reset();
                            dijit.byId("myCitySelect").reset();
                            }
                            
                        }
                    }, document.getElementById("selectCounty"));
                });
                
                
                //FILL CITY
                var cityList = [];
                //query city
                var qtCity = new QueryTask(urlPolitical + "/0");
                var qCity = new Query();
                qCity.outFields = ["City", "OBJECTID"];
                qCity.returnGeometry = false;
                qCity.where = myMS + " = " + myMS;
                qtCity.execute(qCity, function (resultsCity) {
                    for (var i = 0; i < resultsCity.features.length; i++) {
                        cityList.push({city: resultsCity.features[i].attributes.City,
                            oid: resultsCity.features[i].attributes.OBJECTID
                        });
                    }

                    //console.log(ebirdList);
                    var myCityFilteringSelect = new FilteringSelect({
                        id: "myCitySelect",
                        pageSize: 10,
                        style: "width: 100%",
                        store: new Memory({idProperty: "oid", data: cityList}),
                        fetchProperties: {sort: [{attribute: "city"}]},
                        labelAttr: "city",
                        autoComplete: false,
                        searchAttr: "city",
                        onChange: function (id) {
                            if(id == ""){
                                
                            }else{
                                zoomTo(id, urlPolitical + "/0");
                             dijit.byId("myTRSelect").reset();
                            dijit.byId("myCountySelect").reset();
                            }
                            
                            
                        }
                    }, document.getElementById("selectCity"));
                });
                
            });
}
function zoomTo(inOID, inUrl)
{
    require([
        "esri/config",
        "esri/urlUtils",
        "dijit/form/ComboBox",
        "dijit/form/FilteringSelect",
        "dijit/form/CheckBox",
        "dijit/form/RadioButton",
        "dijit/form/Button",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "dojo/store/Memory",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "dojo/on",
        "esri/graphicsUtils",
        "dojo/domReady!"],
        function (esriConfig, urlUtils, ComboBox, FilteringSelect, CheckBox, RadioButton, Button, Query, QueryTask, Memory, SimpleLineSymbol, Color, on, graphicsUtils)
        {
            //clear graphics
            map.graphics.clear();
            
            var myQueryTask = new QueryTask(inUrl);
            var myQuery = new Query();
            myQuery.outFields = ["*"];
            myQuery.returnGeometry = true;
            var myDate = new Date();
            var myMS = myDate.getMilliseconds();
            myQuery.where = "(OBJECTID = " + parseInt(inOID) + ") AND (";
            myQuery.where += myMS + " = " + myMS + ")";
            myQueryTask.execute(myQuery, function queryHandler(results)
            {// Feature is a graphic
                var extent = esri.graphicsExtent(results.features);
                var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
    new Color([255, 255, 0]), 10);

                if (results.features.length == 1) {
                    graphic = results.features[0];
                    graphic.setSymbol(symbol);
                    map.graphics.add(graphic);
                    map.setExtent(extent.expand(1.5), true);
                fadeGraphic();
                }else{
                    for (var i = 0; i < results.features.length; i++) {
                        graphic = results.features[i];
                        graphic.setSymbol(symbol);
                        map.graphics.add(graphic);
                        //newExtent = newExtent.union(results.features[i].geometry.getExtent());
                    }
                    map.graphics.add(graphic);
                    map.setExtent(extent.expand(1.5), true);
                    //flash();
                }
                //var extent = graphicsUtils.graphicsExtent(map.graphics).expand(1.5); 
                //map.setExtent(newExtent.expand(1.5));
//                map.setExtent(extent.expand(1.5), true);
//                fadeGraphic();

               
            });
            
        });
}
function fadeGraphic()
{
    require([
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"
        ],
        function ( SimpleFillSymbol, SimpleLineSymbol, Color)
        {
            
            if (map.graphics.graphics.length > 0) {
                map.graphics.show();
                //setTimeout(function () { graphic.setSymbol(symbol); }, 500);
                setTimeout(function () { map.graphics.hide(); }, 200);
                setTimeout(function () { map.graphics.show(); }, 400);
                setTimeout(function () { map.graphics.hide(); }, 600);
                setTimeout(function () { map.graphics.show(); }, 800);
                setTimeout(function () { map.graphics.clear(); }, 1000);
            }
        });
}
function fadeGraphicOld() {
    var g = map.graphics.graphics[0];
    var fadeArgs = {
        node: g.getDojoShape().getNode(),
        duration: 2000,
    };
    dojo.fadeOut(fadeArgs).play();
}