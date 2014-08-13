bearded-wookie
==============

A javascript game engine (initially developed for use with [txtgame](http://txtgame.net) ).

### Background

This is a simple game engine built entirely in javascript to power text based adventure/puzzle games.

The idea is to be able to develop new text-based adventures simply by focusing on, and defining, the specific story and puzzles (and not have to worry about 'programming').

At it's core the engine is simply manages the state of a few key variables (primarily 'story'), and returns the results of each attempted action in an array of text results.  The 'story' is defined as a json object and contains all the details of a given game (more details on how to properly define a 'story' below).

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
- map

All of these properties are required, and most have requirements and options within themselves as well. More details on each follows.

###### plot

This is a simple bit of text. You should try to sum up the point of your game in a sentence or two so that people can quickly understand (and share) it.

###### missions

This should be an array of missions you want your players to try and accomplish throughout the game. An example of a mission is:

'''
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
'''

You can have as many missions as you like (I like to think of them like subplots or mini-bosses/challenges).

###### character

This is where the player or main character is defined.

'''
  character = {
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
    "equiped":[]
  }
'''

In the example above the character would start with full health, 20 coins, 10 magic points, and already knows the 'heal' spell.

**NOTE:** The x, y, z coordinates define where the player will start on the map, so make sure that you define a spot that actually exists on your map (or your players will be stuck before they even start)!

###### enemies

more info soon.

###### friendlies

more info soon.

###### objects

more info soon.

###### map

more info soon.

### Advice

Play around with the example file(s) and see what happens. The game_file.js should give you a good start in understanding a lot of the basics, but there are a lot of combinations and details that it doesn't cover (in order to keep it as simple as possible for beginners). So when it doubt, just give it a try...you never know what might happen!

### Questions?

If you have questions about anything here or need help, please feel free to reach out to Kevin Marshall at info at falicon.com any time.