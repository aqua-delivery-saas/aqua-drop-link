import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useBrands } from '@/hooks/useBrands';
import { useIsMobile } from '@/hooks/use-mobile';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface BrandComboboxProps {
  value: string;
  selectedBrandId: string | null;
  onChange: (brandName: string, brand: Brand | null) => void;
  disabled?: boolean;
}

export function BrandCombobox({ value, selectedBrandId, onChange, disabled }: BrandComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { data: brands, isLoading } = useBrands();
  const isMobile = useIsMobile();

  // Filter only active brands
  const activeBrands = brands?.filter(b => b.is_active) || [];

  // Filter brands based on search
  const filteredBrands = activeBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check if the search value exactly matches an existing brand
  const exactMatch = activeBrands.find(
    brand => brand.name.toLowerCase() === searchValue.toLowerCase()
  );

  // Show "create new" option if there's a search value and no exact match
  const showCreateOption = searchValue.trim().length > 0 && !exactMatch;

  const handleSelect = (brand: Brand) => {
    onChange(brand.name, brand);
    setSearchValue('');
    setOpen(false);
  };

  const handleCreateNew = () => {
    onChange(searchValue.trim(), null);
    setSearchValue('');
    setOpen(false);
  };

  // Find the selected brand to display
  const selectedBrand = selectedBrandId 
    ? activeBrands.find(b => b.id === selectedBrandId) 
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedBrand?.logo_url && (
              <img 
                src={selectedBrand.logo_url} 
                alt="" 
                className="h-4 w-4 object-contain rounded"
              />
            )}
            {value || 'Selecione ou digite uma marca...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0" 
        align="start"
        side={isMobile ? "top" : "bottom"}
        sideOffset={isMobile ? 8 : 4}
        avoidCollisions={true}
        collisionPadding={{ top: 16, bottom: 100 }}
        sticky="always"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar ou criar marca..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className={cn("max-h-[300px]", isMobile && "max-h-[150px]")}>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Carregando marcas...
              </div>
            ) : (
              <>
                {filteredBrands.length === 0 && !showCreateOption && (
                  <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                )}

                {filteredBrands.length > 0 && (
                  <CommandGroup heading="Marcas existentes">
                    {filteredBrands.map((brand) => (
                      <CommandItem
                        key={brand.id}
                        value={brand.id}
                        onSelect={() => handleSelect(brand)}
                        className="flex items-center gap-2"
                      >
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0',
                            selectedBrandId === brand.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {brand.logo_url && (
                          <img 
                            src={brand.logo_url} 
                            alt="" 
                            className="h-5 w-5 object-contain rounded"
                          />
                        )}
                        <div className="flex flex-col">
                          <span>{brand.name}</span>
                          {brand.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {brand.description}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {showCreateOption && (
                  <CommandGroup heading="Criar nova marca">
                    <CommandItem
                      value={`create-${searchValue}`}
                      onSelect={handleCreateNew}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Criar "{searchValue.trim()}"</span>
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
