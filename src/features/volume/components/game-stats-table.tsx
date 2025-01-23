import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export function GameStatsTable({ data }: { data: any }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Game</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Transaction Count</TableHead>
          <TableHead>Average Bet Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((game: any) => (
          <TableRow key={game.game}>
            <TableCell>{game.game}</TableCell>
            <TableCell>{formatCurrency(game.volume)}</TableCell>
            <TableCell>{game.transactionCount.toLocaleString()}</TableCell>
            <TableCell>{formatCurrency(game.averageBetSize)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
