const exercisesPanel = document.getElementById('exercisesPanel');
const infoPanel = document.getElementById('infoPanel');
const exList = document.getElementById('exList');
const infoContent = document.getElementById('infoContent');
const daysList = document.getElementById('daysList');
const presetSelect = document.getElementById('presetSelect');

const exercises = {
  'Flat Bench Press': {description:'Lie on flat bench, grip bar slightly wider than shoulders, lower to chest, press up.', muscles:'Chest, shoulders, triceps', image:'images/flat_bench_press.jpg'},
  'Incline Bench Press': {description:'Lie on incline bench (30-45°), lower bar to chest, press up.', muscles:'Upper chest, shoulders, triceps', image:'images/incline_bench_press.jpg'},
  'Shoulder Press': {description:'Seated/standing, push bar/dumbbells overhead.', muscles:'Shoulders, triceps', image:'images/shoulder_press.jpg'},
  'Dumbbell Flyes': {description:'Lie on bench, arms slightly bent, open dumbbells to sides, squeeze up.', muscles:'Chest, shoulders', image:'images/dumbbell_flyes.jpg'},
  'Triceps Pushdowns': {description:'Push cable down with elbows close, extend arms fully.', muscles:'Triceps', image:'images/triceps_pushdowns.jpg'},
  'Deadlift': {description:'Feet hip-width, grip bar, lift with hips/knees, back neutral.', muscles:'Back, glutes, hamstrings, core', image:'images/deadlift.jpg'},
  'Pull-Ups': {description:'Hang from bar, palms away, pull chest to bar, lower slowly.', muscles:'Back, biceps, shoulders', image:'images/pull_ups.jpg'},
  'Bent-Over Row': {description:'Hinge at hips, pull barbell/dumbbells to torso.', muscles:'Back, biceps', image:'images/bent_over_row.jpg'},
  'Face Pulls': {description:'Pull rope to face on cable machine.', muscles:'Rear delts, traps, upper back', image:'images/face_pulls.jpg'},
  'Barbell Curls': {description:'Curl barbell up to shoulders, elbows stationary.', muscles:'Biceps', image:'images/barbell_curls.jpg'},
  'Squats': {description:'Feet shoulder-width, lower hips until thighs parallel, push up.', muscles:'Quads, glutes, hamstrings, core', image:'images/squat.jpg'},
  'Leg Press': {description:'Push platform with feet shoulder-width, extend legs, lower slowly.', muscles:'Quads, glutes, hamstrings', image:'images/leg_press.jpg'},
  'Romanian Deadlift': {description:'Hinge at hips, bar/dumbbells down legs, return upright.', muscles:'Hamstrings, glutes, back', image:'images/romanian_deadlift.jpg'},
  'Walking Lunges': {description:'Step forward, lower back knee to ground, push up, alternate legs.', muscles:'Quads, glutes, hamstrings', image:'images/walking_lunges.jpg'},
  'Leg Curls': {description:'Curl legs on machine towards glutes.', muscles:'Hamstrings', image:'images/leg_curls.jpg'},
  'Back Squat': {description:'Bar rests on back, lower hips until thighs parallel, push up.', muscles:'Quads, glutes, hamstrings, core', image:'images/back_squat.jpg'},
  'Overhead Press': {description:'Push bar/dumbbells overhead from shoulders.', muscles:'Shoulders, triceps', image:'images/overhead_press.jpg'},
  'Rows': {description:'Pull bar/dumbbells to torso while bent over.', muscles:'Back, biceps', image:'images/rows.jpg'},
  'Bicep Curls': {description:'Curl dumbbells/barbell to shoulders.', muscles:'Biceps', image:'images/bicep_curls.jpg'},
  'Tricep Extensions': {description:'Extend arms overhead or cable to work triceps.', muscles:'Triceps', image:'images/tricep_extensions.jpg'},
  'Calf Raises': {description:'Raise heels standing or seated.', muscles:'Calves', image:'images/calf_raises.jpg'}
};

const presets = {
  ppl: { 'Push':['Flat Bench Press','Incline Bench Press','Shoulder Press','Dumbbell Flyes','Triceps Pushdowns'], 'Pull':['Deadlift','Pull-Ups','Bent-Over Row','Face Pulls','Barbell Curls'], 'Legs':['Squats','Leg Press','Romanian Deadlift','Walking Lunges','Leg Curls'] },
  ul: { 'Upper':['Bench Press','Overhead Press','Pull-Ups','Rows','Bicep Curls','Tricep Extensions'], 'Lower':['Back Squat','Deadlift','Leg Press','Leg Curl','Calf Raises'] }
};

const defaultPPLDays=['Push','Pull','Legs','Rest','Push','Pull','Legs'];
const defaultULDays=['Upper','Lower','Rest','Upper','Lower','Rest','Rest'];

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
  for(let i=0;i<7;i++){
    const row=document.createElement('div');
    row.className='day-row';
    row.innerHTML=`
      <label class="day-label">Day ${i+1}</label>
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
