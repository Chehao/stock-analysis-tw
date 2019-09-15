import moment from "moment";

export const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true
  },
  {
    dataField: "成交",
    text: "成交日期",
    formatter: (cell: Date) => moment(cell).format("YYYY-MM-DD"),
    sort: true
  },
  {
    dataField: "股票",
    text: "股票",
    sort: true
  },
  {
    dataField: "買賣別",
    text: "買賣別"
  },
  {
    dataField: "成交_1",
    text: "成交量",
    sort: true
  },
  { dataField: "價金", text: "價金", sort: true },
  {
    dataField: "手續費",
    text: "手續費",
    sort: true
  },
  {
    dataField: "損益",
    text: "損益",
    sort: true
  }
];
