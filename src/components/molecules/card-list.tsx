'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { characterService } from '@/services';

import { Pagination } from '../organism/pagination';
import { Card } from './card';

export function CardList() {
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? null;

  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters', currentPage, name],
    queryFn: () =>
      characterService.getAllCharacters({ limit: 10, offset: (currentPage - 1) * 10, name }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoadingCharacters) return null;

  return (
    <div>
      <ul className="relative grid grid-cols-3 gap-8">
        {characters?.results?.map((character) => (
          <Card
            key={character.id}
            id={character.id}
            name={character.name}
            description={character.description}
            thumbnail={{ path: character.thumbnail.path, extension: character.thumbnail.extension }}
          />
        ))}
      </ul>

      <Pagination
        onPageChange={handlePageChange}
        totalPages={characters?.total || 0}
        currentPage={currentPage}
      />
    </div>
  );
}