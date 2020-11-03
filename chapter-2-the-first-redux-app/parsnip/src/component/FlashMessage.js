import React from 'react'

const FlashMessage = props => {
    return (
        <div className="flash-error">
            {props.message}
        </div>
    )
}

//设置默认错误消息
Error.defaultProps = {
    message: "An error occurred"
}
export default FlashMessage