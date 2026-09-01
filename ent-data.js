/**
 * ENT SmartIntake Pro - Data Dictionary & EMR Formatting Engine
 * Formatted for Australian Specialist Outpatient Clinics (ieMR / Best Practice / Genie / MedicalDirector)
 */

const ENT_DATA = {
  regions: [
    {
      id: "ear",
      title: "Ear & Hearing",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5C6 5.5 8.5 3 12.5 3C16 3 18.5 5.5 18.5 9.5C18.5 13.5 15.5 16 13 17.5C11.5 18.4 10.5 20 10.5 21"/><path d="M11 8.5C11 7 12 6 13.5 6C15 6 16 7 16 9C16 11 14 12.5 12.5 13.5"/><path d="M12.5 11C11.67 11 11 11.67 11 12.5"/></svg>`,
      description: "Hearing loss, tinnitus, ear pain, discharge, fullness, dizziness"
    },
    {
      id: "nose",
      title: "Nose & Sinus",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3C10.5 6 9.5 9.5 9.5 12C9.5 13.5 9 14.5 7.5 15.5C6 16.5 5 18 6 19.5C7 21 9 21 12 21C15 21 17 21 18 19.5C19 18 18 16.5 16.5 15.5C15 14.5 14.5 13.5 14.5 12C14.5 9.5 13.5 6 12 3Z"/><path d="M9.5 17C10 18 11 18.5 12 18.5C13 18.5 14 18 14.5 17"/></svg>`,
      description: "Blockage, runny nose, sinus pressure, nosebleeds, smell loss"
    },
    {
      id: "throat",
      title: "Throat & Voice",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3C7 3 9 7 9 10C9 14 6 15 6 18C6 20 8 21 12 21C16 21 18 20 18 18C18 15 15 14 15 10C15 7 17 3 17 3"/><path d="M10 11C11 12 13 12 14 11"/><path d="M9.5 14C11 15.5 13 15.5 14.5 14"/></svg>`,
      description: "Sore throat, difficulty swallowing, voice change/hoarseness, globus"
    },
    {
      id: "neck",
      title: "Neck & Head",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 21 21 C 18 19 17.5 15.5 17.5 12 C 17.5 7 14.5 3 10.5 3 C 6.5 3 4.5 6 4.5 9.5 C 4.5 11 4 11.5 3.5 12.5 C 3 13.5 4 14.5 5 14.5 C 5.5 15.5 7 16.5 9.5 16.5 C 11 16.5 12.5 18 12.5 21"/><path d="M 12 9.5 C 11 9.5 10.5 11 11.5 12 C 12.5 13 13.5 11.5 13 10"/></svg>`,
      description: "Neck lumps, swollen glands, facial weakness, gland pain"
    },
    {
      id: "sleep",
      title: "Sleep & Airway",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M6 18c2-2 4-2 6 0s4 2 6 0"/></svg>`,
      description: "Loud snoring, breathing pauses, waking gasping, daytime fatigue"
    }
  ],

  symptomDetails: {
    ear: [
      {
        id: "hearing_loss",
        label: "Hearing Loss / Reduction",
        type: "options",
        options: ["None", "Left Ear Only", "Right Ear Only", "Both Ears"],
        subQuestions: [
          {
            id: "hearing_onset",
            label: "Onset of Hearing Loss",
            type: "select",
            options: ["Sudden (within 72 hours)", "Gradual over months/years", "Fluctuating (comes and goes)", "Post-trauma / noise event"],
            isRedFlag: (val) => val.includes("Sudden")
          },
          {
            id: "hearing_severity",
            label: "Severity Impact",
            type: "select",
            options: ["Mild (difficulty in noisy rooms)", "Moderate (difficulty in quiet conversations)", "Severe (cannot hear normal speech)"]
          }
        ]
      },
      {
        id: "tinnitus",
        label: "Ringing / Buzzing in Ears (Tinnitus)",
        type: "options",
        options: ["None", "Left Ear", "Right Ear", "Both Ears"],
        subQuestions: [
          {
            id: "tinnitus_type",
            label: "Tinnitus Sound Quality",
            type: "select",
            options: ["Constant ringing/hissing", "Pulsatile (throbbing like heartbeat)", "Intermittent click/buzzing"],
            isRedFlag: (val) => val.includes("Pulsatile")
          },
          {
            id: "tinnitus_bother",
            label: "Tinnitus Bother Score (0-10)",
            type: "range",
            min: 0,
            max: 10,
            default: 3
          }
        ]
      },
      {
        id: "dizziness",
        label: "Dizziness / Vertigo / Imbalance",
        type: "options",
        options: ["None", "Spinning Sensation (True Vertigo)", "Unsteadiness / Imbalance", "Lightheadedness / Faintness"],
        subQuestions: [
          {
            id: "vertigo_duration",
            label: "Duration of Dizziness Spells",
            type: "select",
            options: ["Seconds (e.g. turning head in bed)", "Minutes to Hours", "Days continuously", "Constant unsteadiness"]
          },
          {
            id: "vertigo_assoc",
            label: "Associated Symptoms during Dizziness",
            type: "checkboxGroup",
            options: ["Nausea / Vomiting", "Hearing drop during spell", "Ear fullness during spell", "Headache", "Unilateral weakness / Numbness"],
            isRedFlag: (val) => val.includes("Unilateral weakness / Numbness")
          }
        ]
      },
      {
        id: "otalgia",
        label: "Ear Pain (Otalgia)",
        type: "options",
        options: ["None", "Left Ear", "Right Ear", "Both Ears"],
        subQuestions: [
          {
            id: "pain_score",
            label: "Pain Severity (VAS 0-10)",
            type: "range",
            min: 0,
            max: 10,
            default: 4
          },
          {
            id: "pain_nature",
            label: "Nature of Pain",
            type: "select",
            options: ["Throbbing / Deep ache", "Sharp / Stabbing", "Itchy / Burning", "Pain when swallowing / chewing"]
          }
        ]
      },
      {
        id: "otorrhea",
        label: "Ear Discharge / Fluid Leak",
        type: "options",
        options: ["None", "Clear / Watery", "Yellow / Foul Purulent", "Bloody / Sanguineous"],
        isRedFlag: (val) => val.includes("Bloody")
      }
    ],

    nose: [
      {
        id: "nasal_block",
        label: "Nasal Blockage / Congestion",
        type: "options",
        options: ["None", "Left Side Only", "Right Side Only", "Both Sides (Alternating)", "Both Sides (Constant)"],
        subQuestions: [
          {
            id: "block_duration",
            label: "Duration of Congestion",
            type: "select",
            options: ["Less than 2 weeks", "2 to 12 weeks", "More than 3 months (Chronic)"]
          }
        ]
      },
      {
        id: "rhinorrhea",
        label: "Runny Nose / Discharge",
        type: "options",
        options: ["None", "Clear / Watery", "Thick Yellow / Green", "Clear fluid trickling from one nostril"],
        isRedFlag: (val) => val.includes("Clear fluid trickling from one nostril")
      },
      {
        id: "epistaxis",
        label: "Nosebleeds (Epistaxis)",
        type: "options",
        options: ["None", "Rare / Minor streaks", "Frequent (Multiple times/week)", "Profuse / Unilateral heavy bleeding"],
        isRedFlag: (val) => val.includes("Profuse")
      },
      {
        id: "facial_pain",
        label: "Facial Pain / Pressure / Sinusitis",
        type: "options",
        options: ["None", "Forehead / Frontal", "Cheek / Maxillary (Left)", "Cheek / Maxillary (Right)", "Between Eyes"],
        subQuestions: [
          {
            id: "facial_severity",
            label: "Facial Pressure Score (0-10)",
            type: "range",
            min: 0,
            max: 10,
            default: 5
          }
        ]
      },
      {
        id: "smell_loss",
        label: "Loss of Smell / Taste (Anosmia)",
        type: "options",
        options: ["Normal", "Reduced (Hyposmia)", "Complete Loss (Anosmia)", "Foul Smell Distortions (Parosmia)"]
      }
    ],

    throat: [
      {
        id: "hoarseness",
        label: "Voice Change / Hoarseness",
        type: "options",
        options: ["None", "Mild / Intermittent", "Persistent (> 3 weeks continuous)", "Severe / Complete loss of voice (Aphonia)"],
        isRedFlag: (val) => val.includes("Persistent (> 3 weeks continuous)"),
        subQuestions: [
          {
            id: "hoarse_duration",
            label: "Duration of Voice Change",
            type: "select",
            options: ["Less than 3 weeks", "3 to 6 weeks", "More than 6 weeks"]
          }
        ]
      },
      {
        id: "dysphagia",
        label: "Difficulty Swallowing (Dysphagia)",
        type: "options",
        options: ["None", "Difficulty with Solids only", "Difficulty with Liquids & Solids", "Painful swallowing (Odynophagia)"],
        isRedFlag: (val) => val.includes("Difficulty with Liquids") || val.includes("Solids only")
      },
      {
        id: "globus",
        label: "Globus (Lump in Throat / Foreign Body Sensation)",
        type: "options",
        options: ["None", "Intermittent (better when eating)", "Constant sensation", "Aggravated by acid reflux"]
      },
      {
        id: "sore_throat",
        label: "Sore Throat",
        type: "options",
        options: ["None", "Mild / Scratchy", "Moderate / Recurrent tonsillitis", "Severe / Unable to swallow saliva"],
        isRedFlag: (val) => val.includes("Unable to swallow saliva")
      }
    ],

    neck: [
      {
        id: "neck_lump",
        label: "Neck Lump / Mass / Swelling",
        type: "options",
        options: ["None", "Single painless lump", "Multiple lumps", "Painful / Tender swelling", "Rapidly growing lump"],
        isRedFlag: (val) => val.includes("Single painless lump") || val.includes("Rapidly growing lump"),
        subQuestions: [
          {
            id: "lump_duration",
            label: "How long has the lump been present?",
            type: "select",
            options: ["Less than 2 weeks", "2 to 4 weeks", "1 to 3 months", "More than 3 months"]
          },
          {
            id: "lump_location",
            label: "Location of Neck Mass",
            type: "select",
            options: ["Upper neck under jaw (Submandibular)", "Side of neck (Jugulodigastric / Lateral)", "Front midline of neck (Thyroid area)", "Behind ear / Parotid"]
          }
        ]
      },
      {
        id: "salivary",
        label: "Salivary Gland Swelling / Pain with Meals",
        type: "options",
        options: ["None", "Swelling under jaw during meals", "Swelling in front of ear (Parotid)"]
      },
      {
        id: "facial_palsy",
        label: "Facial Weakness / Asymmetry / Numbness",
        type: "options",
        options: ["None", "Left side facial weakness", "Right side facial weakness"],
        isRedFlag: (val) => val !== "None"
      }
    ],

    sleep: [
      {
        id: "snoring",
        label: "Loud Snoring",
        type: "options",
        options: ["None", "Mild (heard only in room)", "Loud (heard through closed door)", "Heroic (disruptive to partner/household)"]
      },
      {
        id: "apnea_episodes",
        label: "Witnessed Apneas (Pauses in Breathing)",
        type: "options",
        options: ["No", "Occasionally", "Frequently noticed by partner"],
        isRedFlag: (val) => val.includes("Frequently")
      },
      {
        id: "gasping",
        label: "Waking up Gasping or Choking",
        type: "options",
        options: ["No", "Yes, occasionally", "Yes, frequently"]
      },
      {
        id: "daytime_fatigue",
        label: "Daytime Somnolence / Fatigue (Epworth Scale)",
        type: "options",
        options: ["Normal energy", "Mild tiredness", "Moderate (fall asleep reading/watching TV)", "Severe (fall asleep driving/talking)"],
        isRedFlag: (val) => val.includes("Severe")
      }
    ]
  },

  socialHistoryFields: {
    smoking: {
      statusOptions: [
        { value: "never", label: "Never Smoked" },
        { value: "former", label: "Former Smoker (Quit)" },
        { value: "current", label: "Current Smoker" }
      ],
      types: [
        "Cigarettes",
        "E-Cigarettes / Vaping",
        "Cigars",
        "Pipe",
        "Chewing Tobacco"
      ]
    },
    alcohol: {
      statusOptions: [
        { value: "none", label: "Non-Drinker" },
        { value: "occasional", label: "Occasional (1-2 drinks/month)" },
        { value: "moderate", label: "Moderate (1-10 standard drinks/week)" },
        { value: "heavy", label: "Heavy (> 10 standard drinks/week or daily)" }
      ]
    },
    recreationalDrugs: {
      options: [
        "None",
        "Cannabis / Marijuana",
        "Cocaine / Amphetamines / MDMA",
        "Opioids",
        "Inhalants",
        "Prefer not to say"
      ]
    },
    occupationalExposures: {
      options: [
        "Industrial / Loud Noise Exposure (without ear protection)",
        "Wood Dust / Carpentry",
        "Heavy Chemical / Solvent Fumes",
        "Formaldehyde / Textile Dust",
        "Asbestos",
        "None of the above"
      ]
    }
  },

  presetScenarios: [
    {
      id: "sudden_snhl",
      name: "Preset 1: Sudden Hearing Loss (Urgent Red Flag)",
      data: {
        patientInfo: {
          fullName: "David Miller",
          dob: "1978-04-12",
          gender: "Male",
          urn: "7891234",
          phone: "0412 345 678",
          medicare: "2123 45678 1"
        },
        regions: ["ear"],
        symptomData: {
          hearing_loss: "Left Ear Only",
          hearing_onset: "Sudden (within 72 hours)",
          hearing_severity: "Severe (cannot hear normal speech)",
          tinnitus: "Left Ear",
          tinnitus_type: "Constant ringing/hissing",
          tinnitus_bother: "8",
          dizziness: "None",
          otalgia: "None",
          otorrhea: "None"
        },
        medicalHx: {
          conditions: ["Hypertension"],
          surgeries: ["None"],
          medications: "Amlodipine 5mg daily",
          allergies: "Penicillin (Rash)"
        },
        socialHx: {
          smokingStatus: "never",
          vapingStatus: "no",
          alcoholStatus: "occasional",
          drugs: ["None"],
          exposures: ["Industrial / Loud Noise Exposure (without ear protection)"]
        }
      }
    },
    {
      id: "head_neck_cancer_risk",
      name: "Preset 2: Hoarseness & Painless Neck Lump (Smoker)",
      data: {
        patientInfo: {
          fullName: "Robert Taylor",
          dob: "1962-09-25",
          gender: "Male",
          urn: "6254891",
          phone: "0488 987 654",
          medicare: "3987 65432 1"
        },
        regions: ["throat", "neck"],
        symptomData: {
          hoarseness: "Persistent (> 3 weeks continuous)",
          hoarse_duration: "More than 6 weeks",
          dysphagia: "Difficulty with Solids only",
          globus: "Constant sensation",
          sore_throat: "Mild / Scratchy",
          neck_lump: "Single painless lump",
          lump_duration: "1 to 3 months",
          lump_location: "Side of neck (Jugulodigastric / Lateral)",
          salivary: "None",
          facial_palsy: "None"
        },
        medicalHx: {
          conditions: ["COPD", "GORD / Acid Reflux"],
          surgeries: ["Appendicectomy 1985"],
          medications: "Seretide inhaler, Pantoprazole 40mg",
          allergies: "Nil known drug allergies"
        },
        socialHx: {
          smokingStatus: "current",
          cigsPerDay: 20,
          yearsSmoked: 40,
          vapingStatus: "no",
          alcoholStatus: "heavy",
          drinksPerWeek: 18,
          drugs: ["None"],
          exposures: ["Wood Dust / Carpentry"]
        }
      }
    },
    {
      id: "chronic_sinusitis",
      name: "Preset 3: Chronic Sinusitis & Anosmia",
      data: {
        patientInfo: {
          fullName: "Emma Watson",
          dob: "1990-11-03",
          gender: "Female",
          urn: "9011452",
          phone: "0433 111 222",
          medicare: "4111 22233 1"
        },
        regions: ["nose"],
        symptomData: {
          nasal_block: "Both Sides (Constant)",
          block_duration: "More than 3 months (Chronic)",
          rhinorrhea: "Thick Yellow / Green",
          epistaxis: "Rare / Minor streaks",
          facial_pain: "Cheek / Maxillary (Left)",
          facial_severity: "7",
          smell_loss: "Complete Loss (Anosmia)"
        },
        medicalHx: {
          conditions: ["Asthma", "Allergic Rhinitis"],
          surgeries: ["Tonsillectomy 2005"],
          medications: "Ventolin PRN, Nasonex nasal spray",
          allergies: "Aspirin (Exacerbates asthma)"
        },
        socialHx: {
          smokingStatus: "never",
          vapingStatus: "no",
          alcoholStatus: "occasional",
          drugs: ["None"],
          exposures: ["None of the above"]
        }
      }
    },
    {
      id: "osa_snoring",
      name: "Preset 4: OSA & Severe Snoring",
      data: {
        patientInfo: {
          fullName: "James Wilson",
          dob: "1975-02-18",
          gender: "Male",
          urn: "7502981",
          phone: "0400 555 777",
          medicare: "5555 77799 1"
        },
        regions: ["sleep", "nose"],
        symptomData: {
          snoring: "Heroic (disruptive to partner/household)",
          apnea_episodes: "Frequently noticed by partner",
          gasping: "Yes, frequently",
          daytime_fatigue: "Severe (fall asleep driving/talking)",
          nasal_block: "Both Sides (Alternating)",
          block_duration: "More than 3 months (Chronic)"
        },
        medicalHx: {
          conditions: ["Hypertension", "Obesity (BMI 33)", "Type 2 Diabetes"],
          surgeries: ["None"],
          medications: "Perindopril 5mg, Metformin 1000mg BD",
          allergies: "Nil"
        },
        socialHx: {
          smokingStatus: "former",
          cigsPerDay: 10,
          yearsSmoked: 10,
          vapingStatus: "no",
          alcoholStatus: "moderate",
          drinksPerWeek: 8,
          drugs: ["None"],
          exposures: ["Industrial / Loud Noise Exposure (without ear protection)"]
        }
      }
    }
  ]
};

/**
 * Generates Clinical Outpatient Progress Note for ieMR / Genie / Best Practice
 */
function generateEMRNote(formData) {
  const p = formData.patientInfo || {};
  const s = formData.symptomData || {};
  const m = formData.medicalHx || {};
  const soc = formData.socialHx || {};
  const redFlags = formData.redFlags || [];

  let note = [];

  note.push(`SPECIALIST OUTPATIENT CLINICAL ASSESSMENT`);
  note.push(`EAR, NOSE AND THROAT (ENT) SERVICE | PRE-CONSULTATION INTAKE SUMMARY`);
  note.push(`--------------------------------------------------------------------------------`);
  note.push(`PATIENT NAME: ${p.fullName || 'N/A'}`);
  note.push(`DOB: ${p.dob || 'N/A'}    GENDER: ${p.gender || 'N/A'}    URN: ${p.urn || 'N/A'}    MEDICARE: ${p.medicare || 'N/A'}`);
  note.push(`PHONE: ${p.phone || 'N/A'}    ASSESSMENT DATE: ${new Date().toLocaleDateString('en-AU')}`);
  note.push(`--------------------------------------------------------------------------------`);
  note.push(``);

  // RED FLAGS / CLINICAL ALERTS
  note.push(`1. CLINICAL ALERTS & RED FLAGS:`);
  if (redFlags.length > 0) {
    redFlags.forEach(rf => note.push(`   [!] URGENT RED FLAG: ${rf}`));
  } else {
    note.push(`   - Screened Negative for acute Red Flags`);
  }
  note.push(``);

  // PRESENTING COMPLAINTS
  note.push(`2. PRESENTING COMPLAINTS:`);
  if (formData.regions && formData.regions.length > 0) {
    note.push(`   Systems Selected: ${formData.regions.map(r => r.toUpperCase()).join(', ')}`);
  }

  let symptomLines = [];
  for (let key in s) {
    if (s[key] && s[key] !== "None" && s[key] !== "Normal" && s[key] !== "No") {
      const formattedKey = key.replace(/_/g, ' ').toUpperCase();
      symptomLines.push(`   * ${formattedKey}: ${s[key]}`);
    }
  }

  if (symptomLines.length > 0) {
    note = note.concat(symptomLines);
  } else {
    note.push(`   * Routine Follow-up / No acute focal symptoms checked.`);
  }
  note.push(``);

  // PAST MEDICAL & SURGICAL HX
  note.push(`3. PAST MEDICAL & SURGICAL HISTORY:`);
  if (m.conditions && m.conditions.length > 0) {
    note.push(`   - Medical Conditions: ${m.conditions.join(', ')}`);
  } else {
    note.push(`   - Medical Conditions: Nil reported`);
  }
  if (m.surgeries && m.surgeries.length > 0) {
    note.push(`   - Surgical History: ${m.surgeries}`);
  } else {
    note.push(`   - Surgical History: Nil reported`);
  }
  note.push(``);

  // CURRENT MEDICATIONS
  note.push(`4. CURRENT MEDICATIONS:`);
  note.push(`   - ${m.medications || 'Nil regular medications reported'}`);
  note.push(``);

  // ALLERGIES & ADVERSE REACTIONS
  note.push(`5. ALLERGIES & ADVERSE REACTIONS:`);
  note.push(`   - ${m.allergies || 'Nil Known Drug Allergies (NKDA)'}`);
  note.push(``);

  // SOCIAL HISTORY (Expanded)
  note.push(`6. SOCIAL & LIFESTYLE HISTORY:`);
  
  // Smoking & Pack Years
  let smokeText = "Non-smoker";
  if (soc.smokingStatus === "current") {
    const cigs = parseInt(soc.cigsPerDay) || 0;
    const yrs = parseInt(soc.yearsSmoked) || 0;
    const packYears = ((cigs / 20) * yrs).toFixed(1);
    smokeText = `Current Smoker (${cigs} cigs/day for ${yrs} yrs = ${packYears} pack-years)`;
  } else if (soc.smokingStatus === "former") {
    const cigs = parseInt(soc.cigsPerDay) || 0;
    const yrs = parseInt(soc.yearsSmoked) || 0;
    const packYears = ((cigs / 20) * yrs).toFixed(1);
    smokeText = `Former Smoker (Quit. History of ${packYears} pack-years)`;
  }
  note.push(`   - Tobacco / Smoking: ${smokeText}`);

  if (soc.vapingStatus && soc.vapingStatus !== "no") {
    note.push(`   - E-Cigarette / Vaping: Active Vaper (${soc.vapingStatus})`);
  }

  // Alcohol
  let alcText = soc.alcoholStatus || "Non-drinker";
  if (soc.drinksPerWeek) {
    alcText += ` (~${soc.drinksPerWeek} std drinks/week)`;
  }
  note.push(`   - Alcohol Intake: ${alcText}`);

  // Recreational Drugs
  if (soc.drugs && soc.drugs.length > 0 && !soc.drugs.includes("None")) {
    note.push(`   - Recreational Drugs: ${soc.drugs.join(', ')}`);
  } else {
    note.push(`   - Recreational Drugs: Negative / Nil reported`);
  }

  // Occupational Exposures
  if (soc.exposures && soc.exposures.length > 0 && !soc.exposures.includes("None of the above")) {
    note.push(`   - Occupational Exposures: ${soc.exposures.join('; ')}`);
  } else {
    note.push(`   - Occupational Exposures: No significant industrial noise/chemical exposure`);
  }
  note.push(``);

  // RECOMMENDED CLINICAL WORKUP
  note.push(`7. SUGGESTED CLINICAL INVESTIGATIONS & WORKUP:`);
  const workup = getSuggestedWorkup(formData);
  workup.forEach(w => note.push(`   [ ] ${w}`));

  note.push(``);
  note.push(`--------------------------------------------------------------------------------`);
  note.push(`COMPLETED VIA ENT SMARTINTAKE SYSTEM`);

  return note.join('\n');
}

/**
 * Intelligence logic for auto-recommending ENT clinical exams
 */
function getSuggestedWorkup(formData) {
  const reg = formData.regions || [];
  const s = formData.symptomData || {};

  let recs = [];

  if (reg.includes("ear")) {
    recs.push("Otoscopy / Video Otomicroscopy");
    if (s.hearing_loss && s.hearing_loss !== "None") {
      recs.push("Pure Tone Audiometry (PTA) & Tympanometry");
      if (s.hearing_onset && s.hearing_onset.includes("Sudden")) {
        recs.push("URGENT: High-dose oral Steroid protocol consideration & MRI Brain/IAC (Exclude Acoustic Neuroma)");
      }
    }
    if (s.dizziness && s.dizziness !== "None") {
      recs.push("Vestibular Function Screening (Dix-Hallpike / VNG)");
    }
  }

  if (reg.includes("nose")) {
    recs.push("Anterior Rhinoscopy");
    recs.push("Flexible Nasendoscopy (Nasal Cavity & Nasopharynx)");
    if (s.smell_loss && s.smell_loss.includes("Loss")) {
      recs.push("Olfactory Function Testing & CT Sinuses");
    }
  }

  if (reg.includes("throat") || reg.includes("neck")) {
    recs.push("Flexible Fibreoptic Laryngoscopy (FFL) / Stroboscopy");
    if (s.neck_lump && s.neck_lump !== "None") {
      recs.push("Neck Ultrasound +/- Fine Needle Aspiration (FNA) Biopsy");
      recs.push("Contrast-Enhanced CT Neck / PET-CT consideration");
    }
  }

  if (reg.includes("sleep")) {
    recs.push("Upper Airway Nasendoscopy (Muller Maneuver)");
    recs.push("Overnight Polysomnography (Diagnostic Sleep Study referral)");
  }

  if (recs.length === 0) {
    recs.push("General Head & Neck ENT Physical Examination");
  }

  return recs;
}
