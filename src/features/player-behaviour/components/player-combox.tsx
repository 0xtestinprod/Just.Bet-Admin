'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface Player {
  id: string;
  address: string;
}

interface PlayerComboboxProps {
  players: Player[];
  selectedPlayer: string;
  setSelectedPlayer: (address: string) => void;
}

export function PlayerCombobox({
  players,
  selectedPlayer,
  setSelectedPlayer
}: PlayerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPlayers = React.useMemo(() => {
    if (!searchQuery) return players;
    const query = searchQuery.toLowerCase();
    return players.filter((player) =>
      player.address.toLowerCase().includes(query)
    );
  }, [players, searchQuery]);

  const selectedPlayerDetails = React.useMemo(
    () => players.find((player) => player.address === selectedPlayer),
    [players, selectedPlayer]
  );

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      setSelectedPlayer(currentValue === selectedPlayer ? '' : currentValue);
      setOpen(false);
    },
    [selectedPlayer, setSelectedPlayer]
  );

  const handleSearch = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          <span className='block max-w-[calc(100%-2rem)] overflow-hidden text-ellipsis whitespace-nowrap'>
            {selectedPlayerDetails?.address
              ? `${selectedPlayerDetails.address.slice(0, 6)}...${selectedPlayerDetails.address.slice(-4)}`
              : 'Select player...'}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput
            placeholder='Search player address...'
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandGroup>
              {filteredPlayers.map((player) => (
                <CommandItem
                  key={player.id}
                  value={player.address}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedPlayer === player.address
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {player.address}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
