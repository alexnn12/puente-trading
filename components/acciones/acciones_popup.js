import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon } from "lucide-react" 

export function AccionesPopup({ stock, price }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1"> 
          <EyeIcon className="w-4 h-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles de {stock.symbol}</DialogTitle>
          <DialogDescription>
            Información completa de la acción {stock.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio Actual</Label>
              <div className="text-2xl font-bold">
                {price && price.price ? `$${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'No disponible'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio de Apertura</Label>
              <div className="text-lg">
                {price && price.open ? `$${price.open.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Volumen</Label>
              <div className="text-lg">
                {price && price.volume ? price.volume.toLocaleString('en-US') : 'N/A'}
              </div>
            </div>
           
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio Mínimo</Label>
              <div className="text-lg text-red-600">
                {price && price.low ? `$${price.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio Máximo</Label>
              <div className="text-lg text-green-600">
                {price && price.high ? `$${price.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
              </div>
            </div>
            
        
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Variación Diaria</Label>
              <div className={`text-lg ${price?.yesterdayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {price?.yesterdayChange !== undefined && price?.yesterdayChange !== null ? 
                  `${price.yesterdayChange >= 0 ? '+' : ''}$${price.yesterdayChange.toFixed(2)}` : 'N/A'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Variación Semanal</Label>
              <div className={`text-lg ${price?.weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {price?.weekChange !== undefined && price?.weekChange !== null ? 
                  `${price.weekChange >= 0 ? '+' : ''}$${price.weekChange.toFixed(2)}` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
