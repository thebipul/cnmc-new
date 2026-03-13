'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, List, ListOrdered, Link } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const insertMarkdown = useCallback((prefix: string, suffix: string = prefix) => {
    const textarea = document.querySelector('textarea[data-rich-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
    onChange(newText)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const handleBold = () => insertMarkdown('**')
  const handleItalic = () => insertMarkdown('*')
  const handleBulletList = () => insertMarkdown('\n- ')
  const handleNumberedList = () => insertMarkdown('\n1. ')
  const handleLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      const textarea = document.querySelector('textarea[data-rich-editor]') as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end) || 'link text'
      
      const linkMarkdown = `[${selectedText}](${url})`
      const newText = value.substring(0, start) + linkMarkdown + value.substring(end)
      onChange(newText)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-1 border rounded-t-md bg-muted">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          disabled={disabled}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          disabled={disabled}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBulletList}
          disabled={disabled}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNumberedList}
          disabled={disabled}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          disabled={disabled}
          title="Insert link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        data-rich-editor
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[200px] rounded-t-none -mt-2 font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Supports Markdown formatting: **bold**, *italic*, - lists, [links](url)
      </p>
    </div>
  )
}
