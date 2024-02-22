import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/antd'
import { Header } from './header'
type Props = {
    children: React.ReactNode
    
}
const Layout : React.FC<Props>= ({children}) => {
  return (
    <ThemedLayoutV2 Header={Header} Title={(titleProps) => <ThemedTitleV2 text={'AdminSuite'} {...titleProps} /> }>
        {children}
    </ThemedLayoutV2>
  )
}

export default Layout