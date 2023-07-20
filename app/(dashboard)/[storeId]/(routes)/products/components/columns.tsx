"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "isArchived",
    header: "Archviado",
  },
  {
    accessorKey: "isFeatured",
    header: "Recomendados",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "size",
    header: "Tamaño",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div 
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: row.original.color}}/>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
