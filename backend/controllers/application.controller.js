import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: userId,
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication =
      await Application.create({
        job: jobId,
        applicant: userId,
      });

    // applications array must exist in Job model
    job.applications.push(newApplication._id);

    await job.save();

    return res.status(201).json({
      message: "Job applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getApplyJobs = async (
  req,
  res
) => {
  try {
    const userId = req.id;

    const applications =
      await Application.find({
        applicant: userId,
      })
        .populate({
          path: "job",
          populate: {
            path: "company",
          },
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getApplicants = async (
  req,
  res
) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "applicant",
        },
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Applicants found",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application =
      await Application.findById(
        applicationId
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status =
      status.toLowerCase();

    await application.save();

    return res.status(200).json({
      message:
        "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};