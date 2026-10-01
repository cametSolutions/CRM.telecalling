import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import Select from "react-select"
import { Plus, Trash2, CheckCircle2 } from "lucide-react"
import { toast } from "react-toastify"
import UseFetch from "../../hooks/useFetch"

const blankRow = () => ({
  id: `${Date.now()}-${Math.random()}`,
  customerId: "",
  customerName: "",
  contactPerson: "",
  mobile: "",
  email: "",
  address: "",
  licenseNumber: "",
  quantity: "1",
  rate: "",
  tax: "0",
  netAmount: "",
  leadSource: "",
  source: "Product master",
  notes: ""
})

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 4,
    borderColor: state.isFocused ? "#1B2A4A" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(27,42,74,.10)" : "none",
    backgroundColor: "#EEF2F8",
    ":hover": { borderColor: "#1B2A4A" }
  }),
  menu: (base) => ({ ...base, borderRadius: 4, overflow: "hidden", zIndex: 9999 }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    fontSize: 13,
    backgroundColor: state.isSelected ? "#1B2A4A" : state.isFocused ? "#eff6ff" : "white"
  })
}

function productLabel(product) {
  return product?.productName || product?.serviceName || "Unnamed product"
}

function productForCustomer(customer, productId) {
  const selected = customer?.selected || []
  return selected.find((entry) => {
    const candidate = entry?.product_id?._id || entry?.product_id || entry?.productorServiceId?._id || entry?.productorServiceId
    return String(candidate) === String(productId)
  })
}

function productTax(product, branchId) {
  const entry = (product?.selected || []).find((item) => String(item?.branch_id) === String(branchId))
  return Number(entry?.hsn_id?.onValue?.igstRate ?? product?.hsn ?? 0)
}

function getNetAmount(rate, tax) {
  const amount = Number(rate) || 0
  return (amount + (amount * (Number(tax) || 0)) / 100).toFixed(2)
}

export default function MultipleLeadCreation() {
  const selectedBranch = useSelector((state) => state.companyBranch.selectedBranch)
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const branchId = Array.isArray(selectedBranch) ? selectedBranch[0] : selectedBranch || user?.selected?.[0]?.branch_id
  const [mode, setMode] = useState("multiple")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [rows, setRows] = useState([blankRow()])
  const [created, setCreated] = useState(false)

  const { data: products, loading: productsLoading } = UseFetch(
    branchId ? `/product/getallProducts?branchselected=${encodeURIComponent(JSON.stringify(branchId))}` : null
  )
  const { data: customers, loading: customersLoading } = UseFetch(
    branchId ? `/customer/getallCustomer?branchSelected=${branchId}` : null
  )

  const productOptions = useMemo(
    () => (products || []).map((product) => ({ value: product._id, label: productLabel(product), product })),
    [products]
  )
  const customerOptions = useMemo(
    () => (customers || []).map((customer) => ({
      value: customer._id,
      label: customer.customerName || "Unnamed customer",
      customer
    })),
    [customers]
  )

  const updateRow = (id, changes) => setRows((current) => current.map((row) => {
    if (row.id !== id) return row
    const next = { ...row, ...changes }
    if (Object.hasOwn(changes, "rate") || Object.hasOwn(changes, "tax")) next.netAmount = getNetAmount(next.rate, next.tax)
    return next
  }))

  const selectCustomer = (rowId, option) => {
    if (!option) return updateRow(rowId, blankRow())
    const customer = option.customer
    const savedProduct = selectedProduct && productForCustomer(customer, selectedProduct.value)
    const rate = savedProduct?.productPrice ?? savedProduct?.price ?? selectedProduct?.product?.productPrice ?? ""
    const tax = savedProduct?.hsn ?? selectedProduct?.tax ?? "0"
    updateRow(rowId, {
      customerId: customer._id,
      customerName: customer.customerName || "",
      contactPerson: customer.contactPerson || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      address: customer.address1 || "",
      licenseNumber: savedProduct?.licensenumber || savedProduct?.licenseNumber || "",
      quantity: savedProduct?.quantity || "1",
      rate,
      tax,
      netAmount: getNetAmount(rate, tax),
      source: savedProduct ? "Customer history" : "Product master"
    })
  }

  const handleProduct = (option) => {
    const productWithTax = option ? { ...option, tax: productTax(option.product, branchId) } : null
    setSelectedProduct(productWithTax)
    setCreated(false)
    setRows((current) => current.map((row) => {
      const customer = (customers || []).find((item) => String(item._id) === String(row.customerId))
      const savedProduct = customer && option && productForCustomer(customer, option.value)
      const rate = savedProduct?.productPrice ?? savedProduct?.price ?? option?.product?.productPrice ?? ""
      const tax = savedProduct?.hsn ?? productTax(option?.product, branchId)
      return {
        ...row,
        rate,
        tax,
        netAmount: getNetAmount(rate, tax),
        licenseNumber: savedProduct?.licensenumber || savedProduct?.licenseNumber || "",
        source: savedProduct ? "Customer history" : "Product master"
      }
    }))
  }

  const addRow = () => setRows((current) => [...current, blankRow()])
  const removeRow = (id) => setRows((current) => current.length === 1 ? current : current.filter((row) => row.id !== id))
  const readyRows = rows.filter((row) => row.customerId)
  const submitPreview = () => {
    if (!selectedProduct) return toast.info("Select a product before creating the preview.")
    if (!readyRows.length) return toast.info("Add at least one customer to the draft.")
    setCreated(true)
    toast.success(`${readyRows.length} lead draft${readyRows.length > 1 ? "s" : ""} ready — nothing was saved.`)
  }

  return <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#ADD8E6]">
    <div className="flex-1 min-h-0 overflow-y-auto p-3">
      <div className="mx-auto w-full max-w-4xl rounded bg-white shadow-xl">
        <div className="bg-white p-4" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-2">
              <div className="rounded border-2 border-red-500 bg-white px-4 py-1 text-sm font-bold text-red-600">MULTIPLE LEAD</div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><span>Lead Type</span><select value={mode} onChange={(event) => { const nextMode = event.target.value; setMode(nextMode); setRows(nextMode === "single" ? [rows[0] || blankRow()] : rows) }} className="rounded border border-gray-300 bg-[#EEF2F8] px-2 py-1.5 text-xs outline-none"><option value="single">Single Lead</option><option value="multiple">Multiple Leads</option></select></div>
            </div>
            <div className="space-y-3 p-3 md:p-4">
              <div className="flex max-w-[600px] flex-col gap-3 md:flex-row md:items-end">
                <div className="w-full md:w-[430px]"><label className="mb-1 block text-xs font-semibold text-gray-600">Product / Service</label><Select styles={selectStyles} menuPortalTarget={document.body} menuPosition="fixed" isLoading={productsLoading} options={productOptions} value={selectedProduct} onChange={handleProduct} placeholder="Select Product / Service" noOptionsMessage={() => "No products available"} /></div>
                <div className="w-full md:w-[150px]"><button type="button" onClick={addRow} disabled={!selectedProduct || mode === "single"} className="flex h-9 w-full items-center justify-center gap-1.5 rounded bg-[#1B2A4A] px-3 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-[#243660] hover:shadow disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15} /> ADD USER</button></div>
              </div>
              <p className="text-xs text-gray-500">Select one product first. Customer history is used when the customer already has that product; otherwise Product Master values are used.</p>
              <div className="overflow-x-auto rounded border border-gray-300">
                <table className="w-full min-w-[760px] table-fixed border-collapse text-xs">
                  <thead><tr className="bg-[#1B2A4A] text-white"><th className="w-[25%] border border-blue-900 px-2 py-2 text-left">Customer</th><th className="w-[13%] border border-blue-900 px-2 py-2 text-left">License No.</th><th className="w-[8%] border border-blue-900 px-2 py-2 text-center">Qty</th><th className="w-[12%] border border-blue-900 px-2 py-2 text-right">Amount</th><th className="w-[9%] border border-blue-900 px-2 py-2 text-center">Tax %</th><th className="w-[13%] border border-blue-900 px-2 py-2 text-right">Net Amt</th><th className="w-[15%] border border-blue-900 px-2 py-2 text-left">Source of Lead</th><th className="w-[5%] border border-blue-900 px-2 py-2 text-center">Action</th></tr></thead>
                  <tbody>{rows.map((row, index) => <tr key={row.id} className="border-b bg-white even:bg-blue-50 transition-colors hover:bg-blue-50"><td className="border border-gray-300 px-1 py-1"><Select styles={selectStyles} menuPortalTarget={document.body} menuPosition="fixed" isLoading={customersLoading} options={customerOptions} value={customerOptions.find((option) => String(option.value) === String(row.customerId)) || null} onChange={(option) => selectCustomer(row.id, option)} placeholder={customersLoading ? "Loading customers..." : `Select Customer ${index + 1}`} noOptionsMessage={() => "No customers available for this branch"} />{row.customerId && <p className="mt-1 truncate px-1 text-[10px] text-gray-500">{row.contactPerson || "No contact"}{row.mobile ? ` · ${row.mobile}` : ""}</p>}</td><td className="border border-gray-300 px-1 py-1"><TableInput value={row.licenseNumber} onChange={(value) => updateRow(row.id, { licenseNumber: value })} /></td><td className="border border-gray-300 px-1 py-1"><TableInput type="number" value={row.quantity} onChange={(value) => updateRow(row.id, { quantity: value })} /></td><td className="border border-gray-300 px-1 py-1"><TableInput type="number" value={row.rate} onChange={(value) => updateRow(row.id, { rate: value })} align="right" /></td><td className="border border-gray-300 px-1 py-1"><TableInput type="number" value={row.tax} onChange={(value) => updateRow(row.id, { tax: value })} align="right" /></td><td className="border border-gray-300 px-1 py-1"><TableInput value={row.netAmount} onChange={(value) => updateRow(row.id, { netAmount: value })} align="right" /></td><td className="border border-gray-300 px-1 py-1"><select value={row.leadSource} onChange={(event) => updateRow(row.id, { leadSource: event.target.value })} className="h-9 w-full rounded border border-gray-200 bg-white px-1 text-xs outline-none"><option value="">Select source</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="reference">Reference</option><option value="walkin">Walk-in</option><option value="other">Other</option></select></td><td className="border border-gray-300 px-1 py-1 text-center">{mode === "multiple" && <button type="button" onClick={() => removeRow(row.id)} aria-label="Remove customer" className="rounded p-1 text-red-600 hover:bg-red-100"><Trash2 size={15} /></button>}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-gray-500">{readyRows.length} of {rows.length} customer drafts ready. This page is preview-only and does not save data.</p><button type="button" onClick={submitPreview} disabled={!selectedProduct || !readyRows.length} className="flex items-center justify-center gap-2 rounded bg-[#1B2A4A] px-8 py-2 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#243660] disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 size={16} /> CREATE LEADS (DEMO)</button></div>
              {created && <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700"><strong>Demo preview ready.</strong> {readyRows.length} local draft{readyRows.length !== 1 ? "s are" : " is"} prepared for {selectedProduct?.label}. No records were created.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

function TableInput({ value, onChange, type = "text", align = "left" }) {
  return <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`h-9 w-full rounded border border-gray-200 bg-white px-2 text-xs outline-none ${align === "right" ? "text-right" : ""}`} />
}
