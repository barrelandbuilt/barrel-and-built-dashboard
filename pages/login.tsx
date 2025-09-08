import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL}/app`,
      },
    });
    if (!error) setSent(true);
    else alert(error.message);
  }

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#082010",color:"#e0d0b8"}}>
      <form onSubmit={handleLogin} style={{background:"white",color:"#082010",padding:24,borderRadius:16,width:360,boxShadow:"0 10px 30px rgba(0,0,0,.08)"}}>
        <h1 style={{fontWeight:800,fontSize:22,marginBottom:8}}>Player Login</h1>
        <p style={{fontSize:14,opacity:.8,marginBottom:16}}>Enter your email to get a magic link.</p>
        <input type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:12,border:"1px solid #d1d5db",borderRadius:12,marginBottom:12}}/>
        <button type="submit" style={{width:"100%",padding:12,borderRadius:12,background:"#082010",color:"#e0d0b8",fontWeight:700}}>
          Send Link
        </button>
        {sent && <p style={{marginTop:12,fontSize:13,color:"green"}}>Check your inbox for your login link.</p>}
      </form>
    </main>
  );
}
