import { type CSSProperties, type ReactNode, forwardRef } from 'react'
import cx from 'classnames'
import { Button, type ButtonProps, Tooltip, type TooltipProps } from 'antd'
import LookIcon, { LookIconProps } from './LookIcon'

export interface ILookButtonProps extends ButtonProps {
  // Option to fit button width to its parent width
  block?: boolean
  // Disabled state of button
  disabled?: boolean
  // Set the loading status of button
  loading?: boolean
  // Button Label
  label?: ReactNode
  // type of the button
  type?: 'primary' | 'link' | 'text' | 'default' | 'dashed' | undefined
  // class override
  className?: string
  // class override
  style?: CSSProperties
  // pass children if any
  children?: ReactNode
  // iconned button
  icon?: string
  // icon props
  iconProps?: Omit<LookIconProps, 'icon'>
  // tooltip title
  tooltip?: TooltipProps
}

const LookButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ILookButtonProps
>(
  (
    {
      children,
      onClick,
      label,
      icon,
      tooltip,
      iconProps = {},
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    let buttonLabel: ReactNode = children || label
    const isIconOnly = icon && !buttonLabel
    if (icon) {
      buttonLabel = (
        <>
          {icon && <LookIcon icon={icon} {...iconProps} />} {label}
        </>
      )
    }

    const renderButton = () => (
      <Button
        ref={ref}
        className={cx(className, { 'ant-btn-icon-only': isIconOnly })}
        onClick={onClick}
        style={{
          ...style,
          outline: 'none !important',
          boxShadow: 'none !important',
        }}
        {...rest}
      >
        {buttonLabel}
      </Button>
    )

    const renderButtonWithTooltip = () => (
      <Tooltip placement={tooltip?.placement ?? 'top'} {...tooltip}>
        {renderButton()}
      </Tooltip>
    )

    return tooltip ? renderButtonWithTooltip() : renderButton()
  },
)

export default LookButton
