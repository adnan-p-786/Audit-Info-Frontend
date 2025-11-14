import { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: string;
  name: string;
  money: string;
  address: string;
}

function Dashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Admmissions",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80],
        },
        {
          name: "Leads",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 110, 120, 130],
        },
      ],
      chart: {
        type: "bar",
        height: 250,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      fill: {
        opacity: 1,
      },
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
    }
  ];

  return (
    <div>
      <div className="flex gap-10 text-xl font-semibold">
        <div className="w-60 h-20  shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1 className="my-2">No.of Leads :</h1>
            <span className="text-green-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1 className="my-2">No.of Admissions :</h1>
            <span className="text-amber-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1 className="my-2 flex items-center justify-between">
              No.of Branches :
            </h1>
            <span className="text-red-500">7</span>
          </div>
        </div>

        <div className="w-60 h-20 shadow-md rounded-md">
          <div className="mx-5 my-2">
            <h1 className="my-2 flex items-center justify-between">Time</h1>
            <span className="text-green-500">{time}</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div id="chart" className="mt-2">w</div>

      <div className="flex gap-20">
        <div className="">
          <Table
            columns={columns}
            style={{ height: '100px', overflowY: 'auto', width: '300px' }}
            title={() => 'Branch Manager'}
            pagination={false}
            // dataSource={filteredData}
            // loading={isLoading}
            size="middle"
            rowKey="_id"
          />
        </div>
        <div className="">
          <Table
            columns={columns}
            style={{ height: '100px', overflowY: 'auto', width: '300px' }}
            title={() => 'Branch Manager'}
            pagination={false}
            // dataSource={filteredData}
            // loading={isLoading}
            size="middle"
            rowKey="_id"
          />
        </div>
        <div className="">
          <Table
            columns={columns}
            style={{ height: '100px', overflowY: 'auto', width: '300px' }}
            title={() => 'Branch Manager'}
            pagination={false}
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

export default Dashboard;
