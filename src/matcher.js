	
	var modules = kes.module;

	for(var module in modules) {
		if(modules.hasOwnProperty(module)) {
			if(modules[module].matcher) {
				modules[module].fn();
			}
		}
	}

}
