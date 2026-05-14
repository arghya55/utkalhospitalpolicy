const Policy = require("../models/Policy");
const Sop = require("../models/sop");
const Department = require("../models/Department");

const Fuse = require("fuse.js");

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const raw = message.toLowerCase();

    // ================= GET DEPARTMENTS =================
    const departments = await Department.find();

    // ================= FUZZY MATCH =================
    const fuse = new Fuse(departments, {
      keys: ["name"],
      threshold: 0.4,
    });

    const result = fuse.search(raw);

    const department = result.length > 0
      ? result[0].item
      : null;

    if (!department) {
      return res.json({
        success: true,
        answer: "Department not found.",
      });
    }

    // ================= TYPE CHECK =================
    const isPolicySearch = raw.includes("policy");
    const isSopSearch = raw.includes("sop");

    let responseText = "";

    // ================= POLICY =================
    if (isPolicySearch) {

      const policies = await Policy.find({
        department: department._id,
      });

      if (!policies.length) {
        return res.json({
          success: true,
          answer: "Policy not found.",
        });
      }

      responseText = `🏥 ${department.name} Department Policies\n\n`;

      policies.forEach((p, i) => {
        responseText += `
${i + 1}. ${p.title}

${p.description}

`;
      });
    }

    // ================= SOP =================
    else if (isSopSearch) {

      const sops = await Sop.find({
        department: department._id,
      });

      if (!sops.length) {
        return res.json({
          success: true,
          answer: "SOP not found.",
        });
      }

      responseText = `🏥 ${department.name} Department SOPs\n\n`;

      sops.forEach((s, i) => {
        responseText += `
${i + 1}. ${s.title}

${s.description}

`;
      });
    }

    // ================= BOTH =================
    else {

      const policies = await Policy.find({
        department: department._id,
      });

      const sops = await Sop.find({
        department: department._id,
      });

      responseText = `🏥 ${department.name} Department Records\n\n`;

      if (policies.length) {
        responseText += `📘 POLICIES\n\n`;
        policies.forEach((p, i) => {
          responseText += `
${i + 1}. ${p.title}

${p.description}

`;
        });
      }

      if (sops.length) {
        responseText += `\n📗 SOPS\n\n`;
        sops.forEach((s, i) => {
          responseText += `
${i + 1}. ${s.title}

${s.description}

`;
        });
      }

      if (!policies.length && !sops.length) {
        responseText = "No records found.";
      }
    }

    return res.json({
      success: true,
      answer: responseText,
    });

  } catch (error) {
    console.log("CHATBOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { chatbot };