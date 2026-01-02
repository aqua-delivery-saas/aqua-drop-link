import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCitiesByState } from "@/hooks/useCities";

interface CityComboboxProps {
  state: string;
  value: string;
  cityId: string | null;
  onChange: (cityName: string, cityId: string | null) => void;
  disabled?: boolean;
}

export function CityCombobox({ state, value, cityId, onChange, disabled }: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const { data: cities = [], isLoading } = useCitiesByState(state);

  // Reset when state changes
  useEffect(() => {
    if (!state) {
      onChange("", null);
    }
  }, [state]);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const exactMatch = cities.find(
    (city) => city.name.toLowerCase() === searchValue.toLowerCase()
  );

  const handleSelect = (selectedCityName: string, selectedCityId: string | null) => {
    onChange(selectedCityName, selectedCityId);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreateNew = () => {
    if (searchValue.trim()) {
      // Capitalize first letter of each word
      const formattedName = searchValue
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      onChange(formattedName, null); // null cityId means it's a new city
      setOpen(false);
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || !state}
          className="w-full justify-between font-normal"
        >
          {value || (state ? "Buscar cidade..." : "Selecione um estado primeiro")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-background" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Digite o nome da cidade..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {filteredCities.length === 0 && !searchValue && (
                  <CommandEmpty>
                    {cities.length === 0 
                      ? "Nenhuma cidade cadastrada neste estado. Digite para criar."
                      : "Digite para buscar ou criar uma cidade."
                    }
                  </CommandEmpty>
                )}
                
                {filteredCities.length > 0 && (
                  <CommandGroup heading="Cidades existentes">
                    {filteredCities.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.name}
                        onSelect={() => handleSelect(city.name, city.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cityId === city.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchValue.trim() && !exactMatch && (
                  <CommandGroup heading="Criar nova cidade">
                    <CommandItem
                      value={`create-${searchValue}`}
                      onSelect={handleCreateNew}
                      className="text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar "{searchValue.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
