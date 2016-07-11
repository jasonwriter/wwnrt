//Layers url
var urlTR = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/BaseServices/PLSS/MapServer/0";
var urlDistricts = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/wwnrt/DistrictsMap/MapServer/";
var urlPolitical = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/WyoBio/WyoBio_Admin_and_Political_Bnds_103/MapServer";
var urlProjects = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/wwnrt/WWNRTProjects/MapServer/";
var urlProjectsFS = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/wwnrt/WWNRTProjects/FeatureServer/2";
var urlProjectsFS_Line = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/wwnrt/WWNRTProjects/FeatureServer/1";
var urlProjectsFS_Point = "https://wygiscservices-dev.wygisc.org/arcgis/rest/services/wwnrt/WWNRTProjects/FeatureServer/0";
var urlGeomService = "http://wygiscservices.wygisc.org/arcgis/rest/services/Utilities/Geometry/GeometryServer";
//Layers
var political, districts, plss, projects, projectsFL, projectsFL_Points, projectsFL_Lines;

var toc;
function addLayers() {
    require([
        "esri/layers/FeatureLayer", 
        "esri/tasks/QueryTask",
        "esri/tasks/query",
        "dojo/on",  
        "esri/dijit/PopupTemplate",
        "esri/layers/ArcGISDynamicMapServiceLayer"], function (FeatureLayer, QueryTask, Query, on, PopupTemplate, ArcGISDynamicMapServiceLayer) {
        //Add ArcGISDynamicMapServiceLayer Services Base Layers
        political = new ArcGISDynamicMapServiceLayer(urlPolitical, {});
        political.id = "political";

        districts = new ArcGISDynamicMapServiceLayer(urlDistricts, {});
        districts.id = "districts";
        //define the info template that is used to display the popup content. 

        popupTemplate = new PopupTemplate({
            
            //title: "{ProjectName}",
            fieldInfos: [
                {fieldName: "ProjectName", visible: true, label: "Project_Name: "},
                {fieldName: "ProjectDistrict", visible: true, label: "Project_District: "},
                {fieldName: "Date", visible: true, label: "Date: ", format: {dateFormat: "shortDate"}},
                {fieldName: "ProjectSponsor", visible: true, label: "Project_Sponsor: "},
                {fieldName: "Username", visible: true, label: "User_Name: "},
                {fieldName: "Description", visible: true, label: "Description: "},
                {fieldName: "ProjectCost", visible: true, label: "Project_Cost: "},
                {fieldName: "wwnrtFunding", visible: true, label: "WWNRT_Funding: "},
                {fieldName: "YearFunded", visible: true, label: "Year_Funded: ", format: {dateFormat: "year"}}
            ],
            mediaInfos: [{
                    "title": "",
                    "caption": "",
                    "type": "image",
                    "value": {
                        "sourceURL": "",
                        "linkURL": ""
                    }
                }]
        });

//          var buttonNode = domConstruct.toDom('<button type="button" class="button delete-button"></button>');
//    popupTemplate.content.appendChild(buttonNode);
//    var button = new Button({label: "Close" }, buttonNode);

        //create the feature layers Points, Lines, Polygons
        projectsFL_Points = new FeatureLayer(urlProjectsFS_Point, {
            //infoTemplate: popupTemplate,
            outFields: ["ProjectName", "Date", "ProjectSponsor", "ProjectDistrict", "Username", "Description", "ProjectCost", "wwnrtFunding", "YearFunded"]
        });
        projectsFL_Points.id = "projectsFL_Points";

        projectsFL_Lines = new FeatureLayer(urlProjectsFS_Line, {
            infoTemplate: popupTemplate,
            outFields: ["ProjectName", "Date", "ProjectSponsor", "ProjectDistrict", "Username", "Description", "ProjectCost", "wwnrtFunding", "YearFunded"]
        });
        projectsFL_Lines.id = "projectsFL_Lines";

        projectsFL = new FeatureLayer(urlProjectsFS, {
            infoTemplate: popupTemplate,
            outFields: ["ProjectName", "Date", "ProjectSponsor", "ProjectDistrict", "Username", "Description", "ProjectCost", "wwnrtFunding", "YearFunded"]
        });
        projectsFL.id = "projectsFL";
        
        
        on(projectsFL_Points, "click", function (response) {
             OID = response.graphic.attributes.OBJECTID;
             projectsFL_Points.queryAttachmentInfos(OID);
         });
        on(projectsFL_Points, "query-attachment-infos-complete", function (response) {
            if (typeof myEditor == "undefined" || myEditor == null) {
                var imageUrl;
                if (response.results.length > 0) {
                    imageUrl = response.results[0].url;
                } else {
                    imageUrl = "Images/noImage.jpg";
                }
                var content;
                //query for attributes from oid
                var myQueryTask = new QueryTask(urlProjectsFS_Point);
                var myQuery = new Query();
                myQuery.outFields = ["*"];
                myQuery.returnGeometry = false;
                var myDate = new Date();
                var myMS = myDate.getMilliseconds();
                myQuery.where = "(OBJECTID = " + response.results[0].objectId + ") AND (";
                myQuery.where += myMS + " = " + myMS + ")";
                myQueryTask.execute(myQuery, function (results) {
                    myDialog.set("title", results.features[0].attributes.ProjectName);
                    var pd = new Date(results.features[0].attributes.Date);
                    var pDate = pd.getDate() + "-" + (pd.getMonth() + 1) + "-" + pd.getFullYear();

                    var fd = new Date(results.features[0].attributes.YearFunded);
                    var fDate = fd.getFullYear();
                    //console.log(results.features[0].attributes);

                    content = "<table>\n\
                    <tr><td><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></td></tr>\n\
                    <tr><td><b>Project Date: </b><i>" + pDate + "</i></td></tr>\n\
                    <tr><td><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></td></tr>\n\
                    <tr><td><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></td></tr>\n\
                    <tr><td><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></td></tr>\n\
                    <tr><td><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></td></tr>\n\
                   <tr><td><b>Year Funded: </b><i>" + fDate + "</td>\n\
                    </tr></table><div><img width='200px'; src='" + imageUrl + "'/></div>";

//                    content = "<ul style='list-style-type:none'>\n\
//                    <li><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></li>\n\
//                    <li><b>Project Date: </b><i>" + pDate + "</i></li>\n\
//                    <li><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></li>\n\
//                    <li><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></li>\n\
//                    <li><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></li>\n\
//                    <li><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></li>\n\
//                    <li><b>Year Funded: </b><i>" + fDate + "</li>\n\
//                    </ul><div><img width='200px'; src='" + imageUrl + "'/></div>";

                    myDialog.set("content", content);



                    myDialog.show();

                });
            }

        });
 
            
            
            //if (typeof myEditor == "undefined" || myEditor.editToolbar == null) {
                //map.setInfoWindowOnClick(false);
//                map.infoWindow.setFeatures([response.graphic]);  
//      map.infoWindow.show(response.screenPoint, map.getInfoWindowAnchor(response.screenPoint));  
               
                
            //}

      //  });
        
        
        on(projectsFL_Lines, "click", function(response){  
            //if (typeof myEditor == "undefined" || myEditor.editToolbar == null) {
                 //map.setInfoWindowOnClick(false);
//                  map.infoWindow.setFeatures([response.graphic]);  
//      map.infoWindow.show(response.screenPoint, map.getInfoWindowAnchor(response.screenPoint));  
                OID = (response.graphic.attributes.OBJECTID);
                projectsFL_Lines.queryAttachmentInfos(OID);
                
            //}
        });    
        on(projectsFL_Lines, "query-attachment-infos-complete", function (response) {
            
              if (typeof myEditor == "undefined" || myEditor == null) {
                var imageUrl;
                if (response.results.length > 0) {
                    imageUrl = response.results[0].url;
                } else {
                    imageUrl = "Images/noImage.jpg";
                }
                var content;
                //query for attributes from oid
                var myQueryTask = new QueryTask(urlProjectsFS_Line);
                var myQuery = new Query();
                myQuery.outFields = ["*"];
                myQuery.returnGeometry = false;
                var myDate = new Date();
                var myMS = myDate.getMilliseconds();
                myQuery.where = "(OBJECTID = " + response.results[0].objectId + ") AND (";
                myQuery.where += myMS + " = " + myMS + ")";
                myQueryTask.execute(myQuery, function (results) {
                    myDialog.set("title", results.features[0].attributes.ProjectName);
                    var pd = new Date(results.features[0].attributes.Date);
                    var pDate = pd.getDate() + "-" + (pd.getMonth() + 1) + "-" + pd.getFullYear();

                    var fd = new Date(results.features[0].attributes.YearFunded);
                    var fDate = fd.getFullYear();
                    //console.log(results.features[0].attributes);

                    content = "<table>\n\
                    <tr><td><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></td></tr>\n\
                    <tr><td><b>Project Date: </b><i>" + pDate + "</i></td></tr>\n\
                    <tr><td><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></td></tr>\n\
                    <tr><td><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></td></tr>\n\
                    <tr><td><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></td></tr>\n\
                    <tr><td><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></td></tr>\n\
                   <tr><td><b>Year Funded: </b><i>" + fDate + "</td>\n\
                    </tr></table><div><img width='200px'; src='" + imageUrl + "'/></div>";

//                    content = "<ul style='list-style-type:none'>\n\
//                    <li><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></li>\n\
//                    <li><b>Project Date: </b><i>" + pDate + "</i></li>\n\
//                    <li><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></li>\n\
//                    <li><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></li>\n\
//                    <li><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></li>\n\
//                    <li><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></li>\n\
//                    <li><b>Year Funded: </b><i>" + fDate + "</li>\n\
//                    </ul><div><img width='200px'; src='" + imageUrl + "'/></div>";

                    myDialog.set("content", content);



                    myDialog.show();

                });
            }
            
//            var image;
//            if (response.results.length > 0) {
//                image = response.results[0].url;
//            } else {
//                image = "Images/noImage.jpg";
//            }
//
//            popupTemplate.info.mediaInfos[0].value.sourceURL = image;
//            popupTemplate.info.mediaInfos[0].value.linkURL = image;
        });



        on(projectsFL, "click", function(response){  
           //if (typeof myEditor == "undefined" || myEditor.editToolbar == null) {
                //map.setInfoWindowOnClick(false);
//                  map.infoWindow.setFeatures([response.graphic]);  
//      map.infoWindow.show(response.screenPoint, map.getInfoWindowAnchor(response.screenPoint));  
                OID = (response.graphic.attributes.OBJECTID);
                projectsFL.queryAttachmentInfos(OID);
               
            //}
        });     
        on(projectsFL, "query-attachment-infos-complete", function (response) {
            
              if (typeof myEditor == "undefined" || myEditor == null) {
                var imageUrl;
                if (response.results.length > 0) {
                    imageUrl = response.results[0].url;
                } else {
                    imageUrl = "Images/noImage.jpg";
                }
                var content;
                //query for attributes from oid
                var myQueryTask = new QueryTask(urlProjectsFS);
                var myQuery = new Query();
                myQuery.outFields = ["*"];
                myQuery.returnGeometry = false;
                var myDate = new Date();
                var myMS = myDate.getMilliseconds();
                myQuery.where = "(OBJECTID = " + response.results[0].objectId + ") AND (";
                myQuery.where += myMS + " = " + myMS + ")";
                myQueryTask.execute(myQuery, function (results) {
                    myDialog.set("title", results.features[0].attributes.ProjectName);
                    var pd = new Date(results.features[0].attributes.Date);
                    var pDate = pd.getDate() + "-" + (pd.getMonth() + 1) + "-" + pd.getFullYear();

                    var fd = new Date(results.features[0].attributes.YearFunded);
                    var fDate = fd.getFullYear();
                    //console.log(results.features[0].attributes);

                    content = "<table>\n\
                    <tr><td><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></td></tr>\n\
                    <tr><td><b>Project Date: </b><i>" + pDate + "</i></td></tr>\n\
                    <tr><td><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></td></tr>\n\
                    <tr><td><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></td></tr>\n\
                    <tr><td><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></td></tr>\n\
                    <tr><td><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></td></tr>\n\
                   <tr><td><b>Year Funded: </b><i>" + fDate + "</td>\n\
                    </tr></table><div><img width='200px'; src='" + imageUrl + "'/></div>";

//                    content = "<ul style='list-style-type:none'>\n\
//                    <li><b>Project District: </b><i>" + results.features[0].attributes.ProjectDistrict + "</i></li>\n\
//                    <li><b>Project Date: </b><i>" + pDate + "</i></li>\n\
//                    <li><b>User Name: </b>v" + results.features[0].attributes.Username + "</i></li>\n\
//                    <li><b>Description: </b><i>" + results.features[0].attributes.Description + "</i></li>\n\
//                    <li><b>Project Cost: </b><i>" + results.features[0].attributes.ProjectCost + "</i></li>\n\
//                    <li><b>WWNRT Funding: </b><i>" + results.features[0].attributes.wwnrtFunding + "</i></li>\n\
//                    <li><b>Year Funded: </b><i>" + fDate + "</li>\n\
//                    </ul><div><img width='200px'; src='" + imageUrl + "'/></div>";

                    myDialog.set("content", content);



                    myDialog.show();

                });
            }
            
//            var image;
//            if (response.results.length > 0) {
//                image = response.results[0].url;
//            } else {
//                image = "Images/noImage.jpg";
//            }
//
//            popupTemplate.info.mediaInfos[0].value.sourceURL = image;
//            popupTemplate.info.mediaInfos[0].value.linkURL = image;
        });
        
       
         



//        on(projectsFL, 'click', function (e) {
//            if (typeof myEditor === "undefined") {
//                var objectId, el;
//                objectId = e.graphic.attributes[projectsFL.objectIdField];
//                projectsFL.queryAttachmentInfos(objectId, function (infos) {
//                    map.infoWindow.setTitle(objectId);
//                    el = document.createElement('img');
//                    if (!!infos[0].url) {
//                        el.setAttribute('src', infos[0].url);
//                        map.infoWindow.setContent(el);
//                        map.infoWindow.show(e.screenPoint, map.getInfoWindowAnchor(e.screenPoint));
//                        console.log('a');
//                    }
//
//                });
//            }
//        });
       

        map.addLayers([projectsFL_Points, projectsFL_Lines, projectsFL, political, districts]);

    });
}

function initTOC() {
    require(["agsjs/dijit/TOC", "dojo/fx"], function ( TOC) {

        // overwrite the default visibility of service.
        var myProjectsPoints = map.getLayer("projectsFL_Points");
        var myProjectsLines = map.getLayer("projectsFL_Lines");
        var myProjects = map.getLayer("projectsFL");
        var myPolitical = map.getLayer("political");
        var myDistricts = map.getLayer("districts");
        myPolitical.setVisibleLayers([11, 12]);
        //set layer opacity
        myPolitical.setOpacity(0.5);


        //set opacity slider bar opacity
        myPolitical.opacity = 0.50;

        // TOC will honor the overwritten value.
        toc = new TOC({
            map: map,
            //layerListUrl: "xml/wyobio_layer_descriptions.xml",
            // layerListUrl: "xml/obs_test_for_dialog.xml",
            layerInfos: [{
                    layer: myProjectsPoints,
                    title: "WWNRT Projects Points",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myProjectsLines,
                    title: "WWNRT Projects Lines",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myProjects,
                    title: "WWNRT Projects",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myPolitical,
                    title: "Administrative Boundaries",
                    collapsed: false,
                    slider: true
                }, {
                    layer: myDistricts,
                    title: "Districts",
                    collapsed: false,
                    slider: true
                }]
        }, 'divTOC');
        toc.startup();

        toc.on("load", function () {
            toc.findTOCNode(myPolitical, 8).hide();
            toc.findTOCNode(myPolitical, 9).hide();
            toc.findTOCNode(myPolitical, 2).hide();
            toc.findTOCNode(myPolitical, 3).hide();
            toc.findTOCNode(myPolitical, 4).hide();
            toc.findTOCNode(myPolitical, 5).hide();

        });
    });
}
