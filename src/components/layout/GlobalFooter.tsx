"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  MapPin,
  Phone,
  Globe2,
  LogIn,
  Handshake,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalFooterProps {
  onOpenLogin: (portal?: "student" | "partner" | "hq") => void;
}

export function GlobalFooter({ onOpenLogin }: GlobalFooterProps) {
  return (
    <footer id="footer" className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="font-display text-sm font-bold text-white">
                NITAI AI SKILL ACADEMY
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400">
              An Education & Skill Development Unit of NITAI AI & DIGITAL EMPIRE ECOSYSTEM.
              <br />
              Powered by WORLD AI ORGANIZATION.
            </p>
            <p className="mt-5 font-display text-xs font-semibold tracking-wide text-amber-300">
              AI FOR ALL • AI EVERYWHERE • AI FOR SOCIAL GOOD • ONE EARTH • ONE FAMILY • ONE FUTURE
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</h4>
            <ul className="mt-4 flex flex-col gap-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                NITAI AI Valley – 29, Umari, Damoh, MP, India
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                9340952324 · 9691204597
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                www.nitaigroup.com · www.waio.in
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Portals</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-300">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto px-0 text-xs"
                  onClick={() => onOpenLogin("student")}
                >
                  <LogIn className="h-3.5 w-3.5 mr-2" />
                  Student Login
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto px-0 text-xs"
                  onClick={() => onOpenLogin("partner")}
                >
                  <Handshake className="h-3.5 w-3.5 mr-2" />
                  Partner Login
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto px-0 text-xs"
                  onClick={() => onOpenLogin("hq")}
                >
                  <Building2 className="h-3.5 w-3.5 mr-2" />
                  HQ Login
                </Button>
              </li>
            </ul>
            <h4 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-300">
              <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms</Link></li>
              <li><Link href="#" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} NITAI AI & DIGITAL EMPIRE ECOSYSTEM. All rights reserved.</span>
          <span>Presented on Teachers&rsquo; Day · Powered by World AI Organization</span>
        </div>
      </div>
    </footer>
  );
}