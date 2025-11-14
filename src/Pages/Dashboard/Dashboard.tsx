import { useEffect, useState } from "react";

function Dashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 shadow-md rounded-md">
          <div className="mx-5 my-4">
            <h1 className="my-2">No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 shadow-md rounded-md">
          <div className="mx-5 my-4">
            <h1 className="my-2">No.of Admissions :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 shadow-md rounded-md">
          <div className="mx-5 my-4">
            <h1 className="my-2 flex items-center justify-between">
              No.of Branches :
            </h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 shadow-md rounded-md">
          <div className="mx-5 my-4">
            <h1 className="my-2 flex items-center justify-between">
              Time
            </h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
