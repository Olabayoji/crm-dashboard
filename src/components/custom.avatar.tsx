import React from 'react'
import { Avatar as AntdAvatar } from 'antd'
import { AvatarProps } from 'antd/lib'
import { getNameInitials } from '../utilities/get-name-initials'

type Props = AvatarProps & {
    name?: string
   
}
const CustomAvatar: React.FC<Props> = ({name, style, ...rest}) => {
  return (
    <AntdAvatar alt={''} size={'small'} style={{backgroundColor: '#87d068', display: 'flex', alignItems: 'center', border: 'none', ...style}} {...rest}>
        {getNameInitials(name || '')}
    </AntdAvatar>
  )
}

export default CustomAvatar