export interface ContentBlock {
  type: "paragraph" | "bullets" | "code" | "grid" | "callout";
  text?: string;
  items?: string[];
  code?: string;
  language?: string;
  cards?: { title: string; text: string }[];
}

export interface Slide {
  id: number;
  marker: string;
  section: string;
  title: string;
  subtitle?: string;
  layout: "title" | "content" | "code" | "keypoints" | "takeaways" | "wrapup";
  contentBlocks: ContentBlock[];
  accentColor: "cyan" | "gold";
}

function cleanText(text: string): string {
  return text
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .trim();
}

function isTableRow(line: string): boolean {
  const l = line.trim();
  return l.startsWith("|") && (l.match(/\|/g) || []).length >= 2;
}

function extractBullets(text: string): string[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const bullets: string[] = [];
  let pendingHeading: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("```") || isTableRow(line) || /^\|?[\s:|-]+\|?$/.test(line)) continue;

    const heading = line.match(/^#{2,6}\s+(.+)/);
    if (heading) {
      if (pendingHeading) bullets.push(cleanText(pendingHeading));
      pendingHeading = cleanText(heading[1]);
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const item = cleanText(bulletMatch[1]);
      bullets.push(pendingHeading ? `<strong>${pendingHeading}:</strong> ${item}` : item);
      pendingHeading = null;
      continue;
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)/);
    if (numberedMatch) {
      const item = cleanText(numberedMatch[1]);
      bullets.push(pendingHeading ? `<strong>${pendingHeading}:</strong> ${item}` : item);
      pendingHeading = null;
      continue;
    }

    const item = cleanText(line);
    if (item) {
      bullets.push(pendingHeading ? `<strong>${pendingHeading}:</strong> ${item}` : item);
      pendingHeading = null;
    }
  }

  if (pendingHeading) bullets.push(cleanText(pendingHeading));
  return bullets;
}

function extractCodeBlocks(text: string): { code: string; language: string }[] {
  const blocks: { code: string; language: string }[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ language: match[1] || "text", code: match[2].trim() });
  }
  return blocks;
}

function extractCards(text: string): { title: string; text: string }[] {
  const cards: { title: string; text: string }[] = [];
  const sections = text.split(/###\s+/).filter((s) => s.trim());
  for (const section of sections) {
    const lines = section
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("```") && !isTableRow(l) && !/^\|?[\s:|-]+\|?$/.test(l));
    if (lines.length > 0) {
      const title = cleanText(lines[0].replace(/^#+\s*/, ""));
      const body = lines.slice(1).map((l) => cleanText(l)).filter(Boolean).join(" ");
      cards.push({ title: title || "Overview", text: body || "Explore this concept further." });
    }
  }
  return cards;
}

function parseSectionHeading(text: string): string {
  const firstLine = text.split("\n").find((l) => l.trim()) || "";
  return cleanText(firstLine.replace(/^#+\s*/, ""));
}

export function generateSlidesFromMarkdown(
  markdown: string,
  missionNumber: number,
  title: string,
): Slide[] {
  if (!markdown || markdown.trim().length === 0) {
    return generateFallbackSlides(missionNumber, title);
  }

  const slides: Slide[] = [];
  let slideId = 1;
  const pad = (n: number) => String(n).padStart(2, "0");

  const sections = markdown.split(/(?=^## )/m).filter((s) => s.trim());

  const h1Match = markdown.match(/^#\s+(.+)$/m);
  const displayTitle = h1Match ? cleanText(h1Match[1]) : title;

  let objectives: string[] = [];
  const objSection = sections.find((s) => /^##\s+Learning Objectives/i.test(s));
  if (objSection) {
    objectives = extractBullets(objSection);
  }

  slides.push({
    id: slideId++,
    marker: pad(missionNumber),
    section: "Overview",
    title: displayTitle,
    subtitle: `Mission ${missionNumber} — Guided Lesson`,
    layout: "title",
    contentBlocks: [
      {
        type: "bullets",
        items:
          objectives.length > 0
            ? objectives
            : ["Master the concepts in this mission", "Apply theory through practical examples", "Test your understanding with the quiz"],
      },
    ],
    accentColor: "cyan",
  });

  const contentSections = sections.filter((s) => {
    if (!/^##\s/.test(s)) return false;
    const heading = parseSectionHeading(s);
    return (
      !/^Learning Objectives/i.test(heading) &&
      !/^Key Takeaways/i.test(heading) &&
      !/^Practice Challenge/i.test(heading) &&
      !/^Homework/i.test(heading) &&
      !/^Summary$/i.test(heading) &&
      s.replace(/^#+\s+.+\n?/, "").replace(/^>\s*.+/m, "").trim().length > 20
    );
  });

  const maxContentSlides = 4;
  const processedSections = contentSections.slice(0, maxContentSlides);

  for (let i = 0; i < processedSections.length; i++) {
    const section = processedSections[i];
    const heading = parseSectionHeading(section);
    const bodyContent = section.replace(/^#+\s+.+\n?/, "").trim();
    const hasSubsections = /###\s+/.test(section);
    const codeBlocks = extractCodeBlocks(bodyContent);

    if (codeBlocks.length > 0 && codeBlocks[0].code.length > 30) {
      slides.push({
        id: slideId++,
        marker: `${pad(missionNumber)}.${pad(i + 1)}`,
        section: heading,
        title: heading,
        layout: "code",
        contentBlocks: [{ type: "code", code: codeBlocks[0].code, language: codeBlocks[0].language }],
        accentColor: i % 2 === 0 ? "cyan" : "gold",
      });
      continue;
    }

    if (hasSubsections) {
      const cards = extractCards(section);
      if (cards.length >= 2) {
        slides.push({
          id: slideId++,
          marker: `${pad(missionNumber)}.${pad(i + 1)}`,
          section: heading,
          title: heading,
          layout: "keypoints",
          contentBlocks: [{ type: "grid", cards: cards.slice(0, 6) }],
          accentColor: i % 2 === 0 ? "gold" : "cyan",
        });
        continue;
      }
    }

    const bullets = extractBullets(bodyContent);
    const paragraphs = bodyContent
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith("#") && !p.startsWith("```") && !p.startsWith("-") && !isTableRow(p.split("\n")[0]));

    const blocks: ContentBlock[] = [];

    if (bullets.length > 0) {
      blocks.push({ type: "bullets", items: bullets.slice(0, 6) });
    } else if (paragraphs.length > 0) {
      blocks.push({ type: "paragraph", text: cleanText(paragraphs.slice(0, 2).join("\n\n")) });
    } else {
      const cleanFallback = bodyContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !isTableRow(l) && !/^\|?[\s:|-]+\|?$/.test(l))
        .join(" ");
      blocks.push({ type: "paragraph", text: cleanText(cleanFallback.slice(0, 300)) });
    }

    slides.push({
      id: slideId++,
      marker: `${pad(missionNumber)}.${pad(i + 1)}`,
      section: heading,
      title: heading,
      layout: "content",
      contentBlocks: blocks,
      accentColor: i % 2 === 0 ? "cyan" : "gold",
    });
  }

  const takeawaysSection = sections.find((s) => /^##\s+Key Takeaways/i.test(s));
  if (takeawaysSection) {
    const takeaways = extractBullets(takeawaysSection);
    slides.push({
      id: slideId++,
      marker: `${pad(missionNumber)}.${pad(slideId - 1)}`,
      section: "Key Takeaways",
      title: "Key Takeaways",
      layout: "takeaways",
      contentBlocks: [{ type: "bullets", items: takeaways.length > 0 ? takeaways : ["Review today's material carefully"] }],
      accentColor: "cyan",
    });
  }

  const challengeSection = sections.find((s) => /^##\s+(Practice Challenge|Homework)/i.test(s));
  if (challengeSection) {
    const challengeBody = challengeSection.replace(/^#+\s+.+\n?/, "").trim();
    const challengeBullets = extractBullets(challengeBody);
    slides.push({
      id: slideId++,
      marker: `${pad(missionNumber)}.${pad(slideId - 1)}`,
      section: "Practice",
      title: "Practice Challenge",
      layout: "wrapup",
      contentBlocks: [
        {
          type: "bullets",
          items: challengeBullets.length > 0 ? challengeBullets : ["Apply what you learned today in a hands-on exercise"],
        },
        { type: "callout", text: "Complete this challenge before moving to the next module." },
      ],
      accentColor: "gold",
    });
  } else {
    slides.push({
      id: slideId++,
      marker: `${pad(missionNumber)}.${pad(slideId - 1)}`,
      section: "Wrap-Up",
      title: `Mission ${missionNumber} — Complete`,
      layout: "wrapup",
      contentBlocks: [
        {
          type: "paragraph",
          text: "You've completed the theory for this mission. Proceed to the examples and quiz to earn your credits.",
        },
      ],
      accentColor: "gold",
    });
  }

  while (slides.length < 4) {
    const fillerId = slideId++;
    slides.splice(slides.length - 1, 0, {
      id: fillerId,
      marker: `${pad(missionNumber)}.${pad(fillerId)}`,
      section: "Deep Dive",
      title: "Key Concepts",
      layout: "content",
      contentBlocks: [
        {
          type: "paragraph",
          text: "Explore the core ideas behind this topic and how they connect to real-world applications.",
        },
      ],
      accentColor: "cyan",
    });
  }

  if (slides.length > 7) {
    slides.splice(1, slides.length - 7);
  }

  return slides;
}

function generateFallbackSlides(missionNumber: number, title: string): Slide[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    {
      id: 1,
      marker: pad(missionNumber),
      section: "Overview",
      title,
      subtitle: `Mission ${missionNumber} — Guided Lesson`,
      layout: "title",
      contentBlocks: [
        {
          type: "bullets",
          items: ["Learn core concepts and theory", "Apply knowledge through examples", "Test understanding with a quiz"],
        },
      ],
      accentColor: "cyan",
    },
    {
      id: 2,
      marker: `${pad(missionNumber)}.01`,
      section: "Core Concepts",
      title: "Core Concepts",
      layout: "content",
      contentBlocks: [
        {
          type: "paragraph",
          text: `This mission covers the essential concepts of <strong>${title}</strong>. Pay close attention to the key definitions and frameworks introduced here.`,
        },
      ],
      accentColor: "cyan",
    },
    {
      id: 3,
      marker: `${pad(missionNumber)}.02`,
      section: "Key Takeaways",
      title: "Key Takeaways",
      layout: "takeaways",
      contentBlocks: [
        {
          type: "bullets",
          items: [
            `Understanding the fundamentals of ${title}`,
            "Practical applications to your daily life",
            "Best practices for implementation",
            "How this connects to your course roadmap",
          ],
        },
      ],
      accentColor: "cyan",
    },
    {
      id: 4,
      marker: `${pad(missionNumber)}.03`,
      section: "Practice",
      title: "Practice Challenge",
      layout: "wrapup",
      contentBlocks: [
        {
          type: "bullets",
          items: ["Review the theory sections carefully", "Try the hands-on exercises", "Note any questions for the AI mentor", "Complete the quiz to earn your credits"],
        },
        { type: "callout", text: "Proceed to the Examples section for real-world applications." },
      ],
      accentColor: "gold",
    },
  ];
}