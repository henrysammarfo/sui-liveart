import { useContext } from 'react';
import { NftContext } from '../context/NftContext';

export function useNft() {
  const context = useContext(NftContext);
  if (context === undefined) {
    throw new Error('useNft must be used within a NftProvider');
  }
  return context;
}

export default useNft;