"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { SplitHero } from "@/components/homepage/SplitHero";
import { AIAdvisor } from "@/components/homepage/AIAdvisor";
import { LearnerStory } from "@/components/homepage/LearnerStory";
import { CourseGrid } from "@/components/homepage/CourseGrid";
import { ValueSystem } from "@/components/homepage/ValueSystem";
import { OpportunityHub } from "@/components/homepage/OpportunityHub";
import { ProgrammesShowcase } from "@/components/homepage/ProgrammesShowcase";
import { EcosystemShowcase } from "@/components/homepage/EcosystemShowcase";
import { FAQAccordion } from "@/components/homepage/FAQAccordion";
import { AuthModal } from "@/components/portal/AuthModal";
import type { CourseId, CourseCategory } from "@/types";

export function HomeClient() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [highlightedCourseId, setHighlightedCourseId] = React.useState<CourseId | null>(null);
  const [courseTab, setCourseTab] = React.useState<"All" | CourseCategory>("All");

  const openLoginGateway = () => {
    setLoginOpen(true);
  };

  const closeLoginGateway = () => {
    setLoginOpen(false);
  };

  const handleLaunchPathway = (courseId: CourseId, category: CourseCategory) => {
    setCourseTab(category);
    setHighlightedCourseId(courseId);
    const el = document.getElementById("courses");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const courseEl = document.getElementById(`course-${courseId}`);
      if (courseEl) courseEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    setTimeout(() => setHighlightedCourseId(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased"
    >
      <GlobalHeader
        onOpenLogin={() => openLoginGateway()}
        onStartJourney={() => {
          const el = document.getElementById("ai-advisor");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <main id="main-content" className="flex-1">
        <SplitHero onOpenLogin={() => openLoginGateway()} />
        <AIAdvisor onLaunchPathway={handleLaunchPathway} />
        <LearnerStory />
        <CourseGrid
          highlightedId={highlightedCourseId}
          activeTab={courseTab}
          setActiveTab={setCourseTab}
          onOpenLogin={openLoginGateway}
        />
        <ProgrammesShowcase />
        <ValueSystem />
        <OpportunityHub />
        <EcosystemShowcase onEnterPortal={openLoginGateway} />
        <FAQAccordion />
      </main>

      <GlobalFooter onOpenLogin={openLoginGateway} />

      <AuthModal open={loginOpen} onClose={closeLoginGateway} />
    </motion.div>
  );
}