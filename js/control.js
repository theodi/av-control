var status_url = "http://odinprac.theodi.org/AV_Control/status.php?";
var control_url = "http://odinprac.theodi.org/AV_Control/control.php?";

var int1,int2;
window.onload = function () {
	ProjectorInfoGet("projector1");
	ProjectorInfoGet("projector2");
	int1 = setInterval(function(){ ProjectorInfoGet("projector1"); }, 3000);
	int2 = setInterval(function(){ ProjectorInfoGet("projector2"); }, 3000);
	registerListeners("projector1");
	registerListeners("projector2");
};

function ProjectorInfoGet(projector)
{
	var myUrl = status_url + 'projector=' + projector;

        $.ajax({
            type: 'GET',
            url: myUrl,
            dataType: 'json',
            success: function (data) 
            {
		handleProjectorInfo(projector,data);
	    },
	    error: function (request, status, error) {
		document.getElementById("darkLayer").style.display = "block";
		console.log(request);
		console.log(status);
		console.log(error);
		clearInterval(int1);	
		clearInterval(int2);	
	    }
	});
}

var power = {};

function projectorPower(projector,op,skip) {
	var myUrl = control_url + 'projector=' + projector + '&power=' + op;
	console.log(myUrl);

        $.ajax({
            type: 'GET',
            url: myUrl,
            dataType: 'json',
            success: function (data) 
            {
		console.log(op);
		if (op == "off" && skip == false) {
			var r=window.confirm("Are you sure you want to power off " + projector);
			if (r==true)	{
				data = projectorPower(projector,"off",true);		
			} else {
			}
		}
		return data;
	    },
	    error: function (request, status, error) {
	    }
	});
}

function registerListeners(projector) {

	$( "#" + projector + "_power" ).click(function() {
		if (power[projector] == "off") {
			data = projectorPower(projector,"on",false);		
		}
		if (power[projector] == "on") {
			data = projectorPower(projector,"off",false);		
		} 
	});

}

function handleProjectorInfo(projector,data) {
	var PowerStatus = data["nEIPStatus"] & 0x00FF;

	if(0 == PowerStatus)
	{
		document.getElementById(projector + "_power").innerHTML = 'Power On';
		document.getElementById(projector + "_power").disabled = false;            			
		document.getElementById(projector + "_status").innerHTML = 'Powered Off';
		power[projector] = "off";
	}else if(1 == PowerStatus)
	{
		document.getElementById(projector + "_power").innerHTML = 'Power Off';
		document.getElementById(projector + "_power").disabled = false;            			
		document.getElementById(projector + "_status").innerHTML = 'Powered On';
		power[projector] = "on";
	}else if(2 == PowerStatus)
	{
		document.getElementById(projector + "_power").innerHTML = 'Power On';
		document.getElementById(projector + "_power").disabled = false;            			
		document.getElementById(projector + "_status").innerHTML = 'Standby';
		power[projector] = "off";
	}else if(3 == PowerStatus)
	{
		document.getElementById(projector + "_power").innerHTML = 'Warming Up';            			
		document.getElementById(projector + "_power").disabled = true;            			
		document.getElementById(projector + "_status").innerHTML = 'Warming Up';
		power[projector] = "other";
	}else if(4 == PowerStatus)		
	{
		document.getElementById(projector + "_power").innerHTML = 'Cooling Down';
		document.getElementById(projector + "_power").disabled = true;            			
		document.getElementById(projector + "_status").innerHTML = 'Cooling Down';
		power[projector] = "other";
	} else 
	{
		document.getElementById(projector + "_power").innerHTML = 'Power On';
		document.getElementById(projector + "_power").disabled = false;            			
		document.getElementById(projector + "_status").innerHTML = 'Powered Off';
		power[projector] = "off";
	}

}
