"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border border-white/10 bg-white/5 backdrop-blur-md", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between gap-4 rounded-none px-6 py-4.5 text-left text-sm font-medium text-white transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-3">
        <svg
          className="h-4 w-4 shrink-0 text-cyan-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.047a.05.05 0 0 1-.006-.098l5-5a.05.05 0 0 1 .086 0l5 5a.05.05 0 0 1-.086.098 3.752 3.752 0 0 0-4.144-.09 3.752 3.752 0 0 0-2.698 3.293.05.05 0 0 0 .08.102 2.75 2.75 0 0 1 5.494 0 .05.05 0 0 0 .096-.098 2.75 2.75 0 0 1-.118-5.546z" />
        </svg>
        {children}
      </span>
      <ChevronDown
        className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2"
    {...props}
  >
    <div
      className={cn("px-6 pb-5 pl-13 text-slate-300 leading-relaxed", className)}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };