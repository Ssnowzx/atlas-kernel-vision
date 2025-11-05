import { useState, useRef } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { Camera, X, MapPin, Mountain, Upload, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CapturedImage } from "@/types/dashboard";

export const ImageGallery = () => {
  const { capturedImages, addCapturedImage, updateCapturedImage, addEventLog, addIPCMessage } = useDashboardStore();
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [filter, setFilter] = useState<"all" | "Processada" | "Aguardando análise">("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CapturedImage>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureImage = () => {
    setIsCapturing(true);
    
    const imageNumber = capturedImages.length + 1;
    const newImage: Omit<CapturedImage, "id"> = {
      filename: `IMG_${String(imageNumber).padStart(4, "0")}.jpg`,
      timestamp: new Date().toLocaleString("pt-BR"),
      coordinates: {
        lat: (Math.random() * 180 - 90).toFixed(2) as any,
        long: (Math.random() * 360 - 180).toFixed(2) as any,
      },
      altitude: `${Math.floor(Math.random() * 200000 + 100000).toLocaleString()} km`,
      status: Math.random() > 0.5 ? "Processada" : "Aguardando análise",
      url: `https://images.unsplash.com/photo-${1600000000000 + imageNumber}?w=800&h=600&fit=crop`,
    };

    setTimeout(() => {
      addCapturedImage(newImage);
      addEventLog({
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        message: `📸 Nova imagem capturada: ${newImage.filename}`,
        severity: "success",
      });
      addIPCMessage({
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        from: "Driver Câmera",
        to: "Gerência Arquivos",
        type: "WRITE_FILE",
      });
      
      toast.success("Imagem capturada com sucesso!", {
        icon: "📸",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #10b981",
        },
      });
      
      setIsCapturing(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageNumber = capturedImages.length + index + 1;
        addCapturedImage({
          filename: file.name,
          timestamp: new Date().toLocaleString("pt-BR"),
          coordinates: {
            lat: (Math.random() * 180 - 90).toFixed(2) as any,
            long: (Math.random() * 360 - 180).toFixed(2) as any,
          },
          altitude: `${Math.floor(Math.random() * 200000 + 100000).toLocaleString()} km`,
          status: "Aguardando análise",
          url: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${files.length} imagem(ns) adicionada(s)!`, {
      icon: "📁",
    });
  };

  const handleSaveEdit = () => {
    if (selectedImage && editData) {
      updateCapturedImage(selectedImage.id, editData);
      setIsEditing(false);
      toast.success("Metadados atualizados!", {
        icon: "✅",
      });
    }
  };

  const filteredImages = filter === "all" 
    ? capturedImages 
    : capturedImages.filter((img) => img.status === filter);

  return (
    <>
      <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-glass overflow-hidden">
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Imagens Capturadas da Sonda
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Arquivo científico do Atlas
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleCaptureImage}
              disabled={isCapturing}
              className="bg-primary hover:bg-primary/80"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isCapturing ? "Capturando..." : "Capturar"}
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-primary/50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Processada">Processadas</SelectItem>
                <SelectItem value="Aguardando análise">Pendentes</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredImages.length} imagem(ns)
            </span>
          </div>

          {isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 bg-primary/30 z-50 pointer-events-none"
            />
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-primary/20 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setSelectedImage(image)}
                >
                  {image.url.startsWith('data:') || image.url.startsWith('http') ? (
                    <img 
                      src={image.url} 
                      alt={image.filename}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-low/20" />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Camera className="w-12 h-12" />
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-mono text-foreground">{image.filename}</p>
                    <Badge className="mt-1 text-xs" variant={image.status === "Processada" ? "default" : "secondary"}>
                      {image.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredImages.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filter === "all" 
                    ? "Nenhuma imagem ainda. Clique em Capturar ou Upload." 
                    : `Nenhuma imagem ${filter === "Processada" ? "processada" : "pendente"}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-card border-primary/20">
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">{selectedImage.filename}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/20 to-low/20 flex items-center justify-center">
                {selectedImage.url.startsWith('data:') || selectedImage.url.startsWith('http') ? (
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-24 h-24 text-muted-foreground" />
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      value={editData.coordinates?.lat || selectedImage.coordinates.lat}
                      onChange={(e) => setEditData({
                        ...editData,
                        coordinates: {
                          ...selectedImage.coordinates,
                          lat: parseFloat(e.target.value) as any,
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      value={editData.coordinates?.long || selectedImage.coordinates.long}
                      onChange={(e) => setEditData({
                        ...editData,
                        coordinates: {
                          ...selectedImage.coordinates,
                          long: parseFloat(e.target.value) as any,
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Altitude</Label>
                    <Input
                      value={editData.altitude || selectedImage.altitude}
                      onChange={(e) => setEditData({ ...editData, altitude: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} className="flex-1">Salvar</Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Coordenadas:</span>
                      </div>
                      <p className="font-mono text-foreground">
                        Lat: {selectedImage.coordinates.lat}° | Long: {selectedImage.coordinates.long}°
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mountain className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Altitude:</span>
                      </div>
                      <p className="font-mono text-foreground">{selectedImage.altitude}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Capturada em:</span>
                      <p className="font-mono text-foreground">{selectedImage.timestamp}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={selectedImage.status === "Processada" ? "default" : "secondary"}>
                        {selectedImage.status}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsEditing(true);
                      setEditData({});
                    }} 
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    Editar Metadados
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
