/* The Day the Crayons Quit – letters and questions for the School Work section.
   Made by another AI for Kas (Nov 2026) and copied here word for word (one typing slip fixed in
   Grey's letter: "hut" -> "but"). The right answer is options[correct]; answers are shuffled on screen.
   28 Nov 2026 (Kas agreed): only the WRONG answers were rewritten where the right one gave itself away by
   being much longer; every question and right answer is still word for word.
   Each question's star id is <section id>.<part key>.<number>, so keep the order when adding questions. */
window.CRAYON_BOOK = {
  id: "crayons-quit",
  title: "The Day the Crayons Quit",
  boxName: "Crayon box",
  say: {"lead": "Read each crayon's letter to Duncan, then answer the questions.", "right": "✨ Correct! Fantastic reading!", "wrong": "Nice try! Look back at the letter.", "second": "👍 Well done – you found it!", "shown": "📚 Good effort! The answer is: \"{answer}\"."},
  sections: [
    {
      id: "red",
      kind: "letter",
      name: "Red Crayon",
      card: "Red Crayon",
      color: "#E74C3C",
      ink: "#C0392B",
      edge: "#E74C3C",
      letter: "Hey Duncan,\n\nWE NEED to talk.\n\nIt's me, RED Crayon. You make me work harder than any of your other crayons!\nColouring FIRE ENGINES, Apples, strawberries and EVERYTHING ELSE that's RED.\nI even work on Holidays!\nI have to colour all the SANTAS at Christmas and ALL the Hearts on Valentine's Day!\n\nI NEED A REST!\n\nYour overworked friend,\nRED Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "Who wrote this letter to Duncan?", options: ["RED Crayon", "BLUE Crayon", "GREEN Crayon"], correct: 0 },
          { q: "Which red vehicle does Red Crayon have to colour?", options: ["FIRE ENGINES", "Garbage trucks", "Cement mixers"], correct: 0 },
          { q: "Which two fruits does Red Crayon mention colouring?", options: ["Apples and strawberries", "Bananas and blueberries", "Grapes and oranges"], correct: 0 },
          { q: "What holiday character does Red Crayon colour at Christmas?", options: ["SANTAS", "Elves", "Reindeer"], correct: 0 },
          { q: "What shape does Red Crayon colour on Valentine's Day?", options: ["Hearts", "Squares", "Triangles"], correct: 0 },
          { q: "Does Red Crayon have to work on holidays?", options: ["Yes, he works on holidays too", "No, he takes holidays off", "Only on summer days"], correct: 0 },
          { q: "Which list contains ONLY things Red Crayon colours in the letter?", options: ["Fire engines, apples, strawberries, Santas, and hearts", "Fire engines, grapes, Santas, hearts, and pumpkins", "Apples, strawberries, cherries, Santas, and red roses"], correct: 0 },
          { q: "Why does Red Crayon say he works harder than ANY other crayon?", options: ["Because he colours everyday items AND works on holidays", "Because he is the smallest crayon in the whole box", "Because he lives at the very bottom of the crayon box"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "What does Red Crayon say he needs from Duncan?", options: ["A rest from working so hard", "A brand new crayon box to live in", "A sharpener for his blunt tip"], correct: 0 },
          { q: "Why does Red Crayon feel overworked?", options: ["He has to colour everything red and work on holidays", "He lost his paper wrapper and feels cold", "He was dropped on the floor and broke in two"], correct: 0 },
          { q: "How can Duncan help Red Crayon feel less tired?", options: ["Give him a rest from colouring so many red things", "Colour faster so the pictures are done sooner", "Press much harder every time he uses him"], correct: 0 },
          { q: "Why is Red Crayon extra busy at Christmas time?", options: ["He has to colour all the Santas", "He has to wrap all the presents", "He has to colour all the snowmen"], correct: 0 },
          { q: "Why is Red Crayon extra busy on Valentine's Day?", options: ["He has to colour all the hearts", "He has to make all the chocolates", "He has to deliver all the cards"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How is Red Crayon feeling in this letter?", options: ["Exhausted and overworked", "Excited and energetic", "Bored and sleepy"], correct: 0 },
          { q: "How does Red Crayon feel about working on Christmas and Valentine's Day?", options: ["Frustrated because even on holidays he doesn't get a break", "Happy because holidays are his favourite days to work", "Confused because he forgets which day is a holiday"], correct: 0 },
          { q: "What tone does Red Crayon use when he writes 'WE NEED to talk'?", options: ["Serious and urgent", "Shy and quiet", "Silly and laughing"], correct: 0 }
        ] }
      ]
    },
    {
      id: "purple",
      kind: "letter",
      name: "Purple Crayon",
      card: "Purple Crayon",
      color: "#8E44AD",
      ink: "#6C3483",
      edge: "#8E44AD",
      letter: "Dear Duncan,\n\nAll right, LISTEN.\n\nI love that I'm your favourite crayon for grapes, dragons and wizards hats, but it makes me crazy that so much of my gorgeous colour goes outside the lines. If you DON'T START COLOURING INSIDE the lines I'm going to COMPLETELY LOSE IT.\n\nYour very neat friend,\nPurple Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What fruit does Purple Crayon like to colour?", options: ["Grapes", "Strawberries", "Wheat"], correct: 0 },
          { q: "What mythical creature does Purple Crayon colour?", options: ["Dragons", "Elephants", "Crocodiles"], correct: 0 },
          { q: "Whose hats does Purple Crayon colour?", options: ["Wizards hats", "Cowboy hats", "Santa hats"], correct: 0 },
          { q: "Does Purple Crayon like being Duncan's favourite for grapes and dragons?", options: ["Yes, he loves it", "No, he hates it", "He doesn't care"], correct: 0 },
          { q: "What goes outside the lines when Duncan colours?", options: ["Purple Crayon's gorgeous colour", "Purple Crayon's paper wrapper", "Purple Crayon's crumbly tip"], correct: 0 },
          { q: "How does Purple Crayon describe his own colour?", options: ["Gorgeous colour", "Ugly colour", "Dark colour"], correct: 0 },
          { q: "What main contrast does Purple Crayon make in his letter?", options: ["He loves what he colours, but hates going outside the lines", "He loves staying inside the lines, but hates colouring dragons", "He hates wizards' hats, but loves colouring grapes"], correct: 0 },
          { q: "What warning does Purple Crayon give if Duncan doesn't change?", options: ["He is going to completely lose it", "He is going to break in half", "He is going to run away from home"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "What makes Purple Crayon crazy?", options: ["When colour goes outside the lines", "When he is kept in the box all day", "When people call him pink by mistake"], correct: 0 },
          { q: "What does Duncan need to do to keep Purple Crayon happy?", options: ["COLOUR INSIDE the lines", "Colour faster", "Draw smaller pictures"], correct: 0 },
          { q: "What will happen if Duncan keeps colouring outside the lines?", options: ["Purple Crayon will completely lose it", "Purple Crayon will snap into two pieces", "Purple Crayon will turn blue"], correct: 0 },
          { q: "Why is Purple Crayon upset even though he is a favourite?", options: ["Because the colour goes outside the lines", "Because he isn't used for enough pictures", "Because he lost the label on his wrapper"], correct: 0 },
          { q: "What kind of friend does Purple Crayon call himself at the end?", options: ["A very neat friend", "A messy friend", "A silly friend"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Purple Crayon feel about neatness?", options: ["He cares very deeply about being neat and staying inside lines", "He likes big messes and colouring right off the page", "He doesn't care at all whether the lines are kept"], correct: 0 },
          { q: "How is Purple Crayon feeling when he writes this letter?", options: ["Annoyed and frustrated by messy colouring", "Sad and lonely because nobody uses him", "Scared of the dragons he has to colour"], correct: 0 },
          { q: "Why does Purple Crayon call himself 'Your very neat friend'?", options: ["To remind Duncan that he wants his colour kept neatly in the lines", "Because he always keeps the crayon box clean and tidy", "Because he helps Duncan tidy his bedroom every day"], correct: 0 }
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
      letter: "Dear Duncan,\n\nI'm tired of being called 'light brown' or 'Dark tan' because I am neither. I am BEIGE and I am proud.\nI'm also tired of being second Place to Mr Brown Crayon.\nIt's not fair that Brown gets all the bears, ponies and puppies while the only things I get are turkey dinners (if I'm lucky) and wheat, and let's be honest - when was the last time you saw a kid excited about colouring wheat?\n\nYour BEIGE Friend,\nBeige Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What two wrong names is Beige Crayon tired of being called?", options: ["'light brown' or 'Dark tan'", "'yellow' or 'white'", "'dirty grey' or 'off-white'"], correct: 0 },
          { q: "What is Beige Crayon proud to be?", options: ["BEIGE", "Brown", "Tan"], correct: 0 },
          { q: "Who is Beige Crayon tired of being second place to?", options: ["Mr Brown Crayon", "Red Crayon", "Yellow Crayon"], correct: 0 },
          { q: "Name three animals Mr Brown Crayon gets to colour.", options: ["Bears, ponies, and puppies", "Cats, frogs, and fish", "Lions, tigers, and crocodiles"], correct: 0 },
          { q: "What meal does Beige Crayon get to colour if he's lucky?", options: ["Turkey dinners", "Breakfast pancakes", "Pizza slices"], correct: 0 },
          { q: "What plant does Beige Crayon get stuck colouring?", options: ["Wheat", "Grass", "Oak trees"], correct: 0 },
          { q: "Does Beige Crayon think kids get excited about wheat?", options: ["No, he says no kid gets excited about colouring wheat", "Yes, he says all kids love colouring wheat best", "He isn't sure, because he has never coloured wheat"], correct: 0 },
          { q: "What list of items shows what Beige Crayon actually gets to colour?", options: ["Turkey dinners and wheat", "Bears, ponies, and puppies", "Apples and grass"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why is Beige Crayon upset about his name?", options: ["People keep calling him 'light brown' or 'Dark tan' instead of Beige", "He wants to change his name to Blue like his friend", "People keep calling him 'Brown Crayon's little brother'"], correct: 0 },
          { q: "Why does Beige Crayon feel left out compared to Brown Crayon?", options: ["Brown gets all the cool animals like bears and puppies", "Brown is longer and has a shinier wrapper than him", "Brown gets to colour every turkey dinner and wheat field"], correct: 0 },
          { q: "What question does Beige Crayon ask about colouring wheat?", options: ["'When was the last time you saw a kid excited about colouring wheat?'", "'Why does wheat always have to be coloured beige?'", "'Who decided that Brown should get all the ponies?'"], correct: 0 },
          { q: "How can Duncan make Beige Crayon feel better?", options: ["Give him more exciting things to colour besides wheat", "Only ever use him for wheat and turkey dinners", "Colour all the bears and puppies with Brown instead"], correct: 0 },
          { q: "How does Beige Crayon feel about being Beige?", options: ["He is proud of his real color", "He is ashamed of being beige", "He wishes he were dark tan"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Beige Crayon feel about being second place to Brown Crayon?", options: ["He feels overlooked and treated unfairly", "He feels happy and relaxed about it", "He feels excited to help Brown Crayon"], correct: 0 },
          { q: "How does Beige Crayon feel about his identity?", options: ["Proud to be Beige and wants people to use his real name", "Ashamed of his colour and wants to be called light brown", "Wants to be Red so he can colour fire engines"], correct: 0 },
          { q: "What emotional state is Beige Crayon expressing in this letter?", options: ["Unappreciated because he gets boring jobs like wheat", "Terrified because he is scared of ponies", "Thrilled because colouring wheat is his favourite job"], correct: 0 }
        ] }
      ]
    },
    {
      id: "grey",
      kind: "letter",
      name: "Grey Crayon",
      card: "Grey Crayon",
      color: "#95A5A6",
      ink: "#576574",
      edge: "#7F8C8D",
      letter: "Duncan\n\nGREY CRAYON here you're KILLING ME\nI know you love Elephants And I know that elephants are grey... but that's a LOT of space to colour in all by myself.\nAnd don't even get me started on your rhinos hippos and HUMPBACK WHALES...\nKnow how tired I am after handling one of those things?\nSuch BIG animals...\nbaby penguins are grey, you know. so are very tiny rocks. Pebbles. How about one of those once in a while to give me a break?\n\nYour very tired friend,\nGrey Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What giant land animal with a trunk does Grey Crayon colour?", options: ["Elephants", "Giraffes", "Lions"], correct: 0 },
          { q: "Name two other big land animals Grey Crayon colours.", options: ["Rhinos and hippos", "Cows and horses", "Bears and tigers"], correct: 0 },
          { q: "What huge ocean animal does Grey Crayon have to colour?", options: ["HUMPBACK WHALES", "GREAT WHITE SHARKS", "KILLER WHALES"], correct: 0 },
          { q: "What small grey bird does Grey Crayon mention?", options: ["Baby penguins", "Baby seagulls", "Grey pigeons"], correct: 0 },
          { q: "What small ground object does Grey Crayon suggest colouring?", options: ["Very tiny rocks / Pebbles", "Grains of grey sand on a beach", "Small grey snails / Slugs"], correct: 0 },
          { q: "Does Duncan love elephants?", options: ["Yes, Duncan loves elephants", "No, Duncan is scared of elephants", "The letter doesn't say"], correct: 0 },
          { q: "Which list includes ALL four huge animals Grey Crayon mentions?", options: ["Elephants, rhinos, hippos, and humpback whales", "Elephants, lions, giraffes, and humpback whales", "Rhinos, hippos, sharks, and grey squirrels"], correct: 0 },
          { q: "What two small things does Grey Crayon suggest to replace big animals?", options: ["Baby penguins and pebbles", "Little mice and grey kittens", "Pigeons and paper clips"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why is Grey Crayon so exhausted?", options: ["Colouring giant animals takes a lot of space and work", "He got lost outside the box and couldn't get back in", "He hates being grey and wants to be a brighter colour"], correct: 0 },
          { q: "Why does colouring an elephant make Grey Crayon tired?", options: ["Because an elephant is a LOT of space to colour all by himself", "Because elephants keep moving while he is colouring them", "Because elephants are so loud they keep him awake at night"], correct: 0 },
          { q: "How can Duncan give Grey Crayon a break?", options: ["By colouring smaller things like baby penguins or pebbles", "By colouring an even bigger humpback whale instead", "By using Grey Crayon for every sky and cloud"], correct: 0 },
          { q: "How does Grey Crayon feel after handling a humpback whale?", options: ["Very tired", "Energetic", "Happy"], correct: 0 },
          { q: "Why does Grey Crayon suggest baby penguins and pebbles?", options: ["Because they are small and grey, giving him a rest", "Because they are loud and fun to colour quickly", "Because they swim in the sea next to the whales"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Grey Crayon feel about colouring huge animals all day?", options: ["Completely worn out and exhausted", "Proud and strong like an elephant", "Angry at the baby penguins"], correct: 0 },
          { q: "How does Grey Crayon feel toward Duncan?", options: ["He likes that Duncan loves elephants, but needs him to understand his fatigue", "He hates Duncan and never wants to colour anything for him again", "He is afraid of Duncan because Duncan presses too hard"], correct: 0 },
          { q: "Why does Grey Crayon say 'you're KILLING ME'?", options: ["It's an exaggeration showing how physically tired he is from huge drawings", "Because he has really been hurt and needs to see a doctor", "Because he is playing a pretend game of monsters with Duncan"], correct: 0 }
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
      white: true,
      letter: "Dear Duncan,\n\nYou colour with me, but why?\nmost of the time I'm the same colour as the page you are using me on WHITE.\nIf I didn't have a black outline, you wouldn't even know I was THERE!\nI'm not even in the rainbow.\nI'm only used to colour SNOW or to fill in empty space between other things.\nAnd it leaves me feeling... well... empty. We need to talk.\n\nYour empty friend,\nwhite crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "Why is White Crayon hard to see on normal paper?", options: ["He is the same colour as the white page", "He is too sharp and makes tiny marks", "He is darker than all the other crayons"], correct: 0 },
          { q: "What keeps White Crayon visible on the page?", options: ["A black outline", "A yellow star", "A grey shadow"], correct: 0 },
          { q: "Is White Crayon in the rainbow?", options: ["No, he is not in the rainbow", "Yes, he is at the top", "Yes, he is in the middle"], correct: 0 },
          { q: "What cold weather thing is White Crayon used to colour?", options: ["SNOW", "Ice cream", "Milkshakes"], correct: 0 },
          { q: "Where else is White Crayon used besides snow?", options: ["To fill in empty space between other things", "To colour clouds and polar bears", "To colour the teeth in smiling faces"], correct: 0 },
          { q: "What picture did Duncan draw using White Crayon on page 7?", options: ["A white cat in the snow", "A white dog in the rain", "A snowman with a scarf"], correct: 0 },
          { q: "What happens if White Crayon is used without an outline?", options: ["You wouldn't even know he was there", "He would leave a dark mark on the page", "He would break into little pieces"], correct: 0 },
          { q: "What two specific uses does White Crayon list for himself?", options: ["Colouring snow and filling empty space between things", "Colouring clouds and the stars in the night sky", "Drawing cats and dogs on coloured paper"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why does White Crayon feel empty inside?", options: ["He is only used for snow or filling empty space", "He lost his paper wrapper and feels cold", "He wants to colour dragons but Purple won't share"], correct: 0 },
          { q: "Why does White Crayon wonder why Duncan colours with him?", options: ["Because he is the same colour as the white page", "Because he is broken into two little pieces", "Because he is the smallest crayon in the box"], correct: 0 },
          { q: "What would happen if White Crayon didn't have a black outline?", options: ["You wouldn't even know he was there!", "He would turn blue like the sky!", "He would break into tiny pieces!"], correct: 0 },
          { q: "How can Duncan make White Crayon feel included?", options: ["Use him on coloured paper or give him real pictures to draw", "Only use him for snow, just like he does now, every day", "Put him in water to make his colour brighter"], correct: 0 },
          { q: "What does White Crayon say at the end of his letter?", options: ["'We need to talk.'", "'Goodbye.'", "'I am leaving.'"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does White Crayon feel about his role in drawings?", options: ["Invisible, unappreciated, and 'empty'", "Super proud, excited, and 'shining'", "Angry, noisy, and 'bossy'"], correct: 0 },
          { q: "Why does White Crayon feel 'empty'?", options: ["Because he is only used to fill empty spaces and white snow", "Because he hasn't had anything to eat all day", "Because the crayon box is empty and everyone has left"], correct: 0 },
          { q: "How does White Crayon feel about not being in the rainbow?", options: ["Left out of the special group of colors", "Happy to be separate from the other colours", "Confused about what a rainbow is"], correct: 0 }
        ] }
      ]
    },
    {
      id: "black",
      kind: "letter",
      name: "Black Crayon",
      card: "Black Crayon",
      color: "#2D3436",
      ink: "#1A202C",
      edge: "#2D3436",
      letter: "Hi, Duncan,\n\nI HATE being used to draw the outline of things...\n... things that are coloured in by other colours, all of which think they're brighter than me!\nIts NOT FAIR when you use me to draw a nice beach ball and then fill in the colours of the ball with ALL THE OTHER CRAYONS.\n\nHow about a BLACK Beachball some time? Is that too much to ask?\n\nYour Friend,\nBlack Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What does Black Crayon hate doing?", options: ["Drawing the outline of things", "Colouring in night skies", "Colouring car tyres and roads"], correct: 0 },
          { q: "Who colours in the pictures after Black Crayon draws the outline?", options: ["All the other crayons", "Duncan's little sister", "Nobody, it stays empty"], correct: 0 },
          { q: "What do the other crayons think about themselves compared to Black Crayon?", options: ["They think they're brighter than him", "They think Black is the best of them", "They think he is the oldest crayon"], correct: 0 },
          { q: "What fun summer object does Duncan draw with Black Crayon?", options: ["A beach ball", "A basketball", "A balloon"], correct: 0 },
          { q: "What does Duncan do after drawing the beach ball outline with Black?", options: ["Fills in the colours with all the other crayons", "Leaves the inside blank and draws a new picture", "Paints over the whole ball with blue paint"], correct: 0 },
          { q: "What special beach ball does Black Crayon want to colour?", options: ["A BLACK beach ball", "A red beach ball", "A blue beach ball"], correct: 0 },
          { q: "Why are other crayons acting like they are better than Black Crayon?", options: ["Because they get to fill in the beautiful colors while Black only draws lines", "Because they are taller and newer than Black Crayon", "Because Duncan told them that Black Crayon is the least important crayon of all"], correct: 0 },
          { q: "What question does Black Crayon ask Duncan about the black beach ball?", options: ["'Is that too much to ask?'", "'Why not let me do it?'", "'Can I colour the sun too?'"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why does Black Crayon feel it's NOT FAIR?", options: ["Because he only draws outlines while other crayons fill in the picture", "Because he is the shortest crayon left in the whole box", "Because he lost his wrapper and the other crayons laughed at him"], correct: 0 },
          { q: "How can Duncan fix Black Crayon's problem?", options: ["Colour a whole picture, like a black beach ball, using only Black Crayon", "Stop drawing beach balls and draw only outlines from now on", "Buy a brand new box of crayons with more black ones inside"], correct: 0 },
          { q: "Why are other crayons acting smug according to Black Crayon?", options: ["Because they think they are brighter than Black Crayon", "Because they are longer and sharper than Black Crayon", "Because they are newer and have shinier wrappers"], correct: 0 },
          { q: "Is drawing a black beach ball too much to ask according to Black Crayon?", options: ["No, he asks 'Is that too much to ask?'", "Yes, he says it is impossible to do", "He doesn't know, so he asks Green Crayon"], correct: 0 },
          { q: "How does Black Crayon want to be used in drawings?", options: ["To colour in full objects, not just draw outlines", "Only to colour black cats and nothing else", "Never at all, so he can stay in the box"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Black Crayon feel about being treated as just an 'outline' tool?", options: ["Resentful and frustrated that other colors think they are brighter", "Happy to help the others because outlines are his favourite job", "Sleepy, because drawing outlines makes him want to rest"], correct: 0 },
          { q: "How does Black Crayon feel about his own potential?", options: ["He believes he can color great pictures like a black beach ball if given a chance", "He thinks he is useless and would rather stay in the box than colour anything", "He wants to turn yellow so that he can colour in the sun"], correct: 0 },
          { q: "What emotion does Black Crayon show when he writes 'Its NOT FAIR'?", options: ["Indignation and a desire for equal treatment", "Fear of being used for the beach ball", "Joy and pride about drawing outlines"], correct: 0 }
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
      letter: "Dear Duncan,\n\nAs Green crayon, I am writing for TWO reasons. One is to say that I like my work - loads of crocodiles, trees, dinosaurs and Frogs. I have no problems and wish to congratulate you on a very successful 'colouring things Green' career so far.\n\nThe second reason I write is for my friends, Yellow Crayon and Orange crayon, who are no longer speaking to each other. Both crayons feel THEY should be the colour of the sun.\n\nPlease settle this soon because they're driving the rest of us CRAZY!\n\nYour happy friend, Green Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How many reasons does Green Crayon have for writing to Duncan?", options: ["TWO reasons", "ONE reason", "THREE reasons"], correct: 0 },
          { q: "Name two reptiles or amphibians Green Crayon colours.", options: ["Crocodiles and frogs", "Snakes and lizards", "Turtles and toads"], correct: 0 },
          { q: "Name two other green things Green Crayon colours.", options: ["Trees and dinosaurs", "Grass and oak trees", "Leaves and caterpillars"], correct: 0 },
          { q: "What does Green Crayon congratulate Duncan on?", options: ["A very successful 'colouring things Green' career", "A very neat 'colouring inside the lines' career", "Winning first prize in a drawing competition"], correct: 0 },
          { q: "Which two crayon friends are no longer speaking to each other?", options: ["Yellow Crayon and Orange Crayon", "Red Crayon and Blue Crayon", "Black Crayon and White Crayon"], correct: 0 },
          { q: "What are Yellow and Orange fighting about?", options: ["Who should be the colour of the sun", "Who is the brightest crayon in the box", "Who gets to come out of the box first"], correct: 0 },
          { q: "Which full set of 4 things does Green Crayon list as his work?", options: ["Crocodiles, trees, dinosaurs, and frogs", "Apples, leaves, wheat, and snakes", "Crocodiles, turtles, lizards, and frogs"], correct: 0 },
          { q: "What effect is the argument between Yellow and Orange having on the box?", options: ["It is driving the rest of the crayons CRAZY!", "It is making the rest of the crayons SLEEPY!", "It is making all the other crayons laugh"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Does Green Crayon have any problems with his own colouring workload?", options: ["No, he likes his work and has no problems", "Yes, he is overworked and needs a long rest", "Yes, he wants to colour the sun instead"], correct: 0 },
          { q: "Why is Green Crayon writing if he is happy with his own job?", options: ["To help his friends Yellow and Orange who are arguing", "To ask for a reward for all his hard work", "To complain that he has to colour too many trees"], correct: 0 },
          { q: "What are Yellow and Orange driving the rest of the crayons to become?", options: ["CRAZY!", "Sad!", "Quiet!"], correct: 0 },
          { q: "What does Green Crayon ask Duncan to do?", options: ["Settle the argument between Yellow and Orange soon", "Throw Orange Crayon away so Yellow can be the sun", "Colour more frogs and crocodiles every single day"], correct: 0 },
          { q: "How can Duncan make the crayon box peaceful again?", options: ["Decide or settle who gets to colour the sun", "Close the crayon box and never open it again", "Give Green Crayon a long holiday"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Green Crayon feel about his own coloring job?", options: ["Content, happy, and satisfied", "Angry, tired, and overworked", "Jealous of Yellow and Orange"], correct: 0 },
          { q: "How does Green Crayon feel toward his friends Yellow and Orange?", options: ["Caring and concerned, but annoyed that their fighting ruins the peace", "He dislikes them both and wants them out of the crayon box", "He doesn't care, because their argument has nothing to do with him"], correct: 0 },
          { q: "What kind of personality does Green Crayon show?", options: ["Friendly, positive, and a peacemaker", "Bossy, grumpy, and a troublemaker", "Shy, fearful, and a worrier"], correct: 0 }
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
      letter: "Dear Duncan,\n\nYellow crayon here. I need you to tell orange crayon that I am the colour of the sun. I would tell him but we are no longer speaking. And I can PROVE I'm the colour of the SUN too!\n\nLast Tuesday, you used me to colour in the sun in your 'HAPPY FARM' colouring book. In case you've forgotten, it's on page 7. YOU CAN'T MISS ME. I'm shining down brilliantly on a field of YELLOW corn!\n\nYour pal (and the true colour of the sun),\nYellow Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What does Yellow Crayon want Duncan to tell Orange Crayon?", options: ["That Yellow is the colour of the sun", "That Yellow is moving to a new box", "That Yellow is the colour of the moon"], correct: 0 },
          { q: "Why won't Yellow Crayon talk to Orange Crayon directly?", options: ["They are no longer speaking", "Orange is fast asleep", "Yellow has lost his voice"], correct: 0 },
          { q: "On what day of the week did Duncan use Yellow to colour the sun?", options: ["Last Tuesday", "Last Thursday", "On Sunday"], correct: 0 },
          { q: "What is the name of the colouring book page Yellow Crayon mentions?", options: ["'HAPPY FARM'", "'DAY AT THE ZOO'", "'MONKEY ISLAND'"], correct: 0 },
          { q: "What page number was 'HAPPY FARM' on?", options: ["Page 7", "Page 5", "Page 10"], correct: 0 },
          { q: "What crop is Yellow Crayon shining down on in that picture?", options: ["A field of YELLOW corn", "A field of GOLDEN wheat", "A field of tall sunflowers"], correct: 0 },
          { q: "How does Yellow Crayon describe how he shines on page 7?", options: ["Shining down brilliantly", "Shining down softly", "Hiding behind the clouds"], correct: 0 },
          { q: "What title does Yellow Crayon give himself at the end?", options: ["The true colour of the sun", "The king of all the crayons", "The brightest star in the sky"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why are Yellow and Orange Crayon mad at each other?", options: ["They are arguing over who is the true colour of the sun", "Yellow broke the tip off Orange's crayon by accident", "Orange took Yellow's paper wrapper and won't give it back"], correct: 0 },
          { q: "How does Yellow Crayon PROVE he is the colour of the sun?", options: ["By pointing to page 7 of 'HAPPY FARM' where Duncan used him for the sun", "By saying he is brighter than every other crayon in the box", "By pointing to the 'DAY AT THE ZOO' book where Duncan used him for the moon"], correct: 0 },
          { q: "Why does Yellow Crayon say 'YOU CAN'T MISS ME' on page 7?", options: ["Because he is shining brilliantly on the field of yellow corn", "Because he is the biggest drawing on the whole page", "Because he is so loud that everyone can hear him shining"], correct: 0 },
          { q: "How can Duncan solve Yellow Crayon's problem?", options: ["Tell Orange Crayon that Yellow is the colour of the sun", "Throw Yellow Crayon away so that Orange can be the sun", "Colour the sun blue so that nobody has to argue"], correct: 0 },
          { q: "How does Yellow Crayon feel about being used for the sun on Happy Farm?", options: ["He thinks it proves he is the true colour of the sun", "He thinks it was a mistake because the sun should be orange", "He didn't like it because the corn was too yellow"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Yellow Crayon feel toward Orange Crayon?", options: ["Stubborn and refusing to talk to him until he admits Yellow is the sun", "Scared of Orange because Orange is bigger and stronger than him", "Happy to work with Orange and share the sun in every picture"], correct: 0 },
          { q: "How confident is Yellow Crayon that HE is the real sun?", options: ["100% confident because he has proof on page 7", "Not confident at all, because he has no proof", "Unsure, so he asks Duncan to check for him"], correct: 0 },
          { q: "What emotion drives Yellow Crayon's letter?", options: ["Determination to win the argument about the sun", "Sadness about losing his best friend Orange", "Loneliness because nobody uses him any more"], correct: 0 }
        ] }
      ]
    },
    {
      id: "orange",
      kind: "letter",
      name: "Orange Crayon",
      card: "Orange Crayon",
      color: "#E67E22",
      ink: "#BA4A00",
      edge: "#E67E22",
      letter: "Dear Duncan,\n\nYellow crayon already talked to you, the BIG WHINER. Anyway, could you please tell Mr Tattletale that he is NOT the colour of the sun? I would, but we're no longer speaking.\n\nWe both know I am clearly the colour of the sun because, on Thursday, you used me to colour the sun on BOTH the 'Monkey Island' and 'meet the zookeeper' pages in your DAY AT THE ZOO colouring book.\n\norange you glad I'm here? Ha!\n\nYour Pal (and the real colour of the sun),\nOrange Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What rude names does Orange Crayon call Yellow Crayon?", options: ["'BIG WHINER' and 'Mr Tattletale'", "'Lazy Crayon' and 'Mr Neat'", "'Big Baby' and 'Mr Sunshine'"], correct: 0 },
          { q: "On what day of the week did Duncan use Orange to colour the sun?", options: ["Thursday", "Tuesday", "Wednesday"], correct: 0 },
          { q: "What is the title of the colouring book Orange Crayon mentions?", options: ["DAY AT THE ZOO", "HAPPY FARM", "MY BIG COLOURING BOOK"], correct: 0 },
          { q: "Name the first page in the zoo book where Orange coloured the sun.", options: ["'Monkey Island'", "'Happy Farm'", "'Elephant Walk'"], correct: 0 },
          { q: "Name the second page in the zoo book where Orange coloured the sun.", options: ["'meet the zookeeper'", "'feed the penguins'", "'the lion's den'"], correct: 0 },
          { q: "How many total pages in the zoo book used Orange for the sun?", options: ["BOTH pages / 2 pages", "Just ONE page / 1 page", "THREE pages / 3 pages"], correct: 0 },
          { q: "What pun joke does Orange Crayon make?", options: ["'orange you glad I'm here? Ha!'", "'Sun power is orange power! Ha!'", "'Yellow is just a mellow fellow!'"], correct: 0 },
          { q: "How does Orange sign off at the end of his letter?", options: ["Your Pal (and the real colour of the sun)", "Your angry friend (and the king of the box)", "Yellow's enemy (and the colour of the moon)"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "What does Orange Crayon want Duncan to tell Yellow Crayon?", options: ["That Yellow is NOT the colour of the sun", "That Yellow is moving to another crayon box", "That Yellow is lazy and should colour more"], correct: 0 },
          { q: "Why does Orange Crayon think HE is clearly the real colour of the sun?", options: ["Because Duncan used him for the sun on TWO different zoo pages", "Because he is darker and stronger than Yellow Crayon", "Because Duncan used him for the sun on page 7 of 'HAPPY FARM'"], correct: 0 },
          { q: "What pun/joke does Orange Crayon make at the end of his letter?", options: ["'orange you glad I'm here? Ha!'", "'Orange you the best? Ha ha!'", "'Sun shine bright on Monkey Island!'"], correct: 0 },
          { q: "How can Duncan fix the feud between Orange and Yellow?", options: ["Decide on a solution for colouring the sun", "Hide both crayons so nobody can colour the sun", "Colour the sun black from now on"], correct: 0 },
          { q: "Why won't Orange Crayon tell Yellow Crayon directly?", options: ["Because they are no longer speaking", "Because Yellow is asleep in the box", "Because Orange is too shy to say it"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Orange Crayon feel about Yellow Crayon's claims?", options: ["Competitive, sassy, and convinced Yellow is lying", "Scared of Yellow and worried he might be right", "Agreeing with Yellow that they could share the sun"], correct: 0 },
          { q: "What attitude does Orange Crayon show when he calls Yellow 'Mr Tattletale'?", options: ["Cheeky, stubborn, and competitive", "Polite, gentle, and very respectful", "Shy, quiet, and sorry"], correct: 0 },
          { q: "How does Orange Crayon feel about his place in the crayon box?", options: ["Confident and playful ('orange you glad I'm here?')", "Sad and lonely ('nobody ever uses me')", "Worn out and grumpy ('I need a rest!')"], correct: 0 }
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
      letter: "Dear DUNCAN,\n\nIt has been great being your FAVOURITE colour this PAST year. And the year before. And the YEAR BEFORE THAT!\n\nI have really enjoyed all those OCEANS, Lakes, Rivers, raindrops, rain CLOUDS and CLEAR skies.\n\nBut the BAD NEWS is that I am so short and stubby, I can't even see over the railing in the CRAYON BOX any more! I need a BREAK!\n\nYour very stubby Friend,\nBlue Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How long has Blue Crayon been Duncan's favourite colour?", options: ["This past year, the year before, and the year before that!", "Ever since Duncan was a baby, for ten whole years!", "Just a few days, since Duncan got the box!"], correct: 0 },
          { q: "Name three large bodies of water Blue Crayon enjoys colouring.", options: ["OCEANS, Lakes, and Rivers", "Puddles, pools, and taps", "Snow, ice, and hail"], correct: 0 },
          { q: "What two sky things does Blue Crayon colour?", options: ["Rain CLOUDS and CLEAR skies", "The SUN and the STARS", "Snowy MOUNTAINS and RAINBOWS"], correct: 0 },
          { q: "What weather element comes down from clouds that Blue colours?", options: ["Raindrops", "Snowflakes", "Hail"], correct: 0 },
          { q: "Where is Blue Crayon kept when not in use?", options: ["In the CRAYON BOX", "In a pencil case", "On the desk"], correct: 0 },
          { q: "Can Blue Crayon see over the railing of the crayon box anymore?", options: ["No, he can't see over the railing", "Yes, he can see over it easily", "Yes, because he is now too tall"], correct: 0 },
          { q: "Which full list shows ALL water and sky things Blue Crayon mentions?", options: ["Oceans, lakes, rivers, raindrops, rain clouds, and clear skies", "Rain, snow, clouds, ice, puddles, and the deep blue sea", "Oceans, lakes, swimming pools, raindrops, snowflakes, and skies"], correct: 0 },
          { q: "How does Blue Crayon describe his physical size now?", options: ["Short and stubby", "Tall and thin", "Giant"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "What is the BAD NEWS Blue Crayon brings to Duncan?", options: ["He is so short and stubby from being used so much", "He broke in half when he fell off the desk", "He has run out of blue colour completely"], correct: 0 },
          { q: "Why did Blue Crayon become so short and stubby?", options: ["Because he was Duncan's favourite colour used for oceans, lakes, and skies for years", "Because he fell off the table and a big piece snapped off", "Because someone cut him shorter so that he would fit back in the box"], correct: 0 },
          { q: "What does Blue Crayon need from Duncan right now?", options: ["I need a BREAK!", "A nap!", "A new wrapper!"], correct: 0 },
          { q: "How can Duncan help Blue Crayon rest?", options: ["Use other colours for water and sky for a while", "Press harder so the blue goes on faster", "Sharpen him so his tip is nice and pointy"], correct: 0 },
          { q: "Why can't Blue Crayon look out of the crayon box?", options: ["Because he is too short and stubby", "Because the box is locked shut", "Because the other crayons are blocking him"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Blue Crayon feel about being Duncan's favorite color for three years?", options: ["He loved it and enjoyed it, but now feels completely worn down", "He hated being the favourite and never wanted to be used", "He didn't notice, because he was asleep in the box"], correct: 0 },
          { q: "How does Blue Crayon feel inside the crayon box right now?", options: ["Trapped behind the railing because he is too short to see over it", "Happy and hidden, because he likes resting at the bottom", "Excited, because he is now the tallest crayon in the box"], correct: 0 },
          { q: "What emotion is Blue Crayon expressing when he asks for 'a BREAK!'?", options: ["Exhaustion from being overused and a need for rest", "Anger at the other crayons for taking his colour", "Fear of being thrown away by Duncan"], correct: 0 }
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
      letter: "Duncan,\n\nOkay LISTEN HERE, KID!\n\nYou have not used me ONCE in the past year. It's because you think I'm a 'girl's colour', isn't it?\n\nSpeaking of which, please tell your little sister I said thank you for using me to colour her Pretty Princess colouring book. I think she did a fabulous job staying inside the lines!\n\nNow back to us. Could you PLEASE use me some time to colour the occasional PINK DINOSAUR or monster or cowboy? Goodness knows they could use a splash of colour.\n\nYour unused friend,\nPink Crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "How often was Pink Crayon used by Duncan in the past year?", options: ["Not ONCE", "Every day", "Twice"], correct: 0 },
          { q: "Why does Pink Crayon think Duncan hasn't used him?", options: ["Duncan thinks pink is a 'girl's colour'", "Pink got lost under Duncan's bed", "Duncan thinks pink is too bright to use"], correct: 0 },
          { q: "Who DID use Pink Crayon to colour a book?", options: ["Duncan's little sister", "Duncan's best friend", "Duncan's big brother"], correct: 0 },
          { q: "What colouring book did the little sister use Pink Crayon for?", options: ["Pretty Princess colouring book", "Happy Farm colouring book", "Day at the Zoo colouring book"], correct: 0 },
          { q: "What compliment does Pink Crayon give the little sister?", options: ["She did a fabulous job staying inside the lines", "She coloured every page really quickly", "She did a fabulous job colouring the dinosaurs pink"], correct: 0 },
          { q: "What three fun things does Pink Crayon ask Duncan to colour pink?", options: ["PINK DINOSAUR, monster, or cowboy", "Princesses, flowers, and hearts", "Pigs, flamingos, and cotton candy"], correct: 0 },
          { q: "How long has Pink Crayon sat in the box without being used by Duncan?", options: ["The past year / whole year", "One week / just a few days", "One month / since Tuesday"], correct: 0 },
          { q: "What phrase does Pink Crayon use when asking for a splash of colour?", options: ["'Goodness knows they could use a splash of colour'", "'Pink is the most awesome colour of them all'", "'Try pink today and you will never go back'"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why is Pink Crayon feeling left out by Duncan?", options: ["Duncan hasn't used him once all year thinking it's a 'girl's colour'", "He is broken in half and nobody will fix him", "Duncan's sister took him away and keeps him in her room all year"], correct: 0 },
          { q: "What message does Pink Crayon want Duncan to pass to his little sister?", options: ["'Thank you for using me to colour her Pretty Princess book'", "'Please don't ever use me again in your book'", "'You should colour outside the lines more often'"], correct: 0 },
          { q: "How can Duncan fix Pink Crayon's problem?", options: ["Use Pink to colour cool things like dinosaurs, monsters, or cowboys", "Give him to his little sister to keep for ever", "Use Pink only for princesses, flowers, and fairy wings from now on"], correct: 0 },
          { q: "Why do dinosaurs, monsters, and cowboys need Pink Crayon according to the letter?", options: ["Goodness knows they could use a splash of colour!", "Because they are already pink in real life!", "Because they are sad and need cheering up!"], correct: 0 },
          { q: "How can Duncan show that pink isn't just a 'girl's colour'?", options: ["By colouring a pink monster or cowboy", "By never using Pink at all", "By giving Pink away to his sister"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Pink Crayon feel about gender stereotypes ('girl's colour')?", options: ["Annoyed and eager to prove that pink can be used for tough things like cowboys and dinosaurs", "He agrees that pink is only for girls and is happy to stay in the box", "Happy, because he thinks only princesses and fairies should ever be coloured pink"], correct: 0 },
          { q: "How does Pink Crayon feel toward Duncan's little sister?", options: ["Grateful and impressed by her neat colouring inside the lines", "Jealous of her because she gets to keep all the crayons", "Angry at her for colouring outside the lines"], correct: 0 },
          { q: "What emotion does Pink Crayon feel about being stuck in the box all year?", options: ["Left out, neglected, and wanting to be part of Duncan's drawings", "Scared to come out of the box in case Duncan breaks him", "Sleepy and happy to rest for another whole year"], correct: 0 }
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
      letter: "HEY DUNCAN,\n\nIT'S ME PEACH CRAYON.\n\nWhy did you peel off my paper wrapping??\nNow I'm NAKED and too embarrassed to leave the crayon box. I don't even have any underwear!\n\nHow would you like to go to school naked? I need some clothes. HELP!\n\nYour naked friend,\nPEACH crayon",
      parts: [
        { key: "caseFile", title: "📖 Case File", skill: "Finding facts", questions: [
          { q: "What did Duncan peel off Peach Crayon?", options: ["His paper wrapping", "His pointy tip", "His crayon box lid"], correct: 0 },
          { q: "How does Peach Crayon feel now that his paper wrapping is gone?", options: ["NAKED and too embarrassed to leave the crayon box", "HAPPY and free to go wherever he likes", "COLD and too poorly to leave the warm crayon box"], correct: 0 },
          { q: "Where is Peach Crayon hiding because he is embarrassed?", options: ["Inside the crayon box", "Under Duncan's bed", "In the kitchen drawer"], correct: 0 },
          { q: "What piece of clothing does Peach Crayon say he doesn't even have?", options: ["Underwear", "A shirt", "Pants"], correct: 0 },
          { q: "What question does Peach Crayon ask Duncan about school?", options: ["'How would you like to go to school naked?'", "'Where did you put my paper wrapper?'", "'Why are you always so mean to me?'"], correct: 0 },
          { q: "What does Peach Crayon ask Duncan for at the end?", options: ["'I need some clothes. HELP!'", "'I need some water. HELP!'", "'I need a break. HELP!'"], correct: 0 },
          { q: "What word does Peach Crayon use in capital letters to describe his state?", options: ["NAKED", "BARE", "UNWRAPPED"], correct: 0 },
          { q: "How does Peach Crayon sign off his letter?", options: ["Your naked friend, PEACH crayon", "Your bare friend, PEACH crayon", "Your chilly friend, PEACH crayon"], correct: 0 }
        ] },
        { key: "fixProblem", title: "🛠️ Fix the Problem", skill: "Problems and fixes", questions: [
          { q: "Why is Peach Crayon embarrassed to leave the crayon box?", options: ["Because his paper wrapping was peeled off and he feels naked", "Because he is the shortest crayon and can't climb out", "Because he is covered in dirt from rolling on the floor"], correct: 0 },
          { q: "How would Duncan feel if he had to go to school naked according to Peach Crayon?", options: ["He wouldn't like it!", "He would love it", "He wouldn't care"], correct: 0 },
          { q: "What does Peach Crayon mean when he says 'I need some clothes'?", options: ["He needs his paper wrapper back or something to cover him", "He wants real shirts and jumpers from Duncan's wardrobe", "He wants Duncan to buy him a pair of new trousers"], correct: 0 },
          { q: "How can Duncan fix Peach Crayon's problem?", options: ["Wrap paper around him or give him clothes so he isn't naked", "Colour a tree with him so he feels useful again", "Throw him out of the box so he can't feel embarrassed"], correct: 0 },
          { q: "What caused Peach Crayon's problem in the first place?", options: ["Duncan peeled off his paper wrapping", "Peach fell off the desk and cracked", "Peach lost his tip in the sharpener"], correct: 0 }
        ] },
        { key: "crayonFeelings", title: "❤️ Crayon Feelings", skill: "Feelings", questions: [
          { q: "How does Peach Crayon feel about having his wrapper peeled off?", options: ["Self-conscious, embarrassed, and vulnerable", "Proud, brave, and ready for school", "Angry at the other crayons for laughing"], correct: 0 },
          { q: "Why does Peach Crayon compare his wrapper to clothes/underwear?", options: ["Because the paper wrapper is like a crayon's outfit that keeps him covered", "Because he likes doing laundry and folding clothes", "Because Duncan put him in the washing machine with all of his school clothes"], correct: 0 },
          { q: "What emotion is Peach Crayon feeling as he sits in the crayon box?", options: ["Shame and embarrassment about leaving the box without clothes", "Joy and excitement about going to school", "Joy, because he finally gets a quiet rest inside the box"], correct: 0 }
        ] }
      ]
    },
    {
      id: "masterpiece",
      kind: "finale",
      name: "Duncan's Masterpiece",
      card: "Duncan's Masterpiece",
      heading: "Duncan's Solution",
      doneName: "Duncan's masterpiece",
      emoji: "🏆",
      color: "#805AD5",
      ink: "#6B46C1",
      edge: "#805AD5",
      letter: "When Duncan read all of his crayons' letters, he realized they were unhappy.\n\nHe wanted his crayons to feel heard and appreciated!\n\nSo Duncan had an amazing idea: he drew ONE giant, colorful picture using EVERY crayon in a creative new way.\n\nHe drew a Pink Dinosaur, a Black Beach Ball, an Orange AND Yellow Sun, and stayed neatly inside the lines with Purple!",
      parts: [
        { key: "match", title: "🎨 Build Duncan's Final Picture", skill: "Putting it together", intro: "Match each creative idea to the right crayon Duncan used!", questions: [
          { q: "🦖 Drawing a Pink Dinosaur", options: ["Pink Crayon", "Red Crayon", "Green Crayon"], correct: 0 },
          { q: "⚽ Drawing a Black Beach Ball", options: ["Black Crayon", "White Crayon", "Blue Crayon"], correct: 0 },
          { q: "☀️ Orange and Yellow Sun Together", options: ["Yellow & Orange", "Red & Green", "Blue & Purple"], correct: 0 },
          { q: "🧙‍♂️ Purple Wizard Hat inside the lines", options: ["Purple Crayon", "Peach Crayon", "Grey Crayon"], correct: 0 },
          { q: "👕 Keeping Peach Crayon in his paper clothes", options: ["Peach Crayon", "Beige Crayon", "Black Crayon"], correct: 0 }
        ] },
        { key: "final", title: "⭐ Final Book Question", skill: "Putting it together", questions: [
          { q: "Why did Duncan's teacher give him an \"A\" for Coloring and an \"A\" for Creativity?", options: ["Because he listened to all his crayons and used them in clever new ways!", "Because he threw away the old box and bought a brand new set of crayons!"], correct: 0, yes: "🌟 Spot on! Duncan showed empathy and great creative thinking!", no: "Look back at the letter box on the left!" }
        ] }
      ]
    }
  ]
};
