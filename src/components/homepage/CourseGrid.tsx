"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Timer,
  Check,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { COURSES, COURSE_TABS } from "@/data/courses";
import type { CourseId, CourseCategory } from "@/types";

interface CourseGridProps {
  highlightedId: CourseId | null;
  activeTab: "All" | CourseCategory;
  setActiveTab: (t: "All" | CourseCategory) => void;
}

export function CourseGrid({ highlightedId, activeTab, setActiveTab }: CourseGridProps) {
  const [enrolled, setEnrolled] = React.useState<Set<CourseId>>(new Set());

  const filtered = activeTab === "All" ? COURSES : COURSES.filter((c) => c.category === activeTab);

  const toggleEnroll = (id: CourseId) => {
    setEnrolled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="courses" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          12 Flagship AI Courses, Built for Who You Are
        </h2>
        <p className="mt-4 text-slate-400">Every course is persona-first: same AI, taught for your world.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "All" | CourseCategory)} className="mt-10 w-full">
        <TabsList className="w-full justify-center" aria-label="Course categories">
          {COURSE_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="whitespace-nowrap px-4 py-2 text-sm">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <AnimatePresence mode="wait">
          <TabsContent key={activeTab} value={activeTab} className="mt-6">
            <motion.div
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((course, index) => {
                const isEnrolled = enrolled.has(course.id);
                const isHighlighted = highlightedId === course.id;
                return (
                  <motion.article
                    key={course.id}
                    id={`course-${course.id}`}
                    className={cn(
                      "card-base",
                      isHighlighted
                        ? "border-amber-400/70 shadow-[0_0_35px_-8px_rgba(245,158,11,0.6)]"
                        : "border-white/10"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="icon-wrapper">
                        <course.icon className="h-5 w-5 text-white" />
                      </span>
                      <span className="font-display text-xs font-bold text-slate-500">
                        {course.index}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold leading-snug text-white">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{course.persona}</p>

                    <ul className="mt-4 flex flex-1 flex-col gap-2">
                      {course.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                          {o}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <Timer className="h-3.5 w-3.5 text-violet-300" />
                      {course.duration}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {course.badges.map((b) => (
                        <span key={b} className="badge-base">
                          {b}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => toggleEnroll(course.id)}
                      disabled={isEnrolled}
                      className={cn(
                        "mt-5 w-full",
                        isEnrolled
                          ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20"
                          : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:scale-[1.02]"
                      )}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          Enroll Now
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.article>
                );
              })}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </section>
  );
}