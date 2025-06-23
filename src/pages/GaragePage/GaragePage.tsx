// src/pages/GaragePage/GaragePage.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchCars, recalculatePixelPositionsOnResize } from '../../store/garage/actions';
import { selectCars, selectCurrentPage, selectTotalCars } from '../../store/garage/selectors';
import { CARS_PER_PAGE } from '../../utils/constants';
import { setCurrentPage, setFetchedCarsWithPersistence } from '../../store/garage/reducer';

import RaceControlPanel from '../../components/RaceControlPanel/RaceControlPanel';
import CarTrack from '../../components/CarTrack/CarTrack';
import CarEditor from '../../components/CarEditor/CarEditor';
import Button from '../../components/Button/Button';
import styles from './GaragePage.module.scss';
import type { CarType } from '../../store/garage/types';
import { useTrackResizeObserver } from '../../hooks/useTrackResizeObserver';

export function GaragePage() {
  const dispatch = useAppDispatch();
  const cars = useAppSelector(selectCars);
  const total = useAppSelector(selectTotalCars);
  const page = useAppSelector(selectCurrentPage);
  const raceInProgress = useAppSelector(state => state.garage.raceState.status === 'starting');
  const navigate = useNavigate();
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(800);
  const wasRestored = useRef(false);

  // Track width observer
  useEffect(() => {
    const el = trackContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setTrackWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleResizeDone = useCallback(
    (newWidth: number, oldWidth: number) => {
      if (raceInProgress) return;
      dispatch(recalculatePixelPositionsOnResize(oldWidth, newWidth));
    },
    [dispatch]
  );

  useTrackResizeObserver<HTMLDivElement>(trackContainerRef, handleResizeDone, 300);

  // Load saved page on mount
  useEffect(() => {
    const savedPage = Number(localStorage.getItem('garageCurrentPage'));
    if (!isNaN(savedPage) && savedPage > 0 && savedPage !== page) {
      dispatch(setCurrentPage(savedPage));
    }
  }, [dispatch]);

  // Save current page number
  useEffect(() => {
    localStorage.setItem('garageCurrentPage', String(page));
  }, [page]);

  // Fetch cars + restore state from localStorage
  useEffect(() => {
    if (trackWidth <= 0) return;

    const pageKey = `carPositions_page_${page}`;
    const persistedCars = JSON.parse(localStorage.getItem(pageKey) || '[]');

    dispatch(fetchCars({ page })).then(res => {
      const data = res.payload as { cars: CarType[]; totalCount: number };

      const merged = data.cars.map(car => {
        const persisted = persistedCars.find((p: CarType) => p.id === car.id);
        return {
          ...car,
          positionX: persisted?.positionX ?? 0,
          status:
            persisted?.status?.status === 'drive'
              ? { status: 'stopped', position: persisted?.status?.position ?? 0 }
              : (persisted?.status ?? { status: 'stopped', position: 0 }),
        };
      });

      wasRestored.current = true;
      dispatch(setFetchedCarsWithPersistence(merged));
    });
  }, [dispatch, page, trackWidth]);

  // Save car state on change
  useEffect(() => {
    const pageKey = `carPositions_page_${page}`;
    if (wasRestored.current && cars.length > 0) {
      localStorage.setItem(pageKey, JSON.stringify(cars));
    }
  }, [cars, page]);

  const handlePrevPage = () => {
    if (page > 1) dispatch(setCurrentPage(page - 1));
  };

  const handleNextPage = () => {
    if (page * CARS_PER_PAGE < total) dispatch(setCurrentPage(page + 1));
  };

  return (
    <div className={styles.garagePage}>
      <div className={styles.title}>Garage</div>

      <Button
        text="Winners"
        onClick={() => navigate('/winners')}
        className={styles.winnersButton}
        textClassName="text--lowered"
        disabled={raceInProgress}
      />

      <RaceControlPanel paginatedCars={cars} trackWidth={trackWidth} />
      <CarEditor mode="create" />

      <div ref={trackContainerRef} className={styles.trackContainer}>
        <ul className={styles.trackList}>
          {cars.map(car => (
            <CarTrack key={`${car.id}-${trackWidth}`} car={car} trackWidth={trackWidth} />
          ))}
        </ul>
      </div>

      <div className={styles.pagination}>
        <Button text="Prev" onClick={() => handlePrevPage()} disabled={page === 1} />
        <span> {page} </span>
        <Button
          text="Next"
          onClick={() => handleNextPage()}
          disabled={page * CARS_PER_PAGE >= total}
        />
      </div>
    </div>
  );
}
