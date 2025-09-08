import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function Progress() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("metrics")
      .select("date, exit_velo, contact_pct, avg_distance_ft")
      .order("date", { ascending: true })
      .then(({ data }) => setRows(data || []));
  }, []);

  return (
    <main style={{maxWidth:960,margin:"0 auto",padding:24}}>
      <h1 style={{fontWeight:800,fontSize:24,marginBottom:16}}>Progress</h1>
      <div style={{height:360,background:"#fff",border:"1px solid #eee",borderRadius:12,padding:12}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="exit_velo" stroke="#082010" dot={false} name="Exit Velo" />
            <Line type="monotone" dataKey="contact_pct" stroke="#4b7f6a" dot={false} name="Contact %" />
            <Line type="monotone" dataKey="avg_distance_ft" stroke="#b08c4a" dot={false} name="Avg Distance (ft)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
