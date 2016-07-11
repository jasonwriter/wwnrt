var toolbar, toolbarEdit;
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
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService",
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/config",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/InfoTemplate",
        "dojo/ready",
        "dojo/parser",
        "dojo/dom",
        "dojo/dom-construct",
        "dijit/form/Button",
        "dojo/on",
        "dojo/_base/array",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"
    ],
            function (
                    Map, ArcGISDynamicMapServiceLayer, FeatureLayer, GeometryService, Editor, TemplatePicker, config,
                    IdentifyTask, IdentifyParameters, InfoTemplate,
                    ready, parser, dom, domConstruct, Button, on, arrayUtils,
                    BorderContainer, ContentPane) {
                        

                map.graphics.clear();
                map.setInfoWindowOnClick(false); 
                


        
                templatePicker = new TemplatePicker({
                    featureLayers: [projectsFL_Lines], 
                  
          rows: "auto",
          columns: 1,
          showTooltip: false,
          style: "height: 100%; width: 100%; text-align: center;"
                }, "templateDiv");
                
                templatePicker.startup();
              //document.getElementsByClassName("itemLabel").innerHTML = "click to add";

                var layers = [{featureLayer: projectsFL}];
                 var layerInfos = [
            {
              'featureLayer': projectsFL_Lines,
              'showAttachments': true,
              'isEditable': true,
              'fieldInfos': [
                {'fieldName': 'ProjectName', 'isEditable': true, 'tooltip': 'Name of project', 'label': 'Project Name:'},
                {'fieldName': 'Date', 'isEditable': true,  'label': 'Date:'},
                {'fieldName': 'ProjectSponsor', 'isEditable': true, 'label': 'Project Sponsor:'}
//                {'fieldName': 'ProjectDistrict', 'isEditable': false, 'tooltip': 'Hyperlink to District Web Page', 'label': 'Project District:'},
//                {'fieldName': 'Username', 'isEditable': false, 'label': 'User Name:'}
              ]
            }
          ];
                
//on(map, "click", function (e) {
//                    if (myEditor) {
//                        if (e.graphic.attributes.Username !== uName) {
//                            myEditor.destroy();
//                        }
//                    }          
//                    console.log(myEditor);
//                    console.log(e);
                    
//                });
        
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

                myEditor.startup();
                
                on(myEditor.editToolbar, "activate", function (sel) {
                        if(uName !== sel.graphic.attributes.Username){
                            //check if divCover already there
                            if(document.getElementsByClassName("sizer content")[0].childNodes[1]){
                                
                                //document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
                                
                            }else {
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
                            div.style.backgroundColor =  "rgba(255,255,255, 0.5)";
                            div.innerHTML = "<b><i>You may only edit your own projects!</i></b>";
                            document.getElementsByClassName("sizer content")[0].appendChild(div);
                            }
                            
                            
                            
                            //document.getElementsByClassName("contentPane")[0].innerHTML = "<div style='color: red'><b>You can only edit projects that you have created!</br></br>Click the 'Start Editing' button and select one of your projects to continue editing.</b></div>";
                        }else {
                            if(document.getElementsByClassName("sizer content")[0].childNodes[1]){
                                document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
                            }else {
                                
                            }
                            
                        }
                        
                    });
            });
}

function switchEdit(){
    
    divEditTemplateContainer
    var btn = document.getElementById("btnEdit");
    //var lbl = document.getElementById("lblEditing");
    if(btn.title == "Start Editing Projects"){
        //btn.src= "Images/btnEditStop.png";
        btn.title = "Stop Editing Projects";
        btn.innerHTML = "Stop Editing";
        document.getElementById('divEditStuff').style.borderColor = '#B98CBC';
        initEditor();
       // btn.setAttribute( "onClick", "javascript: Boo();" );
    } else {
        if(document.getElementsByClassName("sizer content")[0].childNodes[1]){
                                document.getElementsByClassName("sizer content")[0].removeChild(document.getElementsByClassName("sizer content")[0].childNodes[1]);
                            }
        document.getElementById('divEditStuff').style.borderColor = 'white';
        map.setInfoWindowOnClick(true); 
       // btn.src= "Images/btnEdit.png";
        btn.title = "Start Editing Projects";
        btn.innerHTML = "Start Editing";
         //btn.setAttribute( "onClick", "javascript: initEditor();" );
         templatePicker.destroy();
            myEditor.destroy();
            //recreate divs
            dojo.create("div", {
                id: "editorDiv"
            }, "divEditTemplateContainer");
            dojo.create("div", {
                id: "templateDiv"
            }, "divEditTemplateContainer");
    }
}