function baseMap(){
    require([
      "esri/map", "esri/dijit/BasemapGallery", "esri/arcgis/utils",
      "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane",
      "dojo/domReady!"
    ], function(
      Map, BasemapGallery, arcgisUtils

    ) {

      //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
      var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
      }, "basemapGallery");
      basemapGallery.startup();
      
      basemapGallery.on("error", function(msg) {
        console.log("basemap gallery error:  ", msg);
      });
    });
    }