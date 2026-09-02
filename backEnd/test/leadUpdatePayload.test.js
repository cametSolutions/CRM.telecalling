import test from "node:test"
import assert from "node:assert/strict"
import { mapLeadItemsForUpdate } from "../helper/leadUpdatePayload.js"

const converters = {
  toNumber: (value) => Number(value || 0),
  toObjectIdOrNull: (value) => value || null,
  safeString: (value) => String(value || "")
}

const primary = (id = "primary-new") => ({
  productorServiceId: id,
  productorServiceName: "New primary",
  productorservicetype: "Primaryproduct",
  itemType: "Product",
  company_id: "company",
  branch_id: "branch",
  licenseNumber: "101",
  applicationDate: "2026-09-02",
  softwareTrade: "Retail Trading",
  status: "Running",
  productPrice: "100",
  hsn: "18",
  netAmount: "118"
})

const service = (id = "service-new", parentId = "primary-new") => ({
  productorServiceId: id,
  productorServiceName: "New service",
  productorservicetype: "Additionalservice",
  itemType: "Service",
  company_id: "company",
  branch_id: "branch",
  parentPrimaryProductId: parentId,
  isDefaultService: true,
  licenseNumbers: [
    { licenseNumber: "101", productorServiceId: id, sourceIndex: 0 }
  ],
  taggeddata: [
    {
      licensenumber: "101",
      nextDue: "2027-09-02",
      noofusers: "5",
      serialNumber: "SER-NEW",
      taxexclusiveAmount: "200",
      taxinclusiveamount: "236",
      nextDueAmount: "200",
      totalnextDueAmount: "236",
      leadTax: "18",
      nextDueTax: "18"
    }
  ],
  productPrice: "200",
  hsn: "18",
  netAmount: "236"
})

test("changing only the primary product persists its new popup fields", () => {
  const [mapped] = mapLeadItemsForUpdate([primary()], converters)
  assert.equal(mapped.productorServiceId, "primary-new")
  assert.equal(mapped.applicationDate, "2026-09-02")
  assert.equal(mapped.softwareTrade, "Retail Trading")
  assert.deepEqual(mapped.taggeddata, [])
})

test("changing only an additional service persists new tagged popup data", () => {
  const [, mapped] = mapLeadItemsForUpdate(
    [primary("primary-old"), service("service-new", "primary-old")],
    converters
  )
  assert.equal(mapped.productorServiceId, "service-new")
  assert.equal(mapped.taggeddata[0].serialNumber, "SER-NEW")
  assert.equal(mapped.taggeddata[0].nextDueAmount, 200)
  assert.equal(mapped.licenseNumbers[0].licenseNumber, "101")
})

test("changing both products keeps the new parent relationship and popup data", () => {
  const mapped = mapLeadItemsForUpdate([primary(), service()], converters)
  assert.equal(mapped[0].productorServiceId, "primary-new")
  assert.equal(mapped[1].parentPrimaryProductId, "primary-new")
  assert.equal(mapped[1].taggeddata[0].totalnextDueAmount, 236)
})

test("mapped rows round-trip all popup fields needed when reopening edit", () => {
  const [, mapped] = mapLeadItemsForUpdate([primary(), service()], converters)
  assert.equal(mapped.status, "Running")
  assert.equal(mapped.isDefaultService, true)
  assert.equal(mapped.taggeddata[0].nextDue, "2027-09-02")
  assert.equal(mapped.taggeddata[0].noofusers, 5)
})

test("replacement payload contains only the newly selected rows", () => {
  const mapped = mapLeadItemsForUpdate([primary(), service()], converters)
  assert.deepEqual(
    mapped.map((row) => row.productorServiceId),
    ["primary-new", "service-new"]
  )
  assert.equal(
    mapped.some((row) => row.productorServiceId === "service-old"),
    false
  )
})
