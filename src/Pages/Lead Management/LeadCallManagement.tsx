import { Button, Divider, Form, message, Select, Table, type TableColumnsType } from 'antd';
import { useQuery } from 'react-query';
import { getLeadHistory } from '../../Api/Lead History/leadHistoryApi';
import { useSelector } from 'react-redux';
import { useCreateLeadHistory } from '../../Api/Lead History/leadHistoryHooks';
import TextArea from 'antd/es/input/TextArea';

interface DataType {
    key: React.Key;
    date: string;
    status: string;
    message: string;
    _id: string;
}


function LeadCallManagement() {
    const leaddata = useSelector((state: any) => state?.leadHistory?.leadHistory)
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
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

    const { data, isLoading, refetch } = useQuery('leadHistory', getLeadHistory)
    const { mutate: Create } = useCreateLeadHistory()
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
    const payload = {
        ...values,
        leadId: leaddata?._id, 
    };

    Create(payload, {
        onSuccess() {
            message.success("Added successfully");
            refetch();
            form.resetFields();
        },
        onError() {
            message.error("Failed to add");
        }
    });
};

    return (
        <div>
            <Divider>Lead Call Management</Divider>
            <div className='flex'>
                <div className='w-[50%]'>
                    <h1 className='font-semibold'>
                        Student Name: {leaddata?.name}
                    </h1>
                    <h1 className='font-semibold'>
                        SRC Name: {leaddata?.sRC}
                    </h1>
                    <h1 className='font-semibold'>
                        Phone Number: {leaddata?.phone_number}
                    </h1>
                    <h1 className='font-semibold'>
                        School Name: {leaddata?.w}
                    </h1>
                    <h1 className='font-semibold'>
                        Address : {leaddata?.address}
                    </h1>
                </div>
                <div className='w-[50%]'>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <div className='w-[450px]'>
                            <Form.Item
                                name="status"
                                label="Current Status"
                                rules={[{ required: true, message: 'Please select a status' }]}
                            >
                                <Select placeholder="Select status">
                                    <Select.Option value="Home Visit">Home Visit</Select.Option>
                                    <Select.Option value="Office Visit">Office Visit</Select.Option>
                                    <Select.Option value="Admission">Admission</Select.Option>
                                    <Select.Option value="Positive">Positive</Select.Option>
                                    <Select.Option value="Negative">Negative</Select.Option>
                                    <Select.Option value="Committed">Committed</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[{ required: true, message: 'Please enter a message' }]}
                            >
                                <TextArea rows={5} placeholder="Enter your message" />
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>

                </div>
            </div>
            <Table
                columns={columns}
                style={{ height: '120px', overflowY: 'auto' }}
                pagination={false}
                dataSource={data?.data}
                loading={isLoading}
                size="middle"
                rowKey="_id"
            />
        </div>
    )
}

export default LeadCallManagement