import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  InputNumber, 
  Card, 
  Typography, 
  message, 
  Space,
  Row,
  Col
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { STORAGE_BUCKETS } from '@/lib/supabase-client';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ListingFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location?: string;
}

const CreateListing = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    { value: 'parts', label: 'Parts & Components' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'tools', label: 'Tools & Equipment' },
    { value: 'vehicles', label: 'Complete Vehicles' },
    { value: 'manuals', label: 'Manuals & Documentation' },
    { value: 'other', label: 'Other' },
  ];

  const conditions = [
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' },
  ];

  const handleImageUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileExt = (file as File).name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.VEHICLE_PHOTOS)
        .upload(fileName, file as File);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.VEHICLE_PHOTOS)
        .getPublicUrl(fileName);

      onSuccess?.(data.publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error as Error);
      message.error('Failed to upload image');
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values: ListingFormData) => {
    if (!user) {
      message.error('You must be logged in to create a listing');
      return;
    }

    setLoading(true);
    
    try {
      // Get uploaded image URLs
      const imageUrls = fileList
        .filter(file => file.status === 'done')
        .map(file => file.response || file.url)
        .filter(Boolean);

      // Create listing in Supabase
      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          title: values.title,
          description: values.description,
          price: values.price,
          category: values.category,
          condition: values.condition,
          location: values.location || null,
          images: imageUrls,
          seller_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      message.success('Listing created successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      message.error('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Title level={2}>Please log in to create a listing</Title>
          <Link to="/auth/login">
            <Button type="primary" size="large">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/marketplace">
              <Button icon={<ArrowLeftOutlined />} type="text">
                Back to Marketplace
              </Button>
            </Link>
          </div>

          <Card>
            <Title level={2}>Create New Listing</Title>
            <Paragraph>
              List your Unimog parts, accessories, or complete vehicles for sale in our community marketplace.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                condition: 'Good',
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label="Listing Title"
                    rules={[
                      { required: true, message: 'Please enter a title for your listing' },
                      { min: 5, message: 'Title must be at least 5 characters long' },
                    ]}
                  >
                    <Input placeholder="e.g., Original Unimog U1700L Front Bumper" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select placeholder="Select category">
                      {categories.map(cat => (
                        <Option key={cat.value} value={cat.value}>
                          {cat.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="condition"
                    label="Condition"
                    rules={[{ required: true, message: 'Please select condition' }]}
                  >
                    <Select placeholder="Select condition">
                      {conditions.map(cond => (
                        <Option key={cond.value} value={cond.value}>
                          {cond.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price (€)"
                    rules={[
                      { required: true, message: 'Please enter a price' },
                      { type: 'number', min: 0, message: 'Price must be greater than 0' },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.00"
                      formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/€\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location (Optional)"
                  >
                    <Input placeholder="e.g., Munich, Germany" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please provide a description' },
                  { min: 20, message: 'Description must be at least 20 characters long' },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Describe the item's condition, history, and any relevant details..."
                />
              </Form.Item>

              <Form.Item label="Photos">
                <Upload
                  customRequest={handleImageUpload}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  maxCount={10}
                >
                  {fileList.length >= 10 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <div className="text-sm text-gray-500 mt-2">
                  Upload up to 10 photos. First photo will be used as the main image.
                </div>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading} size="large">
                    Create Listing
                  </Button>
                  <Link to="/marketplace">
                    <Button size="large">Cancel</Button>
                  </Link>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
  );
};

export default CreateListing;