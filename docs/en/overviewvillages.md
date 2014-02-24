# Overviews

## Combined

#### Filter troops by time of arrival

> **Requirements** 

> + `Filter troops by time of arrival` is activated on the settings page

**How it works**

+ You can input
	+ Amount of troops to be present
	+ Target coordinates
	+ Runtime
+ Runtime can be ignored checking the "Without runtime" checkbox
+ "Save" saves the input for future use
+ Troop quicklinks apply the troop presets to the respective fields
+ "Filter" checks for every settlement on the page
	+ if the troops can arrive within the given runtime at the target coordinates
	+ if enough troops are available
+ Settlements not matching the criteria are hidden
+ A column containingt the runtime is added to settlements matching the criteria
+ Runtime is a link to the barracks
+ Clicking the link will enter the troops into the barracks formfields so you can send out the attack/support as fast as possible

## Research

#### Automated research

+ "Research missing troops" researches missing troops for every settlement on the page
+ If no missing research is found an error is displayed
+ Upon finishing research the page is reloaded
+ Research that is still missing needs either ressources or is missing the requirements to research a unit

## Troops > Supports

#### Recall support

+ A link labeled "All" allows you to select all support stationed in a specific settlement
+ Recall recalls supports as usual

## Commands > Attacks

> **Requirements** 

> + `Sort own attacks` is activated on the settings page

**How it works**

+ "Sort own attacks" creates a table containing all attacks targeting a specific settlement
+ Amount of attacks per settlement is displayed (Attacks using counts in parenthesis)
+ First impact and last impact are listed

Sorting your own attacks can help keeping on top of big offenses as you can easily see if you are missing any counts to conquer the settlement or similar.

## Incomming

#### Display attacks with seconds

Go to [Display attacks with seconds](/docs/attacks#attacks-by-second)

#### Insert attacks into runtime calculator 

Go to [Insert attacks into runtime calculator ](/docs/attacks#insert-into-runtimecalculator)

## Incomming > Not-ignored

#### Ignore attacks

+ A checkbox is added to every attacks
+ You can select all attacks via the checkbox at the bottom of the page
+ "Ignore" ignores all attacks that are selected

This feature enables you to ignore attacks in multiple settlement via a central page without having to visit each settlements barracks

## Groups

+ "edit" is replaced by "x Groups have been selected"
+ Clicking the replacement link will open a list containing all available groups
+ You can select/deselect a group by checking/unchecking the checkbox next to the group name
+ All changes are saved automatically


