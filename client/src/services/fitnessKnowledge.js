const topics = [
  {
    title: 'protein',
    names: ['protein', 'proteins'],
    data: true,
    what: 'Protein is a nutrient made of amino acids. Your body uses it to build and repair muscles, skin, hormones and enzymes.',
    benefits: [
      'Helps muscles grow and recover after training',
      'Keeps you full for longer, which helps with fat loss',
      'Protects your muscle while you lose weight',
      'Supports your immune system and healthy hair, skin and nails',
    ],
    how: 'Most active people do well with about 1.2 to 2 g of protein per kg of body weight a day, spread over 3 to 4 meals. Good sources are eggs, chicken, fish, meat, milk, yogurt, paneer, daal, chana, soya and nuts. Powders are only a convenient way to reach your target.',
    caution: 'More is not always better. People with kidney disease should ask a doctor before eating more protein.',
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
  },
  {
    title: 'whey protein',
    names: ['whey', 'whey protein', 'protein powder', 'protein shake', 'protein supplement'],
    what: 'Whey is a milk protein made when cheese is produced. It is sold as a powder that mixes with water or milk and digests quickly.',
    benefits: [
      'Fast, complete protein that helps muscles recover',
      'An easy way to reach your daily protein target',
      'A shake takes only a minute to make',
      'One scoop usually has 20 to 25 g of protein',
    ],
    how: 'Take one scoop (about 20 to 30 g of protein) after training or between meals, mixed with water or milk. Use it to fill the gap when your food protein is not enough.',
    caution: 'It can cause gas or bloating if you are lactose intolerant (whey isolate has less lactose). Pick a trusted brand that is tested by a third party, and do not replace all your meals with shakes.',
  },
  {
    title: 'casein',
    names: ['casein'],
    what: 'Casein is another milk protein. It digests slowly, so it releases amino acids over several hours.',
    benefits: ['Keeps you full for longer', 'Slow release is useful before bed or a long gap between meals', 'Supports muscle recovery'],
    how: 'Take one scoop (about 25 g) before bed or when you cannot eat for many hours.',
    caution: 'Not for people with a milk allergy. It can cause bloating if you are lactose intolerant.',
  },
  {
    title: 'creatine',
    names: ['creatine', 'creatine monohydrate'],
    what: 'Creatine is a natural compound stored in your muscles. It helps make quick energy for short, heavy efforts like lifting and sprinting. It is one of the most researched supplements.',
    benefits: [
      'More strength and power in your lifts',
      'A few extra reps, which can lead to more muscle over time',
      'Faster recovery between sets',
      'Safe for most healthy adults at normal doses',
    ],
    how: 'Take 3 to 5 g of creatine monohydrate once a day with water or a meal. Timing does not matter, but taking it every day does. You do not need a loading phase.',
    caution: 'You may gain 1 to 2 kg of water weight and sometimes get a mild stomach upset. Drink enough water. If you have kidney problems, take medicine or are under 18, ask a doctor first. Choose plain creatine monohydrate from a trusted brand.',
  },
  {
    title: 'bcaa',
    names: ['bcaa', 'eaa', 'amino acid', 'amino acids'],
    what: 'BCAAs are three amino acids (leucine, isoleucine and valine). EAAs are all nine essential amino acids. Both are sold as powders and drinks.',
    benefits: ['May reduce muscle soreness a little', 'Can help if you train fasted early in the morning', 'Taste good as a drink during training'],
    how: 'A common amount is 5 to 10 g around training. If you already eat enough protein you get little extra from them, and whey or food costs less.',
    caution: 'They are not needed when your protein intake is good. Check the label for sugar and extra stimulants, and ask a doctor if you have a health condition.',
  },
  {
    title: 'pre workout',
    names: ['pre workout', 'pre-workout', 'preworkout'],
    what: 'Pre workout is a powder or drink taken before training. It usually has caffeine plus other ingredients like beta alanine and citrulline to boost energy and focus.',
    benefits: ['More energy and focus', 'Can help you push a little harder in training', 'Reduces the feeling of tiredness'],
    how: 'Take it 20 to 30 minutes before training. Start with half a scoop to check how you react, and avoid it in the evening because it can ruin your sleep. Do not add more caffeine on top.',
    caution: 'Common effects are tingling, jitters, a fast heartbeat and poor sleep. Avoid it if you are sensitive to caffeine, pregnant, under 18 or have high blood pressure or a heart condition.',
  },
  {
    title: 'caffeine',
    names: ['caffeine', 'coffee', 'energy drink'],
    what: 'Caffeine is a stimulant found in coffee, tea, cola and energy drinks.',
    benefits: ['More alertness and focus', 'A small boost in strength and endurance', 'Makes hard training feel easier'],
    how: 'A common amount is about 3 mg per kg of body weight (roughly 200 mg) 30 to 60 minutes before training. Most adults stay under 400 mg a day, which is about 4 cups of coffee. Avoid it in the 6 hours before sleep.',
    caution: 'Too much causes jitters, a fast heartbeat, anxiety and poor sleep. Be careful if you have high blood pressure, a heart condition or are pregnant.',
  },
  {
    title: 'omega 3',
    names: ['omega 3', 'omega-3', 'omega3', 'fish oil'],
    what: 'Omega 3 are healthy fats (EPA and DHA) found in oily fish like salmon and sardines, and in fish oil capsules.',
    benefits: ['Good for your heart and blood fats', 'May reduce joint stiffness and soreness', 'Supports your brain and eyes'],
    how: 'Eat oily fish twice a week. If you take capsules, a common amount is 250 to 500 mg of EPA and DHA a day with a meal.',
    caution: 'Fish oil can cause fishy burps and loose stools. Ask a doctor first if you take blood thinners or have a bleeding problem.',
  },
  {
    title: 'vitamin d',
    names: ['vitamin d', 'vitamin d3', 'vit d'],
    what: 'Vitamin D helps your body absorb calcium and keep bones strong. Your skin makes it from sunlight.',
    benefits: ['Stronger bones and teeth', 'Supports muscle function', 'Supports your immune system'],
    how: 'Sunlight on your arms and face for 10 to 15 minutes a few times a week helps, and eggs, fish and fortified milk give a little. Many adults take 600 to 2000 IU a day if they are low. The upper safe limit is 4000 IU a day. A blood test is the best way to know your level.',
    caution: 'Very high doses build up and can cause too much calcium in the blood, with nausea, weakness and kidney problems. Do not take large doses without a doctor.',
  },
  {
    title: 'multivitamin',
    names: ['multivitamin', 'vitamin', 'vitamins'],
    what: 'A multivitamin is a pill with many vitamins and minerals in small amounts.',
    benefits: ['Fills small gaps if your diet is limited', 'Convenient for busy days', 'Cheap and widely available'],
    how: 'Take one a day with food. It does not replace vegetables, fruit and a balanced diet.',
    caution: 'More is not better. Do not double up with other vitamin or mineral supplements, and ask a doctor if you are pregnant or take medicine.',
  },
  {
    title: 'vitamin c',
    names: ['vitamin c', 'vit c'],
    what: 'Vitamin C is an antioxidant that helps your immune system, makes collagen and helps you absorb iron.',
    benefits: ['Supports your immune system', 'Helps skin, gums and joints stay healthy', 'Helps you absorb iron from plant foods'],
    how: 'Food is usually enough: oranges, lemon, guava, kiwi, capsicum and tomatoes. Adults need about 75 to 90 mg a day. The upper limit is 2000 mg a day.',
    caution: 'Large doses can cause stomach upset and loose stools.',
  },
  {
    title: 'magnesium',
    names: ['magnesium'],
    what: 'Magnesium is a mineral that your muscles, nerves and energy system need.',
    benefits: ['Supports muscle and nerve function', 'May improve sleep if you are low in it', 'Helps your body make energy'],
    how: 'Food sources are nuts, seeds, spinach, banana, oats and whole grains. If you take a supplement, a common amount is 200 to 400 mg a day with food.',
    caution: 'High doses can cause diarrhea. People with kidney disease should ask a doctor first.',
  },
  {
    title: 'zinc',
    names: ['zinc'],
    what: 'Zinc is a mineral that supports your immune system, wound healing and hormones.',
    benefits: ['Supports immunity', 'Helps wounds heal', 'Needed for normal hormone production'],
    how: 'Adults need about 8 to 11 mg a day. Meat, eggs, chickpeas, pumpkin seeds and dairy are good sources. Do not take more than 40 mg a day from supplements.',
    caution: 'Too much can cause nausea and, over time, lower your copper levels.',
  },
  {
    title: 'iron',
    names: ['iron'],
    what: 'Iron helps your blood carry oxygen to your muscles. Low iron makes you tired and weak.',
    benefits: ['Prevents tiredness caused by low iron', 'Supports energy and endurance', 'Needed for healthy blood'],
    how: 'Good sources are red meat, liver, daal, chana, spinach and dates. Eat them with vitamin C (lemon or orange) to absorb more. Take iron tablets only if a blood test shows you are low.',
    caution: 'Too much iron is harmful and can cause constipation and stomach pain. Keep iron tablets away from children.',
  },
  {
    title: 'calcium',
    names: ['calcium'],
    what: 'Calcium is a mineral that builds bones and teeth and helps muscles contract.',
    benefits: ['Strong bones and teeth', 'Helps muscles and nerves work', 'Lowers the risk of bone loss later in life'],
    how: 'Adults need about 1000 mg a day. Milk, yogurt, cheese, almonds and leafy greens are good sources. Use food first, and take tablets only if a doctor advises it.',
    caution: 'Too much from supplements can cause constipation and kidney stones.',
  },
  {
    title: 'collagen',
    names: ['collagen'],
    what: 'Collagen is a protein found in your skin, joints, bones and tendons. Supplements are made from animal or fish sources.',
    benefits: ['May improve skin elasticity a little', 'May ease joint discomfort for some people', 'Adds some protein to your day'],
    how: 'A common amount is 5 to 15 g a day, mixed into a drink. It is not a complete protein, so it does not replace whey or food protein.',
    caution: 'The proof is still limited, so expect modest results. Avoid it if you are allergic to fish or shellfish products.',
  },
  {
    title: 'mass gainer',
    names: ['mass gainer', 'weight gainer', 'gainer'],
    what: 'A mass gainer is a high calorie powder with protein and a lot of carbs. One serving can have 500 to 1200 calories.',
    benefits: ['Easy way to add calories if you struggle to gain weight', 'Quick to drink after training', 'Convenient when you do not feel like eating'],
    how: 'Take one serving between meals or after training. Start with half a serving to check how your stomach handles it. A home shake works too: milk, banana, oats and peanut butter.',
    caution: 'Many gainers are full of sugar, and the extra weight can be mostly fat if you do not train hard. They can cause bloating.',
  },
  {
    title: 'electrolytes',
    names: ['electrolyte', 'electrolytes', 'ors'],
    what: 'Electrolytes are minerals like sodium, potassium and magnesium. You lose them in sweat.',
    benefits: ['Help you rehydrate after long or hot sessions', 'May reduce cramps from heavy sweating', 'Keep your muscles and nerves working normally'],
    how: 'For normal workouts under an hour, water is enough. For long, hot sessions use ORS or an electrolyte drink, or water with a pinch of salt, lemon and a little sugar.',
    caution: 'Many sports drinks are high in sugar. People with high blood pressure or kidney disease should check with a doctor before adding extra salt.',
  },
  {
    title: 'glutamine',
    names: ['glutamine'],
    what: 'Glutamine is an amino acid that your body makes and also gets from protein foods.',
    benefits: ['May help your gut and immune system during very hard training', 'May reduce soreness slightly'],
    how: 'A common amount is 5 g a day. If you eat enough protein you already get plenty, so it is not needed for most people.',
    caution: 'It is generally safe, but the proof for muscle gain is weak. Your money is better spent on food and whey.',
  },
  {
    title: 'fat burner',
    names: ['fat burner', 'fat burners', 'l-carnitine', 'l carnitine', 'carnitine', 'weight loss pills', 'slimming pills'],
    what: 'Fat burners are pills or powders that claim to melt fat. Most are mainly caffeine and herbal stimulants. They do not work like magic.',
    benefits: ['A small boost in energy and appetite control at best'],
    how: 'Real fat loss comes from eating slightly fewer calories than you burn, strength training, walking and good sleep.',
    caution: 'They can cause jitters, a fast heartbeat, anxiety and poor sleep, and some products have hidden or unsafe ingredients. Avoid them if you have heart problems, high blood pressure or are pregnant, and ask a doctor first.',
    howChip: 'How to lose weight?',
  },
  {
    title: 'steroids',
    names: ['steroid', 'steroids', 'sarm', 'sarms', 'anabolic'],
    what: 'Anabolic steroids and SARMs are drugs that act like the hormone testosterone. They are not supplements and I do not recommend them.',
    caution: 'They can damage your heart, liver and hormones, cause acne, mood swings and low fertility, and many are illegal without a prescription. Real, lasting results come from training, enough food and sleep. If you are thinking about them, please speak to a doctor first.',
    howChip: null,
  },
  {
    title: 'supplements',
    names: ['supplement', 'supplements', 'best supplement', 'best supplements'],
    what: 'Supplements fill gaps. They are not magic and cannot replace good food, sleep and training.',
    benefits: [
      'Protein powder: an easy way to reach your protein target',
      'Creatine: well researched for strength and muscle',
      'Caffeine: a small boost to energy and performance',
      'Vitamin D or omega 3: only if your diet or a blood test shows a need',
    ],
    how: 'Fix food, sleep and training first. Choose products tested by a third party, start one at a time and read the label. Be careful with BCAAs, fat burners and testosterone boosters because the proof is weak or the risks are real.',
    caution: 'Check with a doctor first if you are pregnant, under 18, take medicine or have a health condition.',
    howChip: 'How to choose supplements',
  },
  {
    title: 'fiber',
    names: ['fiber', 'fibre'],
    what: 'Fiber is the part of plant foods that your body does not digest. It keeps your gut healthy.',
    benefits: ['Better digestion and less constipation', 'Keeps you full, which helps with weight control', 'Helps control blood sugar and cholesterol'],
    how: 'Aim for about 25 to 30 g a day. Good sources are oats, daal, chana, vegetables, fruit, whole wheat roti and chia seeds. Add it slowly and drink more water.',
    caution: 'Adding a lot of fiber suddenly can cause gas and bloating.',
  },
  {
    title: 'carbs',
    names: ['carbs', 'carb', 'carbohydrate', 'carbohydrates'],
    data: true,
    what: 'Carbohydrates are your main source of energy. Your body turns them into glucose and stores some in your muscles for training.',
    benefits: ['Fuel for hard training and your brain', 'Help refill muscle energy after a workout', 'Whole food carbs also give fiber and vitamins'],
    how: 'Active people often need about 3 to 7 g per kg of body weight a day, depending on training. Choose oats, roti, rice, potatoes, fruit and daal more often than sweets and soft drinks.',
    caution: 'Too many refined carbs like sugar, white bread and sweet drinks can lead to extra weight and energy crashes.',
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
  },
  {
    title: 'healthy fats',
    names: ['fats', 'healthy fat', 'healthy fats', 'good fat', 'good fats', 'dietary fat'],
    data: true,
    what: 'Fats are a nutrient that gives you energy, helps you absorb vitamins A, D, E and K and supports your hormones.',
    benefits: ['Support hormones and brain health', 'Help you absorb important vitamins', 'Keep you full and satisfied'],
    how: 'About 20 to 35 percent of your calories can come from fat. Choose nuts, seeds, olive oil, fish, eggs and avocado. Fat has 9 calories per gram, so portions matter.',
    caution: 'Limit deep fried food, bakery items and too much ghee or butter.',
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
  },
  {
    title: 'macros',
    names: ['macros', 'macro', 'macronutrients', 'macronutrient'],
    data: true,
    what: 'Macros are protein, carbs and fats. They are the three nutrients that give you calories: protein and carbs have 4 calories per gram, fat has 9.',
    benefits: ['Tracking them shows what your calories are made of', 'Helps you plan for fat loss or muscle gain', 'Makes it easier to eat enough protein'],
    how: 'A simple starting split is about 25 to 30 percent protein, 40 to 50 percent carbs and 20 to 30 percent fat. Log your meals in Nutrition and FitTrack adds it all up for you.',
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
    howChip: 'How much protein',
  },
  {
    title: 'calories',
    names: ['calorie', 'calories', 'kcal'],
    data: true,
    what: 'A calorie is a unit of energy. Food gives you calories and your body burns them every day just to live and move.',
    benefits: ['Eating below what you burn leads to fat loss', 'Eating above it supports muscle gain', 'Eating about the same keeps your weight steady'],
    how: 'Your daily need depends on your age, weight, height and activity. Log your meals for a week to see your real average.',
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
    howChip: null,
  },
  {
    title: 'metabolism',
    names: ['metabolism', 'bmr', 'tdee', 'metabolic rate'],
    what: 'Metabolism is how your body turns food into energy. BMR is the calories you burn at rest, and TDEE is your total daily burn including activity.',
    benefits: ['Building muscle raises the calories you burn at rest', 'Daily walking and movement add a lot to your burn', 'Enough protein and sleep help keep it healthy'],
    how: 'There is no magic trick to speed it up. Lift weights, walk daily, eat enough protein, sleep well and avoid crash diets that slow you down.',
    howChip: null,
  },
  {
    title: 'intermittent fasting',
    howChip: null,
    names: ['intermittent fasting', 'fasting', '16:8'],
    what: 'Intermittent fasting means eating only in a set time window, for example 8 hours, and fasting for the other 16 (called 16:8).',
    benefits: ['Can make it easier to eat fewer calories', 'Simple rules suit some people', 'Works about as well as other diets when calories are equal'],
    how: 'Start with a 12 hour gap and slowly build up. Break your fast with a meal that has protein, and drink water, tea or black coffee during the fast.',
    caution: 'Not suitable if you are pregnant, under 18, diabetic on medicine or have had an eating disorder. Stop if you feel dizzy or weak.',
  },
  {
    title: 'keto',
    names: ['keto', 'ketogenic', 'low carb'],
    what: 'The keto diet is very low in carbs and high in fat, so your body burns fat for fuel.',
    benefits: ['Can cause quick early weight loss', 'May reduce hunger for some people'],
    how: 'It usually means under 50 g of carbs a day. Many people find it hard to stick to and it can reduce training performance.',
    caution: 'You may get headaches, tiredness and bad breath at first. Ask a doctor before trying it if you have diabetes, kidney, liver or heart problems or are pregnant.',
    howChip: null,
  },
  {
    title: 'progressive overload',
    names: ['progressive overload', 'overload'],
    what: 'Progressive overload means slowly making your training harder over time so your body keeps adapting.',
    benefits: ['The main reason muscles and strength keep growing', 'Stops you getting stuck at the same level', 'Easy to track in your workout log'],
    how: 'Each week try one small step: add a little weight, one more rep, one more set or slow down the lowering part. Log your sets in Workouts to see the progress.',
    links: [{ label: 'Open workouts', to: '/workouts' }],
    howChip: 'How to do progressive overload',
  },
  {
    title: 'sets and reps',
    names: ['sets and reps', 'reps and sets', 'rep range', 'repetitions', 'how many reps', 'how many sets', 'what is a rep', 'what is a set'],
    what: 'A rep is one full movement of an exercise. A set is a group of reps done back to back.',
    benefits: ['1 to 5 reps with heavy weight builds strength', '6 to 12 reps is the classic range for muscle growth', '12 to 20 reps trains muscular endurance'],
    how: 'Most people do 2 to 4 sets per exercise and rest 1 to 3 minutes between sets. Choose a weight that makes the last 2 reps hard but still clean.',
    howChip: null,
  },
  {
    title: 'plateau',
    names: ['plateau', 'weight loss plateau', 'not losing weight', 'not gaining weight', 'weight is stuck', 'stuck weight'],
    what: 'A plateau is when your weight or strength stops changing for a few weeks. It is normal and happens to everyone.',
    how: 'Try these: 1) Log your food honestly for a week. 2) Check your protein and sleep. 3) Change your routine or add a little weight or a short walk each day. 4) Give a change 2 to 3 weeks before judging it. Weight also moves with water and salt, so look at the trend, not one day.',
    links: [{ label: 'Open progress', to: '/progress' }],
    howChip: null,
  },
  {
    title: 'body fat percentage',
    names: ['body fat percentage', 'fat percentage', 'body fat percent'],
    what: 'Body fat percentage is how much of your weight is fat. As a rough guide, healthy ranges are about 10 to 20 percent for men and 18 to 28 percent for women.',
    how: 'You can estimate it with skinfold calipers, a smart scale or a DEXA scan. Each method gives slightly different numbers, so use the same one every time and watch the trend. Add it in Progress.',
    links: [{ label: 'Open progress', to: '/progress' }],
    howChip: null,
  },
  {
    title: 'cheat meal',
    names: ['cheat meal', 'cheat day', 'junk food'],
    what: 'A cheat meal is a planned treat that is not part of your normal diet.',
    benefits: ['Makes a diet easier to stick to', 'Helps you enjoy food and social life', 'One meal does not undo your progress'],
    how: 'Keep it to one meal, not a whole day, enjoy it, and go back to your normal plan at the next meal. Eating well about 80 percent of the time is a good balance.',
    howChip: null,
  },
  {
    title: 'hiit',
    names: ['hiit', 'high intensity interval training', 'interval training'],
    what: 'HIIT is high intensity interval training: short, hard bursts of effort followed by short rests.',
    benefits: ['Saves time, a session can be 15 to 20 minutes', 'Burns calories and keeps your heart strong', 'Can be done at home with no equipment'],
    how: 'Try 30 seconds hard and 30 to 60 seconds easy for 8 to 10 rounds, such as sprints, burpees or skipping. Do it 1 to 2 times a week with rest days in between.',
    caution: 'Build a base with walking and basic training first. Skip HIIT and ask a doctor if you have a heart condition, and stop if you feel dizzy or have chest pain.',
    howChip: 'How to do HIIT',
  },
  {
    title: 'squat',
    names: ['squat', 'squats'],
    what: 'The squat is a basic leg exercise that trains your thighs, glutes and core.',
    benefits: ['Builds strong legs and glutes', 'Works your core and back to keep you stable', 'Helps everyday moves like standing up and climbing stairs'],
    how: 'Stand with your feet shoulder width apart, chest up and core tight. Push your hips back and bend your knees until your thighs are about parallel to the floor. Keep your knees in line with your toes and press through your heels to stand. Start with body weight and add weight slowly.',
    caution: 'Stop if you feel sharp knee or back pain. Do not round your lower back, and use a spotter or safety bars with heavy weights.',
    links: [{ label: 'Open workouts', to: '/workouts' }],
    howChip: 'How to do squat',
  },
  {
    title: 'deadlift',
    names: ['deadlift', 'deadlifts'],
    what: 'The deadlift lifts a weight from the floor to hip height. It trains your back, glutes, hamstrings and grip.',
    benefits: ['Builds total body strength', 'Strengthens your back and hips', 'Improves your grip'],
    how: 'Stand with the bar over your mid foot, hinge at the hips and grip the bar. Keep your back flat, chest up and the bar close to your legs. Push the floor away and stand tall, then lower the bar with control. Start light to learn the form.',
    caution: 'A rounded back under heavy weight is the common cause of injury. Keep the weight light until your form is solid.',
    links: [{ label: 'Open workouts', to: '/workouts' }],
    howChip: 'How to do deadlift',
  },
  {
    title: 'bench press',
    names: ['bench press', 'bench'],
    what: 'The bench press works your chest, shoulders and triceps.',
    benefits: ['Builds upper body strength', 'Develops chest, shoulders and arms', 'Easy to add weight step by step'],
    how: 'Lie on the bench with your feet flat, shoulder blades pulled back and eyes under the bar. Lower the bar to your mid chest with control, then press it up. Keep your wrists straight and wrap your thumbs around the bar.',
    caution: 'Use a spotter or safety arms with heavy weights.',
    links: [{ label: 'Open workouts', to: '/workouts' }],
    howChip: 'How to do bench press',
  },
  {
    title: 'push up',
    names: ['push up', 'push ups', 'pushup', 'pushups'],
    what: 'The push up is a body weight exercise for your chest, shoulders, triceps and core.',
    benefits: ['No equipment needed', 'Builds upper body strength', 'Trains your core at the same time'],
    how: 'Put your hands slightly wider than your shoulders and keep your body in a straight line from head to heels. Lower your chest close to the floor, then push back up. Too hard? Do it with your knees on the floor or your hands on a bench.',
    howChip: 'How to do push up',
  },
  {
    title: 'plank',
    names: ['plank', 'planks'],
    what: 'The plank is a hold that trains your core, shoulders and back.',
    benefits: ['Builds a strong core', 'Supports good posture', 'Easy on the joints and needs no equipment'],
    how: 'Rest on your forearms and toes with your body in a straight line. Squeeze your stomach and glutes, keep your hips level and breathe. Start with 20 to 30 seconds and build up to a minute.',
    caution: 'Stop if your lower back sags or hurts.',
    howChip: 'How to do plank',
  },
  {
    title: 'pull up',
    names: ['pull up', 'pull ups', 'pullup', 'pullups', 'chin up'],
    what: 'The pull up is a body weight exercise for your back, biceps and grip.',
    benefits: ['Builds a strong, wide back', 'Strengthens your arms and grip', 'Needs only a bar'],
    how: 'Hang with your palms facing away, pull your chest toward the bar by driving your elbows down, then lower slowly. If you cannot do one yet, use a resistance band, an assisted machine or slow lowering from the top.',
    howChip: 'How to do pull up',
  },
]

const cue = /\b(what is|what are|what's|whats|what does|benefit|benefits|advantage|advantages|good for|side effect|side effects|safe|harmful|harm|danger|dangerous|risk|risks|how to take|how to use|how to do|how to perform|how to choose|how much|dose|dosage|when to take|best time|timing|technique|proper form|explain|tell me about|define|meaning|difference|kya hai|kya hota|fayde|faida|nuksan|kitna)\b/
const cautionCue = /\b(side effect|side effects|harmful|harm|danger|dangerous|risk|risks|safe|safety|nuksan)\b/
const howCue = /\b(how to take|how to use|how to do|how to perform|how to choose|how much|dose|dosage|when to take|best time|timing|technique|proper form|kitna)\b/
const benefitCue = /\b(benefit|benefits|advantage|advantages|good for|fayde|faida)\b/
const personal = /\b(my|today|yesterday|this week|i ate|i eat|did i|have i)\b/

const aspectOf = (query) => {
  if (cautionCue.test(query)) return 'caution'
  if (howCue.test(query)) return 'how'
  if (benefitCue.test(query)) return 'benefits'
  return 'what'
}

const bullets = (list) => list.map((item) => `- ${item}`)

const chipsOf = (topic) =>
  [
    topic.benefits && topic.benefits.length > 1 ? `Benefits of ${topic.title}` : null,
    topic.how ? (topic.howChip === undefined ? `How much ${topic.title}` : topic.howChip) : null,
    topic.caution ? `${topic.title} side effects` : null,
  ]
    .filter(Boolean)
    .slice(0, 3)

const replyOf = (topic) => (user, query) => {
  const aspect = aspectOf(query)
  let lines

  if (aspect === 'caution' && topic.caution) {
    lines = [topic.caution]
  } else if (aspect === 'how' && topic.how) {
    lines = [topic.how]
  } else if (aspect === 'benefits' && topic.benefits) {
    lines = [`Benefits of ${topic.title}:`, ...bullets(topic.benefits)]
  } else {
    lines = [topic.what]
    if (topic.benefits) lines.push('Benefits:', ...bullets(topic.benefits.slice(0, 3)))
    if (topic.caution) lines.push(topic.caution)
  }

  return { text: lines.join('\n'), links: topic.links || [], next: chipsOf(topic) }
}

export const knowledgeIntents = topics.map((topic) => ({
  score: (query) => {
    if (topic.data && personal.test(query)) return 0

    const hits = topic.names.filter((name) => new RegExp(`\\b${name}s?\\b`).test(query))
    if (hits.length === 0) return 0

    return Math.max(...hits.map((name) => name.length)) + (cue.test(query) ? 25 : 0)
  },
  reply: replyOf(topic),
}))
