import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Loader2, Search as SearchIcon, Box, Cuboid, Component, Network, Server } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', searchParams.get('q')],
    queryFn: async () => {
      const q = searchParams.get('q');
      if (!q) return [];
      return (await api.get('/search', { params: { q } })).data;
    },
    enabled: !!searchParams.get('q')
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Namespace': return <Box className="w-5 h-5 text-purple-500" />;
      case 'Deployment': return <Component className="w-5 h-5 text-orange-500" />;
      case 'Service': return <Network className="w-5 h-5 text-pink-500" />;
      case 'Pod': return <Cuboid className="w-5 h-5 text-green-500" />;
      case 'Node': return <Server className="w-5 h-5 text-blue-500" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Global Search</h2>
        <p className="text-muted-foreground">Search across all resources in your cluster.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="w-full h-14 bg-card border border-border rounded-lg pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90">
          Search
        </button>
      </form>

      {searchParams.get('q') && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Searching cluster...</p>
                </div>
              </div>
            ) : results?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No resources found matching "{searchParams.get('q')}"</p>
                <p className="text-sm">Try using different keywords</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {results?.map((item: any, i: number) => (
                  <li key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-md border border-border">
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{item.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                            {item.type}
                          </span>
                        </div>
                        {item.namespace && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Namespace: <span className="font-medium text-foreground">{item.namespace}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
