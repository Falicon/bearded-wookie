bearded-wookie
==============

A javascript game engine (initially developed for use with [txtgame](http://txtgame.net) ).

### Background

This is a simple game engine built entirely in javascript to power text based adventure/puzzle games (i.e. games inspired by the likes of [Zork](http://en.wikipedia.org/wiki/Zork)).

The initial version of this engine was built to power the backend of a mobile game called [txtgame](http://txtgame.net). The mobile app was built using [phonegap](http://phonegap.com). A modified version, designed to work with [NodeJS](http://nodejs.org/), now also powers the version of [txtGame](http://txtgame.net) that is playable at the website.

The basic idea was to be able to develop new text-based adventures simply by focusing on, and defining, the specific story and puzzles (and not have to worry about 'programming' each time you wanted to build a new game).

At it's core the engine simply manages the state of a few key JSON objects (primarily 'story'), and returns the results of each attempted action in an array of text results.

The 'story' JSON object contains all the unique details of a given game (more details on how to properly define the 'story' object below). So to build a new, unique game the core of what you will need to do is just define a new 'story' object.

To see the engine in action you should be able to simply load the index.html file into your browser and play the example game included here. From there, you should play around with making adjustments to the game_file.js to see just what happens and how easy it should be to build out some really fun games.

### The files

**game_control.js**

Contains a set of javascript functions that are useful for handling the interaction between the game engine and the browser/html.

**game_engine.js**

The core logic/processing happens here. If you are defining new commands or actions that are not already supported, you will need to make adjustments to this file.

The list of supported commands can be found by issuing the 'help' command in the example file.

**game_file.js**

The story behind your game. This is where you will define all of your characters, objects, puzzles, and your map.

See 'defining the story' below for more details on how to properly define your story.

**index.html**

A bare bones example implementation that ties all the files together into a working/playable text-based, in-the-browser, adventure game.

### Defining the story

The core of the work you will need to do to build your own text-based adventures is to define your own story (an example you can start with can be found in game_file.js).

The story is really just a JSON object that has a few specifc values that must be set:

- plot
- missions
- character
- enemies
- friendlies
- objects
- spells
- map

All of these properties are required, and most have requirements and options within themselves as well. More details on each follows.

###### plot

This is a simple bit of text. You should try to sum up the point of your game in a sentence or two so that people can quickly understand (and share) it.

###### missions

This should be an array of missions you want your players to try and accomplish throughout the game. An example of a mission is:

```JSON
  {
    "name":"hunt for the red troll",
    "status":"unresolved",
    "detail":"Find and kill the red troll.",
    "point_value":100,
    "puzzles":[
      {
        "cmd":"build",
        "solution":"poison sword",
        "detail":"create a special weapon.",
        "status":"unresolved"
      }
    ]
  }
```

You can have as many missions as you like (I like to think of them like subplots or mini-bosses/challenges).

###### character

This is where the player or main character is defined.

```JSON
  {
    "name":"Falicon",
    "karma":0,
    "x":12,"y":8,"z":0,
    "lives":1,
    "score":0,
    "health":100,
    "max_health":100,
    "magic":10,
    "max_magic":10,
    "coins":20,
    "power_range":[0,10],
    "items":[],
    "spells":["heal"],
    "equiped":["candle"]
  }
```

In the example above the character would start with full health, 20 coins, 10 magic points, a candle, and already knows the 'heal' spell.

**NOTE:** The x, y, z coordinates define where the player will start on the map, so make sure that you define a spot that actually exists on your map (or your players will be stuck before they even start)!

###### enemies

Enemies are the things within your game that can be attacked/killed by the player.

```JSON
  {
    "name":"troll",
    "type":"fixed",
    "spawn":{"x":3,"y":5,"z":1,"health":10},
    "x":3,"y":5,"z":1,
    "power_range":[1,25],
    "health":25,
    "point_value":5,
    "detail":"A foul, smelly creature.",
    "items":[]
  }
```

There are a lot of options available when defining an enemy, but the important ones are of course the x, y, z coordinates (they define where the enemy starts on the map), the type (fixed, roaming, run, chase), the health, and the power_range.

If you want enemies to attack a character when they encounter them, set the 'disposition' to aggressive.

If you want to require a special weapon be used to attack a given enemy, you define a 'required' array and then simply list the weapons that can be used (all other attempts to attack the enemy will result in a miss). You can specify a blank value '' as an item to denote that hand-to-hand combat can be used to attack. See the 'red troll' enemy in the game_file.js file for an example of requiring an item to attack.

If you define an array of items that the enemy has on them, the character will drop the items in the room when defeated (and the items will then be available to the player to take).

If you define spawn details, when the enemy is killed by a player it will (eventually) respawn at the location and with the health specified.

**NOTE:** Enemies are constrained to the map just like the main character and the friendlies, so it's important to make sure you place them on locations that exist. An enemy set to roam or run will only do so if there is a defined exit for them to take.

###### friendlies

Friendlies are the things within your game that can provide useful clues and items to the player. They can not be attacked or killed.

```JSON
  {
    "name":"old man",
    "x":4,"y":6,"z":1,
    "type":"fixed",
    "detail":"a wise looking old man.",
    "conversation":{
      "default":"There is a red troll wreaking havoc nearby. Please help rid him of our land! You should be able to find a sword to help west of here."
    },
    "puzzles":[
      {
        "cmd":"pray","solution":"old man","items":["poison sword"],"detail":"Thanks! Take this for your efforts!"
      }
    }
  }
```

There are a lot of options available when defining a friendly, but the important ones are of course the x, y, z coordinates (they define where the friendly starts on the map), the type (fixed or roaming), and conversation.

When a players says something to a friendly (via the 'say' command) a regular expression is used to try and matach against the keys of the converastion variable. If no matches are found, then the 'default' conversation is said back to the player.

Friendlies can also have puzzles associated to them. In this example, when a player issues the command of "pray to old man" the puzzle would be solved and they would be given a poison sword.

###### objects

Objects are the things that can be examined and used throught the game.  There are a handful of different object types (item, consumable, weapon, recovery).

The basic object is of type 'item' and is really just something a player can look at, take, and give.

An object of type 'weapon' can be 'equiped' and/or used to 'attack' enemies with. Weapons should have a defined power_range.

An object of type 'consumable' can be consumed ("eat") by a player and usually has some type of effect on the player's health value. Consumables should have a defined health_bump.

An object of type 'recovery' can be used by a player and usually has some type of effect on the player's health value.  Recovery items should have a defined health_bump.

```JSON
  {
    "name":"bank key",
    "type":"item",
    "detail":"A safe deposit key.",
    "build_with":["blue key part","red key part"]
  }
```

###### spells

Spells are actions the player can learn/use throughout the game.

```JSON
  {
    "name":"heal",
    "detail":"With proper mental focus you are able to heal yourself a bit.",
    "magic_cost":2,
    "adjust_health":25
  }
```

**NOTE:** You can set a magic_cost of 0 if you want the player to be able to cast the spell an unlimited amount of times. Otherwise you will want to offer some puzzles that reward the user with 'adjust_magic' so that they can replenish their magic.

###### map

The 'meat' of your game sits with your map. You will need to define every location that a player can go to, what the exits are, and what objects/items/puzzles are within each room.

```JSON
  {
    "name":"3-6",
    "x":3,"y":6,"z":1,
    "description":"",
    "objects":["lever"],
    "exits":["n","e"],
    "puzzles":[
      {
        "cmd":"pull",
        "solution":"lever",
        "detail":"A small section of the wall slides down revealing a compartment.",
        "items":["sword"]
      }
    ]
  }
```

There are a lot of options available when defining your map (see the example game_file.js to get some ideas). The most important of course it the x, y, z coordinates and it's important that you make the combination of them unique for each room defined (you can't have two different places in the same location on a map!).

If you include an 'objects' array, these are objects that are in the room and can be interacted with (push/pull as an example) but can not be taken by the player.

If you include an 'items' array, these are objects that are in the room and can be taken by the player.

If you include an 'hidden_items' array, these are objects that can only be discovered by the player when they 'dig' in the location (**note** they need to have a shovel item in their inventory before they can dig).

In order for players to be able to move around the map, you will need to define exits from room to room. You can define regular exits, hidden_exits, and locked_exits. Regular exits are available as soon as the player enters the room, hidden_exits can be revealed when a puzzle is solved, and locked_exits can be unlocked when a puzzle is solved (eg use key).

**NOTE:** Generally you should define exits that go both ways. That is, if you define an exit N in a spot on the map, the spot north of that location should probably have an exit S defined as well (so the player can move back and forth between the rooms).

### Advice

The game engine is designed to be pretty flexible and has **a lot** of options that are not defined or outlined here.  So play around with the example file(s) and see what happens. The game_file.js should give you a good start in understanding a lot of the basics, but there are a lot of combinations and details that it doesn't cover (in order to keep it as simple as possible for beginners).

So when in doubt, just give it a try...**you never know what might happen**!

### Questions?

If you have suggestions, questions, or ideas about anything here or just need some help...please feel free to reach out to Kevin Marshall at **info at falicon.com** any time.

