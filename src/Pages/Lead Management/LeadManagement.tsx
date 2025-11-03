import { Button, Checkbox, DatePicker, Divider, Form, Input, message, Modal, Select, Switch, Table, type TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getBranch } from '../../Api/Branch/branchApi';
import { getLead } from '../../Api/Lead/leadApi';
import { getSrc } from '../../Api/SRC/SrcApi';
import { getSro } from '../../Api/SRO/SroApi';
import { useCreateLead, useDeleteLead, useUpdateLead, useUploadLead } from '../../Api/Lead/leadHooks';
import { getSchoolmanagement } from '../../Api/School Management/schoolManagementApi';
import { GrView } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLeadHistory } from '../../Redux/leadSlice';
import { AiFillPhone } from 'react-icons/ai';
import { RiAddBoxLine, RiSave3Line } from 'react-icons/ri';
import { useCreateRegisterfromlead } from '../../Api/Registration Table/registerTableHooks';
import TextArea from 'antd/es/input/TextArea';
import { getCollegeManagement } from '../../Api/College Management/collegeMgmtApi';
import { getAgent } from '../../Api/Agent/agentApi';

interface DataType {
  key: React.Key;
  name: string;
  phone_number: string;
  date_of_joining: string;
  status: string;
  delete: boolean;
  address: string;
  mark: string;
  subject_name: string;
  course: string;
  branchId: string;
  sRCId: string;
  sROId: string;
  schoolId: string;
  _id: string;
}

function LeadManagement() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Date',
      dataIndex: 'date_of_joining',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'School Name',
      dataIndex: ['schoolId', 'name'],
    },
    {
      title: 'SRC',
      dataIndex: ['sRCId', 'name'],
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
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
    {
      title: 'Action',
      render: (_, record: any) => (
        <div className="flex gap-2">
          <Link to='/leadhistory'><Button onClick={() => {
            dispatch(setLeadHistory(record))
            navigate('/leadhistory')
          }}><GrView /></Button></Link>
          <Button onClick={() => handleEdit(record)}>
            <CiEdit />
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            <MdDeleteOutline />
          </Button>
          <Button onClick={() => handleOpenregisterModal(record)}>
            <RiSave3Line />
          </Button>
          <Link to='/leadcallmanagement'><Button onClick={() => {
            dispatch(setLeadHistory(record))
            navigate('/leadcallmanagement')
          }}><AiFillPhone /></Button></Link>
        </div>
      )
    }
  ];

  const { data, isLoading, refetch } = useQuery('lead', getLead)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const { data: srcdata, isLoading: srcloading } = useQuery('src', getSrc)
  const { data: srodata, isLoading: sroloading } = useQuery('sro', getSro)
  const { data: collegedata, isLoading: collegeloading } = useQuery('college', getCollegeManagement)
  const { data: schooldata, isLoading: schoolloading } = useQuery('school', getSchoolmanagement)
  const { data: agentdata, isLoading: agentloading } = useQuery('agent', getAgent)
  const [addModal, setAddModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [registerModal, setRegisterModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  const [registeringRecord, setRegisteringRecord] = useState<DataType | null>(null)

  const { mutate: Create } = useCreateLead()
  const { mutate: Register } = useCreateRegisterfromlead()
  const { mutate: Update } = useUpdateLead()
  const { mutate: Delete } = useDeleteLead()
  const { mutate: Upload } = useUploadLead()

  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [uploadForm] = Form.useForm()

  const onRegister = (value: any) => {
    Register(value, {
      onSuccess() {
        message.success("Registered successfully")
        refetch()
        setRegisterModal(false)
        setRegisteringRecord(null)
        registerForm.resetFields()
      },
      onError() {
        message.error("Failed to register")
      }
    })
  }

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

  const onUpload = (values: any) => {
    const { file } = values;

    if (!file || !file.fileList || file.fileList.length === 0) {
      message.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('file', file.fileList[0].originFileObj);

    Upload(formData, {
      onSuccess() {
        message.success("Uploaded successfully");
        refetch();
        setUploadModal(false);
        uploadForm.resetFields(); // Use uploadForm instead of form
      },
      onError() {
        message.error("Failed to upload");
      }
    });
  };


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
      name: record.name,
      phone_number: record.phone_number,
      date_of_joining: record.date_of_joining ? dayjs(record.date_of_joining) : null,
      status: record.status,
      delete: record.delete,
      sROId: record.sROId,
      sRCId: record.sRCId,
      schoolId: record.schoolId,
      subject_name: record.subject_name,
      course: record.course,
      address: record.address,
      branchId: record.branchId,
      mark: record.mark,
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

  const handleCancelRegister = () => {
    setRegisterModal(false);
    setRegisteringRecord(null);
    registerForm.resetFields();
  };

   const handleOpenregisterModal = (record: any) => {
        setRegisterModal(record);
        registerForm.setFieldsValue({
            name: record?.name || "",
            shoolId: record?.shoolId?.name || "",
            address: record?.address || "",
            phone_number: record?.phone_number|| "",
            College: record?.collegeId?.college|| "",
            course: record?.course|| "",
        });
    };

  return (
    <div>
      <Divider>Lead Management</Divider>
      <div className="w-full flex justify-end gap-3">
        <Button type='primary' onClick={() => setUploadModal(true)}>
          <RiAddBoxLine className='text-lg' />Upload Lead
        </Button>
        <Button type='primary' onClick={() => setAddModal(true)}><RiAddBoxLine className='text-lg' />Add New</Button>
      </div>
      <Table
        className='mt-4'
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

      <Modal
        title="Upload Lead"
        open={uploadModal}
        onCancel={() => setUploadModal(false)}
        footer={null}
        width={600}
      >
        <Form layout='vertical' onFinish={onUpload} form={uploadForm}>
          <Form.Item
            name="file"
            label="Upload File"
            rules={[{ required: true, message: "Please select a file to upload" }]}
          >
            {/* <Upload
              beforeUpload={() => false}
              accept=".csv,.xlsx,.xls"
              maxCount={1}
              listType="text"
            >
              <Button>Select File</Button>
            </Upload> */}
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Lead"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={900}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-flow-row grid-cols-3 gap-x-2">
            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input placeholder='Phone Number' />
            </Form.Item>

            <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item name={'mark'} label="Mark" rules={[{ required: true, message: "Please enter Mark" }]}>
              <Input placeholder='Mark' />
            </Form.Item>

            <Form.Item name={'subject_name'} label="Subject Name" rules={[{ required: true, message: "Please enter Subject Name" }]}>
              <Input placeholder='Subject Name' />
            </Form.Item>

            <Form.Item name={'course'} label="Course" rules={[{ required: true, message: "Please enter Course" }]}>
              <Input placeholder='Course' />
            </Form.Item>

            <Form.Item
              name={'sROId'}
              label="SRO"
            >
              <Select
                placeholder="Select a Sro"
                options={
                  !sroloading && srodata?.data.map((sro: { _id: string; name:string}) => ({
                    value: sro._id,
                    label: sro.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'sRCId'}
              label="SRC"
            >
              <Select
                placeholder="Select a Src"
                options={
                  !srcloading && srcdata?.data.map((src: { _id: string; name:string}) => ({
                    value: src._id,
                    label: src.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name:string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'schoolId'}
              label="School"
              rules={[{ required: true, message: "Please select a  School" }]}
            >
              <Select
                placeholder="Select a school"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; name:string}) => ({
                    value: school._id,
                    label: school.name
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
        title="Edit Lead"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={900}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-flow-row grid-cols-3 gap-x-2">
            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input placeholder='Phone Number' />
            </Form.Item>

            <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item name={'mark'} label="Mark" rules={[{ required: true, message: "Please enter Mark" }]}>
              <Input placeholder='Mark' />
            </Form.Item>

            <Form.Item name={'subject_name'} label="Subject Name" rules={[{ required: true, message: "Please enter Subject Name" }]}>
              <Input placeholder='Subject Name' />
            </Form.Item>

            <Form.Item name={'course'} label="Course" rules={[{ required: true, message: "Please enter Course" }]}>
              <Input placeholder='Course' />
            </Form.Item>

            <Form.Item
              name={'sROId'}
              label="SRO"
            >
              <Select
                placeholder="Select a Sro"
                options={
                  !sroloading && srodata?.data.map((sro: { _id: string; name:string}) => ({
                    value: sro._id,
                    label: sro.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'sRCId'}
              label="SRC"
            >
              <Select
                placeholder="Select a Src"
                options={
                  !srcloading && srcdata?.data.map((src: { _id: string; name:string}) => ({
                    value: src._id,
                    label: src.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name:string}) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'schoolId'}
              label="School"
              rules={[{ required: true, message: "Please select a  School" }]}
            >
              <Select
                placeholder="Select a school"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; name:string}) => ({
                    value: school._id,
                    label: school.name
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

      <Modal
        title="Register"
        open={registerModal}
        onCancel={handleCancelRegister}
        footer={null}
        width={1250}
      >
        <Form layout='vertical' onFinish={onRegister} form={registerForm}>
          <div className="grid grid-flow-row grid-cols-3 gap-x-2">
            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item
              name={'schoolId'}
              label="School"
              rules={[{ required: true, message: "Please select School" }]}
            >
              <Select
                placeholder="Select School"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; name: string }) => ({
                    value: school._id,
                    label: school.name || school._id
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input placeholder='Phone Number' />
            </Form.Item>

            <Form.Item
              name={'collegeId'}
              label="College"
              rules={[{ required: true, message: "Please select College" }]}
            >
              <Select
                placeholder="Select College"
                options={
                  !collegeloading && collegedata?.data.map((college: { _id: string; college: string }) => ({
                    value: college._id,
                    label: college.college
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'course'} label="Course" rules={[{ required: true, message: "Please enter Course" }]}>
              <Input placeholder='Enter Course' />
            </Form.Item>

            <Form.Item name={'total_fee'} label="Total Fee Amount" rules={[{ required: true, message: "Please enter Total Fee" }]}>
              <Input placeholder='Total Fee Amount' />
            </Form.Item>

            <Form.Item name={'booking_amount'} label="Booking Amount" rules={[{ required: true, message: "Please enter Booking Amount" }]}>
              <Input placeholder='Booking Amount' />
            </Form.Item>

            <Form.Item name={'recived_amount'} label="Received Amount" rules={[{ required: true, message: "Please enter Received Amount" }]}>
              <Input placeholder='Received Amount' />
            </Form.Item>

            <Form.Item
              name={'agentId'}
              label="Agent"
              rules={[{ required: true, message: "Please select a  Agent" }]}
            >
              <Select
                placeholder="Select a Agent"
                options={
                  !agentloading && agentdata?.data.map((agent: { _id: string; name:string}) => ({
                    value: agent._id,
                    label: agent.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="certificates"
              label="Certificates"
              rules={[{ required: true, message: "Please select at least one certificate" }]}
            >
              <Checkbox.Group>
                <Checkbox value="SSLC">SSLC</Checkbox>
                <Checkbox value="Plus Two">Plus Two</Checkbox>
                <Checkbox value="TC">TC</Checkbox>
                <Checkbox value="CC">CC</Checkbox>
                <Checkbox value="Migration">Migration</Checkbox>
                <Checkbox value="Photo">Photo</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item name={'comment'} label="Comment" rules={[{ required: true, message: "Please enter Comment" }]}>
              <TextArea rows={2} placeholder="comment" />
            </Form.Item>

            <Form.Item name={'commission'} label="Commission" rules={[{ required: true, message: "Please enter Commission" }]}>
              <Input placeholder='Commission' />
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Register</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LeadManagement