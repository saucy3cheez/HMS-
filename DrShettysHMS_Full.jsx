import { useState, useEffect, useRef } from "react";

/* ─── THEME ─────────────────────────────────────────────── */
const T = {
  gold:"#C9A96E", dark:"#0A0908", surf:"#141210", surf2:"#1C1916",
  surf3:"#232018", muted:"#6B6252", text:"#EDE8DF", accent:"#C97B5A",
  green:"#7EAA87", red:"#C4645A", blue:"#6A8BAA",
  gb:"rgba(201,169,110,0.08)", gborder:"rgba(201,169,110,0.16)",
};

/* ─── DATA ───────────────────────────────────────────────── */
const PROCS = [
  "Rhinoplasty","Breast Augmentation","Breast Reduction","Liposuction",
  "Gynaecomastia","Hair Transplantation","Post Bariatric Surgery",
  "Scar Revision","Lip Enhancements","Blepharoplasty",
  "Genital Reconstruction","Mommy Makeover",
];
const PROC_CATS = ["Procedure","Vaccination","Nebulization","Wound Dressing","Injection","Suture / Stitches","IV Fluids","Consultation","Other"];
const DRUGS = [
  {id:"DX001",name:"Paracetamol 500mg",batch:"BX000",exp:"2026-07-25",stock:86,unit:"Tab",rate:2},
  {id:"DX002",name:"Cetirizine 10mg",batch:"BX010",exp:"2026-07-25",stock:70,unit:"Tab",rate:3},
  {id:"DX003",name:"Amoxicillin 500mg",batch:"BX020",exp:"2026-07-25",stock:55,unit:"Cap",rate:8},
  {id:"DX004",name:"Azithromycin 500mg",batch:"BX030",exp:"2026-07-25",stock:91,unit:"Tab",rate:18},
  {id:"DX005",name:"Pantoprazole 40mg",batch:"BX040",exp:"2026-07-25",stock:72,unit:"Tab",rate:6},
  {id:"DX006",name:"Tramadol 50mg",batch:"BX050",exp:"2027-01-10",stock:40,unit:"Tab",rate:12},
  {id:"DX007",name:"Diclofenac 75mg Inj",batch:"BX060",exp:"2027-03-15",stock:25,unit:"Amp",rate:35},
  {id:"DX008",name:"Ondansetron 4mg",batch:"BX070",exp:"2027-05-20",stock:60,unit:"Tab",rate:10},
  {id:"DX009",name:"Cefazolin 1g Inj",batch:"BX080",exp:"2027-02-28",stock:18,unit:"Vial",rate:120},
  {id:"DX010",name:"Dexamethasone 4mg Inj",batch:"BX090",exp:"2027-04-10",stock:30,unit:"Amp",rate:28},
];
const initPatients = [
  {id:"DSA-001",name:"Priya Sharma",age:34,gender:"Female",phone:"9876543210",email:"priya@email.com",address:"HSR Layout, Bengaluru",blood:"B+",uhid:"DSA-001",reg:"2026-04-10",procedure:"Rhinoplasty",status:"IPD",risk:"Low",notes:"No known allergies. Controlled BP.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-002",name:"Kavitha Rao",age:29,gender:"Female",phone:"8765432109",email:"kavitha@email.com",address:"Koramangala, Bengaluru",blood:"O+",uhid:"DSA-002",reg:"2026-04-15",procedure:"Breast Augmentation",status:"Pre-Op",risk:"Low",notes:"Previous appendectomy 2018.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-003",name:"Ananya Mehta",age:41,gender:"Female",phone:"7654321098",email:"ananya@email.com",address:"Whitefield, Bengaluru",blood:"A+",uhid:"DSA-003",reg:"2026-04-20",procedure:"Mommy Makeover",status:"Scheduled",risk:"Medium",notes:"Mild anaemia. Iron supplements ongoing.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-004",name:"Riya Patel",age:26,gender:"Female",phone:"6543210987",email:"riya@email.com",address:"Indiranagar, Bengaluru",blood:"AB+",uhid:"DSA-004",reg:"2026-05-01",procedure:"Lip Enhancements",status:"Completed",risk:"Low",notes:"Procedure completed. No complications.",visits:[],opNotes:[],ipdUpdates:[],discharge:{date:"2026-05-02",summary:"Uneventful lip filler procedure. Patient discharged same day."}},
  {id:"DSA-005",name:"Deepa Krishnan",age:38,gender:"Female",phone:"5432109876",email:"deepa@email.com",address:"Electronic City, Bengaluru",blood:"B-",uhid:"DSA-005",reg:"2026-04-28",procedure:"Liposuction",status:"IPD",risk:"Medium",notes:"Diabetic. Well-controlled on Metformin.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-006",name:"Arjun Nair",age:33,gender:"Male",phone:"4321098765",email:"arjun@email.com",address:"Marathahalli, Bengaluru",blood:"O-",uhid:"DSA-006",reg:"2026-04-22",procedure:"Gynaecomastia",status:"Scheduled",risk:"Low",notes:"No significant PMH.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-007",name:"Meera Iyer",age:45,gender:"Female",phone:"3210987654",email:"meera@email.com",address:"JP Nagar, Bengaluru",blood:"A-",uhid:"DSA-007",reg:"2026-04-18",procedure:"Post Bariatric Surgery",status:"Pre-Op",risk:"High",notes:"Post RYGB 2024. Nutritional deficiencies noted. High surgical risk.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
  {id:"DSA-008",name:"Rohan Verma",age:28,gender:"Male",phone:"2109876543",email:"rohan@email.com",address:"Sarjapur, Bengaluru",blood:"B+",uhid:"DSA-008",reg:"2026-05-02",procedure:"Hair Transplantation",status:"Scheduled",risk:"Low",notes:"Norwood Grade III pattern.",visits:[],opNotes:[],ipdUpdates:[],discharge:null},
];
const initAppts = [
  {id:"APT-001",patientId:"DSA-001",patient:"Priya Sharma",procedure:"Rhinoplasty Consult",type:"Consultation",time:"09:00",date:"2026-05-03",duration:30,status:"Done",doctor:"Dr. Shetty"},
  {id:"APT-002",patientId:"DSA-006",patient:"Arjun Nair",procedure:"Gynaecomastia Pre-Op",type:"Pre-Op",time:"10:00",date:"2026-05-03",duration:45,status:"Done",doctor:"Dr. Shetty"},
  {id:"APT-003",patientId:"DSA-002",patient:"Kavitha Rao",procedure:"Breast Aug Review",type:"Follow-Up",time:"11:30",date:"2026-05-03",duration:30,status:"In Progress",doctor:"Dr. Shetty"},
  {id:"APT-004",patientId:"DSA-007",patient:"Meera Iyer",procedure:"Post Bariatric Consult",type:"Consultation",time:"14:00",date:"2026-05-03",duration:60,status:"Waiting",doctor:"Dr. Shetty"},
  {id:"APT-005",patientId:"DSA-008",patient:"Rohan Verma",procedure:"Hair Transplant Consult",type:"Consultation",time:"15:30",date:"2026-05-03",duration:45,status:"Waiting",doctor:"Dr. Shetty"},
  {id:"APT-006",patientId:"DSA-004",patient:"Riya Patel",procedure:"Lip Filler Follow-Up",type:"Follow-Up",time:"16:30",date:"2026-05-03",duration:20,status:"Scheduled",doctor:"Dr. Shetty"},
];
const initServices = [
  {id:"SVC-001",patientId:"DSA-004",patient:"Riya Patel",category:"Procedure",desc:"Lip Filler — 1ml Hyaluronic Acid",amount:18000,date:"2026-05-02",doctor:"Dr. Shetty"},
  {id:"SVC-002",patientId:"DSA-001",patient:"Priya Sharma",category:"Procedure",desc:"Rhinoplasty Surgery",amount:95000,date:"2026-04-28",doctor:"Dr. Shetty"},
  {id:"SVC-003",patientId:"DSA-002",patient:"Kavitha Rao",category:"Consultation",desc:"Pre-op consultation — Breast Aug",amount:2000,date:"2026-05-01",doctor:"Dr. Shetty"},
  {id:"SVC-004",patientId:"DSA-005",patient:"Deepa Krishnan",category:"Procedure",desc:"Liposuction — Abdomen & Flanks",amount:85000,date:"2026-05-02",doctor:"Dr. Shetty"},
  {id:"SVC-005",patientId:"DSA-006",patient:"Arjun Nair",category:"Injection",desc:"Local anaesthetic infiltration",amount:1500,date:"2026-05-03",doctor:"Dr. Shetty"},
];
const navItems = [
  {id:"reception",label:"Reception",icon:"◎"},
  {id:"appointments",label:"Appointments",icon:"◷"},
  {id:"doctors",label:"Doctors",icon:"⚕"},
  {id:"pharmacy",label:"Pharmacy",icon:"✦"},
  {id:"patientlog",label:"Patient Log",icon:"◈"},
  {id:"services",label:"Services",icon:"◐"},
  {id:"accounts",label:"Accounts",icon:"₹"},
  {id:"analytics",label:"Analytics",icon:"▲"},
  {id:"notifications",label:"Notifications",icon:"◻"},
  {id:"settings",label:"Settings",icon:"⊕"},
];

/* ─── HELPERS ────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();
const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0,10);
const nowTime = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});
const statusColor = s => s==="IPD"?T.blue:s==="Pre-Op"?T.accent:s==="Scheduled"?T.gold:s==="Completed"?T.green:T.muted;
const riskColor = r => r==="High"?T.red:r==="Medium"?T.gold:T.green;

/* ─── STYLES ─────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--gold:#C9A96E;--dark:#0A0908;--surf:#141210;--surf2:#1C1916;--surf3:#232018;--muted:#6B6252;--text:#EDE8DF;--accent:#C97B5A;--green:#7EAA87;--red:#C4645A;--blue:#6A8BAA;--gb:rgba(201,169,110,0.08);--gborder:rgba(201,169,110,0.16);}
html,body,#root{height:100%;background:var(--dark)}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}
.app{font-family:'DM Sans',sans-serif;color:var(--text);background:var(--dark);min-height:100vh;display:flex;flex-direction:column}
/* TOPBAR */
.tb{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:54px;background:var(--surf);border-bottom:1px solid var(--gborder);position:sticky;top:0;z-index:200;flex-shrink:0}
.tb-logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-size:14px;color:var(--gold);letter-spacing:.06em}
.tb-mark{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;background:var(--gb);font-size:12px;color:var(--gold)}
.tb-sub{font-size:9px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase}
.tb-mid{display:flex;align-items:center;gap:8px;flex:1;justify-content:center}
.tb-badge{display:flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid var(--gborder);color:var(--muted)}
.tb-right{display:flex;align-items:center;gap:10px}
.tb-time{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted)}
.av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--accent));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--dark);cursor:pointer;border:none}
/* LAYOUT */
.layout{display:flex;flex:1;overflow:hidden}
/* SIDEBAR */
.sb{width:195px;background:var(--surf);border-right:1px solid var(--gborder);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;padding:16px 0}
.sb-sec{padding:0 12px;margin-bottom:4px}
.sb-lbl{font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);padding:0 4px;margin-bottom:6px;margin-top:8px}
.nb{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border-radius:8px;background:none;border:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .18s;text-align:left}
.nb:hover{background:var(--gb);color:var(--text)}
.nb.active{background:rgba(201,169,110,0.14);color:var(--gold)}
.nb-ico{font-size:14px;width:16px;text-align:center}
.sb-divider{height:1px;background:var(--gborder);margin:10px 12px}
.sb-foot{margin-top:auto;padding:12px}
.sb-card{background:var(--gb);border:1px solid var(--gborder);border-radius:10px;padding:12px;text-align:center}
.sb-name{font-family:'Playfair Display',serif;font-size:11.5px;color:var(--gold);margin-bottom:2px}
.sb-cred{font-size:10px;color:var(--muted)}
.sb-backup{background:linear-gradient(90deg,#8B2A1A,#C4403A);border:none;border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:center;gap:8px;color:#fff;font-size:11px;font-weight:600;cursor:pointer;width:100%;margin-top:8px;font-family:'DM Sans',sans-serif}
/* MAIN */
.main{flex:1;overflow-y:auto;padding:22px;background:var(--dark)}
/* BOTTOM NAV */
.bnav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surf);border-top:1px solid var(--gborder);z-index:200;padding:6px 0}
.bnav-inner{display:flex;justify-content:space-around}
.bnav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;color:var(--muted);font-size:9px;cursor:pointer;padding:4px 6px;font-family:'DM Sans',sans-serif;transition:color .18s}
.bnav-btn.active{color:var(--gold)}
.bnav-ico{font-size:17px}
/* PAGE HEADERS */
.ph{margin-bottom:22px}
.ph-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px}
.pt{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--text);margin-bottom:3px}
.ps{font-size:12px;color:var(--muted)}
/* STAT CARDS */
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:22px}
.sc{background:var(--surf);border:1px solid var(--gborder);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}
.sc-lbl{font-size:9px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.sc-val{font-family:'Playfair Display',serif;font-size:26px;color:var(--gold);font-weight:700;margin-bottom:3px}
.sc-ch{font-size:11px;color:var(--green)}
.sc-ico{position:absolute;right:12px;top:12px;font-size:18px;opacity:.25}
/* CARDS */
.card{background:var(--surf);border:1px solid var(--gborder);border-radius:12px;padding:18px;margin-bottom:14px}
.card-t{font-family:'Playfair Display',serif;font-size:15px;color:var(--text);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.card-t2{font-size:11px;color:var(--muted);font-family:'DM Mono',monospace}
/* SEARCH */
.srch{display:flex;align-items:center;gap:8px;background:var(--surf2);border:1px solid var(--gborder);border-radius:9px;padding:9px 12px;margin-bottom:14px}
.srch input{background:none;border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--text);flex:1}
.srch input::placeholder{color:var(--muted)}
.srch-ico{color:var(--muted);font-size:13px}
/* CHIPS */
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.chip{padding:5px 12px;border-radius:20px;font-size:10.5px;font-weight:500;cursor:pointer;transition:all .18s;border:1px solid var(--gborder);background:none;color:var(--muted);font-family:'DM Sans',sans-serif;letter-spacing:.03em}
.chip:hover{border-color:var(--gold);color:var(--text)}
.chip.on{background:rgba(201,169,110,0.14);color:var(--gold);border-color:var(--gold)}
/* TABLES */
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-align:left;padding:7px 10px;border-bottom:1px solid var(--gborder);font-weight:500}
.tbl td{padding:12px 10px;border-bottom:1px solid rgba(201,169,110,0.06);font-size:12.5px;vertical-align:middle}
.tbl tr:hover td{background:var(--gb);cursor:pointer}
.tbl tr:last-child td{border-bottom:none}
.mono{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted)}
.tnm{color:var(--text);font-weight:500}
.tsub{font-size:11px;color:var(--muted)}
/* BADGES */
.bdg{display:inline-block;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:.04em}
.bdg-sch{background:rgba(201,169,110,.13);color:var(--gold)}
.bdg-ipd{background:rgba(106,139,170,.13);color:var(--blue)}
.bdg-pre{background:rgba(201,123,90,.13);color:var(--accent)}
.bdg-done{background:rgba(126,170,135,.13);color:var(--green)}
.bdg-wait{background:rgba(201,169,110,.1);color:var(--gold);border:1px solid rgba(201,169,110,.2)}
.bdg-prog{background:rgba(126,170,135,.2);color:var(--green);border:1px solid rgba(126,170,135,.3)}
/* PATIENT LIST (reception) */
.pt-list{display:flex;flex-direction:column;gap:0}
.pt-row{display:flex;align-items:center;gap:12px;padding:13px 14px;border-bottom:1px solid rgba(201,169,110,.06);cursor:pointer;transition:background .18s}
.pt-row:hover{background:var(--gb)}
.pt-row.sel{background:rgba(201,169,110,.1);border-left:2px solid var(--gold)}
.pt-ava{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--surf3),var(--surf2));border:1px solid var(--gborder);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;color:var(--gold);flex-shrink:0}
.pt-info{flex:1;min-width:0}
.pt-nm{font-size:13px;font-weight:500;color:var(--text)}
.pt-meta{font-size:11px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}
/* APPOINTMENTS */
.appt-item{display:flex;align-items:center;gap:12px;background:var(--surf2);border-radius:9px;padding:12px 14px;border:1px solid rgba(201,169,110,.08);transition:border-color .18s;margin-bottom:8px;cursor:pointer}
.appt-item:hover{border-color:var(--gborder)}
.appt-time{font-family:'DM Mono',monospace;font-size:13px;color:var(--gold);min-width:48px;font-weight:500}
.appt-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0;box-shadow:0 0 6px rgba(201,169,110,.5)}
.appt-det{flex:1}
.appt-pt{font-size:13px;color:var(--text);font-weight:500;margin-bottom:2px}
.appt-pr{font-size:11px;color:var(--muted)}
/* PHARMACY */
.ph-alert{background:rgba(196,100,90,.08);border:1px solid rgba(196,100,90,.25);border-radius:10px;padding:14px 16px;margin-bottom:14px}
.ph-al-t{font-size:12px;color:var(--red);font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ph-al-row{font-size:11.5px;color:rgba(196,100,90,.8);padding:2px 0}
.drug-stock{display:flex;align-items:center;gap:8px}
.stock-bar{flex:1;height:4px;background:var(--surf3);border-radius:2px;overflow:hidden}
.stock-fill{height:100%;border-radius:2px}
/* MODAL */
.mo{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px}
.mo-box{background:var(--surf);border:1px solid var(--gborder);border-radius:14px;width:100%;max-height:88vh;overflow-y:auto;display:flex;flex-direction:column}
.mo-hd{padding:20px 22px 0;border-bottom:1px solid var(--gborder);flex-shrink:0}
.mo-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--text);margin-bottom:14px}
.mo-tabs{display:flex;gap:0;border-bottom:none}
.mo-tab{padding:8px 14px;background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;border-bottom:2px solid transparent;transition:all .18s;font-weight:500}
.mo-tab.active{color:var(--gold);border-bottom-color:var(--gold)}
.mo-body{padding:20px 22px;flex:1;overflow-y:auto}
/* FORMS */
.fg{margin-bottom:14px}
.fl{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:5px;display:block}
.fi,.fs,.fta{width:100%;background:var(--surf2);border:1px solid var(--gborder);border-radius:8px;padding:9px 12px;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--text);outline:none;transition:border-color .18s}
.fi:focus,.fs:focus,.fta:focus{border-color:var(--gold)}
.fs option{background:var(--surf2)}
.fta{resize:vertical;min-height:80px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn-r{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
/* BUTTONS */
.btn-g{background:linear-gradient(135deg,var(--gold),#A8824E);color:var(--dark);border:none;padding:9px 18px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .18s;letter-spacing:.04em}
.btn-g:hover{opacity:.88}
.btn-gh{background:none;border:1px solid var(--gborder);color:var(--muted);padding:8px 18px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .18s}
.btn-gh:hover{border-color:var(--gold);color:var(--text)}
.btn-sm{background:var(--gb);border:1px solid var(--gborder);color:var(--gold);padding:5px 12px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;cursor:pointer;transition:all .18s}
.btn-sm:hover{background:rgba(201,169,110,.2)}
.btn-danger{background:rgba(196,100,90,.15);border:1px solid rgba(196,100,90,.3);color:var(--red);padding:8px 18px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer}
/* ANALYTICS TABS */
.atabs{display:flex;gap:0;border-bottom:1px solid var(--gborder);margin-bottom:18px;overflow-x:auto}
.atab{padding:8px 14px;background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;border-bottom:2px solid transparent;white-space:nowrap;transition:all .18s;flex-shrink:0}
.atab.active{color:var(--gold);border-bottom-color:var(--gold)}
/* BAR CHART */
.bar-wrap{margin-bottom:12px}
.bar-row{display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:5px}
.bar-lbl{color:var(--text)}
.bar-val{font-family:'DM Mono',monospace;color:var(--gold)}
.bar-bg{background:var(--surf2);border-radius:3px;height:5px;overflow:hidden}
.bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--gold),var(--accent));transition:width .7s ease}
/* NOTES TIMELINE */
.note-item{display:flex;gap:12px;margin-bottom:14px;position:relative}
.note-item::before{content:'';position:absolute;left:15px;top:28px;bottom:-14px;width:1px;background:var(--gborder)}
.note-item:last-child::before{display:none}
.note-dot{width:30px;height:30px;border-radius:50%;background:var(--surf2);border:1.5px solid var(--gborder);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;color:var(--gold)}
.note-content{flex:1;background:var(--surf2);border:1px solid var(--gborder);border-radius:9px;padding:12px 14px}
.note-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.note-who{font-size:11px;color:var(--gold);font-weight:600}
.note-when{font-size:10px;color:var(--muted);font-family:'DM Mono',monospace}
.note-text{font-size:12px;color:var(--text);line-height:1.65}
/* VITALS */
.vitals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-bottom:14px}
.vital-card{background:var(--surf2);border:1px solid var(--gborder);border-radius:8px;padding:10px 12px;text-align:center}
.vital-lbl{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.vital-val{font-family:'DM Mono',monospace;font-size:16px;color:var(--gold);font-weight:500}
.vital-unit{font-size:9px;color:var(--muted)}
/* PATIENT DETAIL */
.pd-hero{background:var(--surf2);border-radius:10px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:14px}
.pd-ava{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--accent));display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:20px;color:var(--dark);font-weight:700;flex-shrink:0}
.pd-nm{font-family:'Playfair Display',serif;font-size:18px;color:var(--text);margin-bottom:3px}
.pd-meta{font-size:12px;color:var(--muted);display:flex;gap:12px;flex-wrap:wrap}
/* DISCHARGE */
.disch-box{background:rgba(126,170,135,.06);border:1px solid rgba(126,170,135,.2);border-radius:10px;padding:16px}
.disch-title{font-family:'Playfair Display',serif;font-size:15px;color:var(--green);margin-bottom:10px}
/* RESPONSIVE */
@media(max-width:768px){
  .sb{display:none}
  .bnav{display:flex}
  .main{padding:14px;padding-bottom:72px}
  .sg{grid-template-columns:repeat(2,1fr)}
  .fr{grid-template-columns:1fr}
  .tb-mid{display:none}
  .tbl th:nth-child(n+4),.tbl td:nth-child(n+4){display:none}
}
@media(max-width:480px){
  .sg{grid-template-columns:1fr}
}
`;

/* ─── PATIENT DETAIL MODAL ───────────────────────────────── */
function PatientDetail({ patient, onClose, onSave }) {
  const [tab, setTab] = useState("info");
  const [pts, setPts] = useState(patient);
  const [opForm, setOpForm] = useState({ date: today(), time: nowTime(), surgeon: "Dr. Shetty", anaesthesia: "General", procedure: pts.procedure, findings: "", technique: "", closure: "", bloodLoss: "", duration: "", complications: "Nil", notes: "" });
  const [ipdForm, setIpdForm] = useState({ date: today(), time: nowTime(), type: "Doctor Round", vitals: { bp: "", hr: "", spo2: "", temp: "", pain: "" }, note: "" });
  const [dischForm, setDischForm] = useState({ date: today(), diagnosis: "", procedure: "", hospital: "", complications: "Nil", condition: "Stable", instructions: "", meds: "", followup: "", summary: "" });
  const [showOpForm, setShowOpForm] = useState(false);
  const [showIpdForm, setShowIpdForm] = useState(false);
  const [showDischForm, setShowDischForm] = useState(!pts.discharge);

  const saveOp = () => {
    const updated = { ...pts, opNotes: [...pts.opNotes, { ...opForm, id: uid() }] };
    setPts(updated); onSave(updated); setShowOpForm(false);
  };
  const saveIpd = () => {
    const updated = { ...pts, ipdUpdates: [...pts.ipdUpdates, { ...ipdForm, id: uid() }] };
    setPts(updated); onSave(updated); setShowIpdForm(false);
  };
  const saveDischarge = () => {
    const updated = { ...pts, discharge: { ...dischForm, id: uid() }, status: "Completed" };
    setPts(updated); onSave(updated); setShowDischForm(false);
  };

  const tabs = [
    { id: "info", label: "Patient Info" },
    { id: "op", label: "Operative Notes" },
    { id: "ipd", label: "IPD Updates" },
    { id: "discharge", label: "Discharge Summary" },
  ];

  return (
    <div className="mo" onClick={onClose}>
      <div className="mo-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="mo-hd">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="mo-title">Patient Record</div>
            <button className="btn-gh" style={{ padding: "4px 10px", fontSize: 11 }} onClick={onClose}>✕ Close</button>
          </div>
          <div className="mo-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`mo-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="mo-body">

          {/* PATIENT INFO */}
          {tab === "info" && (
            <div>
              <div className="pd-hero">
                <div className="pd-ava">{pts.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div className="pd-nm">{pts.name}</div>
                  <div className="pd-meta">
                    <span>{pts.gender}, {pts.age}y</span>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11 }}>{pts.uhid}</span>
                    <span className={`bdg bdg-${pts.status === "IPD" ? "ipd" : pts.status === "Pre-Op" ? "pre" : pts.status === "Scheduled" ? "sch" : "done"}`}>{pts.status}</span>
                  </div>
                </div>
              </div>
              <div className="fr" style={{ marginBottom: 12 }}>
                {[["Blood Group", pts.blood], ["Phone", pts.phone], ["Email", pts.email], ["Registered", pts.reg]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--surf2)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12.5, color: T.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--surf2)", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 3 }}>Address</div>
                <div style={{ fontSize: 12.5, color: T.text }}>{pts.address}</div>
              </div>
              <div style={{ background: "var(--surf2)", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 3 }}>Planned Procedure</div>
                <div style={{ fontSize: 13, color: T.gold, fontFamily: "Playfair Display, serif" }}>{pts.procedure}</div>
              </div>
              <div style={{ background: "var(--surf2)", borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${riskColor(pts.risk)}` }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 3 }}>Risk Level — Clinical Notes</div>
                <div style={{ fontSize: 12.5, color: T.text }}><span style={{ color: riskColor(pts.risk), fontWeight: 600, marginRight: 8 }}>{pts.risk} Risk</span>{pts.notes}</div>
              </div>
            </div>
          )}

          {/* OPERATIVE NOTES */}
          {tab === "op" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: T.muted }}>{pts.opNotes.length} operative note{pts.opNotes.length !== 1 ? "s" : ""}</div>
                <button className="btn-g" onClick={() => setShowOpForm(!showOpForm)}>+ Add Op Note</button>
              </div>

              {showOpForm && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 14, color: T.text, marginBottom: 12 }}>New Operative Note</div>
                  <div className="fr">
                    <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={opForm.date} onChange={e => setOpForm({ ...opForm, date: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Time</label><input className="fi" type="time" value={opForm.time} onChange={e => setOpForm({ ...opForm, time: e.target.value })} /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label className="fl">Surgeon</label><input className="fi" value={opForm.surgeon} onChange={e => setOpForm({ ...opForm, surgeon: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Anaesthesia</label>
                      <select className="fs" value={opForm.anaesthesia} onChange={e => setOpForm({ ...opForm, anaesthesia: e.target.value })}>
                        {["General", "Spinal", "Local", "Local + Sedation", "Epidural"].map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg"><label className="fl">Procedure Performed</label><input className="fi" value={opForm.procedure} onChange={e => setOpForm({ ...opForm, procedure: e.target.value })} /></div>
                  <div className="fg"><label className="fl">Pre-operative Findings</label><textarea className="fta" value={opForm.findings} onChange={e => setOpForm({ ...opForm, findings: e.target.value })} placeholder="Describe pre-op findings..." /></div>
                  <div className="fg"><label className="fl">Operative Technique</label><textarea className="fta" value={opForm.technique} onChange={e => setOpForm({ ...opForm, technique: e.target.value })} placeholder="Step-by-step technique description..." /></div>
                  <div className="fg"><label className="fl">Closure</label><input className="fi" value={opForm.closure} onChange={e => setOpForm({ ...opForm, closure: e.target.value })} placeholder="e.g. 3-0 Vicryl + 4-0 Monocryl" /></div>
                  <div className="fr">
                    <div className="fg"><label className="fl">Blood Loss (mL)</label><input className="fi" type="number" value={opForm.bloodLoss} onChange={e => setOpForm({ ...opForm, bloodLoss: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Duration (mins)</label><input className="fi" type="number" value={opForm.duration} onChange={e => setOpForm({ ...opForm, duration: e.target.value })} /></div>
                  </div>
                  <div className="fg"><label className="fl">Intra-operative Complications</label><input className="fi" value={opForm.complications} onChange={e => setOpForm({ ...opForm, complications: e.target.value })} /></div>
                  <div className="fg"><label className="fl">Additional Notes / Post-op Plan</label><textarea className="fta" value={opForm.notes} onChange={e => setOpForm({ ...opForm, notes: e.target.value })} /></div>
                  <div className="btn-r">
                    <button className="btn-gh" onClick={() => setShowOpForm(false)}>Cancel</button>
                    <button className="btn-g" onClick={saveOp}>Save Op Note</button>
                  </div>
                </div>
              )}

              {pts.opNotes.length === 0 && !showOpForm && (
                <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⚕</div>
                  No operative notes yet. Click <strong style={{ color: T.gold }}>+ Add Op Note</strong> to record.
                </div>
              )}

              {pts.opNotes.map((n, i) => (
                <div key={i} className="note-item">
                  <div className="note-dot">⚕</div>
                  <div className="note-content">
                    <div className="note-hd">
                      <span className="note-who">{n.surgeon} — {n.procedure}</span>
                      <span className="note-when">{n.date} {n.time}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
                      {[["Anaesthesia", n.anaesthesia], ["Duration", n.duration ? n.duration + " min" : "—"], ["Blood Loss", n.bloodLoss ? n.bloodLoss + " mL" : "—"], ["Complications", n.complications]].map(([k, v]) => (
                        <div key={k}><span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted }}>{k}: </span><span style={{ fontSize: 11.5, color: T.text }}>{v}</span></div>
                      ))}
                    </div>
                    {n.technique && <div className="note-text"><strong style={{ color: T.muted, fontSize: 10 }}>TECHNIQUE: </strong>{n.technique}</div>}
                    {n.notes && <div className="note-text" style={{ marginTop: 4 }}><strong style={{ color: T.muted, fontSize: 10 }}>NOTES: </strong>{n.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* IPD UPDATES */}
          {tab === "ipd" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: T.muted }}>{pts.ipdUpdates.length} update{pts.ipdUpdates.length !== 1 ? "s" : ""} logged</div>
                <button className="btn-g" onClick={() => setShowIpdForm(!showIpdForm)}>+ Add Update</button>
              </div>

              {showIpdForm && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 14, color: T.text, marginBottom: 12 }}>In-Patient Update</div>
                  <div className="fr">
                    <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={ipdForm.date} onChange={e => setIpdForm({ ...ipdForm, date: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Time</label><input className="fi" type="time" value={ipdForm.time} onChange={e => setIpdForm({ ...ipdForm, time: e.target.value })} /></div>
                  </div>
                  <div className="fg"><label className="fl">Update Type</label>
                    <select className="fs" value={ipdForm.type} onChange={e => setIpdForm({ ...ipdForm, type: e.target.value })}>
                      {["Doctor Round", "Nursing Note", "Dressing Change", "Medication Update", "Physiotherapy", "Diet Update", "Lab Result", "Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 13, color: T.text, marginBottom: 10 }}>Vitals</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 14 }}>
                    {[["bp", "BP (mmHg)"], ["hr", "HR (bpm)"], ["spo2", "SpO₂ (%)"], ["temp", "Temp (°F)"], ["pain", "Pain (0-10)"]].map(([k, l]) => (
                      <div key={k} className="fg" style={{ marginBottom: 0 }}>
                        <label className="fl" style={{ fontSize: 8 }}>{l}</label>
                        <input className="fi" style={{ padding: "7px 8px" }} value={ipdForm.vitals[k]} placeholder="—" onChange={e => setIpdForm({ ...ipdForm, vitals: { ...ipdForm.vitals, [k]: e.target.value } })} />
                      </div>
                    ))}
                  </div>
                  <div className="fg"><label className="fl">Clinical Note</label><textarea className="fta" style={{ minHeight: 90 }} value={ipdForm.note} onChange={e => setIpdForm({ ...ipdForm, note: e.target.value })} placeholder="Observations, interventions, plan..." /></div>
                  <div className="btn-r">
                    <button className="btn-gh" onClick={() => setShowIpdForm(false)}>Cancel</button>
                    <button className="btn-g" onClick={saveIpd}>Save Update</button>
                  </div>
                </div>
              )}

              {pts.ipdUpdates.length === 0 && !showIpdForm && (
                <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>◈</div>
                  No IPD updates yet. Click <strong style={{ color: T.gold }}>+ Add Update</strong> to begin logging.
                </div>
              )}

              {pts.ipdUpdates.map((u, i) => (
                <div key={i} className="note-item">
                  <div className="note-dot">◈</div>
                  <div className="note-content">
                    <div className="note-hd">
                      <span className="note-who">{u.type}</span>
                      <span className="note-when">{u.date} {u.time}</span>
                    </div>
                    {Object.values(u.vitals).some(v => v) && (
                      <div className="vitals-grid" style={{ gridTemplateColumns: "repeat(5,1fr)", marginBottom: 8 }}>
                        {[["BP", u.vitals.bp], ["HR", u.vitals.hr], ["SpO₂", u.vitals.spo2], ["Temp", u.vitals.temp], ["Pain", u.vitals.pain]].map(([k, v]) => v ? (
                          <div key={k} className="vital-card">
                            <div className="vital-lbl">{k}</div>
                            <div className="vital-val" style={{ fontSize: 13 }}>{v}</div>
                          </div>
                        ) : null)}
                      </div>
                    )}
                    {u.note && <div className="note-text">{u.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DISCHARGE SUMMARY */}
          {tab === "discharge" && (
            <div>
              {pts.discharge ? (
                <div>
                  <div className="disch-box">
                    <div className="disch-title">✓ Discharge Summary — {pts.discharge.date}</div>
                    {[["Final Diagnosis", pts.discharge.diagnosis], ["Procedure Performed", pts.discharge.procedure], ["Condition at Discharge", pts.discharge.condition], ["Complications", pts.discharge.complications], ["Post-op Instructions", pts.discharge.instructions], ["Medications at Discharge", pts.discharge.meds], ["Follow-up", pts.discharge.followup]].map(([k, v]) => v ? (
                      <div key={k} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 12.5, color: T.text }}>{v}</div>
                      </div>
                    ) : null)}
                    {pts.discharge.summary && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(126,170,135,.2)" }}>
                        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 4 }}>Surgeon's Summary</div>
                        <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65 }}>{pts.discharge.summary}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-gh" onClick={() => setPts({ ...pts, discharge: null })}>Edit Discharge Summary</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 14, color: T.text, marginBottom: 12 }}>Create Discharge Summary</div>
                  <div className="fr">
                    <div className="fg"><label className="fl">Discharge Date</label><input className="fi" type="date" value={dischForm.date} onChange={e => setDischForm({ ...dischForm, date: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Condition at Discharge</label>
                      <select className="fs" value={dischForm.condition} onChange={e => setDischForm({ ...dischForm, condition: e.target.value })}>
                        {["Stable", "Improved", "Satisfactory", "Guarded", "Critical"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg"><label className="fl">Final Diagnosis</label><input className="fi" value={dischForm.diagnosis} onChange={e => setDischForm({ ...dischForm, diagnosis: e.target.value })} placeholder="Primary diagnosis..." /></div>
                  <div className="fg"><label className="fl">Procedure Performed</label><input className="fi" value={dischForm.procedure} onChange={e => setDischForm({ ...dischForm, procedure: e.target.value })} placeholder="Procedures done during admission..." /></div>
                  <div className="fg"><label className="fl">Complications</label><input className="fi" value={dischForm.complications} onChange={e => setDischForm({ ...dischForm, complications: e.target.value })} /></div>
                  <div className="fg"><label className="fl">Post-op / Discharge Instructions</label><textarea className="fta" value={dischForm.instructions} onChange={e => setDischForm({ ...dischForm, instructions: e.target.value })} placeholder="Wound care, activity restrictions, diet..." /></div>
                  <div className="fg"><label className="fl">Medications at Discharge</label><textarea className="fta" style={{ minHeight: 70 }} value={dischForm.meds} onChange={e => setDischForm({ ...dischForm, meds: e.target.value })} placeholder="Drug name, dose, frequency, duration..." /></div>
                  <div className="fg"><label className="fl">Follow-up Plan</label><input className="fi" value={dischForm.followup} onChange={e => setDischForm({ ...dischForm, followup: e.target.value })} placeholder="e.g. Review in 1 week at clinic" /></div>
                  <div className="fg"><label className="fl">Surgeon's Narrative Summary</label><textarea className="fta" style={{ minHeight: 100 }} value={dischForm.summary} onChange={e => setDischForm({ ...dischForm, summary: e.target.value })} placeholder="Clinical summary of admission, course, and outcome..." /></div>
                  <div className="btn-r">
                    <button className="btn-g" onClick={saveDischarge}>Finalise & Save Discharge</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("reception");
  const [patients, setPatients] = useState(initPatients);
  const [appts, setAppts] = useState(initAppts);
  const [services, setServices] = useState(initServices);
  const [drugs, setDrugs] = useState(DRUGS);
  const [selPt, setSelPt] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showNewPt, setShowNewPt] = useState(false);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [showNewSvc, setShowNewSvc] = useState(false);
  const [showNewSale, setShowNewSale] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [analyticsTab, setAnalyticsTab] = useState("overview");
  const [animated, setAnimated] = useState(false);
  const [curTime, setCurTime] = useState(new Date());
  const [ptForm, setPtForm] = useState({ name: "", age: "", gender: "Female", phone: "", email: "", address: "", blood: "O+", procedure: "Rhinoplasty", notes: "" });
  const [apptForm, setApptForm] = useState({ patientId: "", time: "09:00", date: today(), type: "Consultation", duration: 30, notes: "" });
  const [svcForm, setSvcForm] = useState({ patientId: "", category: "Procedure", desc: "", amount: "", doctor: "Dr. Shetty" });
  const [saleForm, setSaleForm] = useState({ patientId: "", drug: "", qty: 1, amount: "" });
  const [apptDate, setApptDate] = useState(today());

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
    const t = setInterval(() => setCurTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const timeStr = curTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = curTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const filteredPts = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.uhid.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  ).filter(p => catFilter === "All" || p.status === catFilter);

  const todayAppts = appts.filter(a => a.date === apptDate);

  const totalRevenue = services.reduce((s, v) => s + Number(v.amount), 0);
  const monthRevenue = services.filter(s => s.date >= "2026-05-01").reduce((s, v) => s + Number(v.amount), 0);

  const addPatient = () => {
    if (!ptForm.name || !ptForm.phone) return;
    const id = `DSA-${String(patients.length + 1).padStart(3, "0")}`;
    setPatients([{ ...ptForm, id, uhid: id, reg: today(), status: "Scheduled", risk: "Low", visits: [], opNotes: [], ipdUpdates: [], discharge: null }, ...patients]);
    setShowNewPt(false); setPtForm({ name: "", age: "", gender: "Female", phone: "", email: "", address: "", blood: "O+", procedure: "Rhinoplasty", notes: "" });
  };
  const addAppt = () => {
    const pt = patients.find(p => p.id === apptForm.patientId);
    if (!pt) return;
    const newA = { id: `APT-${uid()}`, patientId: pt.id, patient: pt.name, procedure: pt.procedure, ...apptForm, status: "Scheduled", doctor: "Dr. Shetty" };
    setAppts([...appts, newA]); setShowNewAppt(false);
  };
  const addService = () => {
    const pt = patients.find(p => p.id === svcForm.patientId);
    if (!pt || !svcForm.amount) return;
    setServices([{ id: `SVC-${uid()}`, patient: pt.name, date: today(), ...svcForm }, ...services]);
    setShowNewSvc(false); setSvcForm({ patientId: "", category: "Procedure", desc: "", amount: "", doctor: "Dr. Shetty" });
  };
  const updatePt = (updated) => { setPatients(patients.map(p => p.id === updated.id ? updated : p)); };

  // Procedure breakdown for analytics
  const procBreakdown = PROCS.map(p => ({ name: p, count: patients.filter(pt => pt.procedure === p).length })).sort((a, b) => b.count - a.count);

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* TOPBAR */}
      <div className="tb">
        <div className="tb-logo">
          <div className="tb-mark">✦</div>
          <div>
            <div>Dr Shetty's Aesthetics</div>
            <div className="tb-sub">Hospital Management System</div>
          </div>
        </div>
        <div className="tb-mid">
          <div className="tb-badge"><span style={{ fontSize: 9 }}>◎</span> Whitefield, Bengaluru</div>
          <div className="tb-badge"><span style={{ fontSize: 9 }}>☎</span> +91 98765 00001</div>
          <div className="tb-badge" style={{ color: T.accent, borderColor: "rgba(196,100,90,.25)" }}><span>⚠</span> No Backup</div>
        </div>
        <div className="tb-right">
          <div className="tb-time">{timeStr}<br /><span style={{ fontSize: 9 }}>{dateStr}</span></div>
          <button className="av">DS</button>
        </div>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sb">
          <div className="sb-sec">
            <div className="sb-lbl">Main Menu</div>
            {navItems.slice(0, 6).map(n => (
              <button key={n.id} className={`nb ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); setSearch(""); setCatFilter("All"); }}>
                <span className="nb-ico">{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div className="sb-divider" />
          <div className="sb-sec">
            <div className="sb-lbl">Finance & Admin</div>
            {navItems.slice(6).map(n => (
              <button key={n.id} className={`nb ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); setSearch(""); }}>
                <span className="nb-ico">{n.ico}</span>
                <span className="nb-ico">{n.icon}</span>{n.label}
                {(n.id === "settings") && <span style={{ marginLeft: "auto", fontSize: 10 }}>🔒</span>}
              </button>
            ))}
          </div>
          <div className="sb-foot">
            <div className="sb-card">
              <div className="sb-name">Dr. Shetty</div>
              <div className="sb-cred">MCh Plastic Surgery</div>
              <div className="sb-cred">MBBS · MS · MCh</div>
              <div className="sb-cred" style={{ marginTop: 2 }}>KMC · MMC Registered</div>
            </div>
            <button className="sb-backup">⚠ Backup Data</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* ── RECEPTION ── */}
          {page === "reception" && (
            <div style={{ display: "flex", gap: 14, height: "100%" }}>
              <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="srch" style={{ marginBottom: 0 }}>
                  <span className="srch-ico">⌕</span>
                  <input placeholder="Search by name, phone, or UHID" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className="btn-g" style={{ width: "100%", padding: 11 }} onClick={() => setShowNewPt(true)}>◎ New Patient &nbsp;&nbsp; Ctrl+N</button>
                <div style={{ overflow: "hidden" }}>
                  <div className="chips" style={{ marginBottom: 6 }}>
                    {["All", "Scheduled", "IPD", "Pre-Op", "Completed"].map(f => (
                      <button key={f} className={`chip ${catFilter === f ? "on" : ""}`} style={{ fontSize: 10, padding: "4px 10px" }} onClick={() => setCatFilter(f)}>{f}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--surf)", border: "1px solid var(--gborder)", borderRadius: 10, overflow: "auto", flex: 1 }}>
                  <div className="pt-list">
                    {filteredPts.map(p => (
                      <div key={p.id} className={`pt-row ${selPt?.id === p.id ? "sel" : ""}`} onClick={() => { setSelPt(p); }}>
                        <div className="pt-ava">{p.name[0]}</div>
                        <div className="pt-info">
                          <div className="pt-nm">{p.name}</div>
                          <div className="pt-meta">
                            <span className="mono">{p.uhid}</span>
                            <span>☎ {p.phone}</span>
                          </div>
                          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>No visits yet</div>
                        </div>
                        <div>
                          <span className={`bdg bdg-${p.status === "IPD" ? "ipd" : p.status === "Pre-Op" ? "pre" : p.status === "Scheduled" ? "sch" : "done"}`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                    {filteredPts.length === 0 && <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 12 }}>No patients found</div>}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: selPt ? "flex-start" : "center" }}>
                {!selPt ? (
                  <div style={{ textAlign: "center", color: T.muted }}>
                    <div style={{ fontSize: 44, marginBottom: 10, opacity: .3 }}>◎</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Select a patient or register a new one</div>
                    <div style={{ fontSize: 12 }}>Search on the left or click New Patient to begin.</div>
                  </div>
                ) : (
                  <div style={{ width: "100%", maxWidth: 500 }}>
                    <div className="pd-hero" style={{ background: "var(--surf)", border: "1px solid var(--gborder)" }}>
                      <div className="pd-ava" style={{ width: 50, height: 50, fontSize: 18 }}>{selPt.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: T.text, marginBottom: 4 }}>{selPt.name}</div>
                        <div style={{ fontSize: 12, color: T.muted, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span>{selPt.gender}, {selPt.age}y</span>
                          <span className="mono">{selPt.uhid}</span>
                          <span>☎ {selPt.phone}</span>
                          <span className={`bdg bdg-${selPt.status === "IPD" ? "ipd" : selPt.status === "Pre-Op" ? "pre" : selPt.status === "Scheduled" ? "sch" : "done"}`}>{selPt.status}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      {[["Blood Group", selPt.blood], ["Procedure", selPt.procedure], ["Registered", selPt.reg], ["Risk", selPt.risk]].map(([k, v]) => (
                        <div key={k} style={{ background: "var(--surf)", border: "1px solid var(--gborder)", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 3 }}>{k}</div>
                          <div style={{ fontSize: 12.5, color: k === "Risk" ? riskColor(v) : T.text, fontWeight: k === "Risk" ? 600 : 400 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "var(--surf)", border: "1px solid var(--gborder)", borderRadius: 8, padding: "10px 12px", marginBottom: 10, fontSize: 12, color: T.text }}>
                      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 4 }}>Clinical Notes</div>
                      {selPt.notes || "—"}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-g" style={{ flex: 1 }} onClick={() => setShowDetail(true)}>Open Full Record</button>
                      <button className="btn-sm" onClick={() => { setApptForm({ ...apptForm, patientId: selPt.id }); setShowNewAppt(true); }}>Book Appt</button>
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 10, textAlign: "center" }}>
                      {selPt.opNotes.length} op note{selPt.opNotes.length !== 1 ? "s" : ""} &nbsp;·&nbsp;
                      {selPt.ipdUpdates.length} IPD update{selPt.ipdUpdates.length !== 1 ? "s" : ""} &nbsp;·&nbsp;
                      {selPt.discharge ? "✓ Discharged" : "Not discharged"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {page === "appointments" && (
            <div>
              <div className="ph-row ph">
                <div><div className="pt">Appointments</div><div className="ps">Manage today's queue across all doctors.</div></div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="fi" type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} style={{ width: 160 }} />
                  <button className="btn-g" onClick={() => setShowNewAppt(true)}>+ Book New</button>
                </div>
              </div>

              <div className="sg">
                <div className="sc"><div className="sc-ico">◷</div><div className="sc-lbl">Visits Scheduled Today</div><div className="sc-val">{todayAppts.length}</div><div className="sc-ch">{todayAppts.filter(a => a.status === "Done").length} done</div></div>
                <div className="sc"><div className="sc-ico">◎</div><div className="sc-lbl">Waiting</div><div className="sc-val">{todayAppts.filter(a => a.status === "Waiting").length}</div></div>
                <div className="sc"><div className="sc-ico">✦</div><div className="sc-lbl">In Progress</div><div className="sc-val">{todayAppts.filter(a => a.status === "In Progress").length}</div></div>
                <div className="sc"><div className="sc-ico">✓</div><div className="sc-lbl">Completed</div><div className="sc-val">{todayAppts.filter(a => a.status === "Done").length}</div></div>
              </div>

              <div className="srch">
                <span className="srch-ico">⌕</span>
                <input placeholder="Search patient name, token #, or doctor" value={search} onChange={e => setSearch(e.target.value)} />
                <button className="btn-sm" onClick={() => setSearch("")}>Clear</button>
                <button className="btn-sm">↑ Oldest first</button>
                <button className="btn-sm">↓ Newest first</button>
              </div>

              {todayAppts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 10, opacity: .3 }}>◷</div>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>No appointments</div>
                  <div style={{ fontSize: 12 }}>Book a new appointment to start the day.</div>
                </div>
              ) : (
                <div className="card">
                  {todayAppts.filter(a => a.patient.toLowerCase().includes(search.toLowerCase())).map((a, i) => (
                    <div key={i} className="appt-item">
                      <div className="appt-time">{a.time}</div>
                      <div className="appt-dot" style={{ background: a.status === "Done" ? T.green : a.status === "In Progress" ? T.gold : T.muted }} />
                      <div className="appt-det">
                        <div className="appt-pt">{a.patient}</div>
                        <div className="appt-pr">{a.procedure} · {a.duration} min · {a.doctor}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span className={`bdg ${a.status === "Done" ? "bdg-done" : a.status === "In Progress" ? "bdg-prog" : a.status === "Waiting" ? "bdg-wait" : "bdg-sch"}`}>{a.status}</span>
                        <span style={{ fontSize: 9.5, color: T.muted, padding: "3px 8px", background: "var(--surf3)", borderRadius: 6 }}>{a.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DOCTORS ── */}
          {page === "doctors" && (
            <div>
              <div className="ph"><div className="pt">Doctors</div><div className="ps">Surgeon and staff directory</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                {[
                  { name: "Dr. Shetty", role: "Consultant Plastic Surgeon", creds: "MBBS · MS · MCh Plastic Surgery", spec: "Rhinoplasty, Breast, Body Contouring", avail: "Mon–Sat, 9AM–6PM", status: "Active" },
                  { name: "Dr. Ananya Rao", role: "Anaesthesiologist", creds: "MBBS · MD Anaesthesia", spec: "General, Spinal, Local Anaesthesia", avail: "Mon–Fri, 8AM–4PM", status: "Active" },
                  { name: "Nurse Lakshmi", role: "Senior Scrub Nurse", creds: "GNM · Post-op Certified", spec: "OT Assistance, Post-op Care", avail: "All days", status: "Active" },
                ].map((d, i) => (
                  <div key={i} className="card" style={{ margin: 0 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${T.gold},${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display, serif", fontSize: 16, color: T.dark, fontWeight: 700, flexShrink: 0 }}>{d.name[3]}</div>
                      <div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 15, color: T.text, marginBottom: 2 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: T.gold, marginBottom: 4 }}>{d.role}</div>
                        <div style={{ fontSize: 10.5, color: T.muted, marginBottom: 3 }}>{d.creds}</div>
                        <div style={{ fontSize: 10.5, color: T.muted }}>{d.spec}</div>
                        <div style={{ marginTop: 8, fontSize: 10.5, color: T.muted }}><span style={{ color: T.green }}>●</span> {d.avail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PHARMACY ── */}
          {page === "pharmacy" && (
            <div>
              <div className="ph-row ph">
                <div><div className="pt">Pharmacy</div><div className="ps">Batch-tracked stock · FIFO dispensing</div></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["New Sale", "Dispense", "Drug Master", "Purchases", "Reports"].map(b => (
                    <button key={b} className={b === "New Sale" ? "btn-g" : "btn-sm"} onClick={b === "New Sale" ? () => setShowNewSale(true) : undefined}>
                      {b === "New Sale" ? "+ " : ""}{b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ph-alert">
                <div className="ph-al-t"><span>⚠</span> Expiring within 90 days ({drugs.filter(d => new Date(d.exp) < new Date("2026-07-31")).length})</div>
                {drugs.filter(d => new Date(d.exp) < new Date("2026-07-31")).map((d, i) => (
                  <div key={i} className="ph-al-row">{d.name} · Batch {d.batch} — expires {d.exp} · {d.stock} left</div>
                ))}
              </div>

              <div className="card">
                <div className="card-t"><span>Drug Stock</span><button className="btn-sm">+ Add Drug</button></div>
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl">
                    <thead><tr>
                      <th>Drug Name</th><th>Batch</th><th>Expiry</th><th>Stock</th><th>Unit</th><th>Rate (₹)</th>
                    </tr></thead>
                    <tbody>
                      {drugs.map((d, i) => (
                        <tr key={i}>
                          <td><div className="tnm">{d.name}</div><div className="mono">{d.id}</div></td>
                          <td><span className="mono">{d.batch}</span></td>
                          <td><span style={{ fontSize: 11.5, color: new Date(d.exp) < new Date("2026-07-31") ? T.red : T.muted }}>{d.exp}</span></td>
                          <td>
                            <div className="drug-stock">
                              <span style={{ fontSize: 12.5, color: d.stock < 20 ? T.red : T.text, minWidth: 28 }}>{d.stock}</span>
                              <div className="stock-bar"><div className="stock-fill" style={{ width: `${Math.min(d.stock, 100)}%`, background: d.stock < 20 ? T.red : T.green }} /></div>
                            </div>
                          </td>
                          <td><span style={{ fontSize: 12, color: T.muted }}>{d.unit}</span></td>
                          <td><span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: T.gold }}>₹{d.rate}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PATIENT LOG ── */}
          {page === "patientlog" && (
            <div>
              <div className="ph-row ph">
                <div><div className="pt">Patient Log</div><div className="ps">Day / Week / Month history of everyone seen, with details & insights.</div></div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Today", "This Week", "This Month", "Custom"].map(f => (
                    <button key={f} className={`chip ${catFilter === f ? "on" : ""}`} onClick={() => setCatFilter(f)}>{f}</button>
                  ))}
                  <button className="btn-sm">⬇ CSV</button>
                </div>
              </div>

              <div className="sg">
                {[
                  { lbl: "Total Visits", val: patients.length, sub: "" },
                  { lbl: "Unique Patients", val: patients.length, sub: "" },
                  { lbl: "Repeat Visits", val: 3, sub: "" },
                  { lbl: "Revenue", val: fmt(totalRevenue), sub: "" },
                  { lbl: "Avg / Day", val: 4, sub: "" },
                  { lbl: "Peak Day", val: "Fri", sub: "" },
                ].map((s, i) => (
                  <div key={i} className="sc" style={{ padding: 14 }}>
                    <div className="sc-lbl">{s.lbl}</div>
                    <div className="sc-val" style={{ fontSize: 20 }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="srch">
                <span className="srch-ico">⌕</span>
                <input placeholder="Search patient name / UHID / phone" value={search} onChange={e => setSearch(e.target.value)} />
                <select className="fs" style={{ background: "transparent", border: "none", color: T.muted, width: 130, fontSize: 12 }}>
                  <option>All Doctors</option><option>Dr. Shetty</option>
                </select>
              </div>

              <div className="card" style={{ padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl">
                    <thead><tr><th>Patient</th><th>Procedure</th><th>Date</th><th>Status</th><th>Risk</th><th>Phone</th></tr></thead>
                    <tbody>
                      {patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
                        <tr key={i} onClick={() => { setSelPt(p); setShowDetail(true); }}>
                          <td><div className="tnm">{p.name}</div><div className="mono">{p.uhid}</div></td>
                          <td><div className="tsub">{p.procedure}</div></td>
                          <td><span className="mono">{p.reg}</span></td>
                          <td><span className={`bdg bdg-${p.status === "IPD" ? "ipd" : p.status === "Pre-Op" ? "pre" : p.status === "Scheduled" ? "sch" : "done"}`}>{p.status}</span></td>
                          <td><span style={{ color: riskColor(p.risk), fontSize: 12, fontWeight: 500 }}>● {p.risk}</span></td>
                          <td><span className="mono">+91 {p.phone}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {page === "services" && (
            <div>
              <div className="ph-row ph">
                <div><div className="pt">Services</div><div className="ps">Procedures, injections, dressings — anything not handled by an appointment bill.</div></div>
                <button className="btn-g" onClick={() => setShowNewSvc(true)}>+ Record Charge</button>
              </div>

              <div className="sg">
                <div className="sc"><div className="sc-lbl">This Month</div><div className="sc-val">{services.length}</div><div className="sc-ch">services rendered</div></div>
                <div className="sc"><div className="sc-lbl">Revenue</div><div className="sc-val" style={{ fontSize: 18 }}>{fmt(monthRevenue)}</div><div className="sc-ch">May 2026</div></div>
                <div className="sc"><div className="sc-lbl">Top Category</div><div className="sc-val" style={{ fontSize: 16, fontFamily: "DM Sans, sans-serif" }}>Procedure</div></div>
              </div>

              {showNewSvc && (
                <div className="card">
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 15, color: T.text, marginBottom: 14 }}>Record a New Charge</div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 8, fontWeight: 600 }}>① Who — Patient and attending doctor</div>
                    <div className="fr">
                      <div className="fg">
                        <label className="fl">Patient *</label>
                        <select className="fs" value={svcForm.patientId} onChange={e => setSvcForm({ ...svcForm, patientId: e.target.value })}>
                          <option value="">Name, phone, or UHID</option>
                          {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.uhid}</option>)}
                        </select>
                      </div>
                      <div className="fg">
                        <label className="fl">Performed By (Optional)</label>
                        <select className="fs" value={svcForm.doctor} onChange={e => setSvcForm({ ...svcForm, doctor: e.target.value })}>
                          <option>Dr. Shetty</option><option>Dr. Ananya Rao</option><option>— No specific doctor —</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: T.muted, marginBottom: 8, fontWeight: 600 }}>② Service — Pick a category</div>
                    <div className="chips" style={{ marginBottom: 10 }}>
                      {PROC_CATS.map(c => (
                        <button key={c} className={`chip ${svcForm.category === c ? "on" : ""}`} onClick={() => setSvcForm({ ...svcForm, category: c })}>{c}</button>
                      ))}
                    </div>
                    <div className="fg"><label className="fl">Description</label><input className="fi" value={svcForm.desc} onChange={e => setSvcForm({ ...svcForm, desc: e.target.value })} placeholder="e.g. Lip Filler 1ml Hyaluronic Acid" /></div>
                    <div className="fg"><label className="fl">Amount (₹)</label><input className="fi" type="number" value={svcForm.amount} onChange={e => setSvcForm({ ...svcForm, amount: e.target.value })} /></div>
                  </div>
                  <div className="btn-r">
                    <button className="btn-gh" onClick={() => setShowNewSvc(false)}>Cancel</button>
                    <button className="btn-g" onClick={addService}>Record Charge</button>
                  </div>
                </div>
              )}

              <div className="card" style={{ padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl">
                    <thead><tr><th>Patient</th><th>Category</th><th>Description</th><th>Date</th><th>Amount</th><th>By</th></tr></thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={i}>
                          <td><div className="tnm">{s.patient}</div></td>
                          <td><span className="bdg bdg-sch" style={{ fontSize: 9.5 }}>{s.category}</span></td>
                          <td><div className="tsub">{s.desc}</div></td>
                          <td><span className="mono">{s.date}</span></td>
                          <td><span style={{ fontFamily: "DM Mono, monospace", color: T.gold, fontSize: 12.5 }}>{fmt(s.amount)}</span></td>
                          <td><span className="tsub">{s.doctor}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ACCOUNTS ── */}
          {page === "accounts" && (
            <div>
              <div className="ph"><div className="pt">Accounts</div><div className="ps">Revenue, billing and financial overview</div></div>
              <div className="sg">
                {[
                  { lbl: "Total Revenue", val: fmt(totalRevenue), ch: "All time" },
                  { lbl: "May 2026 Revenue", val: fmt(monthRevenue), ch: "+12% vs April" },
                  { lbl: "Pending Dues", val: fmt(0), ch: "All cleared" },
                  { lbl: "Procedures Billed", val: services.length, ch: "total entries" },
                ].map((s, i) => (
                  <div key={i} className="sc"><div className="sc-lbl">{s.lbl}</div><div className="sc-val" style={{ fontSize: s.val.startsWith("₹") ? 18 : 26 }}>{s.val}</div><div className="sc-ch">{s.ch}</div></div>
                ))}
              </div>
              <div className="card">
                <div className="card-t">Revenue Breakdown by Procedure</div>
                {PROCS.slice(0, 8).map((p, i) => {
                  const rev = services.filter(s => s.desc.toLowerCase().includes(p.split(" ")[0].toLowerCase())).reduce((a, b) => a + Number(b.amount), 0);
                  const maxRev = 95000;
                  return (
                    <div key={i} className="bar-wrap">
                      <div className="bar-row"><span className="bar-lbl">{p}</span><span className="bar-val">{fmt(rev)}</span></div>
                      <div className="bar-bg"><div className="bar-fill" style={{ width: animated ? `${Math.min((rev / maxRev) * 100, 100)}%` : "0%" }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {page === "analytics" && (
            <div>
              <div className="ph-row ph">
                <div><div className="pt">Analytics</div><div className="ps">Finance, demographics, pharmacy, and operational reports.</div></div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input className="fi" type="date" defaultValue="2026-04-01" style={{ width: 130 }} />
                  <span style={{ color: T.muted, fontSize: 11 }}>to</span>
                  <input className="fi" type="date" defaultValue="2026-05-03" style={{ width: 130 }} />
                  {["Today", "7d", "30d", "90d"].map(f => <button key={f} className="btn-sm">{f}</button>)}
                </div>
              </div>

              <div className="atabs">
                {["overview", "finance", "demographics", "procedures", "pharmacy", "operational"].map(t => (
                  <button key={t} className={`atab ${analyticsTab === t ? "active" : ""}`} onClick={() => setAnalyticsTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
                ))}
              </div>

              {analyticsTab === "overview" && (
                <div>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, fontFamily: "DM Mono, monospace" }}>Today · {dateStr}</div>
                  <div className="sg" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                    {[
                      { lbl: "Visits Today", val: todayAppts.length, sub: `${todayAppts.filter(a => a.status === "Done").length} done`, color: T.blue },
                      { lbl: "Revenue Today", val: fmt(services.filter(s => s.date === today()).reduce((a, b) => a + Number(b.amount), 0)), sub: "", color: T.gold },
                      { lbl: "Active Doctors", val: 1, sub: "", color: T.green },
                      { lbl: "Pending RX", val: 3, sub: "across last 7 days", color: T.accent },
                    ].map((s, i) => (
                      <div key={i} className="sc" style={{ borderTop: `2px solid ${s.color}` }}>
                        <div className="sc-lbl">{s.lbl}</div>
                        <div className="sc-val" style={{ fontSize: s.val.toString().startsWith("₹") ? 18 : 26 }}>{s.val}</div>
                        <div className="sc-ch">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 14, color: T.text, marginBottom: 10 }}>This Month · 1st May 2026 onwards</div>
                  <div className="sg" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                    {[
                      { lbl: "OPD Revenue", val: fmt(monthRevenue), color: T.green },
                      { lbl: "New Patients", val: patients.filter(p => p.reg >= "2026-05-01").length, color: T.blue },
                      { lbl: "Total Patients", val: patients.length, sub: "all-time", color: T.gold },
                      { lbl: "Services Revenue", val: fmt(services.filter(s => s.date >= "2026-05-01").reduce((a, b) => a + Number(b.amount), 0)), color: T.accent },
                    ].map((s, i) => (
                      <div key={i} className="sc">
                        <div className="sc-lbl">{s.lbl}</div>
                        <div className="sc-val" style={{ fontSize: s.val.toString().startsWith("₹") ? 18 : 26, color: s.color }}>{s.val}</div>
                        {s.sub && <div className="sc-ch">{s.sub}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-t">⚠ Alerts</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                      {[["Low Stock Drugs", drugs.filter(d => d.stock < 25).length, T.red], ["Expiring ≤90 Days", drugs.filter(d => new Date(d.exp) < new Date("2026-07-31")).length, T.accent], ["High Risk Patients", patients.filter(p => p.risk === "High").length, T.red]].map(([lbl, val, col]) => (
                        <div key={lbl} style={{ background: `${col}12`, border: `1px solid ${col}30`, borderRadius: 9, padding: "12px 14px" }}>
                          <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em", color: col, marginBottom: 6 }}>{lbl}</div>
                          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, color: col }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {analyticsTab === "procedures" && (
                <div className="card">
                  <div className="card-t">Procedure Breakdown</div>
                  {procBreakdown.map((p, i) => (
                    <div key={i} className="bar-wrap">
                      <div className="bar-row"><span className="bar-lbl">{p.name}</span><span className="bar-val">{p.count} patient{p.count !== 1 ? "s" : ""}</span></div>
                      <div className="bar-bg"><div className="bar-fill" style={{ width: animated ? `${Math.max((p.count / Math.max(...procBreakdown.map(x => x.count))) * 100, 4)}%` : "0%" }} /></div>
                    </div>
                  ))}
                </div>
              )}

              {analyticsTab === "demographics" && (
                <div>
                  <div className="card">
                    <div className="card-t">Age Distribution</div>
                    {[[">60", 0], ["46–60", 1], ["31–45", 4], ["18–30", 3]].map(([range, count]) => (
                      <div key={range} className="bar-wrap">
                        <div className="bar-row"><span className="bar-lbl">{range} years</span><span className="bar-val">{count}</span></div>
                        <div className="bar-bg"><div className="bar-fill" style={{ width: animated ? `${count * 20}%` : "0%" }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-t">Gender Split</div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[["Female", patients.filter(p => p.gender === "Female").length, T.accent], ["Male", patients.filter(p => p.gender === "Male").length, T.blue]].map(([g, n, c]) => (
                        <div key={g} style={{ flex: 1, background: `${c}10`, border: `1px solid ${c}25`, borderRadius: 9, padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em", color: c, marginBottom: 6 }}>{g}</div>
                          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, color: c }}>{n}</div>
                          <div style={{ fontSize: 11, color: T.muted }}>{Math.round((n / patients.length) * 100)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(analyticsTab === "finance" || analyticsTab === "pharmacy" || analyticsTab === "operational") && (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted }}>
                  <div style={{ fontSize: 36, marginBottom: 10, opacity: .3 }}>◈</div>
                  <div style={{ fontSize: 14 }}>Detailed {analyticsTab} reports</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Add more service data to generate reports.</div>
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {page === "notifications" && (
            <div>
              <div className="ph"><div className="pt">Notifications</div><div className="ps">Clinic alerts and reminders</div></div>
              {[
                { ico: "⚠", title: "Backup not configured", desc: "No backup has been set up. Your data is at risk.", type: "danger", time: "Now" },
                { ico: "⚕", title: "High-risk patient: Meera Iyer", desc: "Post Bariatric Surgery — High surgical risk. Pre-op clearance pending.", type: "warn", time: "2h ago" },
                { ico: "◷", title: "5 appointments scheduled today", desc: "Next: Kavitha Rao at 11:30 AM — Breast Aug Review", type: "info", time: "Today" },
                { ico: "✦", title: "Drug expiry alert", desc: "10 drug batches expiring within 90 days. Review pharmacy stock.", type: "warn", time: "Today" },
              ].map((n, i) => (
                <div key={i} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `3px solid ${n.type === "danger" ? T.red : n.type === "warn" ? T.accent : T.blue}` }}>
                  <div style={{ fontSize: 20, marginTop: 2 }}>{n.ico}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{n.desc}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: T.muted, fontFamily: "DM Mono, monospace", flexShrink: 0 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {page === "settings" && (
            <div>
              <div className="ph"><div className="pt">Settings</div><div className="ps">Clinic configuration and preferences</div></div>
              <div className="card" style={{ textAlign: "center", padding: "36px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
                <div style={{ fontSize: 14, color: T.text, marginBottom: 4 }}>Admin access required</div>
                <div style={{ fontSize: 12, color: T.muted }}>Settings are restricted to clinic administrators.</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="bnav">
        <div className="bnav-inner">
          {navItems.slice(0, 5).map(n => (
            <button key={n.id} className={`bnav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="bnav-ico">{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── NEW PATIENT MODAL ── */}
      {showNewPt && (
        <div className="mo" onClick={() => setShowNewPt(false)}>
          <div className="mo-box" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">Register New Patient</div></div>
            <div className="mo-body">
              <div className="fr">
                <div className="fg"><label className="fl">Full Name *</label><input className="fi" placeholder="Patient full name" value={ptForm.name} onChange={e => setPtForm({ ...ptForm, name: e.target.value })} /></div>
                <div className="fg"><label className="fl">Age</label><input className="fi" type="number" value={ptForm.age} onChange={e => setPtForm({ ...ptForm, age: e.target.value })} /></div>
              </div>
              <div className="fr">
                <div className="fg"><label className="fl">Gender</label>
                  <select className="fs" value={ptForm.gender} onChange={e => setPtForm({ ...ptForm, gender: e.target.value })}>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>
                <div className="fg"><label className="fl">Blood Group</label>
                  <select className="fs" value={ptForm.blood} onChange={e => setPtForm({ ...ptForm, blood: e.target.value })}>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg"><label className="fl">Phone *</label><input className="fi" placeholder="+91 98765 43210" value={ptForm.phone} onChange={e => setPtForm({ ...ptForm, phone: e.target.value })} /></div>
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={ptForm.email} onChange={e => setPtForm({ ...ptForm, email: e.target.value })} /></div>
              </div>
              <div className="fg"><label className="fl">Address</label><input className="fi" value={ptForm.address} onChange={e => setPtForm({ ...ptForm, address: e.target.value })} /></div>
              <div className="fg"><label className="fl">Planned Procedure</label>
                <select className="fs" value={ptForm.procedure} onChange={e => setPtForm({ ...ptForm, procedure: e.target.value })}>
                  {PROCS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="fg"><label className="fl">Clinical Notes / PMH</label><textarea className="fta" value={ptForm.notes} onChange={e => setPtForm({ ...ptForm, notes: e.target.value })} placeholder="Known allergies, comorbidities, previous surgeries..." /></div>
              <div className="btn-r">
                <button className="btn-gh" onClick={() => setShowNewPt(false)}>Cancel</button>
                <button className="btn-g" onClick={addPatient}>Register Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW APPOINTMENT MODAL ── */}
      {showNewAppt && (
        <div className="mo" onClick={() => setShowNewAppt(false)}>
          <div className="mo-box" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">Book New Appointment</div></div>
            <div className="mo-body">
              <div className="fg"><label className="fl">Patient *</label>
                <select className="fs" value={apptForm.patientId} onChange={e => setApptForm({ ...apptForm, patientId: e.target.value })}>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.uhid}</option>)}
                </select>
              </div>
              <div className="fr">
                <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={apptForm.date} onChange={e => setApptForm({ ...apptForm, date: e.target.value })} /></div>
                <div className="fg"><label className="fl">Time</label><input className="fi" type="time" value={apptForm.time} onChange={e => setApptForm({ ...apptForm, time: e.target.value })} /></div>
              </div>
              <div className="fr">
                <div className="fg"><label className="fl">Type</label>
                  <select className="fs" value={apptForm.type} onChange={e => setApptForm({ ...apptForm, type: e.target.value })}>
                    {["Consultation", "Pre-Op", "Surgery", "Post-Op", "Follow-Up", "Dressing", "Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="fl">Duration (mins)</label><input className="fi" type="number" value={apptForm.duration} onChange={e => setApptForm({ ...apptForm, duration: e.target.value })} /></div>
              </div>
              <div className="btn-r">
                <button className="btn-gh" onClick={() => setShowNewAppt(false)}>Cancel</button>
                <button className="btn-g" onClick={addAppt}>Book Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW PHARMACY SALE ── */}
      {showNewSale && (
        <div className="mo" onClick={() => setShowNewSale(false)}>
          <div className="mo-box" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">Record New Sale</div></div>
            <div className="mo-body">
              <div className="fg"><label className="fl">Patient *</label>
                <select className="fs" value={saleForm.patientId} onChange={e => setSaleForm({ ...saleForm, patientId: e.target.value })}>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.uhid}</option>)}
                </select>
              </div>
              <div className="fg"><label className="fl">Drug</label>
                <select className="fs" value={saleForm.drug} onChange={e => setSaleForm({ ...saleForm, drug: e.target.value })}>
                  <option value="">Select drug...</option>
                  {drugs.map(d => <option key={d.id} value={d.id}>{d.name} · {d.stock} {d.unit}s left</option>)}
                </select>
              </div>
              <div className="fr">
                <div className="fg"><label className="fl">Quantity</label><input className="fi" type="number" value={saleForm.qty} onChange={e => setSaleForm({ ...saleForm, qty: e.target.value })} /></div>
                <div className="fg"><label className="fl">Total Amount (₹)</label><input className="fi" type="number" value={saleForm.amount} onChange={e => setSaleForm({ ...saleForm, amount: e.target.value })} /></div>
              </div>
              <div className="btn-r">
                <button className="btn-gh" onClick={() => setShowNewSale(false)}>Cancel</button>
                <button className="btn-g" onClick={() => {
                  if (saleForm.drug) {
                    setDrugs(drugs.map(d => d.id === saleForm.drug ? { ...d, stock: Math.max(0, d.stock - Number(saleForm.qty)) } : d));
                    setShowNewSale(false);
                  }
                }}>Record Sale</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PATIENT DETAIL MODAL ── */}
      {showDetail && selPt && (
        <PatientDetail
          patient={selPt}
          onClose={() => setShowDetail(false)}
          onSave={(updated) => { updatePt(updated); setSelPt(updated); }}
        />
      )}
    </div>
  );
}
