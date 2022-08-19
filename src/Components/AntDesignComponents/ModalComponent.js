// import { Modal } from "antd";
import { Modal } from "@shopify/polaris";
import React, { useState } from "react";

const { confirm } = Modal;

const ModalComponent = ({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  footer,
  modalContent,
}) => {
  // console.log("modalContent", modalContent);
  return (
    <div>
      <Modal
        title={title}
        open={isModalVisible}
        onClose={handleCancel}
        // visible={isModalVisible}
        // onOk={handleOk}
        // onCancel={handleCancel}
        // footer={footer}
      >
        <Modal.Section>{modalContent}</Modal.Section>
      </Modal>
    </div>
  );
};

export default ModalComponent;
