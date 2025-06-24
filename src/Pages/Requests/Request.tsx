import { useState } from 'react';
import { useQuery } from 'react-query';
import { getRegister } from '../../Api/Registration Table/registerTableApi';
import { Button, Table, type TableColumnsType } from 'antd';
import { CiEdit } from 'react-icons/ci';

const Request = () => {
    const [table, setTable] = useState("Registered");

    // Mock user data for UI demonstration
    const user = { position: "Admin", head_administractor: true };
    const { data: registerData, isLoading: registerloading } = useQuery('register', getRegister)



    const registerdcolumns: TableColumnsType<any> = [
        {
            title: 'Branch Name',
            dataIndex: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: boolean) => (
                <span style={{ color: status ? 'green' : 'red', fontWeight: 500 }}>
                    {status ? 'Registered' : 'Not Registered'}
                </span>
            )
        },
        // {
        //   title: 'Action',
        //   render: (_, record: any) => (
        //     <div className="flex gap-2">
        //       <Button onClick={() => handleEdit(record)}>
        //         <CiEdit />
        //       </Button>
        //       <Button danger onClick={() => handleDelete(record._id)}>
        //         <MdDeleteOutline />
        //       </Button>
        //     </div>
        //   )
        // }
    ];

    return (
        <div className="w-full py-[10px] px-[5px]">
            {/* Navigation Buttons */}
            <div className="w-full flex space-x-2 flex-wrap">
                {((user && user.position === "Admin") || user.position === "Administrator") && user.head_administractor && (
                    <button
                        onClick={() => setTable("Admission")}
                        className={`${table === "Admission" ? "bg-[#F68B1F]" : "bg-[#414042]"
                            } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Admission
                    </button>
                )}

                {(user && user.position === "Admin") || user.position === "Accountant" ? (
                    <button
                        onClick={() => setTable("Registered")}
                        className={`${table === "Registered" ? "bg-[#F68B1F]" : "bg-[#414042]"
                            } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Registration
                    </button>
                ) : null}

                {(user && user.position === "Admin") || user.position === "Administrator" ? (
                    <button
                        onClick={() => setTable("CollectPayments")}
                        className={`${table === "CollectPayments" ? "bg-[#F68B1F]" : "bg-[#414042]"
                            } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                    >
                        Bookings
                    </button>
                ) : null}

                {(user && user.position === "Admin") || user.position === "Accountant" ? (
                    <>
                        <button
                            onClick={() => setTable("Booking")}
                            className={`${table === "Booking" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Booking Confirmation
                        </button>

                        <button
                            onClick={() => setTable("Acknowledgement")}
                            className={`${table === "Acknowledgement" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Acknowledgement
                        </button>

                        <button
                            onClick={() => setTable("amount_collection")}
                            className={`${table === "amount_collection" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Amount Collection
                        </button>

                        <button
                            onClick={() => setTable("CollegeFees")}
                            className={`${table === "CollegeFees" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            College Fees
                        </button>

                        <button
                            onClick={() => setTable("Refund")}
                            className={`${table === "Refund" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Refunds
                        </button>

                        <button
                            onClick={() => setTable("Agent")}
                            className={`${table === "Agent" ? "bg-[#F68B1F]" : "bg-[#414042]"
                                } text-white py-[5px] px-[10px] rounded-md hover:bg-[#F68B1F] transition-colors`}
                        >
                            Agent Payment
                        </button>
                    </>
                ) : null}
            </div>

           
            {/* <div className="w-full mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">
                    <span className="text-[#F68B1F]">{table}</span>
                </div>
            </div> */}

            {table === "Registered" && (
                <div className="mt-4">
                    <Table
                        columns={registerdcolumns}
                        dataSource={registerData?.data}
                        loading={registerloading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            )}
        </div>
    );
};

export default Request;