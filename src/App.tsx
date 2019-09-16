import React, { useState, useEffect } from "react";
import { Col, Container, Nav, Navbar, NavDropdown, Row, Tabs, Tab } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useDropzone } from "react-dropzone";
import * as XLSX from 'xlsx';
import "./App.css";
import { columns, groupColumns } from "./AppColum";
import * as _ from 'lodash';

const rowClasses = (row: { 損益: number}, rowIndex: number) => {
  // if (row.損益 > 0) {
  //   return 'stock-raise'
  // } else if (row.損益 < 0) {
  //   return 'stock-fall'
  // }
  return ''
};
export interface TrsactionRow {
  "id": number,
  "成交": Date,
  "股票": string,
  "交易": string,
  "買賣別": string,
  "交易_1": string,
  "成交_1": number,
  "成交價": number,
  "價金": number,
  "手續費": number,
  "交易稅": number,
  "應收": number,
  "融資金額": number,
  "自備款": number,
  "融資券": number,
  "融券": number,
  "標借費": number,
  "利息": number,
  "二代健保": number,
  "損益": number,
  "交割日": Date,
  "幣別": string,
  "市價": number,
  "平均價": number,
  "股數": number,
}
/*
  {
    "id": 0,
    "成交": "2019-12-23T16:00:00.000Z",
    "股票": "[2882]國泰金",
    "交易": "整股",
    "買賣別": "買",
    "交易_1": "現股",
    "成交_1": 1000,
    "成交價": 46.7,
    "價金": 46700,
    "手續費": 39,
    "交易稅": 0,
    "應收": -46739,
    "融資金額": 0,
    "自備款": 0,
    "融資券": 0,
    "融券": 0,
    "標借費": 0,
    "利息": 0,
    "二代健保": 0,
    "損益": 0,
    "交割日": "2019-12-25T16:00:00.000Z",
    "幣別": "新台幣"
  },
*/
const App: React.FC = props => {
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<object[]>(
    localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("stock") as string): []
  );
  const [groupData, setGroupData] = useState<{[key: string]: any}>(
    localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("group-stock") as string): {}
  );
  const [key, setKey] = useState('transaction');
  const { getRootProps, getInputProps } = useDropzone({
    disabled: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      ));
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        try {
            const result = event.target!.result; // 以二進制流方式讀取得到整份excel表格對象
            const workbook = XLSX.read(result, { type: "binary", cellDates: true });
            let data: object[] = [];
            for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                    console.log(sheet);
                    data = data.concat(
                        XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                    ); // break; // 如果只取第一張表，就取消註釋這行
                }
            }
            const newData = data.slice(1, -1).map( (n, i) => ({ id:i, ...n}) );
            const newGroupData = _.chain(newData).groupBy('股票').mapValues((details: TrsactionRow[], key: string) => {
              const buyShares = details.filter((r: TrsactionRow) => (r["買賣別"] === "買"))
              const buySharesNum = buyShares.map((r: TrsactionRow) => (r["成交_1"])).reduce((sum, x) => sum + x, 0)
              const sellShares = details.filter((r: TrsactionRow) => (r["買賣別"] === "賣"))
              const sellSharesNum = sellShares.map((r: TrsactionRow) => (r["成交_1"])).reduce((sum, x) => sum + x, 0)
              const totalShares = buySharesNum - sellSharesNum
              const income = sellShares.map((r: TrsactionRow) => (r["損益"])).reduce((sum, x) => sum + x, 0)
              let matchSellShare = 0;
              let remaindCoust = 0;
              buyShares.forEach((d: TrsactionRow) => {
                  matchSellShare = matchSellShare + d["成交_1"];
                  if (matchSellShare > sellSharesNum) {
                    if (matchSellShare - sellSharesNum <  d["成交_1"]) {
                      remaindCoust = remaindCoust - (matchSellShare - sellSharesNum) * (d["成交價"] + d["手續費"]/d["成交_1"]);
                    } else {
                      remaindCoust = remaindCoust + d["應收"];
                    }
                    
                  }

              })
              
              // const totalCost =  details.filter((r: TrsactionRow) => (r["買賣別"] === "買")).map(n => n["應收"]).reduce((sum, x) => sum + x) + 
              // details.filter((r: TrsactionRow) => (r["買賣別"] === "賣")).map(n => n["應收"]).reduce((sum, x) => sum + x, 0)  
              return {
                "股票": key,
                "明細": details,
                "股數": totalShares,
                "成本": -remaindCoust,
                "平均價": (Math.round(-remaindCoust/totalShares*100)/100),
                "損益": income
              }  
            }).value();
            console.log(newGroupData)
            setData(newData);
            setGroupData(newGroupData)
            localStorage.setItem('stock', JSON.stringify(newData));
            localStorage.setItem('group-stock', JSON.stringify(newGroupData));
        } catch (e) {
            console.error(e);
            return;
        }
      }; // 以二進制方式打開文件
      fileReader.readAsBinaryString(acceptedFiles[0]);
    }
  });
  // const fs = files.map(file => (
  //   <li key={file.name}>
  //     {file.name} - {file.size} bytes
  //   </li>
  // ));
  useEffect(() => {
    console.log("useEffect");
    groupData && Object.keys(groupData).forEach((key) => {
      console.log(key);
      const stockNo = key.split("]")[0].split("[")[1]
      console.log()
      const url = `/stock/api/getStockInfo.jsp?ex_ch=tse_${stockNo}.tw&json=1&delay=0&_=`;
      fetch(url, {
      }).then((response) => response.json())
      .then(data => {
        console.log(data.msgArray[0].z);
        groupData[key] = {...groupData[key], 市價: data.msgArray[0].z}
      }).catch(e => {
        console.error("error on" + key);
      })
      ;
      // var response = UrlFetchApp.fetch(url);
      // var json = response.getContentText("UTF-8");
      // var data = JSON.parse(json);
      // return data.msgArray[0].z;
    });
    
  }, [groupData]);

  return (
    <div className="App">
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Brand href="#home">元大投資xlsx匯入</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k: string) => setKey(k)}>
          <Tab eventKey="transaction" title="Transaction">
            <BootstrapTable
              classes="table-sm"
              bootstrap4
              keyField="id"
              data={data}
              bordered={false}
              hover
              columns={columns}
              rowClasses={rowClasses}
              pagination={paginationFactory({ sizePerPage: 50, showTotal: true, sizePerPageList: [25, 50, 100, 250, 500] })}
            />
          </Tab>
          <Tab eventKey="stock" title="Stock">
            <BootstrapTable
              classes="table-sm"
              bootstrap4
              keyField="股票"
              data={Object.values(groupData)}
              bordered={false}
              hover
              columns={groupColumns}
              rowClasses={rowClasses}
              pagination={paginationFactory({ sizePerPage: 50, showTotal: true, sizePerPageList: [25, 50, 100, 250, 500] })}
            />
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled>
            ccc
          </Tab>
        </Tabs>
        
        <Row>
          <Col>
            <section className="container">
              <div {...getRootProps({ className: "dropzone disabled" })}>
                <input {...getInputProps()} />
                <p>拖拉Excel匯入資料</p>
              </div>
              {/* <aside>
                <h4>Files</h4>
                <ul>{fs}</ul>
              </aside> */}
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
