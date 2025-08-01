import { useState } from 'react';
import { useQuery } from 'react-query';
import { getRegister } from '../../Api/Registration Table/registerTableApi';
import { Button, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useCreateAccount, useCreateBookingAmount } from '../../Api/Account/AccountHooks';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useCreateservice } from '../../Api/Registration Table/registerTableHooks';
import { getParticular } from '../../Api/Particular/particularApi';

const Request = () => {
    const [table, setTable] = useState("Registered");
    const user = { position: "Admin", head_administractor: true };

    const { data: registerData, isLoading: registerloading } = useQuery('register', getRegister);
    const { data: admissionData, isLoading: admissionloading } = useQuery('admission', getRegister);
    const { data: bookingData, isLoading: bookingloading } = useQuery('booking', getRegister);
    const { data: bookingconfirmationData, isLoading: bookingconfirmationloading } = useQuery('bookingconfirmation', getRegister);
    const { data: particularData, isLoading: particularloading } = useQuery('particular', getParticular);

    const [addModal, setAddModal] = useState<any>(false);
    const [addAmountModal, setAddAmountModal] = useState<any>(false);
    const [bookingModal, setbookingModal] = useState<any>(false);
    const [bookingconfirmationModal, setbookingconfirmationModal] = useState<any>(false);
    const { mutate: Collectpayment } = useCreateAccount();
    const { mutate: AddAmount } = useCreateservice();
    const { mutate: booking } = useCreateBookingAmount();
    const [form] = Form.useForm();
    const [addamountform] = Form.useForm();
    const [bookingform] = Form.useForm();
    const [bookingconfirmationform] = Form.useForm();

    const onFinish = (value: any) => {
        Collectpayment(value, {
            onSuccess() {
                message.success("Added successfully");
                setAddModal(false);
                form.resetFields();
            },
            onError() {
                message.error("Failed to add");
            }
        });
    };

    const onBooking = (value: any) => {
        booking(value, {
            onSuccess() {
                message.success("Added successfully");
                setbookingModal(false);
                bookingform.resetFields();
            },
            onError() {
                message.error("Failed to add");
            }
        });
    };

    const onAddamount = (value: any) => {
        AddAmount(value, {
            onSuccess() {
                message.success("Added successfully");
                setAddAmountModal(false);
                addamountform.resetFields();
            },
            onError() {
                message.error("Failed to add");
            }
        });
    };

    const registeredColumns: TableColumnsType<any> = [
        {
            title: 'SI.NO',
            dataIndex: '_id',
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
        },
        {
            title: 'Full Amount',
            dataIndex: 'total_fee',
        },
        {
            title: 'Received Amount',
            dataIndex: 'recived_amount',
        },
        {
            title: 'Action',
            render: (_, record: any) => (
                <div className="flex gap-2">
                    <Button
                        style={{ backgroundColor: '#F68B1F', color: 'white' }}
                        onClick={() => {
                            setAddModal(record);
                            form.setFieldsValue({
                                recieved_amount: record.recived_amount,
                                amount_type: undefined
                            });
                        }}
                    >
                        Collect Payment
                    </Button>
                </div>
            ),
        },
    ];

    const admissionColumns: TableColumnsType<any> = [
        {
            title: 'SI.NO',
            dataIndex: '_id',
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
        },
        {
            title: 'College Name',
            dataIndex: ['collegeId', 'college'],
        },
        {
            title: 'Course Name',
            dataIndex: 'course',
        },
        {
            title: 'Full Amount',
            dataIndex: 'total_fee',
        },
        {
            title: 'Received Amount',
            dataIndex: 'recived_amount',
        },
        {
            title: 'Action',
            render: (_, record: any) => (
                <div className="flex gap-2">
                    <Button
                        style={{ backgroundColor: '#F68B1F', color: 'white' }}
                        onClick={() => {
                            setAddAmountModal(record);
                            addamountform.setFieldsValue({
                                recieved_amount: record.recived_amount,
                                amount_type: undefined
                            });
                        }}
                    >
                        Add Amount
                    </Button>
                </div>
            ),
        },
    ];

    const bookingColumns: TableColumnsType<any> = [
        {
            title: 'SI.NO',
            dataIndex: '_id',
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
        },
        {
            title: 'College Name',
            dataIndex: ['collegeId', 'college'],
        },
        {
            title: 'Course Name',
            dataIndex: 'course',
        },
        {
            title: 'Full Amount',
            dataIndex: 'total_fee',
        },
        {
            title: 'Booking Amount',
            dataIndex: 'booking_amount',
        },
        {
            title: 'Action',
            render: (_, record: any) => (
                <div className="flex gap-2">
                    <Button
                        style={{ backgroundColor: '#F68B1F', color: 'white' }}
                        onClick={() => {
                            setbookingModal(record);
                        }}
                    >
                        Send amount
                    </Button>
                </div>
            ),
        },
    ];

    const bookingConfirmationColumns: TableColumnsType<any> = [
        {
            title: 'SI.NO',
            dataIndex: '_id',
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
        },
        {
            title: 'College Name',
            dataIndex: ['collegeId', 'college'],
        },
        {
            title: 'Course Name',
            dataIndex: 'course',
        },
        {
            title: 'Full Amount',
            dataIndex: 'total_fee',
        },
        {
            title: 'Booking Amount',
            dataIndex: 'booking_amount',
        },
        {
            title: 'Action',
            render: (_, record: any) => (
                <div className="flex gap-2">
                    <Button
                        style={{ backgroundColor: '#F68B1F', color: 'white' }}
                        onClick={() => {
                            setbookingconfirmationModal(record);
                        }}
                    >
                        Confirm Booking
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full py-[10px] px-[5px]">
            <div className="w-full flex space-x-2 flex-wrap">


                {((user && user.position === "Admin") || user.position === "Administrator") && user.head_administractor && (
                    <button
                        onClick={() => setTable("Admission")}
                        className={`${table === "Admission" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Admission
                    </button>
                )}



                {(user && user.position === "Admin") || user.position === "Accountant" ? (
                    <button
                        onClick={() => setTable("Registered")}
                        className={`${table === "Registered" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Registration
                    </button>
                ) : null}



                {(user && user.position === "Admin") || user.position === "Administrator" ? (
                    <button
                        onClick={() => setTable("Booking")}
                        className={`${table === "Booking" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Bookings
                    </button>
                ) : null}



                {(user && user.position === "Admin") || user.position === "Accountant" ? (
                    <>
                        <button
                            onClick={() => setTable("Bookingconfirmation")}
                            className={`${table === "Bookingconfirmation" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Booking Confirmation
                        </button>

                        <button
                            onClick={() => setTable("Acknowledgement")}
                            className={`${table === "Acknowledgement" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Acknowledgement
                        </button>

                        <button
                            onClick={() => setTable("amount_collection")}
                            className={`${table === "amount_collection" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Amount Collection
                        </button>

                        <button
                            onClick={() => setTable("CollegeFees")}
                            className={`${table === "CollegeFees" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            College Fees
                        </button>

                        <button
                            onClick={() => setTable("Refund")}
                            className={`${table === "Refund" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Refunds
                        </button>

                        <button
                            onClick={() => setTable("Agent")}
                            className={`${table === "Agent" ? "bg-[#F68B1F]" : "bg-[#414042]"} text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Agent Payment
                        </button>
                    </>
                ) : null}
            </div>

            {table === "Registered" && (
                <div className="mt-4">
                    <Table
                        columns={registeredColumns}
                        dataSource={registerData?.data}
                        loading={registerloading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}

            {table === "Admission" && (
                <div className="mt-4">
                    <Table
                        columns={admissionColumns}
                        dataSource={admissionData?.data}
                        loading={admissionloading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}

            {table === "Booking" && (
                <div className="mt-4">
                    <Table
                        columns={bookingColumns}
                        dataSource={bookingData?.data}
                        loading={bookingloading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}

            {table === "Bookingconfirmation" && (
                <div className="mt-4">
                    <Table
                        columns={bookingConfirmationColumns}
                        dataSource={bookingconfirmationData?.data}
                        loading={bookingconfirmationloading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}

            <Modal
                open={!!addAmountModal}
                onCancel={() => {
                    setAddAmountModal(false);
                    form.resetFields();
                }}
                footer={null}
                width={400}
                title={
                    <div className="text-center">
                        <ExclamationCircleOutlined style={{ fontSize: '70px', color: '#F68B1F' }} />
                        <div className="mt-3 text-xl font-bold">Are you sure, This process cannot be undo</div>
                    </div>
                }
            >
                <Form layout='vertical' onFinish={onAddamount} form={addamountform}>
                    <div>
                        <div className="mb-4 flex items-center justify-center">
                            <label className="block text-gray-700 font-medium">Received Amount :</label>
                            {addAmountModal && (
                                <p className="px-2">{addAmountModal.recived_amount}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full">
                                <Form.Item
                                    name="service_charge"
                                    label="Service Charge :"
                                    rules={[{ required: true, message: 'Please enter service charge' }]}
                                >
                                    <Input placeholder="Enter amount" />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <Form.Item>
                        <Button htmlType='submit' type="primary" className="w-full">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={!!addModal}
                onCancel={() => {
                    setAddModal(false);
                    form.resetFields();
                }}
                footer={null}
                width={400}
                title={
                    <div className="text-center">
                        <ExclamationCircleOutlined style={{ fontSize: '70px', color: '#F68B1F' }} />
                        <div className="mt-3 text-xl font-bold">Are you sure you want to collect payment?</div>
                    </div>
                }
            >
                <Form layout='vertical' onFinish={onFinish} form={form}>
                    <div className="flex gap-3">
                        <Form.Item
                            name="recieved_amount"
                            label="Received Amount"
                            rules={[{ required: true, message: "Please enter received amount" }]}
                            className="w-1/2"
                        >
                            <Input placeholder="Received amount" />
                        </Form.Item>
                        <Form.Item
                            name="amount_type"
                            label="Payment Type"
                            rules={[{ required: true, message: "Please select payment type" }]}
                            className="w-1/2"
                        >
                            <Select placeholder="Select payment type">
                                <Select.Option value="cash">Cash</Select.Option>
                                <Select.Option value="online">Bank</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary" className="w-full">Yes, Collected</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={!!bookingModal}
                onCancel={() => {
                    setbookingModal(false);
                    bookingform.resetFields();
                }}
                footer={null}
                width={400}
            >
                <Form layout='vertical' onFinish={onBooking} form={bookingform}>
                    <div className="">
                        <h1 className='text-xl my-3 font-semibold'>Sending Amount</h1>
                        <Form.Item name={'debit'} label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
                            <Input placeholder='amount' />
                        </Form.Item>

                        <Form.Item
                            name="amount_type"
                            label="Amount Type"
                            rules={[{ required: true, message: "Please select amount type" }]}
                        >
                            <Select placeholder="select amount type">
                                <Select.Option value="Debit">Debit</Select.Option>
                                <Select.Option value="Credit">Credit</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name={'particularId'}
                            label="Particular"
                            rules={[{ required: true, message: "Please select a  particular" }]}
                        >
                            <Select
                                placeholder="Select particular"
                                options={
                                    !particularloading && particularData?.data.map((particular: { _id: string; }) => ({
                                        value: particular._id,
                                        label: particular._id
                                    }))
                                }
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button htmlType='submit' type="primary" className="w-full">Yes, Collected</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={!!bookingconfirmationModal}
                onCancel={() => {
                    setbookingconfirmationModal(false);
                    bookingconfirmationform.resetFields();
                }}
                footer={null}
                width={450}
                title={
                    <div className="text-center">
                        <ExclamationCircleOutlined style={{ fontSize: '70px', color: '#F68B1F', marginTop:25 }} />
                        <div className="mt-5 text-3xl font-semibold">Booking Confirmation?</div>
                    </div>
                }
            >
                <Form layout='vertical' className='flex w-full justify-center items-center' onFinish={onBooking} form={bookingconfirmationform}>
                    <div>
                        <h1 className='text-[15px] text-center w-full my-4'>This action cannot be undo</h1>
                        <Form.Item>
                            <Button htmlType='submit' type="primary" className='mx-2'>Yes, Confirmed</Button>
                            <Button htmlType='submit' type="primary" className='mx-2'>cancel</Button>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    );
};

export default Request;
