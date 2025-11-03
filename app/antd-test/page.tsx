"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Space,
  Card,
  Table,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Progress,
  Tag,
  Badge,
  Avatar,
  Typography,
  Divider,
  Empty,
  Alert,
  message,
  notification,
  Modal,
  Drawer,
  Popconfirm,
  Tooltip,
  Popover,
  Tabs,
  Timeline,
  Steps,
  Collapse,
  Tree,
  Transfer,
  Pagination,
  Spin,
  Skeleton,
  Statistic,
  Row,
  Col,
  Upload,
  Rate,
  ColorPicker,
  Segmented,
  Flex,
  FloatButton,
  Breadcrumb,
  Dropdown,
  Menu,
  Cascader,
  InputNumber,
  Mentions,
  AutoComplete,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  HomeOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { notificationService } from "@/services/notification/notification.service";

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Step } = Steps;
const { RangePicker } = DatePicker;

export default function AntdTestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState<string>("1");

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const tableData = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
  ];

  const menuItems = [
    {
      key: "1",
      label: "Menu Item 1",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Menu Item 2",
      icon: <SettingOutlined />,
    },
    {
      key: "3",
      label: "Menu Item 3",
      icon: <BellOutlined />,
    },
  ];

  const testNotification = (type: "success" | "error" | "info" | "warning") => {
    notificationService[type](
      `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      `This is a ${type} notification message. You can style this in the Ant Design provider.`
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Title level={1}>Ant Design Components Test Page</Title>
          <Paragraph>
            This page contains all Ant Design components for testing and
            styling. Use this page to verify that all components match your
            design system.
          </Paragraph>
        </div>

        <Divider>Buttons</Divider>

        <Card title="Buttons" className="mb-6">
          <Space wrap>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
            <Button danger>Danger Button</Button>
            <Button type="primary" danger>
              Primary Danger
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              With Icon
            </Button>
            <Button type="primary" loading>
              Loading
            </Button>
            <Button type="primary" disabled>
              Disabled
            </Button>
            <Button.Group>
              <Button>Left</Button>
              <Button>Middle</Button>
              <Button>Right</Button>
            </Button.Group>
          </Space>
        </Card>

        <Divider>Notifications</Divider>

        <Card title="Notifications" className="mb-6">
          <Space wrap>
            <Button onClick={() => testNotification("success")}>
              Success Notification
            </Button>
            <Button onClick={() => testNotification("error")}>
              Error Notification
            </Button>
            <Button onClick={() => testNotification("info")}>
              Info Notification
            </Button>
            <Button onClick={() => testNotification("warning")}>
              Warning Notification
            </Button>
            <Button
              onClick={() => message.success("This is a success message")}
            >
              Success Message
            </Button>
            <Button onClick={() => message.error("This is an error message")}>
              Error Message
            </Button>
            <Button onClick={() => message.info("This is an info message")}>
              Info Message
            </Button>
            <Button
              onClick={() => message.warning("This is a warning message")}
            >
              Warning Message
            </Button>
            <Button
              onClick={() =>
                notification.open({
                  message: "Notification Title",
                  description: "This is a notification description",
                  icon: <InfoCircleOutlined style={{ color: "#1d72a6" }} />,
                })
              }
            >
              Custom Notification
            </Button>
          </Space>
        </Card>

        <Divider>Inputs</Divider>

        <Card title="Inputs" className="mb-6">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input placeholder="Basic input" />
            <Input placeholder="Input with prefix" prefix={<UserOutlined />} />
            <Input
              placeholder="Input with suffix"
              suffix={<SearchOutlined />}
            />
            <Input.Password placeholder="Password input" />
            <TextArea rows={4} placeholder="Textarea" />
            <InputNumber style={{ width: "100%" }} placeholder="Input number" />
            <Input.Group compact>
              <Input style={{ width: "20%" }} defaultValue="0571" />
              <Input style={{ width: "30%" }} defaultValue="26888888" />
            </Input.Group>
            <AutoComplete
              style={{ width: "100%" }}
              placeholder="AutoComplete"
              options={[
                { value: "Option 1" },
                { value: "Option 2" },
                { value: "Option 3" },
              ]}
            />
          </Space>
        </Card>

        <Divider>Selects & Pickers</Divider>

        <Card title="Selects & Pickers" className="mb-6">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Select
              style={{ width: "100%" }}
              placeholder="Select option"
              defaultValue="option1"
            >
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
              <Option value="option3">Option 3</Option>
            </Select>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Multiple select"
              defaultValue={["option1", "option2"]}
            >
              <Option value="option1">Option 1</Option>
              <Option value="option2">Option 2</Option>
              <Option value="option3">Option 3</Option>
            </Select>
            <DatePicker style={{ width: "100%" }} />
            <RangePicker style={{ width: "100%" }} />
            <TimePicker style={{ width: "100%" }} />
            <Cascader
              style={{ width: "100%" }}
              options={[
                {
                  value: "zhejiang",
                  label: "Zhejiang",
                  children: [
                    {
                      value: "hangzhou",
                      label: "Hangzhou",
                    },
                  ],
                },
              ]}
              placeholder="Cascader"
            />
          </Space>
        </Card>

        <Divider>Form</Divider>

        <Card title="Form" className="mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => console.log(values)}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Select" name="select">
              <Select>
                <Option value="1">Option 1</Option>
                <Option value="2">Option 2</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Textarea" name="textarea">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider>Checkboxes & Radios</Divider>

        <Card title="Checkboxes & Radios" className="mb-6">
          <Space direction="vertical">
            <Checkbox>Checkbox</Checkbox>
            <Checkbox defaultChecked>Checked</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
            <Radio.Group
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <Radio value="1">Option 1</Radio>
              <Radio value="2">Option 2</Radio>
              <Radio value="3">Option 3</Radio>
            </Radio.Group>
            <Switch defaultChecked />
            <Switch />
            <Switch disabled />
            <Segmented
              options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
              defaultValue="Daily"
            />
          </Space>
        </Card>

        <Divider>Sliders & Progress</Divider>

        <Card title="Sliders & Progress" className="mb-6">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text>Slider</Text>
              <Slider defaultValue={30} />
            </div>
            <div>
              <Text>Range Slider</Text>
              <Slider range defaultValue={[20, 50]} />
            </div>
            <div>
              <Text>Progress</Text>
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              <Progress type="circle" percent={75} />
            </div>
          </Space>
        </Card>

        <Divider>Tags & Badges</Divider>

        <Card title="Tags & Badges" className="mb-6">
          <Space wrap>
            <Tag>Tag</Tag>
            <Tag color="blue">Blue</Tag>
            <Tag color="green">Green</Tag>
            <Tag color="red">Red</Tag>
            <Tag color="orange">Orange</Tag>
            <Tag closable>Closable</Tag>
            <Badge count={5}>
              <Avatar shape="square" size="large" />
            </Badge>
            <Badge count={0} showZero>
              <Avatar shape="square" size="large" />
            </Badge>
            <Badge dot>
              <Avatar shape="square" size="large" />
            </Badge>
            <Badge.Ribbon text="Ribbon">
              <Card>Card with ribbon</Card>
            </Badge.Ribbon>
          </Space>
        </Card>

        <Divider>Typography</Divider>

        <Card title="Typography" className="mb-6">
          <Space direction="vertical">
            <Title level={1}>Heading 1</Title>
            <Title level={2}>Heading 2</Title>
            <Title level={3}>Heading 3</Title>
            <Title level={4}>Heading 4</Title>
            <Title level={5}>Heading 5</Title>
            <Paragraph>
              This is a paragraph. Ant Design typography provides consistent
              text styling.
            </Paragraph>
            <Text>Text</Text>
            <Text strong>Strong text</Text>
            <Text italic>Italic text</Text>
            <Text underline>Underlined text</Text>
            <Text delete>Deleted text</Text>
            <Text code>Code text</Text>
            <Link href="#">Link</Link>
            <Text copyable>Copyable text</Text>
          </Space>
        </Card>

        <Divider>Alerts</Divider>

        <Card title="Alerts" className="mb-6">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Alert message="Success alert" type="success" showIcon />
            <Alert message="Info alert" type="info" showIcon />
            <Alert message="Warning alert" type="warning" showIcon />
            <Alert message="Error alert" type="error" showIcon />
            <Alert
              message="Alert with description"
              description="This is an alert with description text."
              type="success"
              showIcon
              closable
            />
          </Space>
        </Card>

        <Divider>Table</Divider>

        <Card title="Table" className="mb-6">
          <Table columns={tableColumns} dataSource={tableData} />
        </Card>

        <Divider>Modals & Drawers</Divider>

        <Card title="Modals & Drawers" className="mb-6">
          <Space>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Popconfirm</Button>
            </Popconfirm>
          </Space>
          <Modal
            title="Modal Title"
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
          >
            <p>This is modal content</p>
          </Modal>
          <Drawer
            title="Drawer Title"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <p>This is drawer content</p>
          </Drawer>
        </Card>

        <Divider>Tooltips & Popovers</Divider>

        <Card title="Tooltips & Popovers" className="mb-6">
          <Space>
            <Tooltip title="This is a tooltip">
              <Button>Hover me</Button>
            </Tooltip>
            <Popover
              content={
                <div>
                  <p>Content</p>
                  <p>Content</p>
                </div>
              }
              title="Title"
            >
              <Button>Click me</Button>
            </Popover>
          </Space>
        </Card>

        <Divider>Tabs</Divider>

        <Card title="Tabs" className="mb-6">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Tab 1",
                children: "Content of Tab Pane 1",
              },
              {
                key: "2",
                label: "Tab 2",
                children: "Content of Tab Pane 2",
              },
              {
                key: "3",
                label: "Tab 3",
                children: "Content of Tab Pane 3",
              },
            ]}
          />
        </Card>

        <Divider>Timeline & Steps</Divider>

        <Card title="Timeline & Steps" className="mb-6">
          <Row gutter={16}>
            <Col span={12}>
              <Timeline
                items={[
                  {
                    children: "Create a services site 2015-09-01",
                  },
                  {
                    children: "Solve initial network problems 2015-09-01",
                  },
                  {
                    children: "Technical testing 2015-09-01",
                  },
                  {
                    children: "Network problems being solved 2015-09-01",
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <Steps
                current={1}
                items={[
                  {
                    title: "Finished",
                    description: "This is a description.",
                  },
                  {
                    title: "In Progress",
                    description: "This is a description.",
                  },
                  {
                    title: "Waiting",
                    description: "This is a description.",
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>

        <Divider>Collapse</Divider>

        <Card title="Collapse" className="mb-6">
          <Collapse>
            <Panel header="Panel 1" key="1">
              <p>Content of panel 1</p>
            </Panel>
            <Panel header="Panel 2" key="2">
              <p>Content of panel 2</p>
            </Panel>
            <Panel header="Panel 3" key="3">
              <p>Content of panel 3</p>
            </Panel>
          </Collapse>
        </Card>

        <Divider>Other Components</Divider>

        <Card title="Other Components" className="mb-6">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text>Spin</Text>
              <Spin />
              <Spin size="large" />
            </div>
            <div>
              <Text>Skeleton</Text>
              <Skeleton active />
            </div>
            <div>
              <Text>Empty</Text>
              <Empty />
            </div>
            <div>
              <Text>Statistics</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Active Users" value={1128} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Account Balance (CNY)"
                    value={112893}
                    precision={2}
                  />
                </Col>
              </Row>
            </div>
            <div>
              <Text>Rate</Text>
              <Rate defaultValue={3} />
            </div>
            <div>
              <Text>Color Picker</Text>
              <ColorPicker defaultValue="#1d72a6" />
            </div>
            <div>
              <Text>Upload</Text>
              <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
            <div>
              <Text>Breadcrumb</Text>
              <Breadcrumb
                items={[
                  {
                    title: (
                      <span>
                        <HomeOutlined /> Home
                      </span>
                    ),
                  },
                  {
                    title: "Application",
                  },
                  {
                    title: "Component",
                  },
                ]}
              />
            </div>
            <div>
              <Text>Dropdown</Text>
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Button>
                  Click me <UserOutlined />
                </Button>
              </Dropdown>
            </div>
            <div>
              <Text>Menu</Text>
              <Menu mode="horizontal" items={menuItems} />
            </div>
            <div>
              <Text>Pagination</Text>
              <Pagination defaultCurrent={1} total={50} />
            </div>
            <div>
              <Text>Float Button</Text>
              <FloatButton icon={<PlusOutlined />} />
            </div>
          </Space>
        </Card>

        <Divider>Avatars</Divider>

        <Card title="Avatars" className="mb-6">
          <Space>
            <Avatar size={64} icon={<UserOutlined />} />
            <Avatar size="large" icon={<UserOutlined />} />
            <Avatar icon={<UserOutlined />} />
            <Avatar size="small" icon={<UserOutlined />} />
            <Avatar shape="square" icon={<UserOutlined />} />
            <Avatar>U</Avatar>
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
          </Space>
        </Card>

        <Divider>Cards</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card Title" extra={<a href="#">More</a>}>
              <p>Card content</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Card.Meta title="Card Title" description="Card description" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
