import { type DateRange } from "react-day-picker";

export interface CalendarDateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export interface RequestData {
  name: string;
  age: number;
}
