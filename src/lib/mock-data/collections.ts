import { Collection } from "@/types/store";
import { getAllCollections, getCollectionByHandle } from "@/server/db/collections";

export const MOCK_COLLECTIONS: Collection[] = getAllCollections();

export { getAllCollections, getCollectionByHandle };
