const Policy = require("../models/Policy");
const Sop = require("../models/sop");

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        answer: "Message required",
      });
    }

    const search =
      message.toLowerCase();

    // GET DATA
    const policies =
      await Policy.find({})
      .populate("department", "name");

    const sops =
      await Sop.find({})
      .populate("department", "name");

    let results = [];

    // ================= POLICY SEARCH =================

    if (search.includes("policy")) {

      results = policies.filter((doc) => {

        const department =
          doc.department?.name
            ?.toLowerCase() || "";

        const title =
          doc.title?.toLowerCase() || "";

        return (
          search.includes(department) ||
          title.includes(search.replace("policy", "").trim())
        );
      });
    }

    // ================= SOP SEARCH =================

    else if (search.includes("sop")) {

      results = sops.filter((doc) => {

        const department =
          doc.department?.name
            ?.toLowerCase() || "";

        const title =
          doc.title?.toLowerCase() || "";

        return (
          search.includes(department) ||
          title.includes(search.replace("sop", "").trim())
        );
      });
    }

    // ================= NORMAL SEARCH =================

    else {

      const allDocs = [
        ...policies,
        ...sops,
      ];

      results = allDocs.filter((doc) => {

        const title =
          doc.title?.toLowerCase() || "";

        const description =
          doc.description?.toLowerCase() || "";

        const department =
          doc.department?.name
            ?.toLowerCase() || "";

        return (
          title.includes(search) ||
          description.includes(search) ||
          department.includes(search)
        );
      });
    }

    // ================= NO RESULT =================

    if (results.length === 0) {

      return res.json({
        success: true,
        answer:
          "No matching SOP or Policy found.",
      });
    }

    // ================= FORMAT RESPONSE =================

    const formatted =
      results.map((doc, index) => `

${index + 1}. ${doc.title}

Department:
${doc.department?.name || "N/A"}

Description:
${doc.description}

Status:
${doc.status}

`).join("\n");

    return res.json({
      success: true,
      answer: formatted,
    });

  } catch (error) {

    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      answer: "Server error",
    });
  }
};

module.exports = {
  chatbot,
};