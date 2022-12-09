import React, {Component} from 'react';
import {Modal, Stack, TextContainer} from "@shopify/polaris";
import {select} from "../../PolarisComponents/InputGroups";

class Actionbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            modal:false,
            modalText: '',
            actionselected:''
        }
    }

    openModalandAction(action){
        let {selectedActions} = this.props;
        let filterActionPerformed = selectedActions.filter( actioninarray => actioninarray.value === action);
        let getModalText = filterActionPerformed[0].modaltext;
        this.setState({ modal: true, modalText:getModalText, actionselected:action });
    }

    render() {
        let { modal, modalText, actionselected } = this.state;
        let { selectedActions, onSelectAction, label} = this.props;
        return (
            <React.Fragment>
                <Stack>
                    {
                        select(label, selectedActions, this.openModalandAction.bind(this), '', 'Please select', false, true )
                    }
                </Stack>
                <Modal
                    open={modal}
                    onClose={() => {
                        this.setState({ modal: false, modalText:'', actionselected: '' });
                    }}
                    title="Action permission required"
                    primaryAction={{
                        content: 'Yes',
                        onAction: ()=>{
                            onSelectAction(actionselected);
                            this.setState({ modal: false, modalText:'', actionselected: '' });
                        },
                    }}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>
                                {
                                    modalText
                                }
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Actionbar;