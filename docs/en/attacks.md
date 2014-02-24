# Attacks

<a name="attacks-by-second"></a>
#### Display attacks with seconds

+ KES will calculate the time of arrival in with second precision using the servertime and a timestamp on the attack

<a name="insert-into-runtimecalculator"></a>
#### Insert attacks into runtime calculator 

> **Requirements** 

> + `Insert attacks into runtimecalculator` is activated on the settings page

**How it works**

+ The attacksymbol in the first column of the table is converted into a link
+ Clicking on the link the runtime calculator will be openend and the coordinates as well as the time of arrival will be passed in

[Go to runtime calculator documentation](/docs/runtimecalculator)

<a name="save-attacks"></a>
#### Save attacks

> **Requirements** 

> + `Save attacks/show attacks on map` is activated on the settings page

**How it works**

+ "Save these attacks" saves all attacks on the current page
+ Settlements under attack will be marked on the map

[Go to map documentation](/docs/map#show-attacks)

#### Load all attacks

+ If more than one page of attacks is present you can load them into on page using "Load all attacks"
+ After all attacks have been loaded you can filter through them

see below for more information on filtering attacks

#### Filter attacks

+ You can choose which column to filter
+ Either choose attacker or defender (Defender is the default setting)
+ You can enter playername, coordinates, alliance, contintent and settlementname into the search
+ Search starts automatically during input
+ Amount of hits is displayed besides the search
+ "Reset" empties the search and resets the results
