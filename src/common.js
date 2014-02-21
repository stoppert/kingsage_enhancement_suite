	// TODO: test in chrome, opera, update-reminder,  show cost for 1 level, save everything apart from user settings in another obj?

	//* global variables
	var version = '1.2';
	var host	= location.host; // like "s1.kingsage.de"
	var server  = location.host.split('.')[0].substr(1); // like "1" for s1.kingsage.de

	var page	= document.URL;
	var self	= document.title.substring(document.title.indexOf('- ') + 2);
		self	= self.substring(0, self.indexOf(' -'));
	var arrow 	= '<img src="img/arrow_right_raquo.png">';

	//* units & buildings
	var units		 = { 0: l.units.militia, 1: l.units.sword, 2: l.units.spear, 3: l.units.axe, 4: l.units.bow, 5: l.units.spy, 7: l.units.light, 8: l.units.heavy, 9: l.units.ram, 10: l.units.kata, 11: l.units.snob };
	var unit_runtime = { "farmer": 20, "sword": 22, "spear": 18, "axe": 18, "bow": 18, "spy": 9, "light": 10, "heavy": 11, "ram": 30, "kata": 30, "snob": 35};
	var buildings	 = l.buildings;

	var buildCosts	 = {
		main: 	  {min: 1, max: 50, stone: {b: 	   85, f: 1.17}, wood: {b: 	   70, f: 1.165}, ore: {b: 	   65, f: 1.165}, workers: {b: 	 2, f: 1.12}},
		wood: 	  {min: 0, max: 50, stone: {b: 	   55, f: 1.17}, wood: {b: 	   30, f: 1.165}, ore: {b: 	   40, f: 1.165}, workers: {b: 	 5, f:  1.1}},
		stone: 	  {min: 0, max: 50, stone: {b: 	   40, f: 1.17}, wood: {b: 	   30, f: 1.165}, ore: {b: 	   55, f: 1.165}, workers: {b: 	 5, f:  1.1}},
		iron: 	  {min: 0, max: 50, stone: {b: 	   55, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   30, f: 1.165}, workers: {b: 	 5, f:  1.1}},
		storage:  {min: 1, max: 50, stone: {b: 	   43, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   35, f: 1.165}, workers: {b: 0.1, f: 	1.1}},
		hide: 	  {min: 0, max: 30, stone: {b: 	   50, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   40, f: 1.165}, workers: {b: 	 1, f: 1.15}},
		farm: 	  {min: 1, max: 50, stone: {b: 	   65, f: 1.17}, wood: {b: 	   50, f: 1.165}, ore: {b: 	   50, f:  1.16}, workers: {b: 	 0, f: 	  1}},
		barracks: {min: 0, max: 30, stone: {b: 	  180, f: 1.23}, wood: {b: 	  180, f:  1.21}, ore: {b: 	  120, f:  1.22}, workers: {b: 	 6, f: 1.17}},
		wall: 	  {min: 1, max: 20, stone: {b: 	   60, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   30, f:  1.16}, workers: {b: 	 4, f: 	1.2}},
		stable:   {min: 0, max: 30, stone: {b: 	  240, f: 1.17}, wood: {b: 	  200, f: 1.165}, ore: {b: 	  220, f:  1.16}, workers: {b:  10, f: 	1.1}},
		market:   {min: 0, max: 30, stone: {b: 	  100, f: 1.17}, wood: {b: 	   80, f: 1.165}, ore: {b: 	   70, f:  1.16}, workers: {b:  10, f: 1.17}},
		garage:   {min: 0, max:  5, stone: {b: 	  400, f: 1.17}, wood: {b: 	  600, f: 1.165}, ore: {b: 	  500, f:  1.16}, workers: {b:  50, f: 	1.4}},
		snob: 	  {min: 0, max: 10, stone: {b:  30000, f:  1.3}, wood: {b:  25000, f: 	1.3}, ore: {b:  25000, f: 	1.3}, workers: {b: 100, f: 	1.2}},
		smith: 	  {min: 0, max:  5, stone: {b:   4000, f:  1.4}, wood: {b: 	 3000, f: 	1.4}, ore: {b:   2500, f: 	1.4}, workers: {b:  25, f: 	1.2}},
		statue:   {min: 0, max:  1, stone: {b: 400000, f: 	 2}, wood: {b: 400000, f: 	  2}, ore: {b: 400000, f: 	  2}, workers: {b: 	 0, f: 1.17}},
		cost: function(building, level) {
			var stone = 0, wood = 0, ore = 0, workers = 0;
			if(typeof level == "number" && level <= building.max && level >= building.min) {
				stone	= Math.round(building.stone.b 	* Math.pow(building.stone.f, level-1)),
				wood	= Math.round(building.wood.b 	* Math.pow(building.wood.f, level-1)),
				ore		= Math.round(building.ore.b		* Math.pow(building.ore.f, level-1)),
				workers	= Math.round(building.workers.b * Math.pow(building.workers.f, level-1));
			}
			return [stone, wood, ore, workers];
		},
		cumulatedCost: function(building, min, max) {
			var stone = 0, wood = 0, ore = 0, workersLow = this.cost(building, min)[3], workersHigh = this.cost(building, max)[3];
			for(var i = min + 1; i <= max; i++) {
				cost = this.cost(building, i);
				stone 	+= cost[0];
				wood	+= cost[1];
				ore		+= cost[2];
			}
			return [stone, wood, ore, workersHigh - workersLow];
		},
		getMaximumLevel: function(building, level, stone, wood, iron, workers) {
			var max 		= building.max,
				min 		= level,
				available 	= [stone, wood, iron, workers],
				canBuild 	= function(cumulated, available) {
					return (cumulated[0] <= available[0] && cumulated[1] <= available[1] && cumulated[2] <= available[2] && cumulated[3] <= available[3]);
				},
				addCost		= function(n, o) {
					return [n[0] + o[0], n[1] + o[1], n[2] + o[2], n[3]];
				};
			//can we build max?
			var maxCost = this.cumulatedCost(building, min, max);
			if(canBuild(maxCost, available)) {
				return [max - min].concat(maxCost);
			} else {
				// search for the max level we can build
				var high 	= max-1,
					low  	= min,
					lowCost = this.cumulatedCost(building, low, low+1),
					lastCost = lowCost;
				for(var i = low + 1; low <= high; i++) {
					var tmpCost = addCost(this.cost(building, i), lastCost);
					if(canBuild(tmpCost, available)) {
						lastCost = tmpCost;
					} else {
						return [i-low].concat(lastCost);
					}
				}
			}
		}
	};

	//* got premium?
	var premium	 = ($('div.buff[style*="premium-account"]').length > 0) ? true : false;
	//* are we playing as av?
	var av = (Query['av']) ? '&av=' + Query['av'] : '';

	//#################################### GLOBAL CSS ####################################//

	var css = '';
		css += '.kes-backlight {display: none; position: fixed; cursor: pointer; width: 100%; height: 100%; padding: 0; margin: 0; top: 0; left: 0; background-color: black; opacity: 0.7; z-index: 199; }';
		css += '.kes-user-settings {display: none; position: fixed; left: 100px; right: 100px; top: 30px; bottom: 30px; background-color: white; z-index: 250; font-family: sans-serif; font-size: 14px; color: #333333; }';
		css += '.kes-user-settings input[type="text"], .kes-user-settings select {border: 1px solid #ccc; padding: 6px 4px; outline: none; border-radius: 2px; margin: 0; width: 70px; max-width: 100%; display: inline-block; margin-bottom: 5px; background: #fff; }';
		css += '.kes-user-settings input[type="text"]:focus, .kes-user-settings select:focus {border: 1px solid #aaa; color: #444; box-shadow:  0 0 3px rgba(0,0,0,.2); }';
		css += '.kes-user-settings select {width: 130px; padding: 4px; }';
		css += '.kes-user-settings ul {padding-left: 20px; }';
		css += '.kes-user-settings li {list-style-type: none; }';
	/**/
		css += '.kes-icons {background: url(data:image/png;base64,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) no-repeat; }';
		css += '.kes-saved {color: #529214; height: 28px; position: absolute; right: 30px; top: 17px; display: none; width: 100px; z-index: 251; }';
		css += '.kes-icon-saved {background-position: -288px 0; display: inline-block; width: 15px; height: 15px; margin: -2px 5px; }';
		css += '.kes-close {position: absolute; top: 10px; right: 7px; z-index: 251; height: 28px; width: 28px; }';
		css += '.kes-close:hover .kes-icon-close {opacity: 0.6; }';
		css += '.kes-icon-close {background-position: -312px 0; display: inline-block; height: 14px; width: 14px; line-height: 14px; margin-top: 1px; vertical-align: text-top; position: relative; left: 7px; top: 5px; }';
		css += '.kes-icon-valid {background-position: -288px 0; display: none; height: 14px; width: 14px; line-height: 14px; margin-top: 3px; vertical-align: top; position: relative; left: 7px; top: 5px; }';
		css += '.kes-icon-invalid {background-position: -144px -120px; display: none; height: 14px; width: 14px; line-height: 14px; margin-top: 3px; vertical-align: top; position: relative; left: 7px; top: 5px; }';
	/**/
		css += '.kes-menu-wrapper {overflow-y: auto; padding-top: 16px; border-right: 1px solid #D9D9D9; box-shadow: -6px 0 6px -6px rgba(0,0,0,0.2) inset; top: 0; right: 0; left: 0; bottom: 0; position: absolute; width: 212px; z-index: 150; }';
		css += '.kes-menu {top: 0; right: 0; left: 0; bottom: 0; margin: 0; user-select: none; }';
		css += '.kes-menu a {color: #21759B; display: block; font-size: 14px; line-height: 18px; margin: 0; padding: 4px 20px 4px 0; position: relative; text-decoration: none; text-shadow: 0 1px 0 #FFFFFF; text-align: right; }';
		css += '.kes-menu a:hover {background: none repeat scroll 0 0 rgba(0,0,0,0.04); color: #21759B; }';
		css += 'a > .kes-icon-home {background-position: 0 -24px; display: inline-block; height: 14px; margin: -2px 5px; width: 13px; }';
		css += 'a:hover > .kes-icon-home {opacity: 0.6; background-color: transparent; }';
		css += '.kes-menu .kes-active {font-weight: bold; color: #333333; }';
	/**/
		css += '.kes-heading {display: block; font-size: 16px; font-weight: bold; line-height: 18px; margin: 0; padding: 4px 20px; position: relative; }';
		css += '.kes-subheading {display: block; font-size: 13px; line-height: 18px; margin: -5px 0; padding: 0 20px; position: relative; }';
		css += '.kes-separator {border-bottom: 1px solid #FFFFFF; border-top: 1px solid #DFDFDF; height: 0; margin: 12px 20px; padding: 0; }';
		css += '.kes-content {bottom: 0; height: auto; left: 213px; margin: 0; overflow: auto; position: absolute; right: 0; top: 45px; width: auto; padding: 20px; }';
		css += '.kes-content-title {text-overflow: ellipsis; overflow: hidden; height: 45px; left: 213px; position: absolute; right: 0; padding-right: 135px; top: 0; z-index: 200; border-bottom: 1px solid #DFDFDF; box-shadow: 0 4px 4px -4px rgba(0,0,0,0.1); }';
		css += '.kes-content-title h1 {font-size: 22px; font-weight: 200; line-height: 45px; margin: 0; padding: 0 16px; }';
		css += '.kes-content .kes-paragraph {background: none repeat scroll 0 0 #F5F5F5; border: 1px solid #DFDFDF; margin: 0 1%; padding: 0 1% 0; }';
	/**/
		css += '.kes-enable, .kes-disable, .kes-enable span, .kes-disable span {user-select: none;background: url(data:image/gif;base64,R0lGODlhBQAOAeYAAL6+vlyRE4q8Je7u7oC0HZubm0l0EFaKEYqKimKNGJKSklxcXGCUFGmTGfDw8NjY2H2xHdLS0mSTF0JtDXWbKIaGhoKCglJ7E3mqH0tzEnyuIPX19WmfF+np6W2eGm+kGHGmGHZ2dmmZGVuFFd7e3mRkZI2NjYSEhICAgJOyV3mXTXKcH1VVVVGFD12NFVKGEIiIiHGhHI3AJ2FhYYa7HmSaFViOEleCFF6IFnx8fHBwcHp6eo+Pj2pqanJycm5ubnR0dH9/f2xsbHh4eGhoaHmtG3arGnuwHHOpGWecFmKYFGuhF+Xl5YS2I4S5HpSUlIi8H4a5H0+BD5GRkWdnZ4e5JMTExODg4HWmHc/Pz4GyImCQFXOkHX+wIYO2Hqy9lMjIyKysrPLy8nWgIG6bGrzOmbDDj87Yv9Xfw4CxHliHE3CjGHqkIX+lMnyvHW6YHYGeV3inHYa0JXquHFh/IFyCJmWWF1WAFJu2YYKwJIK0I1yPE9XV1ff392ZmZvj4+CH5BAAAAAAALAAAAAAFAA4BAAf/gACCgkyFhQ6IiH+LjI2Oj5CRkpOUlZaXmI59m5t8np4hoaEIpKQKp6dPqqqop1Ovrzyysia1taW4pRW7vL0Wv8DBQcPDOcbGO8nJQ8zMoqFA0dE+1NQ619c/2tpC3d094OBE4+NU5uYl6errLO3tDfDwEPPzUfb2UPn5NPz8Tv//vAgUSKBgQXrzjihUWKRhQyMQISKZOBGERYsfMmZcwpEjh48fk4gUWaNkSSUoUTJYuTKAy5cwbciUeaCmzZsvcuZswZOnlJ8/JwgVuqhDFit/SFjJQmIAGCaI+DzY0OdPBDGMIlRdxGfrn66MwHL1KvYr2bNh0Y5Ny3atW7Nt/+G+ncqIBAlGDvgMYNSBzxUHiwZcebDoQYEKfwCEyFHhwQ4EpwpYQGWBB6oclk9hnrXDlokQuELAKAWkl49eOoKlBvaDWJAex3IQUbbDT7Mhfp6VkAZkRjUfM7DpWLDtxwJvQhaE6zHDDzkLC/xIj7CguZ8/YVhUX5SlQolFZSg0+JNCAhkMZSTESeOFAhn2NCRg8MIvwRGACdwQEJhgjsEERdCDgxELjQCCQwZGdMMaFN3gwUUXcKDRBUl0dEENIF1gx0gGMGBShykZsAdLBtjw0gQHnHjATBO8YNMEUtiUgQE6fQFjTn+oMIEBUizyBR0TLNXBIiQcdRciTICxV/8fGzzAByNiRMBIH1Iu0seTVmL5x5VTasllll2GCeaYW3pppphlovllmmQ2WdddfwzAByJX8DHkA1fs9ccJBRD2RwU5hADAH6cgsMMDT5xiQQGo8DDZKTxsJksOnj1WCmikwBBCL6XtcoIPqgGDgg6u/RBbD7QRcVtuovjBWwm/BYfNDMUd541y4SxAjh/W+bEACtLNsEAEwrIQxh8lVJDFIm3ggcYiebCxghl/yCCDHGOgYa0MGKSwrQBtCCCuAGOMS24V6FYxRhPsNrFCu3qsoMW8WrzRxb1dvKHBvho0gMG/GPgLcANYFIxFAlwkzEUCMTQcQwIeROwBDhJPLMIuxSKMgLEIN9jhsR03SCCyBHdsYfIWF5zsAh0utHyHCi2rccEZMhtAbR1wnLFIIAA7) repeat-x; display: inline-block; }';
		css += '.kes-enable span, .kes-disable span { user-select: none; line-height: 30px; display: block; background-repeat: no-repeat; font-weight: bold; }';
		css += '.kes-enable span { background-position: left -90px; padding: 0 10px; }';
		css += '.kes-disable span { background-position: right -180px;padding: 0 10px; }';
		css += '.kes-disable.selected { background-position: 0 -30px; }';
		css += '.kes-disable.selected span { background-position: right -210px; color: #fff; }';
		css += '.kes-enable.selected { background-position: 0 -60px; }';
		css += '.kes-enable.selected span { background-position: left -150px; color: #fff; }';
		css += '.kes-switch {margin: 5px !important; }';
		css += '.kes-switch label { cursor: pointer; }';
		css += '.kes-switch input { display: none; }';
		css += 'td.kes_used { background-image: url("data:image/jpeg;base64,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"); }';
	/**/
		css += '.kes-table {border-collapse: collapse; border-spacing: 0; box-shadow: 0 0 3px 1px rgba(0,0,0,0.2); max-width: 520px; width: 90%; }';
		css += '.kes-table td, .kes-table th {border-top: 1px solid #DDD; line-height: 20px; padding: 8px; text-align: left; vertical-align: top; }';
		css += '.kes-table th {border-top: none; font-weight: bold; }';
		css += '.kes-table tbody > tr:nth-child(2n+1) > td, .kes-table tbody > tr:nth-child(2n+1) > th {background-color: #F9F9F9; }';
	/**/
		css += '.kes-width {width: 45px; margin: 0 0 0 5px; display: inline-block; vertical-align: text-top;}';
		css += '.kes-padding {margin: 0 5px; display: inline-block;}';
		css += '@media screen and (max-width:1024px) { .kes-user-settings {position: fixed; left: 30px; right: 30px; top: 30px; bottom: 30px; } }';
	/**/
		css += '.kes-notification {position: fixed; transition: all 0.3s ease-out; z-index: 100000; font-family: sans-serif; line-height: 40px; font-size: 35px; top: 25%; left: 25%; opacity: 1; width: 50%; min-height: 40px; text-align: center; background-color: #000; color: #fff; border-radius: 15px; text-shadow: 0 -1px 1px #ddd; box-shadow: 0 15px 15px -15px #000; }';
		css += '.kes_spinner { display: inline-block; width: 16px; height: 16px; vertical-align: text-top; background-image: url("data:image/gif;base64,R0lGODlhEAAQAPYAAO7TngAAAOrPm4h5Wn9wVN/FlLumfMqzhpSDYgAAAIV1WLmkey4pH0xEM93EkpuJZ4p6XOLJlnlrUBoXEaaTbpmIZpB/X+TKl+jOmp2LaMGrgD84KgsJB1lPO9C4itnAkLCcdCciGjIsIUE6K8awg7eieTgxJUlAMDozJkM7LMKsgb2nfVRKN6iVb9vCkWhdRaGOaqyYcq6ac1hOOlZMOVtRPH1vU9G6i3ZoTuzRnJeGZBYTDikkG1BHNQMDAkpCMb+pfjQuIlJJNhgVEODHlcixhZKBYdO7jNe/jzs1J5+NaSEdFh0aE6OQbGpeRkU9LjArIGNYQcSugrOfdyMfF3RnTT02KU5FNAkIBgcGBKSSbdW9jUc/L+bMmaqXcV9UP2FWQM62iJWEYxAOCx8cFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCAAAACwAAAAAEAAQAAAHaIAAgoMgIiYlg4kACxIaACEJCSiKggYMCRselwkpghGJBJEcFgsjJyoAGBmfggcNEx0flBiKDhQFlIoCCA+5lAORFb4AJIihCRbDxQAFChAXw9HSqb60iREZ1omqrIPdJCTe0SWI09GBACH5BAkIAAAALAAAAAAQABAAAAdrgACCgwc0NTeDiYozCQkvOTo9GTmDKy8aFy+NOBA7CTswgywJDTIuEjYFIY0JNYMtKTEFiRU8Pjwygy4ws4owPyCKwsMAJSTEgiQlgsbIAMrO0dKDGMTViREZ14kYGRGK38nHguHEJcvTyIEAIfkECQgAAAAsAAAAABAAEAAAB2iAAIKDAggPg4iJAAMJCRUAJRIqiRGCBI0WQEEJJkWDERkYAAUKEBc4Po1GiKKJHkJDNEeKig4URLS0ICImJZAkuQAhjSi/wQyNKcGDCyMnk8u5rYrTgqDVghgZlYjcACTA1sslvtHRgQAh+QQJCAAAACwAAAAAEAAQAAAHZ4AAgoOEhYaCJSWHgxGDJCQARAtOUoQRGRiFD0kJUYWZhUhKT1OLhR8wBaaFBzQ1NwAlkIszCQkvsbOHL7Y4q4IuEjaqq0ZQD5+GEEsJTDCMmIUhtgk1lo6QFUwJVDKLiYJNUd6/hoEAIfkECQgAAAAsAAAAABAAEAAAB2iAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4uen4ICCA+IkIsDCQkVACWmhwSpFqAABQoQF6ALTkWFnYMrVlhWvIKTlSAiJiVVPqlGhJkhqShHV1lCW4cMqSkAR1ofiwsjJyqGgQAh+QQJCAAAACwAAAAAEAAQAAAHZ4AAgoOEhYaCJSWHgxGDJCSMhREZGIYYGY2ElYebi56fhyWQniSKAKKfpaCLFlAPhl0gXYNGEwkhGYREUywag1wJwSkHNDU3D0kJYIMZQwk8MjPBLx9eXwuETVEyAC/BOKsuEjYFhoEAIfkECQgAAAAsAAAAABAAEAAAB2eAAIKDhIWGgiUlh4MRgyQkjIURGRiGGBmNhJWHm4ueICImip6CIQkJKJ4kigynKaqKCyMnKqSEK05StgAGQRxPYZaENqccFgIID4KXmQBhXFkzDgOnFYLNgltaSAAEpxa7BQoQF4aBACH5BAkIAAAALAAAAAAQABAAAAdogACCg4SFggJiPUqCJSWGgkZjCUwZACQkgxGEXAmdT4UYGZqCGWQ+IjKGGIUwPzGPhAc0NTewhDOdL7Ykji+dOLuOLhI2BbaFETICx4MlQitdqoUsCQ2vhKGjglNfU0SWmILaj43M5oEAOwAAAAAAAAAAAA=="); }';

	//#################################### JQUERY.KES ####################################//

	(function( $ ) {
		//############## PRIVATE HELPER METHODS ##############//
		var privateHelper = {
			encode : (typeof(JSON.stringify) == 'function') ? JSON.stringify : JSON.encode,
			decode : (typeof(JSON.parse) == 'function') ? JSON.parse : JSON.decode,
		};

		var callQueue = [];

		//############## METHODS FOR ALTERING THE DOM ##############//
		var kesForDom = {
			fadeOutRemove: function() {
				return this.each(function() {
					$(this).fadeOut(function() { $(this).remove(); });
				});
			},
			fadeInfadeOut: function() {
				return this.each(function() {
					$(this).fadeIn(function() { $(this).fadeOut(); });
				});
			},
			fadeOutfadeIn: function() {
				return this.each(function() {
					$(this).fadeOut(function() { $(this).fadeIn(); })
				});
			},
			multiCheckBoxes: function(values) {
				return this.each(function(i) {
					$(this).val(values[i]);
				});
			},
			resizeTextarea: function() {
				return this.each(function() {
					var textareaHeight = $(this).prop('scrollHeight'),
						windowHeight = window.innerHeight * 0.9,
						newHeight = (textareaHeight > windowHeight) ? windowHeight : textareaHeight;

						$(this).css({height: newHeight + 'px'});
				});
			},
			nullifyEmptyVal: function() {
				var value = $(this).val();
				return (value === '') ? 0 : value;
			}
		};

		//############## UTILITY METHODS ##############//
		var kesForUtil = {
			//######## SETTINGS ########//
			presets: function() {
				return {
					//* modul on/off
					modul: {
						troopsOnMap				: true,
						marketOptions			: true,
						showAttacksOnMap		: true,
						insertIntoRuntimeCalc	: true,
						highlightgroups			: false,
						massdisband				: true,
						simulator				: true,
						filterOverview			: true,
						bbCodeExport			: true,
						massforward				: true,
						trooplinks				: false,
						targetExport		 	: true,
						massbuild			 	: true,
						setGroupsOnMap			: true,
						sortOwnAttacks			: true
					},
					//* modul end
					kata_select: 'statue',
					spylink_amount: 500,
					units: {
						modul: {
							off: true,
							def: true,
							count: true,
							spy: true
						},
						off: {
							one: { amount: 1, unit:  7 }, two: { amount: 1, unit:  9 },
							color: '#FF8274', abbr: 'O'
						},
						def: {
							one: { amount: 1, unit:  8 }, two: { amount: 1, unit: 12 },
							color: '#98F5FF', abbr: 'D'
						},
						count: {
							one: { amount: 1, unit: 11 }, two: { amount: 1, unit: 12 },
							color: '#FFFAAA', abbr: 'G'
						},
						spy: {
							one: { amount: 1, unit:  5 }, two: { amount: 1, unit: 12 },
							color: '#D15FEE', abbr: 'K'
						}
					},
					market: {
						opt1: {	name:  '10k', option: 'opt1', stone:  10000, wood:  10000, iron:  10000 },
						opt2: { name:  '50k', option: 'opt2', stone:  50000, wood:  50000, iron:  50000 },
						opt3: {	name: '100k', option: 'opt3', stone: 100000, wood: 100000, iron: 100000	},
						opt4: {	name: '200k', option: 'opt4', stone: 200000, wood: 200000, iron: 200000 },
						opt5: {	name: '321k', option: 'opt5', stone: 300000, wood: 100000, iron: 200000 },
						opt6: {	name: '213k', option: 'opt6', stone: 200000, wood: 100000, iron: 300000	},
						d3fault: 'opt4'
					},
					highlightgroups: {
						one: { name: 'a', color: '#004563', group: {} },
						two: { name: 'b', color: '#A90641',	group: {} }
					},
					trooplinks: {
						one: {
							name: 'a', farmer: 0, sword: 0, spear: 0, axe: 0,
							bow: 0,	spy: 0,	light: 0, heavy: 0,	ram: 0,	kata: 0, snob: 0
						},
						two: {
							name: 'b', farmer: 0,	sword: 0, spear: 0,	axe: 0,
							bow: 0,	spy: 0,	light: 0, heavy: 0,	ram: 0,	kata: 0, snob: 0
						},
						three: {
							name: 'c', farmer: 0, sword: 0, spear: 0, axe: 0,
							bow: 0,	spy: 0,	light: 0, heavy: 0, ram: 0, kata: 0, snob: 0
						}
					}
				}
			},
			saveSettings: function(prefix, obj) {
				var save = {};
				for(var i in obj) {
					if (obj[i] instanceof Object) {
						if(prefix.indexOf('highlightgroups') > -1 && i == 'group') {
							var groups = {};
							$('#' + prefix + i + ' input:checked').each(function () {
								var id = $(this).prop('id');
								groups[id] = id;
							});
							save[i] = groups;
						} else {
							save[i] = $.kes('saveSettings', prefix + i + '_', obj[i]);
						}
					} else {
						var elem = $('#' + prefix + i);
						if (elem.is('input[type="checkbox"]')) {
							save[i] = (elem.prop('checked')) ? true : false;
						} else {
							if(i == 'color') {
								save[i] = (isValidColor(elem.val().slice(1))) ? elem.val() : obj[i];
							} else {
								save[i] = elem.val();
							}
						}
					}
				}
				return save;
			},
			//######## UTILITIES ########//
			getUrlParameters: function(url) {
				var query = {}, pair,
					search = url.substring(url.indexOf('?') + 1).split("&"),
				i = search.length;
				while (i--) {
					pair = search[i].split("=");
					query[pair[0]] = decodeURIComponent(pair[1]);
				}
				return query;
			},
			getGroups: function(villageId) {
				var url = '/popup.php?s=groups&m=village&village_id=' + villageId + av;
				var groups = [];
				$.ajax({
					type: 'POST',
					async: false,
					url: url,
					success: function(data) {
						$(data).find('table.borderlist').eq(0).find('tr > td').each(function () {
							var tmpIn = $(this);
							groups.push({ name: tmpIn.text().trim(), id: tmpIn.find('input').attr('value'), checked: (tmpIn.find('input:checked').length == 1) ? true : false })
						});
					}
				});
				return groups;
			},
			getSession: function(url) { // TODO: replace the other session functions
				return $.ajax({
					type: 'post',
					url: url
				});
			},
			genericBBCode: function(creator, data) {
				$('body').append('<div id="kes_box"><textarea style="width: 99%; max-height: 90% !important; resize: none;" id="kes_genericBBCode"></textarea></div><div id="kes_overlay" class="kes-backlight"></div>');

				$('#kes_genericBBCode').text(creator(data));

				$('#kes_overlay').fadeIn().bind('click',function () {
					$('#kes_overlay, #kes_box').kes('fadeOutRemove');
				});
				$('#kes_box').fadeIn();
				$('#kes_genericBBCode').kes('resizeTextarea');
			},
			prettyNumber: function(number) {
				return (number + '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			},
			paddedNumber: function(number) {
				return (parseInt10(number) < 10) ? '0' + number : number;
			},
			prettyTime: function(time) {
				return Math.floor(time / 3600) + ':' + $.kes('paddedNumber', Math.floor((time % 3600) / 60)) + ':' + $.kes('paddedNumber', Math.floor(time % 60));
			},
			queue: function(options) {
				//blindly stolen from http://code.google.com/p/jquery-ajaxq/source/browse/trunk/src/jquery.ajaxq.js

				var optionsCopy = {};
				for (var o in options) {
					if(options.hasOwnProperty(o)) {
						optionsCopy[o] = options[o];
					}
				}
				options = optionsCopy;

				// Override the original callback
				var originalCompleteCallback = options.complete;

				options.complete = function (request, status) {
					// Dequeue the current request
					callQueue.shift();

					// Run the original callback
					if(originalCompleteCallback) originalCompleteCallback(request, status);

					// Run the next request from the queue
					if(callQueue.length > 0) {
						$.ajax(callQueue[0]);
					} else {
						location.reload();
					}
				};

				callQueue.push(options);
				if (callQueue.length == 1) $.ajax(options);
			},
			//######## SAVING/LOADING TO/FROM window.localStorage ########//
			loadKey: function(key) {
				try {
					return privateHelper.decode(window.localStorage.getItem(key));
				} catch(e) {
					return window.localStorage.getItem(key);
				}
			},
			saveKey: function(key, value) {
				return window.localStorage.setItem(key, privateHelper.encode(value));
			},
			deleteKey: function(key) {
				var value = privateHelper.decode(window.localStorage.getItem(key));
				window.localStorage.removeItem(key);
				return value;
			},
			isKey: function(key) {
				return window.localStorage.getItem(key);
			}
		};

		var callKES = function(that, methodArray, method, args) {
			if (methodArray[method]) {
				return methodArray[method].apply( that, args);
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.kes' );
			}
		};

		$.fn.extend({
			kes: function(method) {
				return callKES(this, kesForDom, method, Array.prototype.slice.call( arguments, 1 ));
			}
		});

		$.extend({
			kes: function(method) {
				return callKES(this, kesForUtil, method, Array.prototype.slice.call( arguments, 1 ));
			}
		});
	})($);

	//* Used to see if the correct tab is active (bg-img equals "s_back")
	function identifyActiveTab(link) { return ($('td[background*="s_back"]').find('a[href*="' + link + '"]').length != 0);}

	//* Shortcut for parseInt(x,10)
	function parseInt10(arg) { return parseInt(arg, 10); }

	//* Check if input is a correct hexcolor
	function isValidColor(hexcolor) { return (/^([0-9a-f]{1,2}){6}$/i).test(hexcolor); }

	//* printf shim for easy string replacement
	function printf(string, s) {
		if (s instanceof Array ) {
			var o = string;
			for(var i in s) {
				if (s.hasOwnProperty(i)) {
					o = o.replace('%s', s[i]);
				}
			}
			return o;
		} else {
			return string.replace('%s', s);
		}
	}

	// calculate trooppoints for every player
	function calculateTroopScore(playerPage) {
		var playerPage 	  = $(playerPage);
		var cachedTable   = playerPage.find('table.borderlist').eq(2);
		var totalScore	= cachedTable.find('tr:nth-child(3) > td:last').html().replace(/\./g, "");
		var cities		= cachedTable.find('tr:nth-child(5) > td:last').html().replace(/\./g, "");
		var bonusScore	= (cities-1) * 2250;
		var troopScoremax = cities * 10000;
		var startIndex	= playerPage.find('table.borderlist').eq(3).find('tr > th:last').parent().index();
		var cityScore	 = 0;
		playerPage.find('table.borderlist').eq(3).find('tr:gt(' + startIndex + ')').each(function () {
			cityScore += Number($(this).find('td:last').html().replace(/\./g, ""));
		});
		return [totalScore - (bonusScore + cityScore), troopScoremax];
	}

	function displayAttacksWithSeconds(element) { // TODO: fix for multipage attacks

		function createDate(time) {
			var date = new Date();
			date.setHours(parseInt10(time[0]));
			date.setMinutes(parseInt10(time[1]));
			date.setSeconds(parseInt10(time[2]));
			return date;
		}

		function formatDate(date, text) {
			var formattedDate = text;
				formattedDate = formattedDate.replace(/\d+\.\d+\./, date.getDate() + '.' + $.kes('paddedNumber', (date.getMonth() + 1)) + '.');
				formattedDate = formattedDate.replace(/[0-9]{2}:[0-9]{2}/, date.getHours() + ':' + $.kes('paddedNumber', date.getMinutes()) + ':' + $.kes('paddedNumber', date.getSeconds()));

			return formattedDate;
		}

		$('table.borderlist').eq(element).find('tr').each(function () {
			var cur = $(this);
			if (cur.find('td:last > span').length > 0) {
				var incomming = cur.find('td:last > span').text().split(':');
				var servertime = createDate($('#servertime').text().split(':'));

				servertime.setSeconds(servertime.getSeconds() + parseInt(incomming[2], 10));
				servertime.setMinutes(servertime.getMinutes() + parseInt(incomming[1], 10));
				servertime.setHours(servertime.getHours() + parseInt(incomming[0], 10));

				var replacable = cur.find('td:nth-child(4)');
				var repl = replacable.text(); // original time left without seconds
				var replacer = formatDate(servertime, repl);

				replacable.text(replacer);
			}
		});
	}

	//* Filter overdue Attacks for attack display on map
	function filterOverdueAttacks(attacks) {
		var tmp_attacks = {};
		$.each(attacks, function (villageId) {
			village_attacks = attacks[villageId];
			tmp_attacks[villageId] = {};
			tmp_attacks[villageId].length = 0;
			for(var index in village_attacks) {
				if (village_attacks.hasOwnProperty(index)) {
					var single_attack = village_attacks[index];
					var time = parseInt10(single_attack[6]) - (Date.parse(new Date()) / 1000);
					if (time > 0) {
						tmp_attacks[villageId].length = index;
						tmp_attacks[villageId][tmp_attacks[villageId].length] = single_attack;
					}
				}
			}
			if (tmp_attacks[villageId].length == 0) {
				delete tmp_attacks[villageId];
			}
		});
		var count = 0;
		for (var item in tmp_attacks) {
			if (tmp_attacks.hasOwnProperty(item)) { count++; }
		}
		if (count == 0) {
			$.kes('deleteKey', 'kes_save_attacks');
		} else {
			$.kes('saveKey', 'kes_save_attacks', tmp_attacks);
		}
	}

	function displayTrooplinks() {
		var wordToDigit = { one: 1, two: 2, three: 3 };
		var o = '<div style="padding: 5px;"><span style="font-weight: bold;">(kes) ' + l.trooplinks + '</span>';
		for(var no in k.trooplinks) {
			if (k.trooplinks.hasOwnProperty(no)) {
				o += ' <span style="font-weight: bold;">#' + wordToDigit[no] + ' </span><span class="click kes_mark" id="kes_trooplink_' + no + '">' + arrow + ' ' + k.trooplinks[no].name + ' </span> ';
			}
		}
		return o + '</div>';
	}

	function isNewerVersion(vold, vnew) {
		var o = vold.replace(/\./g, ''), n = vnew.replace(/\./g, '');
		while(o.length != n.length) {
			if (o.length > n.length) { n += '0'; } else { o += '0'; }
		}
		return (parseInt10(n) > parseInt10(o)) ? true : false;
	}

	var draw = {
		helper: {
			colorValidation: function() {
				return '<span class="kes-color-validation"><span class="kes-icons kes-icon-valid"></span><span class="kes-icons kes-icon-invalid"></span></span>';
			},
			returnOptionsForObject: function (obj) {
				out   = '';
				for(var i in obj) {
					if (obj.hasOwnProperty(i)) {
						out += '<option value="' + i + '">' + obj[i] + '</option>';
					}
				}
				return out;
			},
			returnUnitsForTrooplinks: function (no) {
				var troops = k.trooplinks[no];
				var out = '';
				out += '<ul id="kes_trooplinks_' + no + '">';
				out += '<li><span class="kes-width">Name:</span><input type="text" id="kes_trooplinks_' + no + '_name"size="5" value="' + troops.name + '" max-length="7"></li>';
				// TODO unit runtime
				for(var unit in unit_runtime) {
					if (unit_runtime.hasOwnProperty(unit)) {
						out += '<li><span class="kes-width"><img src="/img/units/unit_' + unit + '.png"></span><input id="kes_trooplinks_' + no + '_' + unit + '" type="text" value="' + troops[unit] + '" size="5"></li>';
					}
				}
				out += '</ul>';
				return out;
			},
			getContrast: function (hexcolor) {
				var r = parseInt(hexcolor.substr(0,2),16), g = parseInt(hexcolor.substr(2,2),16), b = parseInt(hexcolor.substr(4,2),16), yiq = ((r*299)+(g*587)+(b*114))/1000;
				return (yiq >= 128) ? 'black' : 'white';
			},
			returnHighlightGroups: function (no) {
				var groups = [];
				var g = k.highlightgroups[no].group;
				if (av != '') {
					//only show groups that we already saved
					for(var i in g) {
						if (g.hasOwnProperty(i)) {
							groups.push(i);
						}
					}
				} else {
					if (premium) {
						$('#group_drop_down > table > tbody > tr').each(function (i) {
							groups[i] = $(this).find('td > a').html();
						});
						groups.shift();
					} else {
						groups.push(l.none);
					}
				}

				var disabled = (av != '') ? 'disabled' : '';
				var out = '';
				for(var i = 0; i < groups.length; i++) {
					var checked = (g[groups[i]]) ? 'checked="checked"' : '';
					out += '<li><p class="kes-switch"><label class="kes-enable' + ((checked) ? ' selected' : '') + '"><span>' + l.turnOn + '</span></label><label class="kes-disable' + ((checked) ? '' : ' selected') + '"><span>' + l.turnOff + '</span></label><input id="' + groups[i] + '" class="checkbox" type="checkbox" ' + checked + ' ' + disabled + ' ><span class="kes-width">' + groups[i] + '</span></li>';
				}

				return out;
			}
		},
		trooplinks: function () {
			var number = ['0', 'one', 'two', 'three'], o = '';
			for(var i = 1; i <=3; i++) {
				o += '<div class="kes-paragraph" style="float: left; min-width: 170px; width: 25%;">';
				o += '<h2>KES ' + l.troops + ' #' + i + '</h2><div class="kes_list">' + this.helper.returnUnitsForTrooplinks(number[i]) + '</div></div>';
			}
			return o;
		},
		highlightgroups: function (highlightgroups) {
			var o = (av != '') ? '<h2 id="groups_av" style="color:red; text-align: center;">' + highlightGroupsReplacementError + '</h2>' : '', no = 1;
			for(var i in highlightgroups) {
				if (highlightgroups.hasOwnProperty(i)) {
					o += '<div class="kes-paragraph" style="float: left; min-width: 250px; width: 25%">';
					o += '<h2>KES ' + l.group + ' #' + no + '</h2><ul id="kes_highlightgroups_' + i + '_group"><li><span class="kes-width">' + l.name + ':</span><input id="kes_highlightgroups_' + i + '_name" size="5" maxlength="4" type="text" value="' + highlightgroups[i].name + '"></li>';
					o += '<li><span class="kes-width">' + l.color + ':</span><input class="kes_color" id="kes_highlightgroups_' + i + '_color" type="text" maxlength="7" size="9" value="' + highlightgroups[i].color + '"';
					o += 'style="text-transform: uppercase; background-color: ' + highlightgroups[i].color + '; color: ' + this.helper.getContrast(highlightgroups[i].color.substring(1)) + ';">' + this.helper.colorValidation() + '</li>';
					o += this.helper.returnHighlightGroups(i) + '</ul></div>';
					no++;
				}
			}
			return o;
		},
		highlighttroops: function (unitsettings, units) {
			var o = '', unitlist = this.helper.returnOptionsForObject(units), list, amount = l.amount, color = l.color, none = l.none;
			for(var modul in unitsettings) {
				if (unitsettings.hasOwnProperty(modul)) {
					var checked = (unitsettings[modul]) ? 'checked="checked"' : '', hidden = '',
						listOne = unitlist, listTwo = unitlist + '<option value="12">' + none +'</option>', hidden = '';
					if (['spy', 'count'].indexOf(modul) > -1) {
						// modul is count or spy
						hidden = 'display: none;';
						listOne = '<option value=' + k.units[modul].one.unit + '></option>';
						listTwo = '<option value="12"></option>';
					}
					o += '<div class="kes-paragraph kes_troops" style="margin: 10px; float: left; width: 35%; min-width: 340px;"><h2>' + l[modul] + '</h2><p class="kes-switch"><label class="kes-enable' + ((checked) ? ' selected' : '') + '"><span>' + l.turnOn + '</span></label><label class="kes-disable' + ((checked) ? '' : ' selected') + '"><span>' + l.turnOff + '</span></label><input class="checkbox" type="checkbox" id="kes_units_modul_' + modul + '" ' + checked +'></p>';
					o += '<span style="vertical-align: sub;" class="kes-padding">' + l.abbr + ':</span><input style="width: 24px; text-align:center" type="text" id="kes_units_' + modul + '_abbr" size="1" maxlength="1" value="' + k.units[modul].abbr + '">';
					o += '<span class="kes-padding">' + color + ':</span><input class="kes_color" id="kes_units_' + modul + '_color" type="text" maxlength="7" size="9" value="' + k.units[modul].color + '" style="text-transform: uppercase; background-color: ' + k.units[modul].color + '; color: ' + this.helper.getContrast(k.units[modul].color.substring(1)) + ';">' + this.helper.colorValidation() + '<br />';
					o += '<span class="kes-padding">' + amount + ':</span><input id="kes_units_' + modul + '_one_amount" value="' + k.units[modul].one.amount + '" type="text" size="9" maxlength="5">';
					o += '<span class="kes-padding" style="' + hidden + '">' + l.unit + ' 1:</span><select id="kes_units_' + modul + '_one_unit" style="' + hidden + '"">' + listOne+ '</select><br/>';
					o += '<span class="kes-padding" style="' + hidden + '">' + amount + ':</span><input id="kes_units_' + modul + '_two_amount" value="' + k.units[modul].two.amount + '" type="text" size="9" maxlength="5" style="' + hidden + '">';
					o += '<span class="kes-padding" style="' + hidden + '">' + l.unit + ' 2:</span><select id="kes_units_' + modul + '_two_unit" style="' + hidden + '">' + listTwo + '</select></div>';
				}
			}
			return o;
		},
		modul: function (settings, modul) {
			var o = '';
			for(var m in settings) {
				if (settings.hasOwnProperty(m)) {
					var checked = (modul[m]) ? 'checked="checked"' : '';
					o += '<li class="kes-paragraph" style="margin: 5px 0;"><p class="kes-switch"><label class="kes-enable' + ((checked) ? ' selected' : '') + '"><span>' + l.turnOn + '</span></label><label class="kes-disable' + ((checked) ? '' : ' selected') + '"><span>' + l.turnOff + '</span></label><input id="kes_modul_' + [m] + '" class="checkbox" type="checkbox" ' + checked + '><span class="kes-padding">' + l['modul'][m] + '</span></li>';
				}
			}
			return o;
		},
		returnMarketInputs: function (market) {
			var o = '', c = 1;
			for(var opt in market) {
				if (market.hasOwnProperty(opt) && opt != 'd3fault') {
					o += '<tr><td><span class="kes-padding">#' + c + '</span>';
					o += '<input id="kes_market_' + opt +'_name" value="' + market[opt].name + '" type="text" size="10" maxlength="10"></td><td>';
					o += '<input id="kes_market_' + opt +'_option" value="' + market[opt].option + '" type="text" size="10" maxlength="10" style="display: none;">';
					o += '<input id="kes_market_' + opt +'_stone" value="' + market[opt].stone + '" type="text" size="6" maxlength="6"></td><td>';
					o += '<input id="kes_market_' + opt +'_wood" value="' + market[opt].wood + '" type="text" size="6" maxlength="6"></td><td>';
					o += '<input id="kes_market_' + opt +'_iron" value="' + market[opt].iron + '" type="text" size="6" maxlength="6"></td></tr>';
					c++;
				}
			}
			return o;
		},
		returnMarketDefault: function (market) {
			var o = '';
			for(var opt in market) {
				if (market.hasOwnProperty(opt) && opt != 'd3fault') {
					o += '<option value="' + opt + '">' + k.market[opt].name + '</option>';
				}
			}
			return o;
		}
	};

	function putSettings(start_tab) {

		var html = '';
			html += '<div id="kes_overlay" class="kes-backlight"></div>';
			html += '<div class="kes-user-settings">';
			html += '	<a href="#" id="kes_close" class="kes-close">';
			html += '		<span class="kes-icons kes-icon-close"></span>';
			html += '	</a>';
			html += '	<span id="kes_save_success" class="kes-saved">' + l.saved + '<span class="kes-icons kes-icon-saved"></span></span>';
			html += '	<div>';
			html += '		<div class="kes-menu-wrapper">';
			html += '				<span class="kes-heading">Kingsage Enhancement Suite<a href="http://kes.egoserv.com/whykes" target="_blank"><span class="kes-icons kes-icon-home"></span></a></span><span class="kes-subheading">version ' + version + '</span>';
			html += '			<div class="kes-menu">';
			html += '				<div class="kes-separator"></div>';
			html += '				<a href="#" id="kes_reset_settings">' + l.resetSettings + '</a>';
			html += '				<div class="kes-separator"></div>';
			html += '				<a href="#" rel="content_modules">' + l.enableDisableModules + '</a>';
			html += '				<a href="#" rel="content_trebuchet">' + l.buildingTrebuchet + '</a>';
			html += '				<a href="#" rel="content_spy">' + l.linkspy + '</a>';
			html += '				<a href="#" rel="content_market">' + l.marketSettings + '</a>';
			html += '				<a href="#" rel="content_troops">' + l.highlighttroops + '</a>';
			html += '				<a href="#" rel="content_groups">' + l.highlightgroups + '</a>';
			html += '				<a href="#" rel="content_trooplinks">' + l.trooplinks + '</a>';
			html += '				<div class="kes-separator"></div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div id="content_modules" class="kes-content-wrapper"><div class="kes-content-title"><h1>' + l.enableDisableModules + '</h1></div><div class="kes-content"><ul>' + draw.modul(presets.modul, k.modul) + '</ul></div></div>';
			html += '		<div id="content_trebuchet" class="kes-content-wrapper">';
			html += '			<div class="kes-content-title"><h1>' + l.buildingTrebuchet + '</h1></div>';
			html += '			<div class="kes-content">';
			html += '				' + l.contentTrebuchet + ': <select id="kes_kata_select" style="width: 125px;"> ' + draw.helper.returnOptionsForObject(buildings) + '</select>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div id="content_spy" class="kes-content-wrapper">';
			html += '			<div class="kes-content-title"><h1>' + l.spy + '</h1></div>';
			html += '			<div class="kes-content">' + printf(l.contentSpy, '<input id="kes_spylink_amount" type="text" maxlength="5" size="6" value="' + k.spylink_amount + '">') + '</div>';
			html += '		</div>';
			html += '		<div id="content_market" class="kes-content-wrapper">';
			html += '			<div class="kes-content-title"><h1>' + l.marketSettings + '</h1></div>';
			html += '			<div class="kes-content">';
			html += '				' + l.marketDefault + ':   <select id="kes_market_d3fault">' + draw.returnMarketDefault(k.market) + '</select>';
			html += '			<table class="kes-table"><tbody>';
			html += '				<tr><th><b>' + l.name + '</b></th><th><b>' + l.stone + '</b></th><th><b>' + l.wood + '</b></th><th><b>' + l.iron + '</b></th></tr>';
			html += '				' + draw.returnMarketInputs(k.market) + '';
			html += '			</tbody></table>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div id="content_troops" class="kes-content-wrapper"><div class="kes-content-title"><h1>' + l.highlighttroopsLabel + '</h1></div><div class="kes-content">' + draw.highlighttroops(k.units.modul, units) + '</div></div>';
			html += '		<div id="content_groups" class="kes-content-wrapper"><div class="kes-content-title"><h1>' + l.highlightGroupslabel + '</h1></div><div class="kes-content">' + draw.highlightgroups(k.highlightgroups) +'<br style="clear: left;"></div></div>';
			html += '		<div id="content_trooplinks" class="kes-content-wrapper"><div class="kes-content-title"><h1>' + l.modul.trooplinks + '</h1></div><div class="kes-content">' + draw.trooplinks() + '</div></div>';
			html += '	</div>';
			html += '</div>';
		$('body').append(html);

		//* set default/user-settings for select boxes, order has to be top to bottom (occurence in the html) for this to match properly
		$('#kes_kata_select, #kes_market_d3fault, #kes_units_off_one_unit, #kes_units_off_two_unit, #kes_units_def_one_unit, #kes_units_def_two_unit')
			.kes('multiCheckBoxes', [k.kata_select, k.market[k.market.d3fault].option, k.units.off.one.unit, k.units.off.two.unit, k.units.def.one.unit, k.units.def.two.unit]);
		//* validate colors on the go
		$('input[class*="kes_color"]').keyup(function () {
			var color = $(this).val().slice(1);
			if (isValidColor(color)) {
				$(this).css('background-color', $(this).val());
				$(this).next('.kes-color-validation').find('span').hide().end().find('.kes-icon-valid').css({opacity: 0, display: 'inline-block'}).animate({opacity: 1}, 600);
			} else {
				$(this).next('.kes-color-validation').find('span').hide().end().find('.kes-icon-invalid').css({opacity: 0, display: 'inline-block'}).animate({opacity: 1}, 600);
			}
		});

		$('.kes-enable, .kes-disable').click(function() {
			var parent = $(this).parent('.kes-switch');
			$('.kes-enable, .kes-disable', parent).toggleClass('selected');
			$('.checkbox', parent).prop('checked', !$('.checkbox', parent).prop('checked')).trigger('change');
		});

		//* menu handling
		function switch_tabs(obj) {
			if(obj.attr('rel')) {
				$('.kes-content-wrapper').hide();
				$('.kes-menu a').removeClass('kes-active');
				var id = obj.attr('rel');
				$('#'+id).slideDown(800);
				obj.addClass('kes-active');
			}
		}

		$('.kes-menu a').click(function () { switch_tabs($(this)); });
		switch_tabs($('.kes-menu a[rel="' + start_tab + '"]'));

		//* finally fades in the settings
		setTimeout(initSettings, 50) // setTimeout is a fix for a strange DOM related bug that wouldnt fadeIn the settings on first usage
		//* fades out the settings
		$('#kes_overlay, #kes_close').bind('click', exitSettings);
		//* reset settings
		$('#kes_reset_settings').bind('click', function () {
			q = confirm(l.resetSettings + '?');
			if (q) {
				$.kes('saveKey', 'kes_user_settings', presets);
				exitSettings();
				updateSettings();
			}
		});
		//* save settings

		$('.kes-user-settings').on('change', 'input, select', function(){
			//* save settings
			$.kes('saveKey', 'kes_user_settings', $.kes('saveSettings', 'kes_', presets));
			$('#kes_save_success').kes('fadeInfadeOut');

			//* auto close on save and update settings
			updateSettings();
		});
	}

	function initSettings() {
		$('.kes-backlight').fadeIn(200);
		$('.kes-user-settings').slideDown(600);
	};

	function exitSettings() {
		$('.kes-backlight').fadeOut(600);
		$('.kes-user-settings').slideUp(600);
		setTimeout(function (){ $(".kes-backlight, .kes-user-settings").remove(); }, 700);
	};

	//* Overwrite presets with (existing) user settings
	function updateSettings() { k = $.kes('loadKey', 'kes_user_settings'); }

	//* initialize everything as default;
	var presets = $.kes('presets');
	var k = presets;
	//* check for stored user settings and change vars accordingly
	if ($.kes('isKey', 'kes_user_settings')) {
		updateSettings();
	} else {
		//* this is the first time the script is opened
		putSettings('content_modules');
		//* save presets in advance to prevent this from spawning if the users chooses not to click save
		$.kes('saveKey', 'kes_user_settings', k);
		//* if there is no version make sure, new settings get updated by setting the version to zero
		if (!$.kes('isKey', 'kes_version')) {
			$.kes('saveKey', 'kes_version', '0');
		}
	}
	//* if it is a newer version update user settings inserting new settings with default values
	if (isNewerVersion($.kes('loadKey', 'kes_version'), version)) {
		//* update settings
		function iterateSettings(presets, settings) {
			//* sanitiy check for empty prefix objects
			if(Object.getOwnPropertyNames(presets).length == 0) return settings;

			var new_settings = {};
			for(var i in presets) {
				if (settings.hasOwnProperty(i)) {
					if (presets[i] instanceof Object && !(presets[i] instanceof Array)) {
						new_settings[i] = iterateSettings(presets[i], settings[i]);
					} else {
						new_settings[i] = settings[i];
					}
				} else {
					new_settings[i] = presets[i];
				}
			}
			return new_settings;
		}
		var updated_settings = {};
		if ($.kes('isKey', 'kes_user_settings')) {

			try {
				settings = $.kes('loadKey', 'kes_user_settings');
				updated_settings = iterateSettings(presets, settings);
			} catch(e) {
				window.alert(l.adoptSettings);
				updated_settings = presets;
			}

		} else { updated_settings = presets; }
		//* update user_settings
		$.kes('saveKey', 'kes_user_settings', updated_settings);
		//* update version
		updateSettings();
		$.kes('saveKey', 'kes_version', version);
	}

	//* append the settings link
	$('div[id*="lay_castle_widget"] > ul > li').eq(1).append('<a class="widget_icon widget_icon_1" style="cursor: pointer;" id="kes_show_settings">kes</a>');
	$('#kes_show_settings').bind('click', function () { putSettings('content_modules'); });
