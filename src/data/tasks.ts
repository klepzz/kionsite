export type TaskCategory = 'short' | 'medium' | 'long';

export interface Task {
  text: { en: string; tr: string };
  category: TaskCategory;
}

export const dailyTasks: Task[] = [
  // SHORT ON TIME
  { text: { en: "Drink a large glass of water right now 💧", tr: "Hemen kocaman bir bardak su iç 💧" }, category: "short" },
  { text: { en: "Take 10 deep, slow breaths 😮‍💨", tr: "10 derin ve yavaş nefes al 😮‍💨" }, category: "short" },
  { text: { en: "Stretch your neck and shoulders right now 💆", tr: "Şu an boynunu ve omuzlarını esnet 💆" }, category: "short" },
  { text: { en: "Do 10 pushups or situps 💪", tr: "10 şınav veya mekik çek 💪" }, category: "short" },
  { text: { en: "Smile at yourself in the mirror 😄", tr: "Aynada kendine gülümse 😄" }, category: "short" },
  { text: { en: "Stand up and touch your toes 10 times 🤸", tr: "Ayağa kalk ve 10 kez ayak parmaklarına dokun 🤸" }, category: "short" },
  
  // HAVE SOME TIME
  { text: { en: "Do a 5-minute stretch routine 🧘", tr: "5 dakikalık esneme rutini yap 🧘" }, category: "medium" },
  { text: { en: "Listen to an interesting 10-minute podcast 🎙️", tr: "10 dakikalık ilginç bir podcast dinle 🎙️" }, category: "medium" },
  { text: { en: "Try a quick 5-minute home workout 🏋️", tr: "Evde 5 dakikalık hızlı bir egzersiz yap 🏋️" }, category: "medium" },
  { text: { en: "Meditate in silence for 5 minutes 😌", tr: "Sessizlik içinde 5 dakika meditasyon yap 😌" }, category: "medium" },
  { text: { en: "Write down 3 things you are grateful for 📝", tr: "Şükran duyduğun 3 şeyi bir yere yaz 📝" }, category: "medium" },
  { text: { en: "Call a friend you haven't spoken to in a while 📱", tr: "Uzun zamandır konuşmadığın bir arkadaşını ara 📱" }, category: "medium" },

  // PLENTY OF TIME
  { text: { en: "Go for a 20-minute light jog outside 🏃", tr: "Dışarıda 20 dakikalık hafif bir koşuya çık 🏃" }, category: "long" },
  { text: { en: "Read 10 pages of a book 📖", tr: "Bir kitaptan 10 sayfa oku 📖" }, category: "long" },
  { text: { en: "Watch a TED talk you've never seen before 💡", tr: "Daha önce hiç izlemediğin bir TED konuşmasını izle 💡" }, category: "long" },
  { text: { en: "Watch the sunset or sunrise 🌅", tr: "Gün batımını veya doğumunu izle 🌅" }, category: "long" },
  { text: { en: "Learn a random new fact on Wikipedia 🧠", tr: "Wikipedia'dan rastgele yeni bir şey öğren 🧠" }, category: "long" },
  { text: { en: "Organize one small area of your room 🧹", tr: "Odanın küçük bir bölümünü düzenle 🧹" }, category: "long" }
];
