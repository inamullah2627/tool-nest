import * as Icons from "lucide-react";

const aliases = {
  code: Icons.CodeXml,
  type: Icons.Type,
  search: Icons.Search,
  image: Icons.Image,
  file: Icons.FileText,
  calc: Icons.Calculator,
  arrow: Icons.ArrowRight,
  gift: Icons.Gift,
  shield: Icons.Shield,
  zap: Icons.Zap,
  user: Icons.UserRound,
  cursor: Icons.MousePointer2,
  edit: Icons.Pencil,
  check: Icons.Check,
  braces: Icons.Braces,
  link: Icons.Link,
  heart: Icons.Heart,
  moon: Icons.Moon,
  sun: Icons.Sun,
  menu: Icons.Menu,
  x: Icons.X,
  chev: Icons.ChevronDown,
  plus: Icons.Plus,
  grid: Icons.LayoutGrid,
  list: Icons.List,
  sliders: Icons.SlidersHorizontal,
  clock: Icons.Clock3,
  home: Icons.House,
  html: Icons.CodeXml,
  min: Icons.Minimize2,
  bin: Icons.Binary,
  hash: Icons.Hash,
  case: Icons.CaseSensitive,
  copy: Icons.Copy,
  spark: Icons.Sparkles,
  align: Icons.AlignLeft,
  tag: Icons.Tags,
  bar: Icons.ChartNoAxesColumnIncreasing,
  route: Icons.Route,
  bot: Icons.Bot,
  share: Icons.Share2,
  terminal: Icons.Terminal,
  globe: Icons.Globe2,
  shieldCheck: Icons.ShieldCheck,
  maximize: Icons.Maximize2,
  crop: Icons.Crop,
  repeat: Icons.Repeat2,
  layers: Icons.Layers,
  scissors: Icons.Scissors,
  percent: Icons.Percent,
  wallet: Icons.Wallet,
  calendar: Icons.CalendarDays,
  info: Icons.Info,
} as const;

export type IconName = keyof typeof aliases;
export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = aliases[name];
  return (
    <Component
      width={size}
      height={size}
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    />
  );
}
