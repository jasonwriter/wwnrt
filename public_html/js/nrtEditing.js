var toolbar, toolbarEdit;
var closeButton, attInspector;
var divCover;
var FL, graphics, OID;
function initSnapping() {
    require(["esri/layers/FeatureLayer",
        "dojo/keys", "esri/Color",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol"

    ], function (FeatureLayer, keys, Color, SimpleMarkerSymbol, SimpleLineSymbol) {
        //define snapping options
        var snappinglayer1 = new FeatureLayer(urlProjectsFS, {
            mode: esri.layers.FeatureLayer.MODE_SELECTION,
            outFields: ["*"]
        });
        var snappinglayer2 = new FeatureLayer(urlPolitical + "/12", {
            mode: esri.layers.FeatureLayer.MODE_SELECTION,
            outFields: ["*"]
        });

        map.addLayer(snappinglayer1);
        map.addLayer(snappinglayer2);

        //set snapping layer to Flowline for default until changed
        var layerInfos = [{layer: snappinglayer1}, {layer: snappinglayer2}];

        var symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CROSS,
                15,
                new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0, 0.5]),
                        5
                        ),
                null
                );

        map.enableSnapping({
            snapPointSymbol: symbol,
            layerInfos: layerInfos,
            tolerance: 20,
            snapKey: keys.ALT
        });
    });
}

function initEditor() {
    require([
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "dojo/dom-construct",
        "dijit/form/Button",
        "dojo/dom",
        "dojo/query",
        "dojo/on"],
            function (Editor, TemplatePicker, domConstruct, Button, dom, query, on) {
                map.graphics.clear();
                //map.setInfoWindowOnClick(false);

                templatePicker = new TemplatePicker({
                    featureLayers: [projectsFL, projectsFL_Points, projectsFL_Lines],
                    grouping: true,
                    rows: "auto",
                    columns: 1,
                    showTooltip: false,
                    style: "height: 100%; width: 100%; text-align: center;"
                }, "templateDiv");

                templatePicker.startup();
                //document.getElementsByClassName("itemLabel").innerHTML = "click to add";

                //var layers = [{featureLayer: projectsFL_Points}, {featureLayer: projectsFL}, {featureLayer: projectsFL_Lines}];
                //var layers = [{featureLayer: projectsFL_Points}];

                var myDijit = new dijit.form.ValidationTextBox({
                    required: true,
                    promptMessage: "Required",
                    invalidMessage: "Enter Something"
                });






                var layerInfos = [
                    {
                        'featureLayer': projectsFL,
                        'showAttachments': true,
                        'isEditable': true,
                        'fieldInfos': [
                            {'fieldName': 'ProjectName', 'isEditable': true, 'tooltip': 'Name of project', 'label': 'Project Name:'},
                            //{'fieldName': 'ProjectDistrict', 'isEditable': true, 'tooltip': 'Name of district', 'label': 'District Name:'},
                            {'fieldName': 'Date', 'isEditable': true, 'label': 'Date:'},
                            {'fieldName': 'ProjectSponsor', 'isEditable': true, 'label': 'Project Sponsor:'},
                            {'fieldName': 'Description', 'isEditable': true, 'label': 'Project Description:', 'customField': myDijit},
                            {'fieldName': 'wwnrtFunding', 'isEditable': true, 'label': 'WWNRT Funding:'},
                            {'fieldName': 'YearFunded', 'isEditable': true, 'label': 'Year Funded:'},
                            {'fieldName': 'ProjectCost', 'isEditable': true, 'label': 'Project Cost:'}

                        ]
                    }, {
                        'featureLayer': projectsFL_Points,
                        'showAttachments': true,
                        'isEditable': true,
                        'fieldInfos': [
                            {'fieldName': 'ProjectName', 'isEditable': true, 'tooltip': 'Name of project', 'label': 'Project Name:'},
                            //{'fieldName': 'ProjectDistrict', 'isEditable': true, 'tooltip': 'Name of district', 'label': 'District Name:'},
                            {'fieldName': 'Date', 'isEditable': true, 'label': 'Date:'},
                            {'fieldName': 'ProjectSponsor', 'isEditable': true, 'label': 'Project Sponsor:'},
                            {'fieldName': 'Description', 'isEditable': true, 'label': 'Project Description:', 'customField': myDijit},
                            {'fieldName': 'wwnrtFunding', 'isEditable': true, 'label': 'WWNRT Funding:'},
                            {'fieldName': 'YearFunded', 'isEditable': true, 'label': 'Year Funded:'},
                            {'fieldName': 'ProjectCost', 'isEditable': true, 'label': 'Project Cost:'}

                        ]
                    }, {
                        'featureLayer': projectsFL_Lines,
                        'showAttachments': true,
                        'isEditable': true,
                        'fieldInfos': [
                            {'fieldName': 'ProjectName', 'isEditable': true, 'tooltip': 'Name of project', 'label': 'Project Name:'},
                            //{'fieldName': 'ProjectDistrict', 'isEditable': true, 'tooltip': 'Name of district', 'label': 'District Name:'},
                            {'fieldName': 'Date', 'isEditable': true, 'label': 'Date:'},
                            {'fieldName': 'ProjectSponsor', 'isEditable': true, 'label': 'Project Sponsor:'},
                            {'fieldName': 'Description', 'isEditable': true, 'label': 'Project Description:', 'customField': myDijit},
                            {'fieldName': 'wwnrtFunding', 'isEditable': true, 'label': 'WWNRT Funding:'},
                            {'fieldName': 'YearFunded', 'isEditable': true, 'label': 'Year Funded:'},
                            {'fieldName': 'ProjectCost', 'isEditable': true, 'label': 'Project Cost:'}

                        ]
                    }

                ];

                var settings = {
                    map: map,
                    templatePicker: templatePicker,
                    layerInfos: layerInfos,
                    toolbarVisible: false,
                    createOptions: {
                        polylineDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYLINE],
                        polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON,
                            Editor.CREATE_TOOL_CIRCLE,
                            Editor.CREATE_TOOL_TRIANGLE,
                            Editor.CREATE_TOOL_RECTANGLE
                        ]
                    },
                    toolbarOptions: {
                        reshapeVisible: false
                    }
                };

                var params = {
                    settings: settings
                };
                myEditor = new Editor(params, 'editorDiv');





                myEditor.on("load", function () {
                    //change attachment label
                    var attachPrompt = query(".atiAttachmentEditor b");
                    attachPrompt[0].innerHTML = "Upload one and only one photo per project:";

                    //add class to remove x button
                    $(".titleButton").addClass("removeX");

                    if (!dom.byId("btnCloseAI")) {
                        //add save button
                        attInspector = myEditor.attributeInspector;
                        closeButton = new Button({id: "btnCloseAI", label: "Save Changes", "class": "closeButton"}, domConstruct.create("div"));
                        attInspector.deleteBtn.set("label", "Delete Project");
                        domConstruct.place(closeButton.domNode, attInspector.deleteBtn.domNode, "after");
                    }




                });


                myEditor.startup();
                dojo.connect(projectsFL_Points, "onBeforeApplyEdits", function (adds, updates, deletes) {
                    if (adds) {

                        getDistrict(adds[0].geometry, function (r) {
                            currentDistrict = r.features[0].attributes.WWNRTDistrict;
                        });
                    }

                    dojo.forEach(updates, function (update) {
                        if (update.attributes !== null) {
                            {
                                update.attributes.ProjectDistrict = currentDistrict;
                            }
                        }
                    });
                    //update the user id and name if null
                    dojo.forEach(adds, function (add) {
                        if (add.attributes !== null) {

                            if (add.attributes.Username == null) {
                                add.attributes.Username = uName;
                                add.attributes.UserID = uID;
                            }
                        }

                    });
                });

                dojo.connect(projectsFL_Lines, "onBeforeApplyEdits", function (adds, updates, deletes) {
                    if (adds) {
                        var middlePntIndex = Math.round(adds[0].geometry.paths[0].length / 2);
                        getDistrict(adds[0].geometry.getPoint(0, middlePntIndex), function (r) {
                            currentDistrict = r.features[0].attributes.WWNRTDistrict;
                        });
                    }

                    dojo.forEach(updates, function (update) {
                        if (update.attributes !== null) {
                            {
                                update.attributes.ProjectDistrict = currentDistrict;
                            }
                        }
                    });
                    //update the user id and name if null
                    dojo.forEach(adds, function (add) {
                        if (add.attributes !== null) {

                            if (add.attributes.Username == null) {
                                add.attributes.Username = uName;
                                add.attributes.UserID = uID;
                            }
                        }

                    });
                });

                dojo.connect(projectsFL, "onBeforeApplyEdits", function (adds, updates, deletes) {
                    if (adds) {
                        getDistrict(adds[0].geometry.getCentroid(), function (r) {
                            currentDistrict = r.features[0].attributes.WWNRTDistrict;
                        });
                    }
                    dojo.forEach(updates, function (update) {
                        if (update.attributes !== null) {
                            {
                                update.attributes.ProjectDistrict = currentDistrict;
                            }
                        }
                    });
                    //update the user id and name if null
                    dojo.forEach(adds, function (add) {
                        if (add.attributes !== null) {
                            if (add.attributes.Username == null) {
                                add.attributes.Username = uName;
                                add.attributes.UserID = uID;
                            }
                        }

                    });
                });

// closeButton.on('click', function () {
//                        var FL, graphics;
//                        if (sel.graphic._graphicsLayer.id === "projectsFL_Points") {
//                            graphics = window.projectsFL_Points.getSelectedFeatures();
//                            FL = projectsFL_Points;
//                        } else if (sel.graphic._graphicsLayer.id === "projectsFL_Lines") {
//                             graphics = window.projectsFL_Lines.getSelectedFeatures();
//                            FL = projectsFL_Lines;
//                        } else if (sel.graphic._graphicsLayer.id === "projectsFL") {
//                             graphics = window.projectsFL.getSelectedFeatures();
//                            FL = projectsFL;
//                        }
//                        var myOID = sel.graphic.attributes.OBJECTID;
//                        FL.queryAttachmentInfos(myOID, function (r) {
//                            if (r.length === 1) {
//                                //var graphics = window.FL.getSelectedFeatures();
//                                dojo.every(graphics, function (graphic) {
//                                    if (graphic.attributes.ProjectName == null || graphic.attributes.ProjectName == "") {
//                                        alert("Please enter a Project Name.");
//                                        return false;
//                                    } else if (graphic.attributes.ProjectSponsor == null || graphic.attributes.ProjectSponsor == "") {
//                                        alert("Please enter a Project Sponsor.");
//                                        return false;
//                                    } else if (graphic.attributes.Description == null || graphic.attributes.Description == "") {
//                                        alert("Please enter a Project Description.");
//                                        return false;
//                                    } else if (graphic.attributes.wwnrtFunding == null || graphic.attributes.wwnrtFunding == "") {
//                                        alert("Please enter valid WWNRT Funding.");
//                                        return false;
//                                    } else if (graphic.attributes.YearFunded == null || graphic.attributes.YearFunded == "") {
//                                        alert("Please enter year Funded.");
//                                        return false;
//                                    } else {
//                                        map.infoWindow.hide();
//                                    }
//                                });
//                            } else {
//                                alert("One and only one project photo must be uploaded!");
//                                return false;
//                            }
//                        });
//                    });

                closeButton.on('click', function () {

                    FL.queryAttachmentInfos(OID, function (r) {
                        if (r.length === 1) {
                            //var graphics = window.FL.getSelectedFeatures();
                            dojo.every(graphics, function (graphic) {
                                if (graphic.attributes.ProjectName == null || graphic.attributes.ProjectName == "") {
                                    alert("Please enter a Project Name.");
                                    return false;
                                } else if (graphic.attributes.ProjectSponsor == null || graphic.attributes.ProjectSponsor == "") {
                                    alert("Please enter a Project Sponsor.");
                                    return false;
                                } else if (graphic.attributes.Description == null || graphic.attributes.Description == "") {
                                    alert("Please enter a Project Description.");
                                    return false;
                                } else if (graphic.attributes.wwnrtFunding == null || graphic.attributes.wwnrtFunding == "") {
                                    alert("Please enter valid WWNRT Funding.");
                                    return false;
                                } else if (graphic.attributes.YearFunded == null || graphic.attributes.YearFunded == "") {
                                    alert("Please enter year Funded.");
                                    return false;
                                } else {
                                    map.infoWindow.hide();
                                }
                            });
                        } else {
                            alert("One and only one project photo must be uploaded!");
                            return false;
                        }
                    });


                });
                on(myEditor.editToolbar, "activate", function (sel) {
                    //set graphic and feature layer
                    if (sel.graphic._graphicsLayer.id === "projectsFL_Points") {
                        graphics = window.projectsFL_Points.getSelectedFeatures();
                        FL = projectsFL_Points;
                    } else if (sel.graphic._graphicsLayer.id === "projectsFL_Lines") {
                        graphics = window.projectsFL_Lines.getSelectedFeatures();
                        FL = projectsFL_Lines;
                    } else if (sel.graphic._graphicsLayer.id === "projectsFL") {
                        graphics = window.projectsFL.getSelectedFeatures();
                        FL = projectsFL;
                    }
                    OID = sel.graphic.attributes.OBJECTID;
                    if (uName === sel.graphic.attributes.Username || adminEditor === true) {
                        
                         //place cover over class over editor so they can not edit
                        if (document.getElementsByClassName("sizer content")[0].childNodes[1]) {
                            document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
                        } else {
                            //do nothing
                        }
                        
                        
                       
                    } else {
                        //check if divCover already there
                        if (document.getElementsByClassName("sizer content")[0].childNodes[1]) {

                            //document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);

                        } else {
                            //create div to cover
                            var div = document.createElement("DIV");
                            div.id = "divCover";
                            div.style.position = 'absolute';
                            div.style.width = '100%';
                            div.style.height = '100%';
                            div.style.top = '0px';
                            div.style.textAlign = 'center';
                            div.style.fontSize = '32px';
                            div.style.color = 'red';
                            div.style.backgroundColor = "rgba(255,255,255, 0.5)";
                            div.innerHTML = "<b><i>You may only edit your own projects!</i></b>";
                            document.getElementsByClassName("sizer content")[0].appendChild(div);
                        }
                        //document.getElementsByClassName("contentPane")[0].innerHTML = "<div style='color: red'><b>You can only edit projects that you have created!</br></br>Click the 'Start Editing' button and select one of your projects to continue editing.</b></div>";
                    }

//                    if (uName !== sel.graphic.attributes.Username || adminEditor === false) {
//                        //check if divCover already there
//                        if (document.getElementsByClassName("sizer content")[0].childNodes[1]) {
//
//                            //document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
//
//                        } else {
//                            //create div to cover
//                            var div = document.createElement("DIV");
//                            div.id = "divCover";
//                            div.style.position = 'absolute';
//                            div.style.width = '100%';
//                            div.style.height = '100%';
//                            div.style.top = '0px';
//                            div.style.textAlign = 'center';
//                            div.style.fontSize = '32px';
//                            div.style.color = 'red';
//                            div.style.backgroundColor = "rgba(255,255,255, 0.5)";
//                            div.innerHTML = "<b><i>You may only edit your own projects!</i></b>";
//                            document.getElementsByClassName("sizer content")[0].appendChild(div);
//                        }
//                        //document.getElementsByClassName("contentPane")[0].innerHTML = "<div style='color: red'><b>You can only edit projects that you have created!</br></br>Click the 'Start Editing' button and select one of your projects to continue editing.</b></div>";
//                    } else {
//                        //place cover over class over editor so they can not edit
//                        if (document.getElementsByClassName("sizer content")[0].childNodes[1]) {
//                            document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
//                        } else {
//                            //do nothing
//                        }
//                    }
                });
            });
}

function switchEdit() {
    //divEditTemplateContainer
    var btn = document.getElementById("btnEdit");
    //var lbl = document.getElementById("lblEditing");
    if (btn.title == "Start Editing Projects") {
        //map.setInfoWindowOnClick(false);
        //btn.src= "Images/btnEditStop.png";
        btn.title = "Stop Editing Projects";
        btn.innerHTML = "Stop Editing";
        document.getElementById('divEditStuff').style.borderColor = '#B98CBC';
        initEditor();
        // btn.setAttribute( "onClick", "javascript: Boo();" );
    } else {
        if (document.getElementsByClassName("sizer content")[0].childNodes[1]) {
            document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
        }

        //replace close button
        $(".titleButton").removeClass("removeX");

        document.getElementById('divEditStuff').style.borderColor = 'white';
        //map.setInfoWindowOnClick(true);
        // btn.src= "Images/btnEdit.png";
        btn.title = "Start Editing Projects";
        btn.innerHTML = "Start Editing";
        //btn.setAttribute( "onClick", "javascript: initEditor();" );
        templatePicker.destroy();
        myEditor.destroy();
        myEditor = null;
        //recreate divs
        dojo.create("div", {
            id: "editorDiv"
        }, "divEditTemplateContainer");
        dojo.create("div", {
            id: "templateDiv"
        }, "divEditTemplateContainer");
    }
}


