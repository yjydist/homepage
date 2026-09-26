import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import AlternateEmail from '@mui/icons-material/AlternateEmail'
import Bolt from '@mui/icons-material/Bolt'
import CallMerge from '@mui/icons-material/CallMerge'
import Code from '@mui/icons-material/Code'
import Commit from '@mui/icons-material/Commit'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import Folder from '@mui/icons-material/Folder'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import ForkRight from '@mui/icons-material/ForkRight'
import GridOn from '@mui/icons-material/GridOn'
import History from '@mui/icons-material/History'
import Language from '@mui/icons-material/Language'
import LinkIcon from '@mui/icons-material/Link'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import MailOutlined from '@mui/icons-material/MailOutlined'
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined'
import Person from '@mui/icons-material/Person'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import Public from '@mui/icons-material/Public'
import QueryStats from '@mui/icons-material/QueryStats'
import QueryStatsOutlined from '@mui/icons-material/QueryStatsOutlined'
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined'
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined'
import RssFeed from '@mui/icons-material/RssFeed'
import Schedule from '@mui/icons-material/Schedule'
import StarOutlined from '@mui/icons-material/StarOutlined'
import Work from '@mui/icons-material/Work'
import WorkOutlined from '@mui/icons-material/WorkOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import type { SxProps, Theme } from '@mui/material/styles'

const icons: Record<string, SvgIconComponent> = {
  person: PersonOutlined,
  folder: FolderOutlined,
  monitoring: QueryStatsOutlined,
  work: WorkOutlined,
  code: Code,
  mail: MailOutlined,
  alternate_email: AlternateEmail,
  language: Language,
  rss_feed: RssFeed,
  link: LinkIcon,
  star: StarOutlined,
  schedule: Schedule,
  grid_on: GridOn,
  history: History,
  commit: Commit,
  add_circle: AddCircleOutlined,
  delete: DeleteOutlined,
  report: ReportProblemOutlined,
  mode_comment: ModeCommentOutlined,
  call_merge: CallMerge,
  fork_right: ForkRight,
  local_offer: LocalOfferOutlined,
  public: Public,
  bolt: Bolt,
  rate_review: RateReviewOutlined,
}

const filledIcons: Record<string, SvgIconComponent> = {
  person: Person,
  folder: Folder,
  monitoring: QueryStats,
  work: Work,
}

interface IconProps {
  name: string
  size?: number | string
  filled?: boolean
  className?: string
  sx?: SxProps<Theme>
}

export default function Icon({ name, size = 20, filled = false, className, sx }: IconProps) {
  const Glyph = (filled ? filledIcons[name] : undefined) ?? icons[name] ?? LinkIcon
  return <Glyph aria-hidden="true" fontSize="inherit" className={className} sx={[{ fontSize: size, flexShrink: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />
}
