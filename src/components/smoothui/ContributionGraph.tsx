import { motion, useReducedMotion } from "framer-motion";
import { memo, useMemo, useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";

export interface ContributionData {
  date: string;
  count: number;
  level: number;
}

export interface ContributionGraphProps {
  data?: ContributionData[];
  year?: number;
  className?: string;
  showLegend?: boolean;
  showTooltips?: boolean;
}

const WEEKS_IN_YEAR = 53;
const DAYS_IN_WEEK = 7;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LEVEL_COLORS = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

const LEVELS = [0, 1, 2, 3, 4];

function generateYearData(data: ContributionData[], year: number): ContributionData[] {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const days: ContributionData[] = [];
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());

  for (let w = 0; w < WEEKS_IN_YEAR; w++) {
    for (let d = 0; d < DAYS_IN_WEEK; d++) {
      const current = new Date(firstSunday);
      current.setDate(firstSunday.getDate() + w * DAYS_IN_WEEK + d);
      if (current >= startDate && current <= endDate) {
        const dateStr = current.toISOString().split("T")[0];
        const existing = data.find((x) => x.date === dateStr);
        days.push({ date: dateStr, count: existing?.count ?? 0, level: existing?.level ?? 0 });
      } else {
        days.push({ date: "", count: 0, level: 0 });
      }
    }
  }
  return days;
}

function calculateMonthHeaders(year: number) {
  const headers: { month: string; colspan: number }[] = [];
  const startDate = new Date(year, 0, 1);
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());

  let currentMonth = -1;
  let weekCount = 0;

  for (let w = 0; w < WEEKS_IN_YEAR; w++) {
    const weekDate = new Date(firstSunday);
    weekDate.setDate(firstSunday.getDate() + w * DAYS_IN_WEEK);
    const m = weekDate.getMonth();
    const y = weekDate.getFullYear();

    if (m !== currentMonth) {
      if (currentMonth !== -1 && weekCount > 0) {
        headers.push({ month: MONTHS[currentMonth], colspan: weekCount });
      }
      currentMonth = m;
      weekCount = y === year ? 1 : 0;
    } else if (y === year) {
      weekCount++;
    }
  }
  if (currentMonth !== -1 && weekCount > 0) {
    headers.push({ month: MONTHS[currentMonth], colspan: weekCount });
  }
  return headers;
}

const ContributionGraph = memo(function ContributionGraph({
  data = [],
  year = new Date().getFullYear(),
  className = "",
  showLegend = true,
  showTooltips = true,
}: ContributionGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const yearData = useMemo(() => generateYearData(data, year), [data, year]);
  const monthHeaders = useMemo(() => calculateMonthHeaders(year), [year]);

  const handleHover = (day: ContributionData, e: React.MouseEvent) => {
    if (showTooltips && day.date) {
      setHoveredDay(day);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  const contribText = (c: number) => (c === 0 ? "No contributions" : c === 1 ? "1 contribution" : `${c} contributions`);

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className="border-collapse" role="grid">
          <thead>
            <tr>
              <th className="w-8" />
              {monthHeaders.map((h, i) => (
                <th
                  key={`${h.month}-${i}`}
                  colSpan={h.colspan}
                  className="text-xs font-normal text-muted-foreground text-left pb-1"
                >
                  {h.month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => (
              <tr key={dayIndex}>
                <td className="pr-2 text-right">
                  {dayIndex % 2 === 0 && (
                    <span className="text-[10px] text-muted-foreground">{DAYS[dayIndex]}</span>
                  )}
                </td>
                {Array.from({ length: WEEKS_IN_YEAR }, (_, w) => {
                  const dayData = yearData[w * DAYS_IN_WEEK + dayIndex];
                  if (!dayData?.date) {
                    return <td key={`empty-${w}-${dayIndex}`} className="p-[1.5px]"><div className="w-[11px] h-[11px]" /></td>;
                  }
                  return (
                    <td
                      key={dayData.date}
                      className="p-[1.5px]"
                      onMouseEnter={(e) => handleHover(dayData, e)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={showTooltips ? `${formatDate(dayData.date)}: ${contribText(dayData.count)}` : undefined}
                    >
                      <motion.div
                        className={cn(
                          "w-[11px] h-[11px] rounded-[2px]",
                          LEVEL_COLORS[dayData.level] || LEVEL_COLORS[0],
                          "transition-colors duration-200 hover:ring-1 hover:ring-foreground/30"
                        )}
                        initial={shouldReduceMotion ? {} : { scale: 0 }}
                        whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (w * 0.005) + (dayIndex * 0.01), duration: 0.2 }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTooltips && hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none glass-card px-3 py-2 rounded-lg shadow-lg"
          style={{ left: tooltipPos.x + 10, top: tooltipPos.y - 40 }}
        >
          <p className="text-xs font-medium text-foreground">{contribText(hoveredDay.count)}</p>
          <p className="text-[10px] text-muted-foreground">{formatDate(hoveredDay.date)}</p>
        </div>
      )}

      {showLegend && (
        <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          {LEVELS.map((level) => (
            <div key={level} className={cn("w-[11px] h-[11px] rounded-[2px]", LEVEL_COLORS[level])} />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
});

ContributionGraph.displayName = "ContributionGraph";
export default ContributionGraph;
