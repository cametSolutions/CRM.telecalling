import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getProductName = (leadForItem) => {
  const productOrService = leadForItem?.productorServiceId;

  if (typeof productOrService === "string") {
    return "";
  }

  return (
    productOrService?.productName ||
    productOrService?.serviceName ||
    productOrService?.name ||
    productOrService?.shortName ||
    leadForItem?.productorServiceName ||
    ""
  );
};

const getLicenseNumbers = (leadFor = []) =>
  leadFor.flatMap((item) => [
    item?.licenseNumber,
    ...(item?.taggeddata || []).map((tag) => tag?.licensenumber),
    ...(item?.licenseNumbers || []).map(
      (license) =>
        license?.licensenumber ||
        license?.licenseNumber ||
        license
    ),
  ]);

const defaultLeadMatcher = (lead, keyword) => {
  const searchValue = normalize(keyword);

  if (!searchValue) return true;

  const customerName =
    lead?.customerName?.customerName ||
    lead?.customerName?.name ||
    lead?.customerName ||
    "";

  const mobile = lead?.mobile || "";
  const phone = lead?.phone || "";
  const leadId = lead?.leadId || "";

  const leadFor = Array.isArray(lead?.leadFor)
    ? lead.leadFor
    : [];

  const productNames = leadFor.map(getProductName);

  const licenseNumbers = getLicenseNumbers(leadFor);

  const searchableValues = [
    customerName,
    mobile,
    phone,
    leadId,
    ...productNames,
    ...licenseNumbers,
  ];

  return searchableValues.some((value) =>
    normalize(value).includes(searchValue)
  );
};

export default function SearchBar({
  data = [],
  onFilteredData,
  placeholder = "Search customer, mobile, license or product...",
  debounceMs = 250,
  matcher = defaultLeadMatcher,
  className = "",
  inputClassName = "",
  showCount = true,
  initialValue = "",
  onSearchChange,
}) {
console.log("Hhhhddddddddd")
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] =
    useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];

    return safeData.filter((item) =>
      matcher(item, debouncedValue)
    );
  }, [data, debouncedValue, matcher]);

  useEffect(() => {
console.log("h")
    onFilteredData?.(filteredData);
  }, [filteredData, onFilteredData]);

  const handleChange = (event) => {
    const value = event.target.value;

    setSearchValue(value);
    onSearchChange?.(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearchChange?.("");
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />

        <input
          type="search"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border border-slate-200
            bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800
            outline-none shadow-sm transition
            placeholder:text-slate-400
            focus:border-blue-500 focus:ring-4 focus:ring-blue-100
            ${inputClassName}
          `}
          aria-label="Search leads"
        />

        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              rounded-lg p-1 text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-700
            "
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showCount && (
        <span className="whitespace-nowrap text-sm font-medium text-slate-500">
          {filteredData.length} result
          {filteredData.length === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}

export { defaultLeadMatcher };