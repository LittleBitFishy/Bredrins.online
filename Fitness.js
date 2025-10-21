const exercisesPanel = document.getElementById('exercisesPanel');
const infoPanel = document.getElementById('infoPanel');
const exList = document.getElementById('exList');
const infoContent = document.getElementById('infoContent');
const daysList = document.getElementById('daysList');
const presetSelect = document.getElementById('presetSelect');

const exercises = {
  'Incline Smith Press': { description: 'Set incline bench in Smith machine, lower bar to upper chest, press upward.', muscles: 'Upper chest, shoulders, triceps', image: 'images/incline_smith_press.jpg' },
  'Dumbbell Decline Fly': { description: 'Lie on decline bench with dumbbells, open arms wide, squeeze chest at top.', muscles: 'Lower chest', image: 'images/dumbbell_decline_fly.jpg' },
  'Front Delt Raise': { description: 'Raise dumbbells or plate in front to shoulder height, control the descent.', muscles: 'Front delts, shoulders', image: 'images/front_delt_raise.jpg' },
  'Cable Lateral Raise': { description: 'Raise cable handle from side until shoulder height, control down.', muscles: 'Lateral delts', image: 'images/cable_lateral_raise.jpg' },
  'Rear Delt Cable Fly': { description: 'Cross cables, pull arms apart at shoulder height, squeeze rear delts.', muscles: 'Rear delts, traps', image: 'images/rear_delt_cable_fly.jpg' },
  'Wide Grip Cable Pulldown': { description: 'Pull bar to chest with wide grip, squeeze back.', muscles: 'Lats, biceps', image: 'images/wide_grip_cable_pulldown.jpg' },
  'Seated Cable Row': { description: 'Pull cable handle to torso, squeeze shoulder blades together.', muscles: 'Back, biceps', image: 'images/seated_cable_row.jpg' },
  'Preacher Curl': { description: 'Rest arms on preacher bench pad, curl bar upward under control.', muscles: 'Biceps', image: 'images/preacher_curl.jpg' },
  'Hammer Curl': { description: 'Hold dumbbells neutral grip, curl up to shoulders.', muscles: 'Biceps, forearms', image: 'images/hammer_curl.jpg' },
  'Cable Overhead Extension': { description: 'Extend arms overhead using cable rope, stretch triceps fully.', muscles: 'Triceps', image: 'images/cable_overhead_extension.jpg' },

  // Lower
  'RDL': { description: 'Hinge at hips, lower bar down legs, feel hamstring stretch, return upright.', muscles: 'Hamstrings, glutes, lower back', image: 'images/rdl.jpg' },
  'Leg Curl': { description: 'Curl legs toward glutes using machine.', muscles: 'Hamstrings', image: 'images/leg_curl.jpg' },
  'Leg Press': { description: 'Push platform away, control descent.', muscles: 'Quads, glutes, hamstrings', image: 'images/leg_press.jpg' },
  'Leg Extensions': { description: 'Extend legs on machine, contract quads at top.', muscles: 'Quadriceps', image: 'images/leg_extensions.jpg' },
  'Calf Raises': { description: 'Raise heels standing or seated.', muscles: 'Calves', image: 'images/calf_raises.jpg' },
  'Cable Crunches': { description: 'Kneel with cable rope, crunch forward contracting abs.', muscles: 'Abdominals', image: 'images/cable_crunches.jpg' },
  'Forearm Curls': { description: 'Curl wrists upward holding barbell/dumbbell.', muscles: 'Forearms', image: 'images/forearm_curls.jpg' }
};

const presets = {
  ppl: { 
    'Push': ['Flat Bench Press', 'Incline Bench Press', 'Shoulder Press', 'Dumbbell Flyes', 'Triceps Pushdowns'],
    'Pull': ['Deadlift', 'Pull-Ups', 'Bent-Over Row', 'Face Pulls', 'Barbell Curls'],
    'Legs': ['Squats', 'Leg Press', 'Romanian Deadlift', 'Walking Lunges', 'Leg Curls']
  },
  ul: { 
    'Upper': [
      'Incline Smith Press',
      'Dumbbell Decline Fly',
      'Front Delt Raise',
      'Cable Lateral Raise',
      'Rear Delt Cable Fly',
      'Wide Grip Cable Pulldown',
      'Seated Cable Row',
      'Preacher Curl',
      'Hammer Curl',
      'Cable Overhead Extension'
    ],
    'Lower': [
      'RDL',
      'Leg Curl',
      'Leg Press',
      'Leg Extensions',
      'Calf Raises',
      'Cable Crunches',
      'Forearm Curls'
    ]
  }
};

const defaultPPLDays = ['Push', 'Pull', 'Legs', 'Rest', 'Push', 'Pull', 'Legs'];
const defaultULDays = ['Lower', 'Upper', 'Rest', 'Upper', 'Lower', 'Rest', 'Upper'];

// Keep rest of JS unchanged...

// ... [Keep the rest of your JS exactly the same below this point]

function arraysEqual(a,b){return a.length===b.length && a.every((v,i)=>v===b[i]);}

// -------------------
// PANEL TRANSITIONS
// -------------------
function showPanel(panel){
  panel.classList.remove('hidden','hiding');
  panel.classList.add('visible');
  updateLayout();
}

function hidePanel(panel){
  if(panel.classList.contains('hidden') || panel.classList.contains('hiding')) return;
  panel.classList.remove('visible');
  panel.classList.add('hiding');
  panel.addEventListener('transitionend', function handler(){
    panel.classList.remove('hiding');
    panel.classList.add('hidden');
    updateLayout();
    panel.removeEventListener('transitionend', handler);
  });
}

// -------------------
// FLEX LAYOUT UPDATE
// -------------------
function updateLayout(){
  const panels = [document.getElementById('daysPanel'), exercisesPanel, infoPanel];
  const planner = document.querySelector('.planner');
  const visibleCount = panels.filter(p=>!p.classList.contains('hidden')).length;

  planner.classList.remove('one-panel','two-panels','three-panels');
  if(visibleCount===1) planner.classList.add('one-panel');
  else if(visibleCount===2) planner.classList.add('two-panels');
  else if(visibleCount===3) planner.classList.add('three-panels');
}

// -------------------
// CREATE DAYS
// -------------------
function createDayRows(){
  daysList.innerHTML='';
  const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  for(let i=0;i<7;i++){
    const row=document.createElement('div');
    row.className='day-row';
    row.innerHTML=`
      <label class="day-label">${weekDays[i]}</label>
      <div class="custom-select day-select" data-day="${i}">
        <button class="select-btn">Choose day</button>
        <div class="select-options">
          <div class="option" data-value="Upper">Upper</div>
          <div class="option" data-value="Lower">Lower</div>
          <div class="option" data-value="Push">Push</div>
          <div class="option" data-value="Pull">Pull</div>
          <div class="option" data-value="Legs">Legs</div>
          <div class="option" data-value="Rest">Rest</div>
        </div>
      </div>
    `;
    daysList.appendChild(row);
  }
  attachRowEvents();
}

// -------------------
// DAY EVENTS
// -------------------
function attachRowEvents(){
  document.querySelectorAll('.day-select').forEach(select=>{
    const btn=select.querySelector('.select-btn');
    const options=select.querySelector('.select-options');
    btn.addEventListener('click', e=> {
      e.stopPropagation();
      options.classList.toggle('show');
    });
    options.querySelectorAll('.option').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        btn.textContent=opt.textContent;
        btn.dataset.value=opt.dataset.value;
        options.classList.remove('show');
        showExercises(opt.dataset.value);
        hidePanel(infoPanel);
        detectCustomPreset();
      });
    });
  });
}

// -------------------
// SHOW EXERCISES
// -------------------
function showExercises(type){
  exList.innerHTML='';
  if(!type || type==='Rest'){
    exList.innerHTML='<p class="hint">Rest day 💤</p>';
    infoContent.innerHTML='<h4>Rest Day</h4><p>Take it easy!</p>';
    showPanel(exercisesPanel);
    hidePanel(infoPanel);
    return;
  }

  let list=[];
  if(presets.ppl[type]) list=presets.ppl[type];
  else if(presets.ul[type]) list=presets.ul[type];

  if(list.length===0){
    exList.innerHTML=`<p class="hint">No exercises listed for ${type}.</p>`;
    infoContent.innerHTML=`<p class='hint'>Select an exercise to add details here.</p>`;
  } else {
    list.forEach((name,index)=>{
      const item=document.createElement('div');
      item.className='exercise-item';
      item.innerHTML=`<button class="ex-reveal">▶</button><span class="ex-name">${name}</span>`;
      exList.appendChild(item);

      setTimeout(()=>{item.classList.add('visible')}, index*100);

      item.querySelector('.ex-reveal').addEventListener('click', ()=>{
        const ex=exercises[name]||{description:'',muscles:'',image:''};
        infoContent.innerHTML=`
          <h4>${name}</h4>
          <p><strong>Muscles worked:</strong> ${ex.muscles}</p>
          <p><strong>Instructions:</strong> ${ex.description}</p>
          ${ex.image?`<img src="${ex.image}" alt="${name}">`:''}
        `;
        showPanel(infoPanel);
      });
    });
  }

  showPanel(exercisesPanel);
  hidePanel(infoPanel);
}

// -------------------
// CUSTOM PRESET DETECTION
// -------------------
function detectCustomPreset(){
  const days=Array.from(document.querySelectorAll('.day-select')).map(s=>s.querySelector('.select-btn').dataset.value);
  const btn=presetSelect.querySelector('.select-btn');
  if(arraysEqual(days, defaultPPLDays)) btn.textContent='Push Pull Legs (PPL)';
  else if(arraysEqual(days, defaultULDays)) btn.textContent='Upper Lower (UL)';
  else btn.textContent='Custom';
}

// -------------------
// PRESET EVENTS
// -------------------
function attachPresetEvents(){
  const btn=presetSelect.querySelector('.select-btn');
  btn.addEventListener('click', e=> { e.stopPropagation(); presetSelect.querySelector('.select-options').classList.toggle('show'); });
  presetSelect.querySelectorAll('.option').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      const val=opt.dataset.value;
      btn.textContent=opt.textContent;
      presetSelect.querySelector('.select-options').classList.remove('show');

      let mapping = val==='ppl'? defaultPPLDays : val==='ul'? defaultULDays : [];
      document.querySelectorAll('.day-select').forEach((sel,i)=>{
        const b=sel.querySelector('.select-btn');
        b.textContent=mapping[i];
        b.dataset.value=mapping[i];
      });

      detectCustomPreset();
      hidePanel(exercisesPanel);
      hidePanel(infoPanel);
    });
  });
}

// -------------------
// INIT
// -------------------
createDayRows();
attachPresetEvents();
updateLayout();

// Close dropdowns on outside click
window.addEventListener('click', ()=>{
  document.querySelectorAll('.select-options').forEach(opt=>opt.classList.remove('show'));
});
