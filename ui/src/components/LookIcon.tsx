import Icon, { FileImageOutlined } from '@ant-design/icons'
import {
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  MouseEventHandler,
  Suspense,
  lazy,
} from 'react'

import { IconComponentProps } from '@ant-design/icons/lib/components/Icon'
import SvgIcons from './SvgIcons'
import * as Icons from '@ant-design/icons'

export type LookIconProps = IconComponentProps & {
  /**
   * Get the name of the icon component from https://ant.design/components/icon e.g. StepBackwardOutlined
   */
  icon: string
  /**
   * provide class to Icon
   */
  className?: string

  /**
   * provide inline styling for Icon
   */
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLSpanElement>
}

const renderLazyAntIcon = (icon: string) => {
  const IconComponent =
    (Icons as Record<string, any>)[icon] || Icons.FileImageOutlined
  // TODO: Will look for loadbleLazy for load icons in chucks
  return lazy(() =>
    Promise.resolve({
      default: (props: any) => <IconComponent {...props} />,
    }),
  )
}
// Hashing the already loaded Ant Icons
const AntIconHashMap = new Map()

/**
 * twoToneColor: we no need to provide it explicitly, twoToneColor is being set in the themeProvider at once
 */
const LookIcon: FC<LookIconProps> = (props) => {
  const { icon, style, ...rest } = props

  if (icon?.includes('-svg')) {
    const SvgIcon: any = SvgIcons({ iconName: icon })
    return <Icon component={SvgIcon} style={style} {...rest} />
  }

  let AntIcon = null

  /** Checking the hashing map if already exist then return it without loading
   * otherwise render icon lazily
   */
  if (AntIconHashMap.has(icon)) {
    AntIcon = AntIconHashMap.get(icon)
  } else {
    AntIcon = renderLazyAntIcon(icon) as ForwardRefExoticComponent<any>
    AntIconHashMap.set(icon, AntIcon)
  }

  if (!AntIcon) return null

  return (
    <Suspense fallback={<FileImageOutlined style={style} />}>
      <Icon component={AntIcon} style={style} {...rest} />
    </Suspense>
  )
}

export default LookIcon
