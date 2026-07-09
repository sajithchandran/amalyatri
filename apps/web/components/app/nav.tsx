import {
  Calendar, Sparkles, Activity, BookOpen, Stethoscope, Bell, Leaf, Users,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  description?: string;
}

/**
 * Primary Yatri navigation. Kept centralised so sidebar + drawer + footer
 * never drift out of sync.
 */
export const PRIMARY_NAV: NavItem[] = [
  { href: '/dashboard',     label: 'Dashboard',     icon: Sparkles,   description: 'Your day, gently.' },
  { href: '/timeline',      label: 'Wellness path', icon: Activity,   description: 'Your lifelong story.' },
  { href: '/doctor',        label: 'Doctor',        icon: Stethoscope,description: 'Stay close to your care.' },
  { href: '/community',     label: 'Community',     icon: Users,      description: 'Calm, moderated circles.' },
  { href: '/knowledge',     label: 'Library',       icon: BookOpen,   description: 'Articles, recipes, sessions.' },
  { href: '/events',        label: 'Events',        icon: Calendar,   description: 'Live sessions & retreats.' },
  { href: '/assistant',     label: 'AI companion',  icon: Leaf,       description: 'A calm, honest guide.' },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: '/notifications', label: 'Notifications', icon: Bell },
];
