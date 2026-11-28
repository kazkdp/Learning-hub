/* Reading Detective – the stories (moved out of reading-detective.html on 28 Nov 2026 so they can be
   checked and edited on their own; the page loads this file first). */
/* ============================================================
   The 100 stories. Stories 1–50 are short and simple, 51–90 add
   "why" questions, a read-it-first step and "prove it" questions,
   91–100 are longer. In every question the right answer is
   options[correct]; the answers are shuffled on screen.
   clueSentence counts from 0 (0 = the first sentence).
   ============================================================ */
const DEFAULT_STORIES = [
  // ---------- Originals ----------
  {
    "id": 1, "title": "Toby the Dog", "emoji": "🐶", "category": "Originals",
    "sentences": [
      "Toby is a friendly brown dog.",
      "He loves to chase his bouncy red ball.",
      "Today, Toby jumped into a big muddy puddle.",
      "Mum gave him a warm bath so he felt clean."
    ],
    "questions": [
      { "q": "What does Toby love to chase?", "clueSentence": 1, "options": ["His red ball", "A green frog", "A fast car"], "correct": 0 },
      { "q": "Where did Toby jump today?", "clueSentence": 2, "options": ["In a puddle", "On a bed", "In a tree"], "correct": 0 },
      { "q": "What did Mum give Toby?", "clueSentence": 3, "options": ["A warm bath", "A big bone", "A new hat"], "correct": 0 }
    ]
  },
  {
    "id": 2, "title": "Baking Cookies", "emoji": "🍪", "category": "Originals",
    "sentences": [
      "Mia and Mum baked cookies in the kitchen.",
      "They mixed flour, butter, and sugar in a bowl.",
      "Mia added sweet chocolate chips to the mix.",
      "The warm cookies tasted delicious and made Mia happy."
    ],
    "questions": [
      { "q": "Where did Mia and Mum bake cookies?", "clueSentence": 0, "options": ["In the kitchen", "In the park", "At the beach"], "correct": 0 },
      { "q": "What did Mia add to the mix?", "clueSentence": 2, "options": ["Chocolate chips", "Green peas", "Cold ice"], "correct": 0 },
      { "q": "How did the warm cookies make Mia feel?", "clueSentence": 3, "options": ["Happy", "Sleepy", "Cold"], "correct": 0 }
    ]
  },
  {
    "id": 3, "title": "Space Rockets", "emoji": "🚀", "category": "Originals",
    "sentences": [
      "Leo made a space rocket from a big box.",
      "He put shiny silver foil on the top.",
      "Leo sat inside and counted down from five.",
      "He felt excited pretending to fly to the moon."
    ],
    "questions": [
      { "q": "What did Leo use to make his rocket?", "clueSentence": 0, "options": ["A big box", "A plastic cup", "A wooden spoon"], "correct": 0 },
      { "q": "What did he put on top of the rocket?", "clueSentence": 1, "options": ["Silver foil", "Blue paint", "Dry leaves"], "correct": 0 },
      { "q": "Where did Leo pretend to fly?", "clueSentence": 3, "options": ["To the moon", "To the shops", "Under the sea"], "correct": 0 }
    ]
  },
  {
    "id": 4, "title": "Sea Turtles", "emoji": "🐢", "category": "Originals",
    "sentences": [
      "A green sea turtle swims in the warm ocean.",
      "She uses her flat flippers to glide through water.",
      "When she is hungry, she eats green sea grass.",
      "Then the turtle rests calmly in the warm sun."
    ],
    "questions": [
      { "q": "Where does the green sea turtle swim?", "clueSentence": 0, "options": ["In the ocean", "In a bath", "On the road"], "correct": 0 },
      { "q": "What does the turtle eat when she is hungry?", "clueSentence": 2, "options": ["Green sea grass", "Hot pizza", "Red apples"], "correct": 0 },
      { "q": "How does the turtle rest in the sun?", "clueSentence": 3, "options": ["Calmly", "Loudly", "Sadly"], "correct": 0 }
    ]
  },
  {
    "id": 5, "title": "Rainy Day Castles", "emoji": "🏰", "category": "Originals",
    "sentences": [
      "Rain was falling outside, so Sam stayed indoors.",
      "He built a cosy castle with soft blankets.",
      "It was dark inside the blanket castle.",
      "Sam turned on a torch to read his book."
    ],
    "questions": [
      { "q": "Why did Sam stay indoors?", "clueSentence": 0, "options": ["It was raining", "It was snowing", "It was bedtime"], "correct": 0 },
      { "q": "What did Sam use to build his castle?", "clueSentence": 1, "options": ["Soft blankets", "Hard bricks", "Wet sand"], "correct": 0 },
      { "q": "What did Sam turn on to read his book?", "clueSentence": 3, "options": ["A torch", "A television", "A fan"], "correct": 0 }
    ]
  },
  {
    "id": 6, "title": "Library Trips", "emoji": "📚", "category": "Originals",
    "sentences": [
      "Noah walked to the quiet library with his dad.",
      "He looked at the shelves and chose an animal book.",
      "The kind librarian stamped the book at the desk.",
      "Noah felt happy to take the book home."
    ],
    "questions": [
      { "q": "Where did Noah walk with his dad?", "clueSentence": 0, "options": ["To the library", "To the farm", "To the pool"], "correct": 0 },
      { "q": "Which book did Noah choose?", "clueSentence": 1, "options": ["An animal book", "A train book", "A cooking book"], "correct": 0 },
      { "q": "How did Noah feel about taking the book home?", "clueSentence": 3, "options": ["Happy", "Angry", "Tired"], "correct": 0 }
    ]
  },
  {
    "id": 7, "title": "Pizza Baking", "emoji": "🍕", "category": "Originals",
    "sentences": [
      "Ben helped his dad make pizza for dinner.",
      "He spread red tomato sauce on the flat dough.",
      "Next, Ben put yellow cheese on top.",
      "Dad baked it in the oven until it was hot."
    ],
    "questions": [
      { "q": "What did Ben and his dad make for dinner?", "clueSentence": 0, "options": ["Pizza", "Soup", "Cake"], "correct": 0 },
      { "q": "What colour was the tomato sauce?", "clueSentence": 1, "options": ["Red", "Blue", "Green"], "correct": 0 },
      { "q": "What did Ben put on top of the sauce?", "clueSentence": 2, "options": ["Yellow cheese", "Sweet jam", "Cold milk"], "correct": 0 }
    ]
  },
  {
    "id": 8, "title": "Blue Kites", "emoji": "🪁", "category": "Originals",
    "sentences": [
      "It was a windy day on the grassy hill.",
      "Lily held the string of her bright blue kite.",
      "She ran fast and the wind lifted the kite up.",
      "Lily felt proud watching her kite fly high."
    ],
    "questions": [
      { "q": "What colour was Lily's kite?", "clueSentence": 1, "options": ["Bright blue", "Dark green", "Pale pink"], "correct": 0 },
      { "q": "What lifted the kite up into the sky?", "clueSentence": 2, "options": ["The wind", "A bird", "A ladder"], "correct": 0 },
      { "q": "How did Lily feel watching her kite fly?", "clueSentence": 3, "options": ["Proud", "Sleepy", "Scared"], "correct": 0 }
    ]
  },
  {
    "id": 9, "title": "Park Visits", "emoji": "🛝", "category": "Originals",
    "sentences": [
      "Omar went to the sunny park with his mum.",
      "He climbed the steps and zoomed down the yellow slide.",
      "Playing in the park made Omar feel hungry.",
      "He sat on a bench and ate a red apple."
    ],
    "questions": [
      { "q": "What did Omar zoom down at the park?", "clueSentence": 1, "options": ["The yellow slide", "A snowy hill", "The stairs"], "correct": 0 },
      { "q": "How did Omar feel after playing?", "clueSentence": 2, "options": ["Hungry", "Cold", "Cross"], "correct": 0 },
      { "q": "What did Omar eat on the bench?", "clueSentence": 3, "options": ["A red apple", "Hot soup", "Ice cream"], "correct": 0 }
    ]
  },
  {
    "id": 10, "title": "Planting Seeds", "emoji": "🌻", "category": "Originals",
    "sentences": [
      "Chloe put brown soil into a small flower pot.",
      "She pushed a little sunflower seed into the soil.",
      "Chloe watered the pot every sunny morning.",
      "Soon, a tiny green plant started to grow."
    ],
    "questions": [
      { "q": "What did Chloe put into the flower pot?", "clueSentence": 0, "options": ["Brown soil", "White snow", "Blue paint"], "correct": 0 },
      { "q": "What did Chloe do every morning?", "clueSentence": 2, "options": ["Watered the pot", "Picked a flower", "Hid the pot"], "correct": 0 },
      { "q": "What started to grow in the pot?", "clueSentence": 3, "options": ["A green plant", "A tall tree", "A red berry"], "correct": 0 }
    ]
  },
  // ---------- Routines ----------
  {
    "id": 11, "title": "The Red Train", "emoji": "🚂", "category": "Routines",
    "sentences": [
      "Adam waited at the station with his dad.",
      "A shiny red train stopped by the platform.",
      "Adam and his dad stepped inside the train.",
      "They felt excited to ride to the beach."
    ],
    "questions": [
      { "q": "What colour was the shiny train?", "clueSentence": 1, "options": ["Red", "Yellow", "Purple"], "correct": 0 },
      { "q": "Who waited at the station with Adam?", "clueSentence": 0, "options": ["His dad", "His teacher", "His dog"], "correct": 0 },
      { "q": "Where was the train taking them?", "clueSentence": 3, "options": ["To the beach", "To school", "To bed"], "correct": 0 }
    ]
  },
  {
    "id": 12, "title": "Feeding the Ducks", "emoji": "🦆", "category": "Routines",
    "sentences": [
      "Noah took a bag of oats to the pond.",
      "Four white ducks were swimming in the water.",
      "Noah threw some oats onto the pond.",
      "The hungry ducks swam over to eat the food."
    ],
    "questions": [
      { "q": "What did Noah bring in his bag?", "clueSentence": 0, "options": ["Oats", "Toys", "Crayons"], "correct": 0 },
      { "q": "How many white ducks were in the water?", "clueSentence": 1, "options": ["Four", "Ten", "One"], "correct": 0 },
      { "q": "Why did the ducks swim over to Noah?", "clueSentence": 3, "options": ["To eat food", "To sleep", "To fly away"], "correct": 0 }
    ]
  },
  {
    "id": 13, "title": "Washing the Car", "emoji": "🚗", "category": "Routines",
    "sentences": [
      "Dad's blue car had brown mud on the doors.",
      "Lucas dipped a big sponge in soapy water.",
      "He wiped all the mud off the car.",
      "The blue car looked clean and shiny again."
    ],
    "questions": [
      { "q": "What was on the doors of Dad's car?", "clueSentence": 0, "options": ["Brown mud", "White snow", "Green leaves"], "correct": 0 },
      { "q": "What did Lucas dip in the soapy water?", "clueSentence": 1, "options": ["A big sponge", "A toothbrush", "A shoe"], "correct": 0 },
      { "q": "How did the car look at the end?", "clueSentence": 3, "options": ["Clean and shiny", "Wet and muddy", "Old and broken"], "correct": 0 }
    ]
  },
  {
    "id": 14, "title": "The Lost Mittens", "emoji": "🧤", "category": "Routines",
    "sentences": [
      "It was a cold winter morning.",
      "Ella looked for her red mittens before school.",
      "She found both mittens inside her coat pockets.",
      "Ella put them on and her hands felt warm."
    ],
    "questions": [
      { "q": "What was the weather like this morning?", "clueSentence": 0, "options": ["Cold", "Hot", "Sunny"], "correct": 0 },
      { "q": "Where did Ella find her red mittens?", "clueSentence": 2, "options": ["In her pockets", "Under her bed", "In the garden"], "correct": 0 },
      { "q": "How did Ella's hands feel with her mittens on?", "clueSentence": 3, "options": ["Warm", "Freezing", "Wet"], "correct": 0 }
    ]
  },
  {
    "id": 15, "title": "Pancake Morning", "emoji": "🥞", "category": "Routines",
    "sentences": [
      "On Sunday, Josh helped Mum make pancakes.",
      "They stirred milk, eggs, and flour in a bowl.",
      "Mum cooked the pancakes in a warm pan.",
      "Josh put sweet syrup on top and ate them."
    ],
    "questions": [
      { "q": "What did Josh and Mum make on Sunday?", "clueSentence": 0, "options": ["Pancakes", "Biscuits", "Sandwiches"], "correct": 0 },
      { "q": "Where did Mum cook the pancakes?", "clueSentence": 2, "options": ["In a pan", "In a kettle", "In a fridge"], "correct": 0 },
      { "q": "What did Josh put on top of his pancakes?", "clueSentence": 3, "options": ["Sweet syrup", "Red ketchup", "Green peas"], "correct": 0 }
    ]
  },
  {
    "id": 16, "title": "Barnaby the Cat", "emoji": "🐱", "category": "Routines",
    "sentences": [
      "Barnaby is a fluffy orange cat.",
      "He ran outside and chased a yellow leaf.",
      "Soon, running made Barnaby feel very sleepy.",
      "He curled up on the soft rug for a nap."
    ],
    "questions": [
      { "q": "What colour is Barnaby the cat?", "clueSentence": 0, "options": ["Orange", "Black", "Purple"], "correct": 0 },
      { "q": "What did Barnaby chase outside?", "clueSentence": 1, "options": ["A yellow leaf", "A big bus", "A blue kite"], "correct": 0 },
      { "q": "Where did Barnaby curl up for a nap?", "clueSentence": 3, "options": ["On the rug", "In the sink", "On the roof"], "correct": 0 }
    ]
  },
  {
    "id": 17, "title": "The Toy Car Ramp", "emoji": "🏎️", "category": "Routines",
    "sentences": [
      "Max played with his green toy car in the hall.",
      "He put a wooden board on a box to make a ramp.",
      "Max let the green car go at the top.",
      "The car zoomed fast across the floor."
    ],
    "questions": [
      { "q": "What toy did Max play with?", "clueSentence": 0, "options": ["A green car", "A blue train", "A teddy bear"], "correct": 0 },
      { "q": "What did Max make with the board and box?", "clueSentence": 1, "options": ["A ramp", "A boat", "A bed"], "correct": 0 },
      { "q": "How did the car move across the floor?", "clueSentence": 3, "options": ["It zoomed fast", "It went slowly", "It flew up"], "correct": 0 }
    ]
  },
  {
    "id": 18, "title": "Picking Apples", "emoji": "🍎", "category": "Routines",
    "sentences": [
      "Ruby went to the orchard with her grandma.",
      "Sweet red apples were growing on the trees.",
      "Ruby picked the apples and filled her basket.",
      "Grandma baked a warm apple pie at home."
    ],
    "questions": [
      { "q": "Who went to the orchard with Ruby?", "clueSentence": 0, "options": ["Her grandma", "Her brother", "Her dentist"], "correct": 0 },
      { "q": "Where did Ruby put the red apples?", "clueSentence": 2, "options": ["In her basket", "In her shoes", "In the pond"], "correct": 0 },
      { "q": "What did Grandma bake at home?", "clueSentence": 3, "options": ["An apple pie", "Brown bread", "Hot pizza"], "correct": 0 }
    ]
  },
  {
    "id": 19, "title": "Night Sky Stars", "emoji": "🔭", "category": "Routines",
    "sentences": [
      "The sky was dark and clear at night.",
      "Tariq looked up through his telescope in the garden.",
      "He saw the bright silver moon and five stars.",
      "Tariq felt calm looking at the quiet night sky."
    ],
    "questions": [
      { "q": "When did Tariq look through his telescope?", "clueSentence": 0, "options": ["At night", "In the morning", "At lunch"], "correct": 0 },
      { "q": "How many stars did Tariq see?", "clueSentence": 2, "options": ["Five stars", "Two stars", "Twenty stars"], "correct": 0 },
      { "q": "How did Tariq feel looking at the sky?", "clueSentence": 3, "options": ["Calm", "Angry", "Hungry"], "correct": 0 }
    ]
  },
  {
    "id": 20, "title": "Making Fruit Salad", "emoji": "🍓", "category": "Routines",
    "sentences": [
      "Hannah made a fresh fruit salad for lunch.",
      "She washed red strawberries and green grapes.",
      "Next, she cut up a soft yellow banana.",
      "Hannah put all the fruit into a big bowl."
    ],
    "questions": [
      { "q": "What did Hannah make for lunch?", "clueSentence": 0, "options": ["Fruit salad", "Cheese toast", "Hot soup"], "correct": 0 },
      { "q": "Which yellow fruit did Hannah cut up?", "clueSentence": 2, "options": ["A banana", "A carrot", "A potato"], "correct": 0 },
      { "q": "Where did Hannah put all the fruit?", "clueSentence": 3, "options": ["In a big bowl", "In a paper bag", "In the oven"], "correct": 0 }
    ]
  },
  {
    "id": 21, "title": "The Fire Engine", "emoji": "🚒", "category": "Routines",
    "sentences": [
      "A bright red fire engine drove down the road.",
      "It had flashing blue lights on the roof.",
      "All the other cars stopped at the side.",
      "The fire engine drove past safely and quickly."
    ],
    "questions": [
      { "q": "What colour was the fire engine?", "clueSentence": 0, "options": ["Bright red", "Dark green", "Light pink"], "correct": 0 },
      { "q": "What was flashing on the roof?", "clueSentence": 1, "options": ["Blue lights", "White stars", "Gold bells"], "correct": 0 },
      { "q": "What did the other cars do?", "clueSentence": 2, "options": ["They stopped", "They raced", "They jumped"], "correct": 0 }
    ]
  },
  {
    "id": 22, "title": "Aquarium Fish", "emoji": "🐠", "category": "Routines",
    "sentences": [
      "Aiden looked through the big window at the aquarium.",
      "Yellow and blue fish swam inside the water tank.",
      "A little yellow fish hid behind green seaweed.",
      "Aiden smiled when the fish swam back out."
    ],
    "questions": [
      { "q": "Where were the fish swimming?", "clueSentence": 1, "options": ["In a tank", "In a cup", "In a puddle"], "correct": 0 },
      { "q": "Where did the little yellow fish hide?", "clueSentence": 2, "options": ["Behind seaweed", "Under a chair", "In a tree"], "correct": 0 },
      { "q": "What did Aiden do when the fish swam out?", "clueSentence": 3, "options": ["He smiled", "He cried", "He slept"], "correct": 0 }
    ]
  },
  {
    "id": 23, "title": "Building a Snowman", "emoji": "⛄", "category": "Routines",
    "sentences": [
      "White snow covered the garden grass.",
      "Jack rolled two big snowballs in his warm gloves.",
      "He used an orange carrot for the snowman's nose.",
      "Jack felt proud of his cheerful snowman."
    ],
    "questions": [
      { "q": "What covered the garden grass?", "clueSentence": 0, "options": ["White snow", "Dry sand", "Blue water"], "correct": 0 },
      { "q": "What did Jack use for the snowman's nose?", "clueSentence": 2, "options": ["A carrot", "A banana", "A spoon"], "correct": 0 },
      { "q": "How did Jack feel about his snowman?", "clueSentence": 3, "options": ["Proud", "Sad", "Sleepy"], "correct": 0 }
    ]
  },
  {
    "id": 24, "title": "Camping in the Garden", "emoji": "⛺", "category": "Routines",
    "sentences": [
      "Dan and Dad put up a green tent on the grass.",
      "They put two warm sleeping bags inside.",
      "At night, they heard an owl hooting in a tree.",
      "Dan felt cosy and safe inside the tent."
    ],
    "questions": [
      { "q": "Where did Dan and Dad put up the tent?", "clueSentence": 0, "options": ["On the grass", "In the kitchen", "On the road"], "correct": 0 },
      { "q": "What bird did they hear at night?", "clueSentence": 2, "options": ["An owl", "A duck", "A parrot"], "correct": 0 },
      { "q": "How did Dan feel inside the tent?", "clueSentence": 3, "options": ["Cosy and safe", "Cold and wet", "Very angry"], "correct": 0 }
    ]
  },
  {
    "id": 25, "title": "The Postbox Letter", "emoji": "📮", "category": "Routines",
    "sentences": [
      "Grace drew a birthday card for her grandma.",
      "Mum put the card inside a white envelope.",
      "Grace stuck a small stamp on the front.",
      "She posted the letter into the red postbox."
    ],
    "questions": [
      { "q": "Who was the birthday card for?", "clueSentence": 0, "options": ["Her grandma", "Her doctor", "Her cat"], "correct": 0 },
      { "q": "What did Grace stick on the envelope?", "clueSentence": 2, "options": ["A small stamp", "A green leaf", "A button"], "correct": 0 },
      { "q": "Where did Grace post the letter?", "clueSentence": 3, "options": ["In the postbox", "In the bin", "In the pond"], "correct": 0 }
    ]
  },
  {
    "id": 26, "title": "Riding a Scooter", "emoji": "🛴", "category": "Routines",
    "sentences": [
      "Caleb took his scooter to the smooth park path.",
      "First, he put a blue helmet on his head.",
      "He pushed with his foot and glided along.",
      "Caleb pressed the brake to stop safely."
    ],
    "questions": [
      { "q": "What did Caleb put on his head?", "clueSentence": 1, "options": ["A blue helmet", "A paper crown", "A bucket"], "correct": 0 },
      { "q": "Where did Caleb ride his scooter?", "clueSentence": 0, "options": ["On the path", "In the mud", "On the bed"], "correct": 0 },
      { "q": "How did Caleb stop his scooter?", "clueSentence": 3, "options": ["Pressed the brake", "Closed his eyes", "Sat down"], "correct": 0 }
    ]
  },
  {
    "id": 27, "title": "Butterfly in the Garden", "emoji": "🦋", "category": "Routines",
    "sentences": [
      "Isla sat quietly on the wooden garden bench.",
      "An orange butterfly landed on a purple flower.",
      "It drank sweet nectar from the flower.",
      "Then the butterfly flapped its wings and flew away."
    ],
    "questions": [
      { "q": "Where did the orange butterfly land?", "clueSentence": 1, "options": ["On a flower", "On a car", "On a shoe"], "correct": 0 },
      { "q": "What did the butterfly drink?", "clueSentence": 2, "options": ["Sweet nectar", "Hot tea", "Cold milk"], "correct": 0 },
      { "q": "What did the butterfly do last?", "clueSentence": 3, "options": ["Flew away", "Went to sleep", "Swam away"], "correct": 0 }
    ]
  },
  {
    "id": 28, "title": "The Supermarket List", "emoji": "🛒", "category": "Routines",
    "sentences": [
      "Ethan went to the supermarket with his mum.",
      "He held a paper shopping list in his hand.",
      "They put milk, bread, and apples into the trolley.",
      "Ethan felt helpful crossing the words off the list."
    ],
    "questions": [
      { "q": "Where did Ethan go with his mum?", "clueSentence": 0, "options": ["The supermarket", "The zoo", "The beach"], "correct": 0 },
      { "q": "What did Ethan hold in his hand?", "clueSentence": 1, "options": ["A shopping list", "A football", "A pillow"], "correct": 0 },
      { "q": "How did Ethan feel crossing off the words?", "clueSentence": 3, "options": ["Helpful", "Sleepy", "Sad"], "correct": 0 }
    ]
  },
  {
    "id": 29, "title": "Bath Time Boats", "emoji": "🛁", "category": "Routines",
    "sentences": [
      "Leo had a warm bubbly bath before bed.",
      "He floated his yellow toy boat on the water.",
      "Leo splashed gently to make the boat rock.",
      "After his bath, he dried off with a soft towel."
    ],
    "questions": [
      { "q": "What toy did Leo float in the bath?", "clueSentence": 1, "options": ["A yellow boat", "A red kite", "A furry bear"], "correct": 0 },
      { "q": "How did Leo make the boat rock?", "clueSentence": 2, "options": ["Splashed gently", "Clapped his hands", "Sang a song"], "correct": 0 },
      { "q": "What did Leo use to dry off?", "clueSentence": 3, "options": ["A soft towel", "A paper bag", "A winter coat"], "correct": 0 }
    ]
  },
  {
    "id": 30, "title": "Bedtime Story", "emoji": "🌙", "category": "Routines",
    "sentences": [
      "At bedtime, Mia put on her soft pyjamas.",
      "She brushed her teeth and climbed into bed.",
      "Dad read a quiet story about a friendly dragon.",
      "Mia felt sleepy and closed her eyes."
    ],
    "questions": [
      { "q": "What did Mia put on at bedtime?", "clueSentence": 0, "options": ["Soft pyjamas", "Muddy boots", "A raincoat"], "correct": 0 },
      { "q": "What was the bedtime story about?", "clueSentence": 2, "options": ["A dragon", "A tractor", "A snowman"], "correct": 0 },
      { "q": "How did Mia feel at the end of the story?", "clueSentence": 3, "options": ["Sleepy", "Hungry", "Cross"], "correct": 0 }
    ]
  },
  // ---------- Feelings ----------
  {
    "id": 31, "title": "The Tall Brick Tower", "emoji": "🧱", "category": "Feelings",
    "sentences": [
      "Rayan built a tall tower with plastic bricks.",
      "The tower wobbled and fell down on the rug.",
      "Rayan felt sad, so he took a deep breath.",
      "He built the tower again and felt proud."
    ],
    "questions": [
      { "q": "What did Rayan use to build his tower?", "clueSentence": 0, "options": ["Plastic bricks", "Soft pillows", "Ice cubes"], "correct": 0 },
      { "q": "What did Rayan do when he felt sad?", "clueSentence": 2, "options": ["Took a breath", "Went to sleep", "Ate an apple"], "correct": 0 },
      { "q": "How did Rayan feel when he built it again?", "clueSentence": 3, "options": ["Proud", "Cold", "Scared"], "correct": 0 }
    ]
  },
  {
    "id": 32, "title": "The Noisy Shop", "emoji": "🎧", "category": "Feelings",
    "sentences": [
      "Zayd went into a busy and noisy shop.",
      "The loud sounds made his ears feel sore.",
      "He put his soft ear defenders on his head.",
      "Everything sounded quiet and Zayd felt calm."
    ],
    "questions": [
      { "q": "What was the busy shop like?", "clueSentence": 0, "options": ["Noisy", "Dark", "Freezing"], "correct": 0 },
      { "q": "What did Zayd put on his head?", "clueSentence": 2, "options": ["Ear defenders", "A party hat", "Swimming goggles"], "correct": 0 },
      { "q": "How did Zayd feel when it was quiet?", "clueSentence": 3, "options": ["Calm", "Hungry", "Tired"], "correct": 0 }
    ]
  },
  {
    "id": 33, "title": "The Wet Swings", "emoji": "🌦️", "category": "Feelings",
    "sentences": [
      "Toby wanted to play on the park swings.",
      "The swing seats were wet from the rain.",
      "Toby felt sad that he could not swing.",
      "He played on the dry slide instead and felt happy."
    ],
    "questions": [
      { "q": "Why were the swing seats wet?", "clueSentence": 1, "options": ["From the rain", "From bath water", "From juice"], "correct": 0 },
      { "q": "What did Toby play on instead?", "clueSentence": 3, "options": ["The dry slide", "A boat", "A scooter"], "correct": 0 },
      { "q": "How did Toby feel on the dry slide?", "clueSentence": 3, "options": ["Happy", "Angry", "Sleepy"], "correct": 0 }
    ]
  },
  {
    "id": 34, "title": "A Visit for a Haircut", "emoji": "✂️", "category": "Feelings",
    "sentences": [
      "Liam sat in the big chair for a haircut.",
      "At first, he felt a little bit nervous.",
      "He squeezed his soft stress ball in his hand.",
      "The haircut was gentle and Liam felt brave."
    ],
    "questions": [
      { "q": "Why did Liam sit in the big chair?", "clueSentence": 0, "options": ["For a haircut", "For breakfast", "For a nap"], "correct": 0 },
      { "q": "What did Liam squeeze in his hand?", "clueSentence": 2, "options": ["A stress ball", "An orange", "A crayon"], "correct": 0 },
      { "q": "How did Liam feel after the gentle haircut?", "clueSentence": 3, "options": ["Brave", "Cold", "Hungry"], "correct": 0 }
    ]
  },
  {
    "id": 35, "title": "Charging the Tablet", "emoji": "🔋", "category": "Feelings",
    "sentences": [
      "Zain wanted to play a game on his tablet.",
      "The tablet battery was empty and turned off.",
      "Mum plugged the tablet in to charge.",
      "Zain did a dinosaur puzzle while he waited."
    ],
    "questions": [
      { "q": "Why did Zain's tablet turn off?", "clueSentence": 1, "options": ["Empty battery", "It got wet", "It was bedtime"], "correct": 0 },
      { "q": "Who plugged the tablet in to charge?", "clueSentence": 2, "options": ["Mum", "His dog", "His friend"], "correct": 0 },
      { "q": "What did Zain do while he waited?", "clueSentence": 3, "options": ["A puzzle", "Baked a cake", "Went swimming"], "correct": 0 }
    ]
  },
  {
    "id": 36, "title": "The Spilled Water", "emoji": "🥛", "category": "Feelings",
    "sentences": [
      "Maya was drawing a picture at the table.",
      "Her elbow knocked over a cup of water.",
      "Maya felt sorry about the wet mess.",
      "She wiped the table dry with a cloth."
    ],
    "questions": [
      { "q": "What was Maya doing at the table?", "clueSentence": 0, "options": ["Drawing", "Sleeping", "Dancing"], "correct": 0 },
      { "q": "What did Maya knock over?", "clueSentence": 1, "options": ["A water cup", "A chair", "A lamp"], "correct": 0 },
      { "q": "What did she use to wipe the table dry?", "clueSentence": 3, "options": ["A cloth", "A leaf", "A hat"], "correct": 0 }
    ]
  },
  {
    "id": 37, "title": "The Scratchy Jumper", "emoji": "🧶", "category": "Feelings",
    "sentences": [
      "Owen put on his warm winter jumper.",
      "The label inside felt scratchy on his neck.",
      "Owen asked Mum for help with the label.",
      "Mum cut the label off and Owen felt comfortable."
    ],
    "questions": [
      { "q": "How did the label feel on Owen's neck?", "clueSentence": 1, "options": ["Scratchy", "Freezing", "Wet"], "correct": 0 },
      { "q": "Who did Owen ask for help?", "clueSentence": 2, "options": ["Mum", "The postman", "The cat"], "correct": 0 },
      { "q": "How did Owen feel after Mum cut the label off?", "clueSentence": 3, "options": ["Comfortable", "Sad", "Hungry"], "correct": 0 }
    ]
  },
  {
    "id": 38, "title": "The Missing Puzzle Piece", "emoji": "🧩", "category": "Feelings",
    "sentences": [
      "Sara was making a picture puzzle on the rug.",
      "She could not find the last puzzle piece.",
      "Sara looked calmly under the sofa cushion.",
      "She found the piece and finished her puzzle."
    ],
    "questions": [
      { "q": "What was Sara making on the rug?", "clueSentence": 0, "options": ["A puzzle", "A pizza", "A snowman"], "correct": 0 },
      { "q": "Where did Sara find the missing piece?", "clueSentence": 2, "options": ["Under a cushion", "In the bath", "In a tree"], "correct": 0 },
      { "q": "What did Sara do after finding the piece?", "clueSentence": 3, "options": ["Finished it", "Went to bed", "Washed the car"], "correct": 0 }
    ]
  },
  {
    "id": 39, "title": "Sharing the Trampoline", "emoji": "⏱️", "category": "Feelings",
    "sentences": [
      "Leo and Sam wanted to bounce on the trampoline.",
      "Mum set a five-minute sand timer on the bench.",
      "Sam bounced first while Leo waited calmly.",
      "When the sand finished, it was Leo's turn."
    ],
    "questions": [
      { "q": "What did the boys want to bounce on?", "clueSentence": 0, "options": ["A trampoline", "A table", "A bike"], "correct": 0 },
      { "q": "What did Mum put on the bench?", "clueSentence": 1, "options": ["A sand timer", "A cake", "A book"], "correct": 0 },
      { "q": "How did Leo wait for his turn?", "clueSentence": 2, "options": ["Calmly", "Loudly", "Crossly"], "correct": 0 }
    ]
  },
  {
    "id": 40, "title": "The Loud Thunder", "emoji": "⛈️", "category": "Feelings",
    "sentences": [
      "A loud boom of thunder sounded outside.",
      "Maya jumped and felt a little scared.",
      "Dad wrapped Maya in her cosy weighted blanket.",
      "The heavy blanket helped Maya feel safe."
    ],
    "questions": [
      { "q": "What made a loud boom outside?", "clueSentence": 0, "options": ["Thunder", "A whistle", "A bicycle"], "correct": 0 },
      { "q": "How did the loud thunder make Maya feel?", "clueSentence": 1, "options": ["A little scared", "Very hungry", "Too hot"], "correct": 0 },
      { "q": "What helped Maya feel safe?", "clueSentence": 3, "options": ["Her blanket", "Her umbrella", "Her kite"], "correct": 0 }
    ]
  },
  {
    "id": 41, "title": "The Melting Ice Lolly", "emoji": "🍧", "category": "Feelings",
    "sentences": [
      "Hassan had a pink ice lolly in the hot sun.",
      "The sun made the ice lolly start to melt.",
      "Hassan walked under a shady green tree.",
      "He ate his cold ice lolly in the cool shade."
    ],
    "questions": [
      { "q": "What colour was Hassan's ice lolly?", "clueSentence": 0, "options": ["Pink", "Blue", "Black"], "correct": 0 },
      { "q": "What made the ice lolly start to melt?", "clueSentence": 1, "options": ["The hot sun", "The snow", "The moon"], "correct": 0 },
      { "q": "Where did Hassan sit to eat his lolly?", "clueSentence": 3, "options": ["In the shade", "In the bath", "In the shop"], "correct": 0 }
    ]
  },
  {
    "id": 42, "title": "Muddy Football Boots", "emoji": "⚽", "category": "Feelings",
    "sentences": [
      "Kian played football on the wet grass.",
      "His football boots got covered in brown mud.",
      "Kian took his muddy boots off at the door.",
      "The house carpet stayed clean and dry."
    ],
    "questions": [
      { "q": "What game did Kian play on the grass?", "clueSentence": 0, "options": ["Football", "Chess", "Puzzles"], "correct": 0 },
      { "q": "Where did Kian take his muddy boots off?", "clueSentence": 2, "options": ["At the door", "In his bed", "On the sofa"], "correct": 0 },
      { "q": "How did the house carpet stay?", "clueSentence": 3, "options": ["Clean and dry", "Wet and muddy", "Full of snow"], "correct": 0 }
    ]
  },
  {
    "id": 43, "title": "The Bedroom Torch", "emoji": "🔦", "category": "Feelings",
    "sentences": [
      "The bedroom light went off at night.",
      "It was too dark for Noah to see his toys.",
      "Noah switched on his small yellow torch.",
      "The bright light helped Noah see clearly."
    ],
    "questions": [
      { "q": "Why couldn't Noah see his toys?", "clueSentence": 1, "options": ["It was dark", "It was sunny", "He was out"], "correct": 0 },
      { "q": "What did Noah switch on?", "clueSentence": 2, "options": ["His yellow torch", "A noisy fan", "A water tap"], "correct": 0 },
      { "q": "How did the torch help Noah?", "clueSentence": 3, "options": ["Helped him see", "Made him lunch", "Washed his hands"], "correct": 0 }
    ]
  },
  {
    "id": 44, "title": "The Broken Pencil", "emoji": "✏️", "category": "Feelings",
    "sentences": [
      "Amir was colouring a picture of a green tree.",
      "He pressed hard and the pencil tip broke.",
      "Amir twisted the pencil in his sharpener.",
      "Now the pencil was sharp to finish colouring."
    ],
    "questions": [
      { "q": "What was Amir colouring?", "clueSentence": 0, "options": ["A green tree", "A blue whale", "A red bus"], "correct": 0 },
      { "q": "What happened to the pencil tip?", "clueSentence": 1, "options": ["It broke", "It melted", "It floated"], "correct": 0 },
      { "q": "What did Amir use to fix his pencil?", "clueSentence": 2, "options": ["A sharpener", "A fork", "A towel"], "correct": 0 }
    ]
  },
  {
    "id": 45, "title": "The Swimming Bag", "emoji": "🏊", "category": "Feelings",
    "sentences": [
      "Maya packed her blue bag for swimming.",
      "She put her towel and goggles inside.",
      "At the pool, Maya wore her clear goggles.",
      "She felt happy seeing under the water."
    ],
    "questions": [
      { "q": "Where was Maya going with her blue bag?", "clueSentence": 0, "options": ["Swimming", "To the farm", "To bed"], "correct": 0 },
      { "q": "What did Maya wear over her eyes in the pool?", "clueSentence": 2, "options": ["Clear goggles", "Winter mittens", "A scarf"], "correct": 0 },
      { "q": "How did Maya feel seeing under the water?", "clueSentence": 3, "options": ["Happy", "Cold", "Cross"], "correct": 0 }
    ]
  },
  {
    "id": 46, "title": "Crossing the Road", "emoji": "🚦", "category": "Feelings",
    "sentences": [
      "Dev and Mum stopped by the road crossing.",
      "Dev pressed the button on the traffic box.",
      "They waited until the green man lit up.",
      "When the cars stopped, they walked across safely."
    ],
    "questions": [
      { "q": "What did Dev press at the crossing?", "clueSentence": 1, "options": ["The button", "A doorbell", "A pillow"], "correct": 0 },
      { "q": "What did they wait to see light up?", "clueSentence": 2, "options": ["The green man", "A yellow moon", "A pink flower"], "correct": 0 },
      { "q": "When did Dev and Mum walk across?", "clueSentence": 3, "options": ["When cars stopped", "In the rain", "On a bicycle"], "correct": 0 }
    ]
  },
  {
    "id": 47, "title": "Sticky Honey Hands", "emoji": "🍯", "category": "Feelings",
    "sentences": [
      "Sam put sweet golden honey on his toast.",
      "A drop of sticky honey fell on his fingers.",
      "Sam washed his hands with warm water and soap.",
      "His fingers were clean and not sticky anymore."
    ],
    "questions": [
      { "q": "What did Sam put on his toast?", "clueSentence": 0, "options": ["Golden honey", "Green peas", "Cold ice"], "correct": 0 },
      { "q": "How did Sam's fingers feel with honey on them?", "clueSentence": 1, "options": ["Sticky", "Cold", "Fluffy"], "correct": 0 },
      { "q": "What did Sam wash his hands with?", "clueSentence": 2, "options": ["Water and soap", "Milk and sugar", "Sand and mud"], "correct": 0 }
    ]
  },
  {
    "id": 48, "title": "Pumping Up the Ball", "emoji": "🎈", "category": "Feelings",
    "sentences": [
      "Lucas found his white football in the shed.",
      "The ball was flat and could not bounce.",
      "Dad used a pump to put air inside the ball.",
      "The ball bounced high and Lucas felt excited."
    ],
    "questions": [
      { "q": "Where did Lucas find his white football?", "clueSentence": 0, "options": ["In the shed", "In the oven", "In the pond"], "correct": 0 },
      { "q": "What did Dad use to put air in the ball?", "clueSentence": 2, "options": ["A pump", "A brush", "A spoon"], "correct": 0 },
      { "q": "How did Lucas feel when the ball bounced high?", "clueSentence": 3, "options": ["Excited", "Sad", "Sleepy"], "correct": 0 }
    ]
  },
  {
    "id": 49, "title": "Sharing a Green Crayon", "emoji": "🖍️", "category": "Feelings",
    "sentences": [
      "Eva needed a green crayon to colour her leaf.",
      "Her own crayon box did not have green.",
      "She politely asked her brother to share his.",
      "Her brother smiled and gave her the green crayon."
    ],
    "questions": [
      { "q": "Which colour crayon did Eva need?", "clueSentence": 0, "options": ["Green", "Purple", "Black"], "correct": 0 },
      { "q": "Who did Eva ask for a green crayon?", "clueSentence": 2, "options": ["Her brother", "Her doctor", "Her puppy"], "correct": 0 },
      { "q": "What did her brother do?", "clueSentence": 3, "options": ["Shared his crayon", "Ran away", "Went to bed"], "correct": 0 }
    ]
  },
  {
    "id": 50, "title": "The Frosty Morning", "emoji": "❄️", "category": "Feelings",
    "sentences": [
      "White frost covered the grass on Monday morning.",
      "The winter air outside felt freezing cold.",
      "Noah zipped up his thick coat and wore a hat.",
      "He felt warm and cosy walking to school."
    ],
    "questions": [
      { "q": "What covered the grass on Monday morning?", "clueSentence": 0, "options": ["White frost", "Red apples", "Sand"], "correct": 0 },
      { "q": "What did Noah wear on his head?", "clueSentence": 2, "options": ["A hat", "A crown", "Goggles"], "correct": 0 },
      { "q": "How did Noah feel walking to school?", "clueSentence": 3, "options": ["Warm and cosy", "Very hot", "Hungry"], "correct": 0 }
    ]
  },
  // ---------- Slime & Messy Play ----------
  {
    "id": 51, "title": "Making Galaxy Slime", "emoji": "🌌", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Maya poured clear glue and warm water into a mixing tub.",
      "She stirred in purple glitter and tiny silver stars.",
      "When she added lens solution, the runny liquid turned thick and stretchy.",
      "Maya smiled because the finished slime did not stick to her fingers."
    ],
    "questions": [
      { "q": "What made Maya's slime sparkle?", "clueSentence": 1, "options": ["Glitter and stars", "Blue paint", "Crushed chalk"], "correct": 0, "recap": "She mixed purple glitter and silver stars into the tub." },
      { "q": "What changed the runny mix into stretchy slime?", "clueSentence": 2, "proveSentence": true, "options": ["Eye lens liquid", "Cold tap water", "Cooking oil"], "correct": 0, "recap": "Adding lens solution thickened the liquid into stretchy slime." },
      { "q": "Why was Maya happy at the end?", "clueSentence": 3, "options": ["Her hands stayed clean", "The tub was empty", "She found a spoon"], "correct": 0, "recap": "She smiled because the slime did not stick to her fingers." }
    ]
  },
  {
    "id": 52, "title": "Crunchy Foam Slime", "emoji": "🫧", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Leo made a batch of bright blue slime on the kitchen table.",
      "He tipped a bag of tiny white foam beads into the bowl.",
      "Leo kneaded the slime with both hands until the beads stayed inside.",
      "Every time he squeezed the slime, the trapped air beads made a popping sound."
    ],
    "questions": [
      { "q": "What did Leo pour into his blue slime?", "clueSentence": 1, "options": ["Little foam balls", "Dry rice grains", "Metal buttons"], "correct": 0, "recap": "He tipped tiny white foam beads into the bowl." },
      { "q": "How did Leo get the beads to stay inside the slime?", "clueSentence": 2, "proveSentence": true, "options": ["He worked it with his hands", "He froze it overnight", "He baked it in a pan"], "correct": 0, "recap": "Kneading the slime with both hands mixed the beads inside." },
      { "q": "Why did the slime make a popping noise when squeezed?", "clueSentence": 3, "options": ["Because of the foam beads", "Because the bowl cracked", "Because water boiled"], "correct": 0, "recap": "Squeezing pressed the air-filled foam beads so they popped." }
    ]
  },
  {
    "id": 53, "title": "Oobleck Cornflour Tray", "emoji": "🥣", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Sam mixed two cups of white cornflour with one cup of water in a tray.",
      "When Sam tapped the surface fast with his knuckles, it felt hard like a rock.",
      "When he rested his fingers still on top, his hand sank slowly to the bottom.",
      "Sam laughed because the mixture acted like both a solid and a liquid."
    ],
    "questions": [
      { "q": "What two things did Sam stir together in the tray?", "clueSentence": 0, "options": ["Powder and water", "Sand and glue", "Sugar and milk"], "correct": 0, "recap": "He mixed white cornflour powder with water." },
      { "q": "How did the mixture feel when Sam hit it quickly?", "clueSentence": 1, "proveSentence": true, "options": ["Firm and solid", "Hot and foamy", "Dry and dusty"], "correct": 0, "recap": "Tapping it fast made it feel hard like a rock." },
      { "q": "Why did Sam laugh while playing with the tray?", "clueSentence": 3, "options": ["It behaved in two ways", "He spilled his drink", "The tray turned pink"], "correct": 0, "recap": "It acted hard when tapped fast and liquid when touched gently." }
    ]
  },
  {
    "id": 54, "title": "Rainbow Shaving Foam", "emoji": "🌈", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Isla sprayed a fluffy white mountain of shaving foam onto a plastic tray.",
      "She dripped spots of red and yellow paint across the foam.",
      "Isla dragged a wooden stick through the foam to swirl the colours together.",
      "Where the red and yellow paint mixed, bright orange stripes appeared."
    ],
    "questions": [
      { "q": "What did Isla put onto the tray first?", "clueSentence": 0, "options": ["Puffy white foam", "Wet brown mud", "Clear jelly"], "correct": 0, "recap": "She sprayed a fluffy mountain of shaving foam on the tray." },
      { "q": "What tool did Isla use to swirl the paint?", "clueSentence": 2, "proveSentence": true, "options": ["A wooden stick", "A metal fork", "A paper towel"], "correct": 0, "recap": "She dragged a wooden stick through the foam to swirl it." },
      { "q": "Why did orange stripes show up in the foam?", "clueSentence": 3, "options": ["Two colours blended", "She added orange juice", "The tray changed colour"], "correct": 0, "recap": "Swirling red and yellow paint together created bright orange." }
    ]
  },
  {
    "id": 55, "title": "Mud Kitchen Soup", "emoji": "🍲", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Noah carried an old metal pot into the back garden.",
      "He scooped dark soil and rainwater into the pot with a trowel.",
      "Next, Noah dropped green grass blades and white daisy petals on top.",
      "He stirred the thick muddy stew with a stick and served it on a stone."
    ],
    "questions": [
      { "q": "What did Noah put in the pot before adding grass?", "clueSentence": 1, "options": ["Earth and rainwater", "Flour and eggs", "Soap and bubbles"], "correct": 0, "recap": "He scooped dark soil and rainwater into the pot first." },
      { "q": "Which flower parts did Noah add to his stew?", "clueSentence": 2, "proveSentence": true, "options": ["Daisy petals", "Rose thorns", "Sunflower seeds"], "correct": 0, "recap": "He dropped white daisy petals and grass blades on top." },
      { "q": "How did Noah mix his garden soup together?", "clueSentence": 3, "options": ["Using a stick", "Shaking the pot", "Using his hands"], "correct": 0, "recap": "He stirred the muddy stew with a stick." }
    ]
  },
  {
    "id": 56, "title": "Fizzy Volcano Tray", "emoji": "🌋", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Ruby built a tall sand mountain with a hollow cup at the peak.",
      "She spooned baking soda and red food dye into the hollow top.",
      "Dad handed Ruby a small jug of sour white vinegar to pour inside.",
      "The vinegar reacted with the powder and sent fizzy red foam down the sides."
    ],
    "questions": [
      { "q": "What did Ruby build out of sand?", "clueSentence": 0, "options": ["A volcano hill", "A flat bridge", "A square wall"], "correct": 0, "recap": "She built a tall sand mountain with a hollow cup at the top." },
      { "q": "What liquid did Ruby pour into the top of the mountain?", "clueSentence": 2, "proveSentence": true, "options": ["White vinegar", "Warm milk", "Apple juice"], "correct": 0, "recap": "She poured sour white vinegar from a small jug." },
      { "q": "Why did bubbly red foam spill down the sand?", "clueSentence": 3, "options": ["Vinegar met baking soda", "The sand melted", "Water overflowed"], "correct": 0, "recap": "The vinegar reacted with the baking soda and red dye to fizz." }
    ]
  },
  {
    "id": 57, "title": "Fluffy Cloud Dough", "emoji": "☁️", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Ethan poured soft white flour into a wide plastic tub.",
      "He drizzled smooth baby oil over the flour and squeezed it with his fingers.",
      "The dry powder clumped together so Ethan could pack it into a cup.",
      "When he tipped the cup upside down, the cloud dough held a neat castle shape."
    ],
    "questions": [
      { "q": "What did Ethan mix with the flour?", "clueSentence": 1, "options": ["Baby oil", "Lemon juice", "Sticky glue"], "correct": 0, "recap": "He drizzled smooth baby oil over the flour." },
      { "q": "How did Ethan blend the oil and flour together?", "clueSentence": 1, "proveSentence": true, "options": ["Squeezed with his fingers", "Whizzed it in a blender", "Stirred in some hot water"], "correct": 0, "recap": "He squeezed the oil and flour with his fingers." },
      { "q": "Why did the dough stay in a castle shape when tipped out?", "clueSentence": 2, "options": ["The oil made it clump", "He baked it hard", "It froze solid"], "correct": 0, "recap": "The baby oil made the dry flour clump together so it held its shape." }
    ]
  },
  {
    "id": 58, "title": "Finger Painting Hands", "emoji": "🎨", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Lily taped a large sheet of white paper onto the kitchen floor.",
      "She dipped her left palm in yellow paint and her right palm in blue paint.",
      "Lily pressed both painted hands onto the paper and rubbed them together.",
      "She cheered when the yellow and blue paint blended into bright green."
    ],
    "questions": [
      { "q": "Where did Lily fasten the large sheet of paper?", "clueSentence": 0, "options": ["On the floor", "On the window", "On a fence"], "correct": 0, "recap": "She taped the big white paper onto the kitchen floor." },
      { "q": "Which two paint colours did Lily put on her palms?", "clueSentence": 1, "proveSentence": true, "options": ["Yellow and blue", "Red and black", "Pink and white"], "correct": 0, "recap": "She dipped one palm in yellow paint and the other in blue." },
      { "q": "Why did Lily cheer while rubbing her hands on the paper?", "clueSentence": 3, "options": ["She made green paint", "Her hands got dry", "The tape came off"], "correct": 0, "recap": "Rubbing yellow and blue together created a new green colour." }
    ]
  },
  {
    "id": 59, "title": "Magnetic Iron Slime", "emoji": "🧲", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Tariq stirred dark iron powder into a ball of clear slime.",
      "The powder turned the slime shiny black like metal.",
      "Tariq held a strong silver magnet close to the black slime without touching it.",
      "The slime stretched upward and swallowed the magnet because iron is magnetic."
    ],
    "questions": [
      { "q": "How did the iron powder change the look of the slime?", "clueSentence": 1, "options": ["Made it shiny black", "Made it clear as glass", "Turned it bright red"], "correct": 0, "recap": "Stirring in iron powder made the slime look shiny black." },
      { "q": "What did Tariq hold near the black slime?", "clueSentence": 2, "proveSentence": true, "options": ["A strong magnet", "A warm lamp", "A wooden spoon"], "correct": 0, "recap": "He held a strong silver magnet close to the slime." },
      { "q": "Why did the slime reach up toward the magnet?", "clueSentence": 3, "options": ["Iron pulls to magnets", "The slime was hungry", "Wind blew it up"], "correct": 0, "recap": "The iron powder inside the slime was attracted to the magnet." }
    ]
  },
  {
    "id": 60, "title": "Water Bead Sensory Tub", "emoji": "💧", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Chloe poured a spoonful of tiny hard beads into a bowl of water.",
      "She left the bowl on the counter overnight while she slept.",
      "By morning, the beads had soaked up water and grown into big squishy balls.",
      "Chloe scooped the cool bouncy spheres through her fingers with a slotted spoon."
    ],
    "questions": [
      { "q": "What did the beads look like before going in water?", "clueSentence": 0, "options": ["Tiny and hard", "Big and furry", "Flat and square"], "correct": 0, "recap": "They started out as tiny hard beads." },
      { "q": "How long did the beads stay in the water bowl?", "clueSentence": 1, "proveSentence": true, "options": ["All night long", "For ten seconds", "For a whole week"], "correct": 0, "recap": "Chloe left the bowl on the counter overnight." },
      { "q": "Why were the beads big and squishy in the morning?", "clueSentence": 2, "options": ["They absorbed water", "She blew air in them", "She heated them up"], "correct": 0, "recap": "The beads soaked up water overnight and swelled into squishy spheres." }
    ]
  },
  {
    "id": 61, "title": "Sticky Slime Rescue", "emoji": "🍋", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Oscar accidentally dropped pink slime onto his knitted wool jumper.",
      "The sticky slime clung tightly to the wool threads and would not pull off.",
      "Mum poured a little white vinegar onto the spot and rubbed it gently.",
      "The vinegar broke down the slime so Oscar's jumper washed completely clean."
    ],
    "questions": [
      { "q": "Where did Oscar's pink slime land?", "clueSentence": 0, "options": ["On his wool jumper", "On the kitchen floor", "Inside his shoe"], "correct": 0, "recap": "He dropped the pink slime onto his knitted wool jumper." },
      { "q": "What did Mum put on the slime stain?", "clueSentence": 2, "proveSentence": true, "options": ["White vinegar", "Hot butter", "Green soap"], "correct": 0, "recap": "Mum poured a little white vinegar onto the spot." },
      { "q": "Why was Mum able to clean the jumper?", "clueSentence": 3, "options": ["Vinegar dissolved the slime", "She cut a hole out", "The slime froze off"], "correct": 0, "recap": "The vinegar broke down the sticky slime so it came off the wool." }
    ]
  },
  {
    "id": 62, "title": "Glow-in-the-Dark Slime", "emoji": "✨", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Zain mixed special glow powder into a jar of neon green slime.",
      "He held the jar right under a bright desk lamp for two minutes.",
      "Then Zain switched off the bedroom light and closed the curtains.",
      "The slime shone with a bright green light because the lamp had charged the powder."
    ],
    "questions": [
      { "q": "What special ingredient did Zain add to his green slime?", "clueSentence": 0, "options": ["Glow powder", "Crushed ice", "Salt crystals"], "correct": 0, "recap": "He mixed glow powder into the neon green slime." },
      { "q": "Where did Zain place the jar for two minutes?", "clueSentence": 1, "proveSentence": true, "options": ["Under a bright lamp", "Inside the fridge", "Under his pillow"], "correct": 0, "recap": "He held the jar under a bright desk lamp." },
      { "q": "Why did the slime glow in the dark room?", "clueSentence": 3, "options": ["The lamp charged it", "Batteries were inside", "A torch was behind it"], "correct": 0, "recap": "The bright desk lamp charged up the glow powder inside the slime." }
    ]
  },
  {
    "id": 63, "title": "Bubble Wrap Foot Painting", "emoji": "👣", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Dad taped strips of bumpy bubble wrap onto the bottoms of Maya's bare feet.",
      "Maya brushed thick orange paint over the plastic bubbles.",
      "She walked carefully across a long roll of white paper in the garden.",
      "Each step left a trail of neat orange polka dots along the paper."
    ],
    "questions": [
      { "q": "What did Dad wrap around Maya's feet?", "clueSentence": 0, "options": ["Bumpy bubble wrap", "Woollen socks", "Cardboard boxes"], "correct": 0, "recap": "Dad taped strips of bubble wrap onto Maya's bare feet." },
      { "q": "What colour paint did Maya brush onto the bubbles?", "clueSentence": 1, "proveSentence": true, "options": ["Orange", "Purple", "Brown"], "correct": 0, "recap": "She brushed thick orange paint over the plastic bubbles." },
      { "q": "Why did Maya's footprints look like polka dots?", "clueSentence": 3, "options": ["The round bubbles stamped paint", "She drew circles later", "Raindrops hit the paint"], "correct": 0, "recap": "The round painted bubbles on her feet stamped polka dots on the paper." }
    ]
  },
  {
    "id": 64, "title": "Spaghetti Sensory Bin", "emoji": "🍝", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Mum cooked a big pot of spaghetti noodles and cooled them in cold water.",
      "She tossed the noodles with blue food dye and a drop of oil so they felt slippery.",
      "Mum hid six tiny plastic dinosaurs underneath the pile of blue noodles.",
      "Aiden dug his hands into the squishy pile to rescue all six dinosaurs."
    ],
    "questions": [
      { "q": "Why did Mum add a drop of oil to the blue noodles?", "clueSentence": 1, "options": ["To make them slippery", "To fry them crispy", "To make them sweet"], "correct": 0, "recap": "The oil kept the cooled noodles smooth and slippery." },
      { "q": "What was hidden beneath the blue spaghetti?", "clueSentence": 2, "proveSentence": true, "options": ["Toy dinosaurs", "Silver coins", "Rubber ducks"], "correct": 0, "recap": "Mum hid six tiny plastic dinosaurs under the noodles." },
      { "q": "How did Aiden find the hidden toys?", "clueSentence": 3, "options": ["Dug through with his hands", "Dumped the bin out", "Used a magnet"], "correct": 0, "recap": "He dug his hands into the squishy noodles to pull them out." }
    ]
  },
  {
    "id": 65, "title": "Sand and Water Channels", "emoji": "🏖️", "category": "Slime & Messy Play", "readFirstGate": true,
    "sentences": [
      "Lucas packed damp sand into a long slope inside the garden sandpit.",
      "He carved a winding river path from the top of the slope to the bottom.",
      "Lucas tipped a full watering can at the top of the sand hill.",
      "The water flowed downhill along his carved path and formed a small lake."
    ],
    "questions": [
      { "q": "What did Lucas build in the sandpit first?", "clueSentence": 0, "options": ["A sloped sand hill", "A tall brick tower", "A dry tunnel"], "correct": 0, "recap": "He packed damp sand into a long slope." },
      { "q": "Where did Lucas pour the water from his can?", "clueSentence": 2, "proveSentence": true, "options": ["At the top of the slope", "At the bottom corner", "Outside the sandpit"], "correct": 0, "recap": "He tipped the watering can at the top of the sand hill." },
      { "q": "Why did a small lake form at the bottom?", "clueSentence": 3, "options": ["Water ran down his path", "It started raining hard", "A hose burst underground"], "correct": 0, "recap": "The water followed his winding carved path down to the bottom." }
    ]
  },
  // ---------- Space & Planets ----------
  {
    "id": 66, "title": "The Red Planet Mars", "emoji": "🔴", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Mars is a rocky planet that looks bright red in the night sky.",
      "Its ground is covered in fine dust filled with rusty iron.",
      "Strong winds often blow across Mars and lift the dust into huge storms.",
      "Scientists send robot rovers to Mars to study its red rocks and soil."
    ],
    "questions": [
      { "q": "What makes the ground on Mars look red?", "clueSentence": 1, "options": ["Rusty iron dust", "Red lava lakes", "Red trees and grass"], "correct": 0, "recap": "The soil on Mars contains rusty iron dust that looks red." },
      { "q": "What creates big dust storms on Mars?", "clueSentence": 2, "proveSentence": true, "options": ["Strong winds", "Heavy rain", "Falling meteors"], "correct": 0, "recap": "Strong winds blow the fine dust into huge storms." },
      { "q": "Why do scientists send robot rovers to Mars?", "clueSentence": 3, "options": ["To examine rocks and soil", "To plant green gardens", "To build houses"], "correct": 0, "recap": "Rovers study the red rocks and soil on Mars for scientists." }
    ]
  },
  {
    "id": 67, "title": "Saturn's Icy Rings", "emoji": "🪐", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Saturn is a giant planet made mostly of swirling yellow gases.",
      "Wide, shiny rings circle all the way around Saturn's middle.",
      "The rings are not solid hoops; they are made of billions of pieces of ice and rock.",
      "Sunlight bounces off the bright ice chunks, making the rings easy to see through a telescope."
    ],
    "questions": [
      { "q": "What is the planet Saturn mostly made of?", "clueSentence": 0, "options": ["Swirling gases", "Solid iron", "Deep oceans"], "correct": 0, "recap": "Saturn is a gas giant made mostly of swirling yellow gases." },
      { "q": "What are Saturn's rings actually built from?", "clueSentence": 2, "proveSentence": true, "options": ["Ice and rock pieces", "Solid gold bands", "Thick white clouds"], "correct": 0, "recap": "The rings are made of billions of separate chunks of ice and rock." },
      { "q": "Why can we spot Saturn's rings easily with a telescope?", "clueSentence": 3, "options": ["Ice reflects sunlight", "The rings glow with fire", "They are close to Earth"], "correct": 0, "recap": "Sunlight bounces off the billions of bright ice pieces." }
    ]
  },
  {
    "id": 68, "title": "Walking on the Moon", "emoji": "🌕", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "The Moon is much smaller and lighter than planet Earth.",
      "Because the Moon is smaller, its gravity pull is six times weaker than Earth's.",
      "When astronauts walked on the Moon, they felt very light in their heavy suits.",
      "A small push with their boots sent them bounding high across the grey dust."
    ],
    "questions": [
      { "q": "How does the Moon compare in size to Earth?", "clueSentence": 0, "options": ["Much smaller", "Twice as wide", "The exact same size"], "correct": 0, "recap": "The Moon is much smaller and lighter than Earth." },
      { "q": "How strong is gravity on the Moon compared to Earth?", "clueSentence": 1, "proveSentence": true, "options": ["Six times weaker", "Ten times stronger", "Exactly equal"], "correct": 0, "recap": "The Moon's smaller mass gives it six times weaker gravity." },
      { "q": "Why did astronauts bounce high with every step on the Moon?", "clueSentence": 3, "options": ["Weak gravity made them light", "They wore spring shoes", "Strong wind lifted them"], "correct": 0, "recap": "Weak Moon gravity made them feel light so small pushes sent them bounding." }
    ]
  },
  {
    "id": 69, "title": "Hot Venus Clouds", "emoji": "☀️", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Venus is the second planet from the Sun, right next to Mercury.",
      "Thick yellow clouds wrap completely around the whole planet.",
      "Those heavy clouds trap heat from the Sun like a giant winter blanket.",
      "Because heat cannot escape, Venus is the hottest planet in our solar system."
    ],
    "questions": [
      { "q": "What covers the sky all around Venus?", "clueSentence": 1, "options": ["Dense yellow clouds", "Clear blue air", "Icy white rings"], "correct": 0, "recap": "Thick yellow clouds wrap all the way around Venus." },
      { "q": "What do the clouds on Venus do to the Sun's heat?", "clueSentence": 2, "proveSentence": true, "options": ["Hold it in", "Bounce it away", "Turn it to snow"], "correct": 0, "recap": "The heavy clouds trap the Sun's heat like a blanket." },
      { "q": "Why is Venus hotter than every other planet?", "clueSentence": 3, "options": ["Trapped heat stays inside", "It touches the Sun", "It has no clouds"], "correct": 0, "recap": "The thick cloud layer stops heat from escaping back into space." }
    ]
  },
  {
    "id": 70, "title": "Jupiter's Giant Storm", "emoji": "🌪️", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Jupiter is the largest planet in our solar system.",
      "Stripes of orange, brown, and white clouds wrap around the giant planet.",
      "In Jupiter's southern half spins a huge oval storm called the Great Red Spot.",
      "This storm is wider than the whole Earth and has been spinning for hundreds of years."
    ],
    "questions": [
      { "q": "Where does Jupiter rank in size among the planets?", "clueSentence": 0, "options": ["The biggest one", "The smallest one", "Smaller than Mars"], "correct": 0, "recap": "Jupiter is the largest planet in our solar system." },
      { "q": "What is the Great Red Spot on Jupiter?", "clueSentence": 2, "proveSentence": true, "options": ["A massive spinning storm", "A tall red mountain range", "A huge, deep red ocean"], "correct": 0, "recap": "It is a huge oval storm spinning in Jupiter's clouds." },
      { "q": "How big is Jupiter's storm compared to our planet?", "clueSentence": 3, "options": ["Bigger than Earth", "The size of a city", "Smaller than the Moon"], "correct": 0, "recap": "The Great Red Spot is wider than the entire Earth." }
    ]
  },
  {
    "id": 71, "title": "Rocket Booster Separation", "emoji": "🚀", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "A space rocket carries huge fuel tanks to push through Earth's heavy gravity.",
      "During liftoff, the engines burn fuel fast and shoot bright flames downward.",
      "Once the lower tanks are empty, the rocket drops them safely into the ocean.",
      "Without the heavy empty tanks, the lighter rocket flies much faster into orbit."
    ],
    "questions": [
      { "q": "Why does a rocket start with such huge fuel tanks?", "clueSentence": 0, "options": ["To beat Earth's gravity", "To carry drinking water", "To keep astronauts warm"], "correct": 0, "recap": "It needs lots of fuel to push past Earth's strong gravity." },
      { "q": "Where do the empty lower tanks fall?", "clueSentence": 2, "proveSentence": true, "options": ["Into the sea", "Onto the Moon", "Into a forest"], "correct": 0, "recap": "The rocket drops the empty tanks safely into the ocean." },
      { "q": "Why does the rocket speed up after dropping the empty tanks?", "clueSentence": 3, "options": ["It weighs much less", "The Sun pulls it up", "It opens big wings"], "correct": 0, "recap": "Shedding the heavy empty tanks makes the rocket lighter and faster." }
    ]
  },
  {
    "id": 72, "title": "Floating in the Space Station", "emoji": "🛰️", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Astronauts live and work high above Earth inside the Space Station.",
      "Everything inside the station floats weightlessly in zero gravity.",
      "At bedtime, astronauts zip themselves into sleeping bags strapped to the wall.",
      "The straps keep them from drifting into buttons or bumping into walls while asleep."
    ],
    "questions": [
      { "q": "Why do objects float inside the Space Station?", "clueSentence": 1, "options": ["There is zero gravity", "Fans blow upward", "Everything is filled with gas"], "correct": 0, "recap": "In orbit there is weightless zero gravity, so things float." },
      { "q": "Where are astronauts' sleeping bags attached?", "clueSentence": 2, "proveSentence": true, "options": ["Fastened to the wall", "Placed on a carpet", "Hung outside in space"], "correct": 0, "recap": "Their sleeping bags are strapped onto the station wall." },
      { "q": "Why do astronauts need straps when they sleep?", "clueSentence": 3, "options": ["To stop floating around", "To keep blankets warm", "To block bright lights"], "correct": 0, "recap": "Without straps, sleeping astronauts would drift into walls or switches." }
    ]
  },
  {
    "id": 73, "title": "Freezing Neptune Winds", "emoji": "🔵", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Neptune is the farthest major planet from the Sun.",
      "A gas called methane in Neptune's air makes the planet look deep ocean blue.",
      "Because Neptune is so far away, very little warmth reaches it from the Sun.",
      "Temperatures drop way below freezing, and icy winds whip across the dark planet."
    ],
    "questions": [
      { "q": "What gives Neptune its deep blue colour?", "clueSentence": 1, "options": ["Methane gas in its air", "Deep liquid oceans", "Blue rocks on the ground"], "correct": 0, "recap": "Methane gas in Neptune's atmosphere absorbs red light and looks blue." },
      { "q": "Where is Neptune located compared to the other major planets?", "clueSentence": 0, "proveSentence": true, "options": ["Farthest from the Sun", "Closest to the Sun", "Right next to Earth"], "correct": 0, "recap": "Neptune is the farthest major planet from the Sun." },
      { "q": "Why is Neptune so dark and freezing cold?", "clueSentence": 2, "options": ["Little sunlight reaches it", "It has no atmosphere", "It is covered in snow"], "correct": 0, "recap": "Its huge distance from the Sun means very little light or heat gets there." }
    ]
  },
  {
    "id": 74, "title": "Craters on Mercury", "emoji": "☄️", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Mercury is the smallest planet and orbits closest to the Sun.",
      "Unlike Earth, Mercury has almost no blanket of air around it.",
      "When space rocks speed toward Mercury, there is no air to slow them down or burn them up.",
      "The rocks slam straight into the ground and leave deep round bowls called craters."
    ],
    "questions": [
      { "q": "What is missing around the planet Mercury?", "clueSentence": 1, "options": ["A thick layer of air", "Hard, rocky ground", "Bright light from the Sun"], "correct": 0, "recap": "Mercury has almost no atmosphere of air." },
      { "q": "What happens when space rocks hit Mercury's surface?", "clueSentence": 3, "proveSentence": true, "options": ["They dig round craters", "They bounce back to space", "They splash in water"], "correct": 0, "recap": "Crashing space rocks leave deep round craters in the ground." },
      { "q": "Why do space rocks hit Mercury without burning up first?", "clueSentence": 2, "options": ["No air slows them down", "The rocks are made of ice", "Mercury is freezing cold"], "correct": 0, "recap": "Without an atmosphere of air, nothing burns up or slows down incoming rocks." }
    ]
  },
  {
    "id": 75, "title": "Earth's Protective Blanket", "emoji": "🌍", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Planet Earth is surrounded by an invisible layer of gases called the atmosphere.",
      "This layer of air holds the oxygen that people and animals need to breathe.",
      "During the day, the atmosphere shields us from harsh rays from the Sun.",
      "At night, it holds in warmth so Earth does not freeze like the airless Moon."
    ],
    "questions": [
      { "q": "What is the layer of gases around Earth called?", "clueSentence": 0, "options": ["The atmosphere", "The equator", "The solar ring"], "correct": 0, "recap": "The invisible blanket of gases around Earth is the atmosphere." },
      { "q": "How does Earth's air help us during the daytime?", "clueSentence": 2, "proveSentence": true, "options": ["Blocks harsh sun rays", "Makes the sky pitch black", "Stops the wind blowing"], "correct": 0, "recap": "The atmosphere shields Earth from harsh rays from the Sun." },
      { "q": "Why does Earth stay warmer at night than the Moon?", "clueSentence": 3, "options": ["Air traps daytime warmth", "Earth has two suns", "Volcanoes heat the sky"], "correct": 0, "recap": "Earth's atmosphere holds in warmth at night, while the Moon has no air." }
    ]
  },
  {
    "id": 76, "title": "Shooting Stars in August", "emoji": "🌠", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Every August, Earth passes through a trail of dusty crumbs left behind by a comet.",
      "Tiny grains of comet dust hit Earth's upper air at super fast speeds.",
      "Rubbing against the air makes each tiny speck heat up and glow brightly.",
      "From the ground, these glowing streaks look like shooting stars racing across the night sky."
    ],
    "questions": [
      { "q": "Where do the August dust grains come from?", "clueSentence": 0, "options": ["A passing comet", "The Moon's craters", "Mars dust storms"], "correct": 0, "recap": "Earth passes through a dusty trail left behind by a comet." },
      { "q": "What happens when the dust specks rub against Earth's air?", "clueSentence": 2, "proveSentence": true, "options": ["They get hot and glow", "They turn into snowflakes", "They float like clouds"], "correct": 0, "recap": "Friction with the air heats up each speck until it glows brightly." },
      { "q": "Why do people call them shooting stars?", "clueSentence": 3, "options": ["They make bright sky streaks", "Real stars fall to Earth", "Rockets fire fireworks"], "correct": 0, "recap": "The burning specks leave bright streaks that look like moving stars." }
    ]
  },
  {
    "id": 77, "title": "Mars Rover Wheels", "emoji": "🤖", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "A robot rover named Perseverance drives across the rocky ground of Mars.",
      "It rolls on six strong metal wheels designed to climb over sharp stones.",
      "Special cameras on the rover's tall mast take clear photos of the red landscape.",
      "The rover beams those pictures across space so scientists on Earth can explore Mars."
    ],
    "questions": [
      { "q": "How many wheels help the rover move on Mars?", "clueSentence": 1, "options": ["Six metal wheels", "Two rubber tyres", "Four wooden rollers"], "correct": 0, "recap": "The rover rolls on six strong metal wheels." },
      { "q": "Where are the rover's cameras mounted?", "clueSentence": 2, "proveSentence": true, "options": ["On a tall mast", "Under its wheels", "Inside a fuel tank"], "correct": 0, "recap": "Special cameras sit on top of the rover's tall mast." },
      { "q": "How can scientists on Earth see what the rover finds?", "clueSentence": 3, "options": ["It sends photos through space", "Astronauts bring film back", "They use binoculars"], "correct": 0, "recap": "The rover beams its pictures back to Earth across space." }
    ]
  },
  {
    "id": 78, "title": "Day and Night Spin", "emoji": "🌓", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Planet Earth spins slowly like a giant top once every twenty-four hours.",
      "The Sun shines bright light onto only one half of Earth at a time.",
      "People living on the side facing the Sun enjoy bright daytime.",
      "Meanwhile, the side turned away from the Sun is in shadow and has night."
    ],
    "questions": [
      { "q": "How long does Earth take to make one full spin?", "clueSentence": 0, "options": ["One full day (24 hours)", "One whole year (365 days)", "One hour (60 minutes)"], "correct": 0, "recap": "Earth completes one full rotation every twenty-four hours." },
      { "q": "How much of Earth does the Sun light up at any moment?", "clueSentence": 1, "proveSentence": true, "options": ["Half of the planet", "The whole globe", "Only the North Pole"], "correct": 0, "recap": "The Sun shines on only one half of Earth at a time." },
      { "q": "Why does half of Earth experience night?", "clueSentence": 3, "options": ["It faces away from the Sun", "The Sun turns off at night", "Clouds cover the whole sky"], "correct": 0, "recap": "The side turned away from the Sun sits in dark shadow." }
    ]
  },
  {
    "id": 79, "title": "Uranus Tilted Sideways", "emoji": "💠", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Most planets spin upright like a spinning top as they travel around the Sun.",
      "Uranus is unusual because it is tipped completely over onto its side.",
      "Scientists think a giant space rock crashed into Uranus long ago and knocked it over.",
      "Because of this sideways tilt, Uranus looks like a pale blue ball rolling around the Sun."
    ],
    "questions": [
      { "q": "What makes Uranus different from the other planets?", "clueSentence": 1, "options": ["It lies on its side", "It is shaped like a cube", "It never moves at all"], "correct": 0, "recap": "Uranus is tipped completely onto its side instead of spinning upright." },
      { "q": "What do scientists believe knocked Uranus over?", "clueSentence": 2, "proveSentence": true, "options": ["A huge space impact", "Strong solar winds", "Saturn's icy rings"], "correct": 0, "recap": "A giant space rock likely crashed into Uranus long ago." },
      { "q": "How does Uranus appear to move around the Sun?", "clueSentence": 3, "options": ["Like a rolling ball", "Like a hopping frog", "Like a flat frisbee"], "correct": 0, "recap": "Its sideways tilt makes it look like a ball rolling along its orbit." }
    ]
  },
  {
    "id": 80, "title": "Solar Panels in Orbit", "emoji": "🔋", "category": "Space & Planets", "readFirstGate": true,
    "sentences": [
      "Satellites orbiting Earth need electricity to run their radios and cameras.",
      "There are no power plugs or long wires reaching up into space.",
      "Instead, satellites unfold wide shiny wings covered in dark blue solar cells.",
      "These solar wings catch bright sunlight and turn it into power all day long."
    ],
    "questions": [
      { "q": "What do satellites need electricity for?", "clueSentence": 0, "options": ["Radios and cameras", "Heating swimming pools", "Cooking hot meals"], "correct": 0, "recap": "Electricity powers the satellite's radios and cameras." },
      { "q": "What covers the wide wings on a satellite?", "clueSentence": 2, "proveSentence": true, "options": ["Blue solar cells", "Silver bird feathers", "White paper sails"], "correct": 0, "recap": "The satellite's wings are covered in dark blue solar cells." },
      { "q": "How do satellites get power without wires from Earth?", "clueSentence": 3, "options": ["They convert sunlight", "They burn coal in space", "Wind spins their wings"], "correct": 0, "recap": "Their solar cells capture sunlight and turn it into electricity." }
    ]
  },
  // ---------- Discovery ----------
  {
    "id": 81, "title": "Floating and Sinking", "emoji": "⛵", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Owen filled a clear plastic tub with water on the garden table.",
      "He dropped a heavy metal spoon in, and it sank straight to the bottom.",
      "Next, Owen placed a hollow plastic toy boat gently onto the water.",
      "The boat stayed on top because the air trapped inside made it light."
    ],
    "questions": [
      { "q": "What happened to the metal spoon in the tub?", "clueSentence": 1, "options": ["It went to the bottom", "It floated on top", "It dissolved away"], "correct": 0, "recap": "The heavy metal spoon sank straight to the bottom." },
      { "q": "Where did Owen set the plastic boat?", "clueSentence": 2, "proveSentence": true, "options": ["On the water surface", "Under the heavy spoon", "Beside the tub"], "correct": 0, "recap": "He placed the hollow toy boat gently onto the water." },
      { "q": "Why did the toy boat float instead of sinking?", "clueSentence": 3, "options": ["Trapped air kept it light", "The water was frozen", "The spoon held it up"], "correct": 0, "recap": "Air trapped inside the hollow boat made it light enough to float." }
    ]
  },
  {
    "id": 82, "title": "Ice Cube Salt Trick", "emoji": "🧊", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Eva laid a piece of wet cotton string across the top of an ice cube.",
      "She sprinkled a pinch of white salt over the string and ice.",
      "The salt melted a tiny puddle that quickly froze again around the cotton threads.",
      "When Eva lifted the ends of the string, the ice cube came up with it."
    ],
    "questions": [
      { "q": "What did Eva sprinkle onto the string and ice?", "clueSentence": 1, "options": ["A pinch of salt", "Sweet brown sugar", "Yellow sand"], "correct": 0, "recap": "She sprinkled white salt over the wet string and ice cube." },
      { "q": "What happened when Eva pulled the string upward?", "clueSentence": 3, "proveSentence": true, "options": ["The ice lifted up too", "The string snapped in half", "The ice turned pink"], "correct": 0, "recap": "Lifting the string raised the whole ice cube with it." },
      { "q": "Why did the string stick tightly to the ice cube?", "clueSentence": 2, "options": ["Water refroze around it", "She used super glue", "The string was magnetic"], "correct": 0, "recap": "Salt melted the surface slightly, and it refroze around the cotton threads." }
    ]
  },
  {
    "id": 83, "title": "Shadow Puppets at Night", "emoji": "🔦", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Leo propped a bright torch on his desk pointing at the blank bedroom wall.",
      "He held his hand far away from the torch and saw a small hand shadow.",
      "Then Leo moved his hand much closer to the bright torch bulb.",
      "His hand blocked more of the light beam, making a giant shadow on the wall."
    ],
    "questions": [
      { "q": "Where did Leo aim the beam of his torch?", "clueSentence": 0, "options": ["At the blank wall", "Out the window", "Under his bed"], "correct": 0, "recap": "He pointed the bright torch at his bedroom wall." },
      { "q": "How did the shadow look when Leo's hand was far from the torch?", "clueSentence": 1, "proveSentence": true, "options": ["Small", "Huge", "Invisible"], "correct": 0, "recap": "Holding his hand far from the torch made a small shadow." },
      { "q": "Why did moving his hand closer make the shadow grow huge?", "clueSentence": 3, "options": ["It blocked more light", "His hand grew bigger", "The wall moved closer"], "correct": 0, "recap": "Moving closer to the bulb blocked a wider part of the light beam." }
    ]
  },
  {
    "id": 84, "title": "The Magnet Treasure Hunt", "emoji": "🧭", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Dad hid ten steel paperclips and ten plastic buttons in a box of dry sand.",
      "Hannah swept a red bar magnet slowly back and forth just above the sand.",
      "All ten shiny paperclips jumped up and stuck to the magnet.",
      "The plastic buttons stayed buried because magnets only pull on certain metals."
    ],
    "questions": [
      { "q": "What two kinds of objects were hidden in the sand?", "clueSentence": 0, "options": ["Metal clips and plastic buttons", "Gold coins and shells", "Marbles and stones"], "correct": 0, "recap": "Dad hid steel paperclips and plastic buttons in the dry sand." },
      { "q": "Which items jumped up onto Hannah's magnet?", "clueSentence": 2, "proveSentence": true, "options": ["The steel paperclips", "The plastic buttons", "The grains of sand"], "correct": 0, "recap": "All ten steel paperclips stuck to the red bar magnet." },
      { "q": "Why were the plastic buttons left behind in the sand?", "clueSentence": 3, "options": ["Plastic is not magnetic", "They were too heavy", "Hannah missed that side"], "correct": 0, "recap": "Magnets only attract certain metals like steel, not plastic." }
    ]
  },
  {
    "id": 85, "title": "Rain Gauge in the Garden", "emoji": "🌧️", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Maya drew centimetre lines up the side of a tall clear glass jar.",
      "She placed the jar in an open spot on the patio before a rainstorm.",
      "Raindrops fell straight into the open top of the jar all afternoon.",
      "When the clouds cleared, Maya read the lines to see that three centimetres of rain had fallen."
    ],
    "questions": [
      { "q": "What did Maya mark on the outside of the glass jar?", "clueSentence": 0, "options": ["Measuring lines", "Red stars", "Her name"], "correct": 0, "recap": "She drew centimetre measuring lines up the side of the jar." },
      { "q": "Where did Maya set the jar before the storm?", "clueSentence": 1, "proveSentence": true, "options": ["Out in the open", "Under a roof", "Inside a shed"], "correct": 0, "recap": "She put the jar in an open spot on the patio." },
      { "q": "How did Maya know three centimetres of rain fell?", "clueSentence": 3, "options": ["She checked the jar lines", "She heard it on TV", "She counted the drops"], "correct": 0, "recap": "She read the water level against the centimetre lines she drew." }
    ]
  },
  {
    "id": 86, "title": "Warm Air Balloon", "emoji": "🎈", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Sam stretched the neck of a flat red balloon over an empty plastic bottle.",
      "He stood the bottle inside a bowl filled with hot tap water.",
      "The hot water warmed the air trapped inside the bottle, making it expand.",
      "As the warm air spread upward, the red balloon puffed up all by itself."
    ],
    "questions": [
      { "q": "What did Sam put over the top of the empty bottle?", "clueSentence": 0, "options": ["A flat balloon", "A metal lid", "A paper napkin"], "correct": 0, "recap": "He stretched a deflated red balloon over the bottle neck." },
      { "q": "Where did Sam place the bottle?", "clueSentence": 1, "proveSentence": true, "options": ["In hot water", "In the freezer", "On a sunny roof"], "correct": 0, "recap": "He stood the bottle inside a bowl of hot tap water." },
      { "q": "Why did the balloon inflate without anyone blowing into it?", "clueSentence": 2, "options": ["Warm air expanded inside", "Water filled the balloon", "Wind blew through a hole"], "correct": 0, "recap": "Heat from the water warmed the air inside, causing it to expand into the balloon." }
    ]
  },
  {
    "id": 87, "title": "Mirror Reflection Maze", "emoji": "🪞", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Tariq set a green target card around the corner of the hallway.",
      "His torch light could not bend around the corner by itself.",
      "Tariq held a small flat mirror at an angle where the hallway turned.",
      "The shiny mirror bounced the torch beam sideways right onto the green card."
    ],
    "questions": [
      { "q": "Why couldn't the torch light hit the card at first?", "clueSentence": 1, "options": ["Light travels straight", "The torch battery died", "The card was black"], "correct": 0, "recap": "Light beams travel in straight lines and cannot bend around corners alone." },
      { "q": "What object did Tariq hold at the corner?", "clueSentence": 2, "proveSentence": true, "options": ["A small mirror", "A clear glass", "A wooden ruler"], "correct": 0, "recap": "He held a small flat mirror at an angle at the corner." },
      { "q": "How did the light reach the green target card?", "clueSentence": 3, "options": ["It reflected off the mirror", "Tariq moved the card", "He used a second torch"], "correct": 0, "recap": "The mirror reflected the beam sideways onto the target card." }
    ]
  },
  {
    "id": 88, "title": "Celery Colour Drink", "emoji": "🥬", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Ruby poured dark blue food colouring into a glass of water.",
      "She stood a pale green celery stalk inside the blue water.",
      "Tiny tubes inside the celery stem pulled the coloured water upward like straws.",
      "By the next day, the pale leaves at the top of the celery had turned bright blue."
    ],
    "questions": [
      { "q": "What did Ruby put into the glass of blue water?", "clueSentence": 1, "options": ["A celery stalk", "A white rose", "A carrot stick"], "correct": 0, "recap": "She stood a pale green celery stalk in the blue water." },
      { "q": "How did the water travel up the celery stem?", "clueSentence": 2, "proveSentence": true, "options": ["Through tiny inner tubes", "By splashing up the outside", "Through the leaves first"], "correct": 0, "recap": "Tiny tubes inside the stem pulled the water upward like straws." },
      { "q": "Why were the celery leaves blue the next morning?", "clueSentence": 3, "options": ["Blue water reached the top", "Ruby painted the leaves", "The glass tipped over"], "correct": 0, "recap": "The stem carried the blue coloured water all the way up into the leaves." }
    ]
  },
  {
    "id": 89, "title": "Static Balloon Hair", "emoji": "⚡", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Max blew up a yellow rubber balloon and tied a knot in the end.",
      "He rubbed the balloon quickly back and forth against his wool jumper.",
      "Rubbing the wool gave the balloon a tiny static electric charge.",
      "When Max held the balloon near his head, strands of his hair floated straight up."
    ],
    "questions": [
      { "q": "What did Max rub the yellow balloon against?", "clueSentence": 1, "options": ["His wool jumper", "The wooden floor", "A glass window"], "correct": 0, "recap": "He rubbed the balloon back and forth on his wool jumper." },
      { "q": "What built up on the balloon from rubbing the wool?", "clueSentence": 2, "proveSentence": true, "options": ["A static charge", "Sticky glue", "Warm water"], "correct": 0, "recap": "Rubbing the wool gave the balloon a static electric charge." },
      { "q": "Why did Max's hair rise upward toward the balloon?", "clueSentence": 3, "options": ["Static electricity pulled it", "A fan was blowing it upwards", "He had used lots of hair gel"], "correct": 0, "recap": "The static charge on the balloon attracted the light strands of hair." }
    ]
  },
  {
    "id": 90, "title": "Sun-Dried Clay Bowl", "emoji": "🏺", "category": "Discovery", "readFirstGate": true,
    "sentences": [
      "Chloe pinched and rolled a lump of soft wet clay into a small round dish.",
      "She carved wavy patterns around the rim with a toothpick.",
      "Chloe set the damp dish on a sunny windowsill for two warm days.",
      "The sunshine dried out all the water, turning the soft clay into a hard bowl."
    ],
    "questions": [
      { "q": "What tool did Chloe use to draw patterns on the clay?", "clueSentence": 1, "options": ["A toothpick", "A paintbrush", "A pair of scissors"], "correct": 0, "recap": "She carved wavy patterns around the rim using a toothpick." },
      { "q": "Where did Chloe leave her dish for two days?", "clueSentence": 2, "proveSentence": true, "options": ["On a sunny windowsill", "Inside a dark cupboard", "Under a wet towel"], "correct": 0, "recap": "She set the dish on a sunny windowsill." },
      { "q": "Why did the soft clay become hard?", "clueSentence": 3, "options": ["The sun dried the water out", "She baked it in an oven", "She froze it in ice"], "correct": 0, "recap": "Warm sunshine evaporated the water from the clay so it hardened." }
    ]
  },
  // ---------- Longer & Harder ----------
  {
    "id": 91, "title": "The Triple-Layer Density Jar", "emoji": "🧪", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Leo wanted to see how liquids of different weights behave in the same glass.",
      "First, he poured thick golden syrup into the bottom of a tall clear jar.",
      "Next, he slowly poured blue dish soap down the side, and it rested cleanly on top of the syrup.",
      "Then Leo added yellow cooking oil, which floated above the blue soap without mixing.",
      "When Leo dropped a purple grape into the jar, it sank through the oil and soap before stopping on the syrup.",
      "The grape stopped there because it was heavier than oil and soap, yet lighter than the dense syrup."
    ],
    "questions": [
      { "q": "Which liquid stayed right at the very top of the jar?", "clueSentence": 3, "options": ["Cooking oil", "Golden syrup", "Blue dish soap"], "correct": 0, "recap": "Yellow cooking oil is the lightest liquid, so it floated above the soap." },
      { "q": "Where did the purple grape come to rest inside the jar?", "clueSentence": 4, "proveSentence": true, "options": ["Floating on the syrup", "At the very bottom", "Above the yellow oil"], "correct": 0, "recap": "The grape sank past the oil and soap and rested on top of the syrup." },
      { "q": "Why did the grape sink through the soap but not through the syrup?", "clueSentence": 5, "options": ["It is lighter than syrup", "The syrup was frozen", "Soap pushed it down"], "correct": 0, "recap": "The grape is denser than oil and soap, but less dense than golden syrup." }
    ]
  },
  {
    "id": 92, "title": "Why Astronauts Wear Spacesuits", "emoji": "👨‍🚀", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Outside a spacecraft, space has no air to breathe and extreme temperatures.",
      "In direct sunlight, space gets boiling hot, while in shadow it drops freezing cold.",
      "Before stepping outside for a spacewalk, astronauts put on a bulky white spacesuit.",
      "The suit is sealed tight and filled with fresh oxygen so the astronaut can breathe normally.",
      "Its bright white outer fabric reflects harsh sunlight away so the astronaut does not overheat.",
      "Thick padded layers underneath act like insulation to keep body warmth inside when passing through dark shadows."
    ],
    "questions": [
      { "q": "How do temperatures change outside a spacecraft?", "clueSentence": 1, "options": ["Boiling in sun, freezing in shade", "Warm and breezy all day", "Always icy cold everywhere"], "correct": 0, "recap": "Space swings from boiling hot in sunlight to freezing cold in shadow." },
      { "q": "Why is the outside of a spacesuit coloured bright white?", "clueSentence": 4, "proveSentence": true, "options": ["To bounce away sun heat", "To glow in the dark", "To match the Moon's dust"], "correct": 0, "recap": "White fabric reflects harsh sunlight so the astronaut stays cool." },
      { "q": "How does the spacesuit protect an astronaut in dark shadows?", "clueSentence": 5, "options": ["Padded layers trap body heat", "Tiny heaters burn fuel", "The suit shrinks tighter"], "correct": 0, "recap": "Thick insulated layers keep the astronaut's body warmth from escaping." }
    ]
  },
  {
    "id": 93, "title": "The Slime Activator Experiment", "emoji": "🧫", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Maya wanted to find the exact amount of activator needed to make the best slime.",
      "She poured equal amounts of white school glue into three numbered plastic bowls.",
      "In bowl one, Maya stirred in only three drops of activator, leaving the mix runny and sticky.",
      "In bowl two, she added two full spoons of activator, which turned the glue stiff and rubbery.",
      "In bowl three, Maya mixed in just one spoonful of activator and kneaded it smoothly.",
      "Bowl three worked best because one spoonful gave the slime enough stretch without making it hard."
    ],
    "questions": [
      { "q": "What happened to the slime in bowl one?", "clueSentence": 2, "options": ["It stayed wet and sticky", "It broke into dry crumbs", "It bounced like a ball"], "correct": 0, "recap": "Three drops were too few, leaving bowl one runny and sticky." },
      { "q": "Why did bowl two become stiff and rubbery?", "clueSentence": 3, "proveSentence": true, "options": ["She put in too much activator", "She forgot to add glue", "She left it in the sun"], "correct": 0, "recap": "Adding two full spoons of activator over-thickened the glue." },
      { "q": "Why did bowl three make the best slime of all?", "clueSentence": 5, "options": ["One spoon balanced stretch and firmness", "It had a different kind of glue in it", "She added warm water to make it soft"], "correct": 0, "recap": "One spoonful of activator made it stretchy without turning stiff." }
    ]
  },
  {
    "id": 94, "title": "Olympus Mons on Mars", "emoji": "🏔️", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Mars is home to Olympus Mons, the tallest volcano in our entire solar system.",
      "On Earth, the rocky outer crust is broken into plates that slowly drift over hot magma.",
      "As Earth's crust moves, a volcano gets carried away from the hot spot and stops growing.",
      "On Mars, however, the rocky crust stays locked in one place instead of drifting.",
      "Because the ground never moved, melted lava piled up in the exact same spot for millions of years.",
      "As a result, Olympus Mons grew nearly three times taller than Mount Everest on Earth."
    ],
    "questions": [
      { "q": "Why do volcanoes on Earth eventually stop growing taller?", "clueSentence": 2, "options": ["Moving crust carries them away", "Oceans put out the lava", "Earth has no hot magma"], "correct": 0, "recap": "Drifting plates carry Earth's volcanoes away from the hot magma source." },
      { "q": "How is the rocky crust of Mars different from Earth's?", "clueSentence": 3, "proveSentence": true, "options": ["It stays still in one spot", "It is made of solid ice", "It spins twice as fast"], "correct": 0, "recap": "Unlike Earth, the crust on Mars remains stationary." },
      { "q": "Why was Olympus Mons able to grow nearly three times higher than Everest?", "clueSentence": 4, "options": ["Lava stacked in one place for ages", "Giant meteors built a mound", "Strong winds piled up sand"], "correct": 0, "recap": "Because the crust stayed still, lava piled up in the same spot for millions of years." }
    ]
  },
  {
    "id": 95, "title": "The Giant Messy Paint Pendulum", "emoji": "🎨", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Tariq built a tall wooden frame outdoors and laid a giant black paper sheet underneath.",
      "He poked a tiny hole in the bottom of a paper cup and hung it from the frame on a string.",
      "Tariq held his finger under the hole to plug it while pouring thick white paint into the cup.",
      "Next, he moved his finger away and gave the swinging cup a gentle push sideways.",
      "As the cup swung back and forth in wide loops, a thin stream of white paint dripped out.",
      "Without Tariq touching the paper, the swinging cup drew neat white rings all across the black sheet."
    ],
    "questions": [
      { "q": "How did Tariq keep paint from spilling while filling the cup?", "clueSentence": 2, "options": ["Covered the hole with a finger", "Put tape over the top", "Froze the paint solid"], "correct": 0, "recap": "He plugged the bottom hole with his finger while pouring the paint." },
      { "q": "What happened right after Tariq let go and pushed the cup?", "clueSentence": 4, "proveSentence": true, "options": ["Paint dripped as it swung", "The string snapped off", "The paper blew away"], "correct": 0, "recap": "As the cup swung in loops, white paint streamed out of the hole." },
      { "q": "Why did neat rings appear on the black paper?", "clueSentence": 5, "options": ["The swinging cup traced loops", "Tariq used a round stencil", "Raindrops splashed the paint"], "correct": 0, "recap": "The pendulum motion of the dripping cup drew smooth loops on the paper." }
    ]
  },
  {
    "id": 96, "title": "How Eclipses Hide the Sun", "emoji": "🌑", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "The Sun is four hundred times wider than the Moon, which sounds far too big for the Moon to hide.",
      "However, the Moon happens to be four hundred times closer to Earth than the Sun is.",
      "Because of this matching distance, both look the exact same size in our sky.",
      "During a solar eclipse, the Moon moves directly in a line between the Sun and Earth.",
      "The Moon blocks the Sun's bright rays and casts a dark shadow onto part of Earth.",
      "People standing inside that shadow see daytime turn dark like twilight for a few minutes."
    ],
    "questions": [
      { "q": "Why do the Sun and Moon look the same size from Earth?", "clueSentence": 1, "options": ["The Moon is much closer", "The Sun shrinks at noon", "Clouds magnify the Moon"], "correct": 0, "recap": "Being 400 times closer makes the smaller Moon match the Sun's apparent size." },
      { "q": "Where does the Moon move during a solar eclipse?", "clueSentence": 3, "proveSentence": true, "options": ["Between Earth and the Sun", "Behind the Sun", "Inside Earth's shadow"], "correct": 0, "recap": "The Moon passes directly between the Sun and Earth." },
      { "q": "Why does the sky grow dark in the middle of the day during an eclipse?", "clueSentence": 4, "options": ["The Moon blocks sunlight", "Night arrives early", "Storm clouds cover the world"], "correct": 0, "recap": "The Moon blocks the Sun's light and casts its shadow across Earth." }
    ]
  },
  {
    "id": 97, "title": "The Baking Soda Balloon Race", "emoji": "🏁", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Chloe and Sam raced to blow up balloons without using air from their mouths.",
      "Chloe scooped one spoon of baking soda into her blue balloon, while Sam put three spoons into his red balloon.",
      "They stretched both balloons tightly over bottles containing equal amounts of sour vinegar.",
      "When they tipped the balloons upright, the white powder dropped down into the vinegar.",
      "The vinegar and baking soda fizzed wildly and created invisible carbon dioxide gas.",
      "Sam's red balloon grew much bigger than Chloe's because extra powder produced more gas."
    ],
    "questions": [
      { "q": "How was Sam's balloon prepared differently from Chloe's?", "clueSentence": 1, "options": ["It held more baking soda", "It had hot water inside", "It was tied in a knot"], "correct": 0, "recap": "Sam put three spoons of baking soda in his balloon, while Chloe used one." },
      { "q": "What did the vinegar and baking soda turn into when they mixed?", "clueSentence": 4, "proveSentence": true, "options": ["Carbon dioxide gas", "Thick purple slime", "Sweet apple juice"], "correct": 0, "recap": "The chemical reaction produced invisible carbon dioxide gas." },
      { "q": "Why did Sam win the race with a larger balloon?", "clueSentence": 5, "options": ["More powder made more gas", "His bottle was taller", "He blew into his balloon"], "correct": 0, "recap": "His three spoons of baking soda created more gas than Chloe's one spoon." }
    ]
  },
  {
    "id": 98, "title": "Saturn's Moon Titan", "emoji": "🟠", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Titan is Saturn's largest moon and is wrapped in a thick, hazy orange sky.",
      "Just like Earth, Titan has clouds, rain, rivers, and wide lakes on its surface.",
      "However, Titan is so far from the Sun that temperatures stay far below freezing.",
      "Because it is far too cold for liquid water, Titan's lakes are filled with liquid methane instead.",
      "Hard chunks of frozen water ice sit on the ground and act just like heavy rocks.",
      "A space probe has landed on Titan and sent back photos of its icy pebbles and orange clouds."
    ],
    "questions": [
      { "q": "What does the sky look like on Saturn's moon Titan?", "clueSentence": 0, "options": ["Thick and hazy orange", "Clear bright green", "Completely airless black"], "correct": 0, "recap": "Titan has a dense, hazy orange atmosphere." },
      { "q": "What fills the rivers and lakes on Titan?", "clueSentence": 3, "proveSentence": true, "options": ["Liquid methane", "Warm salt water", "Melted lava"], "correct": 0, "recap": "Titan's rivers and lakes are filled with liquid methane." },
      { "q": "Why are there no lakes of liquid water on Titan?", "clueSentence": 2, "options": ["It is far too freezing cold", "There is no atmosphere", "All water boiled away"], "correct": 0, "recap": "Titan is so far from the Sun that water stays frozen solid like rocks." }
    ]
  },
  {
    "id": 99, "title": "Making Coloured Kinetic Sand", "emoji": "⏳", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "Noah wanted to make soft moulding sand that would never dry out indoors.",
      "He mixed four cups of fine dry play sand with two spoons of cornflour in a tub.",
      "Next, Noah stirred in blue liquid food colouring until every grain looked bright blue.",
      "Finally, he drizzled in a little vegetable oil and worked it through the sand with his hands.",
      "The thin coating of oil made the sand grains cling together instead of scattering apart.",
      "Noah pressed the kinetic sand into a cup and sliced clean blocks with a plastic knife without crumbling."
    ],
    "questions": [
      { "q": "What dry ingredients did Noah mix together first?", "clueSentence": 1, "options": ["Play sand and cornflour", "Sugar and baking soda", "Salt and white glue"], "correct": 0, "recap": "He mixed fine dry play sand with two spoons of cornflour." },
      { "q": "What ingredient stopped the sand grains from scattering apart?", "clueSentence": 4, "proveSentence": true, "options": ["Vegetable oil", "Cold water", "Shaving foam"], "correct": 0, "recap": "A thin coat of vegetable oil made the grains cling together." },
      { "q": "How could Noah tell his kinetic sand worked properly?", "clueSentence": 5, "options": ["It sliced cleanly without crumbling", "It floated on water", "It bounced across the table"], "correct": 0, "recap": "He could mould and slice neat blocks without the sand falling apart." }
    ]
  },
  {
    "id": 100, "title": "Voyager's Golden Record", "emoji": "🛸", "category": "Longer & Harder", "readFirstGate": true,
    "sentences": [
      "In 1977, scientists launched the Voyager spacecraft to fly past the giant outer planets.",
      "After passing Neptune, Voyager kept flying outward and left our solar system behind.",
      "Before launch, engineers bolted a shiny gold-plated copper disc onto the side of the spacecraft.",
      "The golden record stored sounds from Earth, including ocean waves, thunder, music, and greetings in fifty-five languages.",
      "Scientists also engraved simple picture instructions onto the metal cover.",
      "Those pictures show any distant alien finder how to spin the disc and play the sounds with a needle."
    ],
    "questions": [
      { "q": "Where did the Voyager spacecraft go after passing the outer planets?", "clueSentence": 1, "options": ["Out of our solar system", "Back to land on Earth", "Into orbit around Mars"], "correct": 0, "recap": "Voyager kept flying outward beyond our solar system into deep space." },
      { "q": "What kinds of sounds were saved on the golden disc?", "clueSentence": 3, "proveSentence": true, "options": ["Nature sounds, music, and voices", "Rocket engine roars only", "Radio weather reports"], "correct": 0, "recap": "It holds ocean waves, thunder, music, and greetings in 55 languages." },
      { "q": "Why did scientists carve pictures onto the record's cover?", "clueSentence": 5, "options": ["To explain how to play it", "To decorate the spacecraft", "To show a map of Mars"], "correct": 0, "recap": "The diagrams show any future finder how to spin and play the disc." }
    ]
  }
];
