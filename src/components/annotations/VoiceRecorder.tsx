import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  isGenerating: boolean;
}

export function VoiceRecorder({ onTranscriptionComplete, isGenerating }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez autoriser l'accès.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
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

  const handleSendForTranscription = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);

    try {
      // Create FormData for audio upload
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Get authentication token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call transcription API with medical-grade security
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.transcription) {
        setIsTranscribing(false);
        onTranscriptionComplete(result.transcription);
      } else {
        throw new Error('No transcription received');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Button */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 animate-ping">
              <div className="w-full h-full rounded-full bg-destructive/30" />
            </div>
          )}
          <Button
            variant={isRecording ? "record" : "default"}
            size="iconXl"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing || isGenerating}
            className={cn(
              "relative z-10",
              isRecording && "animate-pulse"
            )}
          >
            {isRecording ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        {isRecording && (
          <div className="text-center">
            <p className="text-2xl font-mono text-foreground">{formatTime(recordingTime)}</p>
            <p className="text-sm text-muted-foreground">Enregistrement en cours...</p>
          </div>
        )}

        {!isRecording && !audioBlob && (
          <p className="text-muted-foreground text-center">
            Cliquez sur le micro pour commencer l'enregistrement
          </p>
        )}
      </div>

      {/* Playback and Send */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-center gap-4">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
          <Button variant="outline" onClick={togglePlayback} disabled={isTranscribing}>
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Écouter
              </>
            )}
          </Button>
          <Button
            onClick={handleSendForTranscription}
            disabled={isTranscribing || isGenerating}
          >
            {isTranscribing || isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isTranscribing ? "Transcription..." : "Génération..."}
              </>
            ) : (
              "Générer l'annotation"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setAudioBlob(null);
              setAudioUrl(null);
            }}
            disabled={isTranscribing}
          >
            Recommencer
          </Button>
        </div>
      )}
    </div>
  );
}
