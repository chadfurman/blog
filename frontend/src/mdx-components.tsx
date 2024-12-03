import type {MDXComponents} from 'mdx/types'
import ExportedImage, {ExportedImageProps} from 'next-image-export-optimizer'
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
    ul: (props) => <ul className="list-disc pl-8">{props.children}</ul>,
    img: (props) => {
      const image = <ExportedImage
        sizes="100vw"
        width={16 * 40}
        height={9 * 40}
        style={{width: '100%', height: 'auto'}}
        {...(props as ExportedImageProps)}
      />
      if (props.title !== undefined) {
        return (
          <figure>
            {image}
            <figcaption className="mx-auto w-fit">{props.title}</figcaption>
          </figure>
        );
      } else {
        return image
      }
    }
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getMDXComponents(),
    ...components,
  }
}
