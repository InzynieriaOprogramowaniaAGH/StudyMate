"use client";

import Header from "@/components/layout/Header";
import {
  Loader,
  TrendingUp,
  FileText,
  CheckCircle2,
  Layers,
  Calendar,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  actionStats: Array<{
    action: string;
    _count: { action: number };
  }>;
  dailyStats: Array<{
    date: string;
    count: number;
  }>;
}

// Mock data for demonstration
const MOCK_STATS: Stats = {
  actionStats: [
    { action: "noteAdded", _count: { action: 47 } },
    { action: "quizCompleted", _count: { action: 32 } },
    { action: "flashcardReviewed", _count: { action: 89 } },
  ],
  dailyStats: [
    { date: "2025-11-20", count: 12 },
    { date: "2025-11-21", count: 18 },
    { date: "2025-11-22", count: 6 },
    { date: "2025-11-23", count: 22 },
    { date: "2025-11-24", count: 15 },
    { date: "2025-11-25", count: 28 },
    { date: "2025-11-26", count: 31 },
  ],
};

// Mock weekly quiz scores - more varied
const MOCK_WEEKLY_SCORES = [
  { week: "Week 1", score: 72 },
  { week: "Week 2", score: 81 },
  { week: "Week 3", score: 76 },
  { week: "Week 4", score: 95 },
];

// Calculate current streak
const calculateCurrentStreak = () => {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayNum = date.getDate();
    
    // Deterministic activity pattern
    const activity = [0, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 0, 1, 3, 2, 4, 1, 2, 3][dayNum - 1] || 0;
    
    if (activity > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate longest streak
const calculateLongestStreak = () => {
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (let day = 1; day <= 31; day++) {
    const activity = [0, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 0, 1, 3, 2, 4, 1, 2, 3][day - 1] || 0;
    
    if (activity > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
};

// Calendar data - deterministic, based on date
const getMonthCalendarData = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ date: null, activity: 0 });
  }
  
  // Add days of current month - use deterministic pattern based on date number
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Deterministic activity based on day number (no random)
    const activity = [0, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 0, 1, 3, 2, 4, 1, 2, 3][day - 1] || 0;
    calendarDays.push({ date: dateStr, activity });
  }
  
  return { calendarDays, daysInMonth, startingDayOfWeek, monthYear: `${firstDay.toLocaleDateString('en-US', { month: 'long' })} ${currentYear}` };
};

const getActivityColor = (activity: number) => {
  if (activity === 0) {
    return "bg-gray-300 dark:bg-gray-600";
  }
  
  const colors = [
    "bg-[var(--color-primary)]",
    "bg-[var(--color-primary)]",
    "bg-[var(--color-primary)]",
    "bg-[var(--color-primary)]",
    "bg-[var(--color-primary)]",
  ];
  return colors[activity] || "bg-[var(--color-primary)]";
};

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load statistics");
        // Keep mock data on error
      } finally {
        setIsLoading(false);
      }
    };

    // Optional: Uncomment to fetch real data instead of using mock
    // fetchStats();
  }, []);

  // Transform action stats for bar chart
  const barChartData = stats?.actionStats.map((stat) => ({
    action: stat.action,
    count: stat._count.action,
  })) || [];

  // Transform daily stats for line chart
  const lineChartData = stats?.dailyStats.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: stat.count,
  })) || [];

  // Calculate total stats
  const totalActions = stats?.actionStats.reduce(
    (sum, stat) => sum + stat._count.action,
    0
  ) || 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              Your Progress
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Track your learning statistics and achievements
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: "Total Actions",
                    value: totalActions,
                    icon: TrendingUp,
                  },
                  {
                    label: "Notes Created",
                    value:
                      stats?.actionStats.find((s) => s.action === "noteAdded")
                        ?._count.action || 0,
                    icon: FileText,
                  },
                  {
                    label: "Quizzes Completed",
                    value:
                      stats?.actionStats.find((s) => s.action === "quizCompleted")
                        ?._count.action || 0,
                    icon: CheckCircle2,
                  },
                  {
                    label: "Current Streak",
                    value: calculateCurrentStreak(),
                    icon: Flame,
                    highlight: true,
                  },
                  {
                    label: "Flashcards Reviewed",
                    value:
                      stats?.actionStats.find(
                        (s) => s.action === "flashcardReviewed"
                      )?._count.action || 0,
                    icon: Layers,
                  },
                  {
                    label: "Longest Streak",
                    value: calculateLongestStreak(),
                    icon: Flame,
                    highlight: true,
                  },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className={`bg-[var(--color-bg-light)] border rounded-lg p-6 ${
                        stat.highlight
                          ? "border-[var(--color-primary)]/50 shadow-lg shadow-[var(--color-primary)]/10"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <IconComponent
                          className={`w-8 h-8 ${
                            stat.highlight
                              ? "text-[var(--color-primary)] animate-pulse"
                              : "text-[var(--color-primary)]"
                          }`}
                        />
                      </div>
                      <h3 className="text-sm text-[var(--color-muted)] font-medium mb-1">
                        {stat.label}
                      </h3>
                      <p className="text-2xl font-bold text-[var(--color-text)]">
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Bar Chart - Study Time This Week */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  Study Time This Week
                </h2>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis
                        dataKey="action"
                        stroke="var(--color-muted)"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="var(--color-muted)"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-bg-light)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          color: "var(--color-text)",
                        }}
                        cursor={false}
                      />
                      <Bar
                        dataKey="count"
                        fill="var(--color-primary)"
                        radius={[8, 8, 0, 0]}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-[var(--color-muted)]">
                    No data available
                  </div>
                )}
              </motion.div>

              {/* Line Chart - Quiz Scores Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  Quiz Scores Trend
                </h2>
                {MOCK_WEEKLY_SCORES.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={MOCK_WEEKLY_SCORES}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis
                        dataKey="week"
                        stroke="var(--color-muted)"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="var(--color-muted)"
                        style={{ fontSize: "12px" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-bg-light)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          color: "var(--color-text)",
                        }}
                        cursor={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-primary)", r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-[var(--color-muted)]">
                    No quiz data available
                  </div>
                )}
              </motion.div>

              {/* Activity Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Activity Calendar - {(() => {
                      const today = new Date();
                      return `${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
                    })()}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <th key={day} className="text-center text-xs font-semibold text-[var(--color-muted)] p-2">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const { calendarDays } = getMonthCalendarData();
                        const weeks = [];
                        for (let i = 0; i < calendarDays.length; i += 7) {
                          weeks.push(calendarDays.slice(i, i + 7));
                        }
                        
                        return weeks.map((week, weekIdx) => (
                          <tr key={weekIdx} className="h-14">
                            {week.map((day, dayIdx) => {
                              const dateStr = day.date ? day.date.split('-')[2] : '';
                              const dayNum = parseInt(dateStr);
                              
                              return (
                                <td key={dayIdx} className="p-2 text-center">
                                  {day.date ? (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: (weekIdx * 7 + dayIdx) * 0.01 }}
                                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-[var(--color-primary)] ${getActivityColor(day.activity)}`}
                                      title={`${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}: ${day.activity} activities`}
                                    >
                                      <span className={`text-sm font-medium ${day.activity > 0 ? 'text-white' : 'text-[var(--color-text)]'}`}>
                                        {dayNum}
                                      </span>
                                    </motion.div>
                                  ) : (
                                    <div />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-8 flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="text-[var(--color-muted)]">No activity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-[var(--color-muted)]">Active</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}