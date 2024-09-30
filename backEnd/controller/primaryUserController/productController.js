import Product from "../../model/primaryUser/productSchema.js"
import mongoose from "mongoose"
export const ProductRegistration = async (req, res) => {
  const { productData, tableData } = req.body
  console.log("productData:", productData)
  console.log("table Data:", tableData)

  // Check if user already exists

  const productExists = await Product.findOne({
    productName: productData.productName
  })

  if (productExists) {
    return res
      .status(400)
      .json({ message: "Product with this name already exists in the branch" })
  }

  try {
    // Create and save new user
    const products = new Product({
      selected: tableData,
      productName: productData.productName,
      productPrice: productData.productPrice,

      description: productData.description
    })
    await products.save()
    res.status(200).json({
      status: true,
      message: "Products created successfully"
    })
  } catch (error) {
    res.status(500).json({ message: "server error" })
  }
}

export const EditProduct = async (req, res) => {
  const { productData, editData } = req.body

  const productId = req.query.productid

  try {
    const objectId = new mongoose.Types.ObjectId(productId)

    const existingProduct = await Product.findById(objectId)

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Step 2: Update the existing product with new values
    existingProduct.selected = editData // Use the updated tableData
    existingProduct.productName =
      productData.productName || existingProduct.productName
    existingProduct.productPrice =
      productData.productPrice || existingProduct.productPrice

    existingProduct.description =
      productData.description || existingProduct.description

    // Step 3: Save the changes to the database
    await existingProduct.save()
    res.status(200).json({ message: "Product edit successfully" })
  } catch (error) {
    console.log("Error:", error.message)
    res.status(500).json({
      message: "Error on editing"
    })
  }
}

export const GetallProducts = async (req, res) => {
  try {
    const products = await Product.find()

    if (!products && products.length < 0) {
      res.status(404).json({ messsge: "products not found" })
    }
    res.status(200).json({ message: "productsfound", data: products })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}

export const GetProducts = async (req, res) => {
  try {
    const {
      productid,
      companyid,
      branchid,
      brandid,
      categoryid,
      hsnid,
      brandName,
      categoryName,
      hsnName
    } = req.query

    // Step 1: Find the product by productId
    if (productid) {
      const product = await Product.findById(productid)

      if (product) {
        const selected = product.selected || []

        // Get thce `selected` field from the product

        // Initialize query object based on provided parameters
        const query = {}
        if (companyid) query.company_id = companyid
        if (branchid) query.branch_id = branchid
        if (brandid) query.brand_id = brandid
        if (categoryid) query.category_id = categoryid
        if (hsnid) query.hsn_id = hsnid
        if (brandName) query.brand_name = brandName
        if (categoryName) query.category_name = categoryName
        if (hsnName) query.hsn_name = hsnName

        // Check if the selected field contains a match for the given criteria
        const matchingItems = selected.filter((item) => {
          return Object.keys(query).every((key) => item[key] === query[key])
        })

        if (matchingItems.length > 0) {
          const response = {
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            description: product.description,

            selected: matchingItems.length > 0 ? matchingItems : [] // Include only matching items or an empty array
          }

          // Return the entire product data including matching items in the `selected` field
          res.status(200).json({ data: [response] })
        } else {
          // Return the entire product data with an empty `selected` field if no matches
          res.status(200).json({
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            description: product.description,
            GSTIN: product.GSTIN,
            selected: [] // Empty array if no matches
          })
        }
      } else {
        res.status(404).json({ message: "Product not found" })
      }
    } else {
      res.status(400).json({ message: "Product ID is required" })
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ message: "Server error fetching product" })
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
    const newHsn = new Hsn({ owner, hsnSac, description, onValue, onItem })
    const HsnData = await newHsn.save()
    console.log("now created:", HsnData)
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
    const hsnData = await Hsn.find({ owner: req.owner.userId }).populate(
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
  const ownerId = req.owner?.userId

  try {
    // Check if another user already has this description
    const nameAlreadyExists = await HsnModel.findOne({
      hsnSac,
      owner: { $ne: ownerId }
    })

    if (nameAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Hsn already exists"
      })
    } else {
      // Update the user type
      const updateHsn = await HsnModel.updateOne(
        { _id, owner: ownerId },
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
    console.log(id)
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
