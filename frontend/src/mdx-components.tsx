import type {MDXComponents} from 'mdx/types'
import Image, {ImageProps} from 'next/image'
import Link from "next/link";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.
export function getMDXComponents(): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    a: (props) => (
      <Link href={props.href ?? "/"} target="_blank">{props.children}</Link>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        width={16 * 40}
        height={9 * 40}
        style={{width: '100%', height: 'auto'}}
        {...(props as ImageProps)}
      />
    ),
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getMDXComponents(),
    ...components,
  }
}