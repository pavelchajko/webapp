 var dimensionName = "";
$( document ).ready(function(){
	var source = localStorage.getItem('source');
    var arr = [];
    var dimensionArr = [];
    var dimensionsOverAttribute = [];
	//take the id of the dimension that was pressed in Main Menu
	$(".dimension").click(function(){
	   var dimension = $(this).closest(".dimension").attr("id");
	    //var x = $(this).children(".Result");
	    //var globalValue = x[0].innerHTML;
	    var globalValue  = $(this).attr("value");

	    var glo = $(this).children(".fh5co-work-title");
	    dimensionName = glo[0].innerHTML;
		localStorage.setItem('dimension',dimension);
		localStorage.setItem('globalValue',globalValue);
		localStorage.setItem('dimensionName',dimensionName);
        localStorage.setItem('source',source);
	});
	
	//SELCT A VIEW:
    var view = document.getElementById('dropdown-view');
   $("#dropdown-view li").click(function(){
       var groupButton = document.getElementById("buttonGroupBy");
       if(groupButton != "Group By"){
           groupButton.innerHTML = "Group By <span class='caret'></span>";
       }
       $(".Completeness").css("display","block");
       $(".Corectness").css("display","block");
       $(".Time").css("display","block");
       $(".Clustering").css("display","block");
       $(".Association").css("display","block");
        var selection = $(this).attr("class");
        $("#buttonView").html(selection+"<span class='caret'></span>");
        if(selection=="Data Mining"){
            $(".Completeness").css("display","none");
            $(".Corectness").css("display","none");
            $(".Time").css("display","none");
        }
        if(selection=="Category"){
            $(".Clustering").css("display","none");
            $(".Association").css("display","none");
        }
       if(selection=="Standard"){
           $(".Clustering").css("display","none");
           $(".Association").css("display","none");
           $(".Completeness").css("display","none");
           $(".Corectness").css("display","none");
           $(".Time").css("display","none");

           $("#precisionBox").css("display","block");
           $("#distinctnessBox").css("display","block");
           $("#timelinessBox").css("display","block");
           $("#vBox").css("display","block");
           $("#cfBox").css("display","block");
           $("#cpmBox").css("display","block");
           $("#accuracyBox").css("display","block");
           $("#consistencyBox").css("display","block");
       }

    });

    $("#dropdown-groupBy li").click(function(){
        var selection = $(this).attr("class");
        $("#buttonGroupBy").html(selection+"<span class='caret'></span>");
        if(selection=="Clustering"){
            $("#cfBox").css("display","none");
            $("#distinctnessBox").css("display","none");
            $("#timelinessBox").css("display","none");

            $("#vBox").css("display","block");
            $("#accuracyBox").css("display","block");
            $("#consistencyBox").css("display","block");
            $("#precisionBox").css("display","block");
            $("#cpmBox").css("display","block")
        }
        if(selection=="Corectness"){
            $("#timelinessBox").css("display","none");
            $("#cfBox").css("display","none");
            $("#cpmBox").css("display","none");
            $("#vBox").css("display","none");

            $("#accuracyBox").css("display","block");
            $("#consistencyBox").css("display","block");
            $("#precisionBox").css("display","block");
            $("#distinctnessBox").css("display","block");

        }
        if(selection=="Completeness"){
            $("#timelinessBox").css("display","none");
            $("#distinctnessBox").css("display","none");
            $("#vBox").css("display","none");
            $("#accuracyBox").css("display","none");
            $("#consistencyBox").css("display","none");
            $("#precisionBox").css("display","none");

            $("#cfBox").css("display","block");
            $("#cpmBox").css("display","block");



        }
    });

	//send request to server to explore folder files
	function httpGet(theUrl)
   {
   	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
   }
    // function that explores all properties from final-result file
	var filtered_keys = function(obj, filter) {
		  var key, keys = [];
		  for (key in obj) {
		    if (obj.hasOwnProperty(key) && filter.test(key)) {
		      keys.push(key);
		    }
		  }
		  return keys;
	}

 	//UPDATE ALL THE GLOBAL RESULTS
 	var path = httpGet("/folder?query=public/dataSources/"+source+"/DQAssessment_results/final_quality");
    $.getJSON("/dataSources/"+source+"/DQAssessment_results/final_quality/"+path, function(json) {

        // REGEX matching of completness missing
        var filteredNames = [];
        filteredNames = filtered_keys(json, /Completeness_Missing/);
        if(json.hasOwnProperty(filteredNames[0])) {
            $('#cpm').attr('data-percent', json.Completeness_Missing.toString().slice(0, 4));
            if (json.Completeness_Missing.toString().slice(0, 4) < 0.85) {
                $("#cm-title").css("color", "red");
            }
            else if (json.Completeness_Missing.toString().slice(0, 4) > 0.85) {
                $("#cm-title").css("color", "green");
            }
            $('#cpm').cssCharts({type: "donut"}).trigger('show-donut-chart');
            $('#cpm').attr('data-title', '%');
            $('#cpm').parent().parent().attr('value', json.Completeness_Missing.toString().slice(0, 4));

            filteredNames = [];
        }
        else if(!json.hasOwnProperty(filteredNames[0])) {
            $('#cmp').attr('data-percent',0);
            $("#cm-title").css("color", "red");
            //$("#cmpBox").css("padding-top","80px");
            $('#cmp').cssCharts({type:"donut"}).trigger('show-donut-chart');
            $('#cmp').parent().parent().attr('value',0);
            filteredNames = [];

            filteredNames = [];
        }
	    ////////////////////////////////////

	    
		// REGEX matching of completness frequency
		var filteredNames = filtered_keys(json, /Completeness_Frequency/);
	   	if(json.hasOwnProperty(filteredNames[0])) {
            var comp_freq = json[filteredNames[0]];
            //var update = document.getElementById('#cf');
            // update.innerHTML = comp_freq;
            $('#cf').attr('data-percent', comp_freq.toString().slice(0, 4));
            if (comp_freq.toString().slice(0, 4) < 0.8) {
                $("#cf-title").css("color", "red");
            }
            else if (comp_freq.toString().slice(0, 4) > 0.8) {
                $("#cf-title").css("color", "green");
            }
            $('#cf').cssCharts({type: "donut"}).trigger('show-donut-chart');
            $('#cf').parent().parent().attr('value', comp_freq.toString().slice(0, 4));
            filteredNames = [];
        }
        else if(!json.hasOwnProperty(filteredNames[0])) {
            $('#cf').attr('data-percent',0);
            $("#cf-title").css("color", "red");
            //$("#cfBox").css("padding-top","80px");
            $('#cf').cssCharts({type:"donut"}).trigger('show-donut-chart');
            $('#cf').parent().parent().attr('value',0);
        }
        filteredNames = [];
	    ////////////////////////////////////


	    // REGEX matching of Accuracy
	    filteredNames = filtered_keys(json, /Accuracy/);
        var static = 0;
        var dynamic = 0;
        	if(json.hasOwnProperty(filteredNames[0])) {
                //var accuractyToPrint = json[filteredNames[i]];
                //var update = document.getElementById('accuracy-text');
                //update.innerHTML += ""+filteredNames[i]+":"+json[filteredNames[i]]+"</br>";
                static = json[filteredNames[0]];

        if(json.hasOwnProperty(filteredNames[1])) {
				 dynamic = json[filteredNames[1]];

        	}
        	var accuracyVar = 0;
        if(json.hasOwnProperty(filteredNames[0]) && !filteredNames[0].includes("Static") && !filteredNames[0].includes("Dynamic")) {
        	    accuracyVar = json[filteredNames[0]];
        }
        $('#acc').attr('data-percent',accuracyVar.toString().slice(0,4));
        if(accuracyVar.toString().slice(0,4)<0.7){
            $("#accuracy-title").css("color", "red");
        }
        else if(accuracyVar.toString().slice(0,4)>0.7){
            $("#accuracy-title").css("color", "green");
        }
        $('#acc').cssCharts({type:"donut"}).trigger('show-donut-chart');
        $('#acc').parent().parent().attr('value',accuracyVar.toString().slice(0,4));

        }
        else if(!json.hasOwnProperty(filteredNames[0])) {
                $('#acc').attr('data-percent',0);
                $("#accuracy-title").css("color", "red");
                //$("#accuracyBox").css("padding-top","80px");
                $('#acc').cssCharts({type:"donut"}).trigger('show-donut-chart');
                $('#acc').parent().parent().attr('value',0);
            }
        filteredNames=[];
        CanvasJS.addColorSet("greenShades",
            [//colorSet Array
                "#da1212",
                "#da1245"
            ]);
        //creating a chart for accuracy
/*        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            colorSet: "greenShades",
			width:250,
			height:250,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: ""
            },
            axisY: {
                title: ""
            },
            data: [{
                type: "column",
                showInLegend: false,
                legendMarkerColor: "grey",
                legendText: "",
                dataPoints: [
                    { y: static, label: "Static" },
                    { y: dynamic,  label: "Dynamic" },

                ]

            }]
        });
        chart.render();
        $("#accuracy-title").css("color", "red");*/
		////////////////////////////////////
	    
		// VOLUME
        filteredNames = filtered_keys(json, /Volume/);
        if(json.hasOwnProperty(filteredNames[0])) {
                if (json.Volume != null) {
                    $('#v').attr('data-percent', json.Volume.toString().slice(0, 4));
                    if (json.Volume.toString().slice(0, 4) < 0.7) {
                        $("#volume-title").css("color", "red");
                    }
                    else if (json.Volume.toString().slice(0, 4) > 0.7) {
                        $("#volume-title").css("color", "green");
                    }
                    $('#v').cssCharts({type: "donut"}).trigger('show-donut-chart');
                    $('#v').parent().parent().attr('value', json.Volume.toString().slice(0, 4));
                    filteredNames = [];
                }
            }
            else if(!json.hasOwnProperty(filteredNames[0])) {
                $('#v').attr('data-percent', 0);
                $("#volume-title").css("color", "red");
                //$("#vBox").css("padding-top", "80px");
                $('#v').cssCharts({type: "donut"}).trigger('show-donut-chart');
                $('#v').parent().parent().attr('value', 0);
            }
        filteredNames = [];
	    ////////////////////////////////////

	     // REGEX matching of Precision
	    filteredNames = filtered_keys(json, /Precision_/);
			if(json.hasOwnProperty(filteredNames[0])) {
		   		//var precisionToPrint = json[filteredNames[i]];
		   		//var update = document.getElementById('precision-text');
		   		//update.innerHTML += ""+filteredNames[i]+":"+json[filteredNames[i]]+"</br>";
		   		$('#pr').attr('data-percent',json[filteredNames[0]].toString().slice(0,4));
		   		if(json[filteredNames[0]].toString().slice(0,4)<0.6){
		   			 $("#precision-title").css("color", "red");
		   		}
		   		else if(json[filteredNames[0]].toString().slice(0,4)>0.6){
		   			 $("#precision-title").css("color", "green");
		   		}
    			$('#pr').cssCharts({type:"donut"}).trigger('show-donut-chart');
    			$('#pr').parent().parent().attr('value',json[filteredNames[0]].toString().slice(0,4));
	   		}
             else if(!json.hasOwnProperty(filteredNames[0])) {
                $('#pr').attr('data-percent',0);
                $("#precision-title").css("color", "red");
                //$("#precisionBox").css("padding-top","80px");
                $('#pr').cssCharts({type:"donut"}).trigger('show-donut-chart');
                $('#pr').parent().parent().attr('value',0);
			}
        filteredNames=[];
	    ////////////////////////////////////


	     // REGEX matching of Timeliness
	    filteredNames = filtered_keys(json, /Timeliness_Mean/);
			if(json.hasOwnProperty(filteredNames[0])) {
		   		//var precisionToPrint = json[filteredNames[i]];
		   		//var update = document.getElementById('timeliness-text');
		   		//update.innerHTML += ""+filteredNames[i]+":"+json[filteredNames[i]]+"</br>";
		   		$('#tm').attr('data-percent',json[filteredNames[0]].toString().slice(0,4));
		   		if(json[filteredNames[0]].toString().slice(0,4)<0.6){
		   			 $("#timeliness-title").css("color", "red");
		   		}
		   		else if(json[filteredNames[0]].toString().slice(0,4)>0.6){
		   			 $("#timeliness-title").css("color", "green");
		   		}
    			$('#tm').cssCharts({type:"donut"}).trigger('show-donut-chart');
    			$('#tm').parent().parent().attr('value',json[filteredNames[0]].toString().slice(0,4));
	   		}
            else if(json.hasOwnProperty(filteredNames[0])) {
                $('#tm').attr('data-percent',0);
                $("#timeliness-title").css("color", "red");
                //$("#timelinessBox").css("padding-top","80px");
                $('#tm').cssCharts({type:"donut"}).trigger('show-donut-chart');
                $('#tm').parent().parent().attr('value',0);
            }

	    filteredNames=[];
	    ////////////////////////////////////


	    // DISTINCTNESS
	    //var update = document.getElementById('distinctness-text');
	    //update.innerHTML = json.Distinctness;
        if(json.Distinctness != null) {
            $('#ds').attr('data-percent', json.Distinctness.toString().slice(0, 4));
            if (json.Distinctness.toString().slice(0, 4) < 0.85) {
                $("#distinctness-title").css("color", "red");
            }
            if (json.Distinctness.toString().slice(0, 4) > 0.85) {
                $("#distinctness-title").css("color", "green");
            }
            $('#ds').cssCharts({type: "donut"}).trigger('show-donut-chart');
            $('#ds').parent().parent().attr('value', json.Distinctness.toString().slice(0, 4));
        }
        else if(json.Distinctness == null) {
            $('#ds').attr('data-percent',0);
            $("#distinctness-title").css("color", "red");
            //$("#timelinessBox").css("padding-top","80px");
            $('#ds').cssCharts({type:"donut"}).trigger('show-donut-chart');
            $('#ds').parent().parent().attr('value',0);
        }
	    //////////////////////////////////// CONISTENCY set to zero because it can't be calculated on global level

        $('#cs').attr('data-percent',0);

            $("#consistency-title").css("color", "red");
            $("#consistencyBox").css("padding-top","80px");

        $('#cs').cssCharts({type:"donut"}).trigger('show-donut-chart');
        $('#cs').parent().parent().attr('value',0);

        //////////////////////////////////// Completeness population set to zero because it can't be calculated on global level

        $('#cp').attr('data-percent',0);

        $("#population-title").css("color", "red");
        $("#populationBox").css("padding-top","80px");

        $('#cp').cssCharts({type:"donut"}).trigger('show-donut-chart');
        $('#cp').parent().parent().attr('value',0);
    });

    //DIRECT LINK TO VALUE LEVEL GRANULARITY
    $.ajax({
        type:'get',
        url: "/getAttributes?firstFolder=public/dataSources/"+source+"/DQAssessment_results",
        async:false

    }).done(function ( info ) {
        info = JSON.stringify(info);
        info = JSON.parse(info);
        var attributes = info;
        for(var i in attributes){
            arr.push(attributes[i]);
        }

    });
    var thisUL = document.getElementById('dropMenu1');
    for(var i in arr){
        thisUL.innerHTML +="<li class='"+arr[i]+ "' id='attList'>"+arr[i]+"</li>";

    }
    var selectedAtr;
    $("li#attList").click(function(){
        selectedAtr=($(this).attr("class"));
        var update = document.getElementById("attributeButton");
        update.innerHTML = ($(this).attr("class"))+"<span class='caret'></span>";
    });

    //call to server side for values available
    $.ajax({
        type:'get',
        url: "/directLink?firstFolder=public/dataSources/"+source+"/DQAssessment_results",
        async:false

    }).done(function ( info ) {
        info = JSON.stringify(info);
        info = JSON.parse(info);
        var dimensions = info;
        for(var i in dimensions){
            dimensionArr.push(dimensions[i]);
        }
    });

    var dimUL = document.getElementById('dropMenu2');
    for(var i in dimensionArr){
        dimUL.innerHTML +="<li class='"+dimensionArr[i]+ "' id='dimensionList'>"+dimensionArr[i]+"</li>";

    }
    var selectedDimension;
    $("li#dimensionList").click(function(){
        selectedDimension=($(this).attr("class"));
        var update = document.getElementById("dimensionButton");
        update.innerHTML = ($(this).attr("class"))+"<span class='caret'></span>";

        var atr = document.getElementById("attributeButton").textContent;
        var dim = document.getElementById("dimensionButton").textContent;
        if(atr !="Attribute" && dim !="Dimension") {
            console.log(atr+dim);
            $("#go").attr("href", "valueGranularity.html");
        }
    });

//call to server side to get dimensions scores over attributes available
    $.ajax({
        type:'get',
        url: "/getListOfDimensions?firstFolder=public/dataSources/"+source+"/DQAssessment_results",
        async:false

    }).done(function ( info ) {
        info = JSON.stringify(info);
        info = JSON.parse(info);
        var dimensions = info;
        for(var i in dimensions){
            dimensionsOverAttribute.push(dimensions[i]);
        }
    });

    var dimL = document.getElementById('dropDimension');
    for(var i in dimensionsOverAttribute){
        dimL.innerHTML +="<li class='"+dimensionsOverAttribute[i]+ "' id='dimensionListOverAttribute'>"+dimensionsOverAttribute[i]+"</li>";

    }
    var selectedDimensionOverAttribute;
    $("li#dimensionListOverAttribute").click(function(){
        selectedDimensionOverAttribute=($(this).attr("class"));
        var update = document.getElementById("dimensionButton1");
        update.innerHTML = ($(this).attr("class"))+"<span class='caret'></span>";
        var dim = document.getElementById("dimensionButton1").textContent;
        if(dim !="Dimension") {
            $("#go-attribute").attr("href", "attributeGranularity.html");
        }
    });

    //GO for direct link to attribute granularity

    $("#go-attribute").click(function(){
        dimensionName = document.getElementById("dimensionButton1").textContent;
        localStorage.setItem('dimension', dimensionName);
        localStorage.setItem('dimensionName',dimensionName);
        localStorage.setItem('source', source);
    });
    
    //GO for direct link to value granularity

	$("#go").click(function(){

            var attributeOfAggregation = document.getElementById("attributeButton").textContent;
            dimensionName = document.getElementById("dimensionButton").textContent;
			//console.log(attributeOfAggregation +dimensionName +source);
            localStorage.setItem('attributeOfAggregation', attributeOfAggregation);
            localStorage.setItem('dimension', dimensionName);
            localStorage.setItem('source', source);

	});
});

     



    

