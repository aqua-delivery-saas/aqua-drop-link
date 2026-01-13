import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
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
} from "@/components/ui/command";
import { useCities, type City } from "@/hooks/useCities";

interface CitySearchComboboxProps {
  onSelect: (city: City) => void;
}

export function CitySearchCombobox({ onSelect }: CitySearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { data: cities = [], isLoading } = useCities();

  const filteredCities = cities.filter((city) =>
    `${city.name} ${city.state}`.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start bg-white text-left font-normal h-12 sm:h-14 text-base border-0 shadow-lg hover:bg-white"
        >
          <Search className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground truncate">
            Digite sua cidade...
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite sua cidade..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : searchValue.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Comece a digitar para buscar
              </div>
            ) : filteredCities.length === 0 ? (
              <CommandEmpty>Nenhuma cidade encontrada</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCities.slice(0, 10).map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.name}-${city.state}`}
                    onSelect={() => {
                      onSelect(city);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{city.name}</span>
                    <span className="ml-1 text-muted-foreground">- {city.state}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
