import Image from "next/image";
import "./fight-poster.css";

export default function Home() {
  return (
    <main className="fight-poster">
      <Image src="/burc-ruhsat-maci.png" alt="Burç Kara'nın ruhsat koruma maçı için yüzleşme" fill priority sizes="100vw" className="fight-poster-image" />
      <div className="fight-poster-shade" aria-hidden="true" />
      <h1 className="fight-poster-title">
        <span className="fight-poster-kicker">MİLLİ GURUR</span>
        <span className="fight-poster-name">BURÇ KARA</span>
        <span className="fight-poster-announcement">
          RUHSATINI ALDIĞI GÜNÜN AKŞAMI<br />
          RUHSAT KORUMA MAÇINA ÇIKIYOR
        </span>
      </h1>
    </main>
  );
}
