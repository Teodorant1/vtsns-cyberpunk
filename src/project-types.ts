import { type DateRange } from "react-day-picker";

export interface CalendarDateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}
export interface PostData {
  date: Date | null;
  title: string;
  href: string;
  title_analysis: {
    subject: string;
    title: string;
    is_general_announcement: boolean;
  };
  href_title_date: string;
  article: {
    combinedText: string;
    hrefLinks: string[];
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface PaginatedListProps {
  categories: Category[];
  currentCategory: string;
  onToggleCategory: (category: string) => void;
}

export interface HrefLinksProps {
  href_links: string[];
}
