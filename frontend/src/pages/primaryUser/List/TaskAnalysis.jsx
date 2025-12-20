import UseFetch from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { CardSkeletonLoader } from "../../../components/common/CardSkeletonLoader";
import CurrentDate from "../../../components/common/CurrentDate";
const TaskAnalysis = () => {
  const navigate = useNavigate();
  const [gridList, setgridList] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [loggedUserBranches, setLoggeduserBranches] = useState([]);
  const [selectedCompanyBranch, setSelectedCompanyBranch] = useState(null);
  const { data: analysisleads, loading } = UseFetch(
    selectedCompanyBranch &&
      `/lead/getalltaskAnalysisLeads?selectedBranch=${selectedCompanyBranch}`
  );
  const { data: branches } = UseFetch("/branch/getBranch");
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    setLoggedUser(user);
  }, []);
  useEffect(() => {
    if (loggedUser && branches && branches.length > 0) {
      if (loggedUser.role === "Admin") {
        const isselctedArray = loggedUser?.selected;
        if (isselctedArray) {
          const loggeduserBranches = loggedUser.selected.map((item) => {
            return { value: item.branch_id, label: item.branchName };
          });
          setLoggeduserBranches(loggeduserBranches);
          setSelectedCompanyBranch(loggeduserBranches[0].value);
        } else {
          const loggeduserBranches = branches.map((item) => {
            return { value: item._id, label: item.branchName };
          });
          setLoggeduserBranches(loggeduserBranches);
          setSelectedCompanyBranch(loggeduserBranches[0].value);
        }
      } else {
        const loggeduserBranches = loggedUser.selected.map((item) => {
          return { value: item.branch_id, label: item.branchName };
        });
        setLoggeduserBranches(loggeduserBranches);
        setSelectedCompanyBranch(loggeduserBranches[0].value);
      }
    }
  }, [loggedUser, branches]);
  console.log("a");
  useEffect(() => {
    if (analysisleads && analysisleads.length > 0) {
      const a = analysisleads.map((item) => item.leadId);
      console.log(a);
      const taskByList = analysisleads.reduce((acc, lead) => {
        const logs = lead.activityLog;
        if (logs.length === 0) return acc;

        logs.forEach((log) => {
          // Only include logs that are not closed and have a taskTo field
          if (
            log.taskId &&
            (log.taskClosed === false || log.followupClosed === false) &&
            log?.allocatedClosed === false
          ) {
            console.log(lead.leadId, log.taskId);
            acc[log.taskId.taskName] = (acc[log.taskId.taskName] || 0) + 1;
          }
        });

        return acc;
      }, {});
      // Convert to array of objects with label and value
      const taskByCountArray = Object.entries(taskByList).map(
        ([label, value]) => ({
          label,
          value,
        })
      );
      setgridList(taskByCountArray);
    }
  }, [analysisleads]);
  return (
    <div className="flex flex-col h-full bg-white">
      <div>
        {loading && (
          <BarLoader
            cssOverride={{ width: "100%", height: "4px" }} // Tailwind's `h-4` corresponds to `16px`
            color="#4A90E2" // Change color as needed
          />
        )}
      </div>
      <div className="flex justify-between m-2 mx-4">
        <h2 className="text-lg font-bold">Task Analysis</h2>
        <CurrentDate />
      </div>

      <div className="m-2 mx-4 flex justify-end">
        <select
          // value={selectedCompanyBranch || ""}
          onChange={(e) => {
            setSelectedCompanyBranch(e.target.value);
            setgridList([]);
            // setStatus(approvedToggleStatus ? "Approved" : "Pending")
          }}
          className="border border-gray-300 py-1 rounded-md px-2 focus:outline-none min-w-[120px]"
        >
          {loggedUserBranches?.map((branch) => (
            <option key={branch._id} value={branch.value}>
              {branch.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 border border-gray-100 p-3 mx-4 rounded-xl shadow-xl bg-white mb-3">
        {gridList && gridList.length > 0 ? (
          gridList.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm text-black text-lg cursor-pointer"
              >
                <div className="bg-blue-500 text-white rounded-full p-2 md:mr-10">
                  <AiOutlineProfile className="text-xl " />
                </div>
                <div
                  onClick={() =>
                    navigate(
                      loggedUser.role === "Admin"
                        ? `/admin/transaction/lead/taskanalysisTable/${encodeURIComponent(
                            item.label
                          )}`
                        : `/staff/transaction/lead/taskanalysisTable/${encodeURIComponent(
                            item.label
                          )}`,
                      {
                        state: { branchid: selectedCompanyBranch },
                      }
                    )
                  }
                  className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-600">{item.value}</span>
                </div>
              </div>
            );
          })
        ) : (
          <CardSkeletonLoader count={5} />
        )}
      </div>
    </div>
  );
};
export default TaskAnalysis;
