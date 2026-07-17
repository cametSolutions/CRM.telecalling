import BugReport from "../../model/developer/BugReportSchema.js"

/**
 * POST /api/bugreports
 * Staff submits a new bug report.
 * Expects: { title, description, severity, pageUrl }
 * `req.user` is assumed to be set by your auth middleware
 * (adjust the field names below to match your actual auth payload).
 */
const resolveModelName = (role) => (role === "Admin" ? "Admin" : "Staff")
export const createBugReport = async (req, res) => {
  const { title, description, severity, reportedBy } = req.body

  if (!title?.trim() || !description?.trim()) {
    return res
      .status(400)
      .json({ message: "Title and description are required" })
  }

  try {
    const report = await BugReport.create({
      title: title.trim(),
      description: description.trim(),
      severity: severity || "medium",
      reportedBy: reportedBy?._id || "",
      reportedByModel: resolveModelName(reportedBy.role)
    })

    return res.status(201).json({
      message: "Bug report submitted",
      data: report
    })
  } catch (error) {
    console.error("Error creating bug report:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * GET /api/bugreports?status=open&severity=high
 * Admin view — list reports, optionally filtered.
 */
export const getBugReports = async (req, res) => {
  const { status, severity } = req.query

  try {
    const filter = {}
    if (status && status !== "all") filter.status = status
    if (severity && severity !== "all") filter.severity = severity

    const reports = await BugReport.find(filter).sort({ createdAt: -1 })

    return res.status(200).json({ data: reports })
  } catch (error) {
    console.error("Error fetching bug reports:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * PATCH /api/bugreports/:id
 * Admin updates status / adds a note.
 * Expects: { status, adminNote }
 */
export const updateBugReport = async (req, res) => {
  const { id } = req.params
  const { status, adminNote } = req.body

  try {
    const report = await BugReport.findById(id)
    if (!report) {
      return res.status(404).json({ message: "Bug report not found" })
    }

    if (status) {
      report.status = status
      if (status === "resolved" || status === "closed") {
        report.resolvedAt = new Date()
        report.resolvedBy = {
          userId: req.user?._id || null,
          name: req.user?.name || "Unknown"
        }
      }
    }

    if (adminNote !== undefined) {
      report.adminNote = adminNote
    }

    await report.save()

    return res.status(200).json({
      message: "Bug report updated",
      data: report
    })
  } catch (error) {
    console.error("Error updating bug report:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}


