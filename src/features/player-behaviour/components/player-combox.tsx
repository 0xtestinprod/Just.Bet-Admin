'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
import { useDebounce } from '@/hooks/use-debounce';

interface Player {
  id: string;
  address: string;
}

interface PlayerComboboxProps {
  players: Player[];
  selectedPlayer: string;
  setSelectedPlayer: (address: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function PlayerCombobox({
  players,
  selectedPlayer,
  setSelectedPlayer
}: PlayerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredPlayers = React.useMemo(() => {
    if (!debouncedSearchQuery) return players.slice(0, page * ITEMS_PER_PAGE);
    const query = debouncedSearchQuery.toLowerCase();
    return players
      .filter((player) => player.address.toLowerCase().includes(query))
      .slice(0, page * ITEMS_PER_PAGE);
  }, [players, debouncedSearchQuery, page]);

  const selectedPlayerDetails = React.useMemo(
    () => players.find((player) => player.address === selectedPlayer),
    [players, selectedPlayer]
  );

  const lastItemRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            const totalItems = nextPage * ITEMS_PER_PAGE;
            setHasMore(totalItems < players.length);
            return nextPage;
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore, players.length]
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
    setPage(1);
    setHasMore(true);
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
              ? `${selectedPlayerDetails.address}`
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
              {filteredPlayers.map((player, index) => (
                <CommandItem
                  key={player.id}
                  value={player.address}
                  onSelect={handleSelect}
                  ref={
                    index === filteredPlayers.length - 1 ? lastItemRef : null
                  }
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
              {hasMore && (
                <div className='py-2 text-center'>
                  <Loader2 className='inline-block h-4 w-4 animate-spin' />
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
