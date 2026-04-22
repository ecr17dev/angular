import {
  IconApi,
  IconArrowsRightLeft,
  IconBook2,
  IconBolt,
  IconCheck,
  IconChecklist,
  IconClock,
  IconCode,
  IconDeviceLaptop,
  IconFlame,
  IconForms,
  IconHome,
  IconMenu2,
  IconProgressCheck,
  IconRocket,
  IconRoute,
  IconSchool,
  IconTarget,
  IconTestPipe,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlay,
  IconHierarchy2,
  IconTemplate,
  IconTrophy,
  IconSparkles,
  IconBrandAngular,
  IconBrandVue
} from '@tabler/icons-angular';
import { LessonIconKey } from '../core/lesson-definition';

export const LESSON_ICON_MAP: Record<LessonIconKey, typeof IconBolt> = {
  signals: IconBolt,
  templates: IconTemplate,
  inputOutput: IconArrowsRightLeft,
  services: IconHierarchy2,
  router: IconRoute,
  forms: IconForms,
  http: IconApi,
  testing: IconTestPipe
};

export const SHELL_ICONS = {
  home: IconHome,
  brand: IconSchool,
  menu: IconMenu2,
  progress: IconProgressCheck,
  duration: IconClock,
  module: IconBook2,
  done: IconCheck
} as const;

export const HOME_ICONS = {
  hero: IconRocket,
  digest: IconDeviceLaptop,
  route: IconTarget,
  spark: IconSparkles,
  done: IconTrophy,
  pending: IconFlame,
  angular: IconBrandAngular,
  vue: IconBrandVue
} as const;

export const LESSON_PAGE_ICONS = {
  foundation: IconBook2,
  example: IconCode,
  compare: IconArrowsRightLeft,
  practice: IconPlayerPlay,
  quickWins: IconChecklist,
  previous: IconChevronLeft,
  next: IconChevronRight,
  done: IconCheck,
  progress: IconProgressCheck
} as const;
