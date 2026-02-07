import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { usePhraseTemplatesByCategory } from "@/hooks/useConfiguration";
import { MessageSquare, Zap, Plus, Loader2 } from "lucide-react";

interface PhraseTemplatePickerProps {
  onSelect: (content: string) => void;
}

export function PhraseTemplatePicker({ onSelect }: PhraseTemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const { byCategory, isLoading } = usePhraseTemplatesByCategory();
  const categories = Object.keys(byCategory).sort();

  const handleSelect = (content: string) => {
    onSelect(content);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Chargement...
      </Button>
    );
  }

  const hasTemplates = categories.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Phrases
          {hasTemplates && (
            <Badge variant="secondary" className="ml-2">
              {Object.values(byCategory).flat().length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une phrase..." />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <p className="text-muted-foreground">Aucune phrase trouvée</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ajoutez des templates dans Configuration
                </p>
              </div>
            </CommandEmpty>
            {categories.map((category, index) => (
              <CommandGroup key={category} heading={category}>
                {byCategory[category].map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => handleSelect(template.content)}
                    className="cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-medium">{template.label}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {template.content.substring(0, 50)}...
                      </span>
                    </div>
                    {template.shortcut && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {template.shortcut}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
                {index < categories.length - 1 && <CommandSeparator />}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
