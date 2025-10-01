import { Divider, Select, Table, type TableColumnsType } from 'antd';
import { useQuery } from 'react-query';
import { getAccount } from '../../Api/Account/AccountApi';
import { getBranch } from '../../Api/Branch/branchApi';
import { useMemo, useState } from 'react';


function Accounts() {
  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Branch',
      dataIndex: ['branchId', 'name'],
    },
    {
      title: 'Particular',
      dataIndex: ['particularId', 'name'],
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

  const { data, isLoading } = useQuery('Account', getAccount)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let filtered = data?.data;
    if (selectedBranch) {
      filtered = filtered?.filter((expense: any) => expense.branchId?._id === selectedBranch || expense.branchId === selectedBranch)
    }
    return filtered;
  }, [selectedBranch])

  return (
    <div>
      <Divider>Accounts</Divider>
      <div className='px-4'>
        <Select
          placeholder="Filter by Branch"
          allowClear
          style={{ width: 200 }}
          value={selectedBranch || undefined}
          onChange={(value) => setSelectedBranch(value)}
          options={
            branchdata?.data.map((branch: { _id: string; name: string }) => ({
              value: branch._id,
              label: branch.name,
            }))
          }
          loading={branchloading}
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

export default Accounts