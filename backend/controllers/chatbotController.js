const Policy = require("../models/Policy");
const Sop = require("../models/sop");
const Department = require("../models/Department");

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
      message.toLowerCase();

    // ================= FIND DEPARTMENT =================

    const department =
      await Department.findOne({
        name: {
          $regex: searchText,
          $options: "i",
        },
      });

    if (!department) {

      return res.json({
        success: true,
        answer:
          "Department not found.",
      });
    }

    // ================= CHECK TYPE =================

    const isPolicySearch =
      searchText.includes("policy");

    const isSopSearch =
      searchText.includes("sop");

    let responseText = "";

    // ================= POLICY SEARCH =================

    if (isPolicySearch) {

      const policies =
        await Policy.find({
          department:
            department._id,
        });

      if (
        policies.length === 0
      ) {

        return res.json({
          success: true,
          answer:
            "Policy not found.",
        });
      }

      responseText =
        `🏥 ${department.name} Department Policies\n\n`;

      policies.forEach(
        (policy, index) => {

          responseText +=
`
${index + 1}. ${policy.title}

${policy.description}

`;
        }
      );
    }

    // ================= SOP SEARCH =================

    else if (isSopSearch) {

      const sops =
        await Sop.find({
          department:
            department._id,
        });

      if (
        sops.length === 0
      ) {

        return res.json({
          success: true,
          answer:
            "SOP not found.",
        });
      }

      responseText =
        `🏥 ${department.name} Department SOPs\n\n`;

      sops.forEach(
        (sop, index) => {

          responseText +=
`
${index + 1}. ${sop.title}

${sop.description}

`;
        }
      );
    }

    // ================= DEFAULT =================

    else {

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

      responseText =
        `🏥 ${department.name} Department Records\n\n`;

      // POLICIES

      if (
        policies.length > 0
      ) {

        responseText +=
          `📘 POLICIES\n\n`;

        policies.forEach(
          (policy, index) => {

            responseText +=
`
${index + 1}. ${policy.title}

${policy.description}

`;
          }
        );
      }

      // SOPS

      if (
        sops.length > 0
      ) {

        responseText +=
`\n📗 SOPS\n\n`;

        sops.forEach(
          (sop, index) => {

            responseText +=
`
${index + 1}. ${sop.title}

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

module.exports = {
  chatbot,
};