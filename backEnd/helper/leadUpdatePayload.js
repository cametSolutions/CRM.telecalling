const asArray = (value) => (Array.isArray(value) ? value : [])

/**
 * Build replacement leadFor rows without losing the details-popup fields.
 * The edit API replaces the complete leadFor array, so every persisted field
 * must be copied from the submitted row rather than merged with the old row.
 */
export const mapLeadItemsForUpdate = (
  leadItems,
  { toNumber, toObjectIdOrNull, safeString }
) =>
  asArray(leadItems).map((item) => {
    const productPrice = toNumber(item?.productPrice)
    const netAmount = toNumber(item?.netAmount)
    const hsn = toNumber(item?.hsn)

    return {
      licenseNumber: item?.licenseNumber ?? null,
      licenseNumbers: asArray(item?.licenseNumbers).map((license) => ({
        licenseNumber: license?.licenseNumber ?? null,
        productorServiceId: toObjectIdOrNull(license?.productorServiceId),
        productorServiceName: safeString(license?.productorServiceName),
        sourceIndex: license?.sourceIndex
      })),
      taggeddata: asArray(item?.taggeddata).map((tag) => ({
        licensenumber: tag?.licensenumber ?? tag?.licenseNumber ?? null,
        nextDue: tag?.nextDue || null,
        productAmount: toNumber(tag?.productAmount),
        taxinclusiveamount: toNumber(tag?.taxinclusiveamount),
        taxexclusiveAmount: toNumber(tag?.taxexclusiveAmount),
        discountAmount: toNumber(tag?.discountAmount),
        hsn: toNumber(tag?.hsn),
        noofusers: toNumber(tag?.noofusers),
        serialNumber: tag?.serialNumber ?? null,
        nextDueAmount: toNumber(tag?.nextDueAmount),
        originalHsn: toNumber(tag?.originalHsn),
        leadAmount: toNumber(tag?.leadAmount),
        totalleadAmount: toNumber(tag?.totalleadAmount),
        totalnextDueAmount: toNumber(tag?.totalnextDueAmount),
        leadTax: toNumber(tag?.leadTax),
        nextDueTax: toNumber(tag?.nextDueTax)
      })),
      productorServiceName: safeString(item?.productorServiceName),
      productorServiceId: toObjectIdOrNull(item?.productorServiceId),
      productorServicemodel: safeString(
        item?.itemType || item?.productorServicemodel
      ),
      price: item?.price ?? null,
      productPrice,
      hsn,
      actualHsn: toNumber(item?.actualHsn),
      netAmount,
      actualproductPrice: toNumber(item?.actualproductPrice),
      actualNetAmount: toNumber(item?.actualNetAmount),
      taxAmount: netAmount - productPrice,
      productorservicetype: safeString(item?.productorservicetype),
      company_id: toObjectIdOrNull(item?.company_id),
      branch_id: toObjectIdOrNull(item?.branch_id),
      applicationDate: item?.applicationDate || null,
      softwareTrade: safeString(item?.softwareTrade),
      nextDue: item?.nextDue || null,
      noofusers: toNumber(item?.noofusers ?? item?.quantityUsers),
      version: item?.version ?? null,
      isActive: safeString(item?.isActive || item?.status || "Running"),
      status: safeString(item?.status || item?.isActive || "Running"),
      parentPrimaryProductId: toObjectIdOrNull(item?.parentPrimaryProductId),
      isDefaultService: Boolean(item?.isDefaultService)
    }
  })
