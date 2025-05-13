import Customer from "../../model/secondaryUser/customerSchema.js"
import Leavemaster from "../../model/secondaryUser/leavemasterSchema.js"

import { sendWhatapp } from "../../helper/whatapp.js"
import moment from "moment" // You can use moment.js to handle date manipulation easily
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistrationSchema.js"
import Partner from "../../model/secondaryUser/partnerSchema.js"
import Service from "../../model/primaryUser/servicesSchema.js"
import CallNote from "../../model/secondaryUser/callNotesSchema.js"
import models from "../../model/auth/authSchema.js"
import { sendEmail } from "../../helper/nodemailer.js"
const { Staff, Admin } = models
import mongoose from "mongoose"
import Holymaster from "../../model/secondaryUser/holydaymasterSchema.js"
export const GetscrollCustomer = async (req, res) => {


  try {
    const { page = 1, limit = 100, search = "", userBranch } = req.query
    // Pagination setup
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Build search query
    let searchQuery = {};
    if (search) {
      const regex = new RegExp("^" + search, "i");

      searchQuery = {
        $or: [
          { customerName: regex },
          { mobile: typeof search === "string" ? regex : undefined },
        ].filter(Boolean), // removes undefined if any
      };
    }

    const customers = await Customer.aggregate([{ $match: searchQuery },
    { $skip: skip },
    { $limit: pageSize },
    {
      $match: {
        selected: { $exists: true, $ne: [] }
      }
    },
    {
      $unwind: "$selected"
    },
    {
      $lookup: {
        from: "products",
        localField: "selected.product_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        "selected.productName": "$productDetails.productName"
      }
    },
    {
      $group: {
        _id: "$_id",
        customerName: { $first: "$customerName" },
        address1: { $first: "$address1" },
        state: { $first: "$state" },
        email: { $first: "$email" },
        mobile: { $first: "$mobile" },
        selected: { $push: "$selected" }
      }
    },
    {
      $sort: { customerName: 1 }
    }
    ]);
 
    if (customers.length === 0) {
      return res
        .status(200)
        .json({ message: "No customer found", data: [] })
    }
    return res
      .status(200)
      .json({ message: "Customer(s) found", data: customers })



  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetallCallnotes = async (req, res) => {
  try {
    const callnotes = await CallNote.find({})

    if (callnotes) {
      return res.status(200).json({
        message: "callnotes found",
        data: callnotes
      })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const GetallPartners = async (req, res) => {
  try {
    const partners = await Partner.find({})

    if (partners) {
      return res
        .status(200)
        .json({ message: "callnotes found", data: partners })
    }
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const GetallServices = async (req, res) => {
  try {
    const services = await Service.find({})
    if (services) {
      return res.status(200).json({ message: "Services found", data: services })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await CallNote.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "callnote not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const DeletePartner = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await Partner.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "partner not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const DeleteService = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Perform the deletion
    const result = await Service.findByIdAndDelete(objectId)

    if (result) {
      return res.status(200).json({ message: " deleted successfully" })
    } else {
      return res.status(404).json({ message: "partner not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const UpdateCallnotes = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedCallnotes = await CallNote.findByIdAndUpdate(
      objectId,
      formData,
      {
        new: true
      }
    )

    if (!updatedCallnotes) {
      return res.status(404).json({ message: "callnotes not found" })
    }

    res.status(200).json({ data: updatedCallnotes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const UpdatePartners = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedPartners = await Partner.findByIdAndUpdate(
      objectId,
      formData,
      {
        new: true
      }
    )

    if (!updatedPartners) {
      return res.status(404).json({ message: "partners not found" })
    }

    res.status(200).json({ data: updatedPartners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
export const UpdateServices = async (req, res) => {
  const { id } = req.query

  const objectId = new mongoose.Types.ObjectId(id)
  const formData = req.body
  if (!id) {
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(objectId, formData, {
      new: true
    })

    if (!updatedService) {
      return res.status(404).json({ message: "service not found" })
    }

    res.status(200).json({ data: updatedService })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
export const GetselectedDateCalls = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const customerCalls = await CallRegistration.aggregate([
      {
        $match: {
          callregistration: { $exists: true, $ne: [] } // Ensure callregistration exists and is not empty
        }
      },
      {
        $match: {
          "callregistration.formdata.attendedBy": { $type: "array" }
        }
      },

      {
        $addFields: {
          // Filter callregistration array to include only those with attendedBy matching the date range
          callregistration: {
            $filter: {
              input: "$callregistration", // Iterate through callregistration array
              as: "call",
              cond: {
                $gt: [
                  {
                    // Check if any attendedBy.calldate matches the date range
                    $size: {
                      $filter: {
                        input: { $ifNull: ["$$call.formdata.attendedBy", []] }, // Handle empty attendedBy array
                        as: "attendee",
                        cond: {
                          $and: [
                            { $ne: ["$$attendee.calldate", null] },
                            { $ne: ["$$attendee.calldate", ""] },
                            {
                              $and: [
                                {
                                  $gte: [
                                    { $toDate: "$$attendee.calldate" },
                                    new Date(startDate)
                                  ]
                                },
                                {
                                  $lte: [
                                    { $toDate: "$$attendee.calldate" },
                                    new Date(endDate)
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      },

      {
        $match: {
          // Ensure callregistration array still contains at least one element after filtering
          callregistration: { $ne: [] }
        }
      },

      // Lookup for product details (and directly enrich the existing product field)
      {
        $lookup: {
          from: "products",
          localField: "callregistration.product",
          foreignField: "_id",
          as: "productDetails" // We temporarily store product details here
        }
      },

      // Lookup for attendedBy details (and directly enrich the existing attendedBy field)
      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.attendedBy.callerId",
          foreignField: "_id",
          as: "attendedByDetails" // Temporary storage for attendedBy details
        }
      },

      // Lookup for completedBy details (and directly enrich the existing completedBy field)
      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.completedBy.callerId",
          foreignField: "_id",
          as: "completedByDetails" // Temporary storage for completedBy details
        }
      },
      {
        $addFields: {
          // Map callregistration to include matched product details
          callregistration: {
            $map: {
              input: "$callregistration", // Iterate over callregistration array
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration", // Preserve existing callregistration fields
                  {
                    productdetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails", // Filter joined products
                            as: "product",
                            cond: {
                              $eq: ["$$product._id", "$$registration.product"] // Match product ID
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          // Map callregistration to include attendedBy details
          callregistration: {
            $map: {
              input: "$callregistration", // Iterate over callregistration array
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration", // Preserve existing callregistration fields
                  {
                    attendeddetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$attendedByDetails", // Filter attendedBy details
                            as: "attended",
                            cond: {
                              $eq: [
                                "$$attended._id", // Match attendedBy user ID
                                {
                                  $arrayElemAt: [
                                    "$$registration.formdata.attendedBy.callerId",
                                    0
                                  ]
                                }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          // Map callregistration to include completedBy details
          callregistration: {
            $map: {
              input: "$callregistration", // Iterate over callregistration array
              as: "registration",
              in: {
                $mergeObjects: [
                  "$$registration", // Preserve existing callregistration fields
                  {
                    completedbydetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$completedByDetails", // Filter completedBy details
                            as: "completed",
                            cond: {
                              $eq: [
                                "$$completed._id", // Match completedBy user ID
                                {
                                  $arrayElemAt: [
                                    "$$registration.formdata.completedBy.callerId",
                                    0
                                  ]
                                }
                              ]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          customerName: 1, // Include necessary fields in the result

          callregistration: 1
        }
      }
    ])

    return res
      .status(200)
      .json({ message: "customercalls found", data: customerCalls })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}
export const CallnoteRegistration = async (req, res) => {
  try {
    const formdata = req.body

    const existingItem = await CallNote.findOne({
      callNotes: formdata.callNotes
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This callnotes  is already registered" })
    }

    // Create and save call notes
    const collection = new CallNote({
      callNotes: formdata.callNotes
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Call notes created successfully",
      data: collection
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const PartnerRegistration = async (req, res) => {
  try {
    const formdata = req.body

    const existingItem = await Partner.findOne({
      partner: formdata.partner
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This callnotes  is already registered" })
    }

    // Create and save call notes
    const collection = new Partner({
      partner: formdata.partner
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Partner created successfully",
      data: collection
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const ServicesRegistration = async (req, res) => {
  try {
    const formdata = req.body
    const { serviceName, price, company, branch } = formdata

    const existingItem = await Service.findOne({
      serviceName
    })
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "This service is already registered" })
    }

    // Create and save call notes
    const collection = new Service({
      serviceName,
      price,
      company,
      branch
    })

    await collection.save()

    res.status(200).json({
      status: true,
      message: "Service created successfully"
    })
  } catch (error) {
    console.log("error:", error.message)
  }
}

export const CustomerRegister = async (req, res) => {
  const { customerData, tabledata = [] } = req.body

  const {
    customerName,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
    contactPerson,
    email,
    mobile,
    landline,
    industry,
    partner
  } = customerData
  if (tabledata && tabledata?.length > 0) {
    const licenseNumbers = tabledata.map((item) => item.licensenumber)

    // Check if user already exists

    const existingLicenses = await License.find({
      licensenumber: { $in: licenseNumbers }
    })
    if (existingLicenses && existingLicenses?.length > 0) {
      return res
        .status(400)
        .json({ message: "License number already registered" })
    }
  }

  try {
    const normalizedPartner =
      customerData.partner && customerData.partner.trim() !== ""
        ? customerData.partner
        : null
    const customer = new Customer({
      customerName,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      email,
      mobile,
      landline,
      industry,
      partner: normalizedPartner,
      contactPerson,
      selected: tabledata
    })
    const customerdata = await customer.save()
    if (tabledata && tabledata.length > 0) {
      for (const item of customerdata.selected) {
        const license = new License({
          products: item.product_id,
          customerName: customerdata._id, // Using the customer ID from the parent object
          licensenumber: item.licensenumber
        })

        await license.save()
      }
    }

    return res.status(200).json({
      status: true,
      message: "Customer created successfully"
    })
  } catch (error) {
    console.log("error:", error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const CustomerEdit = async (req, res) => {
  const { customerData, tableData } = req.body

  const { customerid, index } = req.query

  // Ensure index is a number
  const parsedIndex = parseInt(index, 10)

  if (!customerid || !customerData) {
    return res
      .status(400)
      .json({ message: "Customer ID and data are required" })
  }

  try {
    const objectId = new mongoose.Types.ObjectId(customerid)

    // Find the existing customer
    const existingCustomer = await Customer.findById(objectId)
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    // Update formdata (overwrite existing fields with new ones)
    Object.assign(existingCustomer, customerData)

    // Update or add tabledata (handle array of objects)
    if (Array.isArray(tableData) && tableData.length > 0) {
      if (parsedIndex >= 0 && parsedIndex < existingCustomer.selected.length) {

        existingCustomer.selected.splice(parsedIndex, 1, tableData[0])
      } else {
        tableData.map((item) => existingCustomer.selected.push(item))
      }
    }

    // Save the updated customer document
    await existingCustomer.save()

    res.status(200).json({
      message: "Customer updated successfully"
    })
  } catch (error) {
    console.error("Error updating customer:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const DeleteCustomer = async (req, res) => {
  const { id } = req.query

  try {
    // Perform the deletion
    const result = await Customer.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: "Customer deleted successfully" })
    } else {
      return res.status(404).json({ message: "Customer not found" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const GetAllCustomer = async (req, res) => {
  try {
    const { branchSelected } = req.query
    console.log("branch", branchSelected)
    let allcustomers
    let customers



    if (!branchSelected) {
      return res.status(400).json({ message: "branch id is missing" })
      // allcustomers = await Customer.aggregate([
      //   // {
      //   //   $match: {
      //   //     "selected.productName": { $exists: true } // Customers where productName is missing in "selected"
      //   //   }
      //   // },
      //   {
      //     $project: {
      //       _id: 1, // Exclude _id
      //       customerName: 1,
      //       address1: 1,
      //       "selected.licensenumber": 1,
      //       "selected.branchName": 1,
      //       "selected.branch_id": 1,
      //       "selected.productName": 1,
      //       "selected.procuct_id": 1,
      //       mobile: 1,
      //       landline: 1,
      //       email: 1
      //     }
      //   }
      // ])
    } else {
      customers = await Customer.aggregate([
        // {
        //   $match: {
        //     "selected.productName": { $exists: true } // Customers where productName is missing in "selected"
        //   }
        // },
        {
          $project: {
            _id: 1, // Exclude _id
            customerName: 1,
            address1: 1,
            "selected.licensenumber": 1,
            "selected.branch_id": 1,
            "selected.branchName": 1,
            "selected.productName": 1,
            "selected.product_id": 1,
            mobile: 1,
            landline: 1,
            email: 1
          }
        }
      ])
    }


    // const objectIds = parsedBranch?.map(
    //   (id) => new mongoose.Types.ObjectId(id)
    // )
    const objectIds = new mongoose.Types.ObjectId(branchSelected)

    const filteredCustomers = customers.filter(
      (customer) =>

        //Include customers where `selected` is undefined or empty
        !Array.isArray(customer.selected) ||
        customer.selected.length === 0 ||
        // Or those with at least one matching branch_id
        customer.selected.some((selection) =>
          objectIds.equals(selection.branch_id))

    )

    return res
      .status(200)
      .json({ message: "customers found", data: filteredCustomers })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}


export const GetCustomer = async (req, res) => {
  const search = req.query?.search
  const role = req.query?.role
  const userBranch = req.query?.userBranch

  const pendingCustomerList = req.query?.pendingCustomerList
  let objectIds
  let parsedBranch

  if (userBranch) {
    parsedBranch = JSON.parse(decodeURIComponent(userBranch))
  }

  if (
    search &&
    Array.isArray(parsedBranch) &&
    parsedBranch.length > 0 &&
    role !== "Admin"
  ) {
    const branches = JSON.parse(decodeURIComponent(userBranch))
    objectIds = branches?.map((id) => new mongoose.Types.ObjectId(id))
  } else {
    objectIds = parsedBranch?.map((id) => new mongoose.Types.ObjectId(id))
  }

  try {
    if (
      search &&
      Array.isArray(parsedBranch) &&
      parsedBranch.length > 0 &&
      role !== "Admin"
    ) {
      if (!isNaN(search)) {
        const searchRegex = new RegExp(`^${search}`, "i")

        const mobileCustomer = await Customer.find({
          mobile: searchRegex
        }).lean()

        const licenseCustomer = await Customer.find({
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$selected",
                    as: "item",
                    cond: {
                      $regexMatch: {
                        input: { $toString: "$$item.licensenumber" }, // Convert to string
                        regex: search, // your regex pattern
                        options: "i" // case-insensitive if needed
                      }
                    }
                  }
                }
              },
              0
            ]
          }
        }).lean()
        const customers = [...mobileCustomer, ...licenseCustomer]

        if (!customers || customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        } else {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        }
      } else {
        // Search by customer name

        const searchRegex = new RegExp(`^${search}`, "i")
        const customers = await Customer.aggregate([
          {
            $match: {
              customerName: searchRegex, // Match the customer name using the regex search
              "selected.branch_id": { $in: objectIds } // Match branch_id within the selected array
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              },
              partnerObjectId: {
                $toObjectId: "$partner"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $lookup: {
              from: "partners", // Name of the Product collection
              localField: "partnerObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "partnerDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              partner: { $arrayElemAt: ["$partnerDetails", 0] },
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              partner: { $first: "$partner" },
              industry: { $first: "$industry" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])

        if (customers.length > 0) {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        } else {
          return res
            .status(200)
            .json({ message: "No customer found", data: [] })
        }
      }
    } else if (search && role === "Admin") {
      if (!isNaN(search)) {
        const searchRegex = new RegExp(`^${search}`, "i")

        // const mobileCustomer = await Customer.find({
        //   mobile: searchRegex
        // }).lean()

        // const licenseCustomer = await Customer.find({
        //   $expr: {
        //     $gt: [
        //       {
        //         $size: {
        //           $filter: {
        //             input: "$selected",
        //             as: "item",
        //             cond: {
        //               $regexMatch: {
        //                 input: { $toString: "$$item.licensenumber" }, // Convert to string
        //                 regex: search, // your regex pattern
        //                 options: "i" // case-insensitive if needed
        //               }
        //             }
        //           }
        //         }
        //       },
        //       0
        //     ]
        //   }
        // }).lean()
        const mobileCustomer = await Customer.aggregate([
          {
            $match: {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$mobile" },
                  regex: search,
                  options: "i"
                }
              }
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              industry: { $first: "$industry" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])
        const licenseCustomer = await Customer.aggregate([
          {
            $match: {
              $expr: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$selected",
                        as: "item",
                        cond: {
                          $regexMatch: {
                            input: { $toString: "$$item.licensenumber" },
                            regex: search,
                            options: "i"
                          }
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              industry: { $first: "$industry" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])
        const customers = [...mobileCustomer, ...licenseCustomer]

        if (!customers || customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        } else {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        }
      } else {
        // Search by customer name

        const searchRegex = new RegExp(`^${search}`, "i")
        const customers = await Customer.aggregate([
          {
            $match: {
              customerName: searchRegex // Match the customer name using the regex search
            }
          },
          {
            $unwind: {
              path: "$selected", // Unwind the selected array to access individual items
              preserveNullAndEmptyArrays: true // Keep empty arrays if any
            }
          },
          {
            $addFields: {
              "selected.branchObjectId": { $toObjectId: "$selected.branch_id" },
              "selected.companyObjectId": {
                $toObjectId: "$selected.company_id"
              },
              "selected.productObjectId": {
                $toObjectId: "$selected.product_id"
              }
            }
          },

          {
            $lookup: {
              from: "branches", // Name of the Branch collection
              localField: "selected.branchObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Branch collection
              as: "branchDetails" // Alias for the resulting joined branch documents
            }
          },
          {
            $lookup: {
              from: "companies", // Name of the Company collection
              localField: "selected.companyObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Company collection
              as: "companyDetails" // Alias for the resulting joined company documents
            }
          },
          {
            $lookup: {
              from: "products", // Name of the Product collection
              localField: "selected.productObjectId", // Field from the customer document
              foreignField: "_id", // Match the _id field from the Product collection
              as: "productDetails" // Alias for the resulting joined product documents
            }
          },
          {
            $addFields: {
              "selected.product_id": { $arrayElemAt: ["$productDetails", 0] },
              "selected.branch_id": { $arrayElemAt: ["$branchDetails", 0] },
              "selected.company_id": { $arrayElemAt: ["$companyDetails", 0] } // Replace product_id with populated product data
            }
          },

          {
            $group: {
              _id: "$_id", // Group by the customer's _id
              customerName: { $first: "$customerName" }, // Keep customer name
              address1: { $first: "$address1" },
              state: { $first: "$state" },
              pincode: { $first: "$pincode" },
              email: { $first: "$email" },
              mobile: { $first: "$mobile" },
              industry: { $first: "$industry" },
              selected: { $push: "$selected" } // Push the selected data
            }
          }
        ])

        if (customers.length > 0) {
          return res
            .status(200)
            .json({ message: "Customer(s) found", data: customers })
        } else {
          return res
            .status(200)
            .json({ message: "No customer found", data: [] })
        }
      }
    } else {
      try {
        let customers
        if (role === "Admin" || pendingCustomerList) {
          // Admin: Fetch all customers
          customers = await Customer.find().sort({ customerName: 1 }).exec()
        } else {
          if (pendingCustomerList) {
            customers = await Customer.find().sort({ customerName: 1 }).exec()
          } else if (!parsedBranch || parsedBranch.length === 0) {
            return res
              .status(403)
              .json({ message: "No branches assigned to staff" })
          }

          // const branchIds = user.selected.map((branch) => branch.branch_id)

          customers = await Customer.find({
            "selected.branch_id": { $in: objectIds }
          })
            .sort({ customerName: 1 })
            .exec()
        }
        if (customers.length === 0) {
          return res
            .status(404)
            .json({ message: "No customer found", data: [] })
        }

        return res
          .status(200)
          .json({ message: "Customer(s) found", data: customers })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
      }
    }
  } catch (error) {
    console.error("Error fetching customer data:", error.message)
    res
      .status(500)
      .json({ message: "An error occurred while fetching customer data." })
  }
}
export const GetLicense = async (req, res) => {
  try {
    const licensenumber = await License.find()

    if (licensenumber.length > 0) {
      res
        .status(200)
        .json({ message: "license number found", data: licensenumber })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
}

export const customerCallRegistration = async (req, res) => {
  try {
    const { customerid, customer, branchName = {}, username } = req.query // Get customerid from query

    const calldata = req.body // Assuming calldata is sent in the body
    const emailsend = calldata.formdata.emailSend

    // Convert attendedBy.callerId to ObjectId
    const addTimes = (time1, time2) => {
      const parseTime = (time) => {
        const [hours, minutes, seconds] = time.split(":").map(Number)
        return { hours, minutes, seconds }
      }

      const formatTime = ({ hours, minutes, seconds }) => {
        // Handle overflow
        minutes += Math.floor(seconds / 60)
        seconds = seconds % 60

        hours += Math.floor(minutes / 60)
        minutes = minutes % 60

        return [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
        ].join(":")
      }

      const t1 = parseTime(time1)
      const t2 = parseTime(time2)

      const totalTime = {
        hours: t1.hours + t2.hours,
        minutes: t1.minutes + t2.minutes,
        seconds: t1.seconds + t2.seconds
      }

      return formatTime(totalTime)
    }
    if (
      calldata.formdata &&
      calldata.formdata.attendedBy &&
      calldata.formdata.attendedBy.callerId
    ) {
      calldata.formdata.attendedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.attendedBy.callerId
      )
    }
    if (
      calldata.formdata &&
      calldata.formdata.completedBy &&
      calldata.formdata.completedBy.callerId
    ) {
      calldata.formdata.completedBy.callerId = new mongoose.Types.ObjectId(
        calldata.formdata.completedBy.callerId
      )
    }

    // Convert customerid to ObjectId
    const customerId = new mongoose.Types.ObjectId(customerid)

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid ObjectId format")
    }

    // Find if there is already a call registration for this customer
    const user = await CallRegistration.findOne({ customerid: customerId })

    if (user) {
      const token = calldata.formdata.token
      if (token) {
        const callToUpdate = user.callregistration.find(
          (call) => call.timedata.token === token
        )

        // Function to convert "HH:MM:SS" format to total seconds

        if (callToUpdate) {
          if (!callToUpdate.timedata.time) {
            callToUpdate.timedata.time = 0 // Initialize time to 0 if it doesn't exist
          }
          // Update the fields with the new data

          callToUpdate.timedata.startTime = callToUpdate.timedata.startTime
          callToUpdate.timedata.endTime = calldata.timedata.endTime
          // Convert the total duration back to "HH:MM:SS" format
          callToUpdate.timedata.duration += calldata.timedata.duration

          callToUpdate.timedata.time = addTimes(
            callToUpdate.timedata.time,
            calldata.timedata.time
          )

          callToUpdate.timedata.token = calldata.timedata.token
          callToUpdate.formdata.incomingNumber =
            calldata.formdata.incomingNumber
          callToUpdate.formdata.token = calldata.formdata.token
          callToUpdate.formdata.description = calldata.formdata.description
          callToUpdate.formdata.callnote = calldata.formdata.callnote

          callToUpdate.formdata.solution = calldata.formdata.solution
          callToUpdate.formdata.status = calldata.formdata.status
          callToUpdate.formdata.attendedBy.push(calldata.formdata.attendedBy)
          if (calldata.formdata.status === "solved") {
            callToUpdate.formdata.completedBy.push(
              calldata.formdata.completedBy
            )
          }
          callToUpdate.formdata.completedBy = calldata.formdata.completedBy
          callToUpdate.license = calldata.license
          callToUpdate.branchName = calldata.branchName

          // Save the updated document

          const updatedCall = await user.save()

          if (updatedCall) {
            const Id = calldata.formdata.attendedBy.callerId

            const staffCaller = await Staff.findOne({
              _id: Id
            })
            if (staffCaller) {
              if (calldata.formdata.status === "pending") {
                staffCaller.callstatus.totalCall += 1

                staffCaller.callstatus.pendingCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingSavedStaff = await staffCaller.save()

                if (pendingSavedStaff) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username,
                    emailsend
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                const mapAndCheckAttendedBy = (data, selectedId) => {
                  //  Count how many times callerId matches selectedId
                  const matchCount = data.formdata.attendedBy.filter(
                    (attendee) => attendee.callerId.equals(selectedId)
                  ).length

                  // Return true if matchCount >= 2, otherwise false
                  return matchCount >= 2
                }

                // Example operation
                const findMatchingDocAndCheckCallerId = (
                  updatedCall,
                  token,
                  selectedId
                ) => {
                  // Find the matching doc
                  const matchingDoc = updatedCall.callregistration.find(
                    (call) => call.timedata.token === token
                  )

                  // If a matching doc is found, call the mapAndCheckAttendedBy function
                  if (matchingDoc) {
                    const isCallerIdMatched = mapAndCheckAttendedBy(
                      matchingDoc,
                      selectedId
                    )
                    return { matchingDoc, isCallerIdMatched }
                  }

                  // Return false if no matching doc is found
                  return false
                }
                //
                const { matchingDoc, isCallerIdMatched } =
                  findMatchingDocAndCheckCallerId(
                    updatedCall,
                    token,
                    calldata?.formdata?.attendedBy?.callerId
                  )

                staffCaller.callstatus.totalCall = isCallerIdMatched
                  ? staffCaller.callstatus.totalCall
                  : staffCaller.callstatus.totalCall + 1

                staffCaller.callstatus.solvedCalls += 1

                staffCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await staffCaller.save()
                if (saved) {
                  // const stringDoc = JSON.stringify(matchingDoc, null, 2)
                  // const parsedDoc = JSON.parse(stringDoc)

                  const processedAttendedBy = matchingDoc.formdata.attendedBy
                    .slice(0, -1)
                    .map((item) => item)

                  try {
                    const results = await updateProcessedAttendees(
                      processedAttendedBy,
                      Id
                    )

                    // Check if there are any items with a status other than "success"
                    const hasErrors = results.some(
                      (result) => result.status !== "success"
                    )

                    if (hasErrors) {
                      return res.status(207).json({
                        // 207 for multi-status response
                        message: "Update process completed with some errors",
                        results
                      })
                    } else {
                      const emailResponse = await sendEmail(
                        calldata,
                        customer,
                        branchName,
                        username,
                        emailsend
                      )
                      if (emailResponse) {
                        return res.status(200).json({
                          success: true,
                          message: "Call registered"
                        })
                      } else {
                        return res
                          .status(200)
                          .json({ message: "Call registered email not send" })
                      }
                    }
                  } catch (error) {
                    console.error("Error in updateAttendeesController:", error)
                    return res.status(500).json({
                      message: "An error occurred during the update process",
                      error: error.message
                    })
                  }
                }
              }
            } else {
              const adminCaller = await Admin.findOne({
                _id: Id
              })
              if (adminCaller) {
                if (calldata.formdata.status === "pending") {
                  adminCaller.callstatus.totalCall += 1

                  adminCaller.callstatus.pendingCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const pendingAdminSaved = await adminCaller.save()
                  if (pendingAdminSaved) {
                    const emailResponse = await sendEmail(
                      calldata,
                      customer,
                      branchName,
                      username,
                      emailsend
                    )

                    if (emailResponse) {
                      return res.status(200).json({
                        success: true,
                        message: "Call registered"
                      })
                    } else {
                      return res
                        .status(200)
                        .json({ message: "Call registered email not send" })
                    }
                  }
                } else if (calldata.formdata.status === "solved") {
                  const mapAndCheckAttendedBy = (data, selectedId) => {
                    // Count how many times callerId matches selectedId
                    const matchCount = data.formdata.attendedBy.filter(
                      (attendee) => attendee.callerId.equals(selectedId)
                    ).length
                    // Return true if matchCount >= 2, otherwise false
                    return matchCount >= 2
                  }

                  // Example operation
                  const findMatchingDocAndCheckCallerId = (
                    updatedCall,
                    token,
                    selectedId
                  ) => {
                    // Find the matching doc
                    const matchingDoc = updatedCall.callregistration.find(
                      (call) => call?.timedata?.token === token
                    )

                    // If a matching doc is found, call the mapAndCheckAttendedBy function
                    if (matchingDoc) {
                      const isCallerIdMatched = mapAndCheckAttendedBy(
                        matchingDoc,
                        selectedId
                      )
                      return { matchingDoc, isCallerIdMatched }
                    }

                    // Return false if no matching doc is found
                    return false
                  }
                  //
                  const { matchingDoc, isCallerIdMatched } =
                    findMatchingDocAndCheckCallerId(
                      updatedCall,
                      token,
                      calldata?.formdata?.attendedBy?.callerId
                    )
                  //

                  adminCaller.callstatus.totalCall = isCallerIdMatched
                    ? adminCaller.callstatus.totalCall
                    : adminCaller.callstatus.totalCall + 1

                  adminCaller.callstatus.solvedCalls += 1

                  adminCaller.callstatus.totalDuration +=
                    calldata.timedata.duration

                  const saved = await adminCaller.save()
                  if (saved) {
                    const processedAttendedBy = matchingDoc.formdata.attendedBy
                      .slice(0, -1)
                      .map((item) => item)

                    try {
                      const results = await updateProcessedAttendees(
                        processedAttendedBy,
                        Id
                      )

                      // Check if there are any items with a status other than "success"
                      const hasErrors = results.some(
                        (result) => result.status !== "success"
                      )

                      if (hasErrors) {
                        return res.status(207).json({
                          // 207 for multi-status response
                          message: "Update process completed with some errors",
                          results
                        })
                      } else {
                        const emailResponse = await sendEmail(
                          calldata,
                          customer,
                          branchName,
                          username,
                          emailsend
                        )
                        if (emailResponse) {
                          return res.status(200).json({
                            success: true,
                            message: "Call registered"
                          })
                        } else {
                          return res
                            .status(200)
                            .json({ message: "Call registered email not send" })
                        }
                      }
                    } catch (error) {
                      console.error(
                        "Error in updateAttendeesController:",
                        error
                      )
                      return res.status(500).json({
                        message: "An error occurred during the update process",
                        error: error.message
                      })
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        user.callregistration.push(calldata)
        const updatedCall = await user.save()
        const Id = calldata.formdata.attendedBy.callerId

        if (updatedCall) {
          const staffCaller = await Staff.findOne({
            _id: Id
          })

          if (staffCaller) {
            if (calldata.formdata.status === "pending") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.pendingCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingSavedStaff = await staffCaller.save()
              if (pendingSavedStaff) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              staffCaller.callstatus.totalCall += 1

              staffCaller.callstatus.solvedCalls += 1

              staffCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await staffCaller.save()
              if (saved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          } else {
            const adminCaller = await Admin.findOne({
              _id: Id
            })
            if (adminCaller) {
              if (calldata.formdata.status === "pending") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.pendingCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const pendingAdminSaved = await adminCaller.save()
                if (pendingAdminSaved) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    emailsend
                  )
                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              } else if (calldata.formdata.status === "solved") {
                adminCaller.callstatus.totalCall += 1

                adminCaller.callstatus.solvedCalls += 1

                adminCaller.callstatus.totalDuration +=
                  calldata.timedata.duration

                const saved = await adminCaller.save()
                if (saved) {
                  const emailResponse = await sendEmail(
                    calldata,
                    customer,
                    branchName,
                    username,
                    emailsend
                  )

                  if (emailResponse) {
                    return res.status(200).json({
                      success: true,
                      message: "Call registered"
                    })
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Call registered email not send" })
                  }
                }
              }
            }
          }
        }
      }
    } else {
      //If no document is found, create a new one with the given call data

      const newCall = new CallRegistration({
        customerid: customerId,
        customerName: customer,
        callregistration: [calldata] // Wrap calldata in an array
      })

      // Save the new document
      const updatedCall = await newCall.save()
      if (updatedCall) {
        const Id = calldata.formdata.attendedBy.callerId

        const staffCaller = await Staff.findOne({
          _id: Id
        })

        if (staffCaller) {
          if (calldata.formdata.status === "pending") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.pendingCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const pendingSavedStaff = await staffCaller.save()

            if (pendingSavedStaff) {
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username,
                emailsend
              )

              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          } else if (calldata.formdata.status === "solved") {
            staffCaller.callstatus.totalCall += 1

            staffCaller.callstatus.solvedCalls += 1

            staffCaller.callstatus.totalDuration += calldata.timedata.duration

            const saved = await staffCaller.save()
            if (saved) {
              const emailResponse = await sendEmail(
                calldata,
                customer,
                branchName,
                username,
                emailsend
              )
              if (emailResponse) {
                return res.status(200).json({
                  success: true,
                  message: "Call registered"
                })
              } else {
                return res
                  .status(200)
                  .json({ message: "Call registered email not send" })
              }
            }
          }
        } else {
          const adminCaller = await Admin.findOne({
            _id: Id
          })
          if (adminCaller) {
            if (calldata.formdata.status === "pending") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.pendingCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const pendingAdminSaved = await adminCaller.save()
              if (pendingAdminSaved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            } else if (calldata.formdata.status === "solved") {
              adminCaller.callstatus.totalCall += 1

              adminCaller.callstatus.solvedCalls += 1

              adminCaller.callstatus.totalDuration += calldata.timedata.duration

              const saved = await adminCaller.save()
              if (saved) {
                const emailResponse = await sendEmail(
                  calldata,
                  customer,
                  branchName,
                  username,
                  emailsend
                )
                if (emailResponse) {
                  return res.status(200).json({
                    success: true,
                    message: "Call registered"
                  })
                } else {
                  return res
                    .status(200)
                    .json({ message: "Call registered email not send" })
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving or updating call registration:", error.message)
    return res.status(500).json({
      status: false,
      message: "Error saving or updating call registration"
    })
  }
}
const updateProcessedAttendees = async (processedAttendedBy, attendedId) => {
  const updateResults = []

  // Helper function to update call status
  const updateCallStatus = async (user, callerId) => {
    user.callstatus.pendingCalls -= 1
    user.callstatus.colleagueSolved = callerId.equals(attendedId)
      ? user.callstatus.colleagueSolved
      : user.callstatus.colleagueSolved + 1

    // Save the updated document
    await user.save()
  }

  for (const item of processedAttendedBy) {
    const { callerId } = item

    try {
      // Try finding staff with the given callerId
      let user = await Staff.findOne({ _id: callerId })

      // If not found in Staff, search in Admin
      if (!user) {
        user = await Admin.findOne({ _id: callerId })
      }

      // If either staff or admin is found, update their call status
      if (user) {
        const a = await updateCallStatus(user, callerId)

        // Record success status for this item
        updateResults.push({ callerId, status: "success" })
      } else {
        // Record not found status if neither staff nor admin is found
        updateResults.push({ callerId, status: "not found" })
      }
    } catch (error) {
      console.error(`Error updating call status for ${callerId}:`, error)
      // Record error status for this item
      updateResults.push({ callerId, status: "error", error: error.message })
    }
  }

  // Return the final status after all updates
  return updateResults
}

export const loggeduserCallsCurrentDateCalls = async (req, res) => {
  try {
    const { loggedUserId } = req.query
    const loggeduserObjectId = new mongoose.Types.ObjectId(loggedUserId)
    const today = new Date()

    const startOfDayStr = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDayStr = new Date(today.setHours(23, 59, 59, 999)).toISOString()
    // Build the initial match condition that always includes the user ID

    const pipeline = [
      // Match customers who have calls attended by the logged user today
      {
        $match: {
          callregistration: {
            $elemMatch: {
              "formdata.attendedBy": {
                $elemMatch: {
                  callerId: loggeduserObjectId,
                  calldate: { $gte: startOfDayStr, $lte: endOfDayStr }
                }
              }
            }
          }
        }
      },
      // Unwind the callregistration array to process each call
      {
        $unwind: {
          path: "$callregistration",
          preserveNullAndEmptyArrays: false
        }
      },
      // Filter to keep only calls that were attended by the logged user today
      {
        $match: {
          "callregistration.formdata.attendedBy": {
            $elemMatch: {
              callerId: loggeduserObjectId,
              calldate: { $gte: startOfDayStr, $lte: endOfDayStr }
            }
          }
        }
      },
      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "callregistration.product",
          foreignField: "_id",
          as: "callregistration.productDetails"
        }
      },
      {
        $addFields: {
          "callregistration.productDetails": {
            $map: {
              input: "$callregistration.productDetails",
              as: "product",
              in: { productName: "$$product.productName" }
            }
          }
        }
      },
      // Lookup completedBy staff details
      {
        $lookup: {
          from: "staffs",
          localField: "callregistration.formdata.completedBy.callerId",
          foreignField: "_id",
          as: "completedByDetails"
        }
      },
      {
        $addFields: {
          "callregistration.formdata.completedBy.name": {
            $arrayElemAt: ["$completedByDetails.name", 0]
          }
        }
      },
      // Lookup attendedBy staff details
      {
        $lookup: {
          from: "staffs",
          let: { attendedByArray: "$callregistration.formdata.attendedBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$attendedByArray.callerId"]
                }
              }
            },
            { $project: { _id: 1, name: 1 } }
          ],
          as: "attendedByStaff"
        }
      },
      // Add staff names to attendedBy entries
      {
        $addFields: {
          "callregistration.formdata.attendedBy": {
            $map: {
              input: "$callregistration.formdata.attendedBy",
              as: "attended",
              in: {
                $mergeObjects: [
                  "$$attended",
                  {
                    name: {
                      $let: {
                        vars: {
                          staff: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$attendedByStaff",
                                  as: "staff",
                                  cond: {
                                    $eq: ["$$staff._id", "$$attended.callerId"]
                                  }
                                }
                              },
                              0
                            ]
                          }
                        },
                        in: "$$staff.name"
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      // Group by customer ID to consolidate calls
      {
        $group: {
          _id: "$_id",
          customerid: { $first: "$customerid" },
          customerName: { $first: "$customerName" },
          callregistration: { $push: "$callregistration" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      }
    ]

    const currentDateloggedusercalls = await CallRegistration.aggregate(
      pipeline
    )

    return res
      .status(200)
      .json({ message: "found", data: currentDateloggedusercalls })
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const GetCallRegister = async (req, res) => {
  try {
    const { customerid } = req.query

    const { callId } = req.params

    if (customerid !== "null" && customerid) {
      const customerId = new mongoose.Types.ObjectId(customerid)
      const registeredCall = await CallRegistration.findOne({
        customerid: customerId
      }).populate({ path: "callregistration.product", select: "productName" })

      const attendedByIds = new Set()
      const completedByIds = new Set()
      registeredCall.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property
      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      registeredCall.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
      if (registeredCall) {
        return res
          .status(200)
          .json({ message: "registered call found", data: registeredCall })
      } else {
        return res.status(404).json({ message: "No registered Calls" })
      }
    } else if (callId) {
      const callDetails = await CallRegistration.findById(callId)
        .populate("customerid")
        .populate({
          path: "callregistration.product", // Populate the product field inside callregistration array
          model: "Product"
        })
        .populate({ path: "callregistration.formdata.callnote" })

      const attendedByIds = new Set()
      const completedByIds = new Set()
      callDetails.callregistration.map((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })

      // Separate IDs and names from the Sets
      const attendedByIdsArray = Array.from(attendedByIds)
      const attendedByObjectIds = attendedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const attendedByNames = attendedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      const completedByIdsArray = Array.from(completedByIds)
      const completedByObjectIds = completedByIdsArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )

      const completedByNames = completedByIdsArray
        .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
        .map((name) => ({ name })) // Transform them into objects with a "name" property

      // Query for ObjectIds (staff/admin users)
      const [
        attendedByStaff,
        attendedByAdmin,
        completedByStaff,
        completedByAdmin
      ] = await Promise.all([
        // Search attendedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search attendedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: attendedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Staff
        mongoose
          .model("Staff")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean(),

        // Search completedBy IDs in Admin
        mongoose
          .model("Admin")
          .find({ _id: { $in: completedByObjectIds } })
          .select("name _id ")
          .lean()
      ])

      // Combine results for attendedBy and completedBy
      const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
      const completedByUsers = [...completedByStaff, ...completedByAdmin]

      // Optionally handle name-based entries as well
      const attendedByCombined = [...attendedByUsers, ...attendedByNames]

      const completedByCombined = [...completedByUsers, ...completedByNames]
      const userMap = new Map(
        [...attendedByCombined, ...completedByCombined].map((user) => [
          user._id ? user._id.toString() : user.name,
          user.name
        ])
      )

      callDetails.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
      if (!callDetails) {
        return res.status(404).json({ message: "Calls not found" })
      } else {
        return res
          .status(200)
          .json({ message: "calls with respect customer found", callDetails })
      }

      // Send the call details as a response
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "internal server error" })
  }
}

export const GetAllExpiryRegister = async (req, res) => {
  const { nextmonthReport } = req.query

  try {
    let startOfNextMonth
    let endOfNextMonth
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (nextmonthReport) {
      // Calculate the start and end of the next month
      startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)
      endOfNextMonth.setHours(23, 59, 59, 999) // End of the day
    }

    const expiredCustomers = await Customer.find({
      selected: {
        $elemMatch: {
          $or: [
            {
              licenseExpiryDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            }, // License expiry in the past
            {
              tvuexpiryDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            }, // TVU expiry in the past
            {
              amcendDate: nextmonthReport
                ? { $gte: startOfNextMonth, $lte: endOfNextMonth }
                : { $lt: today }
            } // AMC end in the past
          ]
        }
      }
    })

    if (expiredCustomers.length > 0) {
      return res.status(200).json({
        message: "Customers found with expiry",
        data: expiredCustomers
      })
    } else {
      return res
        .status(404)
        .json({ message: "No customers with expired Dates", data: [] })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const getallExpiredCustomerCalls = async (req, res) => {
  try {
    const { expiredCustomerId } = req.body

    const validCustomerIds = expiredCustomerId
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id))

    const calls = await CallRegistration.find({
      customerid: { $in: validCustomerIds } // Assuming 'customerId' field in CallRegistration matches customer IDs
    })
      .populate([
        {
          path: "callregistration.product",
          select: "productName"
        },
        {
          path: "customerid",
          select: "customerName"
        }
      ])
      .lean()

    const attendedByIds = new Set()
    const completedByIds = new Set()

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle `attendedBy`
        const attendedBy = entry.formdata.attendedBy
        if (Array.isArray(attendedBy)) {
          // If it's an array, iterate over it
          attendedBy.forEach((attendee) => {
            if (attendee.callerId) {
              attendedByIds.add(attendee.callerId.toString())
            } else if (attendee.name) {
              attendedByIds.add(attendee.name)
            }
          })
        } else if (typeof attendedBy === "string") {
          // If it's a string, add it directly
          attendedByIds.add(attendedBy)
        }

        // Handle `completedBy`
        const completedBy = entry.formdata.completedBy
        if (Array.isArray(completedBy) && completedBy.length > 0) {
          const completedByEntry = completedBy[0]
          if (completedByEntry.callerId) {
            completedByIds.add(completedByEntry.callerId.toString())
          } else if (completedByEntry.name) {
            completedByIds.add(completedByEntry.name)
            // Optionally, handle cases where only the name exists
            console.warn(
              `CompletedBy has name but no callerId: ${completedByEntry.name}`
            )
          }
        } else if (typeof completedBy === "string") {
          // If it's a string, add it directly
          completedByIds.add(completedBy)
        }
      })
    )

    // Separate IDs and names from the Sets
    const attendedByIdsArray = Array.from(attendedByIds)
    const attendedByObjectIds = attendedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const attendedByNames = attendedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    const completedByIdsArray = Array.from(completedByIds)
    const completedByObjectIds = completedByIdsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    )

    const completedByNames = completedByIdsArray
      .filter((id) => !mongoose.Types.ObjectId.isValid(id)) // Filter invalid ObjectIds (names)
      .map((name) => ({ name })) // Transform them into objects with a "name" property

    // Query for ObjectIds (staff/admin users)
    const [
      attendedByStaff,
      attendedByAdmin,
      completedByStaff,
      completedByAdmin
    ] = await Promise.all([
      // Search attendedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search attendedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: attendedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Staff
      mongoose
        .model("Staff")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean(),

      // Search completedBy IDs in Admin
      mongoose
        .model("Admin")
        .find({ _id: { $in: completedByObjectIds } })
        .select("name _id ")
        .lean()
    ])

    // Combine results for attendedBy and completedBy
    const attendedByUsers = [...attendedByStaff, ...attendedByAdmin]
    const completedByUsers = [...completedByStaff, ...completedByAdmin]

    // Optionally handle name-based entries as well
    const attendedByCombined = [...attendedByUsers, ...attendedByNames]

    const completedByCombined = [...completedByUsers, ...completedByNames]
    const userMap = new Map(
      [...attendedByCombined, ...completedByCombined].map((user) => [
        user._id ? user._id.toString() : user.name,
        user.name
      ])
    )

    calls.forEach((call) =>
      call.callregistration.forEach((entry) => {
        // Handle attendedBy field
        if (Array.isArray(entry?.formdata?.attendedBy)) {
          entry.formdata.attendedBy = entry.formdata.attendedBy
            .flat() // Flatten the array
            .map((attendee) => {
              const name = userMap.get(attendee?.callerId?.toString())
              // If name is found, attach it to the callerId
              return name ? { ...attendee, callerId: { name } } : attendee // Keep original if no name found
            })
        } else if (typeof entry?.formdata?.attendedBy === "string") {
          // If attendedBy is a string (not an array), map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.attendedBy)
          entry.formdata.attendedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.attendedBy } // Keep the original if no name found
        }

        // Handle completedBy field
        if (
          Array.isArray(entry?.formdata?.completedBy) &&
          entry?.formdata?.completedBy.length > 0
        ) {
          // If completedBy is an array, map over each entry (assuming one entry)
          const completedUser = userMap.get(
            entry?.formdata?.completedBy[0]?.callerId?.toString()
          )
          entry.formdata.completedBy = completedUser
            ? [{ ...entry?.formdata?.completedBy[0], name: completedUser }] // Add the name to the first item
            : entry.formdata.completedBy // Keep as is if no name found
        } else if (typeof entry?.formdata?.completedBy === "string") {
          // If completedBy is a string, map it to the name if it exists in userMap
          const name = userMap.get(entry?.formdata?.completedBy)
          entry.formdata.completedBy = name
            ? { callerId: { name } } // Map the string to an object with a name
            : { callerId: entry?.formdata?.completedBy } // Keep the original if no name found
        }
      })
    )
    if (calls.length > 0) {
      return res
        .status(200)
        .json({ message: "Expired customer calls found", calls })
    } else {
      return res.status(404).json({ message: "No expired calls", calls: [] })
    }
  } catch (error) {
    console.log("error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const LeavemasterRegister = async (req, res) => {
  try {
    // Extract data from request body
    const {
      checkIn,
      checkOut,
      checkInEndAt,
      checkOutStartAt,
      lateArrival,
      privilegeleave,
      casualleave,
      sickleave,
      earlyOut,
      holyDate,
      customTextInput,

      deductSalaryMinute
    } = req.body

    const { editstate } = req.query
    const existingRecord = await Leavemaster.findOne({})
    if (existingRecord) {
      const isSame =
        existingRecord.checkIn === checkIn &&
        existingRecord.checkOut === checkOut &&
        existingRecord.checkInEndAt === checkInEndAt &&
        existingRecord.checkOutStartAt === checkOutStartAt &&
        existingRecord.lateArrival === lateArrival &&
        existingRecord.privilegeleave === privilegeleave &&
        existingRecord.casualleave === casualleave &&
        existingRecord.sickleave === sickleave &&
        existingRecord.deductSalaryMinute === deductSalaryMinute
      // Step 3: If everything is the same, don't create a new instance, just return
      if (isSame) {
        if (editstate === "true") {
          const b = await Holymaster.updateOne(
            { customTextInput }, // Find the existing record using its ID
            {
              $set: {
                holyDate,
                customTextInput
              }
            }
          )

          if (b.modifiedCount > 0) {
            return res
              .status(200)
              .json({ message: "Holiday update succesfully" })
          }
        } else {
          if (holyDate && customTextInput) {
            const year = new Date(holyDate).getFullYear()

            const a = await Holymaster.find({
              $and: [
                {
                  $expr: {
                    $eq: [{ $year: "$holyDate" }, year]
                  }
                },
                {
                  customTextInput
                }
              ]
            })

            // const a = await Holymaster.find({ holyDate })
            if (a && a.length > 0) {
              return res.status(401).json({
                message: `${customTextInput} is already registered with this Year`
              })
            } else {
              const newHoly = await Holymaster({
                holyDate,
                customTextInput,
                newField: true
              })
              await newHoly.save()
              if (newHoly) {
                return res.status(200).json({
                  message: ` ${customTextInput} is succesfully registered`
                })
              }
            }
          }
        }
      } else {
        // Step 4: If the data is different, update the existing record
        const q = await Leavemaster.updateOne(
          { _id: existingRecord._id }, // Find the existing record using its ID
          {
            $set: {
              checkIn,
              checkOut,
              checkInEndAt,
              checkOutStartAt,
              lateArrival,
              privilegeleave,
              casualleave,
              sickleave,
              earlyOut,
              deductSalaryMinute
            }
          },
          { new: true }
        )
        if (q.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Leave master updated succesfully", data: q })
        }
      }
    } else {
      // Create a new document
      const newTime = new Leavemaster({
        checkIn,
        checkOut,
        checkInEndAt,
        checkOutStartAt,
        lateArrival: Number(lateArrival),
        earlyOut: Number(earlyOut),

        deductSalaryMinute: Number(deductSalaryMinute)
      })

      // Save to database
      await newTime.save()
      if (holyDate && customTextInput) {
        const newHoly = await Holymaster({
          holyDate,
          customTextInput,
          newField: true
        })
        await newHoly.save()
        if (newHoly && newTime) {
          res.status(200).json({ message: "saved successfully!" })
        }
      }
      return res.status(200).json({ message: "successfully registered" })
    }
  } catch (error) {
    console.error("Error saving time data:", error)
    res.status(500).json({ error: "Failed to save time data." })
  }
}
export const GetallHoly = async (req, res) => {
  try {
    const a = await Holymaster.find({})
    if (a) {
      return res.status(200).json({ message: "holy found", data: a })
    }
  } catch (error) {
    console.log("error", error.message)
  }
}
export const GetallcurrentMonthHoly = async (req, res) => {
  try {
    const { currentmonth } = req.query
    const [year, month] = currentmonth.split("-").map(Number)
    const holidays = await Holymaster.find({
      holyDate: {
        $gte: new Date(year, month - 1, 1), // Start of the month
        $lt: new Date(year, month, 1) // Start of next month (excludes next month)
      }
    })

    return res.status(200).json({ message: "holyfound", data: holidays })
  } catch (error) {
    console.log("error:", error.message)
  }
}
export const Getleavemaster = async (req, res) => {
  try {
    const a = await Leavemaster.find({})
    if (a) {
      return res.status(200).json({ message: "Leave master found", data: a })
    }
  } catch (error) {
    console.log("error", error.message)
  }
}
