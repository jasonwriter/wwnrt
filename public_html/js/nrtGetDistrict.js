
function getDistrict(inPoint, cb){


    require(["esri/config", "esri/urlUtils", "dijit/form/FilteringSelect", "dijit/form/CheckBox", 
    "dijit/form/RadioButton", "dijit/form/Button", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/store/Memory", 
    "dojo/domReady!"], function(esriConfig, urlUtils, FilteringSelect, CheckBox, RadioButton, Button, Query, QueryTask, Memory){
    
    
    
                var queryTaskDist = new QueryTask(urlDistricts + "0");
                var queryDist = new Query();
                queryDist.returnGeometry = false;
                queryDist.outFields = ["*"];
                queryDist.outSpatialReference = inPoint.spatialReference;
                queryDist.geometry = inPoint;
                queryDist.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
                queryTaskDist.execute(queryDist, function (results) {
                    if (results.features.length > 0) {
                        cb(results);
                       //console.log(results);
                    } else {//inPoint is outside wyoming alert
                        alert("Nope.");
                    }
                });

    }); //end require
} //end of function

