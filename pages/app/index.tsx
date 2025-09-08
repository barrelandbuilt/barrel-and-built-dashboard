import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import UploadBox from "../../ui/UploadBox";

export default function AppHome() {
  const [session, setSession] = useState<any>(null);
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("uploads")
      .select("id,title,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setUploads(data);
      });
  }, [session]);

  if (!session) return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center"}}>
      <Link href="/login">Log in</Link>
    </main>
  );

  return (
    <main style={{maxWidth:960,margin:"0 auto",padding:24}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{fontWeight:800,fontSize:24}}>Your Dashboard</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{padding:"8px 14px",borderRadius:10,border:"1px solid #ddd"}}
        >
          Sign out
        </button>
      </header>

      <section style={{marginBottom:24}}>
        <h2 style={{fontWeight:700,marginBottom:8}}>Upload a swing</h2>
        <UploadBox />
      </section>

      <section>
        <h2 style={{fontWeight:700,marginBottom:8}}>Recent threads</h2>
        <ul style={{display:"grid",gap:8}}>
          {uploads.map(u => (
            <li key={u.id} style={{padding:12,border:"1px solid #eee",borderRadius:12}}>
              <Link href={`/app/uploads/${u.id}`}>{u.title ?? "Untitled upload"}</Link>
              <div style={{fontSize:12,opacity:.6}}>{new Date(u.created_at).toLocaleString()}</div>
            </li>
          ))}
          {uploads.length === 0 && <li>No uploads yet</li>}
        </ul>
      </section>
    </main>
  );
}
