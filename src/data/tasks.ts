export type TaskCategory = 'chill' | 'active' | 'focus';

export interface Task {
  text: string;
  category: TaskCategory;
}

export const dailyTasks: Task[] = [
  // CHILL
  { text: "Drink a large glass of water right now 💧", category: "chill" },
  { text: "Take 10 deep, slow breaths 😮‍💨", category: "chill" },
  { text: "Listen to a song from a genre you don't usually listen to 🎵", category: "chill" },
  { text: "Drink a cup of tea in total silence 🍵", category: "chill" },
  { text: "Look out the window and observe nature for 2 minutes 🌳", category: "chill" },
  { text: "Watch the sunset or sunrise 🌅", category: "chill" },
  { text: "Listen to an interesting 10-minute podcast 🎙️", category: "chill" },
  { text: "Smile at yourself in the mirror 😄", category: "chill" },
  { text: "Compliment someone today (even online) 💬", category: "chill" },
  { text: "Spend 5 minutes stretching before bed 🛌", category: "chill" },
  
  // ACTIVE
  { text: "Go for a 20-minute light jog outside 🏃", category: "active" },
  { text: "Do a 5-minute stretch routine 🧘", category: "active" },
  { text: "Walk around your house for 2 minutes 🚶", category: "active" },
  { text: "Do 10 pushups or situps 💪", category: "active" },
  { text: "Stretch your neck and shoulders right now 💆", category: "active" },
  { text: "Do one chore you've been putting off 🧹", category: "active" },
  { text: "Organize one small area of your room 🧹", category: "active" },
  { text: "Try a quick 5-minute home workout 🏋️", category: "active" },
  { text: "Stand up and touch your toes 10 times 🤸", category: "active" },
  { text: "Do 20 jumping jacks right now ⚡", category: "active" },

  // FOCUS
  { text: "Write down 3 things you are grateful for 📝", category: "focus" },
  { text: "Read 10 pages of a book 📖", category: "focus" },
  { text: "Call a friend you haven't spoken to in a while 📱", category: "focus" },
  { text: "Meditate in silence for 5 minutes 😌", category: "focus" },
  { text: "Learn how to say 'Hello' in 3 new languages 🌍", category: "focus" },
  { text: "Write a positive review for a small business you like ⭐", category: "focus" },
  { text: "Unsubscribe from 3 junk emails in your inbox 📧", category: "focus" },
  { text: "Learn a random new fact on Wikipedia 🧠", category: "focus" },
  { text: "Watch a TED talk you've never seen before 💡", category: "focus" },
  { text: "Write down your main goal for tomorrow 🎯", category: "focus" },
  { text: "Try not to look at your phone for the next hour 🚫📱", category: "focus" }
];
