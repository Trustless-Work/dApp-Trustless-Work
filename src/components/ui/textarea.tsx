"use client";

import * as React from "react";

export function Textarea({
                           className,
                           ...props
                         }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-md border border-gray-300 p-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${className}`}
      {...props}
    />
  );
}