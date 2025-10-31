"use client";

import React from "react";

interface MarkdownTextProps {
  text: string;
  className?: string;
}

/**
 * Component that renders markdown-formatted text
 * Supports:
 * - Headers (# ## ### ####)
 * - **bold** text
 * - *italic* text
 * - Numbered lists (1. item)
 * - Bullet lists (- item or * item)
 * - Line breaks (\n)
 * - Paragraphs
 */
export function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  if (!text) return null;

  // Split text into paragraphs by double newlines, but preserve single newlines within paragraphs
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div className={`markdown-content ${className}`}>
      {paragraphs.map((paragraph, pIndex) => {
        const trimmedParagraph = paragraph.trim();

        // Check if paragraph is a header (# ## ### #### ##### ######)
        const headerMatch = trimmedParagraph.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const headerText = headerMatch[2];
          const HeaderTag = `h${Math.min(
            level,
            6
          )}` as keyof JSX.IntrinsicElements;
          const sizeClasses: Record<number, string> = {
            1: "text-2xl font-bold",
            2: "text-xl font-bold",
            3: "text-lg font-semibold",
            4: "text-base font-semibold",
            5: "text-sm font-semibold",
            6: "text-xs font-semibold",
          };

          return (
            <HeaderTag
              key={pIndex}
              className={`${
                sizeClasses[level] || sizeClasses[3]
              } text-gray-100 mt-4 mb-2`}
            >
              <InlineMarkdown text={headerText} />
            </HeaderTag>
          );
        }

        // Check if paragraph contains list items (numbered or bullet)
        const hasNumberedList =
          /\n\d+\.\s/.test(paragraph) || /^\d+\.\s/.test(trimmedParagraph);
        const hasBulletList =
          /\n[-*]\s/.test(paragraph) || /^[-*]\s/.test(trimmedParagraph);

        if (hasNumberedList || hasBulletList) {
          // Parse list items - split by newlines
          const lines = paragraph.split(/\n/);
          const listItems: Array<{
            marker: string;
            text: string;
            isListItem: boolean;
          }> = [];

          lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return; // Skip empty lines

            // Check if line starts a new list item
            const numberedMatch = trimmedLine.match(/^(\d+\.)\s+(.+)$/);
            const bulletMatch = trimmedLine.match(/^([-*])\s+(.+)$/);

            if (numberedMatch) {
              listItems.push({
                marker: numberedMatch[1],
                text: numberedMatch[2],
                isListItem: true,
              });
            } else if (bulletMatch) {
              listItems.push({
                marker: "•",
                text: bulletMatch[2],
                isListItem: true,
              });
            } else if (
              listItems.length > 0 &&
              listItems[listItems.length - 1].isListItem
            ) {
              // Continuation of previous list item (multiline)
              const lastItem = listItems[listItems.length - 1];
              lastItem.text += " " + trimmedLine;
            } else {
              // Regular text line
              listItems.push({
                marker: "",
                text: trimmedLine,
                isListItem: false,
              });
            }
          });

          return (
            <div key={pIndex} className="my-3">
              {listItems.map((item, itemIndex) => {
                if (item.isListItem) {
                  // Check if item text contains headers and process accordingly
                  const processedContent = processTextWithHeaders(item.text);
                  return (
                    <div key={itemIndex} className="flex mb-2 ml-1">
                      <span className="mr-3 font-medium text-gray-300 flex-shrink-0">
                        {item.marker}
                      </span>
                      <div className="flex-1">{processedContent}</div>
                    </div>
                  );
                } else {
                  // Regular text within list context - check for headers
                  const processedContent = processTextWithHeaders(item.text);
                  return (
                    <div key={itemIndex} className="mb-2">
                      {processedContent}
                    </div>
                  );
                }
              })}
            </div>
          );
        }

        // Regular paragraph - split by single newlines and process
        const lines = paragraph
          .split(/\n/)
          .filter((line) => line.trim() || paragraph.includes("\n"));
        return (
          <div key={pIndex} className="my-2">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (
                !trimmedLine &&
                lineIndex > 0 &&
                lineIndex < lines.length - 1
              ) {
                return <br key={lineIndex} className="mb-2" />;
              }

              // Check if this line is a header
              const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
              if (headerMatch) {
                const level = headerMatch[1].length;
                const headerText = headerMatch[2];
                const HeaderTag = `h${Math.min(
                  level,
                  6
                )}` as keyof JSX.IntrinsicElements;
                const sizeClasses: Record<number, string> = {
                  1: "text-2xl font-bold",
                  2: "text-xl font-bold",
                  3: "text-lg font-semibold",
                  4: "text-base font-semibold",
                  5: "text-sm font-semibold",
                  6: "text-xs font-semibold",
                };

                return (
                  <HeaderTag
                    key={lineIndex}
                    className={`${
                      sizeClasses[level] || sizeClasses[3]
                    } text-gray-100 mt-4 mb-2`}
                  >
                    <InlineMarkdown text={headerText} />
                  </HeaderTag>
                );
              }

              // Process line for headers and inline markdown
              const processedContent = processTextWithHeaders(
                trimmedLine || line
              );
              return (
                <React.Fragment key={lineIndex}>
                  {processedContent}
                  {lineIndex < lines.length - 1 && trimmedLine && (
                    <br className="mb-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Processes text that may contain headers and inline markdown
 * Returns React elements for headers or inline markdown
 */
function processTextWithHeaders(text: string): React.ReactNode {
  if (!text) return null;

  // Check if the entire text is a header
  const headerMatch = text.trim().match(/^(#{1,6})\s+(.+)$/);
  if (headerMatch) {
    const level = headerMatch[1].length;
    const headerText = headerMatch[2];
    const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
    const sizeClasses: Record<number, string> = {
      1: "text-2xl font-bold",
      2: "text-xl font-bold",
      3: "text-lg font-semibold",
      4: "text-base font-semibold",
      5: "text-sm font-semibold",
      6: "text-xs font-semibold",
    };

    return (
      <HeaderTag
        className={`${
          sizeClasses[level] || sizeClasses[3]
        } text-gray-100 mt-2 mb-1`}
      >
        <InlineMarkdown text={headerText} />
      </HeaderTag>
    );
  }

  // Check if text contains headers inline (split by newlines first)
  const lines = text.split(/\n/);
  if (lines.length > 1) {
    return (
      <>
        {lines.map((line, idx) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return <br key={idx} className="mb-1" />;

          const lineHeaderMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
          if (lineHeaderMatch) {
            const level = lineHeaderMatch[1].length;
            const headerText = lineHeaderMatch[2];
            const HeaderTag = `h${Math.min(
              level,
              6
            )}` as keyof JSX.IntrinsicElements;
            const sizeClasses: Record<number, string> = {
              1: "text-2xl font-bold",
              2: "text-xl font-bold",
              3: "text-lg font-semibold",
              4: "text-base font-semibold",
              5: "text-sm font-semibold",
              6: "text-xs font-semibold",
            };

            return (
              <React.Fragment key={idx}>
                <HeaderTag
                  className={`${
                    sizeClasses[level] || sizeClasses[3]
                  } text-gray-100 mt-2 mb-1`}
                >
                  <InlineMarkdown text={headerText} />
                </HeaderTag>
                {idx < lines.length - 1 && <br className="mb-1" />}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={idx}>
              <InlineMarkdown text={trimmedLine} />
              {idx < lines.length - 1 && <br className="mb-1" />}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  // No headers, just inline markdown
  return <InlineMarkdown text={text} />;
}

/**
 * Component that renders inline markdown (bold, italic)
 * Handles nested formatting and edge cases
 */
function InlineMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const parts: React.ReactNode[] = [];

  // Regex to match **bold** first (before *italic* to avoid conflicts)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  // Match italic: single * (will filter out overlapping with bold)
  const italicRegex = /\*([^*]+)\*/g;

  let lastIndex = 0;
  let processedIndices = new Set<number>();

  // First pass: find all bold matches
  const boldMatches: Array<{ index: number; length: number; text: string }> =
    [];
  let match;

  boldRegex.lastIndex = 0; // Reset regex
  while ((match = boldRegex.exec(text)) !== null) {
    boldMatches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
    });
    // Mark indices as processed
    for (let i = match.index; i < match.index + match[0].length; i++) {
      processedIndices.add(i);
    }
  }

  // Second pass: find italic matches (only in non-bold areas)
  const italicMatches: Array<{ index: number; length: number; text: string }> =
    [];

  italicRegex.lastIndex = 0; // Reset regex
  while ((match = italicRegex.exec(text)) !== null) {
    // Check if this italic match overlaps with any bold match
    let overlaps = false;
    for (const boldMatch of boldMatches) {
      if (
        (match.index >= boldMatch.index &&
          match.index < boldMatch.index + boldMatch.length) ||
        (match.index + match[0].length > boldMatch.index &&
          match.index + match[0].length <= boldMatch.index + boldMatch.length)
      ) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      italicMatches.push({
        index: match.index,
        length: match[0].length,
        text: match[1],
      });
    }
  }

  // Combine and sort all matches
  const allMatches = [
    ...boldMatches.map((m) => ({ ...m, type: "bold" as const })),
    ...italicMatches.map((m) => ({ ...m, type: "italic" as const })),
  ].sort((a, b) => a.index - b.index);

  // Build parts array
  let currentIndex = 0;

  allMatches.forEach((match) => {
    // Add text before match
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }

    // Add formatted text
    if (match.type === "bold") {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-gray-100">
          <InlineMarkdown text={match.text} />
        </strong>
      );
    } else {
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-gray-200">
          {match.text}
        </em>
      );
    }

    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  // If no markdown found, return plain text
  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  return <span>{parts}</span>;
}
