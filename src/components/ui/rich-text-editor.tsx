"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

// Importar o React Quill dinamicamente para evitar problemas de SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-md"></div>,
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Digite o conteúdo..." }: RichTextEditorProps) {
  // Estado local para lidar com o valor do editor
  const [editorValue, setEditorValue] = useState(value)

  // Atualizar o estado local quando o valor da prop mudar
  useEffect(() => {
    setEditorValue(value)
  }, [value])

  // Configuração dos módulos do Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ table: {} }],
      [{ align: [] }],
    ],
  }

  // Configuração dos formatos permitidos
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "color",
    "background",
    "table",
    "align",
  ]

  // Manipulador de alterações no editor
  const handleChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}
