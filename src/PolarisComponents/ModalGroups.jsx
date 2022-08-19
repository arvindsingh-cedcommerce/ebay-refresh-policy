import React from "react";
import {Modal} from "@shopify/polaris";
import ModalVideo from "react-modal-video";

export function modalPolaris(title = '', open,handleChange, action ={content : "Submit",onAction:()=>{}}, structure = [] ) {
    return  <Modal
        open={open}
        onClose={handleChange}
        title={title}
        primaryAction= {action}
    >
        <Modal.Section>
            {structure}
        </Modal.Section>
    </Modal>
}

export function videoModal(channel = 'youtube', isOpen = false, videoId = '', onClose){
    return <ModalVideo channel={channel} isOpen={isOpen} videoId={videoId} onClose={onClose} />

}