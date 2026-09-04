import { useEffect, useState } from "react"

function HsnOnItem({ handleOnItem, data }) {
  const [tableData, setTableData] = useState([])
  const [tableObject, setTableObject] = useState({
    greaterThan: 0,
    upto: 0,
    taxabilityType: "",
    igstRate: 0,
    cgstRate: 0,
    sgstUgstRate: 0,
    basedOnValue: 0,
    basedOnQuantity: 0,
  })

  //storing initial data in state at edit time
  useEffect(() => {
    if (data) {
      setTableData(data)
    }
  }, [data])

  // function used to handle data change
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setTableObject((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name == "igstRate" && tableObject.taxabilityType == taxable) {
      setTableObject((prev) => ({
        ...prev,
        cgstRate: value / 2,
        sgstUgstRate: value / 2,
      }))
    }
  }

  // function used to handle add button
  const handleAdd = () => {
    const updatedTableData = [...tableData, tableObject]
    setTableData(updatedTableData)
    setTableObject({
      greaterThan: tableObject.upto,
      upto: 0,
      taxabilityType: "taxable",
      igstRate: 0,
      cgstRate: 0,
      sgstUgstRate: 0,
      basedOnValue: 0,
      basedOnQuantity: 0,
    })
    // callback function used to send data to parent
    handleOnItem(updatedTableData)
  }

  // function used to handle delete
  const handleDelete = () => {
    const updatedData = tableData.filter(
      (item, index) => index !== tableData.length - 1
    )
    setTableData(updatedData)
    // callback function used to send data to parent
    handleOnItem(updatedData)
  }

  return (
    <>
      <div className="overflow-scroll">
        <table className="w-full border-collapse border-x-2 border-y-2">
          <thead className=" border  bg-[#80CAEE]">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                GREATER THAN
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Upto</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Taxability Type
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                IGST Rate
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                CGST Rate
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                SGST/UTGST Rate
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Based On Value
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Based On Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="i border-b">
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="text"
                  value={tableObject?.greaterThan}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="greaterThan"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="text"
                  value={tableObject?.upto}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="upto"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <select
                  name="taxabilityType"
                  id=""
                  className="w-full bg-gray appearance-none border-none focus:outline-none"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Select</option>
                  <option value="exempt">Exempt</option>
                  <option value="nilRated">Nil Rated</option>
                  <option value="nonGst">Non GST</option>
                  <option value="taxable">Taxable</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="number"
                  value={tableObject?.igstRate}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="igstRate"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="number"
                  value={tableObject?.cgstRate}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="cgstRate"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="number"
                  value={tableObject?.sgstUgstRate}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="sgstUgstRate"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="number"
                  value={tableObject?.basedOnValue}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="basedOnValue"
                  onChange={(e) => handleChange(e)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  className="bg-gray appearance-none border-none focus:outline-none"
                  type="number"
                  value={tableObject?.basedOnQuantity}
                  readOnly={tableObject?.taxabilityType !== "taxable"}
                  name="basedOnQuantity"
                  onChange={(e) => handleChange(e)}
                />
              </td>
            </tr>
            {tableData.map((data, index) => (
              <tr className="i border-b">
                <td className="px-4 py-2">{data?.greaterThan}</td>
                <td className="px-4 py-2">{data?.upto}</td>
                <td className="px-4 py-2">{data?.taxabilityType}</td>
                <td className="px-4 py-2">{data?.igstRate}</td>
                <td className="px-4 py-2">{data?.cgstRate}</td>
                <td className="px-4 py-2">{data?.sgstUgstRate}</td>
                <td className="px-4 py-2">{data?.basedOnValue}</td>
                <td className="px-4 py-2">{data?.basedOnQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex gap-4">
        <button
          className="bg-black-2 hover:bg-secondary text-white font-bold py-2 px-4 rounded"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="bg-black-2 hover:bg-secondary text-white font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </>
  )
}

export default HsnOnItem
