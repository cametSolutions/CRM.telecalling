// import { useState, useEffect, useMemo } from "react"
// import { X } from "lucide-react"
// import { FaSpinner } from "react-icons/fa"
// import { Country, State } from "country-state-city"
// import { toast } from "react-toastify"

// export const CollectionupdateModal = ({
//   isClosed = false,
//   data,
//   closemodal,
//   partnerlist,
//   loggedUser,

//   handleCollectionUpdate,
//   setishavePayment = false,
// }) => {
// console.log("hh")
//   const [isdropdownOpen, setIsdropdownOpen] = useState(false)
//   const [error, setError] = useState({})
//   const [noneAmount, setisnoneAmount] = useState(false)
//   const [message, setMessage] = useState({ warning: "" })
//   const [selectedCountry, setSelectedCountry] = useState(null)
//   const [selectedState, setSelectedState] = useState(null)
//   const [iscanupateCollection, setcanupdateCollection] = useState(false)
//   const [submitloader, setsubmitloader] = useState(false)
//   const [isreadytoVarify, setisreadyTovarify] = useState(false)
//   // const [countryOptions, setcountryOptions] = useState([])
//   const [formData, setformData] = useState({
//     leadDocId: data?._id,
//     customerId: data?.customerName?._id,
//     leadId: data.leadId,
//     submissionDate: new Date()
//       .toLocaleDateString("en-GB") // this gives dd/mm/yyyy
//       .replace(/\//g, "-"), // change / to -,

//     customerName: data?.customerName?.customerName,

//     address: data?.customerName?.address1,
//     email: data?.customerName?.email || data?.email,
//     mobile: data?.customerName?.mobile || data?.mobile,
//     registrationType: data?.customerName?.registrationType,
//     partner: data?.partner?._id,
//     country: data?.customerName?.country,
//     state: data?.customerName?.state,
//     city: data?.customerName?.city,
//     pincode: data?.customerName?.pincode,
//     netAmount: data?.netAmount,
//     balanceAmount: data?.balanceAmount,
//     remarks: "",
//     bankRemarks: "",
//     receivedAmount: "",
//     totalPaidAmount: data?.totalPaidAmount,
//     receivedBy: loggedUser?._id,
//     receivedModel: loggedUser?.role === "Admin" ? "Admin" : "Staff"
//   })
//   console.log(formData.state)
//   useEffect(() => {
//     if (data?.netAmount === 0) {
//       setisnoneAmount(true);
//     }
//     if (
//       data?.totalPaidAmount === data?.netAmount &&
//       data?.balanceAmount === 0
//     ) {
//       setMessage((prev) => ({
//         ...prev,
//         warning: "There is no balance amount — all payments are completed.",
//       }));
//     }
//   }, [])
//   // useEffect(() => {
//   //   setcountryOptions(
//   //     Country.getAllCountries().map((country) => ({
//   //       label: country.name,
//   //       value: country.isoCode
//   //     }))
//   //   )
//   // }, [])
//   const countryOptions = useMemo(
//     () =>
//       Country.getAllCountries().map((country) => ({
//         label: country.name,
//         value: country.isoCode
//       })),
//     []
//   )
//   const defaultCountry = useMemo(
//     () => countryOptions.find((country) => country.value === "IN"),
//     [countryOptions]
//   )

//   useEffect(() => {
//     if (defaultCountry) {
//       setSelectedCountry(defaultCountry)
//       // setValue("country", defaultCountry.value)
//     }
//   }, [defaultCountry])
// console.log(selectedCountry)
//   const stateOptions = selectedCountry
//     ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
//         label: state.name,
//         value: state.isoCode
//       }))
//     : [selectedCountry]
// console.log(countryOptions)
// console.log(stateOptions)

//   console.log(defaultCountry)
//   const handleChange = (e) => {
//     const { value, name } = e.target;

//     setformData({ ...formData, [name]: value.trim() });
//     if (name === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (value && !emailRegex.test(value)) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Email id is not correct",
//         }));
//       } else {
//         setError((prev) => ({
//           ...prev,
//           [name]: "",
//         }));
//       }
//     } else if (name === "mobile") {
//       // Allow only digits and length 10
//       const mobileRegex = /^[6-9]\d{9}$/; // starts with 6–9 and must be exactly 10 digits
//       if (!value) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Mobile number is required",
//         }));
//       } else if (!/^\d+$/.test(value)) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Mobile number must contain only digits",
//         }));
//       } else if (value.length < 10) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Mobile number must be 10 digits",
//         }));
//       } else if (value.length > 10) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Mobile number cannot exceed 10 digits",
//         }));
//       } else if (!mobileRegex.test(value)) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Mobile number is not valid",
//         }));
//       } else {
//         setError((prev) => ({
//           ...prev,
//           [name]: "",
//         }));
//       }
//     } else if (name === "pincode") {
//       const postalCodePatterns = {
//         INDIA: /^[1-9][0-9]{5}$/, // India - 6 digits
//         IN: /^[1-9][0-9]{5}$/,
//         USA: /^\d{5}(-\d{4})?$/, // USA - 5 or 9 digits
//         CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada
//         GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // UK
//         AU: /^\d{4}$/, // Australia
//         DE: /^\d{5}$/, // Germany
//         FR: /^\d{5}$/, // France
//         JP: /^\d{3}-?\d{4}$/, // Japan
//         SG: /^\d{6}$/, // Singapore
//       };

//       if (formData.country === "" || formData.country === undefined) {
//         setError((prev) => ({
//           ...prev,
//           pincode: "please fill country before pincode",
//         }));
//         return;
//       }
//       const pattern = postalCodePatterns[formData.country.toUpperCase()];
//       if (!pattern) return true;
//       if (!pattern.test(value)) {
//         setError((prev) => ({
//           ...prev,
//           [name]: "Invalid pincode",
//         }));
//       } else {
//         setError((prev) => ({
//           ...prev,
//           [name]: "",
//         }));
//       }
//     } else {
//       setformData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//       setError((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   }
//   const isShortCode = (value) => {
//     return value && value.length <= 3
//   }
//   const handleSubmit = async () => {
//     try {
//       console.log("uuuu");
//       if (error.submitError) {
//         setError((prev) => ({
//           ...prev,
//           submitError: "",
//         }));
//       }
//       console.log("uuuii");
//       if (noneAmount) {
//         setMessage((prev) => ({
//           ...prev,
//           noneAmount:
//             "Please add netAmount or add amount on product before update collection ",
//         }));
//         return;
//       }
//       console.log("ppp");
//       if (message.warning) {
//       } else if (
//         error &&
//         Object.values(error).some(
//           (val) => val !== null && val !== undefined && val !== ""
//         )
//       ) {
//         console.log(error);
//         console.log("hh");
//         return;
//       }
//       setsubmitloader(true);

//       // Clone formData fields
//       const { bankRemarks, receivedAmount, ...newdata } = formData;
//       const fields = Object.entries(formData);
//       let newErrors = {};
//       let isValid = true;

//       // Loop through all fields
//       for (const [key, value] of fields) {
//         if (value === "" || value === null || value === undefined) {
//           newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
//           isValid = false;
//         }
//       }

//       // If any errors, stop submission
//       if (!isValid) {
//         console.log("ooooooo");
//         setError(newErrors);
//         setsubmitloader(false);
//         return;
//       }
//       const cleanedData = Object.fromEntries(
//         Object.entries(formData).map(([key, value]) => [
//           key,
//           typeof value === "string" ? value.trim() : value,
//         ])
//       )

//       const response = await handleCollectionUpdate(cleanedData)
//       if (response.status === 200) {
//         isClosed
//           ? toast.success("Lead is closed and payment updated successfully")
//           : toast.success("Payment updated successfully");
//         setsubmitloader(false);
//         closemodal(false);
//         // refreshHook()
//       }
//     } catch (error) {
//       console.log(error.message);
//       setsubmitloader(false);
//       // toast.error("something went wrong")
//       setError((prev) => ({
//         ...prev,
//         submitError: "something went wrong",
//       }));
//     }
//   }
//   console.log(stateOptions)
//   console.log(countryOptions)
// console.log(isShortCode(formData.state))
// console.log(formData.state)
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-2xl w-full  max-h-[95vh] flex flex-col overflow-hidden">
//         {/* Header */}

//         <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
//           {/* Left Section - Title & Subtitle */}
//           <div className="min-w-[180px] flex-1 flex flex-col items-start">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ">
//               Collection Update
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-500 mt-0.5 ">
//               Update and Manage Collection Details
//             </p>
//           </div>

//           {/* Middle Section - Lead ID */}
//           <div className="flex items-center text-sm sm:text-lg font-semibold text-gray-700 whitespace-nowrap">
//             <span>Lead ID :</span>
//             <span className="ml-1 break-all">{formData?.leadId}</span>
//           </div>

//           {/* Right Section - Close Button */}
//           <button
//             type="button"
//             onClick={() => {
//               closemodal(false);
//               if (setishavePayment) {
//                 setishavePayment(false);
//               }
//             }}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Body - Scrollable */}
//         <div className="flex-1 overflow-y-auto px-6 py-3">
//           <div className="space-y-2">
//             {/* Follow Up Date - Read Only */}
//             <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
//               <div className="flex flex-col justify-start">
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Submission Date
//                 </label>

//                 <input
//                   type="text"
//                   readOnly
//                   value={formData.submissionDate}
//                   className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed focus:outline-none"
//                 />
//               </div>

//               {/* Status Dropdown */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Status
//                 </label>

//                 <input
//                   value="Collection Update"
//                   className="w-full appearance-none px-4 py-1.5 pr-10 border border-gray-300 rounded-lg  text-gray-700 font-medium focus:outline-none  bg-gray-50 transition-all cursor-pointer"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Customer Name
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={formData.customerName}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) =>
//                       setformData((prev) => ({
//                         ...prev,
//                         address: e.target.value
//                       }))
//                     }
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
//                   />
//                   {error.address && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {error?.address}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Email
//                 </label>

//                 <input
//                   type="text"
//                   name="email"
//                   value={formData?.email}
//                   onChange={(e) => handleChange(e)}
//                   className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
//                 />
//                 {error.email && (
//                   <p className="text-red-500 text-xs mt-1">{error?.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Mobile
//                 </label>

//                 <input
//                   type="text"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={(e) => handleChange(e)}
//                   className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
//                 />
//                 {error.mobile && (
//                   <p className="text-red-500 text-xs mt-1">{error?.mobile}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Registration Type
//                 </label>
//                 <div className="relative">
//                   {/* <input
//                     type="text"
//                     value={formData.registrationType}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
//                   /> */}
//                   <select
//                     name="registrationType"
//                     value={formData.registrationType}
//                     onChange={(e) => handleChange(e)}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer bg-gray-50"
//                   >
//                     <option value="">Select RegistrationType</option>
//                     <option value="unregistered">Unregistered/Consumer</option>
//                     <option value="regular">Regular</option>
//                   </select>
//                   {error && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {error?.registrationType}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Partner
//                 </label>

//                 <select
//                   name="partner"
//                   value={formData?.partner}
//                   onChange={(e) => {
//                     if (error.partner) {
//                       setError((prev) => ({
//                         ...prev,
//                         partner: "",
//                       }));
//                     }
//                     setformData((prev) => ({
//                       ...prev,
//                       partner: e.target.value,
//                     }));
//                   }}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none bg-gray-50 cursor-pointer"
//                 >
//                   <option value="">Select Partner</option>
//                   {partnerlist?.map((partnr, index) => (
//                     <option key={index} value={partnr._id}>
//                       {partnr.partner}
//                     </option>
//                   ))}
//                 </select>
//                 {error.partner && (
//                   <p className="text-red-500 text-xs mt-1">{error?.partner}</p>
//                 )}
//               </div>

//               {isShortCode(formData.country) ? (
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                     Country
//                   </label>

//                   <select
//                     value={formData.country}
//                     onChange={(e) => {
//                       setformData((prev) => ({
//                         ...prev,
//                         country: e.target.value
//                       }))
//                       setSelectedCountry(e.target.value)
//                     }}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >

//                     {countryOptions?.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                     Country
//                   </label>

//                   <input
//                     type="text"
//                     name="country"
//                     value={formData.country}
//                     onChange={(e) => handleChange(e)}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
//                   />
//                   {error.country && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {error?.country}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {isShortCode(formData.state) ? (
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                     State
//                   </label>

//                   <select
//                     value={formData.state}
//                     onChange={(e) =>
//                       setformData((prev) => ({
//                         ...prev,
//                         state: e.target.value
//                       }))
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >

//                     {stateOptions?.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>

//                   {error?.state && (
//                     <p className="text-red-500 text-xs mt-1">
//                       State is required
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                     State
//                   </label>

//                   <input
//                     type="text"
//                     name="country"
//                     value={formData.state}
//                     onChange={(e) => handleChange(e)}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
//                   />
//                   {error.state && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {error?.state}
//                     </p>
//                   )}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   City
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={formData?.city}
//                     onChange={(e) => {
//                       if (error.city) {
//                         setError((prev) => ({
//                           ...prev,
//                           city: "",
//                         }));
//                       }
//                       setformData((prev) => ({
//                         ...prev,
//                         city: e.target.value.trim(),
//                       }));
//                     }}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium  focus:outline-none"
//                   />
//                   {error.city && (
//                     <p className="text-red-500 text-xs mt-1">{error?.city}</p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Pincode
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={(e) => handleChange(e)}
//                     className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none"
//                   />
//                   {error && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {error?.pincode}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50">
//               <div className="space-y-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">
//                       Net Amount
//                     </label>
//                     <input
//                       type="number"
//                       disabled
//                       value={formData.netAmount}
//                       className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">
//                       Balance Amount
//                     </label>
//                     <input
//                       type="number"
//                       disabled
//                       value={formData.balanceAmount}
//                       className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
//                     />
//                   </div>
//                   {!(
//                     data?.totalPaidAmount === data?.netAmount &&
//                     data?.balanceAmount === 0
//                   ) && (
//                     <div>
//                       <label className="block text-xs font-semibold text-gray-700 mb-1">
//                         Received Amount
//                       </label>
//                       <input
//                         type="number"
//                         value={formData.receivedAmount}
//                         onChange={(e) => {
//                           if (error.receivedAmount) {
//                             setError((prev) => ({
//                               ...prev,
//                               receivedAmount: "",
//                             }));
//                           }
//                           if (e.target.value === "0") {
//                             setError((prev) => ({
//                               ...prev,
//                               receivedAmount:
//                                 "please input greater than interger 1",
//                             }));
//                             return;
//                           }
//                           setformData((prev) => ({
//                             ...prev,
//                             receivedAmount: e.target.value.trim(),
//                           }));
//                           if (isClosed) {
//                             setTimeout(() => {
//                               if (
//                                 e.target.value.trim() < formData?.balanceAmount
//                               ) {
//                                 setError((prev) => ({
//                                   ...prev,
//                                   receivedAmount:
//                                     "Received amount is less than balance amount check it",
//                                 }));
//                               } else if (
//                                 e.target.value.trim() > formData?.balanceAmount
//                               ) {
//                                 setError((prev) => ({
//                                   ...prev,
//                                   receivedAmount:
//                                     "Received amount is more than balance amount check it",
//                                 }));
//                               }
//                             }, 2000);
//                           }
//                         }}
//                         className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                         placeholder="Enter received amount..."
//                       />
//                       {error.receivedAmount && (
//                         <p className="mt-1.5 text-xs text-red-500 font-medium">
//                           {error.receivedAmount}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-8">
//               {!isreadytoVarify && (
//                 <div className="w-1/2">
//                   <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                     Bank Remarks
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={formData.bankRemarks}
//                     onChange={(e) => {
//                       if (error.bankRemarks) {
//                         setError((prev) => ({
//                           ...prev,
//                           bankRemarks: "",
//                         }));
//                       } else {
//                         setformData((prev) => ({
//                           ...prev,
//                           bankRemarks: e.target.value,
//                         }));
//                       }
//                     }}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     placeholder="Add Bank remarks here..."
//                   />
//                   {error.bankRemarks && (
//                     <p className="mt-1.5 text-xs text-red-500 font-medium">
//                       {error.bankRemarks}
//                     </p>
//                   )}
//                 </div>
//               )}

//               <div className="w-1/2">
//                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                   Remarks
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={formData.remarks}
//                   onChange={(e) => {
//                     if (error.remarks) {
//                       setError((prev) => ({
//                         ...prev,
//                         remarks: "",
//                       }));
//                     } else {
//                       setformData((prev) => ({
//                         ...prev,
//                         remarks: e.target.value,
//                       }));
//                     }
//                   }}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="Add detailed remarks or notes here..."
//                 />
//                 {error.remarks && (
//                   <p className="mt-1.5 text-xs text-red-500 font-medium">
//                     {error.remarks}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-center bg-orange-300 mt-0 items-center">
//           {error.submitError && (
//             <p className="text-xs text-red-500 font-medium">
//               {error.submitError}
//             </p>
//           )}
//           {message.warning && (
//             <p className="text-xs text-red-500 font-medium">
//               {message.warning}
//             </p>
//           )}
//           {message.noneAmount && (
//             <p className="text-xs text-red-500 font-medium">
//               {message.noneAmount}
//             </p>
//           )}
//         </div>
//         {/* Footer */}
//         <div className="flex items-center justify-center gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50">
//           <button
//             type="button"
//             onClick={() => {
//               closemodal(false);
//               if (setishavePayment) {
//                 setishavePayment(false);
//               }
//               setMessage({
//                 warning: "",
//                 noneAmount: "",
//               });
//             }}
//             className="px-6 py-1.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
//           >
//             Cancel
//           </button>

//           {!message.warning && (
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
//             >
//               {submitloader ? (
//                 <div className="flex items-center">
//                   Processing
//                   <FaSpinner className="animate-spin h-5 w-5  text-white ml-2" />
//                 </div>
//               ) : (
//                 <div>SUBMIT</div>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// import { useState, useEffect } from "react"
// import { X, IndianRupee, ClipboardCheck } from "lucide-react"

// export function CollectionupdateModal({
//   data,
//   closemodal,
//   partnerlist,
//   loggedUser,
//   handleCollectionUpdate
// }) {
//   const [formData, setFormData] = useState({
//     submissionDate: "",
//     status: "",
//     projectAmount: "",
//     receivedAmount: "",
//     bankRemark: ""
//   })

//   const balanceAmount =
//     (parseFloat(formData.projectAmount) || 0) -
//     (parseFloat(formData.receivedAmount) || 0)

//   useEffect(() => {
//     if (data) {
//       setFormData((prev) => ({
//         ...prev,
//         projectAmount: data.netAmount ?? "",
//         receivedAmount: data.receivedAmount ?? "",
//         submissionDate: data.submissionDate
//           ? data.submissionDate.toString().split("T")[0]
//           : "",
//         status: data.status ?? "",
//         bankRemark: data.bankRemark ?? ""
//       }))
//     }
//   }, [data])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const payload = {
//       leadId: data?.leadId,
//       leadDocId: data?._id,
//       ...formData,
//       balanceAmount,
//       updatedBy: loggedUser?._id
//     }
//     const res = await handleCollectionUpdate(payload)
//     if (res?.status === 200) closemodal(false)
//   }

//   /* ── field helpers ── */
//   const Field = ({ label, children, className = "" }) => (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <label
//         style={{
//           fontSize: 10,
//           fontWeight: 700,
//           letterSpacing: "0.07em",
//           textTransform: "uppercase",
//           color: "#64748b"
//         }}
//       >
//         {label}
//       </label>
//       {children}
//     </div>
//   )

//   const inputCls = {
//     width: "100%",
//     padding: "7px 11px",
//     fontSize: 13,
//     borderRadius: 8,
//     border: "1.5px solid #e2e8f0",
//     background: "#f8fafc",
//     color: "#0f172a",
//     outline: "none",
//     transition: "border-color 0.15s, box-shadow 0.15s"
//   }

//   const readonlyInputCls = {
//     ...inputCls,
//     background: "#f1f5f9",
//     color: "#475569",
//     cursor: "not-allowed"
//   }

//   const onFocus = (e) => {
//     e.target.style.borderColor = "#3b82f6"
//     e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"
//     e.target.style.background = "#fff"
//   }
//   const onBlur = (e) => {
//     e.target.style.borderColor = "#e2e8f0"
//     e.target.style.boxShadow = "none"
//     e.target.style.background = "#f8fafc"
//   }

//   return (
//     /* ── Overlay ── */
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
//       onClick={() => closemodal(false)}
//     >
//       {/* ── Modal card ── */}
//       <div
//         className="relative w-full flex flex-col bg-[#ADD8E6]"
//         style={{
//           maxWidth: 820,
//           maxHeight: "92vh",
//           margin: "0 16px",
//           // background: "#fff",
//           borderRadius: 18,
//           boxShadow:
//             "0 0 0 1px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.18), 0 32px 80px rgba(0,0,0,0.14)",
//           overflow: "hidden"
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ══════════ HEADER ══════════ */}
//         <div
//           className="flex-shrink-0 flex items-center justify-between px-6 py-4"
//           style={{
//             background:
//               "linear-gradient(130deg,#0c1e3d 0%,#1a3560 55%,#1e4480 100%)",
//             borderBottom: "1px solid rgba(255,255,255,0.07)"
//           }}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 10,
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.14)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0
//               }}
//             >
//               <ClipboardCheck size={17} color="rgba(255,255,255,0.85)" />
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontSize: 15,
//                   fontWeight: 700,
//                   color: "#f1f5f9",
//                   letterSpacing: "0.01em"
//                 }}
//               >
//                 Collection Update
//               </div>
//               <div
//                 style={{
//                   fontSize: 11,
//                   color: "rgba(255,255,255,0.4)",
//                   marginTop: 2
//                 }}
//               >
//                 Update payment and collection details
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Lead ID badge */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "5px 13px",
//                 borderRadius: 99,
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: "#7dd3fc",
//                 letterSpacing: "0.04em"
//               }}
//             >
//               Lead ID :{" "}
//               <span style={{ color: "#38bdf8" }}>{data?.leadId ?? "—"}</span>
//             </div>

//             <button
//               onClick={() => closemodal(false)}
//               style={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 transition: "background 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "rgba(255,255,255,0.2)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "rgba(255,255,255,0.1)"
//               }}
//             >
//               <X size={15} color="rgba(255,255,255,0.8)" />
//             </button>
//           </div>
//         </div>

//         {/* ══════════ BODY ══════════ */}
//         <div
//           className="flex-1 overflow-y-auto"
//           style={{ padding: "24px 24px 0" }}
//         >
//           <form onSubmit={handleSubmit} id="collection-form">
//             <div className="flex gap-6">
//               {/* ── LEFT COLUMN: Customer info (read-only) ── */}
//               <div
//                 className="flex flex-col gap-3"
//                 style={{
//                   flex: "0 0 calc(55% - 12px)",
//                   padding: "18px 18px",
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 10.5,
//                     fontWeight: 800,
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     color: "#94a3b8",
//                     marginBottom: 4,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8
//                   }}
//                 >
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(90deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                   Customer Information
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(270deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                 </div>

//                 {/* Customer Name */}
//                 <Field label="Customer Name">
//                   <input
//                     style={readonlyInputCls}
//                     value={data?.customerName?.customerName ?? ""}
//                     readOnly
//                   />
//                 </Field>

//                 {/* Address */}
//                 <Field label="Address">
//                   <input
//                     style={readonlyInputCls}
//                     value={data?.customerName?.address ?? ""}
//                     readOnly
//                   />
//                 </Field>

//                 {/* Mobile + Email */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Mobile">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.mobile ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                   <Field label="Email">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.email ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                 </div>

//                 {/* Pin + Country */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Pin">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.pincode ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                   <Field label="Country">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.country ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                 </div>

//                 {/* State + City */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="State">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.state ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                   <Field label="City">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.city ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                 </div>

//                 {/* Registration Type + Registration No */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Registration Type">
//                     {/* <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.registrationType ?? ""}
//                       readOnly
//                     /> */}
//                     <select
//                       name="registrationType"
//                       value={formData.registrationType}
//                       onChange={(e) => handleChange(e)}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm  focus:outline-none cursor-pointer bg-gray-50"
//                     >
//                       <option value="">Select RegistrationType</option>
//                       <option value="unregistered">
//                         Unregistered/Consumer
//                       </option>
//                       <option value="regular">Regular</option>
//                     </select>
//                     {/* {error && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {error?.registrationType}
//                       </p>
//                     )} */}
//                   </Field>
//                   <Field label="Registration No">
//                     <input
//                       style={readonlyInputCls}
//                       value={data?.customerName?.registrationNo ?? ""}
//                       readOnly
//                     />
//                   </Field>
//                 </div>
//               </div>

//               {/* ── RIGHT COLUMN: Editable collection fields ── */}
//               <div
//                 className="flex flex-col gap-3"
//                 style={{
//                   flex: "0 0 calc(45% - 12px)",
//                   padding: "18px 18px",
//                   background: "#fff",
//                   borderRadius: 12,
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 10.5,
//                     fontWeight: 800,
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     color: "#94a3b8",
//                     marginBottom: 4,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8
//                   }}
//                 >
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(90deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                   Payment Details
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(270deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                 </div>

//                 {/* Submission Date + Status */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Submission Date">
//                     <input
//                       type="date"
//                       name="submissionDate"
//                       value={formData.submissionDate}
//                       onChange={handleChange}
//                       onFocus={onFocus}
//                       onBlur={onBlur}
//                       style={inputCls}
//                       required
//                     />
//                   </Field>
//                   <Field label="Status">
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleChange}
//                       onFocus={onFocus}
//                       onBlur={onBlur}
//                       style={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Pending">Pending</option>
//                       <option value="Partial">Partial</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </Field>
//                 </div>

//                 {/* Project Amount + Received Amount */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Project Amount">
//                     <div style={{ position: "relative" }}>
//                       <IndianRupee
//                         size={12}
//                         style={{
//                           position: "absolute",
//                           left: 9,
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           color: "#94a3b8"
//                         }}
//                       />
//                       <input
//                         type="number"
//                         name="projectAmount"
//                         value={formData.projectAmount}
//                         onChange={handleChange}
//                         onFocus={onFocus}
//                         onBlur={onBlur}
//                         style={{ ...inputCls, paddingLeft: 26 }}
//                         placeholder="0.00"
//                       />
//                     </div>
//                   </Field>
//                   <Field label="Received Amount">
//                     <div style={{ position: "relative" }}>
//                       <IndianRupee
//                         size={12}
//                         style={{
//                           position: "absolute",
//                           left: 9,
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           color: "#94a3b8"
//                         }}
//                       />
//                       <input
//                         type="number"
//                         name="receivedAmount"
//                         value={formData.receivedAmount}
//                         onChange={handleChange}
//                         onFocus={onFocus}
//                         onBlur={onBlur}
//                         style={{ ...inputCls, paddingLeft: 26 }}
//                         placeholder="0.00"
//                         required
//                       />
//                     </div>
//                   </Field>
//                 </div>

//                 {/* Balance Amount — auto-calculated */}
//                 <Field label="Balance Amount">
//                   <div
//                     style={{
//                       ...readonlyInputCls,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       fontWeight: 700,
//                       color:
//                         balanceAmount > 0
//                           ? "#b45309"
//                           : balanceAmount < 0
//                             ? "#be123c"
//                             : "#166534",
//                       background:
//                         balanceAmount > 0
//                           ? "#fffbeb"
//                           : balanceAmount < 0
//                             ? "#fff1f2"
//                             : "#f0fdf4",
//                       border: `1.5px solid ${balanceAmount > 0 ? "#fde047" : balanceAmount < 0 ? "#fda4af" : "#86efac"}`
//                     }}
//                   >
//                     <IndianRupee size={12} />
//                     {Math.abs(balanceAmount).toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2
//                     })}
//                     {balanceAmount < 0 && (
//                       <span
//                         style={{
//                           fontSize: 10,
//                           fontWeight: 600,
//                           color: "#be123c",
//                           marginLeft: 4
//                         }}
//                       >
//                         (Excess)
//                       </span>
//                     )}
//                   </div>
//                 </Field>

//                 {/* Partner */}
//                 {partnerlist?.length > 0 && (
//                   <Field label="Partner">
//                     <select
//                       name="partner"
//                       onChange={handleChange}
//                       onFocus={onFocus}
//                       onBlur={onBlur}
//                       style={inputCls}
//                     >
//                       <option value="">Select partner</option>
//                       {partnerlist.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.partnerName}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                 )}

//                 {/* Bank Remark */}
//                 <Field label="Bank Remark" className="flex-1">
//                   <textarea
//                     name="bankRemark"
//                     value={formData.bankRemark}
//                     onChange={handleChange}
//                     onFocus={onFocus}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e2e8f0"
//                       e.target.style.boxShadow = "none"
//                       e.target.style.background = "#f8fafc"
//                     }}
//                     placeholder="Enter bank remarks or notes..."
//                     rows={4}
//                     style={{
//                       ...inputCls,
//                       resize: "vertical",
//                       lineHeight: 1.55,
//                       minHeight: 90
//                     }}
//                   />
//                 </Field>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* ══════════ FOOTER ══════════ */}
//         <div
//           className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-[#ADD8E6]"
//           style={{
//             borderTop: "1px solid #e2e8f0",
//             // background: "#f8fafc",
//             marginTop: 20
//           }}
//         >
//           {/* summary pills */}
//           <div className="flex items-center gap-3 flex-wrap">
//             {formData.receivedAmount && (
//               <span
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 5,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#166534",
//                   background: "#dcfce7",
//                   border: "1.5px solid #86efac",
//                   borderRadius: 99,
//                   padding: "3px 11px 3px 8px"
//                 }}
//               >
//                 <IndianRupee size={11} />
//                 Received:{" "}
//                 {parseFloat(formData.receivedAmount).toLocaleString("en-IN")}
//               </span>
//             )}
//             {formData.projectAmount && (
//               <span
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 5,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#1e40af",
//                   background: "#dbeafe",
//                   border: "1.5px solid #93c5fd",
//                   borderRadius: 99,
//                   padding: "3px 11px 3px 8px"
//                 }}
//               >
//                 <IndianRupee size={11} />
//                 Project:{" "}
//                 {parseFloat(formData.projectAmount).toLocaleString("en-IN")}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => closemodal(false)}
//               style={{
//                 padding: "8px 20px",
//                 borderRadius: 9,
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "#475569",
//                 background: "#fff",
//                 border: "1.5px solid #e2e8f0",
//                 cursor: "pointer",
//                 transition: "all 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#f1f5f9"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "#fff"
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               form="collection-form"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 7,
//                 padding: "8px 22px",
//                 borderRadius: 9,
//                 fontSize: 13,
//                 fontWeight: 700,
//                 color: "#fff",
//                 background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
//                 border: "none",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
//                 transition: "all 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background =
//                   "linear-gradient(135deg,#1e40af,#1d4ed8)"
//                 e.currentTarget.style.boxShadow =
//                   "0 4px 14px rgba(37,99,235,0.45)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background =
//                   "linear-gradient(135deg,#1d4ed8,#2563eb)"
//                 e.currentTarget.style.boxShadow =
//                   "0 2px 8px rgba(37,99,235,0.35)"
//               }}
//             >
//               <ClipboardCheck size={15} />
//               Update Collection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// /current live test code////
// import { useState, useEffect } from "react"
// import { X, IndianRupee, ClipboardCheck } from "lucide-react"

// export function CollectionupdateModal({
//   data,
//   closemodal,
//   partnerlist,
//   loggedUser,
//   handleCollectionUpdate
// }) {
//   const [error, setError] = useState({})
//   const [formData, setFormData] = useState({
//     submissionDate: "",
//     projectAmount: "",
//     receivedAmount: "",
//     bankRemark: "",
//     registrationType: "",
//     registrationNo: "",
//     customerName: "",
//     address: "",
//     mobile: "",
//     email: "",
//     pin: "",
//     country: "",
//     state: "",
//     city: "",
//     partner: ""
//   })

//   const baseInput =
//     "w-full px-2.5 py-1.5 text-[13px] rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
//   const readonlyInput =
//     "w-full px-2.5 py-1.5 text-[13px] rounded-lg border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"

//   useEffect(() => {
//     const today = new Date()
//     const yyyy = today.getFullYear()
//     const mm = String(today.getMonth() + 1).padStart(2, "0")
//     const dd = String(today.getDate()).padStart(2, "0")
//     const current = `${yyyy}-${mm}-${dd}`
//     setFormData((prev) => ({
//       ...prev,
//       submissionDate: current
//     }))
//   }, [])

//   useEffect(() => {
//     if (!data) return
//     console.log(data)
// console.log(   data.receivedAmount !== undefined && data.receivedAmount !== null
//           ? String(data.receivedAmount)
//           : "",)
//     setFormData((prev) => ({
//       ...prev,
//       totalpaidAmountBefore: data?.totalPaidAmount,
//       customerId: data?.customerName?._id,
//       projectAmount:
//         data.netAmount !== undefined && data.netAmount !== null
//           ? String(data.netAmount)
//           : "",
//       receivedAmount:
//         data.receivedAmount !== undefined && data.receivedAmount !== null
//           ? String(data.receivedAmount)
//           : "",
//       bankRemark: data.bankRemark ?? "",
//       registrationType: data.customerName?.registrationType ?? "",
//       registrationNo: data.customerName?.registrationNo ?? "",
//       customerName: data.customerName?.customerName ?? "",
//       address: data.customerName?.address1 ?? "",
//       mobile: data.mobile ?? "",
//       email: data.email ?? "",
//       pin: data.customerName?.pincode ?? "",
//       country: data.customerName?.country ?? "",
//       state: data.customerName?.state ?? "",
//       city: data.customerName?.city ?? "",
//       partner: data?.partner?._id ?? ""
//     }))
//   }, [data])

//   const safeNumber = (v) => {
//     const n = parseFloat(v)
//     return Number.isFinite(n) ? n : 0
//   }
// const totalpaid=formData.receivedAmount +=data?.totalPaidAmount
// console.log(formData.receivedAmount)
//   const balanceAmount =
//     safeNumber(formData.projectAmount) -
//     safeNumber(totalpaid)

// console.log(formData)
//   const handleChange = (e) => {
//     const { name, value } = e.target

//     // 1) Always update formData with raw value
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }))

//     // 2) Validation only updates error, never formData again
//     if (name === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//       setError((prev) => ({
//         ...prev,
//         email: value && !emailRegex.test(value) ? "Email id is not correct" : ""
//       }))
//       return
//     }

//     if (name === "mobile") {
//       const mobileRegex = /^[6-9]\d{9}$/
//       let msg = ""
//       if (!value) msg = "Mobile number is required"
//       else if (!/^\d+$/.test(value))
//         msg = "Mobile number must contain only digits"
//       else if (value.length !== 10) msg = "Mobile number must be 10 digits"
//       else if (!mobileRegex.test(value)) msg = "Mobile number is not valid"
//       setError((prev) => ({ ...prev, mobile: msg }))
//       return
//     }

//     if (name === "pincode") {
//       const postalCodePatterns = {
//         INDIA: /^[1-9][0-9]{5}$/,
//         IN: /^[1-9][0-9]{5}$/,
//         USA: /^\d{5}(-\d{4})?$/,
//         CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
//         GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
//         AU: /^\d{4}$/,
//         DE: /^\d{5}$/,
//         FR: /^\d{5}$/,
//         JP: /^\d{3}-?\d{4}$/,
//         SG: /^\d{6}$/
//       }
//       if (!formData.country) {
//         setError((prev) => ({
//           ...prev,
//           pincode: "please fill country before pincode"
//         }))
//         return
//       }
//       const pattern = postalCodePatterns[formData.country.toUpperCase()]
//       if (!pattern) return
//       setError((prev) => ({
//         ...prev,
//         pincode: value && !pattern.test(value) ? "Invalid pincode" : ""
//       }))
//       return
//     }

//     setError((prev) => ({ ...prev, [name]: "" }))
//   }
//   console.log(data)
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const payload = {
//       leadId: data?.leadId,
//       leadDocId: data?._id,
//       ...formData,
//       projectAmount: safeNumber(formData.projectAmount),
//       receivedAmount: safeNumber(formData.receivedAmount),
//       balanceAmount,
//       updatedBy: loggedUser?._id
//     }
//     const res = await handleCollectionUpdate(payload)
//     if (res?.status === 200) closemodal(false)
//   }

//   const isRegular = formData.registrationType === "regular"
//   console.log(partnerlist)
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       style={{ backdropFilter: "blur(4px)", background: "rgba(15,23,42,0.55)" }}
//     >
//       <div
//         className="absolute inset-0"
//         onClick={() => closemodal(false)}
//         style={{ zIndex: 0 }}
//       />

//       <div
//         className="relative w-full flex flex-col bg-[#ADD8E6]"
//         style={{
//           maxWidth: 820,
//           maxHeight: "92vh",
//           margin: "0 12px",
//           borderRadius: 18,
//           boxShadow:
//             "0 0 0 1px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.18), 0 32px 80px rgba(0,0,0,0.14)",
//           overflow: "hidden",
//           zIndex: 1
//         }}
//       >
//         {/* HEADER */}
//         <div
//           className="flex-shrink-0 flex items-center justify-between px-5 py-2"
//           style={{
//             background:
//               "linear-gradient(130deg,#0c1e3d 0%,#1a3560 55%,#1e4480 100%)",
//             borderBottom: "1px solid rgba(255,255,255,0.07)"
//           }}
//         >
//           <div className="flex items-center gap-2.5">
//             <div
//               style={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: 10,
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.14)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0
//               }}
//             >
//               <ClipboardCheck size={15} color="rgba(255,255,255,0.85)" />
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 700,
//                   color: "#f1f5f9",
//                   letterSpacing: "0.01em"
//                 }}
//               >
//                 Collection Update
//               </div>
//               <div
//                 style={{
//                   fontSize: 10,
//                   color: "rgba(255,255,255,0.4)",
//                   marginTop: 1
//                 }}
//               >
//                 Update payment and collection details
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2.5">
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//                 padding: "4px 11px",
//                 borderRadius: 99,
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//                 fontSize: 11,
//                 fontWeight: 700,
//                 color: "#7dd3fc",
//                 letterSpacing: "0.04em"
//               }}
//             >
//               Lead ID :{" "}
//               <span style={{ color: "#38bdf8" }}>{data?.leadId ?? "—"}</span>
//             </div>

//             <button
//               type="button"
//               onClick={() => closemodal(false)}
//               style={{
//                 width: 28,
//                 height: 28,
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.1)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 transition: "background 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "rgba(255,255,255,0.2)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "rgba(255,255,255,0.1)"
//               }}
//             >
//               <X size={14} color="rgba(255,255,255,0.8)" />
//             </button>
//           </div>
//         </div>

//         {/* BODY */}
//         <div
//           className="flex-1 overflow-y-auto"
//           style={{ padding: "18px 18px 0" }}
//         >
//           <form onSubmit={handleSubmit} id="collection-form">
//             <div className="flex gap-4">
//               {/* LEFT COLUMN */}
//               <div
//                 className="flex flex-col gap-2.5"
//                 style={{
//                   flex: "0 0 calc(55% - 10px)",
//                   padding: "14px 14px",
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.08em",
//                     textTransform: "uppercase",
//                     color: "#000000",
//                     marginBottom: 2,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6
//                   }}
//                 >
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(90deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                   Customer Information
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(270deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                 </div>

//                 {/* Customer Name */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                     Customer Name
//                   </label>
//                   <input
//                     name="customerName"
//                     value={formData.customerName}
//                     readOnly
//                     className={readonlyInput}
//                   />
//                 </div>

//                 {/* Address */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                     Address
//                   </label>
//                   <input
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className={baseInput}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   {/* Mobile */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Mobile
//                     </label>
//                     <input
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                     {error.mobile && (
//                       <p className="text-xs text-red-500">{error.mobile}</p>
//                     )}
//                   </div>

//                   {/* Email */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Email
//                     </label>
//                     <input
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                     {error.email && (
//                       <p className="text-xs text-red-500">{error.email}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   {/* Pin */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Pin
//                     </label>
//                     <input
//                       name="pin"
//                       value={formData.pin}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                   </div>

//                   {/* Country */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Country
//                     </label>
//                     <input
//                       name="country"
//                       value={formData.country}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                     {error.country && (
//                       <p className="text-xs text-red-500">{error.country}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   {/* State */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       State
//                     </label>
//                     <input
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                     {error.state && (
//                       <p className="text-xs text-red-500">{error.state}</p>
//                     )}
//                   </div>

//                   {/* City */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       City
//                     </label>
//                     <input
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className={baseInput}
//                     />
//                     {error.city && (
//                       <p className="text-xs text-red-500">{error.city}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   {/* Registration Type */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Registration Type
//                     </label>
//                     <select
//                       name="registrationType"
//                       value={formData.registrationType}
//                       onChange={handleChange}
//                       className="mt-0 block w-full border border-slate-200 rounded-md shadow-sm px-2 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
//                     >
//                       <option value="">Select Registration Type</option>
//                       <option value="unregistered">
//                         Unregistered/Consumer
//                       </option>
//                       <option value="regular">Regular</option>
//                     </select>
//                   </div>

//                   {/* Registration No */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Registration No
//                     </label>
//                     <input
//                       name="registrationNo"
//                       value={formData.registrationNo}
//                       onChange={handleChange}
//                       className={isRegular ? baseInput : readonlyInput}
//                       readOnly={!isRegular}
//                       disabled={!isRegular}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT COLUMN */}
//               <div
//                 className="flex flex-col gap-2.5"
//                 style={{
//                   flex: "0 0 calc(45% - 10px)",
//                   padding: "14px 14px",
//                   background: "#fff",
//                   borderRadius: 12,
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.08em",
//                     textTransform: "uppercase",
//                     color: "#000000",
//                     marginBottom: 2,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6
//                   }}
//                 >
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(90deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                   Payment Details
//                   <span
//                     style={{
//                       flex: 1,
//                       height: 1,
//                       background: "linear-gradient(270deg,#e2e8f0,transparent)"
//                     }}
//                   />
//                 </div>

//                 {/* Submission Date */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                     Submission Date
//                   </label>
//                   <input
//                     type="date"
//                     name="submissionDate"
//                     value={formData.submissionDate}
//                     readOnly
//                     className={readonlyInput}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   {/* Net Amount */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Net Amount
//                     </label>
//                     <div className="relative">
//                       <IndianRupee
//                         size={12}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
//                       />
//                       <input
//                         type="text"
//                         name="projectAmount"
//                         value={formData.projectAmount}
//                         readOnly
//                         className={`${readonlyInput} pl-6`}
//                       />
//                     </div>
//                   </div>

//                   {/* Received Amount */}
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Received Amount
//                     </label>
//                     <div className="relative">
//                       <IndianRupee
//                         size={12}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
//                       />
//                       <input
//                         type="text"
//                         inputMode="decimal"
//                         name="receivedAmount"
//                         value={formData.receivedAmount}
//                         onChange={handleChange}
//                         className={`${baseInput} pl-6`}
//                         placeholder="0.00"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Balance Amount */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                     Balance Amount
//                   </label>
//                   <div
//                     className="flex items-center gap-1.5 text-[13px] font-bold rounded-lg px-2.5 py-1.5"
//                     style={{
//                       color:
//                         balanceAmount > 0
//                           ? "#b45309"
//                           : balanceAmount < 0
//                             ? "#be123c"
//                             : "#166534",
//                       background:
//                         balanceAmount > 0
//                           ? "#fffbeb"
//                           : balanceAmount < 0
//                             ? "#fff1f2"
//                             : "#f0fdf4",
//                       border: `1.5px solid ${
//                         balanceAmount > 0
//                           ? "#fde047"
//                           : balanceAmount < 0
//                             ? "#fda4af"
//                             : "#86efac"
//                       }`
//                     }}
//                   >
//                     <IndianRupee size={12} />
//                     {Math.abs(balanceAmount).toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2
//                     })}
//                     {balanceAmount < 0 && (
//                       <span className="text-[10px] font-semibold text-rose-700 ml-1">
//                         (Excess)
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Partner */}
//                 {partnerlist?.length > 0 && (
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                       Associate with
//                     </label>
//                     <select
//                       name="partner"
//                       value={formData.partner}
//                       onChange={handleChange}
//                       className={baseInput}
//                     >
//                       <option value="">Select partner</option>
//                       {partnerlist.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p?.partner || p?.partnerName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* Bank Remark */}
//                 <div className="flex flex-col gap-1 flex-1">
//                   <label className="text-[10px] font-semibold tracking-[0.05em] uppercase text-black">
//                     Bank Remark
//                   </label>
//                   <textarea
//                     name="bankRemark"
//                     value={formData.bankRemark}
//                     onChange={handleChange}
//                     placeholder="Enter bank remarks or notes..."
//                     rows={3}
//                     className={`${baseInput} resize-y leading-[1.45] min-h-[70px]`}
//                   />
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* FOOTER */}
//         <div
//           className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-3 bg-[#ADD8E6]"
//           style={{
//             borderTop: "1px solid #e2e8f0",
//             marginTop: 14
//           }}
//         >
//           <div className="flex items-center gap-2 flex-wrap">
//             {formData.receivedAmount && (
//               <span
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 4,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#166534",
//                   background: "#dcfce7",
//                   border: "1.5px solid #86efac",
//                   borderRadius: 99,
//                   padding: "3px 10px 3px 7px"
//                 }}
//               >
//                 <IndianRupee size={11} />
//                 Received:{" "}
//                 {safeNumber(formData.receivedAmount).toLocaleString("en-IN")}
//               </span>
//             )}
//             {formData.projectAmount && (
//               <span
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 4,
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#1e40af",
//                   background: "#dbeafe",
//                   border: "1.5px solid #93c5fd",
//                   borderRadius: 99,
//                   padding: "3px 10px 3px 7px"
//                 }}
//               >
//                 <IndianRupee size={11} />
//                 Net:{" "}
//                 {safeNumber(formData.projectAmount).toLocaleString("en-IN")}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2.5">
//             <button
//               type="button"
//               onClick={() => closemodal(false)}
//               style={{
//                 padding: "7px 18px",
//                 borderRadius: 9,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "#475569",
//                 background: "#fff",
//                 border: "1.5px solid #e2e8f0",
//                 cursor: "pointer",
//                 transition: "all 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#f1f5f9"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "#fff"
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               form="collection-form"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "7px 20px",
//                 borderRadius: 9,
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: "#fff",
//                 background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
//                 border: "none",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
//                 transition: "all 0.15s"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background =
//                   "linear-gradient(135deg,#1e40af,#1d4ed8)"
//                 e.currentTarget.style.boxShadow =
//                   "0 4px 14px rgba(37,99,235,0.45)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background =
//                   "linear-gradient(135deg,#1d4ed8,#2563eb)"
//                 e.currentTarget.style.boxShadow =
//                   "0 2px 8px rgba(37,99,235,0.35)"
//               }}
//             >
//               <ClipboardCheck size={14} />
//               Update Collection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect } from "react"
// import { X, IndianRupee, ClipboardCheck, Lock } from "lucide-react"

// /* ─── helpers ─── */
// const safeNumber = (v) => {
//   const n = parseFloat(v)
//   return Number.isFinite(n) ? n : 0
// }

// const todayString = () => {
//   const d = new Date()
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
// }

// const emptyRow = () => ({
//   id: crypto.randomUUID(),
//   label: "",
//   netAmount: "",
//   receivedAmount: "",
//   _balance: undefined,
//   _netAmt: 0,
//   _paidSoFar: 0
// })

// /* ─── sub-components ─── */
// function SectionTitle({ children }) {
//   return (
//     <div
//       style={{
//         fontSize: 9.5,
//         fontWeight: 700,
//         letterSpacing: "0.09em",
//         textTransform: "uppercase",
//         color: "#64748b",
//         display: "flex",
//         alignItems: "center",
//         gap: 6,
//         marginBottom: 6
//       }}
//     >
//       <span
//         style={{
//           flex: 1,
//           height: 1,
//           background: "linear-gradient(90deg,#e2e8f0,transparent)"
//         }}
//       />
//       {children}
//       <span
//         style={{
//           flex: 1,
//           height: 1,
//           background: "linear-gradient(270deg,#e2e8f0,transparent)"
//         }}
//       />
//     </div>
//   )
// }

// function Field({ label, error, children }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//       <label
//         style={{
//           fontSize: 9.5,
//           fontWeight: 600,
//           letterSpacing: "0.05em",
//           textTransform: "uppercase",
//           color: "#374151"
//         }}
//       >
//         {label}
//       </label>
//       {children}
//       {error && (
//         <p style={{ fontSize: 10.5, color: "#ef4444", marginTop: 1 }}>
//           {error}
//         </p>
//       )}
//     </div>
//   )
// }

// function AmtInput({ value, onChange, highlight }) {
//   return (
//     <div style={{ position: "relative" }}>
//       <IndianRupee
//         size={9}
//         style={{
//           position: "absolute",
//           left: 5,
//           top: "50%",
//           transform: "translateY(-50%)",
//           color: "#94a3b8",
//           pointerEvents: "none"
//         }}
//       />
//       <input
//         type="text"
//         inputMode="decimal"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="0"
//         style={{
//           width: "100%",
//           paddingLeft: 16,
//           paddingRight: 4,
//           paddingTop: 4,
//           paddingBottom: 4,
//           fontSize: 11,
//           border: `1px solid ${highlight ? "#bfdbfe" : "#e2e8f0"}`,
//           borderRadius: 6,
//           background: highlight ? "#eff6ff" : "#f8fafc",
//           outline: "none",
//           color: "#1e293b",
//           fontFamily: "inherit"
//         }}
//         onFocus={(e) => {
//           e.target.style.borderColor = "#6366f1"
//         }}
//         onBlur={(e) => {
//           e.target.style.borderColor = highlight ? "#bfdbfe" : "#e2e8f0"
//         }}
//       />
//     </div>
//   )
// }

// function TotalCell({ value, color, green, abs }) {
//   const display = abs ? Math.abs(value) : value
//   return (
//     <span
//       style={{
//         fontSize: 11,
//         fontWeight: 700,
//         color,
//         ...(green
//           ? {
//               background: "#dcfce7",
//               border: "1px solid #86efac",
//               borderRadius: 6,
//               padding: "3px 6px"
//             }
//           : {}),
//         display: "flex",
//         alignItems: "center",
//         gap: 2
//       }}
//     >
//       <IndianRupee size={9} />
//       {display.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//     </span>
//   )
// }

// function SummaryChip({ label, value, color, bg, border, suffix = "" }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "6px 10px",
//         borderRadius: 8,
//         background: bg,
//         border: `1px solid ${border}`
//       }}
//     >
//       <span style={{ fontSize: 10.5, fontWeight: 600, color, opacity: 0.8 }}>
//         {label}
//       </span>
//       <span
//         style={{
//           fontSize: 12,
//           fontWeight: 700,
//           color,
//           display: "flex",
//           alignItems: "center",
//           gap: 3
//         }}
//       >
//         <IndianRupee size={10} />
//         {value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//         {suffix && <span style={{ fontSize: 9.5 }}>{suffix}</span>}
//       </span>
//     </div>
//   )
// }

// /* ══════════════════════════════════════════════════════
// MAIN MODAL
// ══════════════════════════════════════════════════════ */
// export function CollectionupdateModal({
//   data,
//   closemodal,
//   partnerlist,
//   loggedUser,
//   handleCollectionUpdate
// }) {
//   const [error, setError] = useState({})
//   const [formData, setFormData] = useState({
//     submissionDate: todayString(),
//     bankRemark: "",
//     registrationType: "",
//     registrationNo: "",
//     customerName: "",
//     address: "",
//     mobile: "",
//     email: "",
//     pin: "",
//     country: "",
//     state: "",
//     city: "",
//     partner: "",
//     customerId: ""
//   })
//   const [paymentRows, setPaymentRows] = useState([emptyRow()])
//   console.log(paymentRows)

//   const base = {
//     width: "100%",
//     padding: "5px 9px",
//     fontSize: 12,
//     border: "1px solid #e2e8f0",
//     borderRadius: 7,
//     background: "#f8fafc",
//     outline: "none",
//     color: "#1e293b",
//     transition: "border 0.15s, box-shadow 0.15s",
//     fontFamily: "inherit"
//   }
//   const readonly = {
//     ...base,
//     background: "#f1f5f9",
//     color: "#94a3b8",
//     cursor: "not-allowed"
//   }

//   const focusOn = (e) => {
//     e.target.style.borderColor = "#6366f1"
//     e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"
//   }
//   const focusOff = (e) => {
//     e.target.style.borderColor = "#e2e8f0"
//     e.target.style.boxShadow = "none"
//   }

//   /* ── seed from data ── */
//   useEffect(() => {
//     if (!data) return
//     setFormData((prev) => ({
//       ...prev,
//       customerId: data?.customerName?._id ?? "",
//       bankRemark: data.bankRemark ?? "",
//       registrationType: data.customerName?.registrationType ?? "",
//       registrationNo: data.customerName?.registrationNo ?? "",
//       customerName: data.customerName?.customerName ?? "",
//       address: data.customerName?.address1 ?? "",
//       mobile: data.mobile ?? "",
//       email: data.email ?? "",
//       pin: data.customerName?.pincode ?? "",
//       country: data.customerName?.country ?? "",
//       state: data.customerName?.state ?? "",
//       city: data.customerName?.city ?? "",
//       partner: data?.partner?._id ?? ""
//     }))

//     // ✅ Use leadFor instead of products
//     if (Array.isArray(data.leadFor) && data.leadFor.length > 0) {
//       console.log(data?.leadFor)
//       setPaymentRows(
//         data.leadFor.map((p) => {
//           const net = safeNumber(p.netAmount ?? p.productPrice)
//           // Per-item paidSoFar: not available in leadFor directly,
//           // so we spread totalPaidAmount proportionally or default to 0
//           const paid = 0 // update this if your API returns per-product paid amounts
//           return {
//             id: crypto.randomUUID(),
//             label: p.productorServiceId.productName ?? "product",
//             netAmount: String(net),
//             receivedAmount: "",
//             _balance: net - paid,
//             _netAmt: net,
//             _paidSoFar: paid
//           }
//         })
//       )
//     } else {
//       const net = safeNumber(data.netAmount)
//       const paid = safeNumber(data.totalPaidAmount)
//       setPaymentRows([
//         {
//           id: crypto.randomUUID(),
//           label: "Payment",
//           netAmount: String(net),
//           receivedAmount: "",
//           _balance: net - paid,
//           _netAmt: net,
//           _paidSoFar: paid
//         }
//       ])
//     }
//   }, [data])

//   /* ── row helpers ── */
//   // ✅ Removed addRow, removeRow — rows are fixed from leadFor
//   const updateRow = (id, field, value) =>
//     setPaymentRows((prev) =>
//       prev.map((r) => {
//         if (r.id !== id) return r
//         const updated = { ...r, [field]: value }
//         if (field === "netAmount") {
//           updated._netAmt = safeNumber(value)
//           updated._balance = safeNumber(value) - safeNumber(r._paidSoFar ?? 0)
//         }
//         return updated
//       })
//     )

//   const rowBalance = (r) =>
//     safeNumber(r.netAmount) -
//     safeNumber(r._paidSoFar ?? 0) -
//     safeNumber(r.receivedAmount)
//   const isRowLocked = (r) => r._balance !== undefined && r._balance <= 0

//   const totalNet = paymentRows.reduce((s, r) => s + safeNumber(r.netAmount), 0)
//   const totalReceived = paymentRows.reduce(
//     (s, r) => s + safeNumber(r.receivedAmount),
//     0
//   )
//   const totalBalance = paymentRows.reduce((s, r) => s + rowBalance(r), 0)

//   /* ── field change ── */
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (name === "email") {
//       setError((p) => ({
//         ...p,
//         email:
//           value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
//             ? "Invalid email"
//             : ""
//       }))
//       return
//     }
//     if (name === "mobile") {
//       let msg = ""
//       if (!value) msg = "Required"
//       else if (!/^\d+$/.test(value)) msg = "Digits only"
//       else if (value.length !== 10) msg = "10 digits required"
//       else if (!/^[6-9]\d{9}$/.test(value)) msg = "Invalid number"
//       setError((p) => ({ ...p, mobile: msg }))
//       return
//     }
//     setError((p) => ({ ...p, [name]: "" }))
//   }

//   /* ── submit ── */
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const payload = {
//       leadId: data?.leadId,
//       leadDocId: data?._id,
//       ...formData,
//       paymentEntries: paymentRows.map((r) => ({
//         label: r.label,
//         netAmount: safeNumber(r.netAmount),
//         receivedAmount: safeNumber(r.receivedAmount),
//         balanceAmount: rowBalance(r)
//       })),
//       totalNetAmount: totalNet,
//       totalReceivedAmount: totalReceived,
//       updatedBy: loggedUser?._id
//     }
//     const res = await handleCollectionUpdate(payload)
//     if (res?.status === 200) closemodal(false)
//   }

//   const isRegular = formData.registrationType === "regular"
//   const balColor =
//     totalBalance > 0 ? "#b45309" : totalBalance < 0 ? "#be123c" : "#166534"

//   /* ════════ RENDER ════════ */
//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", background: "rgba(15,23,42,0.55)" }}>
//       <div style={{ position: "absolute", inset: 0, zIndex: 0 }} onClick={() => closemodal(false)} />

//       <div style={{
//         position: "relative", zIndex: 1,
//         width: "calc(100vw - 24px)", maxWidth: 1120, maxHeight: "93vh",
//         display: "flex", flexDirection: "column",
//         borderRadius: 18, overflow: "hidden", background: "#f1f5f9",
//         boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.22), 0 40px 80px rgba(0,0,0,0.16)",
//       }}>

//         {/* ── HEADER ── */}
//         <div style={{
//           flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "11px 20px",
//           background: "linear-gradient(130deg,#0c1e3d 0%,#1a3560 55%,#1e4480 100%)",
//           borderBottom: "1px solid rgba(255,255,255,0.07)",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <ClipboardCheck size={15} color="rgba(255,255,255,0.85)" />
//             </div>
//             <div>
//               <div style={{ fontSize: 13.5, fontWeight: 700, color: "#f1f5f9" }}>Collection Update</div>
//               <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Update payment and collection details</div>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 11px", borderRadius: 99, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, color: "#7dd3fc" }}>
//               Lead ID: <span style={{ color: "#38bdf8" }}>{data?.leadId ?? "—"}</span>
//             </div>
//             <button type="button" onClick={() => closemodal(false)}
//               style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
//               onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
//               onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
//             >
//               <X size={13} color="rgba(255,255,255,0.85)" />
//             </button>
//           </div>
//         </div>

//         {/* ── 3-COLUMN BODY ── */}
//         <form id="collection-form" onSubmit={handleSubmit} style={{
//           flex: 1, display: "grid",
//           gridTemplateColumns: "1fr 210px 1fr",
//           gap: 10, padding: 12,
//           overflow: "hidden", minHeight: 0,
//         }}>

//           {/* COL 1 — Customer Information */}
//           <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "13px", display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
//             <SectionTitle>Customer Information</SectionTitle>

//             <Field label="Customer Name">
//               <input value={formData.customerName} readOnly style={readonly} />
//             </Field>
//             <Field label="Address">
//               <input name="address" value={formData.address} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//             </Field>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
//               <Field label="Mobile" error={error.mobile}>
//                 <input name="mobile" value={formData.mobile} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//               <Field label="Email" error={error.email}>
//                 <input name="email" value={formData.email} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
//               <Field label="Pin">
//                 <input name="pin" value={formData.pin} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//               <Field label="Country">
//                 <input name="country" value={formData.country} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
//               <Field label="State">
//                 <input name="state" value={formData.state} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//               <Field label="City">
//                 <input name="city" value={formData.city} onChange={handleChange} style={base} onFocus={focusOn} onBlur={focusOff} />
//               </Field>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
//               <Field label="Reg. Type">
//                 <select name="registrationType" value={formData.registrationType} onChange={handleChange} style={{ ...base, cursor: "pointer" }} onFocus={focusOn} onBlur={focusOff}>
//                   <option value="">Select</option>
//                   <option value="unregistered">Unregistered</option>
//                   <option value="regular">Regular</option>
//                 </select>
//               </Field>
//               <Field label="Reg. No">
//                 <input name="registrationNo" value={formData.registrationNo} onChange={handleChange}
//                   style={isRegular ? base : readonly} readOnly={!isRegular} disabled={!isRegular}
//                   onFocus={(e) => { if (isRegular) focusOn(e) }} onBlur={focusOff}
//                 />
//               </Field>
//             </div>
//           </div>

//           {/* COL 2 — Date + Partner + Remark + Summary */}
//           <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "13px", display: "flex", flexDirection: "column", gap: 8 }}>
//             <SectionTitle>Details</SectionTitle>

//             <Field label="Submission Date">
//               <input type="date" value={formData.submissionDate} readOnly style={readonly} />
//             </Field>

//             {partnerlist?.length > 0 && (
//               <Field label="Associate With">
//                 <select name="partner" value={formData.partner} onChange={handleChange} style={{ ...base, cursor: "pointer" }} onFocus={focusOn} onBlur={focusOff}>
//                   <option value="">Select partner</option>
//                   {partnerlist.map((p) => <option key={p._id} value={p._id}>{p?.partner || p?.partnerName}</option>)}
//                 </select>
//               </Field>
//             )}

//             <Field label="Bank Remark">
//               <textarea name="bankRemark" value={formData.bankRemark} onChange={handleChange}
//                 placeholder="Enter bank remarks or notes..." rows={4}
//                 style={{ ...base, resize: "vertical", minHeight: 80, lineHeight: 1.5 }}
//                 onFocus={focusOn} onBlur={focusOff}
//               />
//             </Field>

//             <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
//               <SummaryChip label="Net Total" value={totalNet} color="#1e40af" bg="#dbeafe" border="#93c5fd" />
//               <SummaryChip label="Received" value={totalReceived} color="#166534" bg="#dcfce7" border="#86efac" />
//               <SummaryChip label="Balance" value={Math.abs(totalBalance)} color={balColor}
//                 bg={totalBalance > 0 ? "#fffbeb" : totalBalance < 0 ? "#fff1f2" : "#f0fdf4"}
//                 border={totalBalance > 0 ? "#fde047" : totalBalance < 0 ? "#fda4af" : "#86efac"}
//                 suffix={totalBalance < 0 ? " (Excess)" : ""}
//               />
//             </div>
//           </div>

//           {/* COL 3 — Payment Table */}
//           <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "13px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             {/* ✅ No Add Row button — header only */}
//             <div style={{ marginBottom: 8 }}>
//               <SectionTitle>Payment Entries</SectionTitle>
//             </div>

//             {/* col headings — ✅ removed last empty column for delete btn */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 82px 78px 82px", gap: 5, padding: "5px 7px", background: "#f8fafc", borderRadius: "8px 8px 0 0", border: "1px solid #e2e8f0", borderBottom: "none" }}>
//               {["Description", "Net Amt", "Balance", "Received"].map((h, i) => (
//                 <span key={i} style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
//               ))}
//             </div>

//             {/* scrollable rows */}
//             <div style={{ flex: 1, overflowY: "auto", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
//               {paymentRows.map((row, idx) => {
//                 const locked = isRowLocked(row)
//                 const bal = rowBalance(row)
//                 const bc = bal > 0 ? "#b45309" : bal < 0 ? "#be123c" : "#166534"
//                 const bb = bal > 0 ? "#fffbeb" : bal < 0 ? "#fff1f2" : "#f0fdf4"
//                 const bbd = bal > 0 ? "#fde068" : bal < 0 ? "#fca5a5" : "#86efac"

//                 return (
//                   <div key={row.id} style={{
//                     display: "grid", gridTemplateColumns: "1fr 82px 78px 82px",  // ✅ 4 cols, no delete
//                     gap: 5, alignItems: "center", padding: "6px 7px",
//                     background: locked ? "#f8faff" : idx % 2 === 0 ? "#fff" : "#fafbff",
//                     borderBottom: idx < paymentRows.length - 1 ? "1px solid #f1f5f9" : "none",
//                   }}>
//                     {/* ✅ Label is read-only — product name from leadFor */}
//                     <div style={{
//                       padding: "4px 7px", fontSize: 11, border: "1px solid #e2e8f0",
//                       borderRadius: 6, background: "#f1f5f9", color: "#374151",
//                       fontFamily: "inherit", fontWeight: 500,
//                       whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                     }}>
//                       {row.label}
//                     </div>

//                     <AmtInput value={row.netAmount} onChange={(v) => updateRow(row.id, "netAmount", v)} />

//                     <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 700, padding: "4px 6px", borderRadius: 6, color: bc, background: bb, border: `1px solid ${bbd}`, whiteSpace: "nowrap", overflow: "hidden" }}>
//                       <IndianRupee size={9} />
//                       <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
//                         {Math.abs(bal).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//                       </span>
//                     </div>

//                     {locked ? (
//                       <div title="Fully paid — no balance remaining" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 6, padding: "4px 5px", cursor: "not-allowed" }}>
//                         <Lock size={9} /> Paid
//                       </div>
//                     ) : (
//                       <AmtInput value={row.receivedAmount} onChange={(v) => updateRow(row.id, "receivedAmount", v)} highlight />
//                     )}
//                   </div>
//                 )
//               })}
//             </div>

//             {/* totals footer */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 82px 78px 82px", gap: 5, padding: "6px 7px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0 0 10px 10px", marginTop: 4 }}>
//               <span style={{ fontSize: 11, fontWeight: 700, color: "#0369a1" }}>Total</span>
//               <TotalCell value={totalNet} color="#0369a1" />
//               <TotalCell value={totalBalance} color={balColor} abs />
//               <TotalCell value={totalReceived} color="#166534" green />
//             </div>
//           </div>
//         </form>

//         {/* ── FOOTER ── */}
//         <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "10px 16px", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
//           <button type="button" onClick={() => closemodal(false)}
//             style={{ padding: "7px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, color: "#475569", background: "#fff", border: "1.5px solid #e2e8f0", cursor: "pointer" }}
//             onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9" }}
//             onMouseLeave={(e) => { e.currentTarget.style.background = "#fff" }}
//           >
//             Cancel
//           </button>
//           <button type="submit" form="collection-form"
//             style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 22px", borderRadius: 9, fontSize: 12, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }}
//             onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#1e40af,#1d4ed8)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.45)" }}
//             onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#1d4ed8,#2563eb)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)" }}
//           >
//             <ClipboardCheck size={13} /> Update Collection
//           </button>
//         </div>
//       </div>
//     </div>

//   )
// }
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
  handleCollectionUpdate
}) {
  const [error, setError] = useState({})
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
    const hasPaymentEntries =
      lastPayment &&
      Array.isArray(lastPayment.paymentEntries) &&
      lastPayment.paymentEntries.length > 0

    if (hasPaymentEntries) {
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
    } else {
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
            <ClipboardCheck size={13} /> Update Collection
          </button>
        </div>
      </div>
    </div>
  )
}
