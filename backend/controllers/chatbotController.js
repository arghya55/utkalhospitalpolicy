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

    // ======================================================
    // SEARCH TEXT
    // ======================================================

    const searchText =
      message.toLowerCase().trim();

    const words =
      searchText.split(" ");

    const isPolicySearch =
      searchText.includes("policy");

    const isSopSearch =
      searchText.includes("sop");

    const cleanText =
      searchText
        .replace(/policy/gi, "")
        .replace(/policies/gi, "")
        .replace(/sop/gi, "")
        .trim();

    // ======================================================
    // LOAD ALL DATA
    // ======================================================

    const departments =
      await Department.find();

    const allPolicies =
      await Policy.find()
        .populate("department");

    const allSops =
      await Sop.find()
        .populate("department");


        // ======================================================
// EXACT POLICY TITLE SEARCH
// ======================================================

const exactPolicy =
  allPolicies.find((policy) => {

    const title =
      policy.title
        .toLowerCase()
        .trim();

    return (
      title === searchText
    );
  });

if (exactPolicy) {

  return res.json({
    success: true,

    answer:
`🏥 ${exactPolicy.department?.name?.toUpperCase()} DEPARTMENT POLICY

📘 ${exactPolicy.title}

${exactPolicy.description}
`,
  });
}

// ======================================================
// EXACT SOP TITLE SEARCH
// ======================================================

const exactSop =
  allSops.find((sop) => {

    const title =
      sop.title
        .toLowerCase()
        .trim();

    return (
      title === searchText
    );
  });

if (exactSop) {

  return res.json({
    success: true,

    answer:
`🏥 ${exactSop.department?.name?.toUpperCase()} DEPARTMENT SOP

📗 ${exactSop.title}

${exactSop.description}
`,
  });
}

    // ======================================================
    // FIND DEPARTMENT
    // ======================================================

    let department = null;

    for (const dept of departments) {

      const deptName =
        dept.name.toLowerCase();

      const deptWords =
        deptName.split(" ");

      const matched =
        deptWords.some((word) =>
          cleanText.includes(word)
        );

      if (matched) {

        department = dept;

        break;
      }
    }

    // ======================================================
    // POLICY TITLE SEARCH
    // ======================================================

    if (isPolicySearch) {

      let matchedPolicies =
        allPolicies.filter((policy) => {

          const title =
            policy.title.toLowerCase();

          const desc =
            policy.description.toLowerCase();

          const text =
            title + " " + desc;

          const departmentMatch =
            department
              ? String(
                  policy.department?._id
                ) ===
                String(
                  department._id
                )
              : true;

          const keywordMatch =
            words.some((word) =>
              text.includes(word)
            );

          return (
            departmentMatch &&
            keywordMatch
          );
        });

      if (
        matchedPolicies.length === 0
      ) {

        return res.json({
          success: true,
          answer:
            "No matching policy found.",
        });
      }

      let responseText = "";

      if (department) {

        responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT POLICIES

`;
      }

      matchedPolicies.forEach(
        (policy, index) => {

          responseText +=
`📘 ${index + 1}. ${policy.title}

${policy.description}

`;
        }
      );

      return res.json({
        success: true,
        answer:
          responseText,
      });
    }

    // ======================================================
    // SOP TITLE SEARCH
    // ======================================================

    if (isSopSearch) {

      let matchedSops =
        allSops.filter((sop) => {

          const title =
            sop.title.toLowerCase();

          const desc =
            sop.description.toLowerCase();

          const text =
            title + " " + desc;

          const departmentMatch =
            department
              ? String(
                  sop.department?._id
                ) ===
                String(
                  department._id
                )
              : true;

          const keywordMatch =
            words.some((word) =>
              text.includes(word)
            );

          return (
            departmentMatch &&
            keywordMatch
          );
        });

      if (
        matchedSops.length === 0
      ) {

        return res.json({
          success: true,
          answer:
            "No matching SOP found.",
        });
      }

      let responseText = "";

      if (department) {

        responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT SOPS

`;
      }

      matchedSops.forEach(
        (sop, index) => {

          responseText +=
`📗 ${index + 1}. ${sop.title}

${sop.description}

`;
        }
      );

      return res.json({
        success: true,
        answer:
          responseText,
      });
    }

    // ======================================================
    // NORMAL SEARCH
    // ======================================================

    let matchedPolicies =
      allPolicies.filter((policy) => {

        const text =
          (
            policy.title +
            " " +
            policy.description
          ).toLowerCase();

        const departmentMatch =
          department
            ? String(
                policy.department?._id
              ) ===
              String(
                department._id
              )
            : true;

        const keywordMatch =
          words.some((word) =>
            text.includes(word)
          );

        return (
          departmentMatch &&
          keywordMatch
        );
      });

    let matchedSops =
      allSops.filter((sop) => {

        const text =
          (
            sop.title +
            " " +
            sop.description
          ).toLowerCase();

        const departmentMatch =
          department
            ? String(
                sop.department?._id
              ) ===
              String(
                department._id
              )
            : true;

        const keywordMatch =
          words.some((word) =>
            text.includes(word)
          );

        return (
          departmentMatch &&
          keywordMatch
        );
      });

    if (
      matchedPolicies.length === 0 &&
      matchedSops.length === 0
    ) {

      return res.json({
        success: true,
        answer:
          "No matching records found.",
      });
    }

    let responseText = "";

    if (department) {

      responseText =
`🏥 ${department.name.toUpperCase()} DEPARTMENT RECORDS

`;
    }

    // ======================================================
    // POLICIES
    // ======================================================

    if (
      matchedPolicies.length > 0
    ) {

      responseText +=
`📘 POLICIES

`;

      matchedPolicies.forEach(
        (policy, index) => {

          responseText +=
`${index + 1}. ${policy.title}

${policy.description}

`;
        }
      );
    }

    // ======================================================
    // SOPS
    // ======================================================

    if (
      matchedSops.length > 0
    ) {

      responseText +=
`\n📗 SOPS

`;

      matchedSops.forEach(
        (sop, index) => {

          responseText +=
`${index + 1}. ${sop.title}

${sop.description}

`;
        }
      );
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