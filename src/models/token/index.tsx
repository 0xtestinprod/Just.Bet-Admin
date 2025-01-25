import * as API from '@/api';

export type Token = API.Token;

export {
  getAllTokens,
  getTokenByAddress,
  useGetAllTokens,
  useGetTokenByAddress
} from '@/api';
