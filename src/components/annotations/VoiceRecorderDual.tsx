import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  FileAudio, 
  Check,
  Loader2,
  Volume2,
  X
} from "lucide-react";

interface VoiceRecorderDualProps {
  onAudioReady: (audioBlob: Blob, duration: number) => void;
  isProcessing: boolean;
}

export function VoiceRecorderDual({ onAudioReady, isProcessing }: VoiceRecorderDualProps) {
  const [mode, setMode] = useState<"record" | "import">("record");
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  // Imported file state
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importedUrl, setImportedUrl] = useState<string | null>(null);
  const [importedDuration, setImportedDuration] = useState(0);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const importedAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingTimeRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (importedUrl) URL.revokeObjectURL(importedUrl);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl, importedUrl]);

  // Audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current && isRecording && !isPaused) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Setup audio context for visualization
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioDuration(recordingTimeRef.current);
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recordingTimeRef.current = 0;
      setAudioBlob(null);
      setAudioUrl(null);

      timerRef.current = setInterval(() => {
        recordingTimeRef.current += 1;
        setRecordingTime(recordingTimeRef.current);
      }, 1000);
      
      // Start audio level animation
      updateAudioLevel();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez autoriser l'accès.",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          recordingTimeRef.current += 1;
          setRecordingTime(recordingTimeRef.current);
        }, 1000);
        updateAudioLevel();
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setAudioLevel(0);
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setAudioLevel(0);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setAudioDuration(0);
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a", "audio/ogg", "audio/webm", "audio/x-m4a"];
    if (!validTypes.some(t => file.type.includes(t.split('/')[1]))) {
      toast({
        title: "Format non supporté",
        description: "Formats acceptés: MP3, WAV, M4A, OGG, WEBM",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximum est de 25 MB",
        variant: "destructive",
      });
      return;
    }

    if (importedUrl) URL.revokeObjectURL(importedUrl);
    
    const url = URL.createObjectURL(file);
    setImportedFile(file);
    setImportedUrl(url);
    
    // Get duration
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setImportedDuration(Math.floor(audio.duration));
    };
  };

  const clearImportedFile = () => {
    if (importedUrl) URL.revokeObjectURL(importedUrl);
    setImportedFile(null);
    setImportedUrl(null);
    setImportedDuration(0);
  };

  const handleContinue = () => {
    if (mode === "record" && audioBlob) {
      onAudioReady(audioBlob, audioDuration);
    } else if (mode === "import" && importedFile) {
      onAudioReady(importedFile, importedDuration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "record" | "import")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="record" className="gap-2">
            <Mic className="w-4 h-4" />
            Enregistrer
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="w-4 h-4" />
            Importer un fichier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
          <div className="flex flex-col items-center gap-6">
            {/* Main recording button */}
            <div className="relative">
              {isRecording && !isPaused && (
                <div className="absolute inset-0 animate-ping">
                  <div className="w-full h-full rounded-full bg-destructive/30" />
                </div>
              )}
              <Button
                variant={isRecording ? "record" : "default"}
                size="iconXl"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={cn(
                  "relative z-10 w-28 h-28 md:w-32 md:h-32",
                  isRecording && !isPaused && "animate-pulse"
                )}
              >
                {isRecording ? (
                  <Square className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>
            </div>

            {/* Recording info */}
            {isRecording && (
              <div className="text-center space-y-4">
                <p className="text-3xl font-mono text-foreground">{formatTime(recordingTime)}</p>
                
                {/* Audio level indicator */}
                <div className="flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${audioLevel * 100}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {isPaused ? "En pause" : "Enregistrement en cours..."}
                </p>
                
                {/* Pause button */}
                <Button variant="outline" onClick={pauseRecording}>
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Idle state */}
            {!isRecording && !audioBlob && (
              <p className="text-muted-foreground text-center">
                Cliquez sur le micro pour commencer l'enregistrement
              </p>
            )}

            {/* Playback controls */}
            {audioUrl && !isRecording && (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileAudio className="w-4 h-4" />
                  <span>Durée: {formatTime(audioDuration)}</span>
                </div>

                {/* Player natif - fonctionne sur tous les mobiles */}
                <audio
                  src={audioUrl}
                  controls
                  preload="auto"
                  className="w-full"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <Button variant="ghost" onClick={resetRecording} disabled={isProcessing} className="flex-1 sm:flex-none">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réenregistrer
                  </Button>

                  <Button onClick={handleContinue} disabled={isProcessing} className="flex-1 sm:flex-none">
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Continuer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="import" className="mt-6">
          <div className="space-y-6">
            {!importedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border rounded-xl p-8 md:p-12 text-center hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Glissez votre fichier audio ici
                  </p>
                  <p className="text-muted-foreground mb-4">
                    ou cliquez pour parcourir
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded">MP3</span>
                    <span className="px-2 py-1 bg-muted rounded">WAV</span>
                    <span className="px-2 py-1 bg-muted rounded">M4A</span>
                    <span className="px-2 py-1 bg-muted rounded">OGG</span>
                    <span className="px-2 py-1 bg-muted rounded">WEBM</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Taille max: 25 MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileAudio className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[200px] md:max-w-none">
                        {importedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(importedFile.size)} • {formatTime(importedDuration)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearImportedFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <audio
                  ref={importedAudioRef}
                  src={importedUrl || ""}
                  controls
                  className="w-full"
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={clearImportedFile} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Changer de fichier
                  </Button>
                  <Button onClick={handleContinue} disabled={isProcessing} className="flex-1">
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Analyser ce fichier
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
