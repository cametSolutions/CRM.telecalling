import {
  Brand,
  Category,
  Hsn
} from "../../model/primaryUser/productSubDetailsSchema.js"

export const ProductSubdetailsRegistration = async (req, res) => {
  const formData = req.body
  const tab = Object.keys(formData)[0]
  const value = formData[tab]

  let data
  switch (tab) {
    case "brand":
      data = {
        model: Brand,
        field: "brand"
      }
      break
    case "category":
      data = {
        model: Category,
        field: "category"
      }
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }

  // Check if item already exists
  const existingItem = await data.model.findOne({ [data.field]: value })
  if (existingItem) {
    return res.status(400).json({ message: `${tab} is already registered` })
  }

  try {
    // Create and save new item
    const collection = new data.model({
      [data.field]: value
    })
    await collection.save()

    res.status(200).json({
      status: true,
      message: `${tab} created successfully`,
      data: collection
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}
// export const GetproductsubDetails = async (req, res) => {
//   const { tab, page = 1, limit = 10 } = req.query

//   let model
//   switch (tab) {
//     case "brand":
//       model = Brand
//       break
//     case "category":
//       model = Category
//       break
//     default:
//       return res.status(400).json({ message: "Invalid tab provided" })
//   }

//   try {
//     const skip = (page - 1) * limit // Calculate how many items to skip
//     const items = await model.find().skip(skip).limit(parseInt(limit)) // Fetch the items

//     if (!items || items.length === 0) {
//       return res.status(404).json({
//         message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s not found`,
//       })
//     }

//     const totalItems = await model.countDocuments() // Get total number of documents
//     const totalPages = Math.ceil(totalItems / limit) // Calculate total number of pages

//     res.status(200).json({
//       message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s found`,
//       data: items,
//       totalItems, // Total number of items
//       totalPages, // Total number of pages
//       currentPage: parseInt(page), // Current page number
//     })
//   } catch (error) {
//     console.error(error.message)
//     res.status(500).json({ message: "Server error", error })
//   }
// }

export const GetproductsubDetails = async (req, res) => {
  const { tab, page = 1, limit = 10 } = req.query // Assuming the tab (either 'brand' or 'category') is passed as a query parameter

  let model
  switch (tab) {
    case "brand":
      model = Brand
      break
    case "category":
      model = Category
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }

  try {
    const skip = (page - 1) * limit // Calculate how many items to skip
    const items = await model.find().skip(skip).limit(parseInt(limit)) // Fetch the items

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s not found`
      })
    }

    const totalItems = await model.countDocuments() // Get total number of documents
    const totalPages = Math.ceil(totalItems / limit) // Calculate total number of pages

    res.status(200).json({
      message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s found`,
      data: items,
      totalItems, // Total number of items
      totalPages, // Total number of pages
      currentPage: parseInt(page) // Current page number
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error", error })
  }
}

export const UpdateProductDetails = async (req, res) => {
  const { id, tab } = req.query

  const updateData = req.body
  let model
  switch (tab) {
    case "brand":
      model = Brand
      break
    case "category":
      model = Category
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }

  try {
    const updatedProductSubDetails = await model.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!updatedProductSubDetails) {
      return res.status(404).json({ message: "Product sub-details not found" })
    }

    res.status(200).json({ data: updatedProductSubDetails })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const DeleteproductDetails = async (req, res) => {
  const { id, tab } = req.query
  let model
  switch (tab) {
    case "brand":
      model = Brand
      break
    case "category":
      model = Category
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }
  try {
    // Perform the deletion
    const result = await model.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: `${tab} deleted successfully` })
    } else {
      return res.status(404).json({ message: `${tab} not found` })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
//function used to create hsn
export const CreateHsn = async (req, res) => {
  const { hsnSac, description, onValue, onItem } = req.body.hsnData

  const owner = req.owner.userId
  try {
    const hsnAlreadyExists = await Hsn.findOne({ hsnSac, owner })
    if (hsnAlreadyExists) {
      return res.status(400).json({ message: "Hsn already exists" })
    }
    const newHsn = new Hsn({ hsnSac, description, onValue, onItem })
    const HsnData = await newHsn.save()
    return res
      .status(201)
      .json({ success: false, message: "Hsn created successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error creating hsn", error })
  }
}
//function used to get hsn
export const GetHsnDetails = async (req, res) => {
  try {
    const hsnData = await Hsn.find({}).populate(
      "owner"
    )
    res
      .status(200)
      .json({ message: "Branches fetched successfully", data: hsnData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// function used to update hsn
export const UpdateHsn = async (req, res) => {
  const { _id, hsnSac, description, onValue, onItem } = req.body.hsnData

  try {
    // Check if another user already has this description
    const nameAlreadyExists = await Hsn.findOne({
      _id: { $ne: _id },
      hsnSac,

    })
    if (nameAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Hsn already exists"
      })
    } else {
      // Update the user type
      const updateHsn = await Hsn.updateOne(
        { _id },
        {
          hsnSac: hsnSac,
          description: description,
          onValue: onValue,
          onItem: onItem
        }
      )
      if (!updateHsn) {
        return res.status(404).json({
          success: false,
          message: "Hsn update failed"
        })
      }

      return res.status(200).json({
        success: true,
        message: "Hsn updated successfully"
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Error updating Hsn",
      error: error.message
    })
  }
}

//function used to delete HSN

export const DeleteHsn = async (req, res) => {
  try {
    const { id } = req.query
    const deletedHsn = await Hsn.findByIdAndDelete({ _id: id })
    if (!deletedHsn) {
      return res
        .status(404)
        .json({ success: false, message: "Hsn is not found" })
    }
    return res
      .status(200)
      .json({ success: true, message: "Hsn deleted successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error deleting Hsn",
      error: error.message
    })
  }
}
export const GetBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    if (brands.length > 0) {
      res.status(200).json({ message: "Brands found", data: brands })
    }
  } catch (error) {
    console.log("Error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
