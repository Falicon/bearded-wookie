var story = {
  "plot":"The red troll.",
  "missions":[
    {
      "name":"hunt for the red troll",
      "status":"unresolved",
      "detail":"Find and kill the red troll.",
      "point_value":100,
      "puzzles":[
        {"cmd":"build", "solution":"poison sword", "detail":"create a special weapon.", "status":"unresolved"}
      ]
    }
  ],
  "character": {
    "name":"Falicon","karma":0,
    "x":12,"y":8,"z":0,"lives":1,
    "score":0,"health":100,"max_health":100,
    "magic":10,"max_magic":10,
    "coins":20,"power_range":[0,10],
    "items":[],
    "spells":["heal"],
    "equiped":[]
  },
  "spells":[
    {"name":"heal","detail":"With proper mental focus you are able to heal yourself a bit.","magic_cost":2,"adjust_health":25},
  ],
  "enemies": [
    {"name":"troll","type":"fixed","disposition":"aggressive","x":2,"y":2,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
    {"name":"troll","type":"fized","disposition":"aggressive","x":4,"y":3,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
    {"name":"troll","type":"fixed","spawn":{"x":3,"y":5,"z":1,"health":10},"x":3,"y":5,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
    {"name":"troll","type":"fixed","spawn":{"x":4,"y":5,"z":1,"health":10},"x":4,"y":5,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":["candy bar"]},
    {"name":"red troll","type":"fixed","x":1,"y":4,"z":1,"power_range":[5,50],"health":50,"point_value":50,"detail":"a red, foul, smelly creature. It looks like it might take something special to defeat this troll.","items":[],"required":["poison sword"]}
  ],
  "friendlies": [
    {"name":"old man","x":4,"y":6,"z":1,"type":"fixed","detail":"a wise looking old man.","conversation":{"default":"There is a red troll wreaking havoc nearby. Please help rid him of our land! You should be able to find a sword to help west of here."},"items":["poison sword"],"puzzles":[
      {"cmd":"pray","solution":"old man","items":["poison sword"],"detail":"Thanks! Take this for your efforts!"}
    ]},
    {"name":"woman","x":4,"y":2,"z":1,"type":"fixed","detail":"a friendly looking woman.","conversation":{"default":"I used to make posion from just water, poison ivy, and a rotten apple!"}},
    {"name":"boy","x":2,"y":4,"z":1,"type":"fixed","detail":"a happy looking boy.","conversation":{"default":"They say that the red troll can only be defeated by a sword dipped in poison!"},"items":["candy bar"]},
    {"name":"inn keeper","x":6,"y":3,"z":1,"type":"fixed","detail":"a friendly looking chap.","conversation":{"default":"You should use our bed. I promise you'll feel great when you are done!"}},
    {"name":"wanderer","x":4,"y":4,"z":1,"type":"fixed","detail":"a well traveled looking fellow.","conversation":{"default":"I hear there is an inn somewhere to the east of here that can help you recover health!"},"puzzles":[
      {"cmd":"location","solution":"4, 6, 1","detail":"The wanderer runs to greet the old man!","type_change":"fixed","items":["rotten apple"]}
    ]}
  ],
  "objects": [
    {"name":"water","type":"consumable","detail":"A small bottle of water. I wonder if you can combine this with something?","health_bump":0},
    {"name":"poison ivy","type":"consumable","detail":"A leaf of poison ivy. I wonder if you can combine this with something?","health_bump":-5},
    {"name":"rotten apple","type":"consumable","detail":"A half-rotten, disgusting, apple. I wonder if you can combine this with something?","health_bump":-1},
    {"name":"candy bar","type":"consumable","detail":"a tasty treat!","health_bump":-10},
    {"name":"sword","type":"weapon","detail":"a fine weapon for a warrior","power_range":[10,20]},
    {"name":"bed","type":"recovery","detail":"A cozy looking bed. Perhaps you should rest for a bit?","health_bump":100},
    {"name":"lever","type":"item","detail":"A simple lever. Maybe you should try pulling it?"},
    {"name":"bush","type":"item","detail":"A very dry looking bunch of tumbleweed."},
    {"name":"poison","type":"consumable","detail":"a deadly concotion","health_bump":-30,"build_with":["water","rotten apple","poison ivy"]},
    {"name":"poison sword","type":"weapon","detail":"an awesome weapon for a warrior","power_range":[10,30],"build_with":["sword","poison"]}
  ],
  "map": [
    {"name":"3-1","x":3,"y":1,"z":1,"type":"jail","description":"","items":["water"],"exits":["e","s"]},
    {"name":"4-1","x":4,"y":1,"z":1,"description":"","exits":["w","s"]},
    {"name":"2-2","x":2,"y":2,"z":1,"description":"","exits":["e","s"]},
    {"name":"3-2","x":3,"y":2,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"4-2","x":4,"y":2,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"5-2","x":5,"y":2,"z":1,"description":"","items":["poison ivy"],"exits":["w","s"]},
    {"name":"3-1","x":1,"y":3,"z":1,"description":"","exits":["e","s"]},
    {"name":"3-2","x":2,"y":3,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"3-3","x":3,"y":3,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"4-3","x":4,"y":3,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"5-3","x":5,"y":3,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"6-3","x":6,"y":3,"z":1,"description":"","objects":["bed"],"exits":["w","s"]},
    {"name":"1-4","x":1,"y":4,"z":1,"description":"","exits":["n","e"]},
    {"name":"2-4","x":2,"y":4,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"3-4","x":3,"y":4,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"4-4","x":4,"y":4,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"5-4","x":5,"y":4,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"6-4","x":6,"y":4,"z":1,"description":"","items":["rotten apple"],"exits":["n","w"]},
    {"name":"2-5","x":2,"y":5,"z":1,"description":"","exits":["n","e"]},
    {"name":"3-5","x":3,"y":5,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"4-5","x":4,"y":5,"z":1,"description":"","exits":["n","s","e","w"]},
    {"name":"5-5","x":5,"y":5,"z":1,"description":"","exits":["n","w"]},
    {"name":"3-6","x":3,"y":6,"z":1,"description":"","objects":["lever"],"exits":["n","e"],"puzzles":[{"cmd":"pull","solution":"lever","detail":"A small section of the wall slides down revealing a compartment.","items":["sword"]}]},
    {"name":"4-6","x":4,"y":6,"z":1,"description":"","objects":["bush"],"exits":["n"],"puzzles":[
      {"cmd":"burn","solution":"bush","detail":"You burn the bush.","destroy":["bush"],"hidden_exits":["w"]}
    ]}
  ]
}