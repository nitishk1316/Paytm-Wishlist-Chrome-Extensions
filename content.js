var currentUrl = '';

// Create Element
function makeElement(obj) {
	var element = document.createElement(obj.type);
	if(obj.className) {
		element.className = obj.className;	
	}
	if(obj.id) {
		element.id = obj.id;	
	}
	if(obj.src) {
		element.src = obj.src;	
	}
	if(obj.href) {
		element.href = obj.href;	
	}
	if(obj.right) {
		element.style.right = obj.right;	
	}

	if(obj.title) {
		element.title = obj.title;	
	}
	if(obj.text) {
		var t = document.createTextNode(obj.text);
		element.appendChild(t);
	}
	
	return element;
}

// Get Element By Id
function getById(id) {
	return document.getElementById(id);
}

// Get Product Detail
function getProductDetail () {
	var pro = {};
	pro.prodcutName = document.querySelector('.shown-image.active img').alt;
	pro.prodcutImg = document.querySelector('.other_images.active img').src;
	pro.url = currentUrl;

	return JSON.stringify(pro);
}

// Update Selected Wish list product as active
function checkSelectedWishList(status) {
	var pp = getById('nks-heart-shape');
	if(status == true) {
	    pp.className = 'nks-heart-shape active';
	} else {
		pp.className = 'nks-heart-shape';
	}
} 

// Creating Wishlist Button
function makeButton () {
	var fixedbutton = makeElement({type: "div", id: 'nks-fixed-button', title: 'Add to Wishlist'});
	
	var heartshape = makeElement({type: "div", id: 'nks-heart-shape', className: 'nks-heart-shape'});

	heartshape.onclick = function () {
		//console.log("CLICKED");
		var product = getProductDetail();
		chrome.runtime.sendMessage({method: "clicked", url: currentUrl, product: product}, function(response) {
		  	//console.log(response.status);
		  	makeListBox();
		});
	}
	fixedbutton.appendChild(heartshape);
	document.getElementsByTagName('body')[0].appendChild(fixedbutton);
}

// Creating My Wishlist 
function makeListButton () {

	var floatingform = makeElement({type: "div", id: 'nks-floating-form', className: 'nks-floating-form', right: '-360px'});
	var contactopener = makeElement({type: "div", id: 'nks-contact-opener', className: 'nks-contact-opener', text: "My Wish List"});
	var header = makeElement({type: "div", className: 'nks-wishlist-header', text: "Wish List Products"});
	var ul = makeElement({type: "ul", id: 'nks-pro-list'});

	floatingform.appendChild(contactopener);
	floatingform.appendChild(header);
	floatingform.appendChild(ul);

	document.getElementsByTagName('body')[0].appendChild(floatingform);

	var co = getById('nks-contact-opener')
	co.onclick = function () {
		
		var ff = getById('nks-floating-form');
		//console.dir(document.getElementById('floating-form'));
		if(ff.style.right == '0px') {
			ff.style.right = '-360px';
			co.style.left = '-86px';
		} else {
			ff.style.right = '0px';
			co.style.left = '-68px';
		}
		
		//console.log("OPEN LIST BOX");
		makeListBox();
	}
}

function removeWish(key) {
	chrome.runtime.sendMessage({method: "delete", url: key}, function(response) {
	  //console.log(response.status);
	  makeListBox ();
	});
}

function makeListBox () {
	var ul = getById('nks-pro-list');
	ul.innerHTML = '';
	
	chrome.runtime.sendMessage({method: "list"}, function(response) {
    	var list = response.list;

    	var l = Object.keys(list).length;
    	if(l == 0) {
    		var li = makeElement({type: "li", text: "No Product Found"});
    		ul.appendChild(li);
    	} else {
    		ul.innerHTML = '';
    	}

    	//console.log(Object.keys(list).length);
    	for (var key in list) {

    		var d = JSON.parse(list[key]);
		    //console.log(key);
		    //console.log(d);

		    var li = makeElement({type: "li"});
	        
	        //Image
	        var div = makeElement({type: "div", className: 'nks-media-body first'});
	        var img = makeElement({type: "img", src: d.prodcutImg});
	        
	        div.appendChild(img);
	        li.appendChild(div);

	        //Product Name
	        var div = makeElement({type: "div", className: 'nks-media-body second'});
	        var a = makeElement({type: "a", href:  d.url, text: d.prodcutName});

	        div.appendChild(a);
	        li.appendChild(div);

	        //Remove Link
	        var div = makeElement({type: "div", className: 'nks-media-body third'});
	        var a = makeElement({type: "a", href:  '#', text: 'X', className: 'remove'});
	        a.onclick = (function(p) {
		      return function() { 
		      	console.log(p);
		        removeWish(p);
		      }
		   })(d.url);
		    
		    div.appendChild(a);
	        li.appendChild(div);

	        ul.appendChild(li);
	    }
	});
}

makeListButton();

setInterval(function() {
	if(currentUrl  == '') {
		currentUrl = document.location.href;

	} else if(currentUrl != document.location.href) {
		currentUrl = document.location.href;
	}

	var ss = currentUrl.substring(0,25);
	if(ss == 'https://paytm.com/shop/p/') {
		if(! getById('nks-fixed-button')) {
			makeButton();
		} 
	} else {
		if(getById('nks-fixed-button')) {
			getById('nks-fixed-button').remove();
		} 
		
	}

	chrome.runtime.sendMessage({method: "select", url: currentUrl}, function(response) {
		//console.log(response.status);
		if(getById('nks-fixed-button')) {
			checkSelectedWishList(response.status);
		} 
	});
}, 2000);