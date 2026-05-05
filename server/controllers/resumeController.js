const pdfParse = require('pdf-parse');
const fs = require('fs');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;
    const extracted = extractResumeData(text);

    // Save raw data to user
    await User.findByIdAndUpdate(req.user._id, {
      resumeUrl: `/uploads/${req.file.filename}`,
      extractedResume: {
        skills: extracted.skills,
        experience: extracted.experience.map((e) => e.role || e.company || ''),
        education: extracted.education.map((e) => e.institution || ''),
        rawText: text.substring(0, 2000),
      },
    });

    // Update portfolio
    const updateData = {};
    if (extracted.skills.length > 0) updateData.skills = extracted.skills;
    if (extracted.experience.length > 0) updateData.experience = extracted.experience;
    if (extracted.education.length > 0) updateData.education = extracted.education;

    if (Object.keys(updateData).length > 0) {
      await Portfolio.findOneAndUpdate({ userId: req.user._id }, { $set: updateData });
    }

    res.json({ message: 'Resume parsed successfully.', extracted });
  } catch (error) {
    next(error);
  }
};

// Clean a string - remove newlines, extra spaces, limit length
const clean = (str) => (str || '').replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150);

function extractResumeData(text) {
  // Split into clean lines
  const lines = text.split('\n')
    .map((l) => l.replace(/[\r\t]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 2 && l.length < 200);

  // ---- SKILLS ----
  const SKILL_KEYWORDS = [
    'JavaScript','TypeScript','Python','Java','React','Node.js','Express',
    'MongoDB','PostgreSQL','MySQL','Redis','Docker','Kubernetes','AWS',
    'Azure','GCP','Git','GraphQL','REST','CSS','HTML','Vue','Angular',
    'Next.js','Nuxt','Tailwind','Bootstrap','Jest','Cypress','Linux',
    'C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin','Flutter',
    'TensorFlow','PyTorch','Machine Learning','AI','DevOps','CI/CD',
    'Django','Flask','Spring','Firebase','Redux','Figma','Postman','Vite',
  ];
  const skills = SKILL_KEYWORDS.filter((s) =>
    text.toLowerCase().includes(s.toLowerCase())
  );

  // ---- SECTION DETECTION ----
  const EXP_HEADERS = /^(work experience|experience|employment|internship|professional experience)/i;
  const EDU_HEADERS = /^(education|academic|qualification|schooling)/i;
  const OTHER_HEADERS = /^(skills|projects|certifications|achievements|summary|objective|profile|contact|about)/i;

  const EDU_WORDS = ['university','college','institute','school','academy','bachelor',
    'master','b.tech','btech','m.tech','phd','degree','diploma','secondary',
    'higher secondary','senior secondary','10th','12th','cbse','icse','hsc',
    'engineering and technology','bits','iit','nit','pilani'];

  const EXP_WORDS = ['intern','internship','engineer','developer','analyst',
    'manager','lead','senior','junior','associate','consultant','sde','trainee'];

  const EXP_COMPANY_WORDS = ['pvt','ltd','inc','llc','technologies','solutions',
    'systems','services','software','tech','labs','studio','corp'];

  let section = '';
  const expLines = [];
  const eduLines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Detect section change
    if (EXP_HEADERS.test(line)) { section = 'exp'; continue; }
    if (EDU_HEADERS.test(line)) { section = 'edu'; continue; }
    if (OTHER_HEADERS.test(line)) { section = 'other'; continue; }

    if (section === 'exp') expLines.push(line);
    else if (section === 'edu') eduLines.push(line);
    else {
      // fallback keyword matching when no section header found
      const isEdu = EDU_WORDS.some((w) => lower.includes(w));
      const isExp = EXP_WORDS.some((w) => lower.includes(w)) ||
                    EXP_COMPANY_WORDS.some((w) => lower.includes(w));
      if (isEdu && !isExp) eduLines.push(line);
      else if (isExp && !isEdu) expLines.push(line);
    }
  }

  // ---- BUILD EXPERIENCE entries ----
  const experience = [];
  const seenExp = new Set();
  for (const line of expLines) {
    const lower = line.toLowerCase();
    // Skip if it looks like education
    if (EDU_WORDS.some((w) => lower.includes(w))) continue;
    const hasRole = EXP_WORDS.some((w) => lower.includes(w));
    const hasCompany = EXP_COMPANY_WORDS.some((w) => lower.includes(w));
    const key = clean(line);
    if ((hasRole || hasCompany) && !seenExp.has(key) && key.length > 3) {
      seenExp.add(key);
      experience.push({
        company: clean(line),
        role: hasRole ? clean(line) : 'Developer',
        duration: '',
        description: '',
      });
    }
  }

  // ---- BUILD EDUCATION entries ----
  const education = [];
  const seenEdu = new Set();
  for (const line of eduLines) {
    const lower = line.toLowerCase();
    // Skip if it looks like job experience
    if (EXP_WORDS.some((w) => lower.includes(w)) && !EDU_WORDS.some((w) => lower.includes(w))) continue;
    const key = clean(line);
    if (!seenEdu.has(key) && key.length > 3) {
      seenEdu.add(key);
      const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
      education.push({
        institution: clean(line),
        degree: '',
        year: yearMatch ? yearMatch[0] : '',
      });
    }
  }

  return {
    skills: [...new Set(skills)],
    experience: experience.slice(0, 5),
    education: education.slice(0, 4),
  };
}