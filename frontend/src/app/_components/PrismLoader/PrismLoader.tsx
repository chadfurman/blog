'use client';

import { useEffect } from 'react';

// Import Prism core and languages
import Prism from 'prismjs';

// Import languages we commonly use
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';

// Enhanced C preprocessor support
import 'prismjs/components/prism-clike';

export default function PrismLoader() {
  useEffect(() => {
    // Highlight all code blocks on the page once when component mounts
    Prism.highlightAll();
  }, []);

  // This component doesn't render anything visible
  return null;
}