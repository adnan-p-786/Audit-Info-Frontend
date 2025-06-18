import { Divider, Table, type TableColumnsType } from 'antd';
import { useQuery } from 'react-query';
import { getLeadHistory } from '../../Api/Lead History/leadHistoryApi';
import { useSelector } from 'react-redux';

interface DataType {
    key: React.Key;
    date: string;
    status: string;
    message: string;
    _id: string;
}

function LeadHistory() {
    const leaddata = useSelector((state:any)=>state?.leadHistory?.leadHistory)
    console.log(leaddata)
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Message',
            dataIndex: 'message',
        }
    ];

    const { data, isLoading } = useQuery('leadHistory', getLeadHistory)

    return (
        <div>
            <Divider>Lead History</Divider>
            <div>
                <h1 className='font-semibold'>
                    Student Name: { leaddata?.name }
                </h1>
                <h1 className='font-semibold'>
                     SRC: { leaddata?.sRC }
                </h1>
                <h1 className='font-semibold'>
                    Phone Number: { leaddata?.phone_number}
                </h1>
                <h1 className='font-semibold'>
                    School Name: { leaddata?.w}
                </h1>
                <h1 className='font-semibold'>
                     Address : { leaddata?.address}
                </h1>
            </div>
            <Table
                columns={columns}
                style={{ height: '350px', overflowY: 'auto' }}
                pagination={false}
                dataSource={data?.data}
                loading={isLoading}
                size="middle"
                rowKey="_id"
            />
        </div>
    )
}

export default LeadHistory