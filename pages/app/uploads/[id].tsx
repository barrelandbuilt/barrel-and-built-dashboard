import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function UploadThread() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [upload, setUpload] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase.from("uploads").select("*").eq("id", id).single().then(({ data }) => setUpload(data));
    supabase.from("responses").select("*").eq("upload_id", id).order("created_at", { ascending: true })
      .then(({ data }) => setResponses(data || []));
  }, [id]);

  return (
    <main style={{maxWidth:960,margin:"0 auto",padding:24}}>
      <button onClick={() => router.push("/app")} style={{marginBottom:12}}>{"←"} Back</button>
      <h1 style={{fontWeight:800,fontSize:22,marginBottom:8}}>{upload?.title ?? "Upload"}</h1>
      <p style={{opacity:.8,marginBottom:16}}>{upload?.notes}</p>

      <section style={{display:"grid",gap:12}}>
        {responses.map(r => (
          <article key={r.id} style={{border:"1px solid #eee",borderRadius:12,padding:12}}>
            <div style={{fontSize:12,opacity:.6,marginBottom:8}}>{new Date(r.created_at).toLocaleString()}</div>
            <video src={"/api/signed?path=" + encodeURIComponent(r.storage_path)} controls style={{width:"100%",borderRadius:12,background:"#000"}}/>
            {r.transcript && <p style={{marginTop:8,fontSize:14}}>{r.transcript}</p>}
          </article>
        ))}
        {responses.length === 0 && <p>No coach responses yet.</p>}
      </section>
    </main>
  );
}
