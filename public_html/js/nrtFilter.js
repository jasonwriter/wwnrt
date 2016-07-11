
function fillFilter() {
    require([
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "dojo/promise/all",
        "dojo/domReady!"], function (Query, QueryTask, all) {
        var polyYears, lineYears, pointYears, promises;
        var yearList = [];
        var uniqueList = [];
        var found, check, checkArr;

        var myDate = new Date();
        var myMS = myDate.getMilliseconds();
        var myDirtyWC;
        myDirtyWC = myMS + " = " + myMS;

        //find year in polygons
        var PolyQT = new QueryTask(urlProjectsFS);
        var PolyQ = new Query();
        PolyQ.outFields = ["*"];
        PolyQ.returnGeometry = false;
        PolyQ.where = myDirtyWC;

        //find year in polygons
        var LineQT = new QueryTask(urlProjectsFS_Line);
        var LineQ = new Query();
        LineQ.outFields = ["*"];
        LineQ.returnGeometry = false;
        LineQ.where = myDirtyWC;

        //find year in polygons
        var PointsQT = new QueryTask(urlProjectsFS_Point);
        var PointsQ = new Query();
        PointsQ.outFields = ["*"];
        PointsQ.returnGeometry = false;
        PointsQ.where = myDirtyWC;


        polyYears = PolyQT.execute(PolyQ);
        lineYears = LineQT.execute(LineQ);
        pointYears = PointsQT.execute(PointsQ);



        //console.log("deferreds: ", mPoint, mPoly, cPoint, cPoly);
        promises = new all([polyYears, lineYears, pointYears]);
        //console.log("created d list")



        promises.then(function handleQueryResults(results) {
            results.forEach(
                    function (fl) {
                        fl.features.forEach(
                                function (feature) {
                                    var d = new Date(feature.attributes.YearFunded);
                                    var n = d.getFullYear();
                                    yearList.push(n);
                                });
                    }
            );
            //console.log(yearList);

            var uniqueList = yearList.filter(onlyUnique);
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            
            //fill dropdown
            var select = document.getElementById("selYear");
            select.options.length = 0; // clear out existing items
            for (var i = 0; i < uniqueList.length; i++) {
                var d = uniqueList[i];
                select.options.add(new Option(d, d));
            }
          //console.log(uniqueList);


        });




    });
}
//returns the next obsID for the current pntID

function filterProjects(value) {
    var FLs = [projectsFL, projectsFL_Points, projectsFL_Lines];
    FLs.forEach(
            function (fl) {
                fl.setDefinitionExpression("YearFunded >= '" + value + "-01-01' AND YearFunded <= '" + value + "-12-31'");
                fl.refresh();
            }
    );
}
function clearFilter() {
    var FLs = [projectsFL, projectsFL_Points, projectsFL_Lines];
    FLs.forEach(
            function (fl) {
                fl.setDefinitionExpression("1=1");
                fl.refresh();
            }
    );
}






