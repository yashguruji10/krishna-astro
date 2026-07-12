'use client';

import { useRef, useEffect } from 'react';

/**
 * A small WYSIWYG editor so the client can format text (bold, lists, links,
 * paragraphs) using toolbar buttons instead of typing HTML tags by hand.
 * It stores/returns plain HTML, same as before, so nothing else in the
 * app needs to change.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const lastValue = useRef(value);

  useEffect(() => {
    if (ref.current && value !== lastValue.current) {
      ref.current.innerHTML = value || '';
      lastValue.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleInput() {
    const html = ref.current.innerHTML;
    lastValue.current = html;
    onChange(html);
  }

  function exec(cmd, arg) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    handleInput();
  }

  function handleLink() {
    const url = window.prompt('Paste the web address (link) to open, e.g. https://example.com');
    if (url) exec('createLink', url);
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 bg-gray-50 border-b border-gray-200 p-1">
        <ToolbarBtn onClick={() => exec('formatBlock', '<P>')} title="Normal text">¶</ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', '<H3>')} title="Heading">H</ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => exec('bold')} title="Bold"><b>B</b></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="Italic"><i>I</i></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="Underline"><u>U</u></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet list">• ‒</ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered list">1‒</ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={handleLink} title="Insert link">🔗</ToolbarBtn>
        <ToolbarBtn onClick={() => exec('removeFormat')} title="Clear formatting">Clear</ToolbarBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder || 'Type here...'}
        className="rte-content prose prose-sm max-w-none p-3 min-h-[150px] text-sm text-gray-800 focus:outline-none"
      />
    </div>
  );
}

function ToolbarBtn({ onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="min-w-[2rem] h-8 px-2 flex items-center justify-center rounded hover:bg-white border border-transparent hover:border-gray-300 text-gray-700 text-sm"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}
