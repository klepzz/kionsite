import Image from "next/image";
import "./fight-poster.css";

export default function Home() {
  return (
    <main className="chairman-poster">
      <div className="chairman-photo">
        <Image src="/burc-kara-baskan.png" alt="Av. Burç Kara" fill priority sizes="(max-width: 600px) 100vw, 600px" />
      </div>
      <h1 className="chairman-title">
        <span className="chairman-organization">EV GENÇLERİ</span>
        <span className="chairman-role">SİLİVRİ İLÇE BAŞKANIMIZ</span>
        <span className="chairman-name">AV. BURÇ KARA</span>
      </h1>
    </main>
  );
}
