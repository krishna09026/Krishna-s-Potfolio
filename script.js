const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const header = document.getElementById('header');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  let current = 'home';
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 160) current = section.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const questions = [
  'What kind of developer do you want to become in the next 2 years, and why?',
  'Tell me about one project you are most proud of. What problem did it solve?',
  'If you could add one AI feature to a website, what would you build and why?',
  'What is one technical skill you are actively improving right now?'
];
let questionIndex = 0;
const questionEl = document.getElementById('ai-question');
const answerEl = document.getElementById('ai-answer');
const resultEl = document.getElementById('analysis-result');
const countEl = document.getElementById('question-count');

function analyzeLocally(answer){
  const text = answer.toLowerCase();
  const signals = {
    frontend: ['frontend','ui','ux','react','css','javascript','html','design'],
    backend: ['backend','api','node','express','server','database','mongodb','sql'],
    ai: ['ai','machine learning','ml','llm','automation','model','artificial intelligence'],
    product: ['user','product','problem','business','customer','impact'],
    learning: ['learn','learning','improve','practice','study','grow','skill']
  };
  const scores = Object.fromEntries(Object.keys(signals).map(k => [k, signals[k].filter(w => text.includes(w)).length]));
  const top = Object.entries(scores).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0).slice(0,3).map(x=>x[0]);
  const focus = top.length ? top.join(', ') : 'general development';
  let feedback = 'Your answer shows direction and intent. Add a concrete example, measurable result, or technology choice to make your response stronger.';
  if(scores.product >= 1) feedback = 'Good product thinking. You connected development with users or outcomes, which is valuable in real-world engineering work.';
  else if(scores.ai >= 1) feedback = 'Strong AI curiosity. A concrete use case, data source, evaluation method, and fallback strategy would make the idea even stronger.';
  else if(scores.learning >= 1) feedback = 'Strong growth mindset. Mentioning how you practice and what you built while learning would make the answer more convincing.';
  return {focus, feedback};
}

async function analyzeWithOptionalAPI(answer){
  // Optional real-AI endpoint: deploy /api/analyze on your server and return {focus, feedback}.
  try {
    const response = await fetch('/api/analyze', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question:questionEl.textContent, answer})});
    if(response.ok){ const data = await response.json(); if(data.focus && data.feedback) return data; }
  } catch(e) { /* Static hosting: use local analyzer below. */ }
  return analyzeLocally(answer);
}

document.getElementById('analyze-btn').addEventListener('click', async () => {
  const answer = answerEl.value.trim();
  if(answer.length < 12){ resultEl.className='analysis-result show'; resultEl.innerHTML='<h4>Give me a little more.</h4><p>Write at least a couple of sentences so the analyzer has enough context.</p>'; return; }
  const button = document.getElementById('analyze-btn'); button.disabled=true; button.innerHTML='Analyzing... <i class="bx bx-loader-alt bx-spin"></i>';
  const data = await analyzeWithOptionalAPI(answer);
  resultEl.className='analysis-result show';
  resultEl.innerHTML=`<h4>Profile signal: ${data.focus}</h4><p>${data.feedback}</p>`;
  button.disabled=false; button.innerHTML='Analyze My Answer <i class="bx bx-sparkles"></i>';
});

document.getElementById('next-question').addEventListener('click', () => {
  questionIndex = (questionIndex + 1) % questions.length;
  questionEl.textContent = questions[questionIndex];
  countEl.textContent = `QUESTION ${String(questionIndex+1).padStart(2,'0')}`;
  answerEl.value=''; resultEl.className='analysis-result'; resultEl.innerHTML=''; answerEl.focus();
});

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nReply to: ${data.get('email')}`);
  window.location.href = `mailto:krish.soni.02999@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('form-status').textContent = 'Opening your email client...';
});
