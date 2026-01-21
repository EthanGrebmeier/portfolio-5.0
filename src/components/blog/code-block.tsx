import React from "react";

type BlogCodeBlockProps = {
  children: React.ReactNode;
};

export const BlogCodeBlock = ({ children }: BlogCodeBlockProps) => (
  <pre className="overflow-x-auto rounded-lg border border-blue-700 bg-blue-50 p-4 text-sm text-blue-900">
    <code>{children}</code>
  </pre>
);
