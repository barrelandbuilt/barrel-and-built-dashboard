import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  async function handleUpload() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Please log in");
    const file = inputRef.current?.files?.[0];
    if (!file) return alert("Choose a file");
    if (file.size > 2 * 1024 * 1024 * 1024) return alert("Max 2 GB");

    setBusy(true);
    const path = `${user.id}/${new Date().toISOString().slice(0,10)}/${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("player-uploads")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setBusy(false);
      return alert(upErr.message);
    }

    const { error: rowErr } = await supabase.from("uploads").insert({
      player_id: user.id,
      title,
      notes,
      storage_path: `player-uploads/${path}`,
    });

    setBusy(false);
    if (rowErr) return alert(rowErr.message);

    setMsg("Upload complete. Your coach will review it soon.");
    setTitle("");
    setNotes("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={{border:"1px solid #eee",borderRadius:12,padding:12}}>
      <input
        placeholder="Title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        style={{width:"100%",padding:10,border:"1px solid #ddd",borderRadius:10,marginBottom:8}}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={e=>setNotes(e.target.value)}
        style={{width:"100%",padding:10,border:"1px solid #ddd",borderRadius:10,marginBottom:8}}
      />
      <input type="file" ref={inputRef} accept="video/*" />
      <div style={{marginTop:8,display:"flex",gap:8}}>
        <button
          onClick={handleUpload}
          disabled={busy}
          style={{padding:"8px 14px",borderRadius:10,background:"#082010",color:"#e0d0b8",fontWeight:700}}
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>
      {msg && <p style={{marginTop:8,color:"green"}}>{msg}</p>}
      <p style={{marginTop:8,fontSize:12,opacity:.7}}>
        By uploading you confirm you own the content and grant permission for private coaching use.
      </p>
    </div>
  );
}
