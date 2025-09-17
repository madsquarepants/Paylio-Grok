export default function handler(_req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!doctype html>
<html><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Paylio – API Console</title>
  <style>
    body{font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:24px}
    .card{border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:12px 0}
    button{padding:8px 12px;border:0;border-radius:8px;background:#4f46e5;color:#fff;cursor:pointer}
    pre{background:#f9fafb;padding:12px;border-radius:8px;overflow:auto}
    .row{display:flex;gap:12px;align-items:center}
    .muted{color:#6b7280}
  </style>
</head><body>
  <h1>Paylio – API Console</h1>
  <p class="muted">This page hits your API routes under <code>/api/*</code>.</p>

  <div class="card">
    <div class="row">
      <button id="auto">Sandbox Auto-Connect</button>
      <span class="muted">Creates a Plaid sandbox item for <code>demo-user</code>.</span>
    </div>
    <div id="autoOut"></div>
  </div>

  <div class="card">
    <div class="row"><button id="acc">Get Accounts</button><span class="muted">needs auto-connect</span></div>
    <pre id="accOut"></pre>
  </div>

  <div class="card">
    <div class="row"><button id="tx">Get Transactions (30d)</button><span class="muted">needs auto-connect</span></div>
    <pre id="txOut"></pre>
  </div>

<script>
async function post(p,b){const r=await fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b||{})});if(!r.ok)throw new Error(await r.text());return r.json()}
async function get(p,q){const s=q?"?"+new URLSearchParams(q).toString():"";const r=await fetch(p+s);if(!r.ok)throw new Error(await r.text());return r.json()}
function show(el,d){el.textContent=typeof d==="string"?d:JSON.stringify(d,null,2)}
const user="demo-user";
document.getElementById("auto").onclick=async()=>{
  const el=document.getElementById("autoOut"); el.textContent="Running…";
  try{const r=await post("/api/plaid/sandbox/auto-connect",{user_id:user}); el.textContent="OK ✓ "+JSON.stringify(r)}
  catch(e){el.textContent="Error: "+e.message}
};
document.getElementById("acc").onclick=async()=>{
  const el=document.getElementById("accOut"); el.textContent="Loading…";
  try{show(el, await get("/api/plaid/accounts",{user_id:user}))}
  catch(e){show(el,"Error: "+e.message)}
};
document.getElementById("tx").onclick=async()=>{
  const el=document.getElementById("txOut"); el.textContent="Loading…";
  try{show(el, await get("/api/plaid/transactions",{user_id:user,days:30}))}
  catch(e){show(el,"Error: "+e.message)}
};
</script>
</body></html>`);
}
