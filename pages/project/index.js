import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Select, List, Avatar } from 'antd'
import App from '../components/Layout/index'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import style from './index.module.css'
import ProjectModal from '../components/ProjectModal'
import { fetchProject } from '../api/project'

const Project = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = (val) => {
    val = val === '所有平台' ? '' : val
    setLoading(true)
    fetchProject(val || '').then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div
        style={{
          padding: 8
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            重制
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            过滤
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns = [
    {
      title: '项目ID',
      dataIndex: 'objectId',
      key: 'objectId',
      width: '16%'
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      ...getColumnSearchProps('projectName')
    },
    {
      title: '项目地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '负责人',
      dataIndex: 'auditor',
      key: 'auditor'
    },
    {
      title: '库存',
      dataIndex: 'weight',
      key: 'weight'
    },
    {
      title: '支出',
      dataIndex: 'expend',
      key: 'expend',
      render: (val) => <span style={{ color: 'blue' }}>{val}</span>
    },
    {
      title: '销售额',
      dataIndex: 'sale',
      key: 'sale',
      render: (val) => <span style={{ color: 'red' }}>{val}</span>
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: '5%',
      render: (val, re) => <a onClick={() => showModal(re)}>修改</a>
    }
  ]
  const showModal = (re) => {
    setItemData(re)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleFinish = () => {
    setIsModalVisible(false)
    fetchData()
  }

  return (
    <App tab={'project'}>
      <div>
        <div className={style.top}>
          <div>
            <Button type="primary" onClick={() => showModal({})}>
              添加项目+
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            total: (data || []).length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
        {isModalVisible && (
          <ProjectModal
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
          />
        )}
      </div>
    </App>
  )
}

export default Project
