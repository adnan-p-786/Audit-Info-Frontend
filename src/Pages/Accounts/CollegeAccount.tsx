import { Divider, Select, Table, type TableColumnsType } from 'antd';
import { useQuery } from 'react-query';
import { useMemo, useState } from 'react';
import { getCollegeAccount } from '../../Api/College Account/collegeAccountApi';
import { getCollegeManagement } from '../../Api/College Management/collegeMgmtApi';


function CollegeAccount() {
  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'College',
      dataIndex: ['collegeId', 'college'],
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      render: (value: number) => (
        <span style={{ color: 'red' }}>{value}</span>
      )
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      render: (value: number) => (
        <span style={{ color: 'green' }}>{value}</span>
      )
    }
  ];

  const { data, isLoading } = useQuery('collegeAccount', getCollegeAccount)
  const { data: collegedata, isLoading: collegeloading } = useQuery('college', getCollegeManagement)
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let filtered = data?.data;
    if (selectedCollege) {
      filtered = filtered?.filter((college: any) => college.collegeId?._id === selectedCollege || college.collegeId === selectedCollege)
    }
    return filtered;
  }, [selectedCollege])

  return (
    <div>
      <Divider>College Account</Divider>
      <div className='px-4'>
        <Select
          placeholder="Filter by College"
          allowClear
          style={{ width: 200 }}
          value={selectedCollege || undefined}
          onChange={(value) => setSelectedCollege(value)}
          options={
            collegedata?.data.map((college: any) => ({
              value: college._id,
              label: college.name || college.college || college.collegeName,
            }))
          }
          loading={collegeloading}
        />

      </div>
      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={filteredData}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

    </div>
  )
}

export default CollegeAccount