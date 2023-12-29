import { create } from 'zustand';
import { db } from '../config/firebaseConfig';
import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from 'firebase/firestore';

const useSearchStore = create((set) => ({
  searchResults: [],
  loading: false,
  error: null,
  searchKeyword: '',

  setSearchResults: (results) => set({ searchResults: results }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));

export const useFirebaseSearch = () => {
  const {
    searchResults,
    loading,
    error,
    setSearchResults,
    setLoading,
    setError,
    setSearchKeyword,
  } = useSearchStore();

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = debounce(async (keyword) => {
    try {
      setLoading(true);

      const userRef = collection(db, 'users');
      const userQuery = query(
        userRef,
        orderBy('displayName'),
        startAt(keyword),
        endAt(keyword + '\uf8ff'),
        limit(20)
      );

      // Execute the query
      const querySnapshot = await getDocs(userQuery);

      // Extract the documents
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(users);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = (event) => {
    const keyword = event.target.value;

    setSearchKeyword(keyword);
    performSearch(keyword);
  };

  return {
    searchResults,
    loading,
    error,
    handleSearch,
  };
};
