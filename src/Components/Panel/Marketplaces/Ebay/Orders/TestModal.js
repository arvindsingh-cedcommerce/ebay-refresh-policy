// import Modal from '/home/cedcoss/Desktop/phalcon-docker/app/amazon-ebay-multi/src/modules/modals/components/Modal.js'
import React from 'react'
import Modal from '../../../../../../src/modules/modals/components/Modal'
import ModalBody from '../../../../../../src/modules/modals/components/ModalBody'
import ModalHeader from '../../../../../../src/modules/modals/components/ModalHeader'
import ModalFooter from '../../../../../../src/modules/modals/components/ModalFooter'

export default function TestModal(props) {
  console.log("props", props);
  return (
    <Modal>
      <ModalHeader>
        <h3>Test Modal #1</h3>
      </ModalHeader>
      <ModalBody>
        <p>Body of modal #1</p>
      </ModalBody>
      <ModalFooter>
        <button onClick={props.close} className="btn btn-primary">
          Close Modal
        </button>
      </ModalFooter>
    </Modal>
  );
}
