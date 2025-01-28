import { useState } from "react";
import { DateRange } from "react-day-picker";

interface useDashboardProps {
  date: DateRange | undefined;
  onChange?: (date: DateRange | undefined) => void;
}

const useDashboard = ({ date, onChange }: useDashboardProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(date);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onChange?.(range);
  };

  return {
    dateRange,
    handleSelect,
  };
};

export default useDashboard;
