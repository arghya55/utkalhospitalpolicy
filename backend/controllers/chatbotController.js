const Policy = require("../models/Policy");
const Sop = require("../models/sop");
const Department = require("../models/Department");

// ======================================================
// CHATBOT
// ======================================================

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const searchText =
      message.toLowerCase().trim();

    // ======================================================
    // 1. DIRECT POLICY TITLE SEARCH
    // ======================================================

    const allPolicies =
      await Policy.find()
        .populate("department");

    for (const policy of allPolicies) {

      const title =
        policy.title.toLowerCase();

      if (
        title.includes(searchText) ||
        searchText.includes(title)
      ) {

        return res.json({
          success: true,

          answer:
`🏥 ${policy.department?.name?.toUpperCase() || ""} DEPARTMENT POLICY

📘 ${policy.title}

${policy.description}
`,
        });
      }
    }

    // ======================================================
    // 2. DIRECT SOP TITLE SEARCH
    // ======================================================

    const allSops =
      await Sop.find()
        .populate("department");

    for (const sop of allSops) {

      const title =
        sop.title.toLowerCase();

      if (
        title.includes(searchText) ||
        searchText.includes(title)
      ) {

        return res.json({
          success: true,

          answer:
`🏥 ${sop.department?.name?.toUpperCase() || ""} DEPARTMENT SOP

📗 ${sop.title}

${sop.description}
`,
        });
      }
    }

    // ======================================================
    // REMOVE policy/sop WORD
    // ======================================================

    const cleanText =
      searchText
        .replace(/policy/gi, "")
        .replace(/policies/gi, "")
        .replace(/sop/gi, "")
        .trim();

    // ======================================================
    // LOAD DEPARTMENTS
    // ======================================================

    const departments =
      await Department.find();

    let department = null;

    // ======================================================
    // EXACT + CONTAINS MATCH
    // ======================================================

    for (const dept of departments) {

      const deptName =
        dept.name.toLowerCase();

      if (
        cleanText.includes(deptName) ||
        deptName.includes(cleanText)
      ) {

        department = dept;
        break;
      }
    }

    // ======================================================
    // TYPO SUPPORT
    // ======================================================

    if (!department) {

      for (const dept of departments) {

        const deptName =
          dept.name.toLowerCase();

        if (
          deptName.substring(0, 3) ===
          cleanText.substring(0, 3)
        ) {

          department = dept;
          break;
        }
      }
    }

    // ======================================================
    // NOT FOUND
    // ======================================================

    if (!department) {

      return res.json({
        success: true,
        answer:
          "Department not found.",
      });
    }

    // ======================================================
    // FETCH DATA
    // ======================================================

    const policies =
      await Policy.find({
        department:
          department._id,
      });

    const sops =
      await Sop.find({
        department:
          department._id,
      });

    const isPolicySearch =
      searchText.includes("policy");

    const isSopSearch =
      searchText.includes("sop");

    let responseText = "";

    // ======================================================
    // POLICY SEARCH
    // ======================================================

    if (isPolicySearch) {

      if (policies.length === 0) {

        return res.json({
          success: true,
          answer:
            "Policy not found.",
        });
      }

      responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT POLICIES

`;

      policies.forEach(
        (policy, index) => {

          responseText +=
`📘 ${index + 1}. ${policy.title}

${policy.description}

`;
        }
      );
    }

    // ======================================================
    // SOP SEARCH
    // ======================================================

    else if (isSopSearch) {

      if (sops.length === 0) {

        return res.json({
          success: true,
          answer:
            "SOP not found.",
        });
      }

      responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT SOPS

`;

      sops.forEach(
        (sop, index) => {

          responseText +=
`📗 ${index + 1}. ${sop.title}

${sop.description}

`;
        }
      );
    }

    // ======================================================
    // DEFAULT
    // ======================================================

    else {

      responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT RECORDS

`;

      // ================= POLICIES =================

      if (policies.length > 0) {

        responseText +=
`📘 POLICIES

`;

        policies.forEach(
          (policy, index) => {

            responseText +=
`${index + 1}. ${policy.title}

${policy.description}

`;
          }
        );
      }

      // ================= SOPS =================

      if (sops.length > 0) {

        responseText +=
`\n📗 SOPS

`;

        sops.forEach(
          (sop, index) => {

            responseText +=
`${index + 1}. ${sop.title}

${sop.description}

`;
          }
        );
      }

      if (
        policies.length === 0 &&
        sops.length === 0
      ) {

        responseText =
          "No records found.";
      }
    }

    return res.json({
      success: true,
      answer:
        responseText,
    });

  } catch (error) {

    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error",
    });
  }
};

// ======================================================
// SUGGESTIONS API
// ======================================================

const getSuggestions = async (req, res) => {

  try {

    const query =
      req.query.query
        ?.toLowerCase()
        .trim();

    if (!query) {

      return res.json([]);
    }

    const departments =
      await Department.find();

    const policies =
      await Policy.find();

    const sops =
      await Sop.find();

    let suggestions = [];

    // departments

    departments.forEach((dept) => {

      if (
        dept.name.toLowerCase()
          .includes(query)
      ) {

        suggestions.push(
          `${dept.name} Policy`
        );

        suggestions.push(
          `${dept.name} SOP`
        );
      }
    });

    // policies

    policies.forEach((policy) => {

      if (
        policy.title.toLowerCase()
          .includes(query)
      ) {

        suggestions.push(
          policy.title
        );
      }
    });

    // sops

    sops.forEach((sop) => {

      if (
        sop.title.toLowerCase()
          .includes(query)
      ) {

        suggestions.push(
          sop.title
        );
      }
    });

    suggestions =
      [...new Set(suggestions)];

    return res.json(
      suggestions.slice(0, 10)
    );

  } catch (error) {

    console.log(
      "SUGGESTION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Suggestion error",
    });
  }
};

module.exports = {
  chatbot,
  getSuggestions,
};