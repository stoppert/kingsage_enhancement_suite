# Barracks

## Commands

#### Coordinate-formfields

+ KES removes Zeroes as values in Coordinate-formfields

#### Quickly insert troops

> **Requirements**

> + `Troop quicklinks in barracks` is activated on the settings page

**How it works**

+ "Select all" insert all available troops into the formfields
+ Troop quicklinks #1, #2, #3 insert troop amounts according to the settings

#### Default target trebuchet

+ KES selects the default trebuchet target specified in the settings for every attack that uses trebuchets

## Mass discharge

> **Requirements**

> + `Customize mass discharge` is activated on the settings page

**How it works**

Under normal circumstances mass discharge discharges the amount of troops specified in the formfields.
When `customize mass discharge` is activated KES will discharge only excess troops.

**Example**

+ Troops avaible: 12000 Berserker
+ Input: 10000 Berserker

+ Result with customize mass discharge 10000 Berserker
+ Result without customize mass discharge 2000 Berserker

## Simulator

> **Requirements**

> + `Customize simulator` is activated on the settings page

**How it works**

+ Troopamounts are displayed as whole numbers again (5k is displayed as 5.000)
+ Ressources are displayed as whole numbers again
+ To toggle between both views click on the button on the left hand side
