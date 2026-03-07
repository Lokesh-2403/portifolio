import { useState, useEffect, useRef } from "react";

export default function AIChat() {

const [open,setOpen] = useState(false);
const [booting,setBooting] = useState(false);
const [message,setMessage] = useState("");
const [messages,setMessages] = useState<any[]>([]);
const [loading,setLoading] = useState(false);

const chatEndRef = useRef<HTMLDivElement | null>(null);

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages,loading]);

useEffect(()=>{

if(open){
setBooting(true);

setTimeout(()=>{
setBooting(false);
},1800);

}

},[open]);

const quickQuestions = [
"Who is Lokesh?",
"Show Lokesh's projects",
"What technologies does Lokesh use?",
"How can I contact Lokesh?"
];

const sendMessage = async (text?:string) => {

const msg = text || message;

if(!msg.trim()) return;

const userMessage = {role:"user",text:msg};

setMessages(prev=>[...prev,userMessage]);

setMessage("");

setLoading(true);

try{

const response = await fetch("/api/assistant",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:msg})
});

const data = await response.json();

typeAIResponse(data.reply);

}catch{

setMessages(prev=>[
...prev,
{role:"ai",text:"⚠️ AI assistant unavailable."}
]);

}

setLoading(false);

};

const typeAIResponse = (text:string) => {

let i=0;
let current="";

const interval=setInterval(()=>{

current += text.charAt(i);

setMessages(prev=>{
const last = prev[prev.length-1];

if(last?.role==="ai_typing"){

const updated=[...prev];
updated[updated.length-1]={role:"ai_typing",text:current};
return updated;

}else{

return [...prev,{role:"ai_typing",text:current}];

}

});

i++;

if(i>=text.length){

clearInterval(interval);

setMessages(prev=>{
const updated=[...prev];
updated[updated.length-1]={role:"ai",text};
return updated;
});

}

},15);

};

const handleKeyPress = (e:any) => {
if(e.key==="Enter") sendMessage();
};

return(

<>

<style>{`

@keyframes float {
0%{transform:translateY(0px)}
50%{transform:translateY(-5px)}
100%{transform:translateY(0px)}
}

.logo{
animation:float 3s ease-in-out infinite;
position:relative;
overflow:hidden;
}

/* cyber scan line */

.scanline{
position:absolute;
top:0;
left:0;
width:100%;
height:2px;
background:linear-gradient(90deg, transparent, #06b6d4, transparent);
opacity:0.8;
animation:scanMove 2s linear infinite;
}

@keyframes scanMove{
0%{
transform:translateY(0);
opacity:0;
}
20%{
opacity:1;
}
80%{
opacity:1;
}
100%{
transform:translateY(70px);
opacity:0;
}
}

`}</style>

{/* Floating AI Button */}

<div
onClick={()=>setOpen(prev => !prev)}
style={{
position:"fixed",
bottom:"25px",
right:"25px",
width:"70px",
height:"70px",
cursor:"pointer",
zIndex:9999
}}
>

<div className="logo"
style={{
width:"70px",
height:"70px",
position:"relative",
overflow:"hidden"
}}
>

<img
src="/ai-logo.png"
style={{
width:"70px",
height:"70px",
filter:"drop-shadow(0 0 6px rgba(6,182,212,0.5))"
}}
/>

<div className="scanline"></div>

</div>

</div>


{/* Chat Window */}

{open && (

<div
style={{
position:"fixed",
bottom:"110px",
right:"25px",
width:"360px",
height:"550px",
background:"rgba(0,0,0,0.92)",
borderRadius:"18px",
border:"1px solid rgba(0,255,255,0.4)",
boxShadow:"0 0 10px rgba(0,255,255,0.15)",
display:"flex",
flexDirection:"column",
overflow:"hidden",
zIndex:9999
}}
>

{/* Header */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
padding:"12px",
borderBottom:"1px solid rgba(0,255,255,0.3)"
}}
>

<img src="/ai-logo.png" style={{width:"26px"}} />

<span
style={{
color:"#06b6d4",
fontWeight:"bold",
letterSpacing:"1px"
}}
>
Cyber AI
</span>

</div>


{/* Boot Screen */}

{booting ? (

<div
style={{
flex:1,
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
color:"#06b6d4",
fontSize:"13px",
gap:"6px"
}}
>

<div>Initializing AI Core...</div>
<div>Loading Cyber Modules...</div>
<div>Scanning Portfolio...</div>
<div>System Ready</div>

</div>

) : (

<>

{/* Suggested Questions */}

{messages.length===0 && (

<div
style={{
padding:"12px",
display:"flex",
flexWrap:"wrap",
gap:"8px",
borderBottom:"1px solid rgba(6,182,212,0.25)"
}}
>

{quickQuestions.map((q,index)=>(

<button
key={index}
onClick={()=>sendMessage(q)}
style={{
background:"#020617",
color:"#22d3ee",
border:"1px solid rgba(6,182,212,0.4)",
borderRadius:"20px",
padding:"6px 12px",
fontSize:"12px",
cursor:"pointer"
}}
>
{q}
</button>

))}

</div>

)}


{/* Messages */}

<div
style={{
flex:1,
padding:"14px",
overflowY:"auto"
}}
>

{messages.map((msg,index)=>(

<div
key={index}
style={{
display:"flex",
justifyContent:
msg.role==="user"?"flex-end":"flex-start",
marginBottom:"10px"
}}
>

<div
style={{
background:
msg.role==="user"
?"linear-gradient(135deg,#06b6d4,#0891b2)"
:"#020617",
padding:"10px 14px",
borderRadius:"14px",
color:
msg.role==="user"
?"white"
:"#22d3ee",
fontSize:"14px",
maxWidth:"75%",
border:
msg.role==="user"
?"none"
:"1px solid rgba(0,255,255,0.3)"
}}
>

{msg.text}

</div>

</div>

))}

{loading && (
<p style={{color:"#06b6d4"}}>
Analyzing...
</p>
)}

<div ref={chatEndRef}></div>

</div>


{/* Input */}

<div
style={{
position:"relative",
padding:"10px",
borderTop:"1px solid rgba(6,182,212,0.3)"
}}
>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
onKeyDown={handleKeyPress}
placeholder="Ask about Lokesh..."
style={{
width:"100%",
padding:"12px 45px 12px 16px",
background:"#020617",
color:"white",
border:"1px solid rgba(6,182,212,0.35)",
borderRadius:"30px",
outline:"none",
fontSize:"14px"
}}
/>

<button
onClick={()=>sendMessage()}
style={{
position:"absolute",
right:"16px",
top:"50%",
transform:"translateY(-50%)",
width:"34px",
height:"34px",
borderRadius:"50%",
background:"#06b6d4",
border:"none",
cursor:"pointer",
color:"white",
fontSize:"16px",
display:"flex",
alignItems:"center",
justifyContent:"center",
boxShadow:"0 0 8px rgba(6,182,212,0.6)"
}}
>
➤
</button>

</div>

</>

)}

</div>

)}

</>

);

}