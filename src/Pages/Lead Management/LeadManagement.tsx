import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Table, Upload, type TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getBranch } from '../../Api/Branch/branchApi';
import { getLead } from '../../Api/Lead/leadApi';
import { getSrc } from '../../Api/SRC/SrcApi';
import { getSro } from '../../Api/SRO/SroApi';
import { useCreateLead, useDeleteLead, useUpdateLead } from '../../Api/Lead/leadHooks';
import { getSchoolmanagement } from '../../Api/School Management/schoolManagementApi';
import { GrView } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLeadHistory } from '../../Redux/leadSlice';
import { AiFillPhone } from 'react-icons/ai';
import { RiAddBoxLine } from 'react-icons/ri';
import { InboxOutlined } from '@ant-design/icons';

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
      title: 'Phone Number',
      dataIndex: 'phone_number',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
    // {
    //   title: 'Delete',
    //   dataIndex: 'delete',
    //   render: (status: boolean) => (
    //     <span style={{ color: status ? 'green' : 'red', fontWeight: 500 }}>
    //       {status ? 'Registered' : 'Not Registered'}
    //     </span>
    //   )
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    // },
    {
      title: 'School Name',
      dataIndex: ['schoolId', 'name'],
    },
    {
      title: 'SRC',
      dataIndex: ['sRCId', 'name'],
    },
    {
      title: 'Mark',
      dataIndex: 'mark',
    },
    {
      title: 'Subject Name',
      dataIndex: 'subject_name',
    },
    {
      title: 'Course',
      dataIndex: 'course',
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
          <Button>
            <AiFillPhone />
          </Button>
        </div>
      )
    }
  ];

  const { data, isLoading, refetch } = useQuery('lead', getLead)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const { data: srcdata, isLoading: srcloading } = useQuery('src', getSrc)
  const { data: srodata, isLoading: sroloading } = useQuery('sro', getSro)
  const { data: schooldata, isLoading: schoolloading } = useQuery('school', getSchoolmanagement)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)

  const { mutate: Create } = useCreateLead()
  const { mutate: Update } = useUpdateLead()
  const { mutate: Delete } = useDeleteLead()

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

  // const { Dragger } = Upload;

  // const props: UploadProps = {
  //   name: 'file',
  //   multiple: true,
  //   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  //   onChange(info) {
  //     const { status } = info.file;
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e.dataTransfer.files);
  //   },
  // };


  const handleCancelEdit = () => {
    setEditModal(false);
    setEditingRecord(null);
    editForm.resetFields();
  };

  return (
    <div>
      <Divider>Lead Management</Divider>
      <div className="w-full flex justify-end gap-3">
        <Button type='primary'><RiAddBoxLine className='text-lg' />Upload Lead</Button>
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

            {/* <Form.Item name={'status'} label="Status" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <Input placeholder='Status' />
            </Form.Item>

            <Form.Item name={'delete'} label="Delete" valuePropName="checked">
              <Switch />
            </Form.Item> */}

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
              rules={[{ required: true, message: "Please select a  Sro" }]}
            >
              <Select
                placeholder="Select a Sro"
                options={
                  !sroloading && srodata?.data.map((sro: { _id: string; }) => ({
                    value: sro._id,
                    label: sro._id
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'sRCId'}
              label="SRC"
              rules={[{ required: true, message: "Please select a  Src" }]}
            >
              <Select
                placeholder="Select a Src"
                options={
                  !srcloading && srcdata?.data.map((src: { _id: string; }) => ({
                    value: src._id,
                    label: src._id
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
                  !branchloading && branchdata?.data.map((branch: { _id: string; }) => ({
                    value: branch._id,
                    label: branch._id
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
                placeholder="Select a branch"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; }) => ({
                    value: school._id,
                    label: school._id
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

      {/* <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger> */}


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

            {/* <Form.Item name={'status'} label="Status" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <Input placeholder='Status' />
            </Form.Item>

            <Form.Item name={'delete'} label="Delete" valuePropName="checked">
              <Switch />
            </Form.Item> */}

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
              rules={[{ required: true, message: "Please select a  Sro" }]}
            >
              <Select
                placeholder="Select a Sro"
                options={
                  !sroloading && srodata?.data.map((sro: { _id: string; }) => ({
                    value: sro._id,
                    label: sro._id
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'sRCId'}
              label="SRC"
              rules={[{ required: true, message: "Please select a  Src" }]}
            >
              <Select
                placeholder="Select a Src"
                options={
                  !srcloading && srcdata?.data.map((src: { _id: string; }) => ({
                    value: src._id,
                    label: src._id
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
                  !branchloading && branchdata?.data.map((branch: { _id: string; }) => ({
                    value: branch._id,
                    label: branch._id
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
                placeholder="Select a branch"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; }) => ({
                    value: school._id,
                    label: school._id
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

export default LeadManagement