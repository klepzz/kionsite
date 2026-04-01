export type TaskCategory = 'chill' | 'active' | 'focus';

export interface Task {
  text: { en: string; tr: string };
  category: TaskCategory;
}

export const dailyTasks: Task[] = [
  // CHILL
  { text: { en: "Drink a large glass of water right now 💧", tr: "Hemen kocaman bir bardak su iç 💧" }, category: "chill" },
  { text: { en: "Take 10 deep, slow breaths 😮‍💨", tr: "10 derin ve yavaş nefes al 😮‍💨" }, category: "chill" },
  { text: { en: "Listen to a song from a genre you don't usually listen to 🎵", tr: "Normalde dinlemediğin bir türden şarkı dinle 🎵" }, category: "chill" },
  { text: { en: "Drink a cup of tea in total silence 🍵", tr: "Tam bir sessizlik içinde bir fincan çay iç 🍵" }, category: "chill" },
  { text: { en: "Look out the window and observe nature for 2 minutes 🌳", tr: "Pencereden dışarı bak ve 2 dakika doğayı izle 🌳" }, category: "chill" },
  { text: { en: "Watch the sunset or sunrise 🌅", tr: "Gün batımını veya doğumunu izle 🌅" }, category: "chill" },
  { text: { en: "Listen to an interesting 10-minute podcast 🎙️", tr: "10 dakikalık ilginç bir podcast dinle 🎙️" }, category: "chill" },
  { text: { en: "Smile at yourself in the mirror 😄", tr: "Aynada kendine gülümse 😄" }, category: "chill" },
  { text: { en: "Compliment someone today (even online) 💬", tr: "Bugün birine iltifat et (internetten olsa bile) 💬" }, category: "chill" },
  { text: { en: "Spend 5 minutes stretching before bed 🛌", tr: "Uyumadan önce 5 dakika esneme yap 🛌" }, category: "chill" },
  
  // ACTIVE
  { text: { en: "Go for a 20-minute light jog outside 🏃", tr: "Dışarıda 20 dakikalık hafif bir koşuya çık 🏃" }, category: "active" },
  { text: { en: "Do a 5-minute stretch routine 🧘", tr: "5 dakikalık esneme rutini yap 🧘" }, category: "active" },
  { text: { en: "Walk around your house for 2 minutes 🚶", tr: "2 dakika boyunca evin içinde yürü 🚶" }, category: "active" },
  { text: { en: "Do 10 pushups or situps 💪", tr: "10 şınav veya mekik çek 💪" }, category: "active" },
  { text: { en: "Stretch your neck and shoulders right now 💆", tr: "Şu an boynunu ve omuzlarını esnet 💆" }, category: "active" },
  { text: { en: "Do one chore you've been putting off 🧹", tr: "Ertelediğin küçük bir ev işini yap 🧹" }, category: "active" },
  { text: { en: "Organize one small area of your room 🧹", tr: "Odanın küçük bir bölümünü düzenle 🧹" }, category: "active" },
  { text: { en: "Try a quick 5-minute home workout 🏋️", tr: "Evde 5 dakikalık hızlı bir egzersiz yap 🏋️" }, category: "active" },
  { text: { en: "Stand up and touch your toes 10 times 🤸", tr: "Ayağa kalk ve 10 kez ayak parmaklarına dokun 🤸" }, category: "active" },
  { text: { en: "Do 20 jumping jacks right now ⚡", tr: "Hemen şimdi 20 şınav zıplaması (jumping jack) yap ⚡" }, category: "active" },

  // FOCUS
  { text: { en: "Write down 3 things you are grateful for 📝", tr: "Şükran duyduğun 3 şeyi bir yere yaz 📝" }, category: "focus" },
  { text: { en: "Read 10 pages of a book 📖", tr: "Bir kitaptan 10 sayfa oku 📖" }, category: "focus" },
  { text: { en: "Call a friend you haven't spoken to in a while 📱", tr: "Uzun zamandır konuşmadığın bir arkadaşını ara 📱" }, category: "focus" },
  { text: { en: "Meditate in silence for 5 minutes 😌", tr: "Sessizlik içinde 5 dakika meditasyon yap 😌" }, category: "focus" },
  { text: { en: "Learn how to say 'Hello' in 3 new languages 🌍", tr: "3 farklı dilde 'Merhaba' demeyi öğren 🌍" }, category: "focus" },
  { text: { en: "Write a positive review for a small business you like ⭐", tr: "Sevdiğin küçük bir işletme için olumlu bir yorum yaz ⭐" }, category: "focus" },
  { text: { en: "Unsubscribe from 3 junk emails in your inbox 📧", tr: "Gelen kutundaki 3 gereksiz e-postadan aboneliğini çık 📧" }, category: "focus" },
  { text: { en: "Learn a random new fact on Wikipedia 🧠", tr: "Wikipedia'dan rastgele yeni bir şey öğren 🧠" }, category: "focus" },
  { text: { en: "Watch a TED talk you've never seen before 💡", tr: "Daha önce hiç izlemediğin bir TED konuşmasını izle 💡" }, category: "focus" },
  { text: { en: "Write down your main goal for tomorrow 🎯", tr: "Yarın için ana hedefini bir yere not et 🎯" }, category: "focus" },
  { text: { en: "Try not to look at your phone for the next hour 🚫📱", tr: "Önümüzdeki bir saat boyunca telefonuna bakmamaya çalış 🚫📱" }, category: "focus" }
];
