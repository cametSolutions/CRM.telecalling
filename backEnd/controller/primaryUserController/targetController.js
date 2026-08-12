import mongoose from "mongoose";
import { TargetAchievement, Allocation, User, TargetCategory, TargetConfiguration } from "../../model/primaryUser/targetSchema.js";
import { Category } from "../../model/primaryUser/productSubDetailsSchema.js";
import Task from "../../model/primaryUser/taskSchema.js";
import LeadMaster from "../../model/primaryUser/leadmasterSchema.js";
import models from "../../model/auth/authSchema.js";
const { Staff, Admin } = models
import Product from "../../model/primaryUser/productSchema.js";
import Service from "../../model/primaryUser/servicesSchema.js";







// export const gettargetResult = async (req, res) => {
//     try {
//         const { month, year, periodMode, selectedBranch } = req.query

//         const monthNumber = Number(month)
//         const yearNumber = Number(year)
//         const periodModeValue = String(periodMode || "all").toLowerCase().trim()

//         if (!monthNumber || !yearNumber) {
//             return res.status(400).json({
//                 success: false,
//                 message: "month and year are required"
//             })
//         }

//         const closingTask = await Task.findOne({ taskName: "Follow-Up Closing" }).select("_id taskName")

//         if (!closingTask) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Closing task not found"
//             })
//         }

//         const closingTaskId = String(closingTask._id)

//         const startOfMonth = new Date(yearNumber, monthNumber - 1, 1)
//         const endOfMonth = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999)

//         const configQuery = {
//             startDate: { $lte: endOfMonth },
//             endDate: { $gte: startOfMonth },
//             branch: selectedBranch
//         }

//         const allTargetConfigs = await TargetConfiguration.find({ branch: selectedBranch })
//             .select("periodName monthlyTargets startDate endDate measurementType")

//         const allPeriods = [
//             ...new Set(
//                 allTargetConfigs
//                     .map((item) => String(item.periodName || "").trim())
//                     .filter(Boolean)
//             )
//         ]

//         let targetConfigs = await TargetConfiguration.find(configQuery)
//             .populate("categoryId", "category")
//             .populate("monthlyTargets.userTargets.userId", "name email")

//         const configHasMonthYear = (config, m, y) => {
//             return (
//                 Array.isArray(config.monthlyTargets) &&
//                 config.monthlyTargets.some(
//                     (mt) =>
//                         Number(mt.month) === Number(m) &&
//                         Number(mt.year) === Number(y)
//                 )
//             )
//         }

//         targetConfigs = targetConfigs.filter((config) => {
//             if (!Array.isArray(config.monthlyTargets)) return false

//             if (periodModeValue === "all") {
//                 return configHasMonthYear(config, monthNumber, yearNumber)
//             }

//             const selectedPeriodMonth = Number(periodModeValue)
//             if (!selectedPeriodMonth) return false

//             return configHasMonthYear(config, selectedPeriodMonth, yearNumber)
//         })

//         if (!targetConfigs.length) {
//             return res.json({
//                 success: true,
//                 data: {
//                     userWiseResults: [],
//                     summary: {
//                         target: 0,
//                         achieved: 0,
//                         balance: 0,
//                         incentive: 0
//                     },
//                     periods: allPeriods,
//                     measurementTypes: [],
//                     selectedMeasurementType: "",
//                     selectedPeriodName: "",
//                     selectedMonth: monthNumber,
//                     selectedYear: yearNumber
//                 }
//             })
//         }

//         let effectiveStartMonthNumber
//         let effectiveEndMonthNumber

//         if (periodModeValue === "all") {
//             let minMonth = Infinity
//             let maxMonth = -Infinity

//             for (const cfg of targetConfigs) {
//                 for (const mt of cfg.monthlyTargets || []) {
//                     if (Number(mt.year) !== yearNumber) continue
//                     const mNum = Number(mt.month)
//                     if (!mNum) continue

//                     if (mNum < minMonth) minMonth = mNum
//                     if (mNum > maxMonth) maxMonth = mNum
//                 }
//             }

//             if (!isFinite(minMonth) || !isFinite(maxMonth)) {
//                 minMonth = monthNumber
//                 maxMonth = monthNumber
//             }

//             effectiveStartMonthNumber = minMonth
//             effectiveEndMonthNumber = maxMonth
//         } else {
//             const selectedPeriodMonth = Number(periodModeValue)
//             effectiveStartMonthNumber = selectedPeriodMonth
//             effectiveEndMonthNumber = selectedPeriodMonth
//         }

//         const effectiveStartOfMonth = new Date(
//             yearNumber,
//             effectiveStartMonthNumber - 1,
//             1
//         )

//         const effectiveEndOfMonth = new Date(
//             yearNumber,
//             effectiveEndMonthNumber,
//             0,
//             23,
//             59,
//             59,
//             999
//         )

//         const leads = await LeadMaster.find({
//             leadDate: { $gte: effectiveStartOfMonth, $lte: effectiveEndOfMonth }
//         })

//         const productIds = new Set()
//         const serviceIds = new Set()

//         for (const lead of leads) {
//             for (const item of lead.leadFor || []) {
//                 if (!item.productorServiceId || !item.productorServicemodel) continue

//                 if (item.productorServicemodel === "Product") {
//                     productIds.add(String(item.productorServiceId))
//                 } else if (item.productorServicemodel === "Service") {
//                     serviceIds.add(String(item.productorServiceId))
//                 }
//             }

//             for (const payment of lead.paymentHistory || []) {
//                 for (const entry of payment.paymentEntries || []) {
//                     if (!entry.productorServiceId || !entry.productorServicemodel) continue

//                     if (entry.productorServicemodel === "Product") {
//                         productIds.add(String(entry.productorServiceId))
//                     } else if (entry.productorServicemodel === "Service") {
//                         serviceIds.add(String(entry.productorServiceId))
//                     }
//                 }
//             }
//         }

//         const [products, services] = await Promise.all([
//             Product.find({ _id: { $in: [...productIds] } }).select(
//                 "productName name selected"
//             ),
//             Service.find({ _id: { $in: [...serviceIds] } }).select(
//                 "serviceName name selected category_id categoryId categoryName"
//             )
//         ])

//         const productMap = {}
//         const serviceMap = {}

//         for (const item of products) {
//             const selectedRow = Array.isArray(item.selected) ? item.selected[0] : null
//             const categoryId = selectedRow?.category_id
//                 ? String(selectedRow.category_id)
//                 : ""

//             productMap[String(item._id)] = {
//                 name: item.productName || item.name || "Product",
//                 categoryId
//             }
//         }

//         for (const item of services) {
//             const selectedRow = Array.isArray(item.selected) ? item.selected[0] : null
//             const categoryId = selectedRow?.category_id
//                 ? String(selectedRow.category_id)
//                 : item.category_id
//                     ? String(item.category_id)
//                     : item.categoryId
//                         ? String(item.categoryId)
//                         : ""

//             serviceMap[String(item._id)] = {
//                 name: item.serviceName || item.name || "Service",
//                 categoryId
//             }
//         }

//         const isLeadFullyVerified = (lead) => {
//             const payments = lead.paymentHistory || []
//             if (!payments.length) return false
//             return payments.every((p) => p.paymentVerified)
//         }

//         const isLeadEligibleForIncentive = (lead) => {
//             if (lead.forcefullyClosedTarget === true) return true
//             if (Number(lead.balanceAmount || 0) === 0) return true
//             if (isLeadFullyVerified(lead)) return true
//             return false
//         }

//         const getLeadMonthYear = (lead) => {
//             const d = new Date(lead.leadDate)
//             return {
//                 month: d.getMonth() + 1,
//                 year: d.getFullYear()
//             }
//         }

//         const getLeadCategoryEntries = (lead, configCategoryId) => {
//             const entries = []

//             for (const item of lead.leadFor || []) {
//                 const itemId = item.productorServiceId
//                     ? String(item.productorServiceId)
//                     : null
//                 const itemModel = item.productorServicemodel
//                 if (!itemId || !itemModel) continue

//                 const itemMeta =
//                     itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]

//                 if (!itemMeta) continue
//                 if (String(itemMeta.categoryId) !== String(configCategoryId)) continue

//                 entries.push({
//                     itemId,
//                     itemModel,
//                     name: itemMeta.name
//                 })
//             }

//             return entries
//         }

//         const leadBelongsToCategory = (lead, configCategoryId) => {
//             return getLeadCategoryEntries(lead, configCategoryId).length > 0
//         }

//         const getLeadVerifiedAmountForCategory = (lead, configCategoryId) => {
//             let total = 0

//             for (const payment of lead.paymentHistory || []) {
//                 if (!payment.paymentVerified) continue

//                 for (const entry of payment.paymentEntries || []) {
//                     const itemId = entry.productorServiceId
//                         ? String(entry.productorServiceId)
//                         : null
//                     const itemModel = entry.productorServicemodel

//                     if (!itemId || !itemModel) continue

//                     const itemMeta =
//                         itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]

//                     if (!itemMeta) continue
//                     if (String(itemMeta.categoryId) !== String(configCategoryId)) continue

//                     total += Number(entry.receivedAmount || 0)
//                 }
//             }

//             return total
//         }

//         const getClosingSubmittedUserId = (lead) => {
//             const logs = Array.isArray(lead.activityLog) ? lead.activityLog : []

//             const closingLogs = logs.filter((log) => {
//                 const taskById = String(log?.taskBy || "")
//                 const isFollowupClosed = log?.followupClosed === true
//                 return taskById === closingTaskId && isFollowupClosed
//             })

//             if (!closingLogs.length) return null

//             const latestClosingLog = closingLogs[closingLogs.length - 1]
//             const submittedUserId = String(latestClosingLog?.submittedUser || "")

//             return submittedUserId || null
//         }

//         const getLeadAllocationIncentive = ({
//             lead,
//             config,
//             userId,
//             configCategoryId
//         }) => {
//             if (!isLeadEligibleForIncentive(lead)) return 0

//             const closerUserId = getClosingSubmittedUserId(lead)
//             if (!closerUserId) return 0
//             if (String(closerUserId) !== String(userId)) return 0

//             const allocationValues = Array.isArray(config.allocationValues)
//                 ? config.allocationValues
//                 : []

//             if (!allocationValues.length) return 0

//             const leadActivityLogs = Array.isArray(lead.activityLog)
//                 ? lead.activityLog
//                 : []

//             let totalIncentive = 0

//             let baseAmount = 0
//             if (config.measurementType === "amount") {
//                 if (lead.forcefullyClosedTarget === true) {
//                     baseAmount = Number(lead.netAmount || 0)
//                 } else {
//                     baseAmount = getLeadVerifiedAmountForCategory(lead, configCategoryId)
//                 }

//                 if (baseAmount <= 0) return 0
//             }

//             for (const log of leadActivityLogs) {
//                 const taskById = String(log?.taskBy || "")
//                 const submittedUserId = String(log?.submittedUser || "")
//                 const isFollowupClosed = log?.followupClosed === true

//                 if (!taskById) continue
//                 if (taskById !== closingTaskId) continue
//                 if (!isFollowupClosed) continue
//                 if (submittedUserId !== String(userId)) continue

//                 const matchedAllocation = allocationValues.find(
//                     (alloc) => String(alloc.allocationId) === taskById
//                 )

//                 if (!matchedAllocation) continue

//                 const allocationValue = Number(matchedAllocation.value || 0)
//                 if (allocationValue <= 0) continue

//                 if (config.measurementType === "quantity") {
//                     totalIncentive += allocationValue
//                 } else {
//                     totalIncentive += (allocationValue / 100) * baseAmount
//                 }
//             }

//             return totalIncentive
//         }

//         const userWiseMap = {}

//         for (const config of targetConfigs) {
//             const configCategoryId = String(config.categoryId?._id || config.categoryId)
//             const categoryName = config.categoryId?.category || "Category"

//             const monthlyTargetsForYear = (config.monthlyTargets || []).filter(
//                 (m) => Number(m.year) === yearNumber
//             )

//             const monthlyTargetsToUse =
//                 periodModeValue === "all"
//                     ? monthlyTargetsForYear.filter(
//                         (m) =>
//                             Number(m.month) >= effectiveStartMonthNumber &&
//                             Number(m.month) <= effectiveEndMonthNumber
//                     )
//                     : monthlyTargetsForYear.filter(
//                         (m) => Number(m.month) === effectiveStartMonthNumber
//                     )

//             if (!monthlyTargetsToUse.length) continue

//             const userAccumulator = {}

//             for (const mt of monthlyTargetsToUse) {
//                 for (const userTarget of mt.userTargets || []) {
//                     const userId = String(userTarget.userId?._id || userTarget.userId)
//                     const userName = userTarget.userId?.name || "Unknown User"
//                     const slabs = Array.isArray(userTarget.slabs) ? userTarget.slabs : []

//                     const userMonthlyTarget = slabs.reduce((max, slab) => {
//                         const val = Number(slab?.toValue || 0)
//                         return val > max ? val : max
//                     }, 0)

//                     if (!userAccumulator[userId]) {
//                         userAccumulator[userId] = {
//                             userId,
//                             userName,
//                             totalTarget: 0,
//                             categoryRows: []
//                         }
//                     }

//                     userAccumulator[userId].totalTarget += userMonthlyTarget

//                     userAccumulator[userId].categoryRows.push({
//                         categoryId: configCategoryId,
//                         categoryName,
//                         periodName: config.periodName || "",
//                         month: mt.month,
//                         year: mt.year,
//                         measurementType: config.measurementType,
//                         target: userMonthlyTarget,
//                         slabs
//                     })
//                 }
//             }

//             for (const userId of Object.keys(userAccumulator)) {
//                 const userData = userAccumulator[userId]

//                 if (!userWiseMap[userId]) {
//                     userWiseMap[userId] = {
//                         userId,
//                         userName: userData.userName,
//                         target: 0,
//                         achieved: 0,
//                         balance: 0,
//                         incentive: 0,
//                         categories: []
//                     }
//                 }

//                 userWiseMap[userId].target += userData.totalTarget
//             }

//             for (const mt of monthlyTargetsToUse) {
//                 const targetMonth = Number(mt.month)
//                 const targetYear = Number(mt.year)

//                 const leadsForThisMonth = leads.filter((lead) => {
//                     const { month, year } = getLeadMonthYear(lead)
//                     return Number(month) === targetMonth && Number(year) === targetYear
//                 })

//                 for (const userTarget of mt.userTargets || []) {
//                     const userId = String(userTarget.userId?._id || userTarget.userId)
//                     const slabs = Array.isArray(userTarget.slabs) ? userTarget.slabs : []

//                     const userMonthlyTarget = slabs.reduce((max, slab) => {
//                         const val = Number(slab?.toValue || 0)
//                         return val > max ? val : max
//                     }, 0)

//                     let achievedForMonth = 0
//                     let incentiveForMonth = 0
//                     const monthProductWiseMap = {}

//                     for (const lead of leadsForThisMonth) {
//                         const closerUserId = getClosingSubmittedUserId(lead)
//                         if (!closerUserId) continue
//                         if (String(closerUserId) !== String(userId)) continue
//                         if (!leadBelongsToCategory(lead, configCategoryId)) continue

//                         const categoryLeadItems = getLeadCategoryEntries(
//                             lead,
//                             configCategoryId
//                         )

//                         if (config.measurementType === "amount") {
//                             if (lead.forcefullyClosedTarget === true) {
//                                 const netAmount = Number(lead.netAmount || 0)
//                                 if (netAmount > 0) {
//                                     achievedForMonth += netAmount
//                                 }

//                                 const splitCount = categoryLeadItems.length || 1
//                                 const splitAmount = netAmount / splitCount

//                                 for (const item of categoryLeadItems) {
//                                     const productKey = `${item.itemModel}-${item.itemId}`

//                                     if (!monthProductWiseMap[productKey]) {
//                                         monthProductWiseMap[productKey] = {
//                                             id: item.itemId,
//                                             model: item.itemModel,
//                                             name: item.name,
//                                             achieved: 0,
//                                             incentive: 0
//                                         }
//                                     }

//                                     monthProductWiseMap[productKey].achieved += splitAmount
//                                 }
//                             } else {
//                                 const verifiedAmount = getLeadVerifiedAmountForCategory(
//                                     lead,
//                                     configCategoryId
//                                 )

//                                 if (verifiedAmount > 0) {
//                                     achievedForMonth += verifiedAmount
//                                 }

//                                 for (const payment of lead.paymentHistory || []) {
//                                     if (!payment.paymentVerified) continue

//                                     for (const entry of payment.paymentEntries || []) {
//                                         const itemId = entry.productorServiceId
//                                             ? String(entry.productorServiceId)
//                                             : null
//                                         const itemModel = entry.productorServicemodel

//                                         if (!itemId || !itemModel) continue

//                                         const itemMeta =
//                                             itemModel === "Product"
//                                                 ? productMap[itemId]
//                                                 : serviceMap[itemId]

//                                         if (!itemMeta) continue
//                                         if (String(itemMeta.categoryId) !== String(configCategoryId))
//                                             continue

//                                         const productKey = `${itemModel}-${itemId}`

//                                         if (!monthProductWiseMap[productKey]) {
//                                             monthProductWiseMap[productKey] = {
//                                                 id: itemId,
//                                                 model: itemModel,
//                                                 name: itemMeta.name,
//                                                 achieved: 0,
//                                                 incentive: 0
//                                             }
//                                         }

//                                         monthProductWiseMap[productKey].achieved += Number(
//                                             entry.receivedAmount || 0
//                                         )
//                                     }
//                                 }
//                             }
//                         } else {
//                             if (lead.forcefullyClosedTarget === true) {
//                                 achievedForMonth += 1

//                                 for (const item of categoryLeadItems) {
//                                     const productKey = `${item.itemModel}-${item.itemId}`

//                                     if (!monthProductWiseMap[productKey]) {
//                                         monthProductWiseMap[productKey] = {
//                                             id: item.itemId,
//                                             model: item.itemModel,
//                                             name: item.name,
//                                             achieved: 0,
//                                             incentive: 0
//                                         }
//                                     }

//                                     monthProductWiseMap[productKey].achieved += 1
//                                 }
//                             } else {
//                                 const payments = lead.paymentHistory || []
//                                 if (!payments.length) continue

//                                 const allVerified = payments.every((p) => p.paymentVerified)

//                                 let totalReceivedForCategory = 0
//                                 const leadItemKeys = new Set()
//                                 const leadItemMap = {}

//                                 for (const payment of payments) {
//                                     for (const entry of payment.paymentEntries || []) {
//                                         const itemId = entry.productorServiceId
//                                             ? String(entry.productorServiceId)
//                                             : null
//                                         const itemModel = entry.productorServicemodel

//                                         if (!itemId || !itemModel) continue

//                                         const itemMeta =
//                                             itemModel === "Product"
//                                                 ? productMap[itemId]
//                                                 : serviceMap[itemId]

//                                         if (!itemMeta) continue
//                                         if (String(itemMeta.categoryId) !== String(configCategoryId))
//                                             continue

//                                         totalReceivedForCategory += Number(entry.receivedAmount || 0)

//                                         const itemKey = `${itemModel}-${itemId}`
//                                         leadItemKeys.add(itemKey)

//                                         if (!leadItemMap[itemKey]) {
//                                             leadItemMap[itemKey] = {
//                                                 id: itemId,
//                                                 model: itemModel,
//                                                 name: itemMeta.name
//                                             }
//                                         }
//                                     }
//                                 }

//                                 if (
//                                     allVerified &&
//                                     totalReceivedForCategory >= Number(lead.netAmount || 0)
//                                 ) {
//                                     achievedForMonth += 1

//                                     for (const itemKey of leadItemKeys) {
//                                         const item = leadItemMap[itemKey]

//                                         if (!monthProductWiseMap[itemKey]) {
//                                             monthProductWiseMap[itemKey] = {
//                                                 id: item.id,
//                                                 model: item.model,
//                                                 name: item.name,
//                                                 achieved: 0,
//                                                 incentive: 0
//                                             }
//                                         }

//                                         monthProductWiseMap[itemKey].achieved += 1
//                                     }
//                                 }
//                             }
//                         }

//                         const leadIncentive = getLeadAllocationIncentive({
//                             lead,
//                             config,
//                             userId,
//                             configCategoryId
//                         })

//                         incentiveForMonth += leadIncentive

//                         const productKeys = Object.keys(monthProductWiseMap)
//                         if (
//                             config.measurementType === "amount" &&
//                             productKeys.length > 0 &&
//                             leadIncentive > 0
//                         ) {
//                             const totalAchievedForProducts = productKeys.reduce((sum, key) => {
//                                 return sum + Number(monthProductWiseMap[key]?.achieved || 0)
//                             }, 0)

//                             if (totalAchievedForProducts > 0) {
//                                 for (const key of productKeys) {
//                                     const productAchieved = Number(
//                                         monthProductWiseMap[key]?.achieved || 0
//                                     )
//                                     const ratio = productAchieved / totalAchievedForProducts
//                                     monthProductWiseMap[key].incentive += leadIncentive * ratio
//                                 }
//                             }
//                         }
//                     }

//                     userWiseMap[userId].achieved += achievedForMonth
//                     userWiseMap[userId].incentive += incentiveForMonth

//                     userWiseMap[userId].categories.push({
//                         categoryId: configCategoryId,
//                         categoryName,
//                         periodName: config.periodName || "",
//                         month: mt.month,
//                         year: mt.year,
//                         measurementType: config.measurementType,
//                         target: userMonthlyTarget,
//                         slabs,
//                         achieved: achievedForMonth,
//                         balance: userMonthlyTarget - achievedForMonth,
//                         incentive: incentiveForMonth,
//                         products: Object.values(monthProductWiseMap)
//                     })
//                 }
//             }
//         }

//         for (const userId of Object.keys(userWiseMap)) {
//             userWiseMap[userId].balance =
//                 userWiseMap[userId].target - userWiseMap[userId].achieved
//         }

//         const userWiseResults = Object.values(userWiseMap)

//         const globalTarget = userWiseResults.reduce((sum, item) => sum + item.target, 0)
//         const globalAchieved = userWiseResults.reduce(
//             (sum, item) => sum + item.achieved,
//             0
//         )
//         const globalIncentive = userWiseResults.reduce(
//             (sum, item) => sum + item.incentive,
//             0
//         )

//         const selectedPeriodName =
//             userWiseResults?.[0]?.categories?.[0]?.periodName || ""

//         const measurementTypes = [
//             ...new Set(
//                 targetConfigs
//                     .map((item) => String(item.measurementType || "").trim())
//                     .filter(Boolean)
//             )
//         ]

//         const selectedMeasurementType = targetConfigs?.[0]?.measurementType || ""

//         return res.json({
//             success: true,
//             data: {
//                 userWiseResults,
//                 summary: {
//                     target: globalTarget,
//                     achieved: globalAchieved,
//                     balance: globalTarget - globalAchieved,
//                     incentive: globalIncentive
//                 },
//                 periods: allPeriods,
//                 selectedPeriodName,
//                 measurementTypes,
//                 selectedMeasurementType,
//                 selectedMonth:
//                     periodModeValue === "all" ? monthNumber : effectiveStartMonthNumber,
//                 selectedYear: yearNumber
//             }
//         })
//     } catch (error) {
//         console.log("error", error.message)
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         })
//     }
// }

// export const gettargetResult = async (req, res) => {
//   try {
//     const { month, year, periodMode, selectedBranch } = req.query

//     const monthNumber = Number(month)
//     const yearNumber = Number(year)
//     const periodModeValue = String(periodMode || "all").toLowerCase().trim()

//     if (!monthNumber || !yearNumber || !selectedBranch) {
//       return res.status(400).json({
//         success: false,
//         message: "month, year and selectedBranch are required",
//       })
//     }

//     const startOfMonth = new Date(yearNumber, monthNumber - 1, 1)
//     const endOfMonth = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999)

//     const configQuery = {
//       branch: selectedBranch,
//       startDate: { $lte: endOfMonth },
//       endDate: { $gte: startOfMonth },
//       "monthlyTargets.year": yearNumber,
//     }

//     const [closingTask, allTargetConfigs, rawTargetConfigs] = await Promise.all([
//       Task.findOne({ taskName: "Follow-Up Closing" })
//         .select("_id taskName")
//         .lean(),

//       TargetConfiguration.find({ branch: selectedBranch, "monthlyTargets.year": yearNumber })
//         .select("periodName measurementType monthlyTargets.month monthlyTargets.year")
//         .lean(),

//       TargetConfiguration.find(configQuery)
//         .select(`
//           periodName branch startDate endDate categoryId categoryName measurementType allocationValues
//           monthlyTargets.month monthlyTargets.year monthlyTargets.userTargets.userId monthlyTargets.userTargets.slabs
//         `)
//         .populate("categoryId", "category")
//         .populate("monthlyTargets.userTargets.userId", "name email")
//         .lean(),
//     ])

//     if (!closingTask) {
//       return res.status(404).json({
//         success: false,
//         message: "Closing task not found",
//       })
//     }

//     const closingTaskId = String(closingTask._id)

//     const allPeriods = [
//       ...new Set(
//         allTargetConfigs
//           .map((item) => String(item.periodName || "").trim())
//           .filter(Boolean)
//       ),
//     ]

//     const configHasMonthYear = (config, m, y) => {
//       return (
//         Array.isArray(config.monthlyTargets) &&
//         config.monthlyTargets.some(
//           (mt) => Number(mt.month) === Number(m) && Number(mt.year) === Number(y)
//         )
//       )
//     }

//     let targetConfigs = rawTargetConfigs.filter((config) => {
//       if (!Array.isArray(config.monthlyTargets)) return false

//       if (periodModeValue === "all") {
//         return configHasMonthYear(config, monthNumber, yearNumber)
//       }

//       const selectedPeriodMonth = Number(periodModeValue)
//       if (!selectedPeriodMonth) return false

//       return configHasMonthYear(config, selectedPeriodMonth, yearNumber)
//     })

//     if (!targetConfigs.length) {
//       return res.json({
//         success: true,
//         data: {
//           userWiseResults: [],
//           summary: {
//             target: 0,
//             achieved: 0,
//             balance: 0,
//             incentive: 0,
//           },
//           periods: allPeriods,
//           measurementTypes: [],
//           selectedMeasurementType: "",
//           selectedPeriodName: "",
//           selectedMonth: monthNumber,
//           selectedYear: yearNumber,
//         },
//       })
//     }

//     let effectiveStartMonthNumber
//     let effectiveEndMonthNumber

//     if (periodModeValue === "all") {
//       let minMonth = Infinity
//       let maxMonth = -Infinity

//       for (const cfg of targetConfigs) {
//         for (const mt of cfg.monthlyTargets || []) {
//           if (Number(mt.year) !== yearNumber) continue
//           const mNum = Number(mt.month)
//           if (!mNum) continue
//           if (mNum < minMonth) minMonth = mNum
//           if (mNum > maxMonth) maxMonth = mNum
//         }
//       }

//       if (!isFinite(minMonth) || !isFinite(maxMonth)) {
//         minMonth = monthNumber
//         maxMonth = monthNumber
//       }

//       effectiveStartMonthNumber = minMonth
//       effectiveEndMonthNumber = maxMonth
//     } else {
//       const selectedPeriodMonth = Number(periodModeValue)
//       effectiveStartMonthNumber = selectedPeriodMonth
//       effectiveEndMonthNumber = selectedPeriodMonth
//     }

//     const effectiveStartOfMonth = new Date(yearNumber, effectiveStartMonthNumber - 1, 1)
//     const effectiveEndOfMonth = new Date(
//       yearNumber,
//       effectiveEndMonthNumber,
//       0,
//       23,
//       59,
//       59,
//       999
//     )

//     const leads = await LeadMaster.find({
//       branch: selectedBranch,
//       leadDate: { $gte: effectiveStartOfMonth, $lte: effectiveEndOfMonth },
//     })
//       .select(`
//         _id branch leadDate netAmount balanceAmount forcefullyClosedTarget
//         leadFor.productorServiceId leadFor.productorServicemodel
//         paymentHistory.paymentVerified
//         paymentHistory.paymentEntries.productorServiceId
//         paymentHistory.paymentEntries.productorServicemodel
//         paymentHistory.paymentEntries.receivedAmount
//         activityLog.taskBy activityLog.followupClosed activityLog.submittedUser
//       `)
//       .lean()

//     const productIds = new Set()
//     const serviceIds = new Set()

//     for (const lead of leads) {
//       for (const item of lead.leadFor || []) {
//         if (!item.productorServiceId || !item.productorServicemodel) continue

//         if (item.productorServicemodel === "Product") {
//           productIds.add(String(item.productorServiceId))
//         } else if (item.productorServicemodel === "Service") {
//           serviceIds.add(String(item.productorServiceId))
//         }
//       }

//       for (const payment of lead.paymentHistory || []) {
//         for (const entry of payment.paymentEntries || []) {
//           if (!entry.productorServiceId || !entry.productorServicemodel) continue

//           if (entry.productorServicemodel === "Product") {
//             productIds.add(String(entry.productorServiceId))
//           } else if (entry.productorServicemodel === "Service") {
//             serviceIds.add(String(entry.productorServiceId))
//           }
//         }
//       }
//     }

//     const [products, services] = await Promise.all([
//       Product.find({ _id: { $in: [...productIds] } })
//         .select("productName name selected.category_id")
//         .lean(),

//       Service.find({ _id: { $in: [...serviceIds] } })
//         .select("serviceName name selected.category_id category_id categoryId categoryName")
//         .lean(),
//     ])

//     const productMap = {}
//     const serviceMap = {}

//     for (const item of products) {
//       const selectedRow = Array.isArray(item.selected) ? item.selected[0] : null
//       const categoryId = selectedRow?.category_id ? String(selectedRow.category_id) : ""

//       productMap[String(item._id)] = {
//         name: item.productName || item.name || "Product",
//         categoryId,
//       }
//     }

//     for (const item of services) {
//       const selectedRow = Array.isArray(item.selected) ? item.selected[0] : null
//       const categoryId = selectedRow?.category_id
//         ? String(selectedRow.category_id)
//         : item.category_id
//         ? String(item.category_id)
//         : item.categoryId
//         ? String(item.categoryId)
//         : ""

//       serviceMap[String(item._id)] = {
//         name: item.serviceName || item.name || "Service",
//         categoryId,
//       }
//     }

//     const isLeadFullyVerified = (lead) => {
//       const payments = lead.paymentHistory || []
//       if (!payments.length) return false
//       return payments.every((p) => p.paymentVerified)
//     }

//     const getClosingSubmittedUserId = (lead) => {
//       const logs = Array.isArray(lead.activityLog) ? lead.activityLog : []

//       for (let i = logs.length - 1; i >= 0; i--) {
//         const log = logs[i]
//         if (
//           String(log?.taskBy || "") === closingTaskId &&
//           log?.followupClosed === true &&
//           String(log?.submittedUser || "")
//         ) {
//           return String(log.submittedUser)
//         }
//       }

//       return null
//     }

//     const leadMetaMap = new Map()
//     const leadsByMonthYear = new Map()

//     for (const lead of leads) {
//       const d = new Date(lead.leadDate)
//       const leadMonth = d.getMonth() + 1
//       const leadYear = d.getFullYear()
//       const monthKey = `${leadYear}-${leadMonth}`

//       if (!leadsByMonthYear.has(monthKey)) {
//         leadsByMonthYear.set(monthKey, [])
//       }
//       leadsByMonthYear.get(monthKey).push(lead)

//       const fullyVerified = isLeadFullyVerified(lead)
//       const eligibleForIncentive =
//         lead.forcefullyClosedTarget === true ||
//         Number(lead.balanceAmount || 0) === 0 ||
//         fullyVerified

//       const categoryEntriesMap = {}
//       const verifiedAmountByCategory = {}

//       for (const item of lead.leadFor || []) {
//         const itemId = item.productorServiceId ? String(item.productorServiceId) : null
//         const itemModel = item.productorServicemodel
//         if (!itemId || !itemModel) continue

//         const itemMeta = itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]
//         if (!itemMeta?.categoryId) continue

//         const catId = String(itemMeta.categoryId)
//         if (!categoryEntriesMap[catId]) categoryEntriesMap[catId] = []

//         categoryEntriesMap[catId].push({
//           itemId,
//           itemModel,
//           name: itemMeta.name,
//         })
//       }

//       for (const payment of lead.paymentHistory || []) {
//         if (!payment.paymentVerified) continue

//         for (const entry of payment.paymentEntries || []) {
//           const itemId = entry.productorServiceId ? String(entry.productorServiceId) : null
//           const itemModel = entry.productorServicemodel
//           if (!itemId || !itemModel) continue

//           const itemMeta = itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]
//           if (!itemMeta?.categoryId) continue

//           const catId = String(itemMeta.categoryId)
//           verifiedAmountByCategory[catId] =
//             Number(verifiedAmountByCategory[catId] || 0) + Number(entry.receivedAmount || 0)
//         }
//       }

//       leadMetaMap.set(String(lead._id), {
//         closerUserId: getClosingSubmittedUserId(lead),
//         eligibleForIncentive,
//         categoryEntriesMap,
//         verifiedAmountByCategory,
//       })
//     }

//     const getLeadCategoryEntries = (lead, configCategoryId) => {
//       const meta = leadMetaMap.get(String(lead._id))
//       return meta?.categoryEntriesMap?.[String(configCategoryId)] || []
//     }

//     const leadBelongsToCategory = (lead, configCategoryId) => {
//       return getLeadCategoryEntries(lead, configCategoryId).length > 0
//     }

//     const getLeadVerifiedAmountForCategory = (lead, configCategoryId) => {
//       const meta = leadMetaMap.get(String(lead._id))
//       return Number(meta?.verifiedAmountByCategory?.[String(configCategoryId)] || 0)
//     }

//     const getLeadAllocationIncentive = ({ lead, config, userId, configCategoryId }) => {
//       const meta = leadMetaMap.get(String(lead._id))
//       if (!meta?.eligibleForIncentive) return 0
//       if (!meta.closerUserId) return 0
//       if (String(meta.closerUserId) !== String(userId)) return 0

//       const allocationValues = Array.isArray(config.allocationValues)
//         ? config.allocationValues
//         : []

//       if (!allocationValues.length) return 0

//       let totalIncentive = 0
//       let baseAmount = 0

//       if (config.measurementType === "amount") {
//         if (lead.forcefullyClosedTarget === true) {
//           baseAmount = Number(lead.netAmount || 0)
//         } else {
//           baseAmount = getLeadVerifiedAmountForCategory(lead, configCategoryId)
//         }

//         if (baseAmount <= 0) return 0
//       }

//       for (const log of lead.activityLog || []) {
//         const taskById = String(log?.taskBy || "")
//         const submittedUserId = String(log?.submittedUser || "")
//         const isFollowupClosed = log?.followupClosed === true

//         if (!taskById) continue
//         if (taskById !== closingTaskId) continue
//         if (!isFollowupClosed) continue
//         if (submittedUserId !== String(userId)) continue

//         const matchedAllocation = allocationValues.find(
//           (alloc) => String(alloc.allocationId) === taskById
//         )

//         if (!matchedAllocation) continue

//         const allocationValue = Number(matchedAllocation.value || 0)
//         if (allocationValue <= 0) continue

//         if (config.measurementType === "quantity") {
//           totalIncentive += allocationValue
//         } else {
//           totalIncentive += (allocationValue / 100) * baseAmount
//         }
//       }

//       return totalIncentive
//     }

//     const userWiseMap = {}

//     for (const config of targetConfigs) {
//       const configCategoryId = String(config.categoryId?._id || config.categoryId)
//       const categoryName = config.categoryId?.category || config.categoryName || "Category"

//       const monthlyTargetsForYear = (config.monthlyTargets || []).filter(
//         (m) => Number(m.year) === yearNumber
//       )

//       const monthlyTargetsToUse =
//         periodModeValue === "all"
//           ? monthlyTargetsForYear.filter(
//               (m) =>
//                 Number(m.month) >= effectiveStartMonthNumber &&
//                 Number(m.month) <= effectiveEndMonthNumber
//             )
//           : monthlyTargetsForYear.filter(
//               (m) => Number(m.month) === effectiveStartMonthNumber
//             )

//       if (!monthlyTargetsToUse.length) continue

//       for (const mt of monthlyTargetsToUse) {
//         for (const userTarget of mt.userTargets || []) {
//           const userId = String(userTarget.userId?._id || userTarget.userId)
//           const userName = userTarget.userId?.name || "Unknown User"
//           const slabs = Array.isArray(userTarget.slabs) ? userTarget.slabs : []

//           const userMonthlyTarget = slabs.reduce((max, slab) => {
//             const val = Number(slab?.toValue || 0)
//             return val > max ? val : max
//           }, 0)

//           if (!userWiseMap[userId]) {
//             userWiseMap[userId] = {
//               userId,
//               userName,
//               target: 0,
//               achieved: 0,
//               balance: 0,
//               incentive: 0,
//               categories: [],
//             }
//           }

//           userWiseMap[userId].target += userMonthlyTarget
//         }
//       }

//       for (const mt of monthlyTargetsToUse) {
//         const targetMonth = Number(mt.month)
//         const targetYear = Number(mt.year)
//         const leadsForThisMonth = leadsByMonthYear.get(`${targetYear}-${targetMonth}`) || []

//         for (const userTarget of mt.userTargets || []) {
//           const userId = String(userTarget.userId?._id || userTarget.userId)
//           const slabs = Array.isArray(userTarget.slabs) ? userTarget.slabs : []

//           const userMonthlyTarget = slabs.reduce((max, slab) => {
//             const val = Number(slab?.toValue || 0)
//             return val > max ? val : max
//           }, 0)

//           let achievedForMonth = 0
//           let incentiveForMonth = 0
//           const monthProductWiseMap = {}

//           for (const lead of leadsForThisMonth) {
//             const meta = leadMetaMap.get(String(lead._id))
//             if (!meta?.closerUserId) continue
//             if (String(meta.closerUserId) !== String(userId)) continue
//             if (!leadBelongsToCategory(lead, configCategoryId)) continue

//             const categoryLeadItems = getLeadCategoryEntries(lead, configCategoryId)

//             if (config.measurementType === "amount") {
//               if (lead.forcefullyClosedTarget === true) {
//                 const netAmount = Number(lead.netAmount || 0)
//                 if (netAmount > 0) {
//                   achievedForMonth += netAmount
//                 }

//                 const splitCount = categoryLeadItems.length || 1
//                 const splitAmount = netAmount / splitCount

//                 for (const item of categoryLeadItems) {
//                   const productKey = `${item.itemModel}-${item.itemId}`

//                   if (!monthProductWiseMap[productKey]) {
//                     monthProductWiseMap[productKey] = {
//                       id: item.itemId,
//                       model: item.itemModel,
//                       name: item.name,
//                       achieved: 0,
//                       incentive: 0,
//                     }
//                   }

//                   monthProductWiseMap[productKey].achieved += splitAmount
//                 }
//               } else {
//                 const verifiedAmount = getLeadVerifiedAmountForCategory(lead, configCategoryId)

//                 if (verifiedAmount > 0) {
//                   achievedForMonth += verifiedAmount
//                 }

//                 for (const payment of lead.paymentHistory || []) {
//                   if (!payment.paymentVerified) continue

//                   for (const entry of payment.paymentEntries || []) {
//                     const itemId = entry.productorServiceId
//                       ? String(entry.productorServiceId)
//                       : null
//                     const itemModel = entry.productorServicemodel
//                     if (!itemId || !itemModel) continue

//                     const itemMeta =
//                       itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]

//                     if (!itemMeta) continue
//                     if (String(itemMeta.categoryId) !== String(configCategoryId)) continue

//                     const productKey = `${itemModel}-${itemId}`

//                     if (!monthProductWiseMap[productKey]) {
//                       monthProductWiseMap[productKey] = {
//                         id: itemId,
//                         model: itemModel,
//                         name: itemMeta.name,
//                         achieved: 0,
//                         incentive: 0,
//                       }
//                     }

//                     monthProductWiseMap[productKey].achieved += Number(
//                       entry.receivedAmount || 0
//                     )
//                   }
//                 }
//               }
//             } else {
//               if (lead.forcefullyClosedTarget === true) {
//                 achievedForMonth += 1

//                 for (const item of categoryLeadItems) {
//                   const productKey = `${item.itemModel}-${item.itemId}`

//                   if (!monthProductWiseMap[productKey]) {
//                     monthProductWiseMap[productKey] = {
//                       id: item.itemId,
//                       model: item.itemModel,
//                       name: item.name,
//                       achieved: 0,
//                       incentive: 0,
//                     }
//                   }

//                   monthProductWiseMap[productKey].achieved += 1
//                 }
//               } else {
//                 const payments = lead.paymentHistory || []
//                 if (!payments.length) continue

//                 const allVerified = payments.every((p) => p.paymentVerified)
//                 let totalReceivedForCategory = 0
//                 const leadItemKeys = new Set()
//                 const leadItemMap = {}

//                 for (const payment of payments) {
//                   for (const entry of payment.paymentEntries || []) {
//                     const itemId = entry.productorServiceId
//                       ? String(entry.productorServiceId)
//                       : null
//                     const itemModel = entry.productorServicemodel
//                     if (!itemId || !itemModel) continue

//                     const itemMeta =
//                       itemModel === "Product" ? productMap[itemId] : serviceMap[itemId]

//                     if (!itemMeta) continue
//                     if (String(itemMeta.categoryId) !== String(configCategoryId)) continue

//                     totalReceivedForCategory += Number(entry.receivedAmount || 0)

//                     const itemKey = `${itemModel}-${itemId}`
//                     leadItemKeys.add(itemKey)

//                     if (!leadItemMap[itemKey]) {
//                       leadItemMap[itemKey] = {
//                         id: itemId,
//                         model: itemModel,
//                         name: itemMeta.name,
//                       }
//                     }
//                   }
//                 }

//                 if (
//                   allVerified &&
//                   totalReceivedForCategory >= Number(lead.netAmount || 0)
//                 ) {
//                   achievedForMonth += 1

//                   for (const itemKey of leadItemKeys) {
//                     const item = leadItemMap[itemKey]

//                     if (!monthProductWiseMap[itemKey]) {
//                       monthProductWiseMap[itemKey] = {
//                         id: item.id,
//                         model: item.model,
//                         name: item.name,
//                         achieved: 0,
//                         incentive: 0,
//                       }
//                     }

//                     monthProductWiseMap[itemKey].achieved += 1
//                   }
//                 }
//               }
//             }

//             const leadIncentive = getLeadAllocationIncentive({
//               lead,
//               config,
//               userId,
//               configCategoryId,
//             })

//             incentiveForMonth += leadIncentive

//             const productKeys = Object.keys(monthProductWiseMap)

//             if (
//               config.measurementType === "amount" &&
//               productKeys.length > 0 &&
//               leadIncentive > 0
//             ) {
//               const totalAchievedForProducts = productKeys.reduce((sum, key) => {
//                 return sum + Number(monthProductWiseMap[key]?.achieved || 0)
//               }, 0)

//               if (totalAchievedForProducts > 0) {
//                 for (const key of productKeys) {
//                   const productAchieved = Number(
//                     monthProductWiseMap[key]?.achieved || 0
//                   )
//                   const ratio = productAchieved / totalAchievedForProducts
//                   monthProductWiseMap[key].incentive += leadIncentive * ratio
//                 }
//               }
//             }
//           }

//           userWiseMap[userId].achieved += achievedForMonth
//           userWiseMap[userId].incentive += incentiveForMonth

//           userWiseMap[userId].categories.push({
//             categoryId: configCategoryId,
//             categoryName,
//             periodName: config.periodName || "",
//             month: mt.month,
//             year: mt.year,
//             measurementType: config.measurementType,
//             target: userMonthlyTarget,
//             slabs,
//             achieved: achievedForMonth,
//             balance: userMonthlyTarget - achievedForMonth,
//             incentive: incentiveForMonth,
//             products: Object.values(monthProductWiseMap),
//           })
//         }
//       }
//     }

//     for (const userId of Object.keys(userWiseMap)) {
//       userWiseMap[userId].balance =
//         userWiseMap[userId].target - userWiseMap[userId].achieved
//     }

//     const userWiseResults = Object.values(userWiseMap)

//     const globalTarget = userWiseResults.reduce((sum, item) => sum + item.target, 0)
//     const globalAchieved = userWiseResults.reduce((sum, item) => sum + item.achieved, 0)
//     const globalIncentive = userWiseResults.reduce((sum, item) => sum + item.incentive, 0)

//     const selectedPeriodName = userWiseResults?.[0]?.categories?.[0]?.periodName || ""

//     const measurementTypes = [
//       ...new Set(
//         targetConfigs
//           .map((item) => String(item.measurementType || "").trim())
//           .filter(Boolean)
//       ),
//     ]

//     const selectedMeasurementType = targetConfigs?.[0]?.measurementType || ""

//     return res.json({
//       success: true,
//       data: {
//         userWiseResults,
//         summary: {
//           target: globalTarget,
//           achieved: globalAchieved,
//           balance: globalTarget - globalAchieved,
//           incentive: globalIncentive,
//         },
//         periods: allPeriods,
//         selectedPeriodName,
//         measurementTypes,
//         selectedMeasurementType,
//         selectedMonth:
//           periodModeValue === "all" ? monthNumber : effectiveStartMonthNumber,
//         selectedYear: yearNumber,
//       },
//     })
//   } catch (error) {
//     console.log("error", error.message)
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     })
//   }
// }
///////////////////


export const gettargetResult = async (req, res) => {
  try {
    const { month, year, periodMode = "all", selectedBranch } = req.query;

    const monthNumber = Number(month);
    const yearNumber = Number(year);
    const mode = String(periodMode).trim().toLowerCase();

    if (
      !Number.isInteger(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12 ||
      !Number.isInteger(yearNumber) ||
      !selectedBranch
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid month, year and selectedBranch are required",
      });
    }

    const objects = (value) => {
      if (!Array.isArray(value)) return [];

      return value.filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          typeof item === "object" &&
          !Array.isArray(item)
      );
    };

    const num = (value) => Number(value) || 0;

    const getMonthKey = (yearValue, monthValue) => {
      return `${yearValue}-${monthValue}`;
    };

    const getMonthRange = (yearValue, startMonth, endMonth) => {
      return {
        $gte: new Date(Date.UTC(yearValue, startMonth - 1, 1)),
        $lte: new Date(
          Date.UTC(yearValue, endMonth, 0, 23, 59, 59, 999)
        ),
      };
    };

    const [allTargetConfigs, closingTask] = await Promise.all([
      TargetConfiguration.find({
        branch: selectedBranch,
      })
        .select(`
          periodName branch startDate endDate categoryId categoryName
          measurementType allocationValues monthlyTargets
        `)
        .populate("categoryId", "category")
        .populate("monthlyTargets.userTargets.userId", "name email")
        .lean(),

      Task.findOne({
        taskName: "Follow-Up Closing",
      })
        .select("_id")
        .lean(),
    ]);

    const allPeriods = [
      ...new Set(
        allTargetConfigs
          .map((item) => String(item.periodName || "").trim())
          .filter(Boolean)
      ),
    ];

    const selectedMonth =
      mode === "all" ? monthNumber : Number(mode);

    if (
      !Number.isInteger(selectedMonth) ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "periodMode must be all or a valid month number",
      });
    }

    const hasSelectedMonth = (config) => {
      return objects(config.monthlyTargets).some(
        (monthlyTarget) =>
          num(monthlyTarget.month) === selectedMonth &&
          num(monthlyTarget.year) === yearNumber
      );
    };

    const requestedStart = new Date(
      Date.UTC(yearNumber, selectedMonth - 1, 1)
    );

    const requestedEnd = new Date(
      Date.UTC(yearNumber, selectedMonth, 0, 23, 59, 59, 999)
    );

    const targetConfigs = allTargetConfigs.filter((config) => {
      const configStart = new Date(config.startDate);
      const configEnd = new Date(config.endDate);

      const overlapsRequestedMonth =
        configStart <= requestedEnd && configEnd >= requestedStart;

      return overlapsRequestedMonth && hasSelectedMonth(config);
    });

    if (!targetConfigs.length) {
      return res.json({
        success: true,
        data: {
          userWiseResults: [],
          summary: {
            target: 0,
            achieved: 0,
            balance: 0,
            incentive: 0,
          },
          periods: allPeriods,
          measurementTypes: [],
          selectedMeasurementType: "",
          selectedPeriodName: "",
          selectedMonth,
          selectedYear: yearNumber,
        },
      });
    }

    const activeMonths = [
      ...new Set(
        targetConfigs.flatMap((config) =>
          objects(config.monthlyTargets)
            .filter(
              (monthlyTarget) =>
                num(monthlyTarget.year) === yearNumber
            )
            .map((monthlyTarget) => num(monthlyTarget.month))
        )
      ),
    ].filter(Boolean);

    const startMonth = Math.min(...activeMonths);
    const endMonth = Math.max(...activeMonths);

    const leads = await LeadMaster.find({
      leadBranch: selectedBranch,
      leadDate: getMonthRange(yearNumber, startMonth, endMonth),
    })
      .select(`
        leadId leadDate netAmount balanceAmount forcefullyClosedTarget
        leadFor paymentHistory activityLog
      `)
      .lean();

    const closingTaskId = String(closingTask?._id || "");


    const productIds = new Set();
    const serviceIds = new Set();

    for (const lead of leads) {
      const leadItems = objects(lead.leadFor);

      const paymentEntries = objects(lead.paymentHistory).flatMap(
        (payment) => objects(payment.paymentEntries)
      );

      const allItems = [...leadItems, ...paymentEntries];

      for (const item of allItems) {
        if (!item?.productorServiceId) continue;

        if (item.productorServicemodel === "Product") {
          productIds.add(String(item.productorServiceId));
        }

        if (item.productorServicemodel === "Service") {
          serviceIds.add(String(item.productorServiceId));
        }
      }
    }

    const [products, services] = await Promise.all([
      Product.find({
        _id: { $in: [...productIds] },
      })
        .select("productName name selected.category_id")
        .lean(),

      Service.find({
        _id: { $in: [...serviceIds] },
      })
        .select(`
          serviceName name selected.category_id
          category_id categoryId
        `)
        .lean(),
    ]);

    const productMap = new Map(
      products.map((product) => {
        const categoryId = product?.selected?.[0]?.category_id
          ? String(product.selected[0].category_id)
          : "";

        return [
          String(product._id),
          {
            name: product.productName || product.name || "Product",
            categoryId,
          },
        ];
      })
    );

    const serviceMap = new Map(
      services.map((service) => {
        const categoryId = service?.selected?.[0]?.category_id
          ? String(service.selected[0].category_id)
          : service?.category_id
            ? String(service.category_id)
            : service?.categoryId
              ? String(service.categoryId)
              : "";

        return [
          String(service._id),
          {
            name: service.serviceName || service.name || "Service",
            categoryId,
          },
        ];
      })
    );

    const getItemMeta = (item) => {
      if (!item?.productorServiceId) return null;

      const itemId = String(item.productorServiceId);

      if (item.productorServicemodel === "Product") {
        return productMap.get(itemId) || null;
      }

      if (item.productorServicemodel === "Service") {
        return serviceMap.get(itemId) || null;
      }

      return null;
    };

    const getLeadCategoryItems = (lead, configCategoryId) => {
      const entries = [];

      for (const item of objects(lead.leadFor)) {
        const meta = getItemMeta(item);

        if (!meta?.categoryId) continue;

        if (String(meta.categoryId) !== String(configCategoryId)) {
          continue;
        }

        entries.push({
          id: String(item.productorServiceId),
          model: item.productorServicemodel,
          name: meta.name,
        });
      }

      return entries;
    };

    const getVerifiedAmountForCategory = (lead, configCategoryId) => {
      let total = 0;

      for (const payment of objects(lead.paymentHistory)) {
        if (payment.paymentVerified !== true) continue;

        for (const entry of objects(payment.paymentEntries)) {
          const meta = getItemMeta(entry);

          if (!meta?.categoryId) continue;

          if (String(meta.categoryId) !== String(configCategoryId)) {
            continue;
          }

          total += num(entry.receivedAmount);
        }
      }

      return total;
    };

    const isLeadFullyVerified = (lead) => {
      const payments = objects(lead.paymentHistory);

      return (
        payments.length > 0 &&
        payments.every(
          (payment) => payment.paymentVerified === true
        )
      );
    };

    const isLeadEligibleForIncentive = (lead) => {
      return (
        lead.forcefullyClosedTarget === true ||
        num(lead.balanceAmount) === 0 ||
        isLeadFullyVerified(lead)
      );
    };

    const getLatestClosingUserId = (lead) => {
      const closingLogs = objects(lead.activityLog).filter(
        (log) =>
          String(log.taskBy || "") === closingTaskId &&
          log.followupClosed === true &&
          log.submittedUser
      );

      const latestClosingLog = closingLogs.at(-1);

      return latestClosingLog?.submittedUser
        ? String(latestClosingLog.submittedUser)
        : null;
    };

    const leadsByMonth = new Map();

    for (const lead of leads) {
      const date = new Date(lead.leadDate);

      if (Number.isNaN(date.getTime())) continue;

      const leadMonth = date.getUTCMonth() + 1;
      const leadYear = date.getUTCFullYear();

      const monthKey = getMonthKey(leadYear, leadMonth);

      if (!leadsByMonth.has(monthKey)) {
        leadsByMonth.set(monthKey, []);
      }

      leadsByMonth.get(monthKey).push(lead);
    }

    const userWiseMap = new Map();

    const ensureUser = (userId, userName = "Unknown User") => {
      const id = String(userId);

      if (!userWiseMap.has(id)) {
        userWiseMap.set(id, {
          userId: id,
          userName,
          target: 0,
          achieved: 0,
          balance: 0,
          incentive: 0,
          categories: [],
        });
      }

      return userWiseMap.get(id);
    };

    // Prevents duplicate incentive for the same:
    // configuration + lead + task + user.
    const awardedIncentives = new Set();

    for (const config of targetConfigs) {
      const configCategoryId = String(
        config.categoryId?._id || config.categoryId || ""
      );

      if (!configCategoryId) continue;

      const categoryName =
        config.categoryId?.category ||
        config.categoryName ||
        "Category";

      const monthlyTargets = objects(config.monthlyTargets).filter(
        (monthlyTarget) =>
          num(monthlyTarget.year) === yearNumber &&
          activeMonths.includes(num(monthlyTarget.month))
      );

      for (const monthlyTarget of monthlyTargets) {
        const targetMonth = num(monthlyTarget.month);

        const currentMonthLeads =
          leadsByMonth.get(
            getMonthKey(yearNumber, targetMonth)
          ) || [];

        /*
          TARGET + ACHIEVEMENT:
          Only target-configured users are included here.
        */
        for (const userTarget of objects(monthlyTarget.userTargets)) {
          const userId = String(
            userTarget.userId?._id || userTarget.userId || ""
          );

          if (!userId) continue;

          const userName =
            userTarget.userId?.name || "Unknown User";

          const slabs = objects(userTarget.slabs);

          const target = slabs.reduce((highest, slab) => {
            return Math.max(highest, num(slab.toValue));
          }, 0);

          const user = ensureUser(userId, userName);

          user.target += target;

          let achieved = 0;
          const productWiseMap = new Map();

          for (const lead of currentMonthLeads) {
            const closingUserId = getLatestClosingUserId(lead);

            if (closingUserId !== userId) continue;

            const categoryItems = getLeadCategoryItems(
              lead,
              configCategoryId
            );

            if (!categoryItems.length) continue;

            let leadAchievement = 0;

            if (config.measurementType === "amount") {
              leadAchievement =
                lead.forcefullyClosedTarget === true
                  ? num(lead.netAmount)
                  : getVerifiedAmountForCategory(
                    lead,
                    configCategoryId
                  );
            } else {
              leadAchievement = isLeadEligibleForIncentive(lead)
                ? 1
                : 0;
            }

            if (leadAchievement <= 0) continue;

            achieved += leadAchievement;

            const itemCount = categoryItems.length || 1;

            for (const item of categoryItems) {
              const productKey = `${item.model}-${item.id}`;

              if (!productWiseMap.has(productKey)) {
                productWiseMap.set(productKey, {
                  id: item.id,
                  model: item.model,
                  name: item.name,
                  achieved: 0,
                  incentive: 0,
                });
              }

              const product = productWiseMap.get(productKey);

              product.achieved +=
                config.measurementType === "amount"
                  ? leadAchievement / itemCount
                  : 1;
            }
          }

          user.achieved += achieved;

          user.categories.push({
            categoryId: configCategoryId,
            categoryName,
            periodName: config.periodName || "",
            month: targetMonth,
            year: yearNumber,
            measurementType: config.measurementType,
            target,
            slabs,
            achieved,
            balance: target - achieved,
            incentive: 0,
            products: [...productWiseMap.values()],
          });
        }

        /*
          INCENTIVE:
          Any user can receive it. The user does NOT need
          to exist in monthlyTargets.userTargets.

          Required TargetConfiguration structure:

          allocationValues: [
            {
              allocationId: taskObjectId,
              value: 100,
              incentiveType: "fixed"
            },
            {
              allocationId: anotherTaskObjectId,
              value: 5,
              incentiveType: "percentage"
            }
          ]
        */
        for (const lead of currentMonthLeads) {
          const categoryItems = getLeadCategoryItems(
            lead,
            configCategoryId
          );

          if (!categoryItems.length) continue;

          if (!isLeadEligibleForIncentive(lead)) continue;

          const percentageBaseAmount =
            lead.forcefullyClosedTarget === true
              ? num(lead.netAmount)
              : getVerifiedAmountForCategory(
                lead,
                configCategoryId
              );

          for (const activity of objects(lead.activityLog)) {
            const completed =
              activity.taskClosed === true ||
              activity.followupClosed === true ||
              activity.allocatedClosed === true;

            if (!completed) continue;

            const userId = String(
              activity.submittedUser || ""
            );

            if (!userId) continue;

            const taskById = String(activity.taskBy || "");
            const taskId = String(activity.taskId || "");

            const allocationRule = objects(
              config.allocationValues
            ).find((allocation) => {
              const allocationId = String(
                allocation.allocationId || ""
              );

              return (
                allocationId === taskById ||
                allocationId === taskId
              );
            });

            if (!allocationRule) continue;

            const rewardValue = num(allocationRule.value);

            if (rewardValue <= 0) continue;

            const incentiveType = String(
              allocationRule.incentiveType || "fixed"
            )
              .toLowerCase()
              .trim();

            let incentive = 0;

            if (incentiveType === "percentage") {
              if (percentageBaseAmount <= 0) continue;

              incentive =
                (rewardValue / 100) * percentageBaseAmount;
            } else {
              incentive = rewardValue;
            }

            if (incentive <= 0) continue;

            const rewardTaskId = String(
              allocationRule.allocationId || taskById || taskId
            );

            const rewardKey = [
              String(config._id),
              String(lead._id),
              userId,
              rewardTaskId,
            ].join("-");

            if (awardedIncentives.has(rewardKey)) {
              continue;
            }

            awardedIncentives.add(rewardKey);

            const user = ensureUser(userId);

            user.incentive += incentive;

            user.categories.push({
              categoryId: configCategoryId,
              categoryName,
              periodName: config.periodName || "",
              month: targetMonth,
              year: yearNumber,
              measurementType: "incentive",
              target: 0,
              slabs: [],
              achieved: 0,
              balance: 0,
              incentive,
              products: [],
            });
          }
        }
      }
    }

    const userWiseResults = [...userWiseMap.values()].map((user) => ({
      ...user,
      balance: user.target - user.achieved,
    }));

    const summary = userWiseResults.reduce(
      (total, user) => {
        total.target += num(user.target);
        total.achieved += num(user.achieved);
        total.balance += num(user.balance);
        total.incentive += num(user.incentive);

        return total;
      },
      {
        target: 0,
        achieved: 0,
        balance: 0,
        incentive: 0,
      }
    );

    const measurementTypes = [
      ...new Set(
        targetConfigs
          .map((config) =>
            String(config.measurementType || "").trim()
          )
          .filter(Boolean)
      ),
    ];

    return res.status(200).json({
      success: true,
      data: {
        userWiseResults,
        summary,
        periods: allPeriods,
        selectedPeriodName: targetConfigs[0]?.periodName || "",
        measurementTypes,
        selectedMeasurementType:
          targetConfigs[0]?.measurementType || "",
        selectedMonth,
        selectedYear: yearNumber,
      },
    });
  } catch (error) {
    console.error("gettargetResult error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

////////////
/**
 * Generate months array between start and end dates
 */
const generateMonthsArray = (startDate, endDate) => {
    const months = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        months.push({
            month: current.getMonth() + 1,
            year: current.getFullYear()
        });
        current.setMonth(current.getMonth() + 1);
    }

    return months;
};

/**
 * Validate slab continuity
 */
const validateSlabs = (slabs) => {
    if (!slabs || slabs.length === 0) {
        throw new Error('At least one slab is required');
    }

    // Sort slabs by order
    slabs.sort((a, b) => a.slabOrder - b.slabOrder);

    // First slab must start from 0
    if (slabs[0].fromValue !== 0) {
        throw new Error('First slab must start from 0');
    }

    // Validate continuity
    for (let i = 0;i < slabs.length - 1;i++) {
        if (slabs[i].toValue !== slabs[i + 1].fromValue) {
            throw new Error(
                `Slab discontinuity found between slab ${i + 1} and ${i + 2}`
            );
        }
    }

    return true;
};

// =====================================================
// 1. CREATE TARGET CONFIGURATION
// =====================================================

/**
 * Create a new target configuration with full setup
 * @route POST /api/targets
 */
const createOrUpdateTargetConfiguration = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {
            periodName,
            branchId,
            year,
            startDate,
            endDate,
            categoryId,
            measurementType,
            allocations,
            monthlyTargets
        } = req.body

        if (!periodName || !startDate || !endDate || !categoryId || !measurementType) {
            await session.abortTransaction()
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        const category = await Category.findById(categoryId).session(session)
        if (!category) {
            await session.abortTransaction()
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        // Build allocationValues from allocations
        const allocationValues = []
        for (const alloc of allocations || []) {
            const allocation = await Task.findById(alloc.allocationId).session(session)
            if (!allocation) {
                throw new Error(`Allocation ${alloc.allocationId} not found`)
            }

            allocationValues.push({
                allocationId: alloc.allocationId,
                allocationName: allocation.name,
                value: alloc.value,
                mode: alloc.mode
            })
        }

        // Build monthlyTargets with user validation + slab validation
        const preparedMonthlyTargets = []
        for (const mt of monthlyTargets || []) {
            const userTargets = []

            for (const ut of mt.userTargets || []) {
                const user = await Staff.findById(ut.userId).session(session)
                if (!user) {
                    throw new Error(`User ${ut.userId} not found`)
                }

                validateSlabs(ut.slabs)

                userTargets.push({
                    userId: ut.userId,
                    slabs: ut.slabs
                })
            }

            preparedMonthlyTargets.push({
                month: mt.month,
                year: mt.year,
                userTargets
            })
        }

        const normalizedStartDate = new Date(startDate)
        const normalizedEndDate = new Date(endDate)

        // 1) Find any overlapping config for this branch + category + year
        // Overlap rule: existing.startDate <= newEnd && existing.endDate >= newStart
        let config = await TargetConfiguration.findOne({
            branch: branchId,
            categoryId,
            year,
            startDate: { $lte: normalizedEndDate },
            endDate: { $gte: normalizedStartDate }
        }).session(session)

        let message
        let statusCode

        if (config) {
            // Overlap found → always update this existing config
            // Example: existing April–May, new April–June → this doc becomes April–June
            config.periodName = periodName
            config.startDate = normalizedStartDate
            config.endDate = normalizedEndDate
            config.categoryId = categoryId
            config.categoryName = category.category || category.name
            config.measurementType = measurementType
            config.allocationValues = allocationValues
            config.monthlyTargets = preparedMonthlyTargets
            config.status = "draft"
            config.updatedBy = req.user?.id

            await config.save({ session })

            message = "Target configuration updated successfully"
            statusCode = 200
        } else {
            // 2) No overlapping config at all → create brand new period
            config = new TargetConfiguration({
                periodName,
                year,
                branch: branchId,
                startDate: normalizedStartDate,
                endDate: normalizedEndDate,
                categoryId,
                categoryName: category.category || category.name,
                measurementType,
                allocationValues,
                monthlyTargets: preparedMonthlyTargets,
                status: "draft",
                createdBy: req.user?.id
            })

            await config.save({ session })

            message = "Target configuration created successfully"
            statusCode = 201
        }

        await session.commitTransaction()

        return res.status(statusCode).json({
            success: true,
            message,
            data: config
        })
    } catch (error) {
        await session.abortTransaction()
        console.error("Error creating/updating target configuration:", error)
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to save target configuration"
        })
    } finally {
        session.endSession()
    }
}
const deleteTargetConfiguration = async (req, res) => {
  try {
    const { categoryId, branchId, year, periodName } = req.body

    if (!categoryId || !branchId || !year || !periodName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    const deleted = await TargetConfiguration.deleteOne({
      categoryId,
      branch: branchId,
      year,
      periodName
    })

    return res.status(200).json({
      success: true,
      message: "Target configuration deleted successfully",
      data: deleted
    })
  } catch (error) {
    console.error("Delete Target Error:", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete target configuration"
    })
  }
}
// const createOrUpdateTargetConfiguration = async (req, res) => {
//     const session = await mongoose.startSession()
//     session.startTransaction()

//     try {
//         const {
//             periodName,
//             branchId,
//             year,
//             startDate,
//             endDate,
//             categoryId,
//             measurementType,
//             allocations,
//             monthlyTargets
//         } = req.body

//         if (!periodName || !startDate || !endDate || !categoryId || !measurementType) {
//             await session.abortTransaction()
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields"
//             })
//         }

//         const category = await Category.findById(categoryId).session(session)
//         if (!category) {
//             await session.abortTransaction()
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found"
//             })
//         }

//         const allocationValues = []
//         for (const alloc of allocations || []) {
//             const allocation = await Task.findById(alloc.allocationId).session(session)
//             if (!allocation) {
//                 throw new Error(`Allocation ${alloc.allocationId} not found`)
//             }

//             allocationValues.push({
//                 allocationId: alloc.allocationId,
//                 allocationName: allocation.name,
//                 value: alloc.value,
//                 mode: alloc.mode
//             })
//         }

//         const preparedMonthlyTargets = []
//         for (const mt of monthlyTargets || []) {
//             const userTargets = []

//             for (const ut of mt.userTargets || []) {
//                 const user = await Staff.findById(ut.userId).session(session)
//                 if (!user) {
//                     throw new Error(`User ${ut.userId} not found`)
//                 }

//                 validateSlabs(ut.slabs)

//                 userTargets.push({
//                     userId: ut.userId,
//                     slabs: ut.slabs
//                 })
//             }

//             preparedMonthlyTargets.push({
//                 month: mt.month,
//                 year: mt.year,
//                 userTargets
//             })
//         }

//         const normalizedStartDate = new Date(startDate)
//         const normalizedEndDate = new Date(endDate)

//         let existingConfig = await TargetConfiguration.findOne({
//             periodName,
//             year,
//             branch: branchId,
//             categoryId,
//             startDate: normalizedStartDate,
//             endDate: normalizedEndDate
//         }).session(session)

//         let message = "Target configuration created successfully"
//         let statusCode = 201

//         if (existingConfig) {
//             existingConfig.periodName = periodName
//             existingConfig.startDate = normalizedStartDate
//             existingConfig.endDate = normalizedEndDate
//             existingConfig.categoryId = categoryId
//             existingConfig.categoryName = category.category || category.name
//             existingConfig.measurementType = measurementType
//             existingConfig.allocationValues = allocationValues
//             existingConfig.monthlyTargets = preparedMonthlyTargets
//             existingConfig.status = "draft"
//             existingConfig.updatedBy = req.user?.id

//             await existingConfig.save({ session })

//             message = "Target configuration updated successfully"
//             statusCode = 200
//         } else {
//             existingConfig = new TargetConfiguration({
//                 periodName,
//                 year,
//                 branch: branchId,
//                 startDate: normalizedStartDate,
//                 endDate: normalizedEndDate,
//                 categoryId,
//                 categoryName: category.category || category.name,
//                 measurementType,
//                 allocationValues,
//                 monthlyTargets: preparedMonthlyTargets,
//                 status: "draft",
//                 createdBy: req.user?.id
//             })

//             await existingConfig.save({ session })
//         }

//         await session.commitTransaction()

//         return res.status(statusCode).json({
//             success: true,
//             message,
//             data: existingConfig
//         })
//     } catch (error) {
//         await session.abortTransaction()
//         console.error("Error creating/updating target configuration:", error)
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to save target configuration"
//         })
//     } finally {
//         session.endSession()
//     }
// }


// =====================================================
// 2. UPDATE USER SLABS FOR SPECIFIC MONTH
// =====================================================

/**
 * Update user slabs for a specific month within a target config
 * @route PUT /api/targets/:id/months/:monthId/users/:userId/slabs
 */
const updateUserSlabs = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id, monthId, userId } = req.params;
        const { slabs } = req.body;

        // Validate slabs
        validateSlabs(slabs);

        // Find target configuration
        const targetConfig = await TargetConfiguration.findById(id);
        if (!targetConfig) {
            return res.status(404).json({
                success: false,
                message: 'Target configuration not found'
            });
        }

        // Find monthly target
        const monthlyTarget = targetConfig.monthlyTargets.id(monthId);
        if (!monthlyTarget) {
            return res.status(404).json({
                success: false,
                message: 'Monthly target not found'
            });
        }

        // Find or create user target
        let userTarget = monthlyTarget.userTargets.find(
            (ut) => ut.userId.toString() === userId
        );

        if (userTarget) {
            userTarget.slabs = slabs;
        } else {
            monthlyTarget.userTargets.push({
                userId,
                slabs
            });
        }

        await targetConfig.save({ session });
        await session.commitTransaction();

        res.json({
            success: true,
            message: 'User slabs updated successfully',
            data: targetConfig
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating user slabs:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user slabs'
        });
    } finally {
        session.endSession();
    }
};

// =====================================================
// 3. GET TARGET CONFIGURATION WITH FILTERS
// =====================================================

/**
 * Get target configurations with optional filters
 * @route GET /api/targets
 */



const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const getDateFromPeriod = (periodName) => {
    const match = periodName.match(/^(\w+)\s*-\s*(\w+)\s+(\d{4})$/)

    if (!match) return null

    const [, fromMonth, , year] = match

    const monthIndex = months.indexOf(fromMonth)

    if (monthIndex === -1) return null

    return new Date(Number(year), monthIndex, 1)
}
const getTargetConfigurations = async (req, res) => {
    try {
        const { periodName, branchId, year } = req.query
        console.log('peridnme', periodName)
        console.log("brancid", branchId)
        if (!periodName || !branchId) {
            return res.status(400).json({
                success: false,
                message: "periodName and branchId are required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid branchId"
            })
        }

        const queryDate = getDateFromPeriod(periodName)

        if (!queryDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid period format"
            })
        }

        console.log("queryDate:", queryDate.toISOString())

        const allTargets = await TargetConfiguration.find({
            branch: new mongoose.Types.ObjectId(branchId),
            year
        })
            .populate("categoryId", "name description")
            .populate("allocationValues.allocationId", "name")
            .populate("monthlyTargets.userTargets.userId", "name email")
            .sort({ createdAt: 1 })

        const periodMap = new Map()

        for (const t of allTargets) {
            const start = new Date(t.startDate)
            const end = new Date(t.endDate)
            const key = `${start.getTime()}|${end.getTime()}`

            if (!periodMap.has(key)) {
                periodMap.set(key, {
                    _id: key,
                    periodName: t.periodName,
                    startDate: t.startDate,
                    endDate: t.endDate
                })
            }
        }

        const periods = Array.from(periodMap.values()).sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
        )
        console.log("allperiods", periods)

        if (!periods.length) {
            return res.json({
                success: true,
                data: {
                    targets: [],
                    periods: [],
                    effectivePeriod: null,
                    effectivePeriodName: null,
                    effectiveStartDate: null,
                    effectiveEndDate: null
                }
            })
        }

        let effectivePeriod = periods.find((p) => {
            const start = new Date(p.startDate)
            const end = new Date(p.endDate)
            return start <= queryDate && end >= queryDate
        })

        if (!effectivePeriod) {
            effectivePeriod = periods[periods.length - 1]
        }

        const targets = allTargets.filter((t) => {
            return (
                new Date(t.startDate).getTime() === new Date(effectivePeriod.startDate).getTime() &&
                new Date(t.endDate).getTime() === new Date(effectivePeriod.endDate).getTime()
            )
        })
        return res.json({
            success: true,
            data: {
                targets,
                allperiods: periods,
                selectedperiod: effectivePeriod,
                selectedPeriodName: effectivePeriod.periodName,

            }
        })
    } catch (error) {
        console.error("Error fetching target configurations:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch target configurations"
        })
    }
}


// const getTargetConfigurations = async (req, res) => {
//     try {
//         const { periodName, branchId } = req.query

//         const queryDate = getDateFromPeriod(periodName)
//         if (!queryDate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid period format"
//             })
//         }
//         console.log("querydate", queryDate)
//         const targets = await TargetConfiguration.find({
//             startDate: { $lte: queryDate },
//             endDate: { $gte: queryDate },
//             branchId: new mongoose.Types.ObjectId(branchId)
//         })
//             .populate("categoryId", "name description")
//             .populate("allocationValues.allocationId", "name")
//             .populate("monthlyTargets.userTargets.userId", "name email")
//             .sort({ createdAt: -1 })

//         res.json({
//             success: true,
//             data: targets
//         })
//     } catch (error) {
//         console.error("Error fetching target configurations:", error)
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch target configurations"
//         })
//     }
// }

// const getTargetConfigurations = async (req, res) => {
//   try {
//     const { periodName, branchId } = req.query

//     if (!branchId) {
//       return res.status(400).json({
//         success: false,
//         message: "branchId is required"
//       })
//     }

//     const queryDate = getDateFromPeriod(periodName)
//     if (!queryDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid period format"
//       })
//     }

//     console.log("querydate", queryDate)

//     const allTargets = await TargetConfiguration.find({
//       branchId: new mongoose.Types.ObjectId(branchId)
//     })
//       .populate("categoryId", "name description")
//       .populate("allocationValues.allocationId", "name")
//       .populate("monthlyTargets.userTargets.userId", "name email")
//       .sort({ createdAt: -1 })

//     const targets = allTargets.filter((t) => {
//       const start = new Date(t.startDate)
//       const end = new Date(t.endDate)
//       return start <= queryDate && end >= queryDate
//     })

//     const periodMap = new Map()

//     for (const t of allTargets) {
//       const key = `${new Date(t.startDate).getTime()}|${new Date(t.endDate).getTime()}`
//       if (!periodMap.has(key)) {
//         periodMap.set(key, {
//           _id: key,
//           periodName: t.periodName,
//           startDate: t.startDate,
//           endDate: t.endDate
//         })
//       }
//     }

//     const periods = Array.from(periodMap.values()).sort(
//       (a, b) => new Date(a.startDate) - new Date(b.startDate)
//     )

//     return res.json({
//       success: true,
//       data: {
//         targets,
//         periods
//       }
//     })
//   } catch (error) {
//     console.error("Error fetching target configurations:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch target configurations"
//     })
//   }
// }





/**
 * Get a single target configuration by ID
 * @route GET /api/targets/:id
 */
const getTargetConfigurationById = async (req, res) => {
    try {
        const { id } = req.params;

        const targetConfig = await TargetConfiguration.findById(id)
            .populate('categoryId', 'name description')
            .populate('allocationValues.allocationId', 'name description')
            .populate('createdBy', 'name email');

        if (!targetConfig) {
            return res.status(404).json({
                success: false,
                message: 'Target configuration not found'
            });
        }

        // Populate user details in monthly targets
        const populatedConfig = await TargetConfiguration.populate(targetConfig, {
            path: 'monthlyTargets.userTargets.userId',
            select: 'name email'
        });

        res.json({
            success: true,
            data: populatedConfig
        });
    } catch (error) {
        console.error('Error fetching target configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch target configuration'
        });
    }
};

// =====================================================
// 5. UPDATE TARGET STATUS
// =====================================================

/**
 * Update target configuration status
 * @route PATCH /api/targets/:id/status
 */
const updateTargetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const targetConfig = await TargetConfiguration.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!targetConfig) {
            return res.status(404).json({
                success: false,
                message: 'Target configuration not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: targetConfig
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
};

// =====================================================
// 6. DELETE TARGET CONFIGURATION
// =====================================================

/**
 * Delete a target configuration
 * @route DELETE /api/targets/:id
 */
// const deleteTargetConfiguration = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { id } = req.params;

//         const targetConfig = await TargetConfiguration.findById(id);
//         if (!targetConfig) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Target configuration not found'
//             });
//         }

//         // Check if there are any achievements
//         const achievementCount = await TargetAchievement.countDocuments({
//             targetConfigId: id
//         });

//         if (achievementCount > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     'Cannot delete target with existing achievements. Archive it instead.'
//             });
//         }

//         await targetConfig.deleteOne({ session });
//         await session.commitTransaction();

//         res.json({
//             success: true,
//             message: 'Target configuration deleted successfully'
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         console.error('Error deleting target configuration:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete target configuration'
//         });
//     } finally {
//         session.endSession();
//     }
// };//original code from ai-but its not called its need to check

// =====================================================
// 7. GET USER TARGETS FOR SPECIFIC PERIOD
// =====================================================

/**
 * Get all targets for a specific user in a period
 * @route GET /api/targets/user/:userId
 */
const getUserTargets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year, status = 'active' } = req.query;

        const query = {
            'monthlyTargets.userTargets.userId': userId,
            status
        };

        if (month && year) {
            query['monthlyTargets.month'] = parseInt(month);
            query['monthlyTargets.year'] = parseInt(year);
        }

        const targets = await TargetConfiguration.find(query)
            .populate('categoryId', 'name')
            .populate('allocationValues.allocationId', 'name')
            .select(
                'periodName startDate endDate categoryName measurementType allocationValues monthlyTargets status'
            );

        const userTargets = targets.map((target) => {
            const relevantMonths = target.monthlyTargets
                .filter((mt) => {
                    const hasUser = mt.userTargets.some(
                        (ut) => ut.userId.toString() === userId
                    );
                    if (!month || !year) return hasUser;
                    return (
                        hasUser &&
                        mt.month === parseInt(month) &&
                        mt.year === parseInt(year)
                    );
                })
                .map((mt) => ({
                    month: mt.month,
                    year: mt.year,
                    slabs:
                        mt.userTargets.find((ut) => ut.userId.toString() === userId)
                            ?.slabs || []
                }));

            return {
                targetId: target._id,
                periodName: target.periodName,
                startDate: target.startDate,
                endDate: target.endDate,
                category: target.categoryName,
                measurementType: target.measurementType,
                allocations: target.allocationValues,
                monthlyTargets: relevantMonths,
                status: target.status
            };
        });

        res.json({
            success: true,
            data: userTargets
        });
    } catch (error) {
        console.error('Error fetching user targets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user targets'
        });
    }
};

// =====================================================
// 8. BULK CREATE MONTHLY TARGETS
// =====================================================

/**
 * Add monthly targets to existing configuration
 * @route POST /api/targets/:id/months
 */
const addMonthlyTargets = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { monthlyTargets } = req.body;

        const targetConfig = await TargetConfiguration.findById(id);
        if (!targetConfig) {
            return res.status(404).json({
                success: false,
                message: 'Target configuration not found'
            });
        }

        for (const mt of monthlyTargets) {
            const exists = targetConfig.monthlyTargets.some(
                (existing) =>
                    existing.month === mt.month && existing.year === mt.year
            );

            if (exists) {
                throw new Error(`Target for ${mt.month}/${mt.year} already exists`);
            }

            for (const ut of mt.userTargets) {
                validateSlabs(ut.slabs);
            }

            targetConfig.monthlyTargets.push(mt);
        }

        await targetConfig.save({ session });
        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Monthly targets added successfully',
            data: targetConfig
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error adding monthly targets:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add monthly targets'
        });
    } finally {
        session.endSession();
    }
};

// =====================================================
// 9. RECORD ACHIEVEMENT
// =====================================================

/**
 * Record achievement against a target
 * @route POST /api/targets/achievements
 */
const recordAchievement = async (req, res) => {
    try {
        const {
            targetConfigId,
            userId,
            month,
            year,
            allocationId,
            achievedValue
        } = req.body;

        const targetConfig = await TargetConfiguration.findById(targetConfigId);
        if (!targetConfig) {
            return res.status(404).json({
                success: false,
                message: 'Target configuration not found'
            });
        }

        const monthlyTarget = targetConfig.monthlyTargets.find(
            (mt) => mt.month === month && mt.year === year
        );

        if (!monthlyTarget) {
            return res.status(404).json({
                success: false,
                message: 'Monthly target not found'
            });
        }

        const userTarget = monthlyTarget.userTargets.find(
            (ut) => ut.userId.toString() === userId
        );

        if (!userTarget) {
            return res.status(404).json({
                success: false,
                message: 'User target not found'
            });
        }

        const matchingSlab = userTarget.slabs.find(
            (slab) =>
                achievedValue >= slab.fromValue && achievedValue < slab.toValue
        );

        const achievement = new TargetAchievement({
            targetConfigId,
            userId,
            month,
            year,
            allocationId,
            achievedValue,
            slabMatched: matchingSlab
                ? {
                    slabOrder: matchingSlab.slabOrder,
                    fromValue: matchingSlab.fromValue,
                    toValue: matchingSlab.toValue
                }
                : null
        });

        await achievement.save();

        res.status(201).json({
            success: true,
            message: 'Achievement recorded successfully',
            data: achievement
        });
    } catch (error) {
        console.error('Error recording achievement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record achievement'
        });
    }
};

// =====================================================
// 10. GET ACHIEVEMENT REPORT
// =====================================================

/**
 * Get achievement report for user/period
 * @route GET /api/targets/achievements/report
 */
const getAchievementReport = async (req, res) => {
    try {
        const { userId, targetConfigId, month, year } = req.query;

        const query = {};
        if (userId) query.userId = userId;
        if (targetConfigId) query.targetConfigId = targetConfigId;
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);

        const achievements = await TargetAchievement.find(query)
            .populate('targetConfigId', 'periodName categoryName measurementType')
            .populate('userId', 'name email')
            .populate('allocationId', 'name')
            .sort({ achievementDate: -1 });

        const summary = achievements.reduce((acc, achievement) => {
            const key = `${achievement.allocationId._id}`;
            if (!acc[key]) {
                acc[key] = {
                    allocationName: achievement.allocationId.name,
                    totalAchieved: 0,
                    count: 0
                };
            }
            acc[key].totalAchieved += achievement.achievedValue;
            acc[key].count += 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                achievements,
                summary: Object.values(summary)
            }
        });
    } catch (error) {
        console.error('Error fetching achievement report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievement report'
        });
    }
};

// =====================================================
// EXPORTS (ESM)
// =====================================================

export {
    createOrUpdateTargetConfiguration,
    updateUserSlabs,
    getTargetConfigurations,
    getTargetConfigurationById,
    updateTargetStatus,
    deleteTargetConfiguration,
    getUserTargets,
    addMonthlyTargets,
    recordAchievement,
    getAchievementReport
};