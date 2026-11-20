"use client";
import { useEffect, useRef, useState } from "react";
import { FileImage, Plus, ArrowUpRight, ShieldCheck, FileText, Download, X, ArrowUp, ArrowDown, LoaderCircle } from "lucide-react";
import "./converter.css";
type Item = { id: string; file: File; url: string };
export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState("a4"), [orientation, setOrientation] = useState("auto"), [margin, setMargin] = useState("24");
  const [busy, setBusy] = useState(false), [drag, setDrag] = useState(false), [error, setError] = useState(""), [result, setResult] = useState(""), [progress, setProgress] = useState(0);
  const picker = useRef<HTMLInputElement>(null), urls = useRef(new Set<string>());
  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);
  function reset() { setError(""); if (result) { URL.revokeObjectURL(result); urls.current.delete(result); setResult(""); } }
  function add(files: FileList) {
    if (busy) return; reset(); const accepted: Item[] = []; let rejected = 0;
    for (const file of Array.from(files)) {
      if (!/\.(jpe?g|png)$/i.test(file.name) || !["image/jpeg", "image/png", ""].includes(file.type) || file.size > 20 * 1024 * 1024) { rejected++; continue; }
      if (items.length + accepted.length >= 50) { rejected++; continue; }
      const url = URL.createObjectURL(file); urls.current.add(url); accepted.push({ id: crypto.randomUUID(), file, url });
    }
    setItems(old => [...old, ...accepted]); if (rejected) setError(`${rejected} dosya eklenemedi. JPG/PNG seçin: dosya başına 20 MB, toplam 50 görsel sınırı vardır.`);
  }
  function remove(id: string) { reset(); const item = items.find(x => x.id === id); if (item) { URL.revokeObjectURL(item.url); urls.current.delete(item.url); } setItems(old => old.filter(x => x.id !== id)); }
  function move(i: number, d: number) { reset(); setItems(old => { const next = [...old]; [next[i], next[i+d]] = [next[i+d], next[i]]; return next; }); }
  async function convert() {
    reset(); setBusy(true); setProgress(0);
    try {
      const { PDFDocument } = await import("pdf-lib"); const doc = await PDFDocument.create(); doc.setCreator("kion.online");
      for (let i = 0; i < items.length; i++) {
        const img = new Image(); img.src = items[i].url;
        try { await img.decode(); } catch { throw new Error(`${items[i].file.name} okunamadı. Geçerli bir JPG veya PNG seçin.`); }
        if (img.naturalWidth * img.naturalHeight > 80000000) throw new Error("Görsel çözünürlüğü çok yüksek. Daha küçük bir görsel seçin.");
        const scale = Math.min(1, 3200 / Math.max(img.naturalWidth, img.naturalHeight)); const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(img.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Tarayıcınız görsel işlemeyi desteklemiyor.");
        ctx.fillStyle = "white"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const image = await doc.embedJpg(canvas.toDataURL("image/jpeg", .94)); const pad = Number(margin); let w = 595.28, h = 841.89;
        if (format === "original") { const ratio = Math.min(1, 13000 / Math.max(img.naturalWidth, img.naturalHeight)); w = img.naturalWidth * ratio * .75 + 2*pad; h = img.naturalHeight * ratio * .75 + 2*pad; }
        else if (orientation === "landscape" || (orientation === "auto" && image.width > image.height)) [w,h] = [h,w];
        const page = doc.addPage([w,h]); const fit = Math.min((w-2*pad)/image.width,(h-2*pad)/image.height); const width = image.width*fit, height = image.height*fit;
        page.drawImage(image,{x:(w-width)/2,y:(h-height)/2,width,height}); canvas.width = 0; canvas.height = 0; setProgress(i+1); await new Promise(resolve => setTimeout(resolve,0));
      }
      const bytes = await doc.save(); const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], {type:"application/pdf"})); urls.current.add(url); setResult(url);
    } catch (e) { setError(e instanceof Error ? e.message : "PDF oluşturulamadı. Tekrar deneyin."); } finally { setBusy(false); }
  }
  return <div className="converter">
    <header><a className="brand" href="/">kion<span>.</span></a><span>Görselden PDF’ye</span><a className="private" href="#nasil"><ShieldCheck size={15}/> Dosyaların sende kalır</a></header>
    <main><section className="intro"><div className="eyebrow">● &nbsp; AZ TIKLAMA. ÇOK KOLAYLIK.</div><h1>Görsellerin bir arada.<br/><em>Tek bir PDF’de.</em></h1><p>JPG ve PNG dosyalarını ekle, sırala ve PDF olarak indir.<br/>Ücretsiz, üyeliksiz, doğrudan tarayıcında.</p></section>
    <section className="workspace" aria-label="PDF dönüştürücü"><div>
      <input ref={picker} hidden type="file" multiple accept="image/jpeg,image/png,.jpg,.jpeg,.png" disabled={busy} onChange={e => { if(e.target.files) add(e.target.files); e.target.value=""; }}/>
      <div className={`upload ${drag ? "drag" : ""}`} onDragOver={e => {e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);add(e.dataTransfer.files);}}>
      {!items.length ? <><div className="paper"><FileImage size={46} strokeWidth={1.3}/><small>JPG · PNG</small><span><Plus size={18}/></span></div><h2>Görsellerini buraya bırak</h2><p>veya cihazından dosya seç</p><button className="primary" onClick={()=>picker.current?.click()}><Plus size={19}/> Görsel seç <ArrowUpRight size={18}/></button><small className="limits">JPG, JPEG, PNG · En fazla 50 görsel · Dosya başına 20 MB</small></> : <div className="selection"><div className="selection-head"><h2>{items.length} görsel seçildi</h2><button disabled={busy || items.length >= 50} onClick={()=>picker.current?.click()}><Plus size={15}/> Görsel ekle</button></div><div className="grid">{items.map((item,i)=><article className="card" key={item.id}><span className="number">{i+1}</span><button className="remove" disabled={busy} aria-label={`${item.file.name} dosyasını kaldır`} onClick={()=>remove(item.id)}><X size={15}/></button>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.url} alt={item.file.name}/><div title={item.file.name} className="filename">{item.file.name}</div><div className="card-actions"><small>{(item.file.size/1048576).toFixed(1)} MB</small><button disabled={busy||i===0} aria-label="Öne taşı" onClick={()=>move(i,-1)}><ArrowUp size={14}/></button><button disabled={busy||i===items.length-1} aria-label="Arkaya taşı" onClick={()=>move(i,1)}><ArrowDown size={14}/></button></div></article>)}</div><p className="order">Oklarla sayfa sırasını değiştirebilirsin. Her görsel bir sayfa olur.</p></div>}
      </div><p className="local"><ShieldCheck size={16}/> Görsellerin sunucuya yüklenmez. İşlem bu cihazda gerçekleşir.</p></div>
      <aside><h2><FileText size={19}/> PDF ayarları</h2><fieldset disabled={busy}><label htmlFor="format">Sayfa boyutu</label><select id="format" value={format} onChange={e=>{setFormat(e.target.value);reset();}}><option value="a4">A4</option><option value="original">Görsel boyutu</option></select><label htmlFor="orientation">Sayfa yönü</label><select id="orientation" disabled={format==="original"} value={orientation} onChange={e=>{setOrientation(e.target.value);reset();}}><option value="auto">Otomatik</option><option value="portrait">Dikey</option><option value="landscape">Yatay</option></select><label htmlFor="margin">Kenar boşluğu</label><select id="margin" value={margin} onChange={e=>{setMargin(e.target.value);reset();}}><option value="0">Boşluk yok</option><option value="24">Küçük boşluk</option><option value="48">Geniş boşluk</option></select></fieldset><div className="summary">Toplam sayfa <strong>{items.length || "—"}</strong></div><button className="primary convert" disabled={!items.length||busy} onClick={convert}>{busy ? <><LoaderCircle className="spin" size={18}/> Hazırlanıyor {progress}/{items.length}</> : <>PDF oluştur <ArrowUpRight size={18}/></>}</button>{result && <a className="download" href={result} download="kion-gorseller.pdf"><Download size={18}/> PDF’yi indir</a>}<p className="footnote">✓ Filigran yok. Üyelik yok.</p></aside></section>
    {error&&<p role="alert" className="error">{error}</p>}{result&&<p role="status" className="success">✓ PDF hazır. “PDF’yi indir” butonuyla kaydedebilirsin.</p>}
    <section className="how" id="nasil"><div><span className="eyebrow">ÜÇ ADIMDA TAMAM</span><h2>Dosya dönüştürmek,<br/>işe dönüşmesin.</h2></div>{[["01","Görsellerini seç","Fotoğraflarını veya ekran görüntülerini JPG ve PNG olarak ekle."],["02","Kendine göre düzenle","Sayfa sırasını, boyutunu ve kenar boşluklarını ayarla."],["03","PDF’ni indir","Tüm görsellerini tek bir PDF dosyası olarak cihazına kaydet."]].map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</section></main>
    <footer><a className="brand" href="/">kion<span>.</span></a><span>Küçük araçlar. Büyük kolaylık.</span><span>JPG & PNG → PDF</span></footer>
  </div>;
}
