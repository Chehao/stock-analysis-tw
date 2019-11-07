import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { TransactionRow } from "./App";
import { detailColumns } from "./AppColum";
import paginationFactory from "react-bootstrap-table2-paginator";

interface Props {
  data: TransactionRow[];
  show: boolean;
  onHide: () => void;
}
interface State {}

export default class StockDetailModal extends Component<Props, State> {
  state = {};

  render() {
    return (
      <Modal size="xl" show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          股票明細
        </Modal.Header>
        <Modal.Body>
          <BootstrapTable
              classes="table-sm"
              bootstrap4
              keyField="id"
              data={this.props.data}
              bordered={false}
              hover
              columns={detailColumns}
              pagination={paginationFactory({ sizePerPage: 50, showTotal: true, sizePerPageList: [25, 50, 100, 250, 500] })}
           />
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    );
  }
}
