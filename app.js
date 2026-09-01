/**
 * ENT SmartIntake Pro - Interactive Application Logic
 * Designed for Australian ENT Outpatient Clinics
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Application State
  const state = {
    mode: 'patient',
    currentStep: 1,
    selectedRegions: ['ear'],
    patientInfo: {
      fullName: 'John Smith',
      dob: '1980-06-15',
      gender: 'Male',
      urn: '1234567',
      phone: '0412 345 678',
      medicare: '2123 45678 1'
    },
    symptomData: {},
    medicalHx: {
      conditions: [],
      surgeries: '',
      medications: '',
      allergies: ''
    },
    socialHx: {
      smokingStatus: 'never',
      cigsPerDay: 0,
      yearsSmoked: 0,
      vapingStatus: 'no',
      alcoholStatus: 'none',
      drinksPerWeek: 0,
      drugs: ['None'],
      exposures: ['None of the above']
    },
    redFlags: []
  };

  // DOM Elements Initialization
  initRegionSelector();
  initStepNavigation();
  initSocialHistoryEvents();
  initMedicalHxQuickHelpers();
  initModeTabs();
  initThemeToggle();
  initPresetButtons();
  initEMRCopy();

  // Initial Render
  updateProgressUI();

  // -------------------------------------------------------------
  // 1. REGION SELECTOR (STEP 1)
  // -------------------------------------------------------------
  function initRegionSelector() {
    const container = document.getElementById('region-selector');
    if (!container) return;

    container.innerHTML = ENT_DATA.regions.map(r => `
      <div class="region-card ${state.selectedRegions.includes(r.id) ? 'selected' : ''}" data-id="${r.id}">
        <div class="region-check">${state.selectedRegions.includes(r.id) ? '✓' : ''}</div>
        <div class="region-icon">${r.icon}</div>
        <div class="region-title">${r.title}</div>
        <div class="region-desc">${r.description}</div>
      </div>
    `).join('');

    container.querySelectorAll('.region-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (state.selectedRegions.includes(id)) {
          if (state.selectedRegions.length > 1) {
            state.selectedRegions = state.selectedRegions.filter(x => x !== id);
          } else {
            showToast("Please select at least one region.");
            return;
          }
        } else {
          state.selectedRegions.push(id);
        }
        initRegionSelector();
      });
    });
  }

  // -------------------------------------------------------------
  // 2. DYNAMIC SYMPTOM QUESTION RENDERER (STEP 2)
  // -------------------------------------------------------------
  function renderSymptomQuestions() {
    const container = document.getElementById('dynamic-symptom-container');
    if (!container) return;

    let html = '';

    state.selectedRegions.forEach(regionId => {
      const regionMeta = ENT_DATA.regions.find(r => r.id === regionId);
      const questions = ENT_DATA.symptomDetails[regionId] || [];

      html += `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
          <h3 style="color:var(--accent-cyan); font-family:var(--font-heading); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <span>${regionMeta.icon}</span> ${regionMeta.title} Symptoms
          </h3>
      `;

      questions.forEach(q => {
        const currentVal = state.symptomData[q.id] || q.options[0];
        
        html += `
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label>${q.label}:</label>
            <div class="pill-group" data-qid="${q.id}">
              ${q.options.map(opt => `
                <span class="option-pill ${currentVal === opt ? 'active' : ''}" data-val="${opt}">${opt}</span>
              `).join('')}
            </div>
        `;

        // Render sub-questions if main option is active & not 'None'
        if (q.subQuestions && currentVal !== 'None' && currentVal !== 'Normal' && currentVal !== 'No') {
          html += `<div style="margin-top:0.75rem; padding-left:1rem; border-left:2px solid var(--accent-cyan);">`;
          q.subQuestions.forEach(sq => {
            const sqVal = state.symptomData[sq.id] || (sq.type === 'range' ? sq.default : (sq.options ? sq.options[0] : ''));

            if (sq.type === 'select') {
              html += `
                <div class="form-group" style="margin-top:0.5rem;">
                  <label style="font-size:0.8rem; color:var(--text-muted);">${sq.label}:</label>
                  <select class="form-select sq-input" data-sqid="${sq.id}" style="max-width:320px;">
                    ${sq.options.map(opt => `<option value="${opt}" ${sqVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                  </select>
                </div>
              `;
            } else if (sq.type === 'range') {
              html += `
                <div class="form-group" style="margin-top:0.5rem;">
                  <label style="font-size:0.8rem; color:var(--text-muted);">${sq.label}:</label>
                  <div class="slider-container">
                    <input type="range" class="sq-range" data-sqid="${sq.id}" min="${sq.min}" max="${sq.max}" value="${sqVal}">
                    <span class="slider-val-badge">${sqVal} / 10</span>
                  </div>
                </div>
              `;
            }
          });
          html += `</div>`;
        }

        html += `</div>`;
      });

      html += `</div>`;
    });

    container.innerHTML = html;

    // Attach Event Listeners to Option Pills
    container.querySelectorAll('.pill-group').forEach(group => {
      const qid = group.dataset.qid;
      group.querySelectorAll('.option-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          state.symptomData[qid] = pill.dataset.val;
          renderSymptomQuestions();
          checkRedFlags();
        });
      });
    });

    // Sub-question events
    container.querySelectorAll('.sq-input').forEach(sel => {
      sel.addEventListener('change', (e) => {
        state.symptomData[sel.dataset.sqid] = e.target.value;
        checkRedFlags();
      });
    });

    container.querySelectorAll('.sq-range').forEach(rng => {
      rng.addEventListener('input', (e) => {
        state.symptomData[rng.dataset.sqid] = e.target.value;
        rng.nextElementSibling.textContent = `${e.target.value} / 10`;
      });
    });
  }

  // -------------------------------------------------------------
  // 3. MEDICAL HX QUICK HELPERS (UNSURE OPTIONS & NKDA)
  // -------------------------------------------------------------
  function initMedicalHxQuickHelpers() {
    const chkNKDA = document.getElementById('chk-nkda');
    const inpAllergies = document.getElementById('inp-allergies');
    const chkAllergyUnsure = document.getElementById('chk-allergy-unsure');

    chkNKDA?.addEventListener('change', () => {
      if (chkNKDA.checked) {
        inpAllergies.value = "Nil Known Drug Allergies (NKDA)";
        chkAllergyUnsure.checked = false;
      }
    });

    chkAllergyUnsure?.addEventListener('change', () => {
      if (chkAllergyUnsure.checked) {
        chkNKDA.checked = false;
        if (!inpAllergies.value || inpAllergies.value.includes("NKDA")) {
          inpAllergies.value = "Has drug allergies (Unsure of exact drug names)";
        }
      }
    });

    const chkSurgeryUnsure = document.getElementById('chk-surgery-unsure');
    const inpSurgeries = document.getElementById('inp-surgeries');
    chkSurgeryUnsure?.addEventListener('change', () => {
      if (chkSurgeryUnsure.checked && !inpSurgeries.value) {
        inpSurgeries.value = "Had past surgeries (Unsure of exact dates/names)";
      }
    });
  }

  // -------------------------------------------------------------
  // 4. SOCIAL HISTORY EVENTS & PACK-YEARS CALCULATION
  // -------------------------------------------------------------
  function initSocialHistoryEvents() {
    // Smoking pills
    const smokePills = document.querySelectorAll('#smoke-status-pills .option-pill');
    smokePills.forEach(pill => {
      pill.addEventListener('click', () => {
        smokePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.socialHx.smokingStatus = pill.dataset.val;
        
        const detailsBox = document.getElementById('smoke-details-box');
        if (pill.dataset.val === 'current' || pill.dataset.val === 'former') {
          detailsBox.style.display = 'block';
        } else {
          detailsBox.style.display = 'none';
        }
        updatePackYears();
      });
    });

    document.getElementById('inp-cigs-day')?.addEventListener('input', updatePackYears);
    document.getElementById('inp-years-smoked')?.addEventListener('input', updatePackYears);

    // Vaping pills
    const vapePills = document.querySelectorAll('#vape-status-pills .option-pill');
    vapePills.forEach(pill => {
      pill.addEventListener('click', () => {
        vapePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.socialHx.vapingStatus = pill.dataset.val;
      });
    });

    // Alcohol status
    const alcPills = document.querySelectorAll('#alcohol-status-pills .option-pill');
    alcPills.forEach(pill => {
      pill.addEventListener('click', () => {
        alcPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.socialHx.alcoholStatus = pill.dataset.val;

        const qtyBox = document.getElementById('alcohol-qty-box');
        if (pill.dataset.val !== 'none') {
          qtyBox.style.display = 'block';
        } else {
          qtyBox.style.display = 'none';
        }
      });
    });
  }

  function updatePackYears() {
    const cigs = parseInt(document.getElementById('inp-cigs-day')?.value) || 0;
    const yrs = parseInt(document.getElementById('inp-years-smoked')?.value) || 0;
    state.socialHx.cigsPerDay = cigs;
    state.socialHx.yearsSmoked = yrs;
    
    const packYears = ((cigs / 20) * yrs).toFixed(1);
    const display = document.getElementById('pack-years-display');
    if (display) display.textContent = packYears;
  }

  // -------------------------------------------------------------
  // 5. STEP NAVIGATION LOGIC
  // -------------------------------------------------------------
  function initStepNavigation() {
    // Step 1 -> 2
    document.getElementById('btn-step1-next')?.addEventListener('click', () => {
      gatherDemographics();
      state.currentStep = 2;
      renderSymptomQuestions();
      updateStepVisibility();
    });

    // Step 2 prev/next
    document.getElementById('btn-step2-prev')?.addEventListener('click', () => {
      state.currentStep = 1;
      updateStepVisibility();
    });
    document.getElementById('btn-step2-next')?.addEventListener('click', () => {
      state.currentStep = 3;
      updateStepVisibility();
    });

    // Step 3 prev/next
    document.getElementById('btn-step3-prev')?.addEventListener('click', () => {
      state.currentStep = 2;
      updateStepVisibility();
    });
    document.getElementById('btn-step3-next')?.addEventListener('click', () => {
      gatherMedicalHx();
      state.currentStep = 4;
      updateStepVisibility();
    });

    // Step 4 prev/next
    document.getElementById('btn-step4-prev')?.addEventListener('click', () => {
      state.currentStep = 3;
      updateStepVisibility();
    });
    document.getElementById('btn-step4-next')?.addEventListener('click', () => {
      gatherSocialHx();
      checkRedFlags();
      renderReviewStep();
      state.currentStep = 5;
      updateStepVisibility();
    });

    // Step 5 prev/submit
    document.getElementById('btn-step5-prev')?.addEventListener('click', () => {
      state.currentStep = 4;
      updateStepVisibility();
    });

    document.getElementById('btn-submit-intake')?.addEventListener('click', () => {
      document.getElementById('patient-step-5').style.display = 'none';
      document.getElementById('patient-step-success').style.display = 'block';
      updateEMRDashboard();
    });

    document.getElementById('btn-view-in-doctor-dash')?.addEventListener('click', () => {
      switchMode('doctor');
    });
  }

  function gatherDemographics() {
    state.patientInfo.fullName = document.getElementById('inp-fullname')?.value || 'N/A';
    state.patientInfo.dob = document.getElementById('inp-dob')?.value || 'N/A';
    state.patientInfo.gender = document.getElementById('inp-gender')?.value || 'Male';
    state.patientInfo.urn = document.getElementById('inp-urn')?.value || 'N/A';
    state.patientInfo.phone = document.getElementById('inp-phone')?.value || 'N/A';
    state.patientInfo.medicare = document.getElementById('inp-medicare')?.value || 'N/A';
  }

  function gatherMedicalHx() {
    const checkedConds = Array.from(document.querySelectorAll('input[name="med-cond"]:checked')).map(cb => cb.value);
    state.medicalHx.conditions = checkedConds;

    let surg = document.getElementById('inp-surgeries')?.value || '';
    if (document.getElementById('chk-surgery-unsure')?.checked && !surg.includes("Unsure")) {
      surg += (surg ? " " : "") + "(Had surgeries - Unsure of exact details)";
    }
    state.medicalHx.surgeries = surg;

    // Gather quick meds options & custom text
    const checkedMedsQuick = Array.from(document.querySelectorAll('input[name="med-quick"]:checked')).map(cb => cb.value);
    let customMeds = document.getElementById('inp-medications')?.value || '';

    let combinedMeds = [ ...checkedMedsQuick ];
    if (customMeds.trim()) {
      combinedMeds.push(customMeds.trim());
    }
    state.medicalHx.medications = combinedMeds.length > 0 ? combinedMeds.join('; ') : 'Nil regular medications reported';

    let alg = document.getElementById('inp-allergies')?.value || '';
    if (document.getElementById('chk-nkda')?.checked) {
      alg = "Nil Known Drug Allergies (NKDA)";
    }
    state.medicalHx.allergies = alg || 'Nil known drug allergies';
  }

  function gatherSocialHx() {
    state.socialHx.drinksPerWeek = parseInt(document.getElementById('inp-drinks-week')?.value) || 0;
    
    const checkedDrugs = Array.from(document.querySelectorAll('input[name="rec-drug"]:checked')).map(cb => cb.value);
    state.socialHx.drugs = checkedDrugs.length > 0 ? checkedDrugs : ['None'];

    const checkedExp = Array.from(document.querySelectorAll('input[name="occ-exp"]:checked')).map(cb => cb.value);
    state.socialHx.exposures = checkedExp.length > 0 ? checkedExp : ['None of the above'];
  }

  function updateStepVisibility() {
    for (let i = 1; i <= 5; i++) {
      const stepEl = document.getElementById(`patient-step-${i}`);
      const lblEl = document.getElementById(`step-lbl-${i}`);
      if (stepEl) {
        stepEl.style.display = (i === state.currentStep) ? 'block' : 'none';
      }
      if (lblEl) {
        lblEl.className = 'step-item';
        if (i === state.currentStep) lblEl.classList.add('active');
        if (i < state.currentStep) lblEl.classList.add('completed');
      }
    }
    updateProgressUI();
  }

  function updateProgressUI() {
    const fill = document.getElementById('progress-fill');
    if (fill) {
      const pct = (state.currentStep / 5) * 100;
      fill.style.width = `${pct}%`;
    }
  }

  // -------------------------------------------------------------
  // 6. RED FLAG CHECKER & REVIEW STEP
  // -------------------------------------------------------------
  function checkRedFlags() {
    state.redFlags = [];

    // Check Ear red flags
    if (state.symptomData.hearing_onset && state.symptomData.hearing_onset.includes("Sudden")) {
      state.redFlags.push("Sudden Onset Hearing Loss (< 72 hours)");
    }
    if (state.symptomData.otorrhea && state.symptomData.otorrhea.includes("Bloody")) {
      state.redFlags.push("Bloody Ear Discharge");
    }

    // Check Nose red flags
    if (state.symptomData.rhinorrhea && state.symptomData.rhinorrhea.includes("Clear fluid trickling")) {
      state.redFlags.push("Possible Unilateral CSF Rhinorrhea Leak");
    }
    if (state.symptomData.epistaxis && state.symptomData.epistaxis.includes("Profuse")) {
      state.redFlags.push("Profuse Heavy Epistaxis");
    }

    // Check Throat/Voice red flags
    if (state.symptomData.hoarseness && state.symptomData.hoarseness.includes("Persistent")) {
      state.redFlags.push("Persistent Hoarseness > 3 Weeks (Head & Neck Malignancy Screening Required)");
    }
    if (state.symptomData.dysphagia && (state.symptomData.dysphagia.includes("Liquids") || state.symptomData.dysphagia.includes("Solids only"))) {
      state.redFlags.push("Progressive Dysphagia / Swallowing Obstruction");
    }

    // Check Neck red flags
    if (state.symptomData.neck_lump && (state.symptomData.neck_lump.includes("Single painless") || state.symptomData.neck_lump.includes("Rapidly growing"))) {
      state.redFlags.push("Suspicious Neck Mass (Painless/Rapid Growth)");
    }

    // Check Sleep red flags
    if (state.symptomData.apnea_episodes && state.symptomData.apnea_episodes.includes("Frequently")) {
      state.redFlags.push("Frequent Witnessed Apneas & High Risk OSA");
    }

    // Check Blood Thinners Medication Alert
    if (state.medicalHx.medications && state.medicalHx.medications.includes("Blood Thinners")) {
      state.redFlags.push("Patient Taking Blood Thinners / Anticoagulants (Caution for Biopsy / Surgery)");
    }
  }

  function renderReviewStep() {
    const rfBox = document.getElementById('red-flag-review-box');
    if (rfBox) {
      if (state.redFlags.length > 0) {
        rfBox.innerHTML = `
          <div class="red-flag-box">
            <div class="red-flag-icon">🚨</div>
            <div class="red-flag-content">
              <h4>Urgent Symptoms / Clinical Alerts Flagged</h4>
              <p>${state.redFlags.join('<br>')}</p>
            </div>
          </div>
        `;
      } else {
        rfBox.innerHTML = '';
      }
    }

    const preview = document.getElementById('intake-summary-preview');
    if (preview) {
      preview.innerText = generateEMRNote(state);
    }
  }

  // -------------------------------------------------------------
  // 7. CLINICIAN EMR DASHBOARD UPDATER
  // -------------------------------------------------------------
  function updateEMRDashboard() {
    const emrText = generateEMRNote(state);
    const outputEl = document.getElementById('emr-output-text');
    if (outputEl) outputEl.textContent = emrText;

    // Visual summary items
    const demo = document.getElementById('doc-sum-demographics');
    if (demo) demo.textContent = `${state.patientInfo.fullName} (${state.patientInfo.gender}, DOB: ${state.patientInfo.dob}) | URN: ${state.patientInfo.urn || 'N/A'}`;

    const cc = document.getElementById('doc-sum-cc');
    if (cc) cc.textContent = state.selectedRegions.map(r => r.toUpperCase()).join(', ');

    const social = document.getElementById('doc-sum-social');
    if (social) {
      let smk = state.socialHx.smokingStatus.toUpperCase();
      if (state.socialHx.smokingStatus === 'current' || state.socialHx.smokingStatus === 'former') {
        const py = (((parseInt(state.socialHx.cigsPerDay)||0)/20) * (parseInt(state.socialHx.yearsSmoked)||0)).toFixed(1);
        smk += ` (${py} pk-yrs)`;
      }
      social.textContent = `Smoking: ${smk} | Alcohol: ${state.socialHx.alcoholStatus.toUpperCase()}`;
    }

    const med = document.getElementById('doc-sum-med');
    if (med) {
      med.textContent = `Cond: ${state.medicalHx.conditions.join(', ') || 'Nil'} | Meds: ${state.medicalHx.medications} | Allergies: ${state.medicalHx.allergies || 'Nil'}`;
    }

    // Red flag alerts container
    const docRfBox = document.getElementById('doc-red-flag-alert-box');
    if (docRfBox) {
      if (state.redFlags.length > 0) {
        docRfBox.style.display = 'block';
        docRfBox.innerHTML = `
          <div class="glass-card" style="border-color:var(--accent-rose); background:rgba(244,63,94,0.1); margin-bottom:1.5rem;">
            <h3 style="color:var(--accent-rose); font-size:1.1rem; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
              <span>🚨</span> URGENT RED FLAG CLINICAL ALERTS
            </h3>
            <ul style="padding-left:1.25rem; color:var(--text-primary); font-size:0.9rem;">
              ${state.redFlags.map(rf => `<li><strong>${rf}</strong></li>`).join('')}
            </ul>
          </div>
        `;
      } else {
        docRfBox.style.display = 'none';
      }
    }

    // Workup checklist
    const workupContainer = document.getElementById('doc-workup-checklist');
    if (workupContainer) {
      const recs = getSuggestedWorkup(state);
      workupContainer.innerHTML = recs.map(r => `
        <label class="checkbox-pill" style="background:rgba(255,255,255,0.06); padding:0.6rem 0.85rem; font-size:0.85rem;">
          <input type="checkbox" checked> ${r}
        </label>
      `).join('');
    }
  }

  // -------------------------------------------------------------
  // 8. PRESET BUTTON LOADERS
  // -------------------------------------------------------------
  function initPresetButtons() {
    document.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        const scenario = ENT_DATA.presetScenarios.find(s => s.id === presetKey);
        if (!scenario) return;

        // Load scenario into state
        const d = scenario.data;
        state.patientInfo = { ...d.patientInfo };
        state.selectedRegions = [ ...d.regions ];
        state.symptomData = { ...d.symptomData };
        state.medicalHx = { ...d.medicalHx };
        state.socialHx = { ...d.socialHx };

        // Sync inputs
        syncInputsFromState();
        checkRedFlags();
        updateEMRDashboard();

        showToast(`Loaded "${scenario.name}"`);
        switchMode('doctor');
      });
    });
  }

  function syncInputsFromState() {
    if (document.getElementById('inp-fullname')) document.getElementById('inp-fullname').value = state.patientInfo.fullName;
    if (document.getElementById('inp-dob')) document.getElementById('inp-dob').value = state.patientInfo.dob;
    if (document.getElementById('inp-gender')) document.getElementById('inp-gender').value = state.patientInfo.gender;
    if (document.getElementById('inp-urn')) document.getElementById('inp-urn').value = state.patientInfo.urn || '';
    if (document.getElementById('inp-phone')) document.getElementById('inp-phone').value = state.patientInfo.phone;
    if (document.getElementById('inp-medicare')) document.getElementById('inp-medicare').value = state.patientInfo.medicare;

    if (document.getElementById('inp-surgeries')) document.getElementById('inp-surgeries').value = state.medicalHx.surgeries;
    if (document.getElementById('inp-medications')) document.getElementById('inp-medications').value = state.medicalHx.medications;
    if (document.getElementById('inp-allergies')) document.getElementById('inp-allergies').value = state.medicalHx.allergies;

    initRegionSelector();
  }

  // -------------------------------------------------------------
  // 9. MODE SWITCHER & THEME TOGGLE
  // -------------------------------------------------------------
  function initModeTabs() {
    document.getElementById('btn-mode-patient')?.addEventListener('click', () => switchMode('patient'));
    document.getElementById('btn-mode-doctor')?.addEventListener('click', () => switchMode('doctor'));
  }

  function switchMode(mode) {
    state.mode = mode;
    const btnPatient = document.getElementById('btn-mode-patient');
    const btnDoctor = document.getElementById('btn-mode-doctor');

    const viewPatient = document.getElementById('view-patient');
    const viewDoctor = document.getElementById('view-doctor');

    if (mode === 'patient') {
      btnPatient?.classList.add('active');
      btnDoctor?.classList.remove('active');
      viewPatient?.classList.add('active-view');
      viewDoctor?.classList.remove('active-view');
    } else {
      btnDoctor?.classList.add('active');
      btnPatient?.classList.remove('active');
      viewDoctor?.classList.add('active-view');
      viewPatient?.classList.remove('active-view');
      updateEMRDashboard();
    }
  }

  function initThemeToggle() {
    const btn = document.getElementById('btn-theme-toggle');
    btn?.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.body.removeAttribute('data-theme');
        btn.textContent = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'light');
        btn.textContent = '☀️';
      }
    });
  }

  // -------------------------------------------------------------
  // 10. EMR COPY & TOAST UTILITY
  // -------------------------------------------------------------
  function initEMRCopy() {
    const copyHandler = () => {
      const note = generateEMRNote(state);
      navigator.clipboard.writeText(note).then(() => {
        showToast("📋 EMR Note copied to clipboard!");
      }).catch(err => {
        showToast("Failed to copy note.");
      });
    };

    document.getElementById('btn-copy-emr')?.addEventListener('click', copyHandler);
    document.getElementById('btn-copy-emr-2')?.addEventListener('click', copyHandler);
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

});
