import { useEffect, useMemo, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { getBranch } from "../../Api/Branch/branchApi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getRegister } from "../../Api/Registration Table/registerTableApi";
import { getLead } from "../../Api/Lead/leadApi";
import { getSroLeaderboard } from "../../Api/SRO/SroApi";
import { getBranchManagerLeaderboard } from "../../Api/Branch Manager/branchManagerApi";
import { getSrcLeaderboard } from "../../Api/SRC/SrcApi";
import { getAccount } from "../../Api/Account/AccountApi";


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
  const { data: srodata, isLoading: sroloading } = useQuery("sro", getSroLeaderboard);

  useEffect(() => {
    const chartEl = document.querySelector("#chart");
    if (!chartEl) return;

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
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartEl, options);
    chart.render();
    chartRef.current = chart;

    return () => chart.destroy();
  }, []);

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

  const getMonthlyCounts = (items: any[]) => {
    const monthly = Array(12).fill(0);
    items.forEach((item: any) => {
      const month = new Date(item.createdAt).getMonth();
      monthly[month] += 1;
    });
    return monthly;
  };

  const filteredBranch = useMemo(() => {
    return selectedBranch;
  }, [selectedBranch]);

  useEffect(() => {
    if (!chartRef.current || !registerdata || !leaddata) return;

    const admissions = registerdata.data.filter(
      (x: any) => !filteredBranch || x.branchId === filteredBranch
    );

    const leads = leaddata.data.filter(
      (x: any) => !filteredBranch || x.branchId === filteredBranch
    );

    chartRef.current.updateSeries([
      { name: "Admissions", data: getMonthlyCounts(admissions) },
      { name: "Leads", data: getMonthlyCounts(leads) },
    ]);
  }, [registerdata, leaddata, filteredBranch]);

  // Tables
  const branchcolumns: TableColumnsType<any> = [
    { title: "No", render: (_text, _record, index) => index + 1 },
    { title: "Manager", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0 },
  ];

  const srccolumns: TableColumnsType<any> = [
    { title: "No", render: (_text, _record, index) => index + 1 },
    { title: "SRC", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0 },
  ];

  const srocolumns: TableColumnsType<any> = [
    { title: "No", render: (_text, _record, index) => index + 1 },
    { title: "SRO", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0 },
  ];

  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;
  const totalBranches = branchdata?.data.length || 0;

  return (
    <div className="w-full h-screen overflow-y-hidden">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">
        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Leads :</h1>
          <span className="text-green-500">
            {leadloading ? "..." : totalLeads}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Admissions :</h1>
          <span className="text-amber-500">
            {registerloading ? "..." : totalAdmissions}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Branches :</h1>
          <span className="text-red-500">
            {branchloading ? "..." : totalBranches}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* BRANCH SELECT */}
      <div className="my-4 font-bold flex flex-wrap items-center gap-2">
        Branch:
        <Select
          placeholder="Select branch"
          allowClear
          style={{ width: 220 }}
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

      {/* CHART */}
      <div className="w-full mt-1 overflow-hidden">
        <div id="chart" className="min-w-[350px]"></div>
      </div>

      {/* LEADERBOARD */}
      <h1 className="font-bold my-2 text-lg">Leaderboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-2">

        <Table
          columns={branchcolumns}
          dataSource={managerdata?.data}
          loading={managerloading}
          pagination={false}
          size="middle"
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[300px] overflow-auto width:[300px]"
          rowKey="_id"
          title={() => "Branch Manager"}
        />

        <Table
          columns={srccolumns}
          dataSource={srcdata?.data}
          loading={srcloading}
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[300px] overflow-auto width: [300px]"
          title={() => "SRC"}
          pagination={false}
          size="middle"
          rowKey="_id" />

        <Table
          columns={srocolumns}
          dataSource={srodata?.data}
          loading={sroloading}
          pagination={false}
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[300px] overflow-auto width: [300px]"
          size="middle"
          rowKey="_id"
          title={() => "SRO"}
        />

      </div>
    </div>
  );
}



//Manager

function ManagerDashboard() {
  const [time, setTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const chartRef = useRef<any>(null);

  const { data: branchdata, isLoading: branchloading } = useQuery("Branch", getBranch);
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);
  const { data: srcdata, isLoading: srcloading } = useQuery("src", getSrcLeaderboard);
  const { data: srodata, isLoading: sroloading } = useQuery("sro", getSroLeaderboard);

  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;
  const totalBranches = branchdata?.data.length || 0;

  useEffect(() => {
    const chartEl = document.querySelector("#chart");
    if (!chartEl) return;

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
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartEl, options);
    chart.render();
    chartRef.current = chart;

    return () => chart.destroy();
  }, []);


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


  const getMonthlyCounts = (items: any[]) => {
    const monthly = Array(12).fill(0);
    items.forEach((item: any) => {
      const month = new Date(item.createdAt).getMonth();
      monthly[month] += 1;
    });
    return monthly;
  };

  // Update chart when branch changes

  const filteredBranch = useMemo(() => {
    console.log("Branch changed:", selectedBranch);
    return selectedBranch;
  }, [selectedBranch]);

  useEffect(() => {
    if (!chartRef.current || !registerdata || !leaddata) return;

    const admissions = registerdata.data.filter(
      (x: any) => !filteredBranch || x.branchId === filteredBranch
    );

    const leads = leaddata.data.filter(
      (x: any) => !filteredBranch || x.branchId === filteredBranch
    );

    chartRef.current.updateSeries([
      { name: "Admissions", data: getMonthlyCounts(admissions) },
      { name: "Leads", data: getMonthlyCounts(leads) },
    ]);
  }, [registerdata, leaddata, filteredBranch]);

  const srccolumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "SRC", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0, },
  ];


  const srocolumns: TableColumnsType<any> = [
    { title: "No.of", render: (_text, _record, index) => index + 1, },
    { title: "SRC", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0, },
  ];

  return (
    <div className="w-full h-screen overflow-x-scroll">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">
        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Leads :</h1>
          <span className="text-green-500">
            {leadloading ? "..." : totalLeads}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Admissions :</h1>
          <span className="text-amber-500">
            {registerloading ? "..." : totalAdmissions}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Branches :</h1>
          <span className="text-red-500">
            {branchloading ? "..." : totalBranches}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* Branch Select */}
      <div className="my-5 font-bold">
        Branch:
        <Select
          placeholder="Select a branch"
          allowClear
          className="mx-3"
          style={{ width: 200 }}
          options={
            !branchloading &&
            branchdata?.data.map((branch: any) => ({
              value: branch._id,
              label: branch.name,
            }))
          }
          onChange={(value) => {
            console.log("Branch selected:", value);
            setSelectedBranch(value);
          }}
        />
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>
      <h1 className="font-bold">Leaderboard :-</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-2 w-full">

        <Table
          columns={srccolumns}
          loading={srcloading}
          dataSource={srcdata?.data}
          className="h-[300px] lg:h-[220px] md:h-[220px] xl:h-[250px] overflow-auto width: [300px]"
          title={() => 'SRC'} pagination={false}
          size="middle"
          rowKey="_id"
        />

        <Table
          columns={srocolumns}
          loading={sroloading}
          dataSource={srodata?.data}
          className="h-[300px] lg:h-[220px] md:h-[220px] xl:h-[250px] overflow-auto width: [300px]"
          title={() => 'SRO'} pagination={false}
          size="middle"
          rowKey="_id"
        />
      </div>
    </div>
  );
}



//SRC
function SRCDashboard() {

  const { data, isLoading } = useQuery("Sro", getSroLeaderboard);
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);

  const [time, setTime] = useState("");

  useEffect(() => {
    if (registerloading || leadloading) return;
    if (!registerdata || !leaddata) return;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const getMonthlyCounts = (arr: any[]) => {
      const counts = new Array(12).fill(0);

      arr.forEach((item) => {
        const month = new Date(item.createdAt).getMonth(); // 0–11
        counts[month] += 1;
      });

      return counts;
    };

    const admissionData = getMonthlyCounts(registerdata.data);
    const leadData = getMonthlyCounts(leaddata.data);

    const options = {
      series: [
        { name: "Admissions", data: admissionData },
        { name: "Leads", data: leadData },
      ],
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: months },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, [registerloading, leadloading, registerdata, leaddata]);




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
    { title: "SRC", dataIndex: "name" },
    { title: "Admissions", dataIndex: "registrationCount", render: (value) => value ?? 0, },
  ];

  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;

  return (
    <div className="w-full h-screen overflow-y-scroll">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">
        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Leads :</h1>
          <span className="text-green-500">
            {leadloading ? "..." : totalLeads}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Admissions :</h1>
          <span className="text-amber-500">
            {registerloading ? "..." : totalAdmissions}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>

      {/* Leaderboard */}
      <h1 className="font-bold">Leaderboard :-</h1>
      <div className="w-full">
        <Table
          columns={columns}
          loading={isLoading}
          dataSource={data?.data}
          className="h-[300px] lg:h-[300px] md:h-[220px] xl:h-[400px] overflow-auto width: [300px]"
          title={() => 'SRO'} pagination={false}
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
  const { data: registerdata, isLoading: registerloading } = useQuery("register", getRegister);
  const { data: leaddata, isLoading: leadloading } = useQuery("leads", getLead);

  useEffect(() => {
    if (registerloading || leadloading) return;
    if (!registerdata || !leaddata) return;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Convert to counts by month using createdAt
    const getMonthlyCounts = (arr: any[]) => {
      const counts = new Array(12).fill(0);

      arr.forEach((item) => {
        const month = new Date(item.createdAt).getMonth(); // 0–11
        counts[month] += 1;
      });

      return counts;
    };

    const admissionData = getMonthlyCounts(registerdata.data);
    const leadData = getMonthlyCounts(leaddata.data);

    const options = {
      series: [
        { name: "Admissions", data: admissionData },
        { name: "Leads", data: leadData },
      ],
      chart: { type: "bar", height: 450 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "100%",
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: months },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, [registerloading, leadloading, registerdata, leaddata]);

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


  const totalAdmissions = registerdata?.data.length;
  const totalLeads = leaddata?.data.length;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">
        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Leads :</h1>
          <span className="text-green-500">
            {leadloading ? "..." : totalLeads}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Admissions :</h1>
          <span className="text-amber-500">
            {registerloading ? "..." : totalAdmissions}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>
    </div>
  );

}

//Accountant

function AccountantDashboard() {
  const [time, setTime] = useState("");
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<any>(null);

  const { data, isLoading } = useQuery("Accounts", getAccount);

  // Totals (unchanged)
  const debitTotal = data?.data?.reduce(
    (sum: number, item: any) => sum + (item.debit || 0),
    0
  ) ?? 0;

  const creditTotal = data?.data?.reduce(
    (sum: number, item: any) => sum + (item.credit || 0),
    0
  ) ?? 0;

  const Total = creditTotal + debitTotal;

  // Build month buckets from createdAt (0 = Jan ... 11 = Dec)
  const buildMonthlySeries = (items: any[] = []) => {
    const debitByMonth = new Array(12).fill(0);
    const creditByMonth = new Array(12).fill(0);

    items.forEach((it) => {
      // defend against bad/missing dates
      const d = it.createdAt ? new Date(it.createdAt) : null;
      if (!d || isNaN(d.getTime())) return;
      const m = d.getMonth(); // 0..11
      debitByMonth[m] += Number(it.debit || 0);
      creditByMonth[m] += Number(it.credit || 0);
    });

    return { debitByMonth, creditByMonth };
  };

  // Memoize arrays (simple, derived directly)
  const itemsArray = data?.data ?? [];
  const { debitByMonth, creditByMonth } = buildMonthlySeries(itemsArray);

  // Render / update chart when data changes
  useEffect(() => {
    // options use the computed monthly series
    const options: ApexCharts.ApexOptions = {
      series: [
        { name: "Debit", data: debitByMonth },
        { name: "Credit", data: creditByMonth },
      ],
      chart: { type: "bar", height: 450, toolbar: { show: false } },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "100%",
          borderRadius: 6,
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
      yaxis: { title: { text: "Amount" } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val: number) {
            // format as number with commas
            return Intl.NumberFormat().format(Number(val));
          },
        },
      },
      legend: { position: "top" },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    // If chart already exists, update series/options
    if (chartInstance.current) {
      try {
        chartInstance.current.updateOptions(options, true, true);
      } catch (e) {
        // fallback: destroy and recreate if update fails
        chartInstance.current.destroy();
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    } else {
      // create it
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }

    return () => {
      // do not destroy if we expect to update frequently? we still cleanup on unmount
    };
  }, [debitByMonth.join(","), creditByMonth.join(",")]); // string deps to detect content changes

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        try {
          chartInstance.current.destroy();
        } catch { }
        chartInstance.current = null;
      }
    };
  }, []);

  // Live clock (unchanged)
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">

        <div className="p-3 shadow rounded bg-white">
          <h1>Debit :</h1>
          <span className="text-green-500">{isLoading ? "..." : debitTotal}</span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Credit :</h1>
          <span className="text-red-500">{isLoading ? "..." : creditTotal}</span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Total :</h1>
          <span className="text-amber-600">{isLoading ? "..." : Total}</span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2" ref={(el) => { chartRef.current = el; }}></div>
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
    if (registerloading || leadloading) return;
    if (!registerdata || !leaddata) return;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Convert to counts by month using createdAt
    const getMonthlyCounts = (arr: any[]) => {
      const counts = new Array(12).fill(0);

      arr.forEach((item) => {
        const month = new Date(item.createdAt).getMonth(); // 0–11
        counts[month] += 1;
      });

      return counts;
    };

    const admissionData = getMonthlyCounts(registerdata.data);
    const leadData = getMonthlyCounts(leaddata.data);

    const options = {
      series: [
        { name: "Admissions", data: admissionData },
        { name: "Leads", data: leadData },
      ],
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: months },
      yaxis: { title: { text: "Count" } },
      fill: { opacity: 1 },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => chart.destroy();
  }, [registerloading, leadloading, registerdata, leaddata]);

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
    <div className="h-screen w-full overflow-y-scroll">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg font-semibold">
        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Leads :</h1>
          <span className="text-green-500">
            {leadloading ? "..." : totalLeads}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Admissions :</h1>
          <span className="text-amber-500">
            {registerloading ? "..." : totalAdmissions}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>No.of Branches :</h1>
          <span className="text-red-500">
            {branchloading ? "..." : totalBranches}
          </span>
        </div>

        <div className="p-3 shadow rounded bg-white">
          <h1>Time</h1>
          <span className="text-green-500">{time}</span>
        </div>
      </div>

      {/* Chart */}
      <div id="chart" className="mt-2"></div>

      {/* <h1 className="font-bold">Cancelled Students :-</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-2">
        <Table columns={columns}
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[250px] overflow-auto width:[300px"
          title={() => 'Cancelled Students'} pagination={false}
          dataSource={registeredFiltered}
          loading={registerloading}
          size="middle"
          rowKey="_id"
        />

        <Table columns={refundColumns}
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[250px] overflow-auto width:[300px] "
          title={() => 'Refunded Students'} pagination={false}
          dataSource={Refunddata}
          loading={registerloading}
          size="middle"
          rowKey="_id"
        />

        <Table columns={seatColumns}
          className="h-[300px] lg:h-[220px] md:h-[250px] xl:h-[250px] overflow-auto width:[300px] "
          title={() => 'Seat booked Students'} pagination={false}
          dataSource={seatbookeddata}
          loading={registerloading}
          size="middle"
          rowKey="_id"
        />
      </div>
    </div>
  );
}



//DASHBOARD (ROLE BASED)

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
