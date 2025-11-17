import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { getBranch } from "../../Api/Branch/branchApi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

interface DataType {
  key: string;
  name: string;
  money: string;
  address: string;
}

//Admin..........

function AdminDashboard() {
  const [time, setTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const chartRef = useRef<any>(null);

  const { data: branchdata, isLoading: branchloading } = useQuery(
    "Branch",
    getBranch
  );

  // -------------------------------
  // 1️⃣ Create Chart Initially
  // -------------------------------
  useEffect(() => {
    const options = {
      series: [
        { name: "Admissions", data: [] },
        { name: "Leads", data: [] },
      ],
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "75%", borderRadius: 5 },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
    chartRef.current = chart;

    return () => chart.destroy();
  }, []);

  // -------------------------------
  // 2️⃣ Update Chart When Branch Changes
  // -------------------------------
  // useEffect(() => {
  //   if (!selectedBranch || !chartRef.current) return;

  //   getBranchStats(selectedBranch).then((res) => {
  //     chartRef.current.updateSeries([
  //       { name: "Admissions", data: res.admissions },
  //       { name: "Leads", data: res.leads },
  //     ]);
  //   });
  // }, [selectedBranch]);

  // -------------------------------
  // 3️⃣ Update Time Every Second
  // -------------------------------
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const columns: TableColumnsType<DataType> = [
    { title: "No.of", dataIndex: "name" },
    { title: "Manager", dataIndex: "email" },
    { title: "Admissions", dataIndex: "employee_code" },
  ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Branches :</h1>
            <span className="text-red-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>Time</h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>

      {/* Branch Select */}
      <div className="my-5 font-bold">
        Branch:
        <Select
          placeholder="Select a branch"
          className="mx-3"
          options={
            !branchloading &&
            branchdata?.data.map((branch: any) => ({
              value: branch._id,
              label: branch.name,
            }))
          }
          onChange={(value) => setSelectedBranch(value)}
        />
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>

      {/* Leaderboard */}
      <h1 className="font-bold">Leaderboard :-</h1>
      <div className="flex gap-20">
        <div>
          <Table
            columns={columns}
            style={{ height: "100px", overflowY: "auto", width: "300px" }}
            title={() => "Branch Manager"}
            pagination={false}
            size="middle"
            rowKey="_id"
          />
        </div>

        <div>
          <Table
            columns={columns}
            style={{ height: "100px", overflowY: "auto", width: "300px" }}
            title={() => "SRC"}
            pagination={false}
            size="middle"
            rowKey="_id"
          />
        </div>

        <div>
          <Table
            columns={columns}
            style={{ height: "100px", overflowY: "auto", width: "300px" }}
            title={() => "SRO"}
            pagination={false}
            size="middle"
            rowKey="_id"
          />
        </div>
      </div>
    </div>
  );
}


//Manager

function ManagerDashboard() {
  const [time, setTime] = useState("");

  const { data: branchdata, isLoading: branchloading } = useQuery("Branch", getBranch);

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Admissions",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80],
        },
        {
          name: "Leads",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 110, 120, 130],
        },
      ],
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
      },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const columns: TableColumnsType<DataType> = [
    { title: "No.of", dataIndex: "name" },
    { title: "Manager", dataIndex: "email" },
    { title: "Admissions", dataIndex: "employee_code" },
  ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Branches :</h1>
            <span className="text-red-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>Time</h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>

      {/* Branch Select */}
      <div className="my-5 font-bold">
        Branch:
        <Select
          placeholder="Select a branch"
          className="mx-3"
          options={
            !branchloading &&
            branchdata?.data.map((school: any) => ({
              value: school._id,
              label: school.name,
            }))
          }
        />
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>
      <h1 className="font-bold">Leaderboard :-</h1>
      <div className="flex gap-10">
        <div className="">
          <Table columns={columns}
            style={{ height: '100px', overflowY: 'auto', width: '530px' }}
            title={() => 'SRC'} pagination={false}
            // dataSource={filteredData}
            // loading={isLoading}
            size="middle"
            rowKey="_id"
          />
        </div>
        <div className="">
          <Table columns={columns}
            style={{ height: '100px', overflowY: 'auto', width: '530px' }}
            title={() => 'SRO'} pagination={false}
            // dataSource={filteredData}
            // loading={isLoading}
            size="middle"
            rowKey="_id"
          />
        </div>
      </div>
    </div>
  );
}



//SRC
function SRCDashboard() {

  const [time, setTime] = useState("");

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Admissions",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80],
        },
        {
          name: "Leads",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 110, 120, 130],
        },
      ],
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
      },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const columns: TableColumnsType<DataType> = [
    { title: "No.of", dataIndex: "name" },
    { title: "Manager", dataIndex: "email" },
    { title: "Admissions", dataIndex: "employee_code" },
  ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>Time</h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>

      {/* Leaderboard */}
      <h1 className="font-bold">Leaderboard :-</h1>
      <div className="w-full">
        <Table columns={columns}
          style={{ height: '165px', overflowY: 'auto' }}
          title={() => 'SRO'} pagination={false}
          // dataSource={filteredData}
          // loading={isLoading}
          size="middle"
          rowKey="_id"
        />
      </div>
    </div>
  );

}

function SRODashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Admissions",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80],
        },
        {
          name: "Leads",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 110, 120, 130],
        },
      ],
      chart: { type: "bar", height: 400 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
      },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // const columns: TableColumnsType<DataType> = [
  //   { title: "No.of", dataIndex: "name" },
  //   { title: "Manager", dataIndex: "email" },
  //   { title: "Admissions", dataIndex: "employee_code" },
  // ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>Time</h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>

      {/* Leaderboard */}
      {/* <h1 className="font-bold">Leaderboard :-</h1>
      <div className="w-full">
        <Table columns={columns}
          style={{ height: '165px', overflowY: 'auto' }}
          title={() => 'SRO'} pagination={false}
          // dataSource={filteredData}
          // loading={isLoading}
          size="middle"
          rowKey="_id"
        />
      </div> */}
    </div>
  );

}

function AccountantDashboard() {
  return <h1 className="text-2xl font-bold">Accountant Dashboard</h1>;
}



// MAIN DASHBOARD COMPONENT (ROLE BASED)

const Dashboard = () => {
  const position = useSelector((state: any) => state.auth.user?.Position);

  switch (position.toLowerCase()) {
    case "admin":
      return <AdminDashboard />;
    case "src":
      return <SRCDashboard />;
    case "sro":
      return <SRODashboard />;
    case "accountant":
      return <AccountantDashboard />;
    case "manager":
      return <ManagerDashboard />;
    default:
      return <h1>No Dashboard Found</h1>;
  }
};

export default Dashboard;
