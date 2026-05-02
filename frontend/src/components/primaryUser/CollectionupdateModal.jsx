import { useState, useEffect, useRef } from "react"
import { X, IndianRupee, ClipboardCheck, Lock } from "lucide-react"
import { BarLoader } from "../../components/loader/BarLoader"
/* ─── helpers ─── */
const safeNumber = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

const todayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const emptyRow = () => ({
  id: crypto.randomUUID(),
  label: "",
  netAmount: "",
  receivedAmount: "",
  _balance: undefined,
  _netAmt: 0,
  _paidSoFar: 0
})

/* ══════════════════════════════════════════════════════
   TOOLTIP COMPONENT
══════════════════════════════════════════════════════ */
function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const show = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({
      top: rect.top - 8, // will be adjusted after mount
      left: rect.left + rect.width / 2
    })
    setVisible(true)
  }

  const hide = () => setVisible(false)

  /* nudge tooltip into viewport after it appears */
  useEffect(() => {
    if (!visible || !tooltipRef.current || !triggerRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const tt = tooltipRef.current.getBoundingClientRect()
    const top = tr.top - tt.height - 8
    let left = tr.left + tr.width / 2 - tt.width / 2
    // clamp horizontally
    const pad = 8
    left = Math.max(pad, Math.min(left, window.innerWidth - tt.width - pad))
    setPos({ top, left })
  }, [visible, text])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ minWidth: 0, width: "100%" }}
      >
        {children}
      </div>

      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
            /* appearance */
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#f1f5f9",
            fontSize: 11.5,
            fontWeight: 500,
            lineHeight: 1.4,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid rgba(99,102,241,0.35)",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.15)",
            whiteSpace: "nowrap",
            maxWidth: 280,
            overflow: "hidden",
            textOverflow: "ellipsis",
            /* arrow */
            animation: "tooltipFadeIn 0.12s ease"
          }}
        >
          {/* accent line */}
          <span
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 32,
              height: 2,
              borderRadius: "0 0 4px 4px",
              background: "linear-gradient(90deg,#6366f1,#818cf8)"
            }}
          />

          {text}

          {/* caret */}
          <span
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #1e293b"
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}

/* ─── sub-components ─── */
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 6
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(90deg,#e2e8f0,transparent)"
        }}
      />
      {children}
      <span
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(270deg,#e2e8f0,transparent)"
        }}
      />
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#374151"
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 10.5, color: "#ef4444", marginTop: 1 }}>
          {error}
        </p>
      )}
    </div>
  )
}

function AmtInput({ value, onChange, highlight }) {
  return (
    <div style={{ position: "relative" }}>
      <IndianRupee
        size={9}
        style={{
          position: "absolute",
          left: 5,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94a3b8",
          pointerEvents: "none"
        }}
      />
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        style={{
          width: "100%",
          paddingLeft: 16,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: 11,
          border: `1px solid ${highlight ? "#bfdbfe" : "#e2e8f0"}`,
          borderRadius: 6,
          background: highlight ? "#eff6ff" : "#f8fafc",
          outline: "none",
          color: "#1e293b",
          fontFamily: "inherit"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#6366f1"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = highlight ? "#bfdbfe" : "#e2e8f0"
        }}
      />
    </div>
  )
}

function TotalCell({ value, color, green, abs }) {
  const display = abs ? Math.abs(value) : value
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        ...(green
          ? {
              background: "#dcfce7",
              border: "1px solid #86efac",
              borderRadius: 6,
              padding: "3px 6px"
            }
          : {}),
        display: "flex",
        alignItems: "center",
        gap: 2
      }}
    >
      <IndianRupee size={9} />
      {display.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
    </span>
  )
}

function SummaryChip({ label, value, color, bg, border, suffix = "" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 10px",
        borderRadius: 8,
        background: bg,
        border: `1px solid ${border}`
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 600, color, opacity: 0.8 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color,
          display: "flex",
          alignItems: "center",
          gap: 3
        }}
      >
        <IndianRupee size={10} />
        {value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        {suffix && <span style={{ fontSize: 9.5 }}>{suffix}</span>}
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN MODAL
══════════════════════════════════════════════════════ */
export function CollectionupdateModal({
  data,
  closemodal,
  partnerlist,
  loggedUser,
  handleCollectionUpdate,
  from,
  editData,
  hasCollectionData
}) {
  console.log(hasCollectionData)
  console.log(editData)
  console.log(data)
  const [error, setError] = useState({})
  console.log("hh")
  const [submitLoader, setsubmitLoader] = useState(false)
  const [formData, setFormData] = useState({
    submissionDate: todayString(),
    bankRemark: "",
    registrationType: "",
    registrationNo: "",
    customerName: "",
    address: "",
    mobile: "",
    email: "",
    pin: "",
    country: "",
    state: "",
    city: "",
    partner: "",
    customerId: ""
  })
  const [paymentRows, setPaymentRows] = useState([emptyRow()])
  console.log(paymentRows)
  const base = {
    width: "100%",
    padding: "5px 9px",
    fontSize: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 7,
    background: "#f8fafc",
    outline: "none",
    color: "#1e293b",
    transition: "border 0.15s, box-shadow 0.15s",
    fontFamily: "inherit"
  }
  const readonly = {
    ...base,
    background: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed"
  }

  const focusOn = (e) => {
    e.target.style.borderColor = "#6366f1"
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"
  }
  const focusOff = (e) => {
    e.target.style.borderColor = "#e2e8f0"
    e.target.style.boxShadow = "none"
  }
  console.log(loggedUser)
  /* ── seed from data ── */
  useEffect(() => {
    if (!data) return
    setFormData((prev) => ({
      ...prev,
      customerId: data?.customerName?._id ?? "",
      bankRemark: data.bankRemark ?? "",
      totalpaidAmountBefore: data?.totalPaidAmount,
      registrationType: data.customerName?.registrationType ?? "",
      registrationNo: data.customerName?.registrationNo ?? "",
      customerName: data.customerName?.customerName ?? "",
      address: data.customerName?.address1 ?? "",
      mobile: data.mobile ?? "",
      email: data.email ?? "",
      pin: data.customerName?.pincode ?? "",
      country: data.customerName?.country ?? "",
      state: data.customerName?.state ?? "",
      city: data.customerName?.city ?? "",
      partner: data?.partner?._id ?? "",
      receivedBy: loggedUser?._id,
      receivedModel: loggedUser?.role === "Admin" ? "Admin" : "Staff"
    }))
    console.log(data?.paymentHistory)
    const history = Array.isArray(data.paymentHistory)
      ? data.paymentHistory
      : []

    const lastPayment = history.length ? history[history.length - 1] : null
    console.log(lastPayment)
    const hasPaymentEntries =
      lastPayment &&
      Array.isArray(lastPayment.paymentEntries) &&
      lastPayment.paymentEntries.length > 0

    if (hasPaymentEntries && !hasCollectionData) {
      console.log(lastPayment.paymentEntries)
      console.log("hh")
      // ✅ seed from last paymentHistory.paymentEntries
      setPaymentRows(
        lastPayment.paymentEntries.map((p) => {
          const net = safeNumber(p.netAmount)
          const paid = safeNumber(p.netAmount) - safeNumber(p.balanceAmount)

          return {
            id: crypto.randomUUID(),
            label: p.productorServiceId?.productName ?? "Product",
            productorServiceId: p.productorServiceId?._id,
            productorServicemodel: p.productorServicemodel ?? "Product",
            netAmount: String(net),
            receivedAmount: "", // new collection input
            _balance: net - paid,
            _netAmt: net,
            _paidSoFar: paid
          }
        })
      )
    } else if (Array.isArray(data.leadFor) && data.leadFor.length > 0) {
      if (hasCollectionData && hasPaymentEntries) {
        console.log("Hhh")
      } else if (hasCollectionData && !hasPaymentEntries) {
        console.log("hh")
      } else {
        console.log("hhhhh")
        console.log(data.leadFor)
        // ✅ fallback: seed from leadFor
        setPaymentRows(
          data.leadFor.map((p) => {
            const net = safeNumber(p.netAmount ?? p.productPrice)
            const paid = 0

            return {
              id: crypto.randomUUID(),
              label: p.productorServiceId?.productName ?? "Product",
              productorServiceId:
                p.productorServiceId?._id ?? p.productorServiceId,
              productorServicemodel: p.productorServicemodel,
              netAmount: String(net),
              receivedAmount: "",
              _balance: net - paid,
              _netAmt: net,
              _paidSoFar: paid
            }
          })
        )
      }
    } else {
      console.log("HH")
      // optional: single row based on lead netAmount
      const net = safeNumber(data.netAmount)
      const paid = safeNumber(data.totalPaidAmount)
      setPaymentRows([
        {
          id: crypto.randomUUID(),
          label: data.customerName?.customerName ?? "Payment",
          productorServiceId: null,
          productorServicemodel: null,
          netAmount: String(net),
          receivedAmount: "",
          _balance: net - paid,
          _netAmt: net,
          _paidSoFar: paid
        }
      ])
    }
  }, [data])
  console.log(paymentRows)
  /* ── row helpers ── */
  const updateRow = (id, field, value) =>
    setPaymentRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const updated = { ...r, [field]: value }
        if (field === "netAmount") {
          updated._netAmt = safeNumber(value)
          updated._balance = safeNumber(value) - safeNumber(r._paidSoFar ?? 0)
        }
        return updated
      })
    )
  console.log(paymentRows)

  const rowBalance = (r) =>
    safeNumber(r.netAmount) -
    safeNumber(r._paidSoFar ?? 0) -
    safeNumber(r.receivedAmount)
  const isRowLocked = (r) => r._balance !== undefined && r._balance <= 0

  const totalNet = paymentRows.reduce((s, r) => s + safeNumber(r.netAmount), 0)
  const totalReceived = paymentRows.reduce(
    (s, r) => s + safeNumber(r.receivedAmount),
    0
  )
  console.log(paymentRows)
  console.log(data)
  const totalBalance = paymentRows.reduce((s, r) => s + rowBalance(r), 0)

  /* ── field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "email") {
      setError((p) => ({
        ...p,
        email:
          value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Invalid email"
            : ""
      }))
      return
    }
    if (name === "mobile") {
      let msg = ""
      if (!value) msg = "Required"
      else if (!/^\d+$/.test(value)) msg = "Digits only"
      else if (value.length !== 10) msg = "10 digits required"
      else if (!/^[6-9]\d{9}$/.test(value)) msg = "Invalid number"
      setError((p) => ({ ...p, mobile: msg }))
      return
    }
    setError((p) => ({ ...p, [name]: "" }))
  }

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(paymentRows)
    const payload = {
      leadId: data?.leadId,
      leadDocId: data?._id,
      ...formData,
      paymentEntries: paymentRows.map((r) => ({
        label: r.label,
        productorServiceId: r.productorServiceId,
        productorServicemodel: r.productorServicemodel,
        netAmount: safeNumber(r.netAmount),
        receivedAmount: safeNumber(r.receivedAmount),
        balanceAmount: rowBalance(r)
      })),
      totalNetAmount: totalNet,
      totalReceivedAmount: totalReceived,
      updatedBy: loggedUser?._id
    }
    console.log(payload)

    const res = await handleCollectionUpdate(payload, setsubmitLoader)
    if (res?.status === 200) closemodal(false)
  }

  const isRegular = formData.registrationType === "regular"
  const balColor =
    totalBalance > 0 ? "#b45309" : totalBalance < 0 ? "#be123c" : "#166534"

  /* ════════ RENDER ════════ */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        background: "rgba(15,23,42,0.55)"
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        onClick={() => closemodal(false)}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "calc(100vw - 24px)",
          maxWidth: 1120,
          maxHeight: "93vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 18,
          overflow: "hidden",
          background: "#f1f5f9",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.22), 0 40px 80px rgba(0,0,0,0.16)"
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 20px",
            background:
              "linear-gradient(130deg,#0c1e3d 0%,#1a3560 55%,#1e4480 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ClipboardCheck size={15} color="rgba(255,255,255,0.85)" />
            </div>
            <div>
              <div
                style={{ fontSize: 13.5, fontWeight: 700, color: "#f1f5f9" }}
              >
                Collection Update
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 1
                }}
              >
                Update payment and collection details
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 11px",
                borderRadius: 99,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: 11,
                fontWeight: 700,
                color: "#7dd3fc"
              }}
            >
              Lead ID:{" "}
              <span style={{ color: "#38bdf8" }}>{data?.leadId ?? "—"}</span>
            </div>
            <button
              type="button"
              onClick={() => closemodal(false)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)"
              }}
            >
              <X size={13} color="rgba(255,255,255,0.85)" />
            </button>
          </div>
        </div>

        {submitLoader && <BarLoader />}

        {/* ── 3-COLUMN BODY ── */}
        <form
          id="collection-form"
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 210px 1fr",
            gap: 10,
            padding: 12,
            overflow: "hidden",
            minHeight: 0
          }}
        >
          {/* COL 1 — Customer Information */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "13px",
              display: "flex",
              flexDirection: "column",
              gap: 7,
              overflow: "hidden"
            }}
          >
            <SectionTitle>Customer Information</SectionTitle>

            <Field label="Customer Name">
              <input value={formData.customerName} readOnly style={readonly} />
            </Field>
            <Field label="Address">
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={base}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7
              }}
            >
              <Field label="Mobile" error={error.mobile}>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
              <Field label="Email" error={error.email}>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7
              }}
            >
              <Field label="Pin">
                <input
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
              <Field label="Country">
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7
              }}
            >
              <Field label="State">
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
              <Field label="City">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={base}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7
              }}
            >
              <Field label="Reg. Type">
                <select
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleChange}
                  style={{ ...base, cursor: "pointer" }}
                  onFocus={focusOn}
                  onBlur={focusOff}
                >
                  <option value="">Select</option>
                  <option value="unregistered">Unregistered</option>
                  <option value="regular">Regular</option>
                </select>
              </Field>
              <Field label="Reg. No">
                <input
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  style={isRegular ? base : readonly}
                  readOnly={!isRegular}
                  disabled={!isRegular}
                  onFocus={(e) => {
                    if (isRegular) focusOn(e)
                  }}
                  onBlur={focusOff}
                />
              </Field>
            </div>
          </div>

          {/* COL 2 — Date + Partner + Remark + Summary */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "13px",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <SectionTitle>Details</SectionTitle>

            <Field label="Submission Date">
              <input
                type="date"
                value={formData.submissionDate}
                readOnly
                style={readonly}
              />
            </Field>

            {partnerlist?.length > 0 && (
              <Field label="Associate With">
                <select
                  name="partner"
                  value={formData.partner}
                  onChange={handleChange}
                  style={{ ...base, cursor: "pointer" }}
                  onFocus={focusOn}
                  onBlur={focusOff}
                >
                  <option value="">Select partner</option>
                  {partnerlist.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p?.partner || p?.partnerName}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Bank Remark">
              <textarea
                name="bankRemark"
                value={formData.bankRemark}
                onChange={handleChange}
                placeholder="Enter bank remarks or notes..."
                rows={4}
                style={{
                  ...base,
                  resize: "vertical",
                  minHeight: 80,
                  lineHeight: 1.5
                }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}
            >
              <SummaryChip
                label="Net Total"
                value={totalNet}
                color="#1e40af"
                bg="#dbeafe"
                border="#93c5fd"
              />
              <SummaryChip
                label="Old Paid"
                value={data?.totalPaidAmount || 0}
                color="#0f766e"
                bg="#ccfbf1"
                border="#5eead4"
              />
              <SummaryChip
                label="Received"
                value={totalReceived}
                color="#166534"
                bg="#dcfce7"
                border="#86efac"
              />
              <SummaryChip
                label="Balance"
                value={Math.abs(totalBalance)}
                color={balColor}
                bg={
                  totalBalance > 0
                    ? "#fffbeb"
                    : totalBalance < 0
                      ? "#fff1f2"
                      : "#f0fdf4"
                }
                border={
                  totalBalance > 0
                    ? "#fde047"
                    : totalBalance < 0
                      ? "#fda4af"
                      : "#86efac"
                }
                suffix={totalBalance < 0 ? " (Excess)" : ""}
              />
            </div>
          </div>

          {/* COL 3 — Payment Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "13px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <SectionTitle>Payment Entries</SectionTitle>
            </div>

            {/* Column headings */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 82px 78px 82px",
                gap: 5,
                padding: "5px 7px",
                background: "#f8fafc",
                borderRadius: "8px 8px 0 0",
                border: "1px solid #e2e8f0",
                borderBottom: "none"
              }}
            >
              {["Description", "Net Amt", "Balance", "Received"].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em"
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Scrollable rows */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #e2e8f0",
                borderTop: "none",
                borderRadius: "0 0 10px 10px"
              }}
            >
              {paymentRows.map((row, idx) => {
                const locked = isRowLocked(row)
                const bal = rowBalance(row)
                const bc = bal > 0 ? "#b45309" : bal < 0 ? "#be123c" : "#166534"
                const bb = bal > 0 ? "#fffbeb" : bal < 0 ? "#fff1f2" : "#f0fdf4"
                const bbd =
                  bal > 0 ? "#fde068" : bal < 0 ? "#fca5a5" : "#86efac"

                return (
                  <div
                    key={row.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 82px 78px 82px",
                      gap: 5,
                      alignItems: "center",
                      padding: "6px 7px",
                      background: locked
                        ? "#f8faff"
                        : idx % 2 === 0
                          ? "#fff"
                          : "#fafbff",
                      borderBottom:
                        idx < paymentRows.length - 1
                          ? "1px solid #f1f5f9"
                          : "none"
                    }}
                  >
                    {/* ── Product label with Tooltip ── */}
                    <Tooltip text={row.label}>
                      <div
                        style={{
                          padding: "4px 7px",
                          fontSize: 11,
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          background: "#f1f5f9",
                          color: "#374151",
                          fontFamily: "inherit",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "default",
                          /* subtle left accent */
                          borderLeft: "3px solid #818cf8"
                        }}
                      >
                        {row.label}
                      </div>
                    </Tooltip>

                    {/* Net Amount */}
                    <AmtInput
                      value={row.netAmount}
                      onChange={(v) => updateRow(row.id, "netAmount", v)}
                    />

                    {/* Balance chip */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 6px",
                        borderRadius: 6,
                        color: bc,
                        background: bb,
                        border: `1px solid ${bbd}`,
                        whiteSpace: "nowrap",
                        overflow: "hidden"
                      }}
                    >
                      <IndianRupee size={9} />
                      <span
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {Math.abs(bal).toLocaleString("en-IN", {
                          maximumFractionDigits: 0
                        })}
                      </span>
                    </div>

                    {/* Received / Locked */}
                    {locked ? (
                      <div
                        title="Fully paid — no balance remaining"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#166534",
                          background: "#dcfce7",
                          border: "1px solid #86efac",
                          borderRadius: 6,
                          padding: "4px 5px",
                          cursor: "not-allowed"
                        }}
                      >
                        <Lock size={9} /> Paid
                      </div>
                    ) : (
                      <AmtInput
                        value={row.receivedAmount}
                        onChange={(v) => updateRow(row.id, "receivedAmount", v)}
                        highlight
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Totals footer */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 82px 78px 82px",
                gap: 5,
                padding: "6px 7px",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "0 0 10px 10px",
                marginTop: 4
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0369a1" }}>
                Total
              </span>
              <TotalCell value={totalNet} color="#0369a1" />
              <TotalCell value={totalBalance} color={balColor} abs />
              <TotalCell value={totalReceived} color="#166534" green />
            </div>
          </div>
        </form>

        {/* ── FOOTER ── */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            padding: "10px 16px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc"
          }}
        >
          <button
            type="button"
            onClick={() => closemodal(false)}
            style={{
              padding: "7px 18px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff"
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="collection-form"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 22px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37,99,235,0.35)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg,#1e40af,#1d4ed8)"
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(37,99,235,0.45)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg,#1d4ed8,#2563eb)"
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)"
            }}
          >
            <ClipboardCheck size={13} />
            {from === "followup" ? "Continue" : "Update Collection"}
          </button>
        </div>
      </div>
    </div>
  )
}
