import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { getBranch } from "../../Api/Branch/branchApi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getRegister } from "../../Api/Registration Table/registerTableApi";
import { getLead } from "../../Api/Lead/leadApi";
import { getSro } from "../../Api/SRO/SroApi";
import { getBranchManagerLeaderboard } from "../../Api/Branch Manager/branchManagerApi";
import { getSrcLeaderboard } from "../../Api/SRC/SrcApi";


//Admin..........

function AdminDashboard() {
  const [time, setTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const chartRef = useRef<any>(null);

  // API calls
  const { data: branchdata, isLoading: branchloading } = useQuery("Branch", getBranch);
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);
  const { data: managerdata, isLoading: managerloading } = useQuery("manager", getBranchManagerLeaderboard);
  const { data: srcdata, isLoading: srcloading } = useQuery("src", getSrcLeaderboard);

  // -------------------------------
  // Create Chart Initially
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
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
  // Clock
  // -------------------------------
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
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

  // -------------------------------
  // Convert API data → monthly array
  // -------------------------------
  const getMonthlyCounts = (items: any[]) => {
    const monthly = Array(12).fill(0);
    items.forEach((item: any) => {
      const month = new Date(item.createdAt).getMonth();
      monthly[month] += 1;
    });
    return monthly;
  };

  // -------------------------------
  // Update chart when branch changes
  // -------------------------------
  useEffect(() => {
    if (!chartRef.current || registerloading || leadloading) return;

    const admissions =
      registerdata?.data.filter((x: any) => x.branchId === selectedBranch) || [];

    const leads =
      leaddata?.data.filter((x: any) => x.branchId === selectedBranch) || [];

    const admissionMonthly = getMonthlyCounts(admissions);
    const leadMonthly = getMonthlyCounts(leads);

    chartRef.current.updateSeries([
      { name: "Admissions", data: admissionMonthly },
      { name: "Leads", data: leadMonthly },
    ]);

  }, [selectedBranch, registerdata, leaddata]);

  // -------------------------------
  // Table columns
  // -------------------------------
  const branchcolumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "Manager", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount",
      render: (value) => value ?? 0,   // prevents empty cells
    },
  ];

  const srccolumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "SRC", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount" },
  ];

  const srocolumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "SRO", dataIndex: "name" },
    { title: "Admissions", dataIndex: "" },
  ];


  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;
  const totalBranches = branchdata?.data.length || 0;


  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">
              {leadloading ? "..." : totalLeads}
            </span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">
              {registerloading ? "..." : totalAdmissions}
            </span>

          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Branches :</h1>
            <span className="text-red-500">
              {branchloading ? "..." : totalBranches}
            </span>
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
          style={{ width: 200 }}
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
            columns={branchcolumns}
            dataSource={managerdata?.data}
            loading={managerloading}
            style={{ height: "100px", overflowY: "auto", width: "300px" }}
            title={() => "Branch Manager"}
            pagination={false}
            size="middle"
            rowKey="_id"
          />
        </div>

        <div>
          <Table
            columns={srccolumns}
            dataSource={srcdata?.data}
            loading={srcloading}
            style={{ height: "100px", overflowY: "auto", width: "300px" }}
            title={() => "SRC"}
            pagination={false}
            size="middle"
            rowKey="_id"
          />
        </div>

        <div>
          <Table
            columns={srocolumns}
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
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);

  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;
  const totalBranches = branchdata?.data.length || 0;

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

  const columns: TableColumnsType<any> = [
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
            <span className="text-green-500">
              {leadloading ? "..." : totalLeads}
            </span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">
              {registerloading ? "..." : totalAdmissions}
            </span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Branches :</h1>
            <span className="text-red-500">
              {branchloading ? "..." : totalBranches}
            </span>
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

  const { data, isLoading } = useQuery("Sro", getSro);


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

  const columns: TableColumnsType<any> = [
    {
      title: 'Date of Joining',
      dataIndex: 'createdAt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Employee Code',
      dataIndex: 'employee_code',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
    }
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
          dataSource={data?.data}
          loading={isLoading}
          size="middle"
          rowKey="_id"
        />
      </div>
    </div>
  );

}

//SRO

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

  const columns: TableColumnsType<any> = [
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


function AdministractorDashboard() {
  const [time, setTime] = useState("");

  const { data: branchdata, isLoading: branchloading } = useQuery("Branch", getBranch);
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);

  const registeredFiltered = registerdata?.data.filter((item: any) => item.cancel === true);
  const Refunddata = registerdata?.data.filter((item: any) => item.status === "ForRefund");
  const seatbookeddata = registerdata?.data.filter((item: any) => item.status === "foracknowledgment");





  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;
  const totalBranches = branchdata?.data.length || 0;


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

  const columns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "Name", dataIndex: "name" },
    { title: "Course", dataIndex: "course" },
  ];

  const refundColumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "Name", dataIndex: "name" },
    { title: "Course", dataIndex: "course" },
  ];

  const seatColumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "Name", dataIndex: "name" },
    { title: "Course", dataIndex: "course" },
  ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Leads :</h1>
            <span className="text-green-500">
              {leadloading ? "..." : totalLeads}
            </span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Admissions :</h1>
            <span className="text-amber-500">
              {registerloading ? "..." : totalAdmissions}
            </span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1>No.of Branches :</h1>
            <span className="text-red-500">
              {branchloading ? "..." : totalBranches}
            </span>
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

      {/* <h1 className="font-bold">Cancelled Students :-</h1> */}
      <div className="flex gap-5">
        <div className="">
          <Table columns={columns}
            style={{ height: '180px', overflowY: 'auto', width: '350px' }}
            title={() => 'Cancelled Students'} pagination={false}
            dataSource={registeredFiltered}
            loading={registerloading}
            size="middle"
            rowKey="_id"
          />
        </div>
        <div className="">
          <Table columns={refundColumns}
            style={{ height: '180px', overflowY: 'auto', width: '350px' }}
            title={() => 'Refunded Students'} pagination={false}
            dataSource={Refunddata}
            loading={registerloading}
            size="middle"
            rowKey="_id"
          />
        </div>

        <div className="">
          <Table columns={seatColumns}
            style={{ height: '180px', overflowY: 'auto', width: '350px' }}
            title={() => 'Seat booked Students'} pagination={false}
            dataSource={seatbookeddata}
            loading={registerloading}
            size="middle"
            rowKey="_id"
          />
        </div>
      </div>
    </div>
  );
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
    case "administractor":
      return <AdministractorDashboard />;
    default:
      return <h1>No Dashboard Found</h1>;
  }
};

export default Dashboard;
