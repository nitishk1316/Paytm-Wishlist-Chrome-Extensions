chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "clicked"){
     //localStorage.clear();
     localStorage[request.url] = request.product;
      sendResponse({status: true});
      //sendResponse({status: '1'});
    } else if (request.method == "select"){
    	var status = false;
	    if(localStorage[request.url]) {
	    	status = true;
	    } 
	    sendResponse({status: status});
    } else if (request.method == "list") {
      sendResponse({list: localStorage});
    } else if (request.method == "delete") {
    	localStorage.removeItem(request.url);
      	sendResponse({status: true});
    } else  {
      sendResponse({status: 'unknown'}); // snub them.
    }
});
