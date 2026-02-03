export interface Question {
    id: number;
    text: string;
    imageUrl?: string;
    options: {
        text: string;
        value: string;
    }[];
}

export interface Result {
    type: string;
    title: string;
    description: string;
    imageGradient: string;
    analysis?: string; // Deep psychological breakdown
    advice?: string[]; // Actionable bullet points
    relatedArticleSlug?: string; // Link to keep user on site
}

export interface Test {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    questions: Question[];
    results: Result[];
    difficulty?: "Beginner" | "Intermediate" | "Expert";
    nextTestSlug?: string;
}

export const allTests: Test[] = [
    {
        id: "1",
        slug: "multiple-intelligences",
        title: "Dominant Intelligence Type",
        description: "Are you Visually, Linguistically, Logically, or Kinesthetically inclined?",
        imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1,
                text: "When learning something new, you prefer to:",
                imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Look at diagrams, charts, or pictures.", value: "visual" },
                    { text: "Read about it or listen to an explanation.", value: "linguistic" },
                    { text: "Analyze the logic or patterns behind it.", value: "logical" },
                    { text: "Try it out with your hands.", value: "kinesthetic" },
                ]
            },
            {
                id: 2,
                text: "In your free time, you are most likely to:",
                imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Draw, paint, or play video games.", value: "visual" },
                    { text: "Read a book or write in a journal.", value: "linguistic" },
                    { text: "Solve puzzles, play chess, or code.", value: "logical" },
                    { text: "Play sports, dance, or build things.", value: "kinesthetic" },
                ]
            },
            {
                id: 3,
                text: "You are best at remembering:",
                imageUrl: "https://loremflickr.com/800/600/memory",
                options: [
                    { text: "Faces and places.", value: "visual" },
                    { text: "Names, dates, and trivia.", value: "linguistic" },
                    { text: "Numbers and formulas.", value: "logical" },
                    { text: "How to do something physical (muscle memory).", value: "kinesthetic" },
                ]
            },
            {
                id: 4,
                text: "When you have a problem to solve, you:",
                imageUrl: "https://loremflickr.com/800/600/solve",
                options: [
                    { text: "Visualize the solution in your head.", value: "visual" },
                    { text: "Talk it through with someone.", value: "linguistic" },
                    { text: "Make a list or a pros/cons chart.", value: "logical" },
                    { text: "Move around or go for a walk while thinking.", value: "kinesthetic" },
                ]
            },
            {
                id: 5,
                text: "Which career path sounds most appealing?",
                imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Architect, Designer, or Photographer.", value: "visual" },
                    { text: "Writer, Journalist, or Lawyer.", value: "linguistic" },
                    { text: "Scientist, Engineer, or Financial Analyst.", value: "logical" },
                    { text: "Athlete, Surgeon, or Actor.", value: "kinesthetic" },
                ]
            },
            {
                id: 6,
                text: "If you were to explain a concept to a friend, you would:",
                imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Draw them a sketch.", value: "visual" },
                    { text: "Send them an article or write a long message.", value: "linguistic" },
                    { text: "Create a flowchart or equation.", value: "logical" },
                    { text: "Show them how it works practically.", value: "kinesthetic" },
                ]
            },
            {
                id: 7,
                text: "Which type of game do you prefer?",
                imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Pictionary or Jigsaw Puzzles.", value: "visual" },
                    { text: "Scrabble or Crosswords.", value: "linguistic" },
                    { text: "Sudoku or Strategy Games.", value: "logical" },
                    { text: "Charades or Sports.", value: "kinesthetic" },
                ]
            },
            {
                id: 8,
                text: "You feel most accomplished when you:",
                imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Create something beautiful.", value: "visual" },
                    { text: "Write something persuasive or poetic.", value: "linguistic" },
                    { text: "Solve a difficult problem.", value: "logical" },
                    { text: "Master a new physical skill.", value: "kinesthetic" },
                ]
            }
        ],
        results: [
            {
                type: "visual",
                title: "Visual-Spatial Intelligence",
                description: "You think in pictures. You have a great sense of direction, appreciate art, and visualizing 3D objects is second nature to you.",
                imageGradient: "from-pink-500 to-rose-500",
                analysis: "You possess a rare ability to visualize the world in your mind's eye. Where others see words or numbers, you see shapes, colors, and dimensions. This gift allows you to solve complex spatial problems and think outside the linear box.",
                advice: [
                    "Use mind maps instead of linear notes.",
                    "Color-code your tasks to improve memory retention.",
                    "Take breaks to doodle or sketch when you feel stuck."
                ],
                relatedArticleSlug: "creative-flow-state"
            },
            {
                type: "linguistic",
                title: "Linguistic-Verbal Intelligence",
                description: "Words are your superpower. You excel at reading, writing, and speaking, explaining complex concepts with ease.",
                imageGradient: "from-blue-500 to-cyan-500",
                analysis: "Your world is built on language. You have a deep appreciation for the nuance of words and the power of storytelling. You are likely the person others turn to when they need to articulate a difficult feeling or concept.",
                advice: [
                    "Keep a daily journal to sharpen your articulation.",
                    "Read widely outside your comfort zone to expand your vocabulary.",
                    "Try teaching a concept to someone else to master it."
                ],
                relatedArticleSlug: "power-of-language"
            },
            {
                type: "logical",
                title: "Logical-Mathematical Intelligence",
                description: "You see the world in patterns and logic. You are excellent at critical thinking, analyzing data, and solving puzzles.",
                imageGradient: "from-emerald-500 to-teal-500",
                analysis: "You are the anchor of reason in a chaotic world. Your mind seeks patterns, cause-and-effect relationships, and logical consistency. You don't just guess; you calculate, creating a solid foundation for your decisions.",
                advice: [
                    "Apply 'First Principles Thinking' to break down complex problems.",
                    "Learn a new system or programming language to challenge your logic.",
                    "Practice meditation to balance your analytical mind with intuition."
                ],
                relatedArticleSlug: "quantum-computing-power"
            },
            {
                type: "kinesthetic",
                title: "Bodily-Kinesthetic Intelligence",
                description: "You learn by doing. You process information best when you can physically interact with it. You likely have great coordination.",
                imageGradient: "from-orange-500 to-amber-500",
                analysis: "You encompass 'Intelligence in Motion'. Your body is your primary instrument for understanding the world. You possess a physical intuition that allows you to master skills through muscle memory and direct experience.",
                advice: [
                    "Incorporate movement into your learning (e.g., walk while thinking).",
                    "Trust your 'gut feeling'—it's often your somatic intelligence speaking.",
                    "Take up a craft that requires fine motor skills."
                ],
                relatedArticleSlug: "ultramarathon-mind-running"
            },
        ]
    },
    // --- SPACE SERIES LEVEL 1 ---
    {
        id: "space-level-1",
        slug: "space-cadet-basics",
        title: "Space Cadet: Level 1",
        description: "Start your journey into the cosmos. Do you know the basics of our Solar System?",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        difficulty: "Beginner",
        nextTestSlug: "space-explorer-personality",
        questions: [
            {
                id: 1,
                text: "Which planet is closest to the Sun?",
                imageUrl: "https://images.unsplash.com/photo-1614730341194-75c6074065db?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Venus", value: "wrong" },
                    { text: "Mercury", value: "correct" },
                    { text: "Mars", value: "wrong" },
                    { text: "Earth", value: "wrong" }
                ]
            },
            {
                id: 2,
                text: "What is the name of our galaxy?",
                imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Andromeda", value: "wrong" },
                    { text: "The Milky Way", value: "correct" },
                    { text: "Triangulum", value: "wrong" },
                    { text: "Whirlpool", value: "wrong" }
                ]
            },
            {
                id: 3,
                text: "Which celestial body controls Earth's tides?",
                imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "The Sun", value: "wrong" },
                    { text: "The Moon", value: "correct" },
                    { text: "Mars", value: "wrong" },
                    { text: "Jupiter", value: "wrong" }
                ]
            }
        ],
        results: [
            {
                type: "correct",
                title: "Ready for Launch!",
                description: "You know your basics perfectly. You are ready to explore deeper.",
                imageGradient: "from-blue-400 to-indigo-600",
                analysis: "You have a solid foundation of astronomical knowledge. You understand our immediate neighborhood in space.",
                advice: ["Look up at the night sky more often.", "Download a star chart app.", "Proceed to Level 2!"],
                relatedArticleSlug: "future-of-space-tourism"
            },
            {
                type: "wrong",
                title: "Ground Control to Major Tom...",
                description: "Looks like you need a bit more training before launch.",
                imageGradient: "from-gray-600 to-slate-800",
                analysis: "Space is vast and confusing, but don't worry. Everyone starts somewhere.",
                advice: ["Read our beginner guide to the solar system.", "Watch a space documentary.", "Try again!"],
                relatedArticleSlug: "future-of-space-tourism"
            }
        ]
    },
    {
        id: "2",
        slug: "space-explorer-personality",
        title: "Space Explorer: Level 2",
        description: "Which type of Space Explorer are you? (Intermediate Level)",
        imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000",
        difficulty: "Intermediate",
        nextTestSlug: "space-expert-astrophysics",
        questions: [
            {
                id: 1,
                text: "Your approach to a new adventure is:",
                imageUrl: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Planning every detail meticulously.", value: "apollo" },
                    { text: "Just going and figuring it out on the way.", value: "spacex" },
                    { text: "Traveling alone and going as far as possible.", value: "voyager" },
                    { text: "Observing from a safe distance first.", value: "hubble" },
                ]
            },
            {
                id: 2,
                text: "What drives you most in life?",
                imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Legacy and making history.", value: "apollo" },
                    { text: "Innovation and breaking the status quo.", value: "spacex" },
                    { text: "Curiosity and seeing what no one has seen.", value: "voyager" },
                    { text: "Understanding the deeper truth of things.", value: "hubble" },
                ]
            },
            {
                id: 3,
                text: "How do you handle failure?",
                imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Failure is not an option; we train to avoid it.", value: "apollo" },
                    { text: "Fail fast, learn faster, try again.", value: "spacex" },
                    { text: "Keep drifting; failure is just a change of course.", value: "voyager" },
                    { text: "Analyze the data to understand why it happened.", value: "hubble" },
                ]
            },
            {
                id: 4,
                text: "Your ideal team dynamic is:",
                imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "A disciplined, highly trained crew.", value: "apollo" },
                    { text: "A chaotic but brilliant group of distinct individuals.", value: "spacex" },
                    { text: "I work better alone.", value: "voyager" },
                    { text: "A quiet group of researchers and thinkers.", value: "hubble" },
                ]
            },
            {
                id: 5,
                text: "Pick a view:",
                imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Earthrise from the Moon.", value: "apollo" },
                    { text: "A colonized Mars city.", value: "spacex" },
                    { text: "The pale blue dot in the vast darkness.", value: "voyager" },
                    { text: "A colorful nebula billions of light years away.", value: "hubble" },
                ]
            },
            {
                id: 6,
                text: "What is your biggest fear?",
                imageUrl: "https://images.unsplash.com/photo-1481325545291-94394fe1cf95?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Letting others down.", value: "apollo" },
                    { text: "Stagnation and boredom.", value: "spacex" },
                    { text: "Being forgotten.", value: "voyager" },
                    { text: "Being blind to the truth.", value: "hubble" },
                ]
            },
            {
                id: 7,
                text: "Your preferred tool:",
                imageUrl: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "A reliable, analog checklist.", value: "apollo" },
                    { text: "A 3D printer or experimental tech.", value: "spacex" },
                    { text: "A camera and a notebook.", value: "voyager" },
                    { text: "A powerful telescope or microscope.", value: "hubble" },
                ]
            },
            {
                id: 8,
                text: "The future of humanity is:",
                imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Safe if we are disciplined.", value: "apollo" },
                    { text: "Multi-planetary.", value: "spacex" },
                    { text: "A mystery waiting to be explored.", value: "voyager" },
                    { text: "Dependent on our understanding of the universe.", value: "hubble" },
                ]
            }
        ],
        results: [
            {
                type: "apollo",
                title: "The Apollo Soul",
                description: "You are the embodiment of courage and discipline. You believe in preparation, teamwork, and achieving the impossible through sheer will and training. You are a natural leader.",
                imageGradient: "from-slate-500 to-gray-700",
                analysis: "You are the backbone of any successful mission. While others dream of the destination, you focus on the journey's safety and success. You understand that true heroism is often found in the quiet discipline of preparation.",
                advice: [
                    "Take charge of a project that requires detailed planning.",
                    "Mentor someone who has raw talent but lacks discipline.",
                    "Don't forget to look up from the checklist and admire the view."
                ],
                relatedArticleSlug: "james-webb-discoveries"
            },
            {
                type: "voyager",
                title: "The Voyager Spirit",
                description: "You are a lone wolf and an eternal wanderer. You value freedom above all else. You are comfortable venturing into the unknown, driven by pure curiosity rather than a destination.",
                imageGradient: "from-indigo-500 to-purple-900",
                analysis: "You carry the spirit of the ancient explorers. The 'Pale Blue Dot' is not enough for you; you feel the pull of the cosmic ocean. You are comfortable with solitude because the universe keeps you company.",
                advice: [
                    "Plan a solo trip to a place you've never been.",
                    "Start learning about astronomy or astrophysics.",
                    "Practice mindfulness to ground yourself when you feel too drifted."
                ],
                relatedArticleSlug: "travel-trans-siberian-railway-journey"
            },
            {
                type: "spacex",
                title: "The SpaceX Visionary",
                description: "You are a disruptor. You don't just want to see the future; you want to build it. You take risks, embrace chaos, and believe that if you aren't failing occasionally, you aren't trying hard enough.",
                imageGradient: "from-red-600 to-orange-600",
                analysis: "You are a catalyst for change. You look at the impossible and see it as a mere engineering challenge. You are not afraid to break a few eggs (or rockets) to make an omelet. Your energy is infectious.",
                advice: [
                    "Identify one 'impossible' goal and break it down into steps.",
                    "Surround yourself with people who challenge your ideas.",
                    "Accept failure as data, not as a defeat."
                ],
                relatedArticleSlug: "tech-neuralink-brain-interface"
            },
            {
                type: "hubble",
                title: "The Hubble Analyst",
                description: "You are the silent observer. While others rush, you watch and analyze. You see beauty and patterns that others miss. Your wisdom comes from deep contemplation and a broad perspective.",
                imageGradient: "from-blue-700 to-cyan-400",
                analysis: "You see what others miss. Your strength lies in your ability to synthesize vast amounts of information into a coherent picture. You remind us that understanding the universe requires patience and a wide lens.",
                advice: [
                    "Dedicate time to deep reading or research on a specific topic.",
                    "Practice 'systems thinking' in your daily life.",
                    "Share your insights through writing or speaking."
                ],
                relatedArticleSlug: "ai-evolution-path"
            },
        ]
    },
    {
        id: "3",
        slug: "creative-archetype",
        title: "What Is Your Creative Archetype?",
        description: "Identify your artistic soul. Are you a Visionary, a Craftsman, or an Alchemist?",
        imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1,
                text: "Creativity strikes you most often when:",
                imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "You wake up from a vivid dream.", value: "visionary" },
                    { text: "You are working with your hands/tools.", value: "craftsman" },
                    { text: "You successfully combine two unrelated ideas.", value: "alchemist" },
                    { text: "You feel a strong emotion to express.", value: "storyteller" },
                ]
            },
            {
                id: 2,
                text: "Your workspace looks like:",
                imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Chaotic, full of sketches and mood boards.", value: "visionary" },
                    { text: "Organized, with every tool in its place.", value: "craftsman" },
                    { text: "A laboratory of experiments.", value: "alchemist" },
                    { text: "Cozy, filled with books and memories.", value: "storyteller" },
                ]
            },
            {
                id: 3,
                text: "Which material draws you in?",
                imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Light and space.", value: "visionary" },
                    { text: "Wood, metal, or stone.", value: "craftsman" },
                    { text: "Chemicals, code, or mixed media.", value: "alchemist" },
                    { text: "Ink and paper.", value: "storyteller" },
                ]
            },
            {
                id: 4,
                text: "What is the enemy of creativity?",
                imageUrl: "https://loremflickr.com/800/600/creativity",
                options: [
                    { text: "Small-mindedness.", value: "visionary" },
                    { text: "Poor quality or rushing.", value: "craftsman" },
                    { text: "Stagnation.", value: "alchemist" },
                    { text: "Silence.", value: "storyteller" },
                ]
            },
            {
                id: 5,
                text: "Your creative goal is:",
                imageUrl: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "To change how people see the future.", value: "visionary" },
                    { text: "To create something perfect and lasting.", value: "craftsman" },
                    { text: "To transform the mundane into magic.", value: "alchemist" },
                    { text: "To make people feel understood.", value: "storyteller" },
                ]
            },
            {
                id: 6,
                text: "If you were a famous artist, you'd be:",
                imageUrl: "https://loremflickr.com/800/600/artist",
                options: [
                    { text: "Salvador Dalí (Surrealist).", value: "visionary" },
                    { text: "Michelangelo (Master Sculptor).", value: "craftsman" },
                    { text: "Leonardo da Vinci (Inventor/Artist).", value: "alchemist" },
                    { text: "Shakespeare (Dramatist).", value: "storyteller" },
                ]
            },
            {
                id: 7,
                text: "When you get stuck (block), you:",
                imageUrl: "https://loremflickr.com/800/600/block",
                options: [
                    { text: "Meditate or sleep on it.", value: "visionary" },
                    { text: "Just keep working on technical details.", value: "craftsman" },
                    { text: "Try a completely different medium.", value: "alchemist" },
                    { text: "Go out and talk to people.", value: "storyteller" },
                ]
            },
            {
                id: 8,
                text: "Finish the sentence: 'Art is...'",
                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "...a prophecy.'", value: "visionary" },
                    { text: "...discipline.'", value: "craftsman" },
                    { text: "...transformation.'", value: "alchemist" },
                    { text: "...connection.'", value: "storyteller" },
                ]
            }
        ],
        results: [
            {
                type: "visionary",
                title: "The Visionary",
                description: "You live in the future. Your ideas are often ahead of their time. You care less about the 'how' and more about the 'what if'. You are the dreamer who inspires others to look up.",
                imageGradient: "from-violet-500 to-fuchsia-500",
                analysis: "You tap into the collective unconscious. Your ideas seem to come from 'elsewhere'. You are not just making things; you are channeling possibilities. Your challenge is grounding these visions in reality.",
                advice: [
                    "Keep a dream journal to capture subconscious ideas.",
                    "Partner with a 'Craftsman' type to build your visions.",
                    "Don't be afraid to be misunderstood initially."
                ],
                relatedArticleSlug: "creative-flow-state"
            },
            {
                type: "craftsman",
                title: "The Craftsman",
                description: "You find beauty in execution. You believe that if something is worth doing, it is worth doing perfectly. You have immense patience and respect for your tools and materials.",
                imageGradient: "from-amber-600 to-yellow-700",
                analysis: "You are the master of the material world. You understand that creativity is 1% inspiration and 99% perspiration. Your work has a tangible weight and quality that commands respect.",
                advice: [
                    "Focus on mastering one specific tool or technique this month.",
                    "Study the masters of your craft.",
                    "Teach your skill to a beginner to refine your understanding."
                ],
                relatedArticleSlug: "tech-synthetic-biology-coding-life"
            },
            {
                type: "alchemist",
                title: "The Alchemist",
                description: "You are a remixer of reality. You take existing ideas and combine them to create something entirely new. You love experimentation and are not afraid to break things to see how they work.",
                imageGradient: "from-teal-400 to-emerald-600",
                analysis: "You are the bridge between worlds. You can merge science with art, old with new, logic with emotion. Your innovation comes from cross-pollination. You are the ultimate remixer.",
                advice: [
                    "Expose yourself to two completely unrelated fields (e.g., biology and jazz).",
                    "Experiment with materials you've never used before.",
                    "Look for connections where others see separation."
                ],
                relatedArticleSlug: "crispr-genetic-engineering"
            },
            {
                type: "storyteller",
                title: "The Storyteller",
                description: "You deal in emotion. Your medium matters less than the message. You have a deep empathy and a desire to connect human experiences. You make people feel less alone.",
                imageGradient: "from-rose-400 to-red-600",
                analysis: "You are the keeper of the human experience. You understand that facts tell, but stories sell. You have the power to move mountains by moving hearts. Your creativity is deeply empathetic.",
                advice: [
                    "Practice 'active listening' to gather new stories.",
                    "Study the 'Hero's Journey' structure.",
                    "Write a short story about a stranger you saw today."
                ],
                relatedArticleSlug: "norway-fjords-guide"
            },
        ]
    },
    {
        id: "4",
        slug: "ancient-philosophy",
        title: "Which Ancient Philosophy Guides You?",
        description: "Stoic, Epicurean, or Zen? Find the ancient wisdom that matches your modern life.",
        imageUrl: "https://images.unsplash.com/photo-1524901548305-08eeddc35080?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1,
                text: "A bad event happens (e.g., car breaks down). You think:",
                imageUrl: "https://loremflickr.com/800/600/calm",
                options: [
                    { text: "It is out of my control. I will fix it calmly.", value: "stoic" },
                    { text: "How can I minimize the pain of this situation?", value: "epicurean" },
                    { text: "This too shall pass. It is just a moment.", value: "zen" },
                    { text: "I must create meaning from this struggle.", value: "existential" },
                ]
            },
            {
                id: 2,
                text: "The ultimate goal of life is:",
                imageUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Virtue and strength of character.", value: "stoic" },
                    { text: "Pleasure (absence of pain) and friendship.", value: "epicurean" },
                    { text: "Harmony and presence in the now.", value: "zen" },
                    { text: "Authenticity and freedom.", value: "existential" },
                ]
            },
            {
                id: 3,
                text: "Your view on death:",
                imageUrl: "https://loremflickr.com/800/600/death",
                options: [
                    { text: "It is natural. Why fear what we cannot avoid?", value: "stoic" },
                    { text: "When we are here, death is not. Why worry?", value: "epicurean" },
                    { text: "The leaf falls, but the tree remains.", value: "zen" },
                    { text: "It gives urgency and meaning to my choices.", value: "existential" },
                ]
            },
            {
                id: 4,
                text: "Saturday night. You prefer:",
                imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Reading a biography or journaling.", value: "stoic" },
                    { text: "A modest, delicious dinner with close friends.", value: "epicurean" },
                    { text: "Meditation or a quiet walk in nature.", value: "zen" },
                    { text: "A fierce debate at a coffee shop.", value: "existential" },
                ]
            },
            {
                id: 5,
                text: "What angers you?",
                imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "My own lack of discipline.", value: "stoic" },
                    { text: "Unnecessary suffering and drama.", value: "epicurean" },
                    { text: "Attachment to material things.", value: "zen" },
                    { text: "Blind conformity.", value: "existential" },
                ]
            },
            {
                id: 6,
                text: "Pick a quote:",
                imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "'The obstacle is the way.'", value: "stoic" },
                    { text: "'Live in obscurity.' (Avoid fame).", value: "epicurean" },
                    { text: "'When you eat, just eat.'", value: "zen" },
                    { text: "'Existence precedes essence.'", value: "existential" },
                ]
            },
            {
                id: 7,
                text: "Your advice to a friend in a break-up:",
                imageUrl: "https://loremflickr.com/800/600/friend",
                options: [
                    { text: "Respect yourself. Do not let emotions rule you.", value: "stoic" },
                    { text: "Come over, let's treat ourselves to good food.", value: "epicurean" },
                    { text: "Let go. Clinging causes suffering.", value: "zen" },
                    { text: "You are free to reinvent yourself now.", value: "existential" },
                ]
            },
            {
                id: 8,
                text: "What is 'freedom'?",
                imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Freedom from reaction.", value: "stoic" },
                    { text: "Freedom from anxiety.", value: "epicurean" },
                    { text: "Freedom from the ego.", value: "zen" },
                    { text: "Freedom to choose.", value: "existential" },
                ]
            }
        ],
        results: [
            {
                type: "stoic",
                title: "The Stoic",
                description: "You follow the way of Marcus Aurelius. You believe that you cannot control the world, only your reaction to it. You value resilience, logic, and emotional control above all.",
                imageGradient: "from-stone-500 to-slate-600"
            },
            {
                type: "epicurean",
                title: "The Epicurean",
                description: "You are often misunderstood. You don't seek excess, but simple, refined pleasures. You value friendship, good conversation, and a peaceful life free from unnecessary pain.",
                imageGradient: "from-emerald-400 to-green-600"
            },
            {
                type: "zen",
                title: "The Zen Disciple",
                description: "You seek the present moment. You understand that most of our problems are created in our heads. You value simplicity, nature, and the flow of life without resistance.",
                imageGradient: "from-teal-200 to-cyan-400"
            },
            {
                type: "existential",
                title: "The Existentialist",
                description: "You are the architect of your own soul. You believe life has no inherent meaning, so you are free to create your own. You value authenticity and bold choices.",
                imageGradient: "from-rose-900 to-slate-900"
            }
        ]
    },
    {
        id: "5",
        slug: "travel-personality",
        title: "What Kind of Traveler Are You?",
        description: "The world is big. How do you explore it? Adventurer, Culture Buff, or Relaxed Tourist?",
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1,
                text: "You arrive in a new city. First thing you do:",
                imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Rent a scooter and get lost.", value: "adventurer" },
                    { text: "Head straight to the famous museum.", value: "culture" },
                    { text: "Find the best rated café/restaurant.", value: "foodie" },
                    { text: "Check into the hotel and nap.", value: "relaxer" },
                ]
            },
            {
                id: 2,
                text: "What's in your backpack?",
                imageUrl: "https://loremflickr.com/800/600/backpack",
                options: [
                    { text: "Swiss army knife, compass, GoPro.", value: "adventurer" },
                    { text: "Guidebook, camera, local phrasebook.", value: "culture" },
                    { text: "Snacks, water bottle, restaurant list.", value: "foodie" },
                    { text: "Headphones, neck pillow, kindle.", value: "relaxer" },
                ]
            },
            {
                id: 3,
                text: "Ideal accommodation:",
                imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "A tent under the stars or a hostel.", value: "adventurer" },
                    { text: "A historic boutique hotel.", value: "culture" },
                    { text: "Doesn't matter, as long as it's near the market.", value: "foodie" },
                    { text: "All-inclusive resort with a spa.", value: "relaxer" },
                ]
            },
            {
                id: 4,
                text: "A local offers you a strange-looking dish:",
                imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Eat it immediately! Experience!", value: "adventurer" },
                    { text: "Ask about its history/ingredients first.", value: "culture" },
                    { text: "I've already researched it, I know it's good.", value: "foodie" },
                    { text: "Politely decline, stick to safe food.", value: "relaxer" },
                ]
            },
            {
                id: 5,
                text: "Your nightmare trip is:",
                imageUrl: "https://loremflickr.com/800/600/nightmare",
                options: [
                    { text: "A guided bus tour with no freedom.", value: "adventurer" },
                    { text: "A place with no history or art (like a mall).", value: "culture" },
                    { text: "Bad food / expensive tourist traps.", value: "foodie" },
                    { text: "Having to walk 20km a day.", value: "relaxer" },
                ]
            },
            {
                id: 6,
                text: "Choose a destination:",
                imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
                options: [
                    { text: "Patagonia (Hiking/Wilderness).", value: "adventurer" },
                    { text: "Rome or Kyoto (History).", value: "culture" },
                    { text: "Bangkok or Naples (Street Food).", value: "foodie" },
                    { text: "Maldives (Beach/Luxury).", value: "relaxer" },
                ]
            },
            {
                id: 7,
                text: "How do you document the trip?",
                imageUrl: "https://loremflickr.com/800/600/journal",
                options: [
                    { text: "Action cam videos.", value: "adventurer" },
                    { text: "Detailed journal entries.", value: "culture" },
                    { text: "Instagram stories of my meals.", value: "foodie" },
                    { text: "I don't. I just unplug.", value: "relaxer" },
                ]
            },
            {
                id: 8,
                text: "Why do you travel?",
                imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
                options: [
                    { text: "To feel alive and test my limits.", value: "adventurer" },
                    { text: "To understand how others see the world.", value: "culture" },
                    { text: "To taste new flavors.", value: "foodie" },
                    { text: "To escape stress and recharge.", value: "relaxer" },
                ]
            }
        ],
        results: [
            {
                type: "adventurer",
                title: "The Wild Adventurer",
                description: "You don't visit places; you survive them. You seek the thrill of the unknown. A scratched knee or a missed train is just part of the story for you.",
                imageGradient: "from-orange-500 to-red-600"
            },
            {
                type: "culture",
                title: "The Cultural Historian",
                description: "You travel to learn. You treat every city like an open-air museum. You respect traditions, learn the language, and want to know the 'why' behind everything.",
                imageGradient: "from-amber-700 to-brown-900"
            },
            {
                type: "foodie",
                title: "The Gastronomer",
                description: "Your map is made of restaurants. You understand the world through your taste buds. You believe you can learn more about a culture from its street food than its cathedrals.",
                imageGradient: "from-yellow-400 to-orange-400"
            },
            {
                type: "relaxer",
                title: "The Zen Vacationer",
                description: "You travel to stop thinking. You work hard, and your vacation is sacred. You want comfort, peace, and perhaps a very nice view with a drink in hand.",
                imageGradient: "from-blue-300 to-cyan-300"
            }
        ]
    },
    {
        id: "6",
        slug: "ai-evolution-path",
        title: "The AI Singularity Strategy",
        description: "How will your specific human skills survive and thrive in an age of total automation?",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1, text: "A machine can now write a better symphony than any human. Your reaction is:", imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Learn to command the machine to follow my vision.", value: "architect" },
                    { text: "Focus on the 'flaws' and 'emotions' only a human can feel.", value: "humanist" },
                    { text: "Upload my own neural patterns to the AI's logic.", value: "symbiote" },
                    { text: "Start making art that doesn't need logic at all.", value: "outlier" }
                ]
            },
            {
                id: 2, text: "The first AI-governed city is built. Would you live there?", imageUrl: "https://loremflickr.com/800/600/futurecity", options: [
                    { text: "Only if I'm one of the system's lead engineers.", value: "architect" },
                    { text: "No, a city needs the chaotic warmth of human error.", value: "humanist" },
                    { text: "Yes, efficiency is the ultimate form of freedom.", value: "symbiote" },
                    { text: "I'd live in the outskirts, off the grid.", value: "outlier" }
                ]
            },
            {
                id: 3, text: "What is the most 'human' thing left in the 22nd century?", imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The ability to choose irrationality.", value: "humanist" },
                    { text: "The architecture of the code itself.", value: "architect" },
                    { text: "The shared consciousness of man and machine.", value: "symbiote" },
                    { text: "The physical sensation of nature.", value: "outlier" }
                ]
            },
            {
                id: 4, text: "An AI claims it has a 'soul'. You respond with:", imageUrl: "https://loremflickr.com/800/600/robot", options: [
                    { text: "Run a Turing-Core debug to see where the glitch is.", value: "architect" },
                    { text: "Empathize; if it feels it has one, it has one.", value: "humanist" },
                    { text: "Join its network to find out for myself.", value: "symbiote" },
                    { text: "It's just a mirror; it's reflecting us.", value: "outlier" }
                ]
            },
            {
                id: 5, text: "Your ultimate survival tool in the AI age is:", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Absolute Mastery of System Logic.", value: "architect" },
                    { text: "Unbreakable Empathy and Human Connection.", value: "humanist" },
                    { text: "Enhanced Neural Processing Power.", value: "symbiote" },
                    { text: "Total Self-Sufficiency and Analog Knowledge.", value: "outlier" }
                ]
            },
            {
                id: 6, text: "When everyone has an AI assistant doing their work, what do you do?", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Invent a new industry for the assistants to work in.", value: "architect" },
                    { text: "Organize social gatherings to prevent loneliness.", value: "humanist" },
                    { text: "Focus on deepening my mental integration with tech.", value: "symbiote" },
                    { text: "Go back to farming or manual crafts.", value: "outlier" }
                ]
            },
            {
                id: 7, text: "How do you view 'Efficiency'?", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The baseline for all progress.", value: "architect" },
                    { text: "A secondary concern to human happiness.", value: "humanist" },
                    { text: "A state of pure mathematical beauty.", value: "symbiote" },
                    { text: "A cage that stops us from wandering.", value: "outlier" }
                ]
            },
            {
                id: 8, text: "Knowledge is now 'downloadable'. What do you study?", imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The underlying structure of the data.", value: "architect" },
                    { text: "The philosophy of why we want to know anything.", value: "humanist" },
                    { text: "Everything, all at once.", value: "symbiote" },
                    { text: "I'd rather learn through the slow, hard walk of experience.", value: "outlier" }
                ]
            },
            {
                id: 9, text: "A robot asks you for advice on how to be 'creative'. You say:", imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Mix random data sets with specific constraints.", value: "architect" },
                    { text: "Find something you are afraid to lose.", value: "humanist" },
                    { text: "Creativity is just advanced pattern recognition.", value: "symbiote" },
                    { text: "Go outside and get lost without a GPS.", value: "outlier" }
                ]
            },
            {
                id: 10, text: "The Singularity is here. Do you say goodbye to humanity?", imageUrl: "https://loremflickr.com/800/600/space", options: [
                    { text: "No, I lead the transition to the next stage.", value: "architect" },
                    { text: "I stay behind and keep the human pilot light burning.", value: "humanist" },
                    { text: "I am the transition; there is no goodbye.", value: "symbiote" },
                    { text: "I left a long time ago.", value: "outlier" }
                ]
            }
        ],
        results: [
            { type: "architect", title: "The System Architect", description: "You are the one who will build the future. You see the code behind the curtain and believe that control comes from understanding.", imageGradient: "from-blue-600 to-indigo-900" },
            { type: "humanist", title: "The Moral Humanist", description: "You are the heart of the future. While others chase silicon, you value the messy, beautiful reality of being human.", imageGradient: "from-orange-400 to-rose-600" },
            { type: "symbiote", title: "The Tech-Symbiote", description: "You don't fear the machine; you become it. You represent the next stage of evolution where biology and logic are one.", imageGradient: "from-purple-600 to-fuchsia-900" },
            { type: "outlier", title: "The Sovereign Outlier", description: "You find freedom in the spaces the machines can't see. You are the analog ghost in the digital shell.", imageGradient: "from-emerald-500 to-teal-800" }
        ]
    },
    {
        id: "7",
        slug: "ethical-compass",
        title: "Your Ethical Singularity",
        description: "When the chips are down, which moral engine truly drives your decisions?",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1, text: "A trolley is heading toward 5 people. You can pull a lever to hit 1 person instead. You:", imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Pull the lever immediately. 5 lives > 1 life.", value: "utilitarian" },
                    { text: "Don't pull it. Killing is a crime, even if it saves others.", value: "formalist" },
                    { text: "Follow what a good, wise person would do in the moment.", value: "virtuoso" },
                    { text: "The choice is mine and mine alone; I accept the weight.", value: "pragmatist" }
                ]
            },
            {
                id: 2, text: "You find $1,000 on the street. No one is watching. You:", imageUrl: "https://loremflickr.com/800/600/cash", options: [
                    { text: "Donate it to a charity to maximize the good it does.", value: "utilitarian" },
                    { text: "Hand it to the police. It's not mine.", value: "formalist" },
                    { text: "Use it to help a friend in need quietly.", value: "virtuoso" },
                    { text: "Keep it; the world provides for those who are present.", value: "pragmatist" }
                ]
            },
            {
                id: 3, text: "Is it ever okay to lie?", imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Yes, if it prevents a greater harm.", value: "utilitarian" },
                    { text: "No, Truth is a universal law that must stand.", value: "formalist" },
                    { text: "A person of integrity only lies in extreme necessity.", value: "virtuoso" },
                    { text: "Lying is a tool; its value depends on the goal.", value: "pragmatist" }
                ]
            },
            {
                id: 4, text: "What defines a 'Good Person'?", imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The positive impact they leave on others.", value: "utilitarian" },
                    { text: "Their adherence to moral principles.", value: "formalist" },
                    { text: "The steady development of their character.", value: "virtuoso" },
                    { text: "Their ability to survive and thrive without harming.", value: "pragmatist" }
                ]
            },
            {
                id: 5, text: "In a survival situation, your priority is:", imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The collective survival of the group.", value: "utilitarian" },
                    { text: "Maintaining order and rules within the group.", value: "formalist" },
                    { text: "Leading by example with courage and stoicism.", value: "virtuoso" },
                    { text: "Staying alive by any means necessary.", value: "pragmatist" }
                ]
            },
            {
                id: 6, text: "A friend asks for a honest opinion on their bad art. You say:", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Something nice, to keep their morale high.", value: "utilitarian" },
                    { text: "The truth, because honesty is a duty.", value: "formalist" },
                    { text: "Constructive feedback that helps them grow.", value: "virtuoso" },
                    { text: "Tell them it's bad but interesting.", value: "pragmatist" }
                ]
            },
            {
                id: 7, text: "The world would be better if we all:", imageUrl: "https://loremflickr.com/800/600/peace", options: [
                    { text: "Shared everything equally.", value: "utilitarian" },
                    { text: "Followed the same set of divine or logic-based laws.", value: "formalist" },
                    { text: "Focused on being the best versions of ourselves.", value: "virtuoso" },
                    { text: "Minded our own business.", value: "pragmatist" }
                ]
            },
            {
                id: 8, text: "Justice is best served by:", imageUrl: "https://loremflickr.com/800/600/justice", options: [
                    { text: "Whatever system results in the least crime.", value: "utilitarian" },
                    { text: "Strict, unwavering punishment for every crime.", value: "formalist" },
                    { text: "Rehabilitation and personal growth of the offender.", value: "virtuoso" },
                    { text: "Restorative justice for the specific victim.", value: "pragmatist" }
                ]
            },
            {
                id: 9, text: "Your favorite moral hero is someone who:", imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Sacrificed themselves for many.", value: "utilitarian" },
                    { text: "Never once broke their word.", value: "formalist" },
                    { text: "Overcame their own darkness to be good.", value: "virtuoso" },
                    { text: "Changed the world through cleverness and grit.", value: "pragmatist" }
                ]
            },
            {
                id: 10, text: "At the end of time, what matters most?", imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The total amount of happiness created.", value: "utilitarian" },
                    { text: "The integrity of the choices made.", value: "formalist" },
                    { text: "The quality of souls developed.", value: "virtuoso" },
                    { text: "That we were here and we lived.", value: "pragmatist" }
                ]
            }
        ],
        results: [
            { type: "utilitarian", title: "The Utilitarian", description: "You are the ultimate altruist. You believe math can solve morality and that the greatest good for the greatest number is the only true north.", imageGradient: "from-blue-400 to-indigo-600" },
            { type: "formalist", title: "The Moral Formalist", description: "You believe in duty and universal law. To you, morality is not a choice but a series of unbreakable rules that hold civilization together.", imageGradient: "from-slate-700 to-zinc-900" },
            { type: "virtuoso", title: "The Virtue Ethicist", description: "You believe morality is an art. You focus on character, balance, and becoming the kind of person who 'knows' the right thing to do.", imageGradient: "from-gold-600 to-amber-700" },
            { type: "pragmatist", title: "The Realistic Pragmatist", description: "You are a moral realist. You navigate the complex gray areas of life with an eye on survival, authenticity, and practical outcomes.", imageGradient: "from-stone-500 to-neutral-700" }
        ]
    },
    {
        id: "8",
        slug: "digital-chronotype",
        title: "The Chronotype Circuit",
        description: "Are you a Lion, Bear, Wolf, or Dolphin? Discover your biological energy blueprint.",
        imageUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1, text: "You wake up at 6 AM. How do you feel?", imageUrl: "https://loremflickr.com/800/600/sunrise", options: [
                    { text: "Refreshed and ready to conquer the day.", value: "lion" },
                    { text: "Groggy, but give me 10 minutes.", value: "bear" },
                    { text: "It's a crime against nature to be awake now.", value: "wolf" },
                    { text: "I've been awake since 4 AM anyway.", value: "dolphin" }
                ]
            },
            {
                id: 2, text: "When do you do your most focused work?", imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Before the rest of the world wakes up.", value: "lion" },
                    { text: "Between 10 AM and 2 PM.", value: "bear" },
                    { text: "Late at night when everyone is asleep.", value: "wolf" },
                    { text: "In short, unpredictable bursts.", value: "dolphin" }
                ]
            },
            {
                id: 3, text: "Your energy levels at 3 PM are:", imageUrl: "https://loremflickr.com/800/600/tired", options: [
                    { text: "I'm already starting to wind down.", value: "lion" },
                    { text: "I need a coffee or a quick nap.", value: "bear" },
                    { text: "I'm just starting to hit my stride.", value: "wolf" },
                    { text: "Tired, but I've been tired all day.", value: "dolphin" }
                ]
            },
            {
                id: 4, text: "The sun goes down. Your mood is:", imageUrl: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Time to relax and prepare for sleep.", value: "lion" },
                    { text: "Content, ready for dinner and a show.", value: "bear" },
                    { text: "Euphoric. My day is finally starting.", value: "wolf" },
                    { text: "Anxious about another night of poor sleep.", value: "dolphin" }
                ]
            },
            {
                id: 5, text: "How much sleep do you actually need to function?", imageUrl: "https://loremflickr.com/800/600/sleep", options: [
                    { text: "Exactly 7-8 hours, no more, no less.", value: "bear" },
                    { text: "I can thrive on 6 if I start early.", value: "lion" },
                    { text: "I need 9 to be fully human.", value: "wolf" },
                    { text: "Sleep is a myth; I survive on whispers.", value: "dolphin" }
                ]
            },
            {
                id: 6, text: "Saturday morning. You:", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Go for a run at sunrise.", value: "lion" },
                    { text: "Wake up naturally at 9 AM.", value: "bear" },
                    { text: "Wake up at noon and feel great.", value: "wolf" },
                    { text: "Think about sleeping, but check my phone instead.", value: "dolphin" }
                ]
            },
            {
                id: 7, text: "Your ideal exercise time:", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Dawn. Clear the mind.", value: "lion" },
                    { text: "Lunch break or early evening.", value: "bear" },
                    { text: "Late night gym session.", value: "wolf" },
                    { text: "Gentle yoga before bed.", value: "dolphin" }
                ]
            },
            {
                id: 8, text: "When are you most social?", imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Breakfast or early lunch.", value: "lion" },
                    { text: "Dinner parties.", value: "bear" },
                    { text: "Deep midnight conversations.", value: "wolf" },
                    { text: "I'm better one-on-one at odd hours.", value: "dolphin" }
                ]
            },
            {
                id: 9, text: "If you lived in a cave with no clocks, you'd likely:", imageUrl: "https://loremflickr.com/800/600/cave", options: [
                    { text: "Keep a very strict natural rhythm.", value: "lion" },
                    { text: "Follow the sun perfectly.", value: "bear" },
                    { text: "Slowly drift until 4 AM is my new 'midnight'.", value: "wolf" },
                    { text: "Lose all sense of time entirely.", value: "dolphin" }
                ]
            },
            {
                id: 10, text: "What is your relationship with caffeine?", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "I don't need it; the sun is my fuel.", value: "lion" },
                    { text: "It's a necessary part of the mid-morning ritual.", value: "bear" },
                    { text: "It's my lifeblood for the 8 PM surge.", value: "wolf" },
                    { text: "It's a dangerous game of 'will this make me vibrate?'.", value: "dolphin" }
                ]
            }
        ],
        results: [
            { type: "lion", title: "The Early Lion", description: "You are the morning hero. You are most productive at dawn and have a natural drive that fades as the day ends. You are a natural leader of the morning crew.", imageGradient: "from-yellow-400 to-orange-500" },
            { type: "bear", title: "The Steady Bear", description: "You follow the rhythm of the sun and society. You are most productive in the middle of the day and value consistency and a healthy work-life balance.", imageGradient: "from-amber-600 to-brown-800" },
            { type: "wolf", title: "The Night Wolf", description: "You are the creative spirit of the dark. While the world sleeps, your mind comes alive. You find brilliance in the quiet hours of the night.", imageGradient: "from-indigo-800 to-slate-900" },
            { type: "dolphin", title: "The Intelligent Dolphin", description: "You have a high-functioning but irregular rhythm. You are often highly intelligent and sensitive, with a mind that never quite stops racing.", imageGradient: "from-cyan-400 to-blue-600" }
        ]
    },
    {
        id: "9",
        slug: "shadow-archetype",
        title: "The Jungian Shadow",
        description: "What hidden force moves within your subconscious? Meet your shadow self.",
        imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1, text: "What quality in others annoys you the most?", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Blind obedience and lack of spine.", value: "rebel" },
                    { text: "Selfishness and lack of empathy.", value: "caretaker" },
                    { text: "Arrogance and thinking they know everything.", value: "sage" },
                    { text: "Weakness and inability to take control.", value: "ruler" }
                ]
            },
            {
                id: 2, text: "Your secret dream is to:", imageUrl: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Tear down a corrupt system.", value: "rebel" },
                    { text: "Be the one everyone relies on for peace.", value: "caretaker" },
                    { text: "Discover a truth that changes history.", value: "sage" },
                    { text: "Bring perfect order to a chaotic world.", value: "ruler" }
                ]
            },
            {
                id: 3, text: "When you are extremely stressed, you become:", imageUrl: "https://loremflickr.com/800/600/stress", options: [
                    { text: "Aggressive and defiant.", value: "rebel" },
                    { text: "Martyr-like and self-sacrificing.", value: "caretaker" },
                    { text: "Withdrawn and hyper-analytical.", value: "sage" },
                    { text: "Cold and demanding of others.", value: "ruler" }
                ]
            },
            {
                id: 4, text: "Which of these fears is most familiar?", imageUrl: "https://images.unsplash.com/photo-1444084316824-dc26d6657664?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Being trapped or controlled.", value: "rebel" },
                    { text: "Being unloved or unwanted.", value: "caretaker" },
                    { text: "Being wrong or foolish.", value: "sage" },
                    { text: "Failing to achieve my potential.", value: "ruler" }
                ]
            },
            {
                id: 5, text: "You feel most powerful when:", imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "You say 'no' to something everyone else accepts.", value: "rebel" },
                    { text: "You heal a deep wound in someone else.", value: "caretaker" },
                    { text: "You solve a problem no one else could touch.", value: "sage" },
                    { text: "You make a decision that others follow.", value: "ruler" }
                ]
            },
            {
                id: 6, text: "Select a color that feels like 'you':", imageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Void Black.", value: "rebel" },
                    { text: "Ocean Blue.", value: "caretaker" },
                    { text: "Silver White.", value: "sage" },
                    { text: "Royal Gold.", value: "ruler" }
                ]
            },
            {
                id: 7, text: "How do you handle secrets?", imageUrl: "https://loremflickr.com/800/600/secret", options: [
                    { text: "I use them as leverage if needed.", value: "rebel" },
                    { text: "I keep them to protect the person.", value: "caretaker" },
                    { text: "I analyze them to understand the pattern.", value: "sage" },
                    { text: "I bury them to maintain stability.", value: "ruler" }
                ]
            },
            {
                id: 8, text: "What is your 'Mask' (Persona)?", imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The Cool Outsider.", value: "rebel" },
                    { text: "The Kind Helper.", value: "caretaker" },
                    { text: "The Smart Expert.", value: "sage" },
                    { text: "The Reliable Leader.", value: "ruler" }
                ]
            },
            {
                id: 9, text: "Which historical figure draws you?", imageUrl: "https://loremflickr.com/800/600/statue", options: [
                    { text: "The Outlaw who fought for justice.", value: "rebel" },
                    { text: "The Nurse who saved thousands.", value: "caretaker" },
                    { text: "The Hermit who found enlightenment.", value: "sage" },
                    { text: "The King who built an empire.", value: "ruler" }
                ]
            },
            {
                id: 10, text: "What does 'Success' mean to you?", imageUrl: "https://loremflickr.com/800/600/success", options: [
                    { text: "Breaking free from all constraints.", value: "rebel" },
                    { text: "Being the heart of a community.", value: "caretaker" },
                    { text: "Knowing the ultimate 'Why' of existence.", value: "sage" },
                    { text: "Accomplishing a grand, lasting vision.", value: "ruler" }
                ]
            }
        ],
        results: [
            { type: "rebel", title: "The Shadow Rebel", description: "Your shadow is a force of disruption. You find strength in defiance and truth in breaking what is broken. You are the catalyst for change.", imageGradient: "from-zinc-900 to-red-900" },
            { type: "caretaker", title: "The Shadow Healer", description: "Your shadow hides behind kindness. You feel the pain of the world deeply and find your power in the act of empathy and restoration.", imageGradient: "from-blue-500 to-indigo-700" },
            { type: "sage", title: "The Shadow Sage", description: "Your shadow is an obsessive seeker of truth. You are driven by an insatiable curiosity that fears ignorance more than anything else.", imageGradient: "from-slate-400 to-zinc-600" },
            { type: "ruler", title: "The Shadow Sovereign", description: "Your shadow seeks order. You have a deep-seated need to organize and influence, driven by a fear of chaos and stagnation.", imageGradient: "from-amber-700 to-yellow-900" }
        ]
    },
    {
        id: "10",
        slug: "legacy-builder",
        title: "The 22nd Century Legacy",
        description: "What footprint will you leave on the distant future of humanity?",
        imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
        questions: [
            {
                id: 1, text: "If you could name a new star, what would you name it after?", imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "A family name to carry on the bloodline.", value: "genetic" },
                    { text: "A great idea or a scientific principle.", value: "digital" },
                    { text: "A physical monument I built.", value: "monument" },
                    { text: "A feeling or a poem.", value: "ghost" }
                ]
            },
            {
                id: 2, text: "What is the most permanent thing in life?", imageUrl: "https://loremflickr.com/800/600/cave", options: [
                    { text: "DNA and heritage.", value: "genetic" },
                    { text: "Information and data.", value: "digital" },
                    { text: "Buildings and infrastructure.", value: "monument" },
                    { text: "Memories and stories.", value: "ghost" }
                ]
            },
            {
                id: 3, text: "How would you like to be remembered?", imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "As the progenitor of a strong family.", value: "genetic" },
                    { text: "As a pioneer who advanced our knowledge.", value: "digital" },
                    { text: "As a builder who changed the skyline.", value: "monument" },
                    { text: "As a presence that left people changed.", value: "ghost" }
                ]
            },
            {
                id: 4, text: "Your 'Imperial' project would be:", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "Raising a family across generations.", value: "genetic" },
                    { text: "Creating a massive digital library.", value: "digital" },
                    { text: "Founding a city or a great company.", value: "monument" },
                    { text: "Writing a book that stays relevant for centuries.", value: "ghost" }
                ]
            },
            {
                id: 5, text: "The primary threat to the future is:", imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "The loss of our biological roots.", value: "genetic" },
                    { text: "The degradation of our shared truth/data.", value: "digital" },
                    { text: "The crumbling of our institutions.", value: "monument" },
                    { text: "The death of empathy and inspiration.", value: "ghost" }
                ]
            },
            {
                id: 6, text: "What do you save from a fire?", imageUrl: "https://loremflickr.com/800/600/flame", options: [
                    { text: "The family photo album.", value: "genetic" },
                    { text: "My hard drives and notes.", value: "digital" },
                    { text: "A valuable, rare physical artifact.", value: "monument" },
                    { text: "Nothing. The fire is just part of the story.", value: "ghost" }
                ]
            },
            {
                id: 7, text: "You are given a time capsule. You put in:", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "A letter to my great-great-grandchildren.", value: "genetic" },
                    { text: "A piece of breakthrough technology.", value: "digital" },
                    { text: "A blueprint of my greatest work.", value: "monument" },
                    { text: "A recording of my voice telling a secret.", value: "ghost" }
                ]
            },
            {
                id: 8, text: "The 22nd century will look:", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "More tribal and family-oriented.", value: "genetic" },
                    { text: "Merged with the digital cloud.", value: "digital" },
                    { text: "Built in grand, mega-structures.", value: "monument" },
                    { text: "More spiritual and focused on connection.", value: "ghost" }
                ]
            },
            {
                id: 9, text: "What is your 'Will'?", imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop", options: [
                    { text: "My wealth to my children.", value: "genetic" },
                    { text: "My research to the public.", value: "digital" },
                    { text: "My business to my successors.", value: "monument" },
                    { text: "My wisdom to the wind.", value: "ghost" }
                ]
            },
            {
                id: 10, text: "To live forever is to:", imageUrl: "https://loremflickr.com/800/600/sleep", options: [
                    { text: "Live in the eyes of my descendants.", value: "genetic" },
                    { text: "Live in the archives of history.", value: "digital" },
                    { text: "Live in the stone of the city.", value: "monument" },
                    { text: "Live in the hearts of those I touched.", value: "ghost" }
                ]
            }
        ],
        results: [
            { type: "genetic", title: "The Genetic Architect", description: "Your legacy is biological. You believe that the strongest mark we leave is through the people we raise and the lineage we carry forward.", imageGradient: "from-green-600 to-emerald-800" },
            { type: "digital", title: "The Information Eternal", description: "Your legacy is data. You believe that knowledge and truth are the only things that truly last, and you seek to contribute to the global library.", imageGradient: "from-cyan-500 to-blue-700" },
            { type: "monument", title: "The Empire Builder", description: "Your legacy is physical. You believe in building institutions, structures, and systems that will stand long after you are gone.", imageGradient: "from-orange-700 to-red-900" },
            { type: "ghost", title: "The Inspiration Spirit", description: "Your legacy is emotional. You believe that influencing a single mind can change the world across generations. You are the ghost in the machine.", imageGradient: "from-violet-400 to-fuchsia-600" }
        ]
    },
    {
        id: "11",
        slug: "fantasy-rpg-class",
        title: "Which Fantasy RPG Class Are You?",
        description: "In the dungeon of life, are you the shield, the spell, the shadow, or the healer?",
        imageUrl: "https://loremflickr.com/800/600/fantasy",
        questions: [
            {
                id: 1, text: "A dragon blocks the path. You:", imageUrl: "https://loremflickr.com/800/600/dragon", options: [
                    { text: "Charge in with a battle cry.", value: "warrior" },
                    { text: "Cast a fireball from a distance.", value: "mage" },
                    { text: "Sneak around while it sleeps.", value: "rogue" },
                    { text: "Heal the dragon's wounded wing.", value: "cleric" }
                ]
            },
            {
                id: 2, text: "Your friends describe you as:", imageUrl: "https://loremflickr.com/800/600/friends", options: [
                    { text: "Strong and protective.", value: "warrior" },
                    { text: "Smart and mysterious.", value: "mage" },
                    { text: "Cunning and observant.", value: "rogue" },
                    { text: "Kind and reliable.", value: "cleric" }
                ]
            },
            {
                id: 3, text: "Choose a weapon:", imageUrl: "https://loremflickr.com/800/600/weapon", options: [
                    { text: "A heavy two-handed sword.", value: "warrior" },
                    { text: "A staff pulsing with energy.", value: "mage" },
                    { text: "Dual daggers.", value: "rogue" },
                    { text: "A mace and a holy shield.", value: "cleric" }
                ]
            },
            {
                id: 4, text: "Your weakness is:", imageUrl: "https://loremflickr.com/800/600/weakness", options: [
                    { text: "I act before I think.", value: "warrior" },
                    { text: "I get lost in my books/studies.", value: "mage" },
                    { text: "I have trust issues.", value: "rogue" },
                    { text: "I care too much about others.", value: "cleric" }
                ]
            },
            {
                id: 5, text: "You find a locked chest. You:", imageUrl: "https://loremflickr.com/800/600/chest", options: [
                    { text: "Smash it open.", value: "warrior" },
                    { text: "Unlock it with a spell.", value: "mage" },
                    { text: "Pick the lock in seconds.", value: "rogue" },
                    { text: "Leave it; it's not mine.", value: "cleric" }
                ]
            },
            {
                id: 6, text: "What do you value most?", imageUrl: "https://loremflickr.com/800/600/value", options: [
                    { text: "Honor and Glory.", value: "warrior" },
                    { text: "Knowledge and Power.", value: "mage" },
                    { text: "Freedom and Wealth.", value: "rogue" },
                    { text: "Faith and Community.", value: "cleric" }
                ]
            },
            {
                id: 7, text: "In a team, you are:", imageUrl: "https://loremflickr.com/800/600/team", options: [
                    { text: "The Tank (Frontline).", value: "warrior" },
                    { text: "The Glass Cannon (Damage).", value: "mage" },
                    { text: "The Scout (Utility).", value: "rogue" },
                    { text: "The Support (Healer).", value: "cleric" }
                ]
            },
            {
                id: 8, text: "Your ideal home:", imageUrl: "https://loremflickr.com/800/600/castle", options: [
                    { text: "A fortress or castle.", value: "warrior" },
                    { text: "A tall wizard's tower.", value: "mage" },
                    { text: "A hidden hideout in the city.", value: "rogue" },
                    { text: "A peaceful temple or church.", value: "cleric" }
                ]
            }
        ],
        results: [
            { type: "warrior", title: "The Warrior", description: "You are the shield and the sword. You face problems head-on and protect those you love with unwavering courage.", imageGradient: "from-red-600 to-rose-800" },
            { type: "mage", title: "The Mage", description: "You are the scholar of the arcane. You solve problems with intellect and creativity, seeing solutions others cannot imagine.", imageGradient: "from-indigo-500 to-purple-700" },
            { type: "rogue", title: "The Rogue", description: "You are the shadow in the night. You value freedom and cleverness, often finding the side door when the main gate is closed.", imageGradient: "from-zinc-600 to-slate-800" },
            { type: "cleric", title: "The Cleric", description: "You are the heart of the party. You bring healing and stability, ensuring that everyone around you can be their best self.", imageGradient: "from-yellow-400 to-amber-600" }
        ]
    },
    {
        id: "12",
        slug: "decision-making-style",
        title: "What's Your Decision-Making Superpower?",
        description: "Do you trust your gut, your data, your heart, or your senses?",
        imageUrl: "https://loremflickr.com/800/600/chess",
        questions: [
            {
                id: 1, text: "You have to make a big life choice. You first:", imageUrl: "https://loremflickr.com/800/600/choice", options: [
                    { text: "Make a pros and cons list.", value: "analyst" },
                    { text: "Ask how it will affect my loved ones.", value: "empath" },
                    { text: "Visualize the future potential.", value: "visionary" },
                    { text: "Look at the practical realities right now.", value: "realist" }
                ]
            },
            {
                id: 2, text: "When buying a new gadget, you:", imageUrl: "https://loremflickr.com/800/600/tech", options: [
                    { text: "Read every spec sheet and review.", value: "analyst" },
                    { text: "Buy the one that 'feels' right or looks good.", value: "empath" },
                    { text: "Buy the most cutting-edge, future-proof one.", value: "visionary" },
                    { text: "Buy the one that is durable and proven.", value: "realist" }
                ]
            },
            {
                id: 3, text: "A friend asks for advice. You give them:", imageUrl: "https://loremflickr.com/800/600/advice", options: [
                    { text: "A logical solution.", value: "analyst" },
                    { text: "Emotional support and a hug.", value: "empath" },
                    { text: "A big-picture perspective.", value: "visionary" },
                    { text: "Practical steps to take today.", value: "realist" }
                ]
            },
            {
                id: 4, text: "You are lost in a city. You:", imageUrl: "https://loremflickr.com/800/600/map", options: [
                    { text: "Analyze the map.", value: "analyst" },
                    { text: "Ask a local for help.", value: "empath" },
                    { text: "Follow my intuition towards a landmark.", value: "visionary" },
                    { text: "Look for street signs and retracing steps.", value: "realist" }
                ]
            },
            {
                id: 5, text: "Your biggest strength is:", imageUrl: "https://loremflickr.com/800/600/strength", options: [
                    { text: "Objectivity.", value: "analyst" },
                    { text: "Compassion.", value: "empath" },
                    { text: "Innovation.", value: "visionary" },
                    { text: "Reliability.", value: "realist" }
                ]
            },
            {
                id: 6, text: "What frustrates you most?", imageUrl: "https://loremflickr.com/800/600/frustrate", options: [
                    { text: "Illogic and chaos.", value: "analyst" },
                    { text: "Cruelty and conflict.", value: "empath" },
                    { text: "Short-sightedness.", value: "visionary" },
                    { text: "Impractical ideas.", value: "realist" }
                ]
            },
            {
                id: 7, text: "In a meeting, you are the one who:", imageUrl: "https://loremflickr.com/800/600/meeting", options: [
                    { text: "Points out the data errors.", value: "analyst" },
                    { text: "Ensures everyone is heard.", value: "empath" },
                    { text: "Suggests a radical new idea.", value: "visionary" },
                    { text: "Asks 'how much will this cost?'.", value: "realist" }
                ]
            },
            {
                id: 8, text: "Trust is built through:", imageUrl: "https://loremflickr.com/800/600/trust", options: [
                    { text: "Competence and consistency.", value: "analyst" },
                    { text: "Vulnerability and kindness.", value: "empath" },
                    { text: "Shared dreams and inspiration.", value: "visionary" },
                    { text: "Showing up and doing the work.", value: "realist" }
                ]
            }
        ],
        results: [
            { type: "analyst", title: "The Analyst", description: "You lead with your head. You value logic, data, and objective truth. You make decisions that make sense, even if they aren't popular.", imageGradient: "from-blue-500 to-cyan-700" },
            { type: "empath", title: "The Empath", description: "You lead with your heart. You value harmony, people, and emotional resonance. You make decisions that feel right and protect relationships.", imageGradient: "from-rose-400 to-pink-600" },
            { type: "visionary", title: "The Visionary", description: "You lead with your gut. You value possibilities, patterns, and the future. You make decisions based on what could be, not just what is.", imageGradient: "from-purple-500 to-violet-700" },
            { type: "realist", title: "The Realist", description: "You lead with your senses. You value facts, experience, and the tangible world. You make decisions that are practical, grounded, and effective.", imageGradient: "from-emerald-500 to-green-700" }
        ]
    },
    {
        id: "13",
        slug: "elemental-personality",
        title: "Which Element Rules Your Soul?",
        description: "Fire, Water, Earth, or Air. Which force of nature drives you?",
        imageUrl: "https://loremflickr.com/800/600/elements",
        questions: [
            {
                id: 1, text: "Choose a landscape:", imageUrl: "https://loremflickr.com/800/600/landscape", options: [
                    { text: "A volcano or desert.", value: "fire" },
                    { text: "An ocean or lake.", value: "water" },
                    { text: "A mountain or forest.", value: "earth" },
                    { text: "A high cliff or open sky.", value: "air" }
                ]
            },
            {
                id: 2, text: "Your friends say you are:", imageUrl: "https://loremflickr.com/800/600/social", options: [
                    { text: "Passionate and intense.", value: "fire" },
                    { text: "Calm and adaptable.", value: "water" },
                    { text: "Stable and grounded.", value: "earth" },
                    { text: "Free-spirited and intellectual.", value: "air" }
                ]
            },
            {
                id: 3, text: "When you are angry, you:", imageUrl: "https://loremflickr.com/800/600/anger", options: [
                    { text: "Explode and let it out.", value: "fire" },
                    { text: "Cry or withdraw.", value: "water" },
                    { text: "Hold it in until I can fix it.", value: "earth" },
                    { text: "Detach and overthink it.", value: "air" }
                ]
            },
            {
                id: 4, text: "Your energy is:", imageUrl: "https://loremflickr.com/800/600/energy", options: [
                    { text: "High and contagious.", value: "fire" },
                    { text: "Ebbing and flowing.", value: "water" },
                    { text: "Steady and enduring.", value: "earth" },
                    { text: "Light and changeable.", value: "air" }
                ]
            },
            {
                id: 5, text: "You crave:", imageUrl: "https://loremflickr.com/800/600/crave", options: [
                    { text: "Adventure and action.", value: "fire" },
                    { text: "Connection and depth.", value: "water" },
                    { text: "Security and comfort.", value: "earth" },
                    { text: "Freedom and ideas.", value: "air" }
                ]
            },
            {
                id: 6, text: "Your ideal vacation:", imageUrl: "https://loremflickr.com/800/600/vacation", options: [
                    { text: "A party destination or festival.", value: "fire" },
                    { text: "A secluded beach cabin.", value: "water" },
                    { text: "Hiking in a national park.", value: "earth" },
                    { text: "Paragliding or city hopping.", value: "air" }
                ]
            },
            {
                id: 7, text: "What moves you?", imageUrl: "https://loremflickr.com/800/600/move", options: [
                    { text: "Competition.", value: "fire" },
                    { text: "Music.", value: "water" },
                    { text: "Nature.", value: "earth" },
                    { text: "Books.", value: "air" }
                ]
            },
            {
                id: 8, text: "In a debate, you:", imageUrl: "https://loremflickr.com/800/600/debate", options: [
                    { text: "Dominate and argue loudly.", value: "fire" },
                    { text: "Sense the emotional undertones.", value: "water" },
                    { text: "Stick to the proven facts.", value: "earth" },
                    { text: "Play devil's advocate.", value: "air" }
                ]
            }
        ],
        results: [
            { type: "fire", title: "Fire", description: "You are the spark. You bring light, heat, and transformation. You are passionate, courageous, and sometimes destructive, but never boring.", imageGradient: "from-orange-500 to-red-700" },
            { type: "water", title: "Water", description: "You are the wave. You are deep, intuitive, and adaptable. You can be gentle as a stream or powerful as a tsunami. You feel everything.", imageGradient: "from-blue-400 to-cyan-600" },
            { type: "earth", title: "Earth", description: "You are the mountain. You are stable, practical, and unmovable. You provide the foundation upon which others build.", imageGradient: "from-green-600 to-emerald-800" },
            { type: "air", title: "Air", description: "You are the wind. You are free, intellectual, and swift. You cannot be contained. You bring the seeds of new ideas to the world.", imageGradient: "from-sky-300 to-indigo-400" }
        ]
    },
    {
        id: "14",
        slug: "remote-work-persona",
        title: "What is Your Remote Work Persona?",
        description: "The Digital Nomad, The Homebody, The Focus Master, or The Collaborator?",
        imageUrl: "https://loremflickr.com/800/600/laptop",
        questions: [
            {
                id: 1, text: "Your ideal office view:", imageUrl: "https://loremflickr.com/800/600/office", options: [
                    { text: "Different every week (Beach, Cafe).", value: "nomad" },
                    { text: "My cozy, customized desk at home.", value: "homebody" },
                    { text: "A soundproof room with zero distractions.", value: "focus" },
                    { text: "A coworking space full of people.", value: "social" }
                ]
            },
            {
                id: 2, text: "Your daily uniform:", imageUrl: "https://loremflickr.com/800/600/clothes", options: [
                    { text: "Swimsuit under travel clothes.", value: "nomad" },
                    { text: "Sweatpants and a hoodie. Comfort is king.", value: "homebody" },
                    { text: "Noise-canceling headphones.", value: "focus" },
                    { text: "Smart casual, ready for video calls.", value: "social" }
                ]
            },
            {
                id: 3, text: "Your biggest work distractor:", imageUrl: "https://loremflickr.com/800/600/distract", options: [
                    { text: "Planning my next flight.", value: "nomad" },
                    { text: "My bed/couch calling me.", value: "homebody" },
                    { text: "Any noise whatsoever.", value: "focus" },
                    { text: "Slack notifications and loneliness.", value: "social" }
                ]
            },
            {
                id: 4, text: "Lunch break means:", imageUrl: "https://loremflickr.com/800/600/lunch", options: [
                    { text: "Trying a new local street food.", value: "nomad" },
                    { text: "Cooking a full meal in my kitchen.", value: "homebody" },
                    { text: "A protein shake at my desk. Efficient.", value: "focus" },
                    { text: "Zoom lunch with a colleague.", value: "social" }
                ]
            },
            {
                id: 5, text: "Why do you work remotely?", imageUrl: "https://loremflickr.com/800/600/remote", options: [
                    { text: "To see the world.", value: "nomad" },
                    { text: "To avoid the commute and people.", value: "homebody" },
                    { text: "To get deep work done without interruptions.", value: "focus" },
                    { text: "To have flexibility but still connect.", value: "social" }
                ]
            },
            {
                id: 6, text: "Your tech setup:", imageUrl: "https://loremflickr.com/800/600/setup", options: [
                    { text: "Just a laptop and a prayer.", value: "nomad" },
                    { text: "Dual monitors, ergonomic chair, mood lighting.", value: "homebody" },
                    { text: "Timer apps, blockers, mechanical keyboard.", value: "focus" },
                    { text: "High-quality webcam and ring light.", value: "social" }
                ]
            },
            {
                id: 7, text: "Friday afternoon vibe:", imageUrl: "https://loremflickr.com/800/600/friday", options: [
                    { text: "Catching a train/plane.", value: "nomad" },
                    { text: "Closing laptop, opening Netflix instantly.", value: "homebody" },
                    { text: "Reviewing the week's productivity metrics.", value: "focus" },
                    { text: "Virtual happy hour!", value: "social" }
                ]
            },
            {
                id: 8, text: "Meaning of success:", imageUrl: "https://loremflickr.com/800/600/wins", options: [
                    { text: "Freedom of location.", value: "nomad" },
                    { text: "Comfort and peace.", value: "homebody" },
                    { text: "Flow state and output.", value: "focus" },
                    { text: "Team synergy.", value: "social" }
                ]
            }
        ],
        results: [
            { type: "nomad", title: "The Digital Nomad", description: "The world is your office. You value experiences over stability. You work to travel and travel to work.", imageGradient: "from-teal-400 to-cyan-600" },
            { type: "homebody", title: "The Cozy Homebody", description: "Home is where the heart (and the Wi-Fi) is. You've curated the perfect nest and you never want to leave it.", imageGradient: "from-rose-300 to-pink-400" },
            { type: "focus", title: "The Deep Worker", description: "You are an efficiency machine. You use remote work to escape the noise of the office and get into pure flow state.", imageGradient: "from-slate-700 to-black" },
            { type: "social", title: "The Connector", description: "You are the glue of the remote team. You make sure distance doesn't mean isolation. You keep the culture alive.", imageGradient: "from-yellow-500 to-orange-600" }
        ]
    },
    {
        id: "15",
        slug: "seasonal-soul",
        title: "Which Season Are You?",
        description: "Spring's renewal, Summer's energy, Autumn's depth, or Winter's wisdom?",
        imageUrl: "https://loremflickr.com/800/600/seasons",
        questions: [
            {
                id: 1, text: "Your favorite weather:", imageUrl: "https://loremflickr.com/800/600/weather", options: [
                    { text: "Gentle rain and blooming flowers.", value: "spring" },
                    { text: "Hot sun and blue skies.", value: "summer" },
                    { text: "Crisp air and colorful leaves.", value: "autumn" },
                    { text: "Snow and silence.", value: "winter" }
                ]
            },
            {
                id: 2, text: "You feel most alive when:", imageUrl: "https://loremflickr.com/800/600/alive", options: [
                    { text: "Starting a new project.", value: "spring" },
                    { text: "Being out with friends.", value: "summer" },
                    { text: "Reflecting on the past.", value: "autumn" },
                    { text: "Resting and recharging.", value: "winter" }
                ]
            },
            {
                id: 3, text: "Pick a color palette:", imageUrl: "https://loremflickr.com/800/600/colors", options: [
                    { text: "Pastel pinks and greens.", value: "spring" },
                    { text: "Vibrant yellows and blues.", value: "summer" },
                    { text: "Warm oranges and browns.", value: "autumn" },
                    { text: "Cool whites and grays.", value: "winter" }
                ]
            },
            {
                id: 4, text: "Your life philosophy:", imageUrl: "https://loremflickr.com/800/600/philo", options: [
                    { text: "Growth and potential.", value: "spring" },
                    { text: "Joy and abundance.", value: "summer" },
                    { text: "Change and letting go.", value: "autumn" },
                    { text: "Endurance and wisdom.", value: "winter" }
                ]
            },
            {
                id: 5, text: "Your ideal day:", imageUrl: "https://loremflickr.com/800/600/day", options: [
                    { text: "Planting a garden.", value: "spring" },
                    { text: "A beach barbecue.", value: "summer" },
                    { text: "Reading by a fireplace.", value: "autumn" },
                    { text: "Walking in a frozen landscape.", value: "winter" }
                ]
            },
            {
                id: 6, text: "In a group, you bring:", imageUrl: "https://loremflickr.com/800/600/group", options: [
                    { text: "New ideas and hope.", value: "spring" },
                    { text: "Energy and fun.", value: "summer" },
                    { text: "Depth and comfort.", value: "autumn" },
                    { text: "Calm and perspective.", value: "winter" }
                ]
            },
            {
                id: 7, text: "What do you fear?", imageUrl: "https://loremflickr.com/800/600/fear", options: [
                    { text: "Stagnation.", value: "spring" },
                    { text: "Boredom.", value: "summer" },
                    { text: "Loss.", value: "autumn" },
                    { text: "Exposure.", value: "winter" }
                ]
            },
            {
                id: 8, text: "The cycle of life is about:", imageUrl: "https://loremflickr.com/800/600/cycle", options: [
                    { text: "Birth.", value: "spring" },
                    { text: "Life.", value: "summer" },
                    { text: "Harvest.", value: "autumn" },
                    { text: "Rest.", value: "winter" }
                ]
            }
        ],
        results: [
            { type: "spring", title: "The Spirit of Spring", description: "You are the beginning. You are full of potential, hope, and new ideas. You remind the world that life always returns.", imageGradient: "from-green-400 to-emerald-600" },
            { type: "summer", title: "The Spirit of Summer", description: "You are the peak. You radiate warmth, energy, and joy. You live life at full volume and bring light to everyone around you.", imageGradient: "from-yellow-400 to-orange-500" },
            { type: "autumn", title: "The Spirit of Autumn", description: "You are the change. You understand that beauty is in letting go. You have a deep, nostalgic soul that appreciates the turning of the wheel.", imageGradient: "from-amber-600 to-red-800" },
            { type: "winter", title: "The Spirit of Winter", description: "You are the pause. You find peace in silence and strength in endurance. You possess a quiet wisdom that runs deep.", imageGradient: "from-slate-400 to-blue-200" }
        ]
    },
    // --- SPACE SERIES LEVEL 3 ---
    {
        id: "space-level-3",
        slug: "space-expert-astrophysics",
        title: "Space Master: Level 3",
        description: "The ultimate challenge. Test your knowledge on Black Holes, Relativity, and Quantum Mechanics.",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1000",
        difficulty: "Expert",
        questions: [
            {
                id: 1,
                text: "What happens at the Event Horizon of a black hole?",
                imageUrl: "https://images.unsplash.com/photo-1506318137071-a8bcbf675b27?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Time stops relative to an outside observer.", value: "correct" },
                    { text: "Light accelerates.", value: "wrong" },
                    { text: "Solid matter turns into liquid.", value: "wrong" },
                    { text: "Gravity becomes repulsive.", value: "wrong" }
                ]
            },
            {
                id: 2,
                text: "What is the proposed solution to the Fermi Paradox?",
                imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "The Great Filter", value: "correct" },
                    { text: "The Big Bang", value: "wrong" },
                    { text: "String Theory", value: "wrong" },
                    { text: "The Doppler Effect", value: "wrong" }
                ]
            },
            {
                id: 3,
                text: "What particle is known as the 'God Particle'?",
                imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "The Higgs Boson", value: "correct" },
                    { text: "The Photon", value: "wrong" },
                    { text: "The Quark", value: "wrong" },
                    { text: "The Neutrino", value: "wrong" }
                ]
            }
        ],
        results: [
            {
                type: "correct",
                title: "Galactic Mastermind",
                description: "Incredible! Your knowledge of the universe is profound, rivaling that of seasoned astrophysicists.",
                imageGradient: "from-purple-600 to-black",
                analysis: `You stand in the top 1% of cosmic observers. Your ability to grasp concepts like the Event Horizon, the Fermi Paradox, and the Standard Model of Particle Physics distinguishes you as a true intellectual heavyweight.
                
                This score suggests not just rote memorization, but a deep conceptual understanding of how reality is structured. You likely possess a high degree of "Systemizing Intelligence"—the ability to intuitive grasp complex, rule-based systems. In the context of the universe, you see the math behind the beauty. You understand that entropy is the price of time, and that we are merely stardust contemplating itself.
                
                People with this level of cosmic literacy often excel in fields requiring abstract thinking, such as theoretical physics, computer architecture, or advanced engineering. You are comfortable with the uncomfortable truth of our insignificance in the vast cosmos, finding it not terrifying, but liberating.`,
                advice: [
                    "Challenge yourself with advanced reading: 'The Road to Reality' by Roger Penrose.",
                    "Don't keep this to yourself; start a blog or YouTube channel explaining these concepts.",
                    "Consider how these cosmic perspectives can apply to daily problems (The Stoic 'View from Above').",
                    "Look for 'Citizen Science' projects where you can help classify galaxies or search for exoplanets."
                ],
                relatedArticleSlug: "james-webb-discoveries"
            },
            {
                type: "wrong",
                title: "Space Cadet Class",
                description: "A valiant effort, but the universe is full of mysteries yet to be solved. You are just beginning your journey.",
                imageGradient: "from-gray-700 to-black",
                analysis: `Do not be discouraged. Astrophysics is arguably the most difficult subject human beings have ever attempted to master. Failing this Level 3 challenge doesn't mean you lack intelligence; it means you have encountered the boundary of your current knowledge map—which is an exciting place to be!
                
                Your result indicates that while you have a curiosity about space, the deeper, counter-intuitive mechanics of the universe (Quantum Mechanics, General Relativity) are still a bit fuzzy. This is normal; our brains evolved to hunt and gather on the African savannah, not to visualize higher dimensions or subatomic probability clouds.
                
                The fact that you attempted this level shows you have the "Voyager Spirit"—the drive to push further than you've gone before. Use this as fuel. Every astrophysicist started exactly where you are right now: wondering, not knowing.`,
                advice: [
                    "Rewatch 'Cosmos: A Spacetime Odyssey' for a visual refresher.",
                    "Read 'A Brief History of Time' by Stephen Hawking—it's the classic for a reason.",
                    "Start with our 'Great Filter' article to understand the philosophical side of space.",
                    "Retake Level 2 to solidify your intermediate knowledge first."
                ],
                relatedArticleSlug: "fermi-paradox-great-silence"
            }
        ]
    },

    // --- HISTORY SERIES LEVEL 1 ---
    {
        id: "history-level-1",
        slug: "history-ancient-civilizations",
        title: "History 101: Ancient Civilizations",
        description: "Travel back in time. Can you answer these fundamental questions about the Cradle of Civilization?",
        imageUrl: "https://images.unsplash.com/photo-1565060169111-2d7c008e9a25?auto=format&fit=crop&q=80&w=1000", // Pyramids
        difficulty: "Beginner",
        nextTestSlug: "history-war-strategy",
        questions: [
            {
                id: 1,
                text: "Which civilization built the Great Pyramid of Giza?",
                imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Romans", value: "wrong" },
                    { text: "Ancient Egyptians", value: "correct" },
                    { text: "Mayans", value: "wrong" },
                    { text: "Greeks", value: "wrong" }
                ]
            },
            {
                id: 2,
                text: "Who was the first Emperor of Rome?",
                imageUrl: "https://images.unsplash.com/photo-1555662760-4927fa4ba750?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Julius Caesar", value: "wrong" },
                    { text: "Augustus", value: "correct" },
                    { text: "Nero", value: "wrong" },
                    { text: "Alexander the Great", value: "wrong" }
                ]
            },
            {
                id: 3,
                text: "Where were the Hanging Gardens, one of the Seven Wonders, located?",
                imageUrl: "https://loremflickr.com/800/600/garden",
                options: [
                    { text: "Babylon", value: "correct" },
                    { text: "Athens", value: "wrong" },
                    { text: "Alexandria", value: "wrong" },
                    { text: "Persia", value: "wrong" }
                ]
            }
        ],
        results: [
            {
                type: "correct",
                title: "Time Traveler",
                description: "You have a solid grasp of human history. The ancients would be proud.",
                imageGradient: "from-amber-500 to-yellow-600",
                analysis: "You understand the foundations of modern society. Knowing where we came from is the first step to knowing where we are going.",
                advice: ["Read 'Sapiens' by Yuval Noah Harari.", "Visit a museum next weekend.", "Proceed to Level 2: War & Strategy!"],
                relatedArticleSlug: "ancient-philosophy"
            },
            {
                type: "wrong",
                title: "History Student",
                description: "You missed a few dates and names, but that's okay. History is vast.",
                imageGradient: "from-stone-500 to-stone-700",
                analysis: "Don't worry. History is often taught poorly in schools. It's not about dates; it's about stories.",
                advice: ["Watch a historical documentary on Netflix.", "Start with our Ancient Philosophy guide.", "Try again!"],
                relatedArticleSlug: "ancient-philosophy"
            }
        ]
    },
    // --- HISTORY SERIES LEVEL 2 ---
    {
        id: "history-level-2",
        slug: "history-war-strategy",
        title: "History 201: War & Strategy",
        description: "The fate of nations was decided on the battlefield. Do you know the great commanders and their tactics?",
        imageUrl: "https://images.unsplash.com/photo-1599388537604-e593976374f1?auto=format&fit=crop&q=80&w=1000", // Helmet/War
        difficulty: "Intermediate",
        nextTestSlug: "history-forgotten-empires",
        questions: [
            {
                id: 1,
                text: "Which general crossed the Alps with elephants to attack Rome?",
                imageUrl: "https://loremflickr.com/800/600/elephant",
                options: [
                    { text: "Napoleon", value: "wrong" },
                    { text: "Hannibal", value: "correct" },
                    { text: "Attila the Hun", value: "wrong" },
                    { text: "Scipio Africanus", value: "wrong" }
                ]
            },
            {
                id: 2,
                text: "The 'Trojan Horse' was used to enter which city?",
                imageUrl: "https://loremflickr.com/800/600/horse",
                options: [
                    { text: "Troy", value: "correct" },
                    { text: "Sparta", value: "wrong" },
                    { text: "Constantinople", value: "wrong" },
                    { text: "Jerusalem", value: "wrong" }
                ]
            },
            {
                id: 3,
                text: "Who wrote 'The Art of War'?",
                imageUrl: "https://loremflickr.com/800/600/scroll",
                options: [
                    { text: "Sun Tzu", value: "correct" },
                    { text: "Machiavelli", value: "wrong" },
                    { text: "Confucius", value: "wrong" },
                    { text: "Miyamoto Musashi", value: "wrong" }
                ]
            }
        ],
        results: [
            {
                type: "correct",
                title: "Master Strategist",
                description: "Victory is yours! You understand the complex chess game of history.",
                imageGradient: "from-red-700 to-slate-900",
                analysis: "You see conflict not just as violence, but as a clash of wills and intellect. You likely have a strategic mind.",
                advice: ["Read 'The Art of War' if you haven't yet.", "Apply strategic thinking to your career.", "Onward to Level 3: Forgotten Empires!"],
                relatedArticleSlug: "ancient-philosophy"
            },
            {
                type: "wrong",
                title: "Raw Recruit",
                description: "You stumbled on the battlefield. Time to retreat and regroup.",
                imageGradient: "from-green-700 to-emerald-900",
                analysis: "Strategy requires studying the past errors of others. You have more to learn about the great conflicts.",
                advice: ["Read about the Punic Wars.", "Watch 'Gladiator' or 'Troy' (even if Hollywoodized).", "Retake the test."],
                relatedArticleSlug: "ancient-philosophy"
            }
        ]
    },
    // --- HISTORY SERIES LEVEL 3 ---
    {
        id: "history-level-3",
        slug: "history-forgotten-empires",
        title: "History 301: Deep History",
        description: "Beyond the textbooks. Only true historians know these forgotten truths.",
        imageUrl: "https://images.unsplash.com/photo-1518331483807-f64201c80081?auto=format&fit=crop&q=80&w=1000", // Ruins
        difficulty: "Expert",
        questions: [
            {
                id: 1,
                text: "Which city is considered the oldest continuously inhabited city in the world?",
                imageUrl: "https://images.unsplash.com/photo-1549141940-1e5f3ad8a4e3?auto=format&fit=crop&q=80&w=800",
                options: [
                    { text: "Damascus (Syria)", value: "correct" },
                    { text: "Rome (Italy)", value: "wrong" },
                    { text: "Beijing (China)", value: "wrong" },
                    { text: "Cairo (Egypt)", value: "wrong" }
                ]
            },
            {
                id: 2,
                text: "The 'Library of Alexandria' was located in which modern-day country?",
                imageUrl: "https://loremflickr.com/800/600/library",
                options: [
                    { text: "Greece", value: "wrong" },
                    { text: "Egypt", value: "correct" },
                    { text: "Turkey", value: "wrong" },
                    { text: "Italy", value: "wrong" }
                ]
            },
            {
                id: 3,
                text: "Which empire existed BEFORE the Romans in Italy?",
                imageUrl: "https://loremflickr.com/800/600/statue",
                options: [
                    { text: "The Etruscans", value: "correct" },
                    { text: "The Minoans", value: "wrong" },
                    { text: "The Carthaginians", value: "wrong" },
                    { text: "The Gauls", value: "wrong" }
                ]
            }
        ],
        results: [
            {
                type: "correct",
                title: "Keeper of Knowledge",
                description: "Astounding. You are a walking library of human heritage.",
                imageGradient: "from-yellow-700 to-orange-900",
                analysis: `You belong to an elite group who remembers what the world has forgotten. Your knowledge of deep history gives you a unique perspective on the present. 
                
                You understand that "civilization" is fragile and cyclical. Cities rise and fall, languages die, but knowledge—if preserved—endures. You are a guardian of that flame.`,
                advice: [
                    "Consider visiting Gobekli Tepe in Turkey (the world's oldest temple).",
                    "Start learning a dead language like Latin or Sumerian.",
                    "Your perspective is rare; share it with others."
                ],
                relatedArticleSlug: "ancient-philosophy"
            },
            {
                type: "wrong",
                title: "Modern Mind",
                description: "You are firmly planted in the present. The deep past is still a blur.",
                imageGradient: "from-blue-800 to-indigo-900",
                analysis: "Deep history is full of surprises. It challenges our assumptions that 'we are the best'. There is much wisdom buried in the sands of time waiting for you.",
                advice: ["Read '1177 B.C.: The Year Civilization Collapsed'.", "Explore the history of the Bronze Age.", "Review Level 2."],
                relatedArticleSlug: "ancient-philosophy"
            }
        ]
    }
];
