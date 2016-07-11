function syncLoop(iterations, process, exit) {
    var index = 0,
            done = false,
            shouldExit = false;
    var loop = {
        next: function () {
            if (done) {
                if (shouldExit && exit) {
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if (index < iterations) {
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
                // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if (exit)
                    exit(); // Call the callback on exit
            }
        },
        iteration: function () {
            return index - 1; // Return the loop number we're on
        },
        break: function (end) {
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
}
var currentIndex;
require([
    "esri/request",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "dojo/Deferred",
    "esri/geometry/scaleUtils",
    "esri/layers/FeatureLayer",
    "dojo/dom",
    "dojo/json",
    "esri/graphic",
    "dojo/on",
    "dojo/sniff",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
],
        function (request, SimpleLineSymbol, SimpleFillSymbol, Color, Deferred, scaleUtils, FeatureLayer, dom, JSON, Graphic, on, sniff, arrayUtils, lang) {
            var portalUrl = "http://www.arcgis.com";
            on(dom.byId("uploadForm"), "change", function (event) {
                 
                var fileName = event.target.value.toLowerCase();
                if (sniff("ie")) { //filename is full path in IE so extract the file name
                    var arr = fileName.split("\\");
                    fileName = arr[arr.length - 1];
                }
                if (fileName.indexOf(".zip") !== -1) {//is file a zip - if not notify user
                    generateFeatureCollection(fileName);
                }
                else {
                    alert('Shapefile must be added as .zip file');
                }
            });


            function generateFeatureCollection(fileName) {
                
               
               
                
                var name = fileName.split(".");
                //Chrome and IE add c:\fakepath to the value - we need to remove it
                //See this link for more info: http://davidwalsh.name/fakepath
                name = name[0].replace("c:\\fakepath\\", "");
                showLoading();
                //dom.byId('upload-status').innerHTML = '<b>Loading </b>' + name;

                //Define the input params for generate see the rest doc for details
                //http://www.arcgis.com/apidocs/rest/index.html?generate.html
                var params = {
                    'name': name,
                    'targetSR': map.spatialReference,
                    'maxRecordCount': 1000,
                    'enforceInputFileSizeLimit': true,
                    'enforceOutputJsonSizeLimit': true
                };

                //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters
                //This should work well when using web mercator.
                var extent = scaleUtils.getExtentForScale(map, 40000);
                var resolution = extent.getWidth() / map.width;
                params.generalize = true;
                params.maxAllowableOffset = resolution;
                params.reducePrecision = true;
                params.numberOfDigitsAfterDecimal = 0;

                var myContent = {
                    'filetype': 'shapefile',
                    'publishParameters': JSON.stringify(params),
                    'f': 'json',
                    'callback.html': 'textarea'
                };

                //use the rest generate operation to generate a feature collection from the zipped shapefile
                request({
                    url: portalUrl + '/sharing/rest/content/features/generate',
                    content: myContent,
                    form: dom.byId('uploadForm'),
                    handleAs: 'json',
                    load: lang.hitch(this, function (response) {
                        if (response.error) {
                            errorHandler(response.error);
                            return;
                        }
                        var layerName = response.featureCollection.layers[0].layerDefinition.name;
                        //dom.byId('upload-status').innerHTML = '<b>Loaded: </b>' + layerName;
                        addShapefileToMap(response.featureCollection);
                    }),
                    error: lang.hitch(this, errorHandler)
                });
            }

            function errorHandler(error) {
                alert('Error occured - Message = ' + error.message);
                // dom.byId('upload-status').innerHTML = "<p style='color:red'>" + error.message + "</p>";

            }
            function addShapefileToMap(featureCollection) {
                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 4), new Color([255, 255, 0, 0.25]));
                //var editsArr = [];
                arrayUtils.forEach(featureCollection.layers, function (layer) {
                    var featureLayer = new FeatureLayer(layer, {});
                    var fullExtent = featureLayer.fullExtent;
                    map.setExtent(fullExtent.expand(1.25), true);
                    
                   if (typeof myEditor == "undefined" || myEditor.editToolbar == null){
                        switchEdit();
                    }
                    //switchEdit();
                    function saveGeometry() {
                         var newAtt = {
                            ProjectName: 'Enter Project Name!!',
                            Username:  uName,
                            UserID: uID
                        };
                        
                        var newGraphic = new Graphic(featureLayer.graphics[0].geometry, null, newAtt);
                        projectsFL.applyEdits([newGraphic], null, null, function (r) {
                            console.log(r);
                        });
                    }
                    setTimeout(saveGeometry, 1000);
 


//                    arrayUtils.forEach(featureLayer.graphics, function (feature) {
//                        var newGraphic = new Graphic(feature.geometry, null, null);
//                        projectsFL.applyEdits([newGraphic], null, null, function (r) {
//                    //map.graphics.clear();
//                });
                       
                       // dijit.byId("diaProjectAtt").show();

//                        on(dom.byId("btnSaveProject"), "click", function (event) {
//                            var newAttr = {
//                                ProjectName: document.getElementById("inProjectName").value,
//                                Date: document.getElementById("inProjectDate").value,
//                                ProjectSponsor: document.getElementById("inProjectSponsor").value,
//                                ProjectDistrict: document.getElementById("inProjectDistrict").value,
//                                Username: uName,
//                                UserID: uID
//                            };
//                            var newGraphic = new Graphic(feature.geometry, null, newAttr);
//                            projectsFL.applyEdits([newGraphic], null, null, function (r) {
//                                map.graphics.clear();
//                            });
//
//                        });
                 

                });

                

                //map.getLayer("projectsFL").refresh();
                //hide upload div
                document.getElementById("uploadForm").style.display = 'none';
            }
            function addShapefileToMap1(featureCollection) {
                arrayUtils.forEach(featureCollection.layers, function (layer) {
                    var featureLayer = new FeatureLayer(layer, {});
                    var fullExtent = featureLayer.fullExtent;
                    map.setExtent(fullExtent.expand(1.25), true);

                    arrayUtils.forEach(featureLayer.graphics, function (feature) {
                        var newAttr = {
                            ProjectName: feature.attributes.ProjectNam,
                            Date: feature.attributes.Date,
                            ProjectSponsor: feature.attributes.ProjectSpo,
                            ProjectDistrict: feature.attributes.ProjectDis,
                            Username: uName,
                            UserID: uID
                        };
                        var newGraphic = new Graphic(feature.geometry, null, newAttr);
                        projectsFL.applyEdits([newGraphic], null, null, function (r) {
                        });


                    });
                });
                map.getLayer("projectsFL").refresh();
                //hide upload div
                document.getElementById("uploadForm").style.display = 'none';
            }



         
            
            
            
        });