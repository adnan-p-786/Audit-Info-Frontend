import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useCreateLeadHistory, useDeleteLeadHistory, useUpdateLeadHistory } from '../../Api/Lead History/leadHistoryHooks';
import { getLeadHistory } from '../../Api/Lead History/leadHistoryApi';
import { getLead } from '../../Api/Lead/leadApi';
import dayjs from 'dayjs';

interface DataType {
    key: React.Key;
    date: string;
    status: string;
    message: string;
    _id: string;
}

function LeadHistory() {
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
        },
        {
            title: 'Action',
            render: (_, record: any) => (
                <div className="flex gap-2">
                    <Button onClick={() => handleEdit(record)}>
                        <CiEdit />
                    </Button>
                    <Button danger onClick={() => handleDelete(record._id)}>
                        <MdDeleteOutline />
                    </Button>
                </div>
            )
        }
    ];

    const { data, isLoading, refetch } = useQuery('leadHistory', getLeadHistory)
    const { data: leaddata, isLoading: leadloading } = useQuery('lead', getLead)
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DataType | null>(null)

    const { mutate: Create } = useCreateLeadHistory()
    const { mutate: Update } = useUpdateLeadHistory()
    const { mutate: Delete } = useDeleteLeadHistory()

    const [form] = Form.useForm()
    const [editForm] = Form.useForm()

    const onFinish = (value: any) => {
        Create(value, {
            onSuccess() {
                message.success("Added successfully")
                refetch()
                setAddModal(false)
                form.resetFields()
            },
            onError() {
                message.error("Failed to add")
            }
        })
    }

    const onUpdateFinish = (values: any) => {
        if (!editingRecord) return;

        const updateData = {
            ...values,
            _id: editingRecord._id
        };

        Update(updateData, {
            onSuccess: () => {
                message.success('Updated successfully');
                refetch();
                setEditModal(false);
                setEditingRecord(null);
                editForm.resetFields();
            },
            onError: () => {
                message.error('Failed to update');
            }
        });
    };

    const handleEdit = (record: DataType) => {
        setEditingRecord(record);
        setEditModal(true);

        editForm.setFieldsValue({
            date: record.date ? dayjs(record.date) : null,
            status: record.status,
            message: record.message
        });
    };

    const handleDelete = (_id: string) => {
        Delete(_id, {
            onSuccess: () => {
                message.success('Deleted successfully');
                refetch();
            },
            onError: () => {
                message.error('Failed to delete');
            }
        });
    };

    const handleCancelEdit = () => {
        setEditModal(false);
        setEditingRecord(null);
        editForm.resetFields();
    };
    return (
        <div>
            <Divider>Lead History</Divider>
            <div>
                <h1>
                    Student Name: {leadloading ? 'Loading...' : leaddata?.data[0]?.name || 'N/A'}
                </h1>
                <h1>
                    Phone Number: {leadloading ? 'Loading...' : leaddata?.data[0]?.phone_number || 'N/A'}
                </h1>
            </div>

            <div className="w-full flex justify-end">
                <Button type='primary' onClick={() => setAddModal(true)}>Add</Button>
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


            <Modal
                title="Add Lead History"
                open={addModal}
                onCancel={() => setAddModal(false)}
                footer={null}
                width={400}
            >
                <Form layout='vertical' onFinish={onFinish} form={form}>
                    <div>
                        <Form.Item name={'date'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
                            <DatePicker format="DD-MM-YYYY" className="w-full" />
                        </Form.Item>

                        <Form.Item name={'status'} label="Status" rules={[{ required: true, message: "Please enter Status" }]}>
                            <Input placeholder='Status' />
                        </Form.Item>

                        <Form.Item name={'message'} label="Message" rules={[{ required: true, message: "Please enter Message" }]}>
                            <Input placeholder='Message' />
                        </Form.Item>

                        <Form.Item
                            name={'leadId'}
                            label="leadId"
                            rules={[{ required: true, message: "Please select a  lead" }]}
                        >
                            <Select
                                placeholder="Select a lead"
                                options={
                                    !leadloading && leaddata?.data.map((lead: { _id: string; }) => ({
                                        value: lead._id,
                                        label: lead._id
                                    }))
                                }
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary" className='w-full'>Create</Button>
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                title="Edit Lead History"
                open={editModal}
                onCancel={handleCancelEdit}
                footer={null}
                width={800}
            >
                <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
                    <div>
                        <Form.Item name={'date'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
                            <DatePicker format="DD-MM-YYYY" className="w-full" />
                        </Form.Item>

                        <Form.Item name={'status'} label="Status" rules={[{ required: true, message: "Please enter Status" }]}>
                            <Input placeholder='Status' />
                        </Form.Item>

                        <Form.Item name={'message'} label="Message" rules={[{ required: true, message: "Please enter Message" }]}>
                            <Input placeholder='Message' />
                        </Form.Item>

                        <Form.Item
                            name={'leadId'}
                            label="leadId"
                            rules={[{ required: true, message: "Please select a  lead" }]}
                        >
                            <Select
                                placeholder="Select a lead"
                                options={
                                    !leadloading && leaddata?.data.map((lead: { _id: string; }) => ({
                                        value: lead._id,
                                        label: lead._id
                                    }))
                                }
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary" className='w-full'>Update</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default LeadHistory