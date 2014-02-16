	//* append css to head
	console.log(css);
	var h = document.getElementsByTagName('head')[0],
		injectCss = document.createElement('style');
		injectCss.type = 'text/css';
		injectCss.appendChild(document.createTextNode(css));
		h.appendChild(injectCss);
