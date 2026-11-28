/* The Day the Crayons Made Friends – letters, pictures and questions for the School Work section.
   Made by another AI for Kas (Nov 2026) and copied here word for word. Pictures are in made-friends/.
   The right answer is options[correct]; answers are shuffled on screen. Each question's star id is
   <section id>.<part key>.<number>, so keep the order when adding questions. */
window.CRAYON_BOOK = {
  id: "crayons-made-friends",
  title: "The Day the Crayons Made Friends",
  boxName: "Crayon box",
  pictureFolder: "crayons/made-friends/",
  say: {"lead": "Read each crayon's letter and look at the picture, then answer the questions.", "right": "✨ Correct on your first try! Fantastic reading!", "wrong": "🤔 Not quite! Hint: {hint} Try one more time!", "second": "👍 Great job! You used the hint to find the correct answer: \"{answer}\".", "shown": "📚 Good effort! The correct answer is highlighted in green above: \"{answer}\"."},
  sections: [
    {
      id: "intro",
      kind: "intro",
      name: "Story Intro",
      card: "Where did they go?",
      heading: "Story Intro: Where Did They Go?",
      doneName: "the start of the story",
      emoji: "📬",
      color: "#3182CE",
      ink: "#2B6CB0",
      edge: "#3182CE",
      friend: "The Empty Crayon Box & The Air Mail Bundle",
      clue: "🕵️ Picture Detail: Duncan's '12 IN A BOX' crayon box is completely empty on the left, and a stack of 'VIA AIR MAIL' letters tied with pink string arrives on the right!",
      pictures: ["intro1.jpg", "intro2.jpg"],
      letter: "One day, Duncan went to take out his crayons and found that they were all gone.\nAgain!\n\nOnly this time, they didn't quit . . .\nand he didn't lose them . . .\nThis time . . . they LEFT!\nHe became very worried.\n\nBut then . . . the letters arrived.",
      parts: [
        { key: "opening", title: "📬 Opening Mystery", skill: "Finding facts", questions: [
          { q: "What did Duncan find when he went to take out his crayons at the start of the book?", options: ["They were all GONE again!", "They were all broken in half", "They were sleeping in the box"], correct: 0, hint: "Read the very first sentence of the story on the left." },
          { q: "Did the crayons quit or get lost this time?", options: ["Neither—this time, they LEFT on their own!", "They QUIT again because of too much colouring", "Duncan LOST them at school, just like before"], correct: 0, hint: "Look at the lines: 'Only this time, they didn't quit... This time... they LEFT!'" },
          { q: "How did Duncan feel when he saw the empty crayon box?", options: ["He became very worried", "He was angry and shouted", "He didn't notice at all"], correct: 0, hint: "Check the sentence right after 'they LEFT!'." },
          { q: "How did the letters from the crayons arrive for Duncan?", options: ["In a stack of Air Mail envelopes tied up with pink/red string", "By text message on Duncan's mum's phone", "In a big brown parcel left by the postman at the front door"], correct: 0, hint: "Look at the second illustration showing the bundle addressed 'To: DUNCAN'." },
          { q: "Look at the blue crayon box in the first illustration: what does it say on the side flap?", options: ["12 IN A BOX", "64 CRAYONS", "DO NOT OPEN"], correct: 0, hint: "Click Zoom Picture on the blue Crayon box and check the left side flap!" }
        ] }
      ]
    },
    {
      id: "red",
      kind: "letter",
      name: "Red Crayon",
      card: "Red Crayon",
      color: "#E74C3C",
      ink: "#C0392B",
      edge: "#E74C3C",
      friend: "🚒 Abby the Fire Engine & Firefighters",
      clue: "🕵️ Picture Detail: Red Crayon wears yellow firefighter helmet '07' on Abby's ladder spraying water onto pretend window fires!",
      pictures: ["red.jpg"],
      letter: "Hi Duncan!\n\nYou know the only thing better than colouring Fire Engines? Getting to DRIVE one! I bumped into your Firefighters and they needed help putting out their pretend Fires. Guess what? I'm the perfect size! YAY! The whole team is really nice, and so is the Fire Engine.\nHer name is Abby.\n\nYour Essential worker friend,\nFire Engine Driver person\n(Formerly Red crayon)",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What does Red Crayon say is the ONLY thing better than colouring Fire Engines?", options: ["Getting to DRIVE one!", "Painting fire stations", "Listening to loud sirens"], correct: 0, hint: "Look at the second sentence: 'Getting to DRIVE one!'" },
          { q: "Who did Red Crayon bump into when he left the crayon box?", options: ["Duncan's Firefighters", "The green army men", "A flock of dog biscuits"], correct: 0, hint: "Check who needed help with their pretend fires." },
          { q: "What did the Firefighters need Red Crayon's help doing?", options: ["Putting out their pretend Fires", "Fixing a flat tyre on the fire engine", "Building a tall Lego fire station"], correct: 0, hint: "Look right after 'I bumped into your Firefighters'." },
          { q: "Why is Red Crayon able to ride and help on the toy Fire Engine so well?", options: ["Because he is the perfect size!", "Because he has his own wheels!", "Because he is waterproof and red!"], correct: 0, hint: "Read what he says right after 'Guess what?'" },
          { q: "What is the name of the Fire Engine?", options: ["Abby", "Shelby", "Leslie"], correct: 0, hint: "Check the line right before the sign-off: 'Her name is...'" },
          { q: "How does Red Crayon describe the firefighter team and Abby?", options: ["Really nice", "Very bossy and loud", "Too sleepy to work"], correct: 0, hint: "Look at: 'The whole team is really nice, and so is the Fire Engine.'" },
          { q: "What kind of friend does Red Crayon call himself in his sign-off?", options: ["Your Essential worker friend", "Your overworked, tired friend", "Your fire-fighting buddy"], correct: 0, hint: "Look at the first line of his closing signature." },
          { q: "What is Red Crayon's new title at the very bottom of the letter?", options: ["Fire Engine Driver person (Formerly Red crayon)", "Chief Red the Firefighter (Formerly Red crayon)", "Captain Fire Hose (Formerly Red crayon)"], correct: 0, hint: "Read the last two lines of the letter." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "In the first book, Red Crayon was exhausted from colouring fire engines. Why is he happy with fire engines now?", options: ["Instead of working to colour them, he gets to play and DRIVE a real toy one!", "He never has to see or colour a fire engine ever again", "Duncan promised to colour every fire engine with Orange Crayon instead!"], correct: 0, hint: "Compare colouring fire engines vs. driving one with friends!" },
          { q: "How do the toy Firefighters treat Red Crayon?", options: ["They welcome him onto the team as a helpful friend", "They make him colour all of their boots and helmets", "They lock him inside the truck so he can't help"], correct: 0, hint: "He says 'The whole team is really nice'!" },
          { q: "Why is being 'the perfect size' so exciting for Red Crayon?", options: ["He fits right on the toy ladder and can drive Abby just like a real firefighter", "He can hide under the rug where nobody will ever make him colour again", "He fits back inside the crayon box after a long day of driving fire engines"], correct: 0, hint: "Look at him standing on Abby's ladder in the picture!" },
          { q: "Why does Red Crayon say '(Formerly Red crayon)' at the end?", options: ["Because he now sees himself as a 'Fire Engine Driver person' first", "Because his colour has changed from red to orange", "Because Duncan gave his red colour to a new crayon called Abby"], correct: 0, hint: "He has a proud new job title!" },
          { q: "What does Red Crayon bring to Duncan's Dinner Party at the end of the book?", options: ["Abby the Fire Engine and glasses of water ('Anyone for WATER?')", "A plate of cupcakes ('Breezy Bake muffin, anyone?')", "A ping-pong paddle ('Glad I could get freed up for this.')"], correct: 0, hint: "Remember what Firefighters use hoses for!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what number is on Red Crayon's yellow firefighter helmet?", options: ["07", "99", "01"], correct: 0, hint: "Look at Red Crayon's yellow hat at the top of the ladder!" },
          { q: "Where is Red Crayon standing while spraying the water hose in the picture?", options: ["At the top of Abby's silver ladder", "On the roof of the burning house", "Inside the cab, behind the steering wheel"], correct: 0, hint: "Look at the silver ladder extending from the red truck." },
          { q: "How does Red Crayon feel in this letter compared to the first book?", options: ["Thrilled, proud, and excited ('YAY!')", "Tired and angry ('I NEED A REST!')", "Embarrassed and shy ('HELP!')"], correct: 0, hint: "Notice his exclamation marks and 'YAY!'" }
        ] }
      ]
    },
    {
      id: "peach",
      kind: "letter",
      name: "Peach Crayon",
      card: "Peach Crayon",
      color: "#F5A278",
      ink: "#BA4A00",
      edge: "#E57E50",
      friend: "🕵️ Professor Aubergine & Mystery Game",
      clue: "🕵️ Picture Detail: Peach Crayon wears a purple robe and monocle blowing bubbles from a pipe while Professor Aubergine asks: 'Think the toilet is free yet?'",
      pictures: ["peach.jpg"],
      letter: "Dear Duncan,\n\nI'm now a piece in your MYSTERY board game. Mr Carcass, who lives in this Mansion, was clobbered while in the toilet. Now we have to work out WHODUNNIT! Was it Col. Ketchup with a Frying pan? or Lady Azure with a plunger? or even my new Friend Professor Aubergine?\nSome even think it was ME! I must stay to clear my name.\n\nBaron Naked Von Nuddington\n(aka Peach Crayon)",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What game has Peach Crayon become a piece in?", options: ["Duncan's MYSTERY board game", "Duncan's CHESS set on the shelf", "Duncan's PING-PONG table"], correct: 0, hint: "Check the very first sentence of Peach's letter." },
          { q: "Who owns the Mansion and got clobbered while in the toilet?", options: ["Mr Carcass", "Col. Ketchup", "Mr Brown"], correct: 0, hint: "Look at the second sentence: 'Mr Carcass, who lives in this Mansion...'" },
          { q: "What mystery do the board game pieces have to work out?", options: ["WHODUNNIT!", "Where the dice went", "Who ate the cupcakes"], correct: 0, hint: "Look for the word in ALL CAPS in the middle of the letter." },
          { q: "Which suspect is accused of using a Frying pan?", options: ["Col. Ketchup", "Lady Azure", "Professor Aubergine"], correct: 0, hint: "Read: 'Was it Col. Ketchup with a Frying pan?'" },
          { q: "Which suspect is accused of using a plunger?", options: ["Lady Azure", "Col. Ketchup", "Baron Naked Von Nuddington"], correct: 0, hint: "Read right after 'or Lady Azure with a...'" },
          { q: "Who is Peach Crayon's new friend in the Mystery board game?", options: ["Professor Aubergine", "Shelby the Doll", "Leslie"], correct: 0, hint: "Read: 'or even my new Friend...'" },
          { q: "Why does Peach Crayon say he MUST stay in the game?", options: ["Because some think it was HIM, so he must stay to clear his name", "Because the box is locked and he can't get out", "Because Professor Aubergine won't let him leave until the game is over"], correct: 0, hint: "Look at the two sentences before his signature." },
          { q: "What fancy mystery-character name does Peach Crayon use to sign his letter?", options: ["Baron Naked Von Nuddington (aka Peach Crayon)", "Sir Peach of the Mansion (aka Peach Crayon)", "Inspector Wrapper (aka Peach Crayon)"], correct: 0, hint: "Read the signature at the bottom of the letter." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "In the first book, Peach Crayon was hiding in the box because his wrapper was peeled off. How did he fix that here?", options: ["He wears a fancy purple dressing gown/robe and embraced the funny name 'Baron Naked Von Nuddington'!", "He glued a new paper wrapper on and asked everyone to call him Peach again", "He stayed hidden in the crayon box and wrote his letter from inside it"], correct: 0, hint: "Look at what Peach is wearing in the picture!" },
          { q: "Why is 'Aubergine' a clever name for the purple board game piece?", options: ["Because 'aubergine' (eggplant) is a shade of purple!", "Because he grows in the vegetable patch in the garden!", "Because 'aubergine' is a French word for red!"], correct: 0, hint: "Look at the color of the small plastic pawn next to Peach." },
          { q: "What do all the suspect names (Col. Ketchup, Lady Azure, Professor Aubergine) have in common?", options: ["They are all playful color puns (Red ketchup, Blue azure, Purple aubergine)!", "They are all names of real dogs (Ketchup, Azure, and Aubergine)!", "They are all names of real teachers at Duncan's school!"], correct: 0, hint: "Think about the colors Ketchup, Azure, and Aubergine!" },
          { q: "Why is Peach Crayon having fun even though he is a suspect in the mystery?", options: ["He loves playing the dramatic detective role with his new friend Professor Aubergine", "He wants to go to jail so he can get away from the crayon box", "He wants to win the board game so he can keep the Mansion for himself"], correct: 0, hint: "Notice his monocle, robe, and bubble pipe!" },
          { q: "What joke does Peach Crayon make at the Dinner Party at the end of the book?", options: ["'This soup, like the plot, thickens!'", "'Bow before your queen! All shall love me and despair!'", "'Glad I could get freed up for this.'"], correct: 0, hint: "It's a detective mystery pun about soup and a plot!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what comes out of Peach Crayon's blue detective pipe?", options: ["Soap bubbles!", "Thick black smoke", "Fire"], correct: 0, hint: "Look right above the blue pipe in Peach's hand." },
          { q: "What funny question is the purple game piece (Professor Aubergine) asking in the picture?", options: ["'Think the toilet is free yet?'", "'Shall we roll the dice again?'", "'Was it you with the plunger?'"], correct: 0, hint: "Click Zoom Picture to read the text above the little purple pawn!" },
          { q: "How does Peach Crayon feel now compared to when he was embarrassed in the first book?", options: ["Confident, dramatic, and playful in his new detective robe", "Still too shy to leave the box without his wrapper", "Angry at Purple Crayon for blaming him for everything"], correct: 0, hint: "Look at his proud pose with his monocle and robe!" }
        ] }
      ]
    },
    {
      id: "white",
      kind: "letter",
      name: "White Crayon",
      card: "White Crayon",
      color: "#FFFFFF",
      ink: "#1A202C",
      edge: "#1A202C",
      friend: "♟️ Duncan's Chess Set",
      clue: "🕵️ Picture Detail: White Crayon wears a gold crown on the black-and-white chessboard laughing 'MWAHAHAAA' while the real white chess piece says: 'She is SO impressive!'",
      white: true,
      dark: true,
      pictures: ["white.jpg"],
      letter: "Sir Duncan,\n\nRemember How I used to say \"POOR ME, I'M INVISIBLE, NO ONE SEES ME, blah blah.\"?\nWell, NOT ANY MORE, pal! I met your chess set and they were missing a piece. Goodness me, I'm the MOST POWERFUL PIECE ON THE BOARD!\nEven more than the KING! NOW Everyone ALWAYS SEES ME! MWAHAHAAA (well, half the time!)\n\nYour TERRIFYING Queen,\nWHITE CRAYON",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How does White Crayon greet Duncan at the start of her letter?", options: ["Sir Duncan,", "Dear Duncan,", "Mon Cher Duncan,"], correct: 0, hint: "Check the royal greeting on the first line!" },
          { q: "What did White Crayon used to complain about in the first book?", options: ["'POOR ME, I'M INVISIBLE, NO ONE SEES ME, blah blah.'", "'I HAVE TO WORK ON CHRISTMAS AND VALENTINE'S DAY!'", "'Stop calling me light brown, blah blah.'"], correct: 0, hint: "Look at the quote in the first sentence." },
          { q: "Which of Duncan's games did White Crayon meet?", options: ["His chess set", "His mystery board game", "His ping-pong table"], correct: 0, hint: "Read: 'I met your chess set and they were missing a piece.'" },
          { q: "Why did the chess set need White Crayon to join them?", options: ["Because they were missing a piece", "Because the board wasn't coloured in", "Because they needed a referee"], correct: 0, hint: "Look right after 'I met your chess set'." },
          { q: "Which chess piece did White Crayon become?", options: ["The Queen — the MOST POWERFUL PIECE ON THE BOARD!", "A tiny Pawn — the SMALLEST PIECE ON THE BOARD!", "A Knight — the HORSE that jumps over the others!"], correct: 0, hint: "Look at her crown and how she signs off at the bottom!" },
          { q: "Who is White Crayon even more powerful than on the chessboard?", options: ["Even more than the KING!", "More than the referee", "More than Duncan"], correct: 0, hint: "Read the line right after 'THE BOARD!'." },
          { q: "What evil/dramatic laugh does White Crayon write in her letter?", options: ["MWAHAHAAA", "HO HO HO", "HEE HEE HEE"], correct: 0, hint: "Look both in the picture and near the bottom of the letter!" },
          { q: "How does White Crayon sign her letter?", options: ["Your TERRIFYING Queen, WHITE CRAYON", "Your empty friend, white crayon", "Your quiet friend, White"], correct: 0, hint: "Check the last two lines of the letter." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "Why is White Crayon's letter shown on BLACK paper this time?", options: ["So her white crayon writing stands out brightly instead of being invisible on white paper!", "Because she ran out of white paper and black was all that was left", "Because Black Crayon coloured the whole page in before she wrote on it"], correct: 0, hint: "Remember what happens when white crayon writes on white paper!" },
          { q: "Why does White Crayon joke that everyone sees her '(well, half the time!)'?", options: ["Because half the squares on a chessboard are black (where she stands out) and half are white (where she blends in)!", "Because she only plays chess at night, and in the dark nobody can see her at all", "Because she closes her eyes for half of every game, so she can't see who sees her"], correct: 0, hint: "Look at the black and white squares on the chessboard!" },
          { q: "How did joining the chess set completely change White Crayon's confidence?", options: ["She went from feeling invisible and empty to feeling like the most powerful Queen on the board!", "She still feels invisible and empty, just like she did in the first book", "She wants to go back to colouring snow and the empty spaces between things"], correct: 0, hint: "Compare 'POOR ME, I'M INVISIBLE' to 'MOST POWERFUL PIECE ON THE BOARD!'" },
          { q: "What happened to the other drawn chess pieces on the board around White Crayon?", options: ["She knocked them all over because she is such a powerful Queen!", "They ran away to school in Duncan's backpack", "They all bowed down and stood in a neat line to welcome her"], correct: 0, hint: "Look at the fallen knights, rooks, and pawns in the illustration." },
          { q: "What dramatic speech does White Crayon give from her chair at the Dinner Party finale?", options: ["'Bow before your queen! All shall love me and despair!'", "'Ladies and gentlemen, meet Teddy, the Eighth Wonder of the World.'", "'Glad I could get freed up for this.'"], correct: 0, hint: "She's still acting like the Terrifying Queen at dinner!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what is the real plastic chess piece saying as it watches White Crayon?", options: ["'She is SO impressive!'", "'Please stop knocking us over!'", "'Where is the King?'"], correct: 0, hint: "Click Zoom Picture to read the words above the white plastic chess piece on the left!" },
          { q: "What is White Crayon wearing on her head in the illustration?", options: ["A little gold crown", "A chef's hat", "A firefighter helmet"], correct: 0, hint: "Look right above White Crayon's happy face on the chessboard." },
          { q: "How is White Crayon feeling in this adventure?", options: ["Powerful, seen, and hilariously dramatic", "Invisible, lonely, and still very empty", "Scared of the other chess pieces on the board"], correct: 0, hint: "Look at her arms raised in victory shouting 'MWAHAHAAA'!" }
        ] }
      ]
    },
    {
      id: "pink",
      kind: "letter",
      name: "Pink Crayon",
      card: "Pink Crayon",
      color: "#E84393",
      ink: "#AD1457",
      edge: "#E84393",
      friend: "🧁 Spatula & BREEZY Bake Oven",
      clue: "🕵️ Picture Detail: Pink Crayon and the real pink Spatula wear chef hats surrounded by cupcakes! Spatula says: 'It was actually Breezy's idea, but I agree! Chase that dream!'",
      pictures: ["pink.jpg"],
      letter: "Mon Cher Duncan,\n\nI've ALWAYS Dreamed of being a Chef, and while going for a walk in your play kitchen I bumped into Spatula and BREEZY Bake Oven. What great guys! Spatula said to Follow my dreams, so now I'm baking everything from little cupcakes... to... OTHER little CUPCAKES! I'd love you to come and try one!\n\nAu revoir,\nLe Pink Crayon\nPastry Chef\n- La Maison De Duncan",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What French greeting does Pink Crayon use at the top of the letter?", options: ["Mon Cher Duncan,", "Bonjour Duncan,", "Dear Duncan,"], correct: 0, hint: "Look at the first three words of Pink's letter." },
          { q: "What has Pink Crayon ALWAYS dreamed of being?", options: ["A Chef", "A Fashion Model", "A Firefighter"], correct: 0, hint: "Read the very first sentence of the letter." },
          { q: "Where was Pink Crayon walking when he met his new friends?", options: ["In Duncan's play kitchen", "Under the fridge", "In the vegetable patch"], correct: 0, hint: "Read: 'while going for a walk in your...'" },
          { q: "Which two kitchen friends did Pink Crayon bump into?", options: ["Spatula and BREEZY Bake Oven", "Frying Pan and the TOASTER", "Wooden Spoon and BIG Saucepan"], correct: 0, hint: "Check the end of the first sentence!" },
          { q: "What encouraging advice did Spatula give Pink Crayon?", options: ["To Follow his dreams", "To go back to the crayon box", "To only colour princesses"], correct: 0, hint: "Read: 'Spatula said to...'" },
          { q: "What is Pink Crayon baking now?", options: ["Everything from little cupcakes... to... OTHER little CUPCAKES!", "Everything from giant birthday cakes... to... apple PIES!", "Bread, biscuits... and... Turkey DINNERS!"], correct: 0, hint: "Look at the funny joke about what kinds of things he bakes!" },
          { q: "What French goodbye does Pink Crayon use before signing his name?", options: ["Au revoir,", "Adios,", "Ciao,"], correct: 0, hint: "Check the line right above 'Le Pink Crayon'." },
          { q: "What restaurant name does Le Pink Crayon write at the very bottom?", options: ["La Maison De Duncan", "Cafe Crayon", "The Cupcake Box"], correct: 0, hint: "Look at the very last line of the letter." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "Why is it funny that Pink Crayon bakes 'everything from little cupcakes... to... OTHER little CUPCAKES!'?", options: ["Because a toy Breezy Bake Oven only makes tiny cupcakes, so that's the whole menu!", "Because he forgot how to make bread, so he only bakes cupcakes", "Because cupcakes are blue and Pink Crayon wants to make them pink"], correct: 0, hint: "Think about what a toy bake oven can fit inside!" },
          { q: "In the first book, Pink felt unused by Duncan. How did he find his own purpose here?", options: ["He followed his dream of becoming a Pastry Chef with Spatula and Breezy Bake Oven!", "He waited in the crayon box for another whole year until Duncan used him", "He coloured a pink cowboy and a pink dinosaur, just like he asked"], correct: 0, hint: "He didn't wait around—he chased his dream in the play kitchen!" },
          { q: "Why do Pink Crayon and Spatula make such a great pair visually?", options: ["They are both bright pink and wear matching chef hats!", "They are both made of wax and melt in the hot oven!", "They are both blue and wear matching aprons!"], correct: 0, hint: "Look at Pink Crayon standing arm-in-arm with the pink Spatula." },
          { q: "What does 'La Maison De Duncan' mean in French?", options: ["The House of Duncan (Duncan's House)", "Duncan's School Desk (Duncan's Desk)", "The Garden Patch (Duncan's Garden)"], correct: 0, hint: "'Maison' is French for house!" },
          { q: "What does Pink Crayon serve everyone at the Dinner Party finale?", options: ["Breezy Bake muffins/cupcakes ('Breezy Bake muffin, anyone?')", "Green beans in water ('Drink up, babies.')", "Soup from the pot ('This soup, like the plot, thickens!')"], correct: 0, hint: "Look at what Pink Crayon is holding up at the dinner table!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what does Spatula say in the speech bubble next to his chef hat?", options: ["'It was actually Breezy's idea, but I agree! Chase that dream!'", "'I need much more pink frosting for these cupcakes!'", "'Don't burn the cupcakes, or Duncan won't try one!'"], correct: 0, hint: "Click Zoom Picture to read the speech bubble between Spatula and the Breezy Bake oven!" },
          { q: "How many cupcakes are baking inside the window of the BREEZY BAKE oven (plus the ones on the floor)?", options: ["2 inside the oven and 8 around their feet!", "None inside the oven and 3 on the table!", "5 inside the oven and 100 around the kitchen!"], correct: 0, hint: "Look inside the oven window and count the cupcakes on the ground." },
          { q: "How is Pink Crayon feeling as 'Le Pink Crayon, Pastry Chef'?", options: ["Proud, inspired, and eager to share his baking with Duncan", "Bored and ignored, just like when he was stuck in the box", "Angry at Spatula for burning all of the cupcakes"], correct: 0, hint: "Look at his peaceful, happy expression with his hand on his chest!" }
        ] }
      ]
    },
    {
      id: "beige",
      kind: "letter",
      name: "Beige Crayon",
      card: "Beige Crayon",
      color: "#C8AD7F",
      ink: "#7D5E28",
      edge: "#B08D57",
      friend: "🦴 Leslie & Flock of Dog Biscuits",
      clue: "🕵️ Picture Detail: Beige Crayon wears a flat cap, chews a stalk of wheat, and holds a red shepherd's crook while tending bone-shaped dog biscuits outside a tiny cottage!",
      pictures: ["beige.jpg"],
      letter: "My Dearest Duncan,\n\nI have discovered my calling ... UNDER YOUR FRIDGE! I found a flock of Dog Biscuits that were Lost and Afraid. I built a small cottage, and now I tend to them. It's a simple, quiet Life. But Fulfilling, nonetheless. And Leslie here is even expecting! I look forward to showing you her pups.\n\nYour Humble shepherd,\nBEIGE Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "Where did Beige Crayon discover his true calling?", options: ["UNDER YOUR FRIDGE!", "In the play kitchen", "Under the bed"], correct: 0, hint: "Look for the words in ALL CAPS in the first sentence." },
          { q: "What did Beige Crayon find under the fridge?", options: ["A flock of Dog Biscuits that were Lost and Afraid", "A giant blue teddy bear that was lost and afraid", "A missing chess piece that was hiding from the Queen"], correct: 0, hint: "Read the second sentence of Beige's letter." },
          { q: "What did Beige Crayon build so he could tend to the Dog Biscuits?", options: ["A small cottage", "A secret mountain fortress", "A skyscraper"], correct: 0, hint: "Read: 'I built a small..., and now I tend to them.'" },
          { q: "How does Beige Crayon describe his new life as a shepherd?", options: ["A simple, quiet Life. But Fulfilling, nonetheless.", "A loud, busy Life. But Exciting, nonetheless.", "A boring, unfair Life. And Lonely, too."], correct: 0, hint: "Check the middle of the letter: 'It's a simple...'" },
          { q: "What is the name of the Dog Biscuit who is expecting pups?", options: ["Leslie", "Abby", "Shelby"], correct: 0, hint: "Read: 'And Leslie here is even expecting!'" },
          { q: "What does Beige Crayon look forward to showing Duncan?", options: ["Leslie's pups", "A bowl of wheat", "A turkey dinner"], correct: 0, hint: "Check the last sentence before his sign-off." },
          { q: "How does Beige Crayon sign his letter?", options: ["Your Humble shepherd, BEIGE Crayon", "Your second-place friend, Beige", "Farmer Beige"], correct: 0, hint: "Read the closing signature." },
          { q: "Why were the Dog Biscuits in need of a shepherd when Beige found them?", options: ["They were Lost and Afraid under the fridge", "They were baking in the toy oven with Pink", "They were stuck in the ping-pong net"], correct: 0, hint: "Look at how Beige describes the flock he found." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "In the first book, Beige was jealous that Brown got all the puppies while Beige only got wheat. How did Beige solve that?", options: ["He found his own beige-colored Dog Biscuits to care for (and still chews a piece of wheat)!", "He painted himself dark brown so he could colour the bears and puppies", "He chased away all of Brown Crayon's real puppies so he could have them"], correct: 0, hint: "Look at the color of the dog biscuits and the wheat in Beige's mouth!" },
          { q: "Why are Dog Biscuits the funniest possible 'flock' for Beige Crayon?", options: ["Because dog biscuits are beige-colored and shaped like little bones that rolled under the fridge!", "Because dog biscuits can fly like birds, so they need someone to keep them together", "Because the dog biscuits are bright blue, so they need a beige friend to cheer them up"], correct: 0, hint: "Look closely at the real dog biscuits in the picture!" },
          { q: "How did Oliver Jeffers turn real dog biscuits into cute pets in the illustration?", options: ["By drawing little brown ears, legs, wagging tails, and smiling faces onto photos of real dog biscuits!", "By putting tiny knitted hats and scarves on real dog biscuits and taking their photo", "By colouring the dog biscuits green and giving them all little names"], correct: 0, hint: "Inspect the 5 dog biscuits around Beige Crayon." },
          { q: "What does Beige Crayon carry in his hand to herd his flock of dog biscuits?", options: ["A tall red shepherd's crook (staff)", "A green watering can (for the garden)", "A red ping-pong paddle (for herding)"], correct: 0, hint: "Look at the curved red stick in Beige's hand." },
          { q: "What sounds do the Dog Biscuits make at the Dinner Party finale?", options: ["'ARF' and 'WOOF'", "'MWAHAHAAA' and 'YAY'", "'BAA' and 'MOO'"], correct: 0, hint: "Check the bottom corners of the Dinner Party page!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what callback to the first book is sticking out of Beige Crayon's mouth?", options: ["A stalk of wheat!", "A blue bubble pipe", "A thermometer"], correct: 0, hint: "Remember how Beige Crayon used to complain about only colouring wheat!" },
          { q: "How many Dog Biscuits are in the picture with Beige Crayon?", options: ["5 Dog Biscuits (4 near Beige and 1 in the distance)", "Only 1 Dog Biscuit (sitting next to Beige)", "12 Dog Biscuits (all in a long line behind him)"], correct: 0, hint: "Count the biscuit dogs in the illustration!" },
          { q: "How does Beige Crayon feel about his new life under the fridge?", options: ["Peaceful, content, and fulfilled caring for his flock", "Angry and still jealous of Brown Crayon's puppies", "Scared of the dark and wanting to go back to the box"], correct: 0, hint: "Notice his closed eyes, calm smile, and the word 'Fulfilling'!" }
        ] }
      ]
    },
    {
      id: "blue",
      kind: "letter",
      name: "Blue Crayon",
      card: "Blue Crayon",
      color: "#2980B9",
      ink: "#1B4F72",
      edge: "#2980B9",
      friend: "👗 Shelby the Fashion Doll",
      clue: "🕵️ Picture Detail: Stubby Blue Crayon sits on headless doll Shelby's neck wearing sunglasses and a sunhat while a photographer snaps pictures shouting: 'YES! That's IT!'",
      pictures: ["blue.jpg"],
      letter: "Duncan, Darling,\n\nSo, I used to be short, but THAT'S not a problem any more. I met a Doll in your sister's room who'd Lost a head, so we teamed up and now BOTH our problems are solved! I'm tall and Shelby has a HEAD Again! We cut quite a Figure.\nIt's MUCH Easier posing for PICTURES than colouring them. I'd love you to meet my other half sometime.\n\nYour FABULOUS Friend,\nBlue CRAYON, Fashion Model",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What glamorous greeting does Blue Crayon use for Duncan?", options: ["Duncan, Darling,", "Hey there, Duncan!", "Dearest Duncan,"], correct: 0, hint: "Check the first two words of Blue's letter." },
          { q: "What used to be Blue Crayon's big problem in the first book?", options: ["He used to be short and stubby", "He used to be invisible on the page", "He used to get eaten by the dog"], correct: 0, hint: "Read the first sentence: 'So, I used to be short...'" },
          { q: "Where did Blue Crayon meet the Doll?", options: ["In Duncan's sister's room", "In Duncan's school backpack", "Under Duncan's kitchen fridge"], correct: 0, hint: "Read: 'I met a Doll in your...'" },
          { q: "What problem did the Doll (Shelby) have before meeting Blue?", options: ["She had lost her head", "She lost her shoes", "She was painted green"], correct: 0, hint: "Read: 'who'd Lost a head, so we teamed up...'" },
          { q: "What is the name of the fashion doll Blue Crayon teamed up with?", options: ["Shelby", "Abby", "Leslie"], correct: 0, hint: "Read: 'I'm tall and ___ has a HEAD Again!'" },
          { q: "How did teaming up solve BOTH of their problems at the same time?", options: ["Blue is tall now, and Shelby has a head again!", "They can both drive Abby the fire engine now!", "They can both bake cupcakes in the toy oven!"], correct: 0, hint: "Look at the sentence with 'BOTH our problems are solved!'" },
          { q: "What does Blue Crayon say is MUCH easier than colouring pictures?", options: ["Posing for PICTURES", "Framing pictures", "Washing brushes"], correct: 0, hint: "Read: 'It's MUCH Easier ___ than colouring them.'" },
          { q: "How does Blue Crayon sign off at the end of his letter?", options: ["Your FABULOUS Friend, Blue CRAYON, Fashion Model", "Your very stubby friend, Blue CRAYON, Ocean Painter", "Your TALL Friend, Blue CRAYON, Photographer"], correct: 0, hint: "Look at the last two lines of the letter." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "In the first book, Blue couldn't even see over the crayon box railing. How does he see the world now?", options: ["From the top of a tall fashion doll's shoulders as her stylish head!", "From inside Duncan's school backpack on the way to school!", "By standing on a tall stack of books in Duncan's bedroom!"], correct: 0, hint: "Look where stubby Blue Crayon is perched in the picture!" },
          { q: "What does Blue Crayon mean when he calls Shelby 'my other half'?", options: ["He is the head and she is the body—together they make one complete fashion model!", "She is another blue crayon who looks exactly like him, like a twin!", "She lives in another house, so they only see each other at weekends!"], correct: 0, hint: "Think about how they teamed up physically!" },
          { q: "How did Blue Crayon style Shelby's outfit in the illustration?", options: ["With a drawn blue evening dress, blue high heels, sunglasses, and a big blue sunhat!", "With a red firefighter's helmet, a yellow coat, and big black boots!", "With a purple dressing gown, a monocle, and fluffy slippers!"], correct: 0, hint: "Check what Blue and Shelby are wearing under the spotlight." },
          { q: "Who is taking pictures of Blue and Shelby in the illustration?", options: ["A drawn girl photographer (likely Duncan's little sister!) shouting 'YES! That's IT!'", "Green Crayon, standing in the garden shouting 'Smile, babies!'", "A toy soldier from the army men shouting 'Ready, Mr... uh... TAN?'"], correct: 0, hint: "Look at the photographer on the bottom left of the picture." },
          { q: "What fashion compliment does Blue/Shelby give the Army Man at the Dinner Party finale?", options: ["'I just love your combat trousers.'", "'What a lovely shiny helmet you have.'", "'Where did you get that fabulous cape?'"], correct: 0, hint: "Even at dinner, Fashion Model Blue notices everyone's clothes!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what is the photographer shouting while snapping photos of Blue and Shelby?", options: ["'YES! That's IT!'", "'Say cheese!'", "'Stand still!'"], correct: 0, hint: "Read the words right above the camera flash!" },
          { q: "What accessories is Blue Crayon wearing on his face and head?", options: ["Cool sunglasses and a wide-brimmed blue sunhat with a flower", "A gold crown and a monocle on a long golden chain", "A yellow sun visor and a pair of big round glasses"], correct: 0, hint: "Look closely at Blue Crayon sitting on Shelby's neck." },
          { q: "How does Blue Crayon feel about his new career as a Fashion Model?", options: ["Fabulous, glamorous, and thrilled to be tall", "Exhausted, stubby, and wanting a break", "Shy, nervous, and scared of cameras"], correct: 0, hint: "He calls himself 'Your FABULOUS Friend'!" }
        ] }
      ]
    },
    {
      id: "teal",
      kind: "letter",
      name: "Teal Crayon",
      card: "Teal Crayon",
      color: "#008B8B",
      ink: "#006666",
      edge: "#008B8B",
      friend: "👯 Twin Teal Crayon & Desk Family",
      clue: "🕵️ Picture Detail: Teal Crayon hugs his Twin ('This ONE!') in front of a school desk and a 'TEAL FAMILY TREE' poster that includes Yellow, Blue, Green, Turquoise, and even a SOCK!",
      pictures: ["teal.jpg"],
      letter: "Hey,\n\nWhen I got a lift to school in your backpack I met all the CRAYONS in your desk. Guess what? I HAVE A TWIN!\nHow come you never told me? Not only that, but I have LOADS of relatives I never knew ABOUT. Would you like to come to our FAMILY REUNION?\n\nYour Relatable Friend,\nTeal CRAYON",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How did Teal Crayon get to Duncan's school?", options: ["He got a lift in Duncan's backpack", "He rode on Abby the Fire Engine", "He walked with the dog biscuits"], correct: 0, hint: "Read the very first line: 'When I got a lift to school in your...'" },
          { q: "Who did Teal Crayon meet at school?", options: ["All the CRAYONS in Duncan's desk", "The school principal and the teachers", "The chess club in the school hall"], correct: 0, hint: "Check the end of the first sentence." },
          { q: "What big surprise did Teal Crayon discover in the school desk?", options: ["I HAVE A TWIN!", "The desk was empty", "He is actually Purple"], correct: 0, hint: "Look for the words in ALL CAPS!" },
          { q: "What question does Teal Crayon ask Duncan about his twin?", options: ["'How come you never told me?'", "'Which one of us is taller?'", "'Can we go home?'"], correct: 0, hint: "Read the sentence right after 'I HAVE A TWIN!'." },
          { q: "Besides a twin, who else did Teal Crayon discover he has?", options: ["LOADS of relatives he never knew about", "A pet hamster that lives in the classroom", "A toy car he can drive to school"], correct: 0, hint: "Read: 'Not only that, but I have LOADS of...'" },
          { q: "What event does Teal Crayon invite Duncan to attend?", options: ["Their FAMILY REUNION", "A chess tournament", "A bake sale"], correct: 0, hint: "Read: 'Would you like to come to our...'" },
          { q: "What clever pun does Teal Crayon use in his sign-off ('Your ___ Friend')?", options: ["Your Relatable Friend (because he found his relatives!)", "Your Twin Friend (because he found his twin!)", "Your School Friend (because he went to school!)"], correct: 0, hint: "Look at the word right before 'Friend, Teal CRAYON'." },
          { q: "What is the title of the poster hanging on the wall behind the two Teal Crayons?", options: ["TEAL FAMILY TREE", "SCHOOL RULES", "COLOUR WHEEL"], correct: 0, hint: "Look at the top of the white chart in the illustration." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "Why are there so many Blue-Green and Aqua relatives on the 'TEAL FAMILY TREE'?", options: ["Because Teal is a mix of blue and green, so shades like Turquoise, Viridian Blue, and Aqua Blue are his 'family'!", "Because they all live in the same desk at school, so they decided to call themselves a family", "Because they are all felt-tip markers, and markers always come in blue and green families"], correct: 0, hint: "Look at how Yellow + Blue makes Green on the family tree chart!" },
          { q: "Look closely at the 'TEAL FAMILY TREE' poster: what hilarious non-crayon object is married to 'TURQUOISE'?", options: ["A SOCK!", "A Spatula", "A Ping-Pong Ball"], correct: 0, hint: "Click Zoom Picture to inspect the middle row of the Teal Family Tree chart!" },
          { q: "According to the Family Tree chart, which two colors are at the top left as grandparents of Green?", options: ["YELLOW and BLUE", "RED and WHITE", "BLACK and PEACH"], correct: 0, hint: "Yellow + Blue mixes together to make Green!" },
          { q: "According to the Family Tree chart, who are Teal Crayon's two parents right above him?", options: ["VIRIDIAN BLUE and AQUA BLUE", "TURQUOISE and NAVY BLUE", "SKY BLUE and PEA GREEN"], correct: 0, hint: "Look at the two crayons right above 'TEAL' at the bottom of the poster." },
          { q: "Where is Teal Crayon sitting during the Dinner Party finale at the end of the book?", options: ["Inside a yellow rubber ducky right by the table (while his Twin stands by the Crayon box)!", "On top of the chandelier (while his Twin sits on Esteban's teddy bear)!", "Inside the Breezy Bake Oven (while his Twin helps Pink with the cupcakes)!"], correct: 0, hint: "Check the front of the cardboard table in the Dinner Party picture!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what is Teal Crayon saying while pointing to his twin brother?", options: ["'This ONE!'", "'Look at my desk!'", "'Time for class!'"], correct: 0, hint: "Read the two words on the bottom left next to Teal Crayon's arm." },
          { q: "What school furniture is drawn on the far left next to the Teal Crayons?", options: ["An open wooden school desk and chair (plus a wall clock above)", "A long cafeteria table (plus a lunch tray on top)", "A gymnasium basketball hoop (plus a ball on the floor)"], correct: 0, hint: "Look to the left of the Teal Family Tree poster." },
          { q: "How does Teal Crayon feel about finding his twin and extended family?", options: ["Overjoyed, connected, and eager to celebrate with a family reunion", "Jealous that there is another Teal crayon who looks just like him", "Lonely, and wishing he had never gone to school in the backpack"], correct: 0, hint: "Look at the two Teal crayons hugging with big smiles!" }
        ] }
      ]
    },
    {
      id: "messy",
      kind: "letter",
      name: "Messy the Crayon",
      card: "Messy the Crayon",
      color: "#A06A3B",
      ink: "#6E4720",
      edge: "#8B5A2B",
      friend: "🪖 Green Plastic Army Men",
      clue: "🕵️ Picture Detail: Chewed up by the dog, Messy waves happily at 4 green plastic army men! One soldier asks: 'Ready, Mr... uh... TAN?' and another says: 'We call him Messy now!'",
      pictures: ["messy.jpg"],
      letter: "Duncan!\n\nI was feeling sad after your DOG ATE me and COUGHED ME UP! But then I met your army men. And guess what?\nThey needed a MONSTER to BATTLE! So NOW I ATTACK things and they SWOOP IN to SAVE the WORLD. It's great being the bad guy. I'm ATTACKING a secret Mountain Fortress TODAY. Wish me LUCK!\n\nYour super-gross monster pal,\nMESSY the CRAYON\n(Formerly known as possibly TAN or Burnt Sienna CRAYON, I still DON'T KNOW.)",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "Why was Messy the Crayon feeling sad at the start of his letter?", options: ["Because Duncan's DOG ATE him and COUGHED HIM UP!", "Because he fell in the TOILET and got FLUSHED AWAY!", "Because he lost his TWIN in the SCHOOL backpack!"], correct: 0, hint: "Read the very first sentence of his letter." },
          { q: "Who did Messy meet after the dog coughed him up?", options: ["Duncan's army men", "The firefighters", "The chess pieces"], correct: 0, hint: "Read: 'But then I met your...'" },
          { q: "Why were the army men so happy to meet Messy?", options: ["They needed a MONSTER to BATTLE!", "They needed someone to drive their tank", "They needed a green crayon"], correct: 0, hint: "Check the sentence right after 'And guess what?'" },
          { q: "What happens when Messy 'ATTACKS' things in their game?", options: ["The army men SWOOP IN to SAVE the WORLD", "Everyone runs away and hides under the bed", "Duncan puts them all away in a drawer"], correct: 0, hint: "Read: 'So NOW I ATTACK things and they...'" },
          { q: "How does Messy feel about playing the 'bad guy' monster?", options: ["He says 'It's great being the bad guy.'", "He says 'I hate being the bad guy.'", "He says 'Being the monster makes me cry.'"], correct: 0, hint: "Look for the sentence starting with 'It's great...'." },
          { q: "What is Messy attacking TODAY?", options: ["A secret Mountain Fortress", "Monkey Island at the zoo", "The Play Kitchen and its oven"], correct: 0, hint: "Read: 'I'm ATTACKING a...'" },
          { q: "How does Messy describe himself in his sign-off?", options: ["Your super-gross monster pal, MESSY the CRAYON", "Your neatest friend, TAN the CRAYON", "Your quiet little pal, SIENNA the CRAYON"], correct: 0, hint: "Look right above 'MESSY the CRAYON'." },
          { q: "What two colors does Messy say he was formerly known as (though he still doesn't know which)?", options: ["Possibly TAN or Burnt Sienna CRAYON", "Possibly RED or Burnt Orange CRAYON", "Possibly BLUE or Teal Green CRAYON"], correct: 0, hint: "Read the parentheses at the very bottom of the letter!" }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "In the previous book (*The Day the Crayons Came Home*), Tan/Burnt Sienna was eaten by the dog and puked up on the rug. How did the Army Men turn his gross look into a superpower?", options: ["Because he's chewed up and covered in dog hair, he looks just like a giant movie monster for them to battle!", "They washed him in the sink and gave him a shiny new wrapper, so nobody would ever know he was eaten", "They put a shiny new paper wrapper on him so nobody knows he was eaten"], correct: 0, hint: "Look at how fuzzy and scribbled Messy looks next to the tiny plastic soldiers!" },
          { q: "Are Messy and the Army Men actually enemies, or are they best friends playing pretend?", options: ["Best friends playing pretend—he loves being their battle monster and brings them to the Dinner Party!", "Real enemies who really dislike each other and never want to share a toy box again", "They never talk to each other, because the army men are too scared of him"], correct: 0, hint: "Look at Messy smiling and waving at the soldiers!" },
          { q: "Where is the 'secret Mountain Fortress' in the illustration?", options: ["Drawn at the top left on a purple mountain peak!", "Hidden inside the crayon box, under the lid!", "Under Duncan's bed, next to the teddy bear!"], correct: 0, hint: "Look above the four green army men in the picture." },
          { q: "Why doesn't Messy know whether he was originally Tan or Burnt Sienna?", options: ["Because his paper label was destroyed when the dog ate and coughed him up!", "Because he can't read the tiny writing on his own wrapper!", "Because Duncan never told him what colour he was when he first opened the box!"], correct: 0, hint: "Without a wrapper and after being chewed up, both shades look alike!" },
          { q: "What does Messy shout with his arms raised at the Dinner Party finale?", options: ["'All behold Messy the Battle Monster!!'", "'Wish me luck at the Mountain Fortress!'", "'Where is that dog that ate me?'"], correct: 0, hint: "Check Messy's speech bubble on the left side of the Dinner Party!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what do the two army men say to each other in their speech bubbles?", options: ["'Ready, Mr... uh... TAN?' and 'We call him Messy now!'", "'Run away!' and 'Hide behind the mountain!'", "'Fire the hose!' and 'Save the fire engine!'"], correct: 0, hint: "Click Zoom Picture to read the words right above the green plastic soldiers!" },
          { q: "How many green plastic army men are aiming toward Messy in the illustration?", options: ["4 army men", "1 army man", "10 army men"], correct: 0, hint: "Count the green plastic figures in the illustration." },
          { q: "How did Messy's feelings change from the beginning of the letter to the end?", options: ["From feeling sad about being chewed up to feeling proud, included, and excited ('Wish me LUCK!')", "From feeling happy about being a monster to feeling sad and left out of the game", "From feeling angry at the dog to feeling sleepy and wanting to go back in the box"], correct: 0, hint: "Compare 'I was feeling sad' at the start with 'It's great being the bad guy'!" }
        ] }
      ]
    },
    {
      id: "green",
      kind: "letter",
      name: "Green Crayon",
      card: "Green Crayon",
      color: "#27AE60",
      ink: "#1E8449",
      edge: "#27AE60",
      friend: "🌱 Sprouted Green Bean Babies",
      clue: "🕵️ Picture Detail: Green Crayon wears a yellow sun visor and waters 3 real green bean pods in the soil! An arrow points to his hand labeled: 'Green Fingers'.",
      pictures: ["green.jpg"],
      letter: "My Boy,\n\nGreen Crayon here. And by \"here\" I mean the vegetable patch in the garden. I wanted to see if I had GREEN FINGERS... Turns out I DO! All these cuties sprouted, and, well, they've really grown on ME. I LOVE my Babies. And I think you will really love them too.\nCome and say Hi.\n\nLove,\nGreen Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How does Green Crayon greet Duncan at the top of his letter?", options: ["My Boy,", "Dear Duncan,", "Hi Duncan!"], correct: 0, hint: "Look at the first two words of Green's letter." },
          { q: "Where is Green Crayon writing from ('And by \"here\" I mean...')?", options: ["The vegetable patch in the garden", "The play kitchen next to the oven", "Under the fridge with the dog biscuits"], correct: 0, hint: "Read the second sentence of Green's letter." },
          { q: "What gardening skill did Green Crayon want to see if he had?", options: ["GREEN FINGERS", "Green boots", "A green tractor"], correct: 0, hint: "Read: 'I wanted to see if I had...'" },
          { q: "Did it turn out that Green Crayon has green fingers?", options: ["Yes! 'Turns out I DO!'", "No, nothing grew", "Only for plastic plants"], correct: 0, hint: "Check the sentence right after 'GREEN FINGERS...'." },
          { q: "What pun does Green Crayon make after saying 'All these cuties sprouted'?", options: ["'well, they've really grown on ME.'", "'well, they are very tall and green.'", "'they are green just like me!'"], correct: 0, hint: "Read the second half of the sentence about the sprouted cuties!" },
          { q: "What affectionate name does Green Crayon call his sprouted green beans?", options: ["My Babies", "My Soldiers", "My Pups"], correct: 0, hint: "Read: 'I LOVE my...'" },
          { q: "Does Green Crayon think Duncan will love the green bean babies too?", options: ["Yes, 'And I think you will really love them too.'", "No, 'because kids never like their vegetables.'", "He isn't sure, so he asks Duncan to tell him"], correct: 0, hint: "Check the sentence after 'I LOVE my Babies.'" },
          { q: "What does Green Crayon invite Duncan to do at the end?", options: ["Come and say Hi.", "Bring a lawnmower", "Send more seeds"], correct: 0, hint: "Look at the line right before 'Love, Green Crayon'." }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "What are the two meanings of the joke 'I wanted to see if I had GREEN FINGERS... Turns out I DO!'?", options: ["Being good at gardening is called having 'green fingers' (or green thumb)—and since he's Green Crayon, his fingers are literally green!", "He painted his hands with green paint, and gardeners always wear gloves to keep them clean", "He wore green gardening gloves, so his fingers look green when he plants the seeds"], correct: 0, hint: "Look at the arrow pointing to Green Crayon's hand in the picture!" },
          { q: "Why is 'they've really grown on ME' a double-meaning pun?", options: ["Plants literally grow in the garden, AND when you start to love something, you say it 'grows on you'!", "The beans really grew on top of his head, AND they made him look much taller!", "He grew taller in the sunshine, AND beans are his favourite thing to eat!"], correct: 0, hint: "Think about both plant growth and loving something more and more!" },
          { q: "In the first book, Green was the happiest crayon in the box. How does his personality stay consistent here?", options: ["He is still warm, positive, and loving—now caring for his sprouted garden babies!", "He became grumpy and mean because the garden is too hot and sunny", "He started an argument with the beans about who is the greenest"], correct: 0, hint: "Notice how warm and gentle his letter is ('My Boy', 'Love, Green Crayon')." },
          { q: "What are the three 'cuties' that sprouted in the picture?", options: ["Three real green beans (runner/string beans) standing upright in the drawn soil!", "Three orange carrots poking their leafy tops out of the soil!", "Three red apples hanging from a little drawn tree!"], correct: 0, hint: "Look at the three real vegetables Green is watering." },
          { q: "What does Green Crayon say to his bean babies at the Dinner Party finale?", options: ["'Drink up, babies.' (as they sit by glasses of water at the table!)", "'Eat your soup!' (as they sit by bowls of soup at the table!)", "'Go to sleep!' (as they lie down in the vegetable patch!)"], correct: 0, hint: "Plants drink water even at a dinner party!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what is Green Crayon wearing on his head while gardening in the sun?", options: ["A yellow sun visor", "A tall white chef's hat", "A small gold crown"], correct: 0, hint: "Look at the yellow brimmed cap on Green Crayon's head." },
          { q: "What do the small words with an arrow pointing to Green Crayon's hand say?", options: ["'Green Fingers'", "'Watering Can'", "'Bean Sprout'"], correct: 0, hint: "Look right above the handle of the green watering can!" },
          { q: "How does Green Crayon feel about his sprouted bean plants?", options: ["Like a proud, loving parent ('I LOVE my Babies')", "Tired of watering them ('I need a rest')", "Afraid of the bugs in the soil ('HELP ME!')"], correct: 0, hint: "Look at his gentle smile as he waters them!" }
        ] }
      ]
    },
    {
      id: "yellow",
      kind: "letter",
      name: "Yellow Crayon",
      card: "Yellow Crayon",
      color: "#F1C40F",
      ink: "#9A7D0A",
      edge: "#D4AC0D",
      friend: "🏓 Ping-Pong Net & Ping-Pong Ball",
      clue: "🕵️ Picture Detail: Yellow Crayon is tangled right inside the ping-pong net asking: 'What's goin' on, Ping-Pong?' while the orange Ping-Pong Ball bounces past saying: 'hiiiiii'!",
      pictures: ["yellow.jpg"],
      letter: "Dear Duncan,\n\nSorry I haven't been around much lately. I've been caught up in Ping-Pong! Well... the Ping-Pong net actually. Ping-Pong Ball and I love catching up when he passes by (which is A LOT!).\nAlso, Ping-Pong is such a funny word, Don't you think? Ping-Pong, Ping-pong, PING-PONG!\nCome and play sometime.\n\nAt your service,\nYellow Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What does Yellow Crayon apologize for at the start of his letter?", options: ["Not being around much lately", "Arguing with Orange Crayon", "Losing his wrapper"], correct: 0, hint: "Read the very first sentence of Yellow's letter." },
          { q: "What does Yellow Crayon say he has been 'caught up in'?", options: ["Ping-Pong! Well... the Ping-Pong net actually.", "A spiderweb! Well... a big sticky one actually.", "Football! Well... the goal net actually."], correct: 0, hint: "Read the second and third sentences!" },
          { q: "Who is Yellow Crayon's bouncy new friend?", options: ["Ping-Pong Ball", "A tennis racket", "A beach ball"], correct: 0, hint: "Read: '___ and I love catching up when he passes by'." },
          { q: "When do Yellow Crayon and Ping-Pong Ball love 'catching up'?", options: ["Whenever Ping-Pong Ball passes by the net (which is A LOT!)", "Only at midnight, when everyone else is fast asleep", "Once a year, on Ping-Pong Ball's birthday party"], correct: 0, hint: "Think about how often a ping-pong ball flies over the net!" },
          { q: "What word does Yellow Crayon think is such a funny word?", options: ["Ping-Pong ('Ping-Pong, Ping-pong, PING-PONG!')", "Bounce ('Bounce, bounce, BOUNCE, BOUNCE!')", "Paddle ('Paddle, paddle, PADDLE!')"], correct: 0, hint: "Look at the word he repeats three times in a row!" },
          { q: "What does Yellow Crayon invite Duncan to do?", options: ["Come and play sometime.", "Cut the net with scissors", "Buy a new ball"], correct: 0, hint: "Check the line right before 'At your service'." },
          { q: "How does Yellow Crayon sign off his letter?", options: ["At your service, Yellow Crayon", "The true colour of the sun, Yellow", "Your stuck friend, Yellow"], correct: 0, hint: "Look at the last two lines of the letter." },
          { q: "Why is 'At your service' a clever pun for a Ping-Pong game?", options: ["Because in Ping-Pong (table tennis), you start every point with a 'serve' (service)!", "Because Yellow is now a waiter who serves the food at the dinner party!", "Because he fixes cars at the garage, and that's called a car service!"], correct: 0, hint: "Think about what players do with the ball to start a point in Ping-Pong!" }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "What is the double meaning of 'I've been caught up in Ping-Pong! Well... the Ping-Pong net actually'?", options: ["'Caught up in' means busy with a hobby, AND he is literally tangled up inside the net!", "He won a big trophy at Ping-Pong, AND he is hiding it under the table!", "He is hiding under the table, AND he wants nobody to find him there!"], correct: 0, hint: "Look at Yellow Crayon's body woven into the net squares!" },
          { q: "Wait—what color is the real Ping-Pong Ball that Yellow Crayon became best friends with?", options: ["Bright ORANGE (just like his old rival Orange Crayon from the first book)!", "Dark PURPLE (just like his friend Professor Aubergine in the game)!", "Jet BLACK (just like the outline Black Crayon draws)!"], correct: 0, hint: "Look at the round ball bouncing on the left of the illustration!" },
          { q: "Why can Yellow and Ping-Pong Ball only chat briefly ('when he passes by')?", options: ["Because the ball is being hit back and forth over the net by the red paddles!", "Because the ball can't talk, so it only waves when it rolls past!", "Because Yellow falls asleep in the net and keeps missing him!"], correct: 0, hint: "Look at the motion lines showing the ball bouncing across the table!" },
          { q: "Even though Yellow Crayon is stuck in a net, is he upset about it?", options: ["No! He is cheerful, making puns, and having a blast with Ping-Pong Ball", "Yes, he is crying for help because he can't get out of the net", "Yes, he is furious with Duncan for leaving him stuck there"], correct: 0, hint: "Notice how upbeat and playful his letter is!" },
          { q: "Look at the Dinner Party finale: did Yellow Crayon ever get untangled from the net?", options: ["Not completely—he walked to the party with the net still wrapped around him saying 'Glad I could get freed up for this.'!", "Yes, he left the net behind and came to the party on Ping-Pong Ball's back saying 'Anyone for WATER?'", "No, he didn't come to the party at all, because he was still busy playing Ping-Pong all evening"], correct: 0, hint: "Check the bottom left of the Dinner Party illustration!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what do Yellow Crayon and Ping-Pong Ball say to each other as the ball flies over?", options: ["Yellow says 'What's goin' on, Ping-Pong?' and the ball says 'hiiiiii'", "Yellow says 'Goodbye!' and the ball says 'See you next week!'", "They argue about who is the true colour of the sun"], correct: 0, hint: "Click Zoom Picture to read the speech bubbles above the net and the orange ball!" },
          { q: "How many red ping-pong paddles are drawn in the illustration?", options: ["2 red paddles (one on each end of the table)", "10 red paddles (all lined up along the table)", "No paddles (the players are using their hands)"], correct: 0, hint: "Look at the bottom-left and top-right corners of the picture." },
          { q: "What is Yellow Crayon's mood in this letter?", options: ["Easygoing, giggly, and friendly", "Stubborn, angry, and grumpy", "Scared, worried, and stuck"], correct: 0, hint: "He's laughing at how funny the word 'Ping-Pong' sounds!" }
        ] }
      ]
    },
    {
      id: "esteban",
      kind: "letter",
      name: "Esteban",
      card: "Esteban",
      color: "#7CB342",
      ink: "#33691E",
      edge: "#558B2F",
      friend: "🧸 Teddy the Mighty Abomination",
      clue: "🕵️ Picture Detail: Esteban the Magnificent (Pea Green Crayon) wears a yellow cape and holds a tiny drawn chair like a lion-tamer shouting 'GET BACK, I SAY!' at a giant, cuddly blue teddy bear!",
      pictures: ["esteban.jpg"],
      letter: "Dearest Duncan,\n\nI was wandering the exotic wilderness of \"UNDER YOUR BED\" when I found a GREAT and TERRIFYING BEAST! I knew I had to act quickly, so I took charge and TAMED the MIGHTY ABOMINATION! So don't worry, ALL is SAFE NOW. You can visit us in the Wild.\n\nWarm wishes,\nESTEBAN The MAGNIFICENT\nTamer of MYSTERIOUS BEASTS",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "Where was Esteban wandering when he found the beast?", options: ["The exotic wilderness of 'UNDER YOUR BED'", "The exotic jungle of 'THE VEGETABLE PATCH'", "The dark caves of 'UNDER THE FRIDGE'"], correct: 0, hint: "Check the first sentence for the words in quotation marks!" },
          { q: "What did Esteban find under Duncan's bed?", options: ["A GREAT and TERRIFYING BEAST! (which is actually a stuffed Teddy Bear)", "A flock of LOST dog biscuits! (which were hiding from the dog)", "A shiny TOY fire engine! (which is actually called Abby)"], correct: 0, hint: "Read the end of the first sentence and look at the picture!" },
          { q: "What did Esteban do when he saw the 'terrifying beast'?", options: ["He took charge and TAMED the MIGHTY ABOMINATION!", "He ran back into the crayon box and hid under the lid!", "He called the firefighters to come and help him!"], correct: 0, hint: "Read the second sentence of Esteban's letter." },
          { q: "Why does Esteban tell Duncan 'don't worry'?", options: ["Because 'ALL is SAFE NOW.'", "Because the bear went to sleep", "Because the bed is clean"], correct: 0, hint: "Read: 'So don't worry, ...'" },
          { q: "Where does Esteban invite Duncan to visit them?", options: ["In the Wild (under the bed!)", "At the school desk (in class!)", "In the play kitchen (by the oven!)"], correct: 0, hint: "Read: 'You can visit us in...'" },
          { q: "What dramatic title does Esteban sign his letter with?", options: ["ESTEBAN The MAGNIFICENT, Tamer of MYSTERIOUS BEASTS", "PEA GREEN The QUIET, Keeper of the CRAYON BOX", "SIR ESTEBAN of the BOX, Finder of LOST BISCUITS"], correct: 0, hint: "Read the last three lines of Esteban's letter." },
          { q: "What word does Esteban use to describe the giant teddy bear that means 'monster'?", options: ["MIGHTY ABOMINATION", "CUDDLY CREATURE", "GENTLE GIANT BEAR"], correct: 0, hint: "Look at the words in ALL CAPS after 'TAMED the...'." },
          { q: "What is Esteban's real crayon color written on his wrapper?", options: ["Pea Green (he renamed himself Esteban the Magnificent in the previous book!)", "Bright Red (he renamed himself Esteban when he became a firefighter!)", "Sky Blue (he renamed himself Esteban after he met the teddy bear!)"], correct: 0, hint: "Look closely at his green body and yellow cape!" }
        ] },
        { key: "friendFix", title: "🤝 New Friend & Fix", skill: "Problems and fixes", questions: [
          { q: "Why is Esteban's description of a 'GREAT and TERRIFYING BEAST / MIGHTY ABOMINATION' so funny?", options: ["Because in the picture, it's just a soft, cuddly, harmless blue stuffed teddy bear sitting quietly!", "Because in the picture, it is a real fire-breathing dragon that roars at everyone!", "Because in the picture, it is a tiny ant that is far too small to see!"], correct: 0, hint: "Compare Esteban's dramatic words to the cute blue teddy bear in the photo!" },
          { q: "What is Esteban holding in his hand to 'tame' the teddy bear?", options: ["A tiny drawn wooden chair (just like an old-fashioned circus lion tamer)!", "A shiny silver sword (just like a knight fighting a dragon)!", "A long garden hose (just like a firefighter spraying water)!"], correct: 0, hint: "Look at what Esteban is holding out toward the bear." },
          { q: "What is Esteban wearing around his shoulders for his adventure?", options: ["A flowing yellow cape", "A purple bathrobe", "A chef's hat"], correct: 0, hint: "Look at Esteban's superhero/performer outfit in the picture." },
          { q: "What does Esteban name the Teddy Bear when he brings him to the Dinner Party finale?", options: ["'Teddy, the Eighth Wonder of the World'", "'Mr. Fluffy, the Beast Under the Bed'", "'King Bear, the Mightiest of Them All'"], correct: 0, hint: "Check Esteban's speech bubble next to the giant bear at the dinner table!" },
          { q: "How does Esteban's big imagination make life around Duncan's bedroom more exciting?", options: ["He turns ordinary dusty spots like 'Under Your Bed' into an exotic wilderness full of grand adventures!", "He makes everyone in the bedroom clean up the dust and tidy their toys away every day!", "He hides all of the toys under the bed so nobody else can play with them!"], correct: 0, hint: "He sees the whole bedroom as a theatrical stage!" }
        ] },
        { key: "pictureFeelings", title: "🎨 Picture & Feelings", skill: "Pictures and feelings", questions: [
          { q: "Look at the picture: what is Esteban shouting at the teddy bear?", options: ["'GET BACK, I SAY!'", "'Sit, boy!'", "'Would you like a cupcake?'"], correct: 0, hint: "Click Zoom Picture to read the words right above Esteban's head on the left!" },
          { q: "How big is the blue Teddy Bear compared to Esteban the Magnificent?", options: ["Enormous—about 5 times taller than Esteban!", "Tiny—about half the size of Esteban!", "The same size—exactly as tall as Esteban!"], correct: 0, hint: "Compare tiny Esteban on the left with the giant plush bear in the center." },
          { q: "What kind of personality does Esteban the Magnificent show?", options: ["Theatrical, dramatic, adventurous, and proud", "Timid, quiet, nervous, and very shy", "Lazy, bored, sleepy, and rather grumpy"], correct: 0, hint: "Everything he says sounds like a grand adventure movie!" }
        ] }
      ]
    },
    {
      id: "finale",
      kind: "finale",
      name: "Dinner Party Finale",
      card: "Dinner party",
      heading: "Duncan's Dinner Party Finale",
      doneName: "the dinner party",
      emoji: "🍽️",
      color: "#805AD5",
      ink: "#6B46C1",
      edge: "#805AD5",
      friend: "All 11 Crayons & Their New 3D Friends",
      clue: "🕵️ Picture Detail: Click '🔍 Zoom Picture' to see all 11 crayons and their new 3D friends gathered around Duncan's cardboard dinner table!",
      pictures: ["dinner.jpg"],
      letter: "Well, of course Duncan wanted to see his crayons and meet their new friends . . . so there was only one thing to do!\n\nHave a dinner party!\n\nAround the dinner table:\n• Yellow Crayon (in the net): \"Glad I could get freed up for this.\"\n• Messy the Crayon: \"All behold Messy the Battle Monster!!\"\n• Blue Crayon & Shelby: \"I just love your combat trousers.\"\n• Le Pink Crayon & Spatula: \"Breezy Bake muffin, anyone?\"\n• Green Crayon: \"Drink up, babies.\"\n• White Crayon: \"Bow before your queen! All shall love me and despair!\"\n• Esteban: \"Ladies and gentlemen, meet Teddy, the Eighth Wonder of the World.\"\n• Red Crayon: \"Anyone for WATER?\"\n• Peach Crayon: \"This soup, like the plot, thickens!\"",
      parts: [
        { key: "friendMatch", title: "🤝 Match Crayon & Friend", skill: "Putting it together", questions: [
          { q: "Which crayon drives 'Abby' the Fire Engine and helps put out pretend fires?", options: ["Red Crayon", "Blue Crayon", "Green Crayon"], correct: 0, hint: "Remember who wears the yellow firefighter helmet numbered '07'!" },
          { q: "Which crayon teamed up with Shelby the headless doll to become a tall Fashion Model?", options: ["Blue Crayon", "Peach Crayon", "Yellow Crayon"], correct: 0, hint: "He used to be short and stubby, and now sits atop Shelby's neck!" },
          { q: "Which crayon bakes cupcakes in the play kitchen with Spatula and Breezy Bake Oven?", options: ["Le Pink Crayon", "Messy the Crayon", "White Crayon"], correct: 0, hint: "He wears a chef's hat and calls his kitchen 'La Maison De Duncan'!" },
          { q: "Which crayon tends a flock of lost Dog Biscuits (including expecting mother Leslie) under the fridge?", options: ["Beige Crayon", "Teal Crayon", "Esteban the Magnificent"], correct: 0, hint: "He carries a red shepherd's crook and chews a stalk of wheat!" },
          { q: "Which crayon investigates Mr Carcass's mystery in the Mansion with Professor Aubergine?", options: ["Peach Crayon (Baron Naked Von Nuddington)", "Yellow Crayon (stuck in the Ping-Pong net)", "Green Crayon (from the vegetable patch)"], correct: 0, hint: "He wears a purple detective robe and monocle while blowing bubbles from a pipe!" },
          { q: "Which crayon tamed the giant blue stuffed Teddy Bear in the wilderness of 'Under Your Bed'?", options: ["Esteban the Magnificent", "Messy the Battle Monster", "Red Crayon the Driver"], correct: 0, hint: "He wears a yellow cape and holds up a tiny drawn chair!" }
        ] },
        { key: "dinnerQuotes", title: "💬 Who Said It at Dinner?", skill: "Who said it", questions: [
          { q: "Who says: 'This soup, like the plot, thickens!' at the Dinner Party?", options: ["Peach Crayon (Baron Naked Von Nuddington)", "Le Pink Crayon (the Pastry Chef with Spatula)", "Green Crayon (with his bean babies)"], correct: 0, hint: "Check the detective crayon in the purple robe at the front right of the dinner table!" },
          { q: "Who shouts: 'All behold Messy the Battle Monster!!' at the Dinner Party?", options: ["Messy the Crayon", "Esteban the Magnificent", "Red Crayon"], correct: 0, hint: "Look at the chewed-up crayon raising both arms on the left side of the table!" },
          { q: "Who compliments the toy Army Man by saying: 'I just love your combat trousers.'?", options: ["Blue Crayon & Shelby the Fashion Doll", "White Crayon, the Terrifying Queen", "Beige Crayon & Leslie the Dog Biscuit"], correct: 0, hint: "Which crayon is a glamorous Fashion Model who notices everyone's outfits?" },
          { q: "Who says: 'Drink up, babies.' to the three tall green beans at the table?", options: ["Green Crayon", "Yellow Crayon", "Teal Crayon"], correct: 0, hint: "Remember who sprouted those three green bean 'babies' in the vegetable patch!" },
          { q: "Who stands on a chair wearing a crown and declares: 'Bow before your queen! All shall love me and despair!'?", options: ["White Crayon", "Blue Crayon", "Pink Crayon"], correct: 0, hint: "She became the 'TERRIFYING Queen' of Duncan's chess set!" },
          { q: "Who arrives still wrapped in the ping-pong net and jokes: 'Glad I could get freed up for this.'?", options: ["Yellow Crayon", "Beige Crayon", "Teal Crayon"], correct: 0, hint: "Check the bottom left of the Dinner Party illustration next to the orange Ping-Pong Ball!" }
        ] },
        { key: "bigPicture", title: "🎉 Finale & Picture Clues", skill: "Putting it together", questions: [
          { q: "Why did Duncan decide to host a big Dinner Party at the end of the book?", options: ["Because he wanted to see all of his crayons AND meet all of their new 3D friends together!", "Because he wanted to lock all the crayons back in the box so they couldn't leave again!", "Because the play kitchen caught fire and Red Crayon needed everyone's help!"], correct: 0, hint: "Read the opening sentence on the left: 'Well, of course Duncan wanted to see his crayons and meet their new friends...'" },
          { q: "Look closely at the front of the cardboard dinner table in the picture: what is Teal Crayon sitting inside?", options: ["A yellow rubber ducky!", "A red toy fire truck!", "A little china teacup!"], correct: 0, hint: "Click Zoom Picture and look right in front of the table next to Peach Crayon!" },
          { q: "What is the main message of 'The Day the Crayons Made Friends'?", options: ["Stepping outside your box to try new roles and make unexpected friends brings everyone joy!", "Crayons should never leave their box, because the world outside is too dangerous!", "Toys and crayons don't get along, so they should always be kept in different rooms!"], correct: 0, hint: "Think about how every crayon found a friend who appreciated them just as they are!" }
        ] }
      ]
    }
  ]
};
