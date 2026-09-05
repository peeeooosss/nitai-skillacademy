"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

export function FAQAccordion() {
  return (
    <section id="faq" className="section-container border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-heading">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <AccordionItem value={faq.question} className="overflow-hidden rounded-2xl border backdrop-blur-md">
                <AccordionTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left">
                  <span className="flex items-center gap-3 text-sm font-medium text-white">
                    <HelpCircle className="h-4 w-4 shrink-0 text-cyan-300" />
                    {faq.question}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}