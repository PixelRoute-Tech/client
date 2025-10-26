import React, { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

type Option = {
  id: string | number;
  label: string;
};

type AutocompleteProps = {
  options: Option[];
  placeholder?: string;
  onSelect?: (option: Option) => void;
};

export default function Autocomplete({
  options,
  placeholder = "Search...",
  onSelect,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle option select
  const handleSelect = (opt: Option) => {
    setInputValue(opt.label);
    onSelect?.(opt);
    setOpen(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) =>
        i < filtered.length - 1 ? i + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) =>
        i > 0 ? i - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIndex]) handleSelect(filtered[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <input
          ref={inputRef}
          value={inputValue}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
          sideOffset={4}
          onInteractOutside={(event) => {
            // Prevent closing if interacting with input or dropdown content
            if (
              inputRef.current &&
              inputRef.current.contains(event.target as Node)
            ) {
              event.preventDefault();
            }
          }}
        >
          {filtered.length > 0 ? (
            <ul
              ref={listRef}
              className="max-h-60 overflow-auto"
            >
              {filtered.map((opt, idx) => (
                <li
                  key={opt.id}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    handleSelect(opt);
                  }}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    highlightIndex === idx
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-sm text-gray-500">No results</div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
