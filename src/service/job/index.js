const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const JobSchema = require("../../models/job");
const { logger } = require("../../utils");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { getClientDetails } = require("../profile");
const ObjectId = mongoose.Types.ObjectId;

// ==== create job post ==== service
const createJobPost = async (req, userData, taskFile, res) => {
  return new Promise(async () => {
    req.body["client_id"] = userData._id;
    req.body["file"] = taskFile;
    if (userData.role == 2) {
      const jobSchema = new JobSchema(req.body);
      await jobSchema
        .save()
        .then(async (result) => {
          logger.info("job created successfully");
          return responseData.success(res, result, "job created successfully");
        })
        .catch((err) => {
          logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
          return responseData.fail(
            res,
            `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
            500
          );
        });
    } else {
      logger.error("Only client can create new job");
      return responseData.fail(res, "Only client can create new job", 401);
    }
  });
};

const closeJob = async (req, userData, res) => {
  return new Promise(async () => {
    if (userData.role !== 2) {
      logger.error("Only client can close the job");
      return responseData.fail(res, "Only client can close the job", 401);
    } else {
      await JobSchema.updateOne(
        {
          client_id: userData._id,
          _id: new ObjectId(req.body.job_id),
        },
        { $set: { status: "closed" } },
        { new: true }
      )
        .then((result) => {
          if (result?.modifiedCount !== 0) {
            logger.info("Job closed successfully");
            return responseData.success(res, result, "Job closed successfully");
          } else if (result?.matchedCount !== 0) {
            logger.info("Job already closed");
            return responseData.success(res, result, "Job already closed");
          } else {
            logger.error("Job Not Found");
            return responseData.success(res, result, "Job Not Found");
          }
        })
        .catch((err) => {
          logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
          return responseData.fail(
            res,
            `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
            500
          );
        });
    }
  });
};

// ==== get all job post ==== service
const getAllJobPost = async () => {
  try {
    const jobSchema = await JobSchema.find({
      status: { $ne: "closed" },
    }).populate({
      path: "client_id",
      select: "country firstName lastName",
    });

    return jobSchema;
  } catch (error) {
    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
    return error;
  }
};

// ===== search jobs ===========
 
// const searchJobPost = async (req, userData, res) => {
//   return new Promise(async () => {
//     try {
//       let { category, searchTerm, experience, job_type, rate_min, rate_max } =
//         req?.query;
//       let query = {};

//       if (searchTerm) {
//         query.$or = [
//           { tags: { $in: [new RegExp(searchTerm, "i")] } },
//           { skills: { $in: [new RegExp(searchTerm, "i")] } },
//           { experience: new RegExp(searchTerm, "i") },
//           { job_type: new RegExp(searchTerm, "i") },
//           { title: new RegExp(searchTerm, "i") },
//           { description: new RegExp(searchTerm, "i") },
//         ];
//       }

//       if (category) {
//         category = category.split(",");
//         query["categories._id"] = { $in: category };
//       }

//       if (experience) {
//         query.experience = { $in: experience.split(",") };
//       }

//       if (job_type) {
//         query.job_type = { $in: job_type.split(",") };
//       }

//       if (rate_min && rate_max) {
//         query.amount = { $gte: Number(rate_min), $lte: Number(rate_max) };
//       }

//       try {
//         let result;

//         if (category && category.length > 0) {
//           query["categories._id"] = { $in: category };
//         }

//         result = await JobSchema.find(query);

//         if (result.length === 0) {
//           // Return a response indicating no jobs were found
//           return responseData.success(
//             res,
//             [],
//             "No jobs found for the selected options"
//           );
//         }

//         logger.info("Jobs search successfully");
//         return responseData.success(res, result, "Jobs search successfully");
//       } catch (err) {
//         logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//         return responseData.fail(
//           res,
//           `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
//           500
//         );
//       }
//     } catch (error) {
//       console.error("Error searching for jobs:", error);
//       return responseData.fail(res, "Error searching for jobs", 500);
//     }
//   });
// };

const searchJobPost = async (req, res) => {
  return new Promise(async () => {
    try {
      let { category, searchTerm, experience, job_type, hourly_rate_min, hourly_rate_max, fixed_rate_min, fixed_rate_max, contractType } = req?.query;
      let query = {};

      if (searchTerm) {
        query.$or = [
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
          { skills: { $in: [new RegExp(searchTerm, "i")] } },
          { experience: new RegExp(searchTerm, "i") },
          { job_type: new RegExp(searchTerm, "i") },
          { title: new RegExp(searchTerm, "i") },
          { description: new RegExp(searchTerm, "i") },
        ];
      }

      if (category) {
        category = category.split(",");
        query["categories._id"] = { $in: category };
      }

      if (experience) {
        query.experience = { $in: experience.split(",") };
      }

      if (job_type) {
        query.job_type = { $in: job_type.split(",") };
      }

      // Handle hourly rate filter
      if (hourly_rate_min && hourly_rate_max) {
        const minHourlyRate = Number(hourly_rate_min);
        const maxHourlyRate = Number(hourly_rate_max);

        if (!isNaN(minHourlyRate) && !isNaN(maxHourlyRate)) {
          query.amount= { $gte: minHourlyRate, $lte: maxHourlyRate };
        } else {
          return responseData.fail(res, "Invalid input for hourly rate", 400);
        }
      }

      // Handle fixed rate filter
      if (fixed_rate_min && fixed_rate_max) {
        const minFixedRate = Number(fixed_rate_min);
        const maxFixedRate = Number(fixed_rate_max);

        if (!isNaN(minFixedRate) && !isNaN(maxFixedRate)) {
          query.amount = { $gte: minFixedRate, $lte: maxFixedRate };
        } else {
          return responseData.fail(res, "Invalid input for fixed rate", 400);
        }
      }

      try {
        let result;

        if (category && category.length > 0) {
          query["categories._id"] = { $in: category };
        }

        // If no new filters are provided, return previous data
        if (!searchTerm && !category && !experience && !job_type && !hourly_rate_min && !hourly_rate_max && !fixed_rate_min && !fixed_rate_max) {
          // Retrieve and return previous data
          const previousData = await JobSchema.find(/* add your criteria for previous data retrieval */);
          return responseData.success(res, previousData, "Previous data retrieved successfully");
        }

        // Apply filters and retrieve new data
        result = await JobSchema.find(query);

        if (result.length === 0) {
          // If no new data is found, return previous data
          const previousData = await JobSchema.find(/* add your criteria for previous data retrieval */);
          return responseData.success(res, previousData, "No new jobs found; showing previous data");
        }

        logger.info("Jobs search successfully");
        return responseData.success(res, result, "Jobs search successfully");
      } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return responseData.fail(
          res,
          `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
          500
        );
      }
    } catch (error) {
      console.error("Error searching for jobs:", error);
      return responseData.fail(res, "Error searching for jobs", 500);
    }
  });
};

 
 
 
// ==== get single job post ==== service
const getSingleJobPost = async (req, res) => {
  return new Promise(async () => {
    const query = [
      {
        $match: {
          _id: new ObjectId(req.query.job_id),
        },
      },
      {
        $lookup: {
          from: "client_profiles",
          localField: "client_id",
          foreignField: "user_id",
          as: "client_details",
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "client_id",
          foreignField: "client_id",
          as: "client_history",
        },
      },
    ];
    await JobSchema.aggregate(query)
      .then(async (result) => {
        if (result) {
          result[0].client_details[0] = await getClientDetails(
            result[0]?.client_details[0],
            result[0]?.client_details[0]?.user_id
          );
          logger.info(messageConstants.JOB_FETCHED_SUCCESSFULLY);
          return responseData.success(
            res,
            result,
            messageConstants.JOB_FETCHED_SUCCESSFULLY
          );
        } else {
          logger.error(`Job not found`);
          return responseData.fail(res, `Job not found`, 200);
        }
      })
      .catch((err) => {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return responseData.fail(
          res,
          `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
          500
        );
      });
  });
};

// ==== get job post by user id ==== service
const getJobPostByUserId = async (req, userData, res) => {
  return new Promise(async () => {
    const query = [
      {
        $match: { client_id: userData._id },
      },
      {
        $lookup: {
          from: "job_proposals",
          let: { jobId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: "$jobId" }, "$$jobId"] },
              },
            },
          ],
          as: "proposal_details",
        },
      },
    ];
    await JobSchema.aggregate(query)
      .then(async (result) => {
        return responseData.success(
          res,
          result,
          `job fetched succesfully with proposals`
        );
      })
      .catch((err) => {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return responseData.fail(
          res,
          `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
          500
        );
      });
  });
};

// ==== update job post ==== service
const updateJobPost = async (req, userData, fileUrl, res) => {
  return new Promise(async () => {
    const job_id = new ObjectId(req.query.job_id);
    await JobSchema.findOne({
      _id: job_id,
      client_id: userData._id,
    })
      .then(async (result) => {
        if (result) {
          req.body["file"] = fileUrl || result.file;
          await JobSchema.findOneAndUpdate(
            {
              _id: job_id,
              client_id: userData._id,
            },
            req.body,
            { new: true, upsert: true }
          )
            .then((result) => {
              if (result) {
                logger.info("Job updated successfully");
                return responseData.success(
                  res,
                  result,
                  "job updated successfully"
                );
              } else {
                logger.error("Job not updated");
                return responseData.fail(res, "Job not updated", 401);
              }
            })
            .catch((err) => {
              logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
              return responseData.fail(
                res,
                `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`,
                500
              );
            });
        } else {
          logger.error("Job not found");
          return responseData.fail(res, "Job not found", 200);
        }
      })
      .catch((err) => {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
        return responseData.fail(
          res,
          `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`,
          500
        );
      });
  });
};

// ==== delete job post ==== service
const deleteJobPost = async (req, userData, res) => {
  return new Promise(async () => {
    if (userData?.role == 2) {
      await JobSchema.deleteOne({
        _id: new ObjectId(req.query.job_id),
        client_id: userData._id,
      })
        .then(async (result) => {
          if (result?.deletedCount !== 0) {
            logger.info("Job Deleted successfully");
            return responseData.success(
              res,
              result,
              "Job Deleted successfully"
            );
          } else {
            logger.error("Job Not Found");
            return responseData.fail(res, "Job Not Found", 200);
          }
        })
        .catch((err) => {
          console.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
          return responseData.fail(
            res,
            `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
            500
          );
        });
    } else {
      logger.error("Only Client can delete the job");
      return responseData.fail(res, "Only Client can delete the job", 500);
    }
  });
};

module.exports = {
  createJobPost,
  getAllJobPost,
  getJobPostByUserId,
  updateJobPost,
  deleteJobPost,
  searchJobPost,
  getSingleJobPost,
  closeJob,
};
