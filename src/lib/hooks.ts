import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// To prevent importing RootState and AppDispatch types into each component
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
