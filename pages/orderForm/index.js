import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Upload, DatePicker } from 'antd'
import moment from 'moment'
import { UploadOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import { SearchOutlined } from '@ant-design/icons'
import App from '../components/Layout/index'
import style from './index.module.css'
import OrderForm from '../components/OrderModal'
import { pushItem, fetchTable } from '../api/orderForm'
import { TABLE_HEADER } from '../../public/static/constant'

const Home = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [changeData, setChangeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(moment().format('YYYYMMDD'))

  const searchInput = useRef(null)
  useEffect(() => {
    fetchData()
  }, [isModalVisible, date])

  const fetchData = () => {
    setLoading(true)
    fetchTable(date).then((res) => {
      setData((res || []).reverse())
      setChangeData(res)
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
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
            Filter
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
      title: Object.keys(TABLE_HEADER)[0],
      dataIndex: Object.values(TABLE_HEADER)[0],
      key: Object.values(TABLE_HEADER)[0],
      fixed: 'left',
      ...getColumnSearchProps(Object.values(TABLE_HEADER)[0])
    },
    {
      title: Object.keys(TABLE_HEADER)[1],
      dataIndex: Object.values(TABLE_HEADER)[1],
      key: Object.values(TABLE_HEADER)[1]
    },
    {
      title: Object.keys(TABLE_HEADER)[2],
      dataIndex: Object.values(TABLE_HEADER)[2],
      key: Object.values(TABLE_HEADER)[2]
    },
    {
      title: Object.keys(TABLE_HEADER)[3],
      dataIndex: Object.values(TABLE_HEADER)[3],
      key: Object.values(TABLE_HEADER)[3],
      ...getColumnSearchProps(Object.values(TABLE_HEADER)[3])
    },
    {
      title: Object.keys(TABLE_HEADER)[4],
      dataIndex: Object.values(TABLE_HEADER)[4],
      key: Object.values(TABLE_HEADER)[4],
      ...getColumnSearchProps(Object.values(TABLE_HEADER)[4])
    },
    {
      title: Object.keys(TABLE_HEADER)[5],
      dataIndex: Object.values(TABLE_HEADER)[5],
      key: Object.values(TABLE_HEADER)[5]
    },
    {
      title: Object.keys(TABLE_HEADER)[6],
      dataIndex: Object.values(TABLE_HEADER)[6],
      key: Object.values(TABLE_HEADER)[6]
    },
    {
      title: Object.keys(TABLE_HEADER)[7],
      dataIndex: Object.values(TABLE_HEADER)[7],
      key: Object.values(TABLE_HEADER)[7]
    },
    {
      title: Object.keys(TABLE_HEADER)[8],
      dataIndex: Object.values(TABLE_HEADER)[8],
      key: Object.values(TABLE_HEADER)[8]
    },
    {
      title: Object.keys(TABLE_HEADER)[9],
      dataIndex: Object.values(TABLE_HEADER)[9],
      key: Object.values(TABLE_HEADER)[9],
      ...getColumnSearchProps(Object.values(TABLE_HEADER)[9])
    },
    {
      title: Object.keys(TABLE_HEADER)[10],
      dataIndex: Object.values(TABLE_HEADER)[10],
      key: Object.values(TABLE_HEADER)[10]
    },
    {
      title: Object.keys(TABLE_HEADER)[11],
      dataIndex: Object.values(TABLE_HEADER)[11],
      key: Object.values(TABLE_HEADER)[11]
    },
    {
      title: Object.keys(TABLE_HEADER)[12],
      dataIndex: Object.values(TABLE_HEADER)[12],
      key: Object.values(TABLE_HEADER)[12]
    },
    {
      title: Object.keys(TABLE_HEADER)[13],
      dataIndex: Object.values(TABLE_HEADER)[13],
      key: Object.values(TABLE_HEADER)[13]
    },
    {
      title: Object.keys(TABLE_HEADER)[14],
      dataIndex: Object.values(TABLE_HEADER)[14],
      key: Object.values(TABLE_HEADER)[14]
    },
    {
      title: Object.keys(TABLE_HEADER)[15],
      dataIndex: Object.values(TABLE_HEADER)[15],
      key: Object.values(TABLE_HEADER)[15]
    },
    {
      title: Object.keys(TABLE_HEADER)[16],
      dataIndex: Object.values(TABLE_HEADER)[16],
      key: Object.values(TABLE_HEADER)[16]
    },
    {
      title: Object.keys(TABLE_HEADER)[17],
      dataIndex: Object.values(TABLE_HEADER)[17],
      key: Object.values(TABLE_HEADER)[17]
    },
    {
      title: Object.keys(TABLE_HEADER)[18],
      dataIndex: Object.values(TABLE_HEADER)[18],
      key: Object.values(TABLE_HEADER)[18]
    },
    {
      title: Object.keys(TABLE_HEADER)[19],
      dataIndex: Object.values(TABLE_HEADER)[19],
      key: Object.values(TABLE_HEADER)[19]
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      render: (val, re) => <a onClick={() => showModal(re)}>编辑</a>
    }
  ]

  const showModal = (re) => {
    setItemData(re)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const onChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const exportTable = () => {
    let sheetFilter = Object.values(TABLE_HEADER)
    let option = {}
    option.fileName = '订单详情'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '订单详情',
        sheetFilter: sheetFilter,
        sheetHeader: Object.keys(TABLE_HEADER),
        columnWidths: [
          5, 5, 5, 5, 5, 5, 5, 10, 5, 5, 5, 5, 5, 5, 5, 10, 5, 5, 5, 5, 5, 5, 5,
          10, 5, 5, 5, 5, 5, 5, 5, 10
        ]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //保存
  }

  const HandleImportFile = (info) => {
    let files = info.file
    // 获取文件名称
    let name = files.name
    // 获取文件后缀
    let suffix = name.substr(name.lastIndexOf('.'))
    let reader = new FileReader()
    reader.onload = (event) => {
      setLoading(true)
      try {
        // 判断文件类型是否正确
        if ('.xls' != suffix && '.xlsx' != suffix) {
          message.error('选择Excel格式的文件导入!')
          return false
        }
        let { result } = event.target
        // 读取文件
        let workbook = XLSX.read(result, { type: 'binary' })
        let data = []
        // 循环文件中的每个表
        for (let sheet in workbook.Sheets) {
          // if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 将获取到表中的数据转化为json格式
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          // }
        }
        pushItem(data).then(() => {
          fetchData()
        })
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    reader.readAsBinaryString(files)
  }

  return (
    <App tab="orderForm">
      <div>
        <div className={style.top}>
          <div>
            日期：
            <DatePicker
              defaultValue={moment()}
              format="YYYYMMDD"
              onChange={onChangeDate}
            />
          </div>

          <div>
            <Upload
              accept=".xls , .xlsx"
              maxCount={1}
              showUploadList={false}
              customRequest={HandleImportFile}
            >
              <Button icon={<UploadOutlined />} type="primary">
                上传文件
              </Button>
            </Upload>
            <Button
              style={{
                marginLeft: '10px'
              }}
              type="primary"
              onClick={exportTable}
              danger
              ghost
            >
              导出
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 300px)', x: 4200 }}
          onChange={onChange}
        />
        <OrderForm
          isModalVisible={isModalVisible}
          data={itemData}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      </div>
    </App>
  )
}

export default Home
