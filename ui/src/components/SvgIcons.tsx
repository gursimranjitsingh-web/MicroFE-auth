import { useMemo } from 'react'
import type { GetProps } from 'antd'
import Icon, { FileImageOutlined } from '@ant-design/icons'
import {
  FunnelSvg,
  NexusSvg,
  CrewControlSvg,
  BookmarkFilledSvg,
  BookmarkOutlinedSvg,
  CarouselCreativeSvg,
  DynamicCreativeSvg,
  FacebookSvg,
  GoogleSvg,
  SlackSvg,
  StaticCreativeSvg,
  SortDown,
  TelegramSvg,
  ThreadsSvg,
  TiktokSvg,
  WhiteFacebookSvg,
  WhiteTiktokSvg,
  StatusSvg,
  NewTabSvg,
  GoogleCircleSvg,
  TiktokCircleSvg,
  FacebookCircleSvg,
  WavingHandIcon,
  MobileIcon,
  GroupingSvg,
  NoStatusSvg,
  ReportSvg,
  MagicIcon,
  VerifiedCheckFill,
  TaboolaSvg,
  DashboardNav,
  NexusNav,
  IntegrationsNav,
  LaunchNav,
  CreativeLibNav,
  TaboolaGreySvg,
  TiktokSquareFilled,
  BigoSvg,
  NewsBreakSvg,
  TaboolaSquareFilled,
  BigoSquareFilled,
  PlayCircleSvg,
  DownloadAppSvg,
  TaboolaCircleSvg,
  BigoCircleSvg,
  NewsbreakCircleSvg,
  NewsbreakSquareFilled,
  RingbaSvg,
  BudgetUpdateImg,
  MoneyReciveSvg,
  MoneySendSvg,
  NewUpdatesSvg,
  UploadIconSvg,
  LandingPageBuilderNav,
  CodeOutlinedSvg,
  SmartnewsSvg,
} from '../assets/images'

interface Props extends Partial<GetProps<typeof Icon>> {
  iconName: string
}

// ! * Always make names ending with "-svg"
const SvgIcons = ({ iconName }: Props) => {
  const IconRender = useMemo(() => {
    switch (iconName) {
      case 'slack-svg':
        return SlackSvg
      case 'ringba-svg':
        return RingbaSvg
      case 'telegram-svg':
        return TelegramSvg
      case 'white-facebook-svg':
        return WhiteFacebookSvg
      case 'facebook-svg':
        return FacebookSvg
      case 'google-svg':
        return GoogleSvg
      case 'tiktok-svg':
        return TiktokSvg
      case 'taboola-svg':
        return TaboolaSvg
      case 'taboola-grey-svg':
        return TaboolaGreySvg
      case 'white-tiktok-svg':
        return WhiteTiktokSvg
      case 'threads-svg':
        return ThreadsSvg
      case 'new-tab-svg':
        return NewTabSvg
      case 'bookmark-outlined-svg':
        return BookmarkOutlinedSvg
      case 'static-creative-svg':
        return StaticCreativeSvg
      case 'dynamic-creative-svg':
        return DynamicCreativeSvg
      case 'carousel-creative-svg':
        return CarouselCreativeSvg
      case 'bookmark-filled-svg':
        return BookmarkFilledSvg
      case 'sort-down-svg':
        return SortDown
      case 'status-svg':
        return StatusSvg
      case 'google-circle-svg':
        return GoogleCircleSvg

      case 'tiktok-circle-svg':
        return TiktokCircleSvg

      case 'facebook-circle-svg':
        return FacebookCircleSvg

      case 'waving-hand-icon-svg':
        return WavingHandIcon

      case 'mobile-icon-svg':
        return MobileIcon

      case 'grouping-svg':
        return GroupingSvg
      case 'no-status-svg':
        return NoStatusSvg
      case 'funnel-svg':
        return FunnelSvg
      case 'nexus-svg':
        return NexusSvg
      case 'report-icon-svg':
        return ReportSvg
      case 'crew-control-svg':
        return CrewControlSvg
      case 'magic-icon-svg':
        return MagicIcon
      case 'verified-check-fill-svg':
        return VerifiedCheckFill
      // Navbar svg icon
      case 'nav-creative-lib-svg':
        return CreativeLibNav
      case 'nav-dashboard-svg':
        return DashboardNav
      case 'nav-nexus-svg':
        return NexusNav
      case 'nav-integrations-svg':
        return IntegrationsNav
      case 'nav-launch-svg':
        return LaunchNav
      case 'tiktok-square-filled-svg':
        return TiktokSquareFilled
      case 'bigo-svg':
        return BigoSvg
      case 'newsbreak-svg':
        return NewsBreakSvg
      case 'smartnews-svg':
        return SmartnewsSvg
      case 'taboola-square-filled-svg':
        return TaboolaSquareFilled
      case 'bigo-square-filled-svg':
        return BigoSquareFilled
      case 'newsbreak-square-filled-svg':
        return NewsbreakSquareFilled
      case 'play-circle-svg':
        return PlayCircleSvg
      case 'download-app-svg':
        return DownloadAppSvg
      case 'nav-lp-builder-svg':
        return LandingPageBuilderNav

      // Platform circle icons
      case 'taboola-circle-svg':
        return TaboolaCircleSvg
      case 'bigo-circle-svg':
        return BigoCircleSvg
      case 'newsbreak-circle-svg':
        return NewsbreakCircleSvg
      case 'budget-update-svg':
        return BudgetUpdateImg

      case 'money-recive-svg':
        return MoneyReciveSvg
      case 'money-send-svg':
        return MoneySendSvg
      case 'new-updates-svg':
        return NewUpdatesSvg
      case 'upload-icon-svg':
        return UploadIconSvg
      case 'code-outlined-svg':
        return CodeOutlinedSvg

      default:
        return FileImageOutlined
    }
  }, [iconName])

  return IconRender
}

export default SvgIcons
