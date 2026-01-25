import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  showDropdown?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export function CopyButton({ text, className, showDropdown = false, variant = "outline" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (format: "plain" | "rich" | "html" = "plain") => {
    try {
      if (format === "html") {
        const htmlContent = `<pre style="font-family: system-ui; white-space: pre-wrap;">${text}</pre>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else if (format === "rich") {
        // For rich text, we'll use the same as HTML but with better formatting
        const htmlContent = text.split('\n').map(line => `<p>${line}</p>`).join('');
        const blob = new Blob([htmlContent], { type: "text/html" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      
      setCopied(true);
      toast({
        title: "✓ Copié !",
        description: "L'annotation a été copiée dans le presse-papier",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support ClipboardItem
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "✓ Copié !",
        description: "L'annotation a été copiée dans le presse-papier",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="sm" className={cn("gap-2", className)}>
            {copied ? (
              <Check className="w-4 h-4 text-secondary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copié !" : "Copier"}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => copyToClipboard("plain")}>
            Copier le texte simple
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard("rich")}>
            Copier avec formatage riche
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard("html")}>
            Copier comme HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={() => copyToClipboard("plain")}
      className={cn("gap-2", className)}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-secondary" />
          Copié !
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copier
        </>
      )}
    </Button>
  );
}
