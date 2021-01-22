import React from 'react'
import {Alert} from "react-bootstrap"

const Message = ({variant, marginTop, children}) => {
    return (
        <Alert variant = {variant} style={{marginTop}}>
            {children}
        </Alert>
    )
}

Message.defaultProps = {
    variant: "info",
    marginTop: "1rem"

}

export default Message
