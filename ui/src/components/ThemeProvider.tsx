import { ConfigProvider, type ThemeConfig, theme } from 'antd'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { setTwoToneColor } from '@ant-design/icons'
import '../assets/styles/main.scss'
import { eventBus } from 'authApp/eventBus'

type Props = {
  children: ReactNode
}

enum COLOR_THEME {
  DARK = 'dark',
  LIGHT = 'light',
}

const ThemeProvider: FC<Props> = ({ children }: Props) => {
  const [isReady, setIsReady] = useState(false)
  const [parentTheme, setParentTheme] = useState<COLOR_THEME>(COLOR_THEME.DARK)

  console.log(isReady, parentTheme, 'theme-provider-ready')

  useEffect(() => {
    console.log('🎬 ProductsApp: Initializing...')

    // Subscribe to auth events
    const subscription = eventBus?.onAuth().subscribe((event: any) => {
      console.log(
        '📥 ProductsApp: Received auth event:',
        event.type,
        event.payload,
      )

      // Ignore REQUEST_STATE events (these are from other MFs)
      if (event.payload === 'REQUEST_STATE') {
        return
      }

      switch (event.type) {
        case 'LOGIN':
          setIsReady(true)
          break
        case 'LOGOUT':
          setIsReady(false)
          break
        case 'AUTH_STATE_CHANGE':
          if (event.payload && event.payload.theme) {
            setParentTheme(event.payload.theme)
            setIsReady(true)
          } else if (event.payload && !event.payload.theme) {
            // No token yet, but we got the state
            setIsReady(true)
          }
          break
      }
    })

    // Request current auth state on mount

    console.log('📤 UIApp: Requesting auth/theme state...')
    eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' })

    return () => subscription.unsubscribe()
  }, [])
  setTwoToneColor(lightThemeColors.primaryColor)

  const isDarkTheme = parentTheme === COLOR_THEME?.DARK

  useEffect(() => {
    const theme = isDarkTheme ? COLOR_THEME?.DARK : COLOR_THEME?.LIGHT
    document.body.setAttribute('data-theme', theme)
  }, [isDarkTheme])

  // Merge the light and dark theme colors
  const getColors = isDarkTheme
    ? { ...lightThemeColors, ...darkThemeColors } // Dark theme overrides light theme
    : { ...lightThemeColors } // Default to light theme

  // Extract the colors from the selected theme
  const {
    primaryColor,
    primaryColorLight,
    grey2,
    grey3,
    segmentedBg,
    borderColor,
    black,
    textPrimary,
    linkColor,
    linkActive,
    linkHover,
    disabled,
    darkgreen,
    darkgreen2,
    railBg,
    white,
    tertiary,
    secondary,
    tableRowSelectedHeaderBg,
    inputShadow,
    layoutBg,
    lightBg,
    borderColor2,
    textDisabled,
    modalBg,
    trackBg,
    white85,
    errorBg,
    errorBorder,
    successBg,
    successBorder,
    warningBg,
    warningBorder,
    infoBg,
    CellRangeBg,
    collapseBg,
  } = getColors as typeof lightThemeColors & typeof darkThemeColors

  // TODO: there are the temporary setup for how to set the global tokens using ThemeProvider
  const sharedComponentLevelConfig: ThemeConfig = {
    components: {
      Card: {
        headerFontSize: 16,
      },
      Tag: {
        colorPrimary: primaryColor,
        colorTextLightSolid: white,
      },
      Button: {
        primaryColor: white,
        controlHeightSM: 22,
        contentFontSizeSM: 12,
        colorPrimary: primaryColor,
        colorPrimaryHover: primaryColorLight,
        colorPrimaryActive: primaryColorLight,
        colorTextLightSolid: black,
        colorLinkActive: linkActive,
        colorLink: linkColor,
        colorLinkHover: linkHover,
        defaultHoverBorderColor: black,
        defaultActiveBorderColor: black,
        defaultHoverColor: black,
        defaultActiveColor: black,
        boxShadow: 'none',
        boxShadowSecondary: 'none',
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
        colorText: grey2,
      },
      Form: {
        itemMarginBottom: 0,
      },
      Steps: {
        colorPrimary: black,
        colorPrimaryActive: black,
        colorPrimaryBorder: black,
      },
      Upload: {
        colorPrimaryBorder: black,
        colorPrimaryHover: black,
      },
      Tabs: {
        itemSelectedColor: black,
        colorPrimary: black,
        colorPrimaryHover: black,
        inkBarColor: black,
        itemHoverColor: black,
        itemActiveColor: black,
      },
      Pagination: {
        colorPrimary: textPrimary,
        colorPrimaryHover: textPrimary,
        colorBorder: textPrimary,
        colorPrimaryBorder: textPrimary,
      },
      Input: {
        colorPrimary: primaryColor,
        activeBorderColor: black,
        hoverBorderColor: black,
        activeShadow: inputShadow,
      },
      Checkbox: {
        colorPrimary: black,
        colorPrimaryHover: black,
        colorPrimaryBorder: black,
      },
      Segmented: {
        trackBg: segmentedBg,
      },
      Divider: {
        colorSplit: borderColor,
      },
      Select: {
        colorPrimary: black,
        colorPrimaryHover: black,
        optionSelectedBg: disabled,
      },
      Switch: {
        colorPrimary: black,
        colorPrimaryHover: grey2,
        handleShadow: black,
      },
      Radio: {
        colorPrimary: black,
        colorPrimaryHover: grey2,
      },
      Table: {
        rowSelectedBg: tableRowSelectedHeaderBg,
        cellPaddingBlock: 10,
        cellPaddingBlockMD: 6,
        cellPaddingBlockSM: 2,
      },
      DatePicker: {
        activeBorderColor: primaryColor,
        hoverBorderColor: primaryColor,
        colorPrimaryBorder: black,
        cellHoverBg: disabled,
        cellRangeBorderColor: disabled,
        colorTextLightSolid: disabled,
        hoverBg: disabled,
        colorPrimary: black,
        colorText: black,
        cellActiveWithRangeBg: borderColor,
      },
      Spin: {
        colorPrimary: black,
      },
      Slider: {
        colorPrimaryBorder: darkgreen,
        colorPrimaryBorderHover: darkgreen,
        handleActiveColor: darkgreen,
        handleActiveOutlineColor: darkgreen2,
      },
      InputNumber: {
        activeBorderColor: black,
        handleHoverColor: black,
        colorWarningBorderHover: black,
        hoverBorderColor: black,
      },
      Alert: {
        // error
        colorError: textPrimary,
        colorErrorBg: errorBg,
        colorErrorBorder: errorBorder,
        // success
        colorSuccess: textPrimary,
        colorSuccessBg: successBg,
        colorSuccessBorder: successBorder,
        // info
        colorInfo: textPrimary,
        colorInfoBg: infoBg,
        colorInfoBorder: primaryColor,
        // warning
        colorWarning: textPrimary,
        colorWarningBg: warningBg,
        colorWarningBorder: warningBorder,
      },
      Timeline: {
        colorPrimary: black,
      },
    },
  }

  const { components, ...restSharedConfigs } = sharedComponentLevelConfig

  /**
   * TODO: need to find an optimised way to not hardcode these color hexCodes
   * Solution: Will pick theme variables from :root
   */
  const defaultThemeAppLevelTokens: ThemeConfig = {
    token: {
      colorPrimary: primaryColor,
      colorBgLayout: white,
      colorTextDescription: tertiary,
      colorTextSecondary: secondary,
      colorBgContainerDisabled: grey3,
      colorLink: linkColor,
      colorLinkActive: linkActive,
      colorLinkHover: linkHover,
      controlItemBgActiveHover: black,
      fontFamily: `"Inter", Roboto, "Helvetica Neue"`,
    },

    components: {
      Layout: {
        siderBg: layoutBg,
      },
      Menu: {
        darkItemSelectedBg: primaryColor,
        darkItemSelectedColor: black,
        darkItemHoverBg: primaryColor,
        darkItemHoverColor: black,
        darkItemBg: layoutBg,
        darkSubMenuItemBg: layoutBg,
        darkPopupBg: layoutBg,
        subMenuItemBg: lightBg,
      },
      Segmented: {
        trackBg: segmentedBg,
      },
      ...components,
    },
    algorithm: theme.defaultAlgorithm,
    ...restSharedConfigs,
  }

  const darkThemeAppLevelTokens: ThemeConfig = {
    token: {
      ...defaultThemeAppLevelTokens.token,
      colorBgLayout: layoutBg,
      colorTextDisabled: textDisabled,
    },
    components: {
      Layout: {
        bodyBg: layoutBg,
      },
      Tabs: {
        colorPrimary: primaryColor,
        itemHoverColor: primaryColor,
      },
      Switch: {
        colorPrimary: primaryColor,
        colorPrimaryHover: primaryColor,
        handleShadow: primaryColorLight,
      },
      Pagination: {
        colorPrimary: primaryColor,
        colorPrimaryHover: primaryColor,
        colorBorder: primaryColor,
        colorPrimaryBorder: primaryColor,
        itemActiveBg: 'transparent',
      },
      Button: {
        defaultBorderColor: borderColor2,
        defaultBg: 'transparent',
        defaultHoverBg: 'transparent',
        colorBgContainer: 'transparent',
        defaultHoverBorderColor: tertiary,
        defaultHoverColor: white,
      },
      Input: {
        colorBgContainer: 'transparent',
      },
      InputNumber: {
        colorBgContainer: 'transparent',
      },
      Select: {
        colorBgContainer: 'transparent',
      },
      Modal: {
        contentBg: modalBg,
        headerBg: modalBg,
        colorText: white,
      },
      Menu: {
        itemBg: 'transparent',
      },
      Segmented: {
        trackBg,
        itemColor: white,
        itemHoverBg: trackBg,
      },
      DatePicker: {
        colorBgContainer: 'transparent',
        cellActiveWithRangeBg: CellRangeBg,
      },
      Card: {
        colorBgContainer: 'transparent',
      },
      Alert: {
        // error
        colorError: white85,
        colorErrorBg: errorBg,
        colorErrorBorder: errorBorder,
        // success
        colorSuccess: white85,
        colorSuccessBg: successBg,
        colorSuccessBorder: successBorder,
        // info
        colorInfo: white85,
        colorInfoBg: infoBg,
        colorInfoBorder: primaryColor,
        // warning
        colorWarning: white85,
        colorWarningBg: warningBg,
        colorWarningBorder: warningBorder,
      },
      Slider: {
        railBg: railBg,
        railHoverBg: railBg,
        trackBg: darkgreen,
        trackHoverBg: darkgreen,
        handleColor: darkgreen,
        dotActiveBorderColor: darkgreen,
      },
      Checkbox: {
        colorBgContainer: 'transparent',
        colorPrimary: primaryColor,
        colorPrimaryHover: primaryColor,
        colorPrimaryBorder: primaryColor,
      },
      Radio: {
        colorBgContainer: 'transparent',
      },
      Collapse: {
        colorBgContainer: collapseBg,
      },
    },

    algorithm: theme.darkAlgorithm,
  }

  const appLevelTokens: ThemeConfig = isDarkTheme
    ? darkThemeAppLevelTokens
    : defaultThemeAppLevelTokens

  return <ConfigProvider theme={appLevelTokens}>{children}</ConfigProvider>
}

export default ThemeProvider

const lightThemeColors = {
  primaryColor: '#10B346',
  primaryColorLight: 'rgb(16, 179, 70, .85)',
  grey2: '#1d1d1d',
  grey3: 'rgba(0, 0, 0, 0.04)',
  segmentedBg: '#f5f5f5',
  borderColor: 'rgba(0, 0, 0, 0.06)',
  black: '#000000',
  textPrimary: 'rgba(0, 0, 0, 0.88)',
  linkColor: '#1890FF',
  linkActive: '#096DD9',
  linkHover: '#40A9FF',
  disabled: '#f0f0f0',
  white: '#ffffff',
  tertiary: 'rgba(0, 0, 0, 0.45)',
  secondary: 'rgba(0, 0, 0, 0.65)',
  tableRowSelectedHeaderBg: '#fafafa',
  inputShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
  layoutBg: '#141414',
  lightBg: 'rgba(0, 0, 0, 0.02)',
  textDisabled: 'rgba(255, 255, 255, 0.16)',
  // alert messages color
  errorBg: '#FFF2F0',
  errorBorder: '#FFCCC7',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warningBg: '#FFFBE6',
  warningBorder: '#FFE58F',
  infoBg: '#DAF2DE',
  // slider colors
  darkgreen: '#001A0C',
  darkgreen2: 'rgba(0, 26, 12, 0.2)',
  railBg: 'rgba(255, 255, 255, 0.12)',
}

// Define color variables for Dark Theme
const darkThemeColors = {
  grey2: '#ffffff',
  layoutBg: '#121212',
  borderColor2: '#424242',
  tertiary: 'rgba(255, 255, 255, 0.45)',
  borderColor: 'rgba(255, 255, 255, 0.06)',
  modalBg: '#141414',
  trackBg: '#303030',
  textPrimary: 'rgba(255, 255, 255, 0.88)',
  white85: 'rgba(255, 255, 255, 0.85)',
  // alert messages color
  infoBg: '#112017',
  successBg: '#162312',
  successBorder: '#274916',
  errorBg: '#2C1618',
  errorBorder: '#5B2526',
  warningBg: '#2B2111',
  warningBorder: '#594214',
  // slider colors
  darkgreen: lightThemeColors.primaryColor,
  // date picker
  CellRangeBg: '#287C38',
  // collapse
  collapseBg: '#1f1f1f',
}
