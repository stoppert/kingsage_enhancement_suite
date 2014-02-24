# Map

#### Hightlight troops on map

> **Requirements** 

> + `Highlight troops on map` is activated on the settings page
> + "Show troops" has to be researched via the alchemist and activated in the map settings

**How it works**

+ You can define presets for offense, defense, counts and spies on the settings page
	+ Color
	+ Symbol
	+ Amount and unit used
+ The presets determine whether a settlement is marked (If enugh units of the selected type are available)
+ The four groups can be turned on and off individually

#### Highlight groups on map

> **Requirements** 

> + `Highlight groups on map` is activated on the settings page

**How it works**

+ You can add groups to two categories on the settings page
+ Categories are thought of to be offense and defense
+ If a settlement is part of on of the selected groups it will be marked as the category that the group belongs to
+ This is independant of amount of troops available in the settlement

<a name="show-attacks"></a>
#### Show attacks on map

> **Requirements** 

> + `Save attacks/show attacks on map` is activated on the settings page
> + Currently running attacks have to be saved [How to save attacks?](/docs/attacks#save-attacks)

**How it works**

+ Settlements currently under attack on the active part of the map are marked
+ Moving the mouse over a marked settlement reveals a popup
+ The popup contains information about all saved attacks for the specific settlement
	+ Amount of attacks
	+ Next impact
	+ Attacker
	+ Settlement of the attacker
+ Attacks that have already arrived are automatically removed from the list of saved attacks

#### Export targets from map

> **Requirements** 

> + `Export targets from map` is activated on the settings page

**How it works**

+ KES adds a form at the top of the map
+ The input can be filled with player names (look out for correct spelling!)
+ You export only abandoned settlements using a checkbox
+ You can choose to output the results as BB-Code using a checkbox
+ Clicking on "Export targets" will create a popup containing the settlements selected according to the input

#### Set groups via map

> **Requirements** 

> + `Set groups via map` is activated on the settings page

**How it works**

+ KES adds a dropdown menu as well as a button at the top of the map
+ You can choose a group that you want to apply to all settlements currently on displayed on the map
+ Clicking "Set group" will apply the selected group to all settlements on the map
