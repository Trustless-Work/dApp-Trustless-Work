"use client"
import { useTranslation } from "react-i18next"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { exportEscrowsToPDF } from "@/utils/pdf-export"

interface ExportButtonProps {
  escrows: any[]
  role: string
}

export const ExportButton = ({ escrows, role }: ExportButtonProps) => {
  const { t } = useTranslation()

  const handleExportPDF = () => {
    exportEscrowsToPDF(escrows, {
      title: `My Escrows - ${role.toUpperCase()} Role`,
      orientation: "landscape",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel (Coming Soon)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
