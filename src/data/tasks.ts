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
  { text: { en: "Send a quick positive text to a friend ✉️", tr: "Bir arkadaşına kısa ve pozitif bir mesaj at ✉️" }, category: "short" },
  { text: { en: "Blink your eyes quickly 20 times to rehydrate them 👀", tr: "Gözlerini nemlendirmek için 20 kez hızlı hızlı göz kırp 👀" }, category: "short" },
  { text: { en: "Look away from the screen for 20 seconds 🌿", tr: "Ekrana bakmayı bırakıp 20 saniye uzağa bak 🌿" }, category: "short" },
  { text: { en: "Fix your posture and sit up straight 🧍", tr: "Duruşunu düzelt ve dik otur 🧍" }, category: "short" },
  { text: { en: "Think of 1 thing you are grateful for today ✨", tr: "Bugün için şükrettiğin 1 şeyi düşün ✨" }, category: "short" },
  { text: { en: "Wash your face with cold water 💦", tr: "Yüzünü soğuk suyla yıka 💦" }, category: "short" },
  { text: { en: "Tidy up your physical desktop space for 1 minute 🧹", tr: "Masanı 1 dakika boyunca hızlıca toparla 🧹" }, category: "short" },
  { text: { en: "Do 15 jumping jacks right now 🏃", tr: "Şimdi 15 tane zıplama hareketi (jumping jack) yap 🏃" }, category: "short" },
  { text: { en: "Drink a warm cup of water 🍵", tr: "Bir bardak ılık su iç 🍵" }, category: "short" },

  // HAVE SOME TIME
  { text: { en: "Do a 5-minute stretch routine 🧘", tr: "5 dakikalık esneme rutini yap 🧘" }, category: "medium" },
  { text: { en: "Listen to an interesting 10-minute podcast 🎙️", tr: "10 dakikalık ilginç bir podcast dinle 🎙️" }, category: "medium" },
  { text: { en: "Try a quick 5-minute home workout 🏋️", tr: "Evde 5 dakikalık hızlı bir egzersiz yap 🏋️" }, category: "medium" },
  { text: { en: "Meditate in silence for 5 minutes 😌", tr: "Sessizlik içinde 5 dakika meditasyon yap 😌" }, category: "medium" },
  { text: { en: "Write down 3 things you are grateful for 📝", tr: "Şükran duyduğun 3 şeyi bir yere yaz 📝" }, category: "medium" },
  { text: { en: "Call a friend you haven't spoken to in a while 📱", tr: "Uzun zamandır konuşmadığın bir arkadaşını ara 📱" }, category: "medium" },
  { text: { en: "Listen to 2 songs you loved as a teenager 🎧", tr: "Gençken çok sevdiğin 2 şarkıyı dinle 🎧" }, category: "medium" },
  { text: { en: "Make a quick cup of tea or coffee ☕", tr: "Kendine hızlıca bir çay veya kahve yap ☕" }, category: "medium" },
  { text: { en: "Do a 8-minute core workout on YouTube 💪", tr: "YouTube'dan 8 dakikalık bir karın egzersizi yap 💪" }, category: "medium" },
  { text: { en: "Unsubscribe from 5 promotional emails 📧", tr: "Gereksiz 5 promosyon e-postasından aboneliğini iptal et 📧" }, category: "medium" },
  { text: { en: "Write down your top 3 goals for tomorrow 🎯", tr: "Yarın için en önemli 3 hedefini not al 🎯" }, category: "medium" },
  { text: { en: "Read 1 useful article on Medium or similar platforms 📄", tr: "Medium veya benzeri bir platformda 1 faydalı makale oku 📄" }, category: "medium" },
  { text: { en: "Wipe down your desktop and keyboard ✨", tr: "Masanı ve klavyeni sil ✨" }, category: "medium" },
  { text: { en: "Do 3 sets of 10 squats 🏋️‍♂️", tr: "3 set 10 tekrar squat yap 🏋️‍♂️" }, category: "medium" },

  // PLENTY OF TIME
  { text: { en: "Go for a 20-minute light jog outside 🏃", tr: "Dışarıda 20 dakikalık hafif bir koşuya çık 🏃" }, category: "long" },
  { text: { en: "Read 10 pages of a book 📖", tr: "Bir kitaptan 10 sayfa oku 📖" }, category: "long" },
  { text: { en: "Watch a TED talk you've never seen before 💡", tr: "Daha önce hiç izlemediğin bir TED konuşmasını izle 💡" }, category: "long" },
  { text: { en: "Watch the sunset or sunrise 🌅", tr: "Gün batımını veya doğumunu izle 🌅" }, category: "long" },
  { text: { en: "Learn a random new fact on Wikipedia 🧠", tr: "Wikipedia'dan rastgele yeni bir şey öğren 🧠" }, category: "long" },
  { text: { en: "Organize one small area of your room 🧹", tr: "Odanın küçük bir bölümünü düzenle 🧹" }, category: "long" },
  { text: { en: "Cook a healthy meal from scratch 🥗", tr: "Sıfırdan sağlıklı bir yemek pişir 🥗" }, category: "long" },
  { text: { en: "Watch a 30-minute documentary on a topic you don't know 🎞️", tr: "Bilmediğin bir konuda 30 dakikalık belgesel izle 🎞️" }, category: "long" },
  { text: { en: "Take a 30-minute walk while listening to an audiobook 🎧", tr: "Sesli kitap dinlerken 30 dakikalık bir yürüyüş yap 🎧" }, category: "long" },
  { text: { en: "Spend 20 minutes learning basics of a new language 🌍", tr: "Yeni bir dilin temellerini öğrenmek için 20 dakika ayır 🌍" }, category: "long" },
  { text: { en: "Do a 20-minute full body stretching routine 🧘‍♀️", tr: "20 dakikalık tüm vücut esneme rutini yap 🧘‍♀️" }, category: "long" },
  { text: { en: "Take a relaxing warm bath or a long shower 🛁", tr: "Rahatlatıcı sıcak bir banyo veya uzun bir duş al 🛁" }, category: "long" },
  { text: { en: "Declutter your phone gallery for 15 minutes 📱", tr: "15 dakika boyunca telefon galerindeki gereksiz parçaları temizle 📱" }, category: "long" },
  { text: { en: "Write a diary entry about how you felt today 📓", tr: "Bugün nasıl hissettiğin hakkında günlüğe bir yazı yaz 📓" }, category: "long" }
];
