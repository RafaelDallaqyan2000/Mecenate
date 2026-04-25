import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SendMessageIcon = (props: SvgProps) => (
    <Svg
        width={props.width || 20}
        height={props.height || 19}
        fill="none"
        {...props}
    >
        <Path
            fill={props.color || "#6115CD"}
            d="M2.053 1.018C.778.465-.477 1.835.18 3.058L2.72 7.77c.161.304.462.505.802.55l6.445.805c.125.014.22.12.22.245s-.095.23-.22.246l-6.445.805c-.34.044-.64.25-.802.55l-2.538 4.72c-.659 1.223.597 2.593 1.872 2.04l16.182-7.013c1.176-.51 1.176-2.18 0-2.688L2.053 1.018Z"
        />
    </Svg>
)
export default SendMessageIcon;