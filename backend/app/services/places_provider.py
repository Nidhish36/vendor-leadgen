from abc import ABC, abstractmethod
from typing import List, Dict


class PlacesProvider(ABC):
    @abstractmethod
    async def search_places(self, keyword: str, location: str) -> List[Dict]:
        pass